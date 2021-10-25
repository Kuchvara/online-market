const first = document.querySelector('#first')
const middle = document.querySelector('#middle')
const last = document.querySelector('#last')
const paginationItems = document.querySelectorAll('.pagination-item')
const coutner = document.querySelector('.product-content-coutner')
const total = document.querySelector('.product-content-total');

function doPaginate(e, reset = false) {
  // e.preventDefault()
  let skip
  let currentPage = 1
  
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
      paginationItems.forEach(el => el.classList.remove('active'));
      first.classList.add('active');
      first.textContent = Number(first.textContent) + 3;
      middle.textContent = Number(middle.textContent) + 3;
      last.textContent = Number(last.textContent) + 3;
      currentPage = first.textContent;      
    }

    if (e.target.classList.contains('arrLeft') && Number(first.textContent) > 1) {      
      paginationItems.forEach(el => el.classList.remove('active'));
      last.classList.add('active');
      first.textContent = Number(first.textContent) - 3;
      middle.textContent = Number(middle.textContent) - 3;
      last.textContent = Number(last.textContent) - 3;
      currentPage = last.textContent;      
    }

    skip = currentPage * 20 - 20; 
    
    coutner.textContent = currentPage * 20    
  
    window.scrollTo({ top: 0, behavior: 'smooth' });    
    return skip
  }  
}

export default doPaginate