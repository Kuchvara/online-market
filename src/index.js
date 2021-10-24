'use strict';
import 'regenerator-runtime/runtime';

import './styles/pages/main.scss';

import './js/components/back-to-top';
import './js/components/timer';
import './js/components/burger';
import './js/components/slider';
import './js/components/cart';
import './js/components/footerMailValidation';

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
  
  urlData.requiredName = searchName

  localStorage.setItem('urlData', JSON.stringify(urlData))
  window.location.href = './categories.html';
})