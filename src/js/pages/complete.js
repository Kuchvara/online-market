'use strict';

import '../../styles/pages/complete.scss';

import '../components/burger';
import '../components/back-to-top';
import '../components/footerMailValidation';

// clean cart storage
localStorage.setItem('storage', JSON.stringify([]))

// refresh coupons
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

const orders = JSON.parse(localStorage.getItem('orders'))
console.log('Your order: ', orders[orders.length - 1]);
console.log('All orders:', orders);