'use strict';
import 'regenerator-runtime/runtime';
import './styles/pages/main.scss';
import './js/components/back-to-top';
import './js/components/timer';
import './js/components/burger';
import './js/components/slider';
import './js/components/cart';
import './js/components/footerMailValidation';
import { cartFunc } from './js/components/cart';
import request from './js/request';
import featuredItemTpl from './templates/featuredItem.hbs';
import newArrivalTpl from './templates/newArrivalTpl.hbs';

// move to categoria page
const links = document.querySelector('#categories')

let urlData = {}

links.addEventListener('click', (e) => {
  const id = e.target.id
  
  urlData.id = id  

  localStorage.setItem('urlData', JSON.stringify(urlData))
  window.location.href = './categories.html';
})

// search
const search = document.querySelector('#search-form');
const searchData = document.querySelector('.header-input');

search.addEventListener('submit', e => {
  e.preventDefault()
  let searchName = searchData.value.split(' ').join('+');
  searchData.value = '';
  
  urlData.requiredName = searchName

  localStorage.setItem('urlData', JSON.stringify(urlData))
  window.location.href = './categories.html';
})

// dynamic render

// featured
const featuredRoot = document.querySelector('.featured-list')
const featuredUrl = 'http://localhost:3030/products?$limit=8&category.id=abcat0101000'

const featuredMarkup = function (data) {
  data.data.forEach(el => {
    const markup = featuredItemTpl(el);
    featuredRoot.insertAdjacentHTML('beforeend', markup);    
  })
  const cartBtns = featuredRoot.querySelectorAll('#product-cart-btn')  
  cartBtns.forEach(el => {
    el.addEventListener('click', e => cartFunc(e))
  })
  linkHandler()  
}

request(featuredUrl, featuredMarkup)

// new arrivel
const newArrivalRoot = document.querySelector('.arrival-list')
const newArrivalUrl = 'http://localhost:3030/products?$limit=4&category.id=abcat0101000&$sort[updatedAt]=-1';

const newArrivalMarkup = function (data) {
  data.data.forEach(el => {
    const markup = newArrivalTpl(el);
    newArrivalRoot.insertAdjacentHTML('beforeend', markup);
  })
  const cartBtns = newArrivalRoot.querySelectorAll('#product-cart-btn')  
  cartBtns.forEach(el => {
    el.addEventListener('click', e => cartFunc(e))
  })
  linkHandler()
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

request(newArrivalUrl, newArrivalMarkup)

// set coupons
const coupons = [
  {
    code: 'discount10',
    value: 0.9
  },
  {
    code: 'discount20',
    value: 0.8
  },
  {
    code: 'discount30',
    value: 0.7
  }
]

localStorage.setItem('coupons', JSON.stringify(coupons))

// set initial empty stock
const currentStock = () => {
  const stock = JSON.parse(localStorage.getItem('stock')) ?
    JSON.parse(localStorage.getItem('stock')) :
    localStorage.setItem('stock', JSON.stringify([]))
  return stock
}

currentStock()