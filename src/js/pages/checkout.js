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
const ordersStorage = () => {
  const orders = JSON.parse(localStorage.getItem('orders')) ?
    JSON.parse(localStorage.getItem('orders')) :
    localStorage.setItem('orders', JSON.stringify([]))
  return orders
}

ordersStorage()

// set total value
const totalValue = document.querySelector('.total-value')
displayCartTotal(totalValue)

// delivery method
const paiment = {
  value: displayCartTotal(totalValue)
}
const deliveryHome = document.querySelector('.delivery-home')
const deliveryShop = document.getElementById('shop-box')
const deliveryPost = document.getElementById('post-box')
deliveryHome.hidden = true
deliveryShop.hidden = true
deliveryPost.hidden = true

const changeHandle = (e) => {  
  totalValue.textContent = displayCartTotal(totalValue) + Number(e.target.value)
  paiment.value = totalValue.textContent
  paiment.delivery = e.target.id
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

form.onsubmit = (e) => {
  e.preventDefault()

  let data = new FormData(form)

  const cartData = JSON.parse(localStorage.getItem('storage'))

  let object = {
    castumerData: {},
    cartData: cartData,
    paimentData: paiment
  };
  data.forEach((value, key) => object.castumerData[key] = value)
  
  const orderData = ordersStorage().push(object)
  localStorage.setItem('order', JSON.stringify(orderData))
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