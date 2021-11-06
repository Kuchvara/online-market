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
const cartProductTotal = document.querySelector('.cart-products-total_value')

//  functions
const setLocalTolat = function (localTotal) {
  const localPrice = Number(localTotal.previousElementSibling.textContent)
  const localAmount = Number(localTotal.previousElementSibling.previousElementSibling.children[1].textContent)
  localTotal.textContent = (localPrice * localAmount).toPrecision(6)  
}

const changeAmount = function (e) {
  const id = e.currentTarget.id
  const element = e.target
  const product = findProduct(id)
  const warranty = e.currentTarget.parentElement.nextElementSibling.nextElementSibling.nextElementSibling
  const refreshData = (newAmount) => {
    const newProduct = { ...product, amount: newAmount }
    const currentStorage = JSON.parse(localStorage.getItem('storage'))
    const newStorage = currentStorage.filter(el => el.id !== id)
    newStorage.push(newProduct)
    localStorage.setItem('storage', JSON.stringify(newStorage))
    if (Number(warranty.textContent)) {
      warranty.textContent = product.price * 0.15 * newAmount
    }
  }

  // increase
  if (element.classList.contains('cartPage-increase-quantity')) {
    if (product.stock > Number(element.previousElementSibling.textContent)) {
      const newAmount = Number(element.previousElementSibling.textContent) + 1;      
      element.previousElementSibling.textContent = newAmount;    
      refreshData(newAmount)
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
      refreshData(newAmount)
    }
  }
  const localTotal = document.querySelectorAll('.cart-page-item_total')
  localTotal.forEach(el => setLocalTolat(el))
  displayCartTotal(cartProductTotal)
}

const cartItemsMarkup = function () {
  cartListRoot.innerHTML = '';
  const storage = JSON.parse(localStorage.getItem('storage'))
  storage.forEach(item => {
  const markup = cartPageItem(item)
  cartListRoot.insertAdjacentHTML('beforeend', markup)
  })
}

const addExtraWarranty = function (e) {
  const warranryPrice = e.target.nextElementSibling.nextElementSibling
  const product = findProduct(e.target.id.slice(20))
  const storage = JSON.parse(localStorage.getItem('storage'))
  const refreshStrage = () => {
    const filteredStorage = storage.filter(el => el.id !== product.id)    
    filteredStorage.push(product)
    localStorage.setItem('storage', JSON.stringify(filteredStorage))
  }
  
  if (e.target.checked) {
    warranryPrice.textContent = (product.price * 0.15 * product.amount).toPrecision(6)
    e.target.previousElementSibling.children[3].textContent = (product.price * 1.15).toPrecision(6)
    
    product.price = product.price * 1.15    
    refreshStrage()
  } else {
    e.target.previousElementSibling.children[3].textContent = (product.price / 1.15).toPrecision(6)
    warranryPrice.textContent = '+15% per one'    
    
    product.price = product.price / 1.15
    refreshStrage()
  }
  const localTotal = document.querySelectorAll('.cart-page-item_total')
  localTotal.forEach(el => setLocalTolat(el))
  displayCartTotal(cartProductTotal)
}

// coupons
const coupons = JSON.parse(localStorage.getItem('coupons'))
const couponForm = document.querySelector('.coupon-btn-box')
const couponInput = document.querySelector('.coupon-input')
const discount = document.querySelector('.discount')

couponForm.addEventListener('submit', e => {
  e.preventDefault()

  const couponCode = couponInput.value
  const findCoupon = coupons.find(el => el.code === couponCode)

  if (findCoupon) {
    const newTotalValue = (displayCartTotal(cartProductTotal) * findCoupon.value).toPrecision(6)
    discount.textContent = (displayCartTotal(cartProductTotal) - displayCartTotal(cartProductTotal) * findCoupon.value).toPrecision(6)
    cartProductTotal.textContent = newTotalValue
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
  el.addEventListener('click', e => {
    cartFunc(e)
    setupCartPageFunctionality()
  })
})
  linkHandler()  
}
request(categiryUrl, similarMarkup)

// installments
const instellmentSelect = document.querySelectorAll('#installment-select')

instellmentSelect.forEach(el => el.addEventListener('change', e => {
  const monthes = Number(e.target.value)
  const extraPercents = Number(e.target.dataset.percent)  
  
  e.target.nextElementSibling.textContent = (Number.parseFloat(cartProductTotal.textContent) / monthes).toPrecision(6)
  e.target.nextElementSibling.nextElementSibling.textContent = (Number(cartProductTotal.textContent) * extraPercents).toPrecision(6)
}))

// page main functionality
const setupCartPageFunctionality = function () {
  cartItemsMarkup()  

  // remove item
  const removeBtns = document.querySelectorAll('.cart-remove-item')
  removeBtns.forEach(el => el.addEventListener('click', e => {    
    removeItem(e.currentTarget.id)
    setupCartPageFunctionality()
  }))

  // change amount
  const changeAmountBtns = document.querySelectorAll('.cart-quantity-box')
  changeAmountBtns.forEach(el => el.addEventListener('click', e => changeAmount(e)))

  // local total
  const localTotal = document.querySelectorAll('.cart-page-item_total')
  localTotal.forEach(el => setLocalTolat(el))

  // extra warranty
  const extraWarranty = document.querySelectorAll('.extra-warranty')
  extraWarranty.forEach(el => el.addEventListener('click', (e) => addExtraWarranty(e)))

  displayCartTotal(cartProductTotal)
}

setupCartPageFunctionality()