'use strict';
import 'regenerator-runtime/runtime';

import '../../styles/pages/checkout.scss';

import '../components/burger';
import '../components/back-to-top';
import '../utils/jquery.mask.js';
import '../components/cart';
import '../components/footerMailValidation';
import '../utils/validation';
import checkoutItem from '../../templates/checkoutItem.hbs';

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

// form data
const form = document.querySelector('#paymentData')

form.onsubmit = (e) => {
  e.preventDefault()

  let data = new FormData(form)

  const cartData = JSON.parse(localStorage.getItem('storage'))

  let object = {
    castumerData: {},
    cartData: cartData
  };
  data.forEach((value, key) => object.castumerData[key] = value)
  console.log(object);

  // ordersStorage().push(object)
  // window.location.href = './complete.html'
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