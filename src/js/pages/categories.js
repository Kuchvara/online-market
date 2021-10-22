'use strict';
import 'regenerator-runtime/runtime';
import '../../styles/pages/categories.scss';
import '../components/burger';
import '../components/back-to-top';
import '../components/cart';
import '../components/footerMailValidation';

import request from '../request';
import productTpl from '../../templates/product.hbs';

const root = document.querySelector('.product-list');
const total = document.querySelector('.product-content-total');
const coutner = document.querySelector('.product-content-coutner');
const prices = document.querySelectorAll('#price');
const categories = document.querySelector('#categories');
const manufacturer = document.querySelector('#manufacturer');
const manufacturerInput = document.querySelector('#manufacturerName')

let pricesArr = []
let minPrice
let maxPrice
let manufacturerName

// categoria filter
categories.addEventListener('click', (e) => {  
  const id = e.target.id  
  
  const urlData = {
    id: id
  }  

  localStorage.setItem('urlData', JSON.stringify(urlData))
  
  init()
  location.reload()
})

// price filter
prices.forEach(el => el.addEventListener('click', (e) => {  
  let min = Math.min(...e.target.dataset.value.split(' '))
  let max = Math.max(...e.target.dataset.value.split(' '))

  if (pricesArr.includes(min) && pricesArr.includes(max)) {    
    pricesArr = pricesArr.filter(el => el !== min)
    pricesArr = pricesArr.filter(el => el !== max)    
  } else {    
    pricesArr.push(min)
    pricesArr.push(max)    
  }

  if (pricesArr.length > 0) {
    minPrice = Math.min(...pricesArr)
    maxPrice = Math.max(...pricesArr)    
  } else {
    minPrice = undefined
    maxPrice = undefined
  }
  
  init()
}))

// manufacturer filter
manufacturer.addEventListener('submit', e => {
  e.preventDefault()

  manufacturerName = manufacturerInput.value;

  init()

  manufacturerInput.value = ''
})

// functions
let getUrl = function () {
  let baseUrl = 'http://localhost:3030/products?$limit=20'
  const urlData = JSON.parse(localStorage.getItem('urlData'))
  let url

  if (urlData.id) {
    url = `${baseUrl}&category.id=${urlData.id}`
  }
  
  if (manufacturerName) {
    url = url + `&manufacturer=${manufacturerName}`
  }

  if (minPrice) {
    url = url + `&price[$gt]=${minPrice}&price[$lte]=${maxPrice}`
  }

  if (skip) {
    url = url + `&$skip=${skip}`    
  }
  
  return url
}

const init = function () {
  getUrl();
  root.innerHTML = '';
  request(getUrl(), root, productTpl, total)
}

// pagination
const first = document.querySelector('#first')
const middle = document.querySelector('#middle')
const last = document.querySelector('#last')
const pagination = document.querySelector('.pagination')
const paginationItems = document.querySelectorAll('.pagination-item')

let skip
let currentPage = 1

pagination.addEventListener('click', (e) => {
  if (Number(e.target.textContent)) {
    currentPage = Number(e.target.textContent);
  }

  if (e.target.classList.contains('pagination-item')) {
    paginationItems.forEach(el => el.classList.remove('active'));
    e.target.classList.add('active');
  }

  if (e.target.classList.contains('arrRight') && currentPage < Number(total.textContent) / 20) {
    paginationItems.forEach(el => el.classList.remove('active'));
    first.classList.add('active');
    first.textContent = Number(first.textContent) + 3;
    middle.textContent = Number(middle.textContent) + 3;
    last.textContent = Number(last.textContent) + 3;    
    currentPage = first.textContent;
  }

  if (e.target.classList.contains('arrLeft') && currentPage > 3) {
    paginationItems.forEach(el => el.classList.remove('active'));
    last.classList.add('active');
    first.textContent = Number(first.textContent) - 3;
    middle.textContent = Number(middle.textContent) - 3;
    last.textContent = Number(last.textContent) - 3;    
    currentPage = last.textContent;
  }

  skip = currentPage * 20 - 20;
  
  if (skip) {
    coutner.textContent = skip + 20
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
  init()  
})

window.addEventListener('DOMContentLoaded', init())