'use strict'
import 'regenerator-runtime/runtime';
const shortid = require('shortid');
shortid.characters('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZйцукенгшщзхї');
import '../../styles/pages/product.scss';
import '../components/burger';
import '../components/back-to-top';
import '../components/cart';
import '../components/footerMailValidation';
import { cartFunc } from '../components/cart';
import request from '../utils/request';
import productPageTpl from '../../templates/productPageTpl.hbs';
import productTpl from '../../templates/product.hbs';
import similarTpl from '../../templates/similarTpl.hbs';
import setStock from '../utils/setStock';

const productId = localStorage.getItem('productId')
const productUrl = `http://localhost:3030/products/${productId}`
const productPageRoot = document.querySelector('.product-root')
const rating = document.querySelector('.rating-value')
const reviewedRoot = document.querySelector('.reviewed-list')
const commentForm = document.querySelector('#comment-form');
const commentsRoot = document.querySelector('.reviews-root')

let reviewedProducts = JSON.parse(localStorage.getItem('reviewedProducts')) ?
  JSON.parse(localStorage.getItem('reviewedProducts')) :
localStorage.setItem('reviewedProducts', '[]');

let reviews = JSON.parse(localStorage.getItem('reviews')) ?
  JSON.parse(localStorage.getItem('reviews')) :
localStorage.setItem('reviews', '[]');

const productHandle = function (response) {
  const currentProduct = {
    id: shortid.generate(),
    name: response.name,
    image: response.image,
    price: response.price,
    manufacturer: response.manufacturer,
    shipping: response.shipping,
    type: response.type,
    description: response.description,
    stock: setStock(response.id),
    amount: 1,
    warranty: false
  }  

  const markup = productPageTpl(currentProduct);
  productPageRoot.insertAdjacentHTML('beforeend', markup);

  const quantityBox = document.querySelector('.cart-quantity-box')
  quantityBox.addEventListener('click', e => quantityHandle(e, currentProduct))

  const addBtn = document.querySelector('.add-btn')
  addBtn.addEventListener('click', e => cartFunc(e, currentProduct))  
  
  const reviewedArr = JSON.parse(localStorage.getItem('reviewedProducts'))
  const doubleReviewedProd = reviewedArr.find(el => el.name === currentProduct.name)  
  
  if (!doubleReviewedProd) {
    if (reviewedArr.length < 5) {
    reviewedArr.push(currentProduct)
    localStorage.setItem('reviewedProducts', JSON.stringify(reviewedArr))
  } else {
    reviewedArr.shift();
    reviewedArr.push(currentProduct)
    localStorage.setItem('reviewedProducts', JSON.stringify(reviewedArr))
  }
  }  

  let productCategories = [];
  response.categories.forEach(el => {
    productCategories.push(el.id)
  })
  
  const getRandomCategory = productCategories[Math.floor(Math.random()*productCategories.length)];
  
  const categiryUrl = `http://localhost:3030/products?$limit=5&category.id=${getRandomCategory}`
  const similarRoot = document.querySelector('.similar-list')
  
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
}

// reviewed products render
const reviewedRender = function () {
  if (reviewedProducts) {
    reviewedProducts.forEach(el => {
    const markup = productTpl(el);
    reviewedRoot.insertAdjacentHTML('beforeend', markup);
  });
  }
  const cartBtns = reviewedRoot.querySelectorAll('#product-cart-btn')  
  cartBtns.forEach(el => {
    el.addEventListener('click', e => cartFunc(e))
  })
}

const productLinks = document.querySelectorAll('.product-link')

productLinks.forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault()
    localStorage.setItem('productId', e.currentTarget.id)
    location.reload()
  })
})

// reviews
commentForm.onsubmit = (e) => {
  e.preventDefault()

  let data = new FormData(commentForm)

  let object = {id: productId};
  data.forEach((value, key) => object[key] = [value]);
  
  if (sameElement) {    
    if (object.rating) {      
      sameElement.rating = [...sameElement.rating, object.rating]
    }
    if (object.comment[0].length > 0) {      
      sameElement.comment.push(object.comment)
    }
    const filteredRew = reviews.filter(el => el.id !== productId)
    filteredRew.push(sameElement)
    localStorage.setItem('reviews', JSON.stringify(filteredRew))
  } else {    
    if (reviews) {
      reviews.push(object)
      localStorage.setItem('reviews', JSON.stringify(reviews))
    }    
    localStorage.setItem('reviews', JSON.stringify([object]))
  }
  location.reload()
}

const sameElement = reviews ? reviews.find(el => el.id === productId) : '';

const setRating = () => {  
  if (sameElement) {
    let sum = 0
    if (sameElement.rating && sameElement.rating.length > 1) {
      sameElement.rating.map(el => {
      sum = sum + Number(el)
    })    
      rating.textContent = (sum / sameElement.rating.length).toPrecision(2)      
    } else {
      rating.textContent = sameElement.rating
    }    
  } else {
    rating.textContent = 'No rating'
  }
}

const setComments = () => {
  if (sameElement) {    
    if (sameElement.comment.length > 1) {      
      sameElement.comment.forEach(el => {
        const index = sameElement.comment.indexOf(el)
      const markup = `<li class="comment">${el}. Rating: ${sameElement.rating[index]}</li>`;
      commentsRoot.insertAdjacentHTML('beforeend', markup);
    })
    } else {      
      const markup = `<li class="comment">${sameElement.comment}. Rating: ${sameElement.rating}</li>`;
      commentsRoot.insertAdjacentHTML('beforeend', markup);
    }    
  } else {
    const markup = '<li class="comment">No comments</li>';
    commentsRoot.insertAdjacentHTML('beforeend', markup);
  }
}

// functions
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

const quantityHandle = function (e, product) {
    const quantity = document.querySelector('.cartPage-item-quantity')    
  
  if (e.target.classList.contains('cartPage-increase-quantity')) {
    if (product.stock > Number(quantity.textContent)) {
      product.amount = product.amount + 1
      quantity.textContent = product.amount      
    } else {
      alert('no more available in stock')
    }
  }
    if (e.target.classList.contains('cartPage-decrease-quantity')) {
    if (product.amount > 1) {
      product.amount = product.amount -1
      quantity.textContent = product.amount      
    }
  }    
}

setComments()
setRating()
reviewedRender()
request(productUrl, productHandle)