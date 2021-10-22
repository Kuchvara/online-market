'use strict';
import 'regenerator-runtime/runtime';

import './styles/pages/main.scss';

import './js/components/back-to-top';
import './js/components/timer';
import './js/components/burger';
import './js/components/slider';
import './js/components/cart';
import './js/components/footerMailValidation';

const links = document.querySelector('#categories')

links.addEventListener('click', (e) => {  
  const id = e.target.id
  
  const urlData = {
    id: id
  }  

  localStorage.setItem('urlData', JSON.stringify(urlData))
  window.location.href = './categories.html';
})