'use strict';
import 'regenerator-runtime/runtime';
import '../../styles/pages/categories.scss';
import '../components/burger';
import '../components/back-to-top';
import '../components/cart';
import '../components/footerMailValidation';
import request from '../request';
import productTpl from '../../templates/product.hbs';
import doPaginate from '../components/pagination';

const root = document.querySelector('.product-list');
const total = document.querySelector('.product-content-total');
const prices = document.querySelectorAll('#price');
const categories = document.querySelector('#categories');
const manufacturer = document.querySelector('#manufacturer');
const manufacturerInput = document.querySelector('#manufacturerName');

let pricesArr = []
let minPrice
let maxPrice
let manufacturerName
let searchName

// categoria filter
categories.addEventListener('click', (e) => {  
  const id = e.target.id  
  
  const urlData = {
    id: id
  }  

  localStorage.setItem('urlData', JSON.stringify(urlData))
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
  doPaginate(e, true)  

  manufacturerInput.value = ''
  init()
})

// pagination
const pagination = document.querySelector('.pagination')

let skip

pagination.addEventListener('click', (e) => {
  skip = doPaginate(e)
  init()
})

// search
const search = document.querySelector('#search-form');
const searchData = document.querySelector('.header-input');

search.addEventListener('submit', e => {
  e.preventDefault()
  searchName = searchData.value.split(' ').join('+');
  searchData.value = '';

  init()
})

// functions
let getUrl = function () {
  let url = 'http://localhost:3030/products?$limit=20'
  const urlData = JSON.parse(localStorage.getItem('urlData'))  

  if (urlData.id) {
    url = url + `&category.id=${urlData.id}`
  }
  
  if (manufacturerName) {
    url = url + `&manufacturer=${manufacturerName}`
  }

  if (minPrice) {
    url = url + `&price[$gt]=${minPrice}&price[$lte]=${maxPrice}`
  }

  if (urlData.requiredName) {
    url = url + `&name[$like]=*${urlData.requiredName}*`
  }

  if (searchName) {
    url = url + `&name[$like]=*${searchName}*`
  }

  if (skip) {
    url = url + `&$skip=${skip}`    
  }
  
  return url
}

const init = function () {  
  root.innerHTML = '';
  request(getUrl(), root, productTpl, total)
}

window.addEventListener('DOMContentLoaded', init())