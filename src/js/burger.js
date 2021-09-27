refs = {
  menu: document.querySelector('#burger-menu'),
  button: document.querySelector('.burger-menu_button', '.burger-menu_lines'),  
  overlay: document.querySelector('.burger-menu_overlay')
}

const toggleMenu = function() {
  const element = refs.menu;

  if (element.classList.contains('burger-menu')) {
    element.classList.replace('burger-menu', 'burger-menu_active')
  } else {
    element.classList.replace('burger-menu_active', 'burger-menu')
  }  
}

refs.button.addEventListener('click', (e) => {
  e.preventDefault();
  toggleMenu();
});

refs.overlay.addEventListener('click', (e) => {
  e.preventDefault();
  toggleMenu();
});