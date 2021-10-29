'use strict'
import 'regenerator-runtime/runtime';
import '../../styles/pages/product.scss';
import '../components/burger';
import '../components/back-to-top';
import '../components/cart';
import '../components/footerMailValidation';
import request from '../request';
import productPageTpl from '../../templates/productPageTpl.hbs';
import productTpl from '../../templates/product.hbs';
import similarTpl from '../../templates/similarTpl.hbs';

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
  const markup = productPageTpl(response);
  productPageRoot.insertAdjacentHTML('beforeend', markup);
  
  const currentProduct = {
    id: response.id,
    name: response.name,
    image: response.image,
    price: response.price
  }
  
  const reviewedArr = JSON.parse(localStorage.getItem('reviewedProducts'))

  if (reviewedArr.length < 5) {
    reviewedArr.push(currentProduct)
    localStorage.setItem('reviewedProducts', JSON.stringify(reviewedArr))
  } else {
    reviewedArr.shift();
    reviewedArr.push(currentProduct)
    localStorage.setItem('reviewedProducts', JSON.stringify(reviewedArr))
  }

  let productCategories = [];
  response.categories.forEach(el => {
    productCategories.push(el.id)
  })
  
  const randomCategory = productCategories[Math.floor(Math.random()*productCategories.length)];
  
  const categiryUrl = `http://localhost:3030/products?$limit=5&category.id=${randomCategory}`
  const similarRoot = document.querySelector('.similar-list')
  
  const similarMarkup = function (data) {
  data.data.forEach(el => {
    const markup = similarTpl(el);
    similarRoot.insertAdjacentHTML('beforeend', markup);
  })   

  linkHandler()
  }
  request(categiryUrl, similarMarkup)
}

// reviewed products render
const reviewedRender = function () {
  reviewedProducts.forEach(el => {
    const markup = productTpl(el);
    reviewedRoot.insertAdjacentHTML('beforeend', markup);
  });
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
    sameElement.rating.push(object.rating)    
    sameElement.comment.push(object.comment)
    const filteredRew = reviews.filter(el => el.id !== productId)
    filteredRew.push(sameElement)
    localStorage.setItem('reviews', JSON.stringify(filteredRew))
  } else {
    reviews.push(object)
    localStorage.setItem('reviews', JSON.stringify(reviews))
  }
  location.reload()
}

const sameElement = reviews ? reviews.find(el => el.id === productId) : '';

const setRating = () => {  
  if (sameElement) {
    let sum = 0
    if (sameElement.rating.length > 1) {
      sameElement.rating.map(el => {
      sum = sum + Number(el)
    })    
    rating.textContent = sum / sameElement.rating.length
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
      const markup = `<li>${el}</li>`;
      commentsRoot.insertAdjacentHTML('beforeend', markup);
    })
    } else {      
      const markup = `<li>${sameElement.comment}</li>`;
      commentsRoot.insertAdjacentHTML('beforeend', markup);
    }    
  } else {
    const markup = '<li>No comments</li>';
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

setComments()
setRating()
reviewedRender()
request(productUrl, productHandle)