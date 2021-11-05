'use strict';
import 'regenerator-runtime/runtime';
import '../../styles/pages/cartPage.scss';
import '../components/burger';
import '../components/back-to-top';
import '../components/cart';
import '../components/footerMailValidation';
import { cartFunc, displayCartTotal, removeItem, findProduct } from '../components/cart';
import cartPageItem from '../../templates/cartPageItem.hbs';
import similarTpl from '../../templates/similarTpl.hbs';
import request from '../request';

const cartListRoot = document.querySelector('.cart-products-list')
const cartProductTotal = document.querySelector('.cart-products-total')

// initial markup
const makeMarkup = function () {  
  cartListRoot.innerHTML = '';
  const storage = JSON.parse(localStorage.getItem('storage'))
  storage.forEach(item => {
  const markup = cartPageItem(item)
  cartListRoot.insertAdjacentHTML('beforeend', markup)  
  })
}

makeMarkup()

// change amount
const changeAmountBtns = document.querySelectorAll('.cart-quantity-box')

changeAmountBtns.forEach(el => el.addEventListener('click', e => {
  const id = e.currentTarget.id
  const element = e.target
  const product = findProduct(id)

  // increase
  if (element.classList.contains('cartPage-increase-quantity')) {
    if (product.stock > Number(element.previousElementSibling.textContent)) {
      const newAmount = Number(element.previousElementSibling.textContent) + 1;
      element.previousElementSibling.textContent = newAmount;    
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
  if (element.classList.contains('cartPage-decrease-quantity')) {          
    const newAmount = Number(element.nextElementSibling.textContent) - 1;
      
    if (newAmount === 0) {
      removeItem(id);
      e.currentTarget.parentElement.parentElement.remove()
    } else {
      element.nextElementSibling.textContent = newAmount;      
      const newProduct = { ...product, amount: newAmount }
      const currentStorage = JSON.parse(localStorage.getItem('storage'))
      const newStorage = currentStorage.filter(el => el.id !== id)
      newStorage.push(newProduct)
      localStorage.setItem('storage', JSON.stringify(newStorage))        
    }
  }
  localTotal.forEach(el => setLocalTolat(el))
  displayCartTotal(cartProductTotal)   
}))

// set total for each product
const localTotal = document.querySelectorAll('.cart-page-item_total')

const setLocalTolat = function (localTotal) {
  const localPrice = Number(localTotal.previousElementSibling.textContent)
  const localAmount = Number(localTotal.previousElementSibling.previousElementSibling.children[1].textContent)
  localTotal.textContent = (localPrice * localAmount).toPrecision(6)  
}

localTotal.forEach(el => setLocalTolat(el))

// set add warranty for each product
const extraWarranty = document.querySelectorAll('.extra-warranty')

extraWarranty.forEach(el => el.addEventListener('click', (e) => {  
  const warranryPrice = e.target.nextElementSibling.nextElementSibling
  const product = findProduct(e.target.id.slice(20))
  const storage = JSON.parse(localStorage.getItem('storage'))  
  
  if (e.target.checked) {
    warranryPrice.textContent = (product.price * 0.15).toPrecision(6)
    e.target.previousElementSibling.children[4].textContent = (product.price * 1.15).toPrecision(6)

    const filteredStorage = storage.filter(el => el.id !== product.id)
    product.price = product.price * 1.15
    filteredStorage.push(product)
    localStorage.setItem('storage', JSON.stringify(filteredStorage))    
  } else {
    e.target.previousElementSibling.children[4].textContent = (product.price / 1.15).toPrecision(6)
    warranryPrice.textContent = '+15%'
    
    const filteredStorage = storage.filter(el => el.id !== product.id)
    product.price = product.price / 1.15
    filteredStorage.push(product)
    localStorage.setItem('storage', JSON.stringify(filteredStorage))
  }
  displayCartTotal(cartProductTotal)
}))

// remove item
const removeBtns = document.querySelectorAll('.cart-remove-item')

removeBtns.forEach(el => el.addEventListener('click', e => {  
  removeItem(e.currentTarget.id)
  makeMarkup()
  displayCartTotal(cartProductTotal)
  const localTotal = document.querySelectorAll('.cart-page-item_total')
  localTotal.forEach(el => setLocalTolat(el))
}))

displayCartTotal(cartProductTotal)

// coupons
const coupons = JSON.parse(localStorage.getItem('coupons'))
const couponForm = document.querySelector('.coupon-btn-box')
const couponInput = document.querySelector('.coupon-input')

couponForm.addEventListener('submit', e => {
  e.preventDefault()

  const couponCode = couponInput.value
  const findCoupon = coupons.find(el => el.code === couponCode)

  if (findCoupon) {
    const newTotalValue = (displayCartTotal(cartProductTotal) * findCoupon.value).toPrecision(6)
    cartProductTotal.textContent = `Total: ${newTotalValue} $`
    couponInput.value = '';
  } else {
    couponInput.value = '';
    alert('wrong coupon')
  }  
})

// You can also buy
const categories = ['abcat0101000', 'abcat0102000', 'abcat0106000', 'abcat0107000', 'abcat0203000', 'abcat0205007']
const randomCategory = categories[Math.floor(Math.random()*categories.length)];  
const categiryUrl = `http://localhost:3030/products?$limit=5&category.id=${randomCategory}`
const similarRoot = document.querySelector('.similar-list')

const linkHandler = function () {
  const productLinks = document.querySelectorAll('.product-link')
  productLinks.forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault()      
      localStorage.setItem('productId', e.currentTarget.id)
      window.location.href = './product.html';
    })
  })
}
  
const similarMarkup = function (data) {
data.data.forEach(el => {
  const markup = similarTpl(el);
  similarRoot.insertAdjacentHTML('beforeend', markup);
})   
const cartBtns = similarRoot.querySelectorAll('#product-cart-btn')  
cartBtns.forEach(el => {
  el.addEventListener('click', e => cartFunc(e))
})
linkHandler()
}
request(categiryUrl, similarMarkup)

// installments
const instellmentSelect = document.querySelectorAll('#installment-select')

instellmentSelect.forEach(el => el.addEventListener('change', e => {
  const monthes = Number(e.target.value)
  const extraPercents = Number(e.target.dataset.percent)  
  
  e.target.nextElementSibling.textContent = (displayCartTotal(cartProductTotal) / monthes).toPrecision(6)
  e.target.nextElementSibling.nextElementSibling.textContent = (displayCartTotal(cartProductTotal) * extraPercents).toPrecision(6)
}))