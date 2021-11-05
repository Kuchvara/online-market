const shortid = require('shortid');

const refs = {
  mainCartBtn: document.querySelector('#main-cart-btn'),  
  productBtn: document.querySelectorAll('#product-cart-btn'),
  cartOverlay: document.querySelector('.overlay'),
  cartCloseBtn: document.querySelector('.cart-close-btn'),
  cartItems: document.querySelector('.cart-items'),
  totalPrice: document.querySelector('.cart-price'),
  totalAmount: document.querySelector('.cart-counter'),  
}

//  setting initial storage

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

// functions
const totalTextRoot = refs.totalPrice

function displayCartItemCount() {
  const newStorage = JSON.parse(localStorage.getItem('storage'))
  const amount = newStorage.reduce((total, cartItem) => {
    return (total += cartItem.amount);
  }, 0);
  refs.totalAmount.textContent = amount;  
}

function displayCartTotal(totalTextRoot) {
  const newStorage = JSON.parse(localStorage.getItem('storage'))
  let total = newStorage.reduce((total, cartItem) => {
    return (total += cartItem.price * cartItem.amount);
  }, 0);
  totalTextRoot.textContent = `Total: ${total.toPrecision(6)} $`;
  return total
}

function removeItem(id) {
  const currentStorage = JSON.parse(localStorage.getItem('storage'))
  const newStorage = JSON.stringify(currentStorage.filter((el) => el.id !== id));  
  localStorage.setItem('storage', newStorage)  
  
  displayCartItemCount()
  displayCartTotal(totalTextRoot)
}

const findProduct = (id) => {
  const store = JSON.parse(localStorage.getItem('storage'));
  let product = store.find((product) => product.id === id);  
  return product;
};

const addToCart = (item) => {
  const article = document.createElement('article');
  article.classList.add('cart-item');
  article.setAttribute('id', item.id);
  article.innerHTML = `
    <img class="cart-item-image" src="${item.image}" alt="${item.name}">
		<h4 class="cart-item-name">${item.name}</h4>
		<span class="cart-item-price">${item.price}</span>
		<div class="cart-amount-box">
			<button type="button" class="cart-increase-amount-btn">+</button>
			<span class="cart-item-amount">${item.amount}</span>
			<button type="button" class="cart-decrease-amount-btn">-</button>
		</div>
		<button type="button" class="cart-remove-item">
			<span class="cart-remove-item_lines"></span>
		</button>`;
  refs.cartItems.appendChild(article);
};

refs.productBtn.forEach(btn => btn.addEventListener('click', (e) => cartFunc(e)))

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
      const product = findProduct(id)

      if (product.stock > Number(element.nextElementSibling.textContent)) {
        const newAmount = Number(element.nextElementSibling.textContent) + 1;
      element.nextElementSibling.textContent = newAmount;      
      const newProduct = { ...product, amount: newAmount }
      const currentStorage = JSON.parse(localStorage.getItem('storage'))
      const newStorage = currentStorage.filter(el => el.id !== id)
      newStorage.push(newProduct)
      localStorage.setItem('storage', JSON.stringify(newStorage))
      } else {
        alert('out of stock')
      }
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
        const currentStorage = JSON.parse(localStorage.getItem('storage'))
        const newStorage = currentStorage.filter(el => el.id !== id)
        newStorage.push(newProduct)
        localStorage.setItem('storage', JSON.stringify(newStorage))        
      }
    }
    displayCartItemCount();
    displayCartTotal(totalTextRoot);    
  });
}

const init = () => {
  // display amount of cart items
  displayCartItemCount();
  // display total
  displayCartTotal(totalTextRoot);  
  // setup cart functionality
  setupCartFunctionality();
  if (storage) { storage.map(el => addToCart(el)) }
};

init();

const cartFunc = function (e) {
  const startPoint = e.currentTarget.parentElement.previousElementSibling;
  const randumStock = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

  const item = {
    id: shortid.generate(),
    stock: randumStock(5, 10),
    price: Number.parseFloat(startPoint.textContent),
    name: startPoint.previousElementSibling.textContent,
    image: startPoint.previousElementSibling.previousElementSibling.attributes.src.nodeValue,
    amount: 1
  }

  const newStorage = storage = JSON.parse(localStorage.getItem('storage'))  
  const sameElement = newStorage.find(el => el.name === item.name)  
  
  if (sameElement) {
    if (sameElement.stock > sameElement.amount) {
      const newAmount = sameElement.amount += 1;
    const id = sameElement.id
    refs.cartItems.querySelector(`#${id}`).querySelector('.cart-item-amount').textContent = newAmount;
    
    const newProduct = { ...sameElement, amount: newAmount }      
    const newStorage = storage.filter(el => el.id !== id)
    newStorage.push(newProduct)
    localStorage.setItem('storage', JSON.stringify(newStorage))
    } else {
      alert('out of stock')
    }    
  } else {
    storage.push(item);
    localStorage.setItem('storage', JSON.stringify(storage));
    addToCart(item);
  }  

  displayCartItemCount()
  displayCartTotal(totalTextRoot)
  openCart()
}

export { cartFunc, displayCartTotal, removeItem, findProduct }