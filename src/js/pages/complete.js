'use strict';

import '../../styles/pages/complete.scss';

import '../components/burger';
import '../components/back-to-top';
import '../components/footerMailValidation';

// refresh localStorage
localStorage.setItem('stock', JSON.stringify([]))
localStorage.setItem('reviewedProducts', JSON.stringify([]))
localStorage.setItem('reviews', JSON.stringify([]))
localStorage.setItem('storage', JSON.stringify([]))
// set coupons
const coupons = [
  {
    code: 'discount10',
    value: 0.9
  },
  {
    code: 'discount20',
    value: 0.8
  },
  {
    code: 'discount30',
    value: 0.7
  }
]
localStorage.setItem('coupons', JSON.stringify(coupons))

const order = JSON.parse(localStorage.getItem('order'))
console.log(order);