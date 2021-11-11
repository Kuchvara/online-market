'use strict';
import 'regenerator-runtime/runtime';

import '../../styles/pages/checkout.scss';

import '../components/burger';
import '../components/back-to-top';
import '../utils/jquery.mask.js';
import '../components/cart';
import '../components/footerMailValidation';
import '../utils/validation';
import '../components/initMap';
import checkoutItem from '../../templates/checkoutItem.hbs';
import {displayCartTotal} from '../components/cart';

// render cart items
const storage = JSON.parse(localStorage.getItem('storage'))
const cartRoot = document.querySelector('.cart-review')
storage.forEach(el => {
  const markup = checkoutItem(el)
  cartRoot.insertAdjacentHTML('beforeend', markup)
})

// set initial orders
let orders = JSON.parse(localStorage.getItem('orders')) ?
    JSON.parse(localStorage.getItem('orders')) :
    localStorage.setItem('orders', '[]')


// set total value
const totalValue = document.querySelector('.total-value')
displayCartTotal(totalValue).toFixed(2)

// delivery method
const paiment = {
  value: displayCartTotal(totalValue).toFixed(2)
}
const deliveryHome = document.querySelector('.delivery-home')
const deliveryShop = document.getElementById('shop-box')
const deliveryPost = document.getElementById('post-box')
deliveryHome.hidden = true
deliveryShop.hidden = true
deliveryPost.hidden = true

const changeHandle = (e) => {  
  totalValue.textContent = (displayCartTotal(totalValue) + Number(e.target.value)).toFixed(2)
  paiment.value = totalValue.textContent
  paiment.deliveryMethod = e.target.id
  localStorage.setItem('deliveryAddress', '[]')
  const postInput = document.querySelector('#post-input')
  const shopInput = document.querySelector('#shop-input')
  const shopName = document.querySelector('.shop-name')
  const shopAddress = document.querySelector('.shop-address')
  const shopCity = document.querySelector('.shop-city')
  const postCity = document.querySelector('.post-city')
  const postName = document.querySelector('.post-name')
  const postAddress = document.querySelector('.post-address')
  postCity.textContent = ''
  postName.textContent = ''
  postAddress.textContent = ''
  shopName.textContent = ''
  shopAddress.textContent = ''
  shopCity.textContent = ''
  postInput.value = ''
  shopInput.value = ''
}

const bringToYou = document.querySelector('#home')
bringToYou.addEventListener('change', (e) => {
  deliveryHome.hidden = false;
  deliveryShop.hidden = true;
  deliveryPost.hidden = true;  
  changeHandle(e)
})

const takeFromShop = document.querySelector('#shop')
takeFromShop.addEventListener('change', (e) => {
  deliveryHome.hidden = true
  deliveryShop.hidden = false
  deliveryPost.hidden = true  
  changeHandle(e)
})

const takeFromPost = document.querySelector('#post')
takeFromPost.addEventListener('change', (e) => {
  deliveryHome.hidden = true
  deliveryShop.hidden = true
  deliveryPost.hidden = false  
  changeHandle(e)
})

// form data
const form = document.querySelector('#paymentData')
let deliveryAddress = JSON.parse(localStorage.getItem('deliveryAddress'))

form.onsubmit = (e) => {
  e.preventDefault()

  let data = new FormData(form)

  const cartData = JSON.parse(localStorage.getItem('storage'))  

  let object = {
    castumerData: {},
    cartData: cartData    
  };
  
  data.forEach((value, key) => object.castumerData[key] = value)  
  
  if (deliveryAddress.length > 0) {
    paiment.deliveryAddress = deliveryAddress
  } else {
    paiment.deliveryAddress = {
      address: object.castumerData.address,
      contact: object.castumerData.phone,
      zipCode: object.castumerData.zipCode,
      city: object.castumerData.city,
      state: object.castumerData.state
    }
  }
  paiment.method = object.castumerData.paymentMethod  
  
  object.paimentData = paiment
  orders.push(object)
  console.log(orders);
  
  localStorage.setItem('orders', JSON.stringify(orders))
  window.location.href = './complete.html'
}

//  mask
const contact = document.querySelector('#contact')
const card = document.querySelector('#card')
const cvv = document.querySelector('#cvv')
const zipCode = document.querySelector('#zipCode')
const year = document.querySelector('#year')
const month = document.querySelector('#month')

$(document).ready(function () {
  $(year).mask('00');
  $(month).mask('00');
  $(cvv).mask('000');
  $(zipCode).mask('00000');
  $(card).mask('0000-0000-0000-0000');
  $(contact).mask('+380000000000');
});

function correctPrice() {
  const pricesToCorrect = document.querySelectorAll('.products-item-price')
  pricesToCorrect.forEach(el => {    
    el.textContent = `${Number.parseFloat(el.textContent).toFixed(2)}$`
  })
}
document.addEventListener('load', correctPrice())