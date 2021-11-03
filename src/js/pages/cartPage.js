'use strict';
import 'regenerator-runtime/runtime';

import '../../styles/pages/cartPage.scss';

import '../components/burger';
import '../components/back-to-top';
import '../components/cart';
import '../components/footerMailValidation';
import cartPageItem from '../../templates/cartPageItem.hbs';

const cartListRoot = document.querySelector('.cart-products-list')

let storage = JSON.parse(localStorage.getItem('storage')) ? JSON.parse(localStorage.getItem('storage')) : localStorage.setItem('storage', '[]')

storage.forEach(item => {
  const markup = cartPageItem(item)
  cartListRoot.insertAdjacentHTML('beforeend', markup)
});