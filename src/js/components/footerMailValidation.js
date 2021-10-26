const email = document.querySelector('.footer-input')

email.addEventListener("input", function () { 
  if (!email.validity.patternMismatch && email.value.length > 0) {
    email.setCustomValidity("");    
  } else {
    email.setCustomValidity("e-mail address is not valid");
  }
});