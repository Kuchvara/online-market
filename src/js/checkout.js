import './burger';
import './back-to-top';
import './jquery.mask';

import '../styles/main.scss';

const email = document.querySelector('.footer-input')
const fullName = document.querySelector('#name')
const contact = document.querySelector('#contact')
const cardName = document.querySelector('#cardName')
const card = document.querySelector('#card')
const cvv = document.querySelector('#cvv')
const zipCode = document.querySelector('#zipCode')
const year = document.querySelector('#year')
const month = document.querySelector('#month')

email.addEventListener("input", function () { 
  if (!email.validity.patternMismatch && email.value.length > 0) {
    email.setCustomValidity("");    
  } else {
    email.setCustomValidity("e-mail address is not valid");
  }
});

fullName.addEventListener("input", function () {  
  if (fullName.validity.patternMismatch) {
    fullName.setCustomValidity("The name can only consist of letters, apostrophe, dash and spaces");        
  } else {
    fullName.setCustomValidity("");
  }
});

contact.addEventListener("input", function () {  
  if (contact.validity.patternMismatch) {
    contact.setCustomValidity("phone number should be 11-12 digits long and can contain numbers, spaces, dashes, pot-bellied brackets and can start with +");
  } else {
    contact.setCustomValidity("");
  }
});

cardName.addEventListener("input", function () {  
  if (cardName.validity.patternMismatch) {
    cardName.setCustomValidity("The name can only consist of letters, apostrophe, dash and spaces");        
  } else {
    cardName.setCustomValidity("");
  }
});

card.addEventListener("input", function () {  
  if (card.value.length !== 19) {    
    card.setCustomValidity("number should be 16 signs length");        
  } else {
    card.setCustomValidity("");
  }
});

cvv.addEventListener("input", function () {  
  if (cvv.value.length !== 3) {
    cvv.setCustomValidity("cvv number should be 3 signs length");        
  } else {
    cvv.setCustomValidity("");
  }
});

zipCode.addEventListener("input", function () {  
  if (zipCode.value.length !== 5) {
    zipCode.setCustomValidity("zip code should be 5 signs length");        
  } else {
    zipCode.setCustomValidity("");
  }
});

year.addEventListener("input", function () {
  console.log(year.value.length !== 2 && Number(year.value) >= 21);
  if (year.value.length === 2 && Number(year.value) >= 21) {
    year.setCustomValidity("");      
  } else {
    year.setCustomValidity("unvalid year");    
  }
});

month.addEventListener("input", function () {  
  if (month.value.length === 2 && Number(month.value) >= 0 && Number(month.value) <= 12) {
    month.setCustomValidity("");            
  } else { 
    month.setCustomValidity("unvalid month");
  }
});

// ============= mask

$(document).ready(function () {
  $(year).mask('00');
  $(month).mask('00');
  $(cvv).mask('000');
  $(zipCode).mask('00000');
  $(card).mask('0000-0000-0000-0000');
  $(contact).mask('+380000000000');
});