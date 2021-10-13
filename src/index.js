'use strict';

import './styles/main.scss';

import './js/back-to-top';
import './js/timer';
import './js/burger';
import './js/slider';
import './js/cart';

// footer validation

const email = document.querySelector('.footer-input')

email.addEventListener("input", function () { 
  if (!email.validity.patternMismatch && email.value.length > 0) {
    email.setCustomValidity("");    
  } else {
    email.setCustomValidity("e-mail address is not valid");
  }
});