const first = document.querySelector('#first')
const middle = document.querySelector('#middle')
const last = document.querySelector('#last')
const paginationItems = document.querySelectorAll('.pagination-item')
const coutner = document.querySelector('.product-content-coutner')
const total = document.querySelector('.product-content-total');

function doPaginate(e, reset = false) {  
  let skip
  let currentPage = 1

  const modifyPagination = (item, number) => {
    paginationItems.forEach(el => el.classList.remove('active'));
    item.classList.add('active');
    first.textContent = Number(first.textContent) + number;
    middle.textContent = Number(middle.textContent) + number;
    last.textContent = Number(last.textContent) + number;
    currentPage = item.textContent;
  }
  
  if (reset) {
    paginationItems.forEach(el => el.classList.remove('active'));
    first.classList.add('active');
    first.textContent = 1;
    middle.textContent = 2;
    last.textContent = 3;
    currentPage = 1;
    skip = 0;
    coutner.textContent = currentPage * 20    
    return skip
  } else {
    if (Number(e.target.textContent)) {
      currentPage = Number(e.target.textContent);      
    }

    if (e.target.classList.contains('pagination-item')) {
      paginationItems.forEach(el => el.classList.remove('active'));
      e.target.classList.add('active');
    }

    if (e.target.classList.contains('arrRight') && currentPage < Number(total.textContent) / 20) {
      modifyPagination(first, 3)      
    }

    if (e.target.classList.contains('arrLeft') && Number(first.textContent) > 1) {      
      modifyPagination(last, -3)      
    }

    skip = currentPage * 20 - 20; 
    
    coutner.textContent = currentPage * 20    
  
    window.scrollTo({ top: 0, behavior: 'smooth' });    
    return skip
  }  
}

export default doPaginate