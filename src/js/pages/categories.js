'use strict';
import 'regenerator-runtime/runtime';
import '../../styles/pages/categories.scss';
import '../components/burger';
import '../components/back-to-top';
import '../components/cart';
import '../components/footerMailValidation';
import {cartFunc} from '../components/cart';
import request from '../request';
import productTpl from '../../templates/product.hbs';
import doPaginate from '../components/pagination';

const root = document.querySelector('.product-list');
const manufacturersRoot = document.querySelector('#manufacturers');
const total = document.querySelector('.product-content-total');
const prices = document.querySelectorAll('#price');
const categories = document.querySelector('#categories');

let pricesArr = []
let minPrice
let maxPrice
let manufacturerName
let searchName
let sortBy

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
const getManufacturers = function () {
  const categoriaId = JSON.parse(localStorage.getItem('urlData')).id
  const url = `http://localhost:3030/products?$limit=999&category.id=${categoriaId}&$select[]=manufacturer`;
  

  const dataProcessing = (data) => {
    let manufacturersArr = []

    data.data.forEach(el => {      
      if (!manufacturersArr.includes(el.manufacturer)) {
        manufacturersArr.push(el.manufacturer)
      }      
    })
    
    manufacturersArr.forEach(el => {
    const markup = `<li class="filter-item" id="manufacturer-item">${el}</li>`    
    manufacturersRoot.insertAdjacentHTML('beforeend', markup);
    })

    const manufacturers = document.querySelectorAll('#manufacturer-item')
    manufacturers.forEach(el => {
      el.addEventListener('click', e => {        
        manufacturerName = e.target.textContent;        
        skip = doPaginate(e, true)
        init()
      })
    })  
  }  
  
  request(url, dataProcessing)
}

// pagination
const paginationItems = document.querySelectorAll('.pagination-item')

let skip

paginationItems.forEach(el => el.addEventListener('click', (e) => {
  skip = doPaginate(e)
  init()
}))

// search
const search = document.querySelector('#search-form');
const searchData = document.querySelector('.header-input');

search.addEventListener('submit', e => {
  e.preventDefault()
  searchName = searchData.value.split(' ').join('+');
  searchData.value = '';

  init()
})

// sort
const sort = document.querySelector('#sort-select')

sort.addEventListener('change', e => {
  sortBy = e.target.value
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

  if (sortBy) {
    url = url + sortBy
  }

  if (skip) {
    url = url + `&$skip=${skip}`    
  }
  
  return url
}

const makeMarkup = function (data) {
  data.data.forEach(el => {
    const markup = productTpl(el);
    root.insertAdjacentHTML('beforeend', markup);
  })
  const cartBtns = document.querySelectorAll('#product-cart-btn')  
  cartBtns.forEach(el => {
    el.addEventListener('click', e => cartFunc(e))
  })
  linkHandler()
}

const init = function () {  
  root.innerHTML = '';
  request(getUrl(), makeMarkup, total)
}

// product link handler
const linkHandler = function () {
  const productLinks = document.querySelectorAll('.product-link')
  productLinks.forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault()      
      localStorage.setItem('productId', e.currentTarget.id)
      window.location.href = './product.html';
    })
  })
}

getManufacturers()
init()