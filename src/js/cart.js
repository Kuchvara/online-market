const shortid = require('shortid');

const refs = {
  mainCartBtn: document.querySelector('#main-cart-btn'),  
  productBtn: document.querySelectorAll('#product-cart-btn'),
  cartOverlay: document.querySelector('.overlay'),
  cartCloseBtn: document.querySelector('.cart-close-btn'),
  cartItems: document.querySelector('.cart-items'),
  totalPrice: document.querySelector('.cart-price'),
  totalAmount: document.querySelector('.cart-counter')   
}

//  seting initial storage

let storage = JSON.parse(localStorage.getItem('storage')) ? JSON.parse(localStorage.getItem('storage')) : localStorage.setItem('storage', '[]')

// toggle cart

const openCart = function () {
  refs.cartOverlay.classList.add('show');  
}

const closeCart = function () {
  refs.cartOverlay.classList.remove('show');
}

refs.mainCartBtn.addEventListener('click', () => openCart());
refs.cartCloseBtn.addEventListener('click', () => closeCart());
refs.cartOverlay.addEventListener('click', (event) => {
  if (event.target === event.currentTarget) {
    closeCart()
  }
})

// add item

const addToCart = (item) => {
  const article = document.createElement('article');
  article.classList.add('cart-item');
  article.setAttribute('id', item.id);
  article.innerHTML = `
    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
		<h4 class="cart-item-name">${item.name}</h4>
		<span class="cart-item-price">${item.price}</span>
		<div class="cart-amount-box">
			<button type="button" class="cart-increase-amount-btn">+</button>
			<span class="cart-item-amount">${item.amount}</span>
			<button type="button" class="cart-decrease-amount-btn">-</button>
		</div>
		<button type="button" class="cart-remove-item">
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
				<path
					d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z">
				</path>
			</svg>
		</button>`;
  refs.cartItems.appendChild(article);
};

refs.productBtn.forEach(btn => btn.addEventListener('click', (e) => {  
  const startPoint = e.currentTarget.parentElement.previousElementSibling;

  const item = {
    id: shortid.generate(),
    price: Number.parseInt(startPoint.textContent),
    name: startPoint.previousElementSibling.textContent,
    image: startPoint.previousElementSibling.previousElementSibling.attributes.src.nodeValue,
    amount: 1
  }

  const newStorage = storage = JSON.parse(localStorage.getItem('storage'))  
  const sameElement = newStorage.find(el => el.name === item.name)  
  
  if (sameElement) {
    const newAmount = sameElement.amount += 1;
    const id = sameElement.id
    refs.cartItems.querySelector(`#${id}`).querySelector('.cart-item-amount').textContent = newAmount;
    
    const newProduct = { ...sameElement, amount: newAmount }      
    const newStorage = storage.filter(el => el.id !== id)
    newStorage.push(newProduct)
    localStorage.setItem('storage', JSON.stringify(newStorage))
  } else {
    storage.push(item);
    localStorage.setItem('storage', JSON.stringify(storage));
    addToCart(item);
  }  

  displayCartItemCount()
  displayCartTotal()
  openCart()
}))

if (storage) { storage.map(el => addToCart(el)) }

function displayCartItemCount() {
  const newStorage = JSON.parse(localStorage.getItem('storage'))
  const amount = newStorage.reduce((total, cartItem) => {
    return (total += cartItem.amount);
  }, 0);
  refs.totalAmount.textContent = amount;  
}

function displayCartTotal() {
  const newStorage = JSON.parse(localStorage.getItem('storage'))
  let total = newStorage.reduce((total, cartItem) => {
    return (total += cartItem.price * cartItem.amount);
  }, 0);
  refs.totalPrice.textContent = `Total: ${total} $`;
}

function removeItem(id) {  
  const newStorage = JSON.stringify(storage.filter((el) => el.id !== id));
  localStorage.removeItem(storage);
  localStorage.setItem('storage', newStorage)  

  displayCartItemCount()
  displayCartTotal()
}

const findProduct = (id) => {
  const store = JSON.parse(localStorage.getItem('storage'));
  let product = store.find((product) => product.id === id);  
  return product;
};

function setupCartFunctionality() {
  refs.cartItems.addEventListener('click', function (e) {
    const element = e.target;    
    const parent = element.parentElement;    
    const parentID = element.parentElement.id;
    
    // remove
    if (element.classList.contains('cart-remove-item')) {
      removeItem(parentID);
      parent.remove();
    }
    // increase
    if (element.classList.contains('cart-increase-amount-btn')) {
      const id = element.parentElement.parentElement.id
      const newAmount = Number(element.nextElementSibling.textContent) + 1;

      element.nextElementSibling.textContent = newAmount
      const product = findProduct(id)
      const newProduct = { ...product, amount: newAmount }      
      const newStorage = storage.filter(el => el.id !== id)
      newStorage.push(newProduct)
      localStorage.setItem('storage', JSON.stringify(newStorage))      
    }
    // decrease
    if (element.classList.contains('cart-decrease-amount-btn')) {
      const id = element.parentElement.parentElement.id      
      const newAmount = Number(element.previousElementSibling.textContent) - 1;
      
      if (newAmount === 0) {
        removeItem(id);
        element.parentElement.parentElement.remove();
      } else {
        element.previousElementSibling.textContent = newAmount;
        const product = findProduct(id)
        const newProduct = { ...product, amount: newAmount }      
        const newStorage = storage.filter(el => el.id !== id)
        newStorage.push(newProduct)
        localStorage.setItem('storage', JSON.stringify(newStorage))
      }
    }
    displayCartItemCount();
    displayCartTotal();    
  });
}

const init = () => {
  // display amount of cart items
  displayCartItemCount();
  // display total
  displayCartTotal();  
  // setup cart functionality
  setupCartFunctionality();  
};

init();