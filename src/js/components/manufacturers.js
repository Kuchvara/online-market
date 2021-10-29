// import request from "../request";
// import init from '../pages/categories';
// import doPaginate from "./pagination";

// const manufacturersRoot = document.querySelector('#manufacturers');
// let manufacturerName
// let skip

const getManufacturers = function () {
  const categoriaId = JSON.parse(localStorage.getItem('urlData')).id
  const url = `http://localhost:3030/products?$limit=999&category.id=${categoriaId}&$select[]=manufacturer`;
  

  const dataProcessing = (data) => {
    let manufacturersArr = []

    data.forEach(el => {      
      if (!manufacturersArr.includes(el.manufacturer)) {
        manufacturersArr.push(el.manufacturer)
      }      
    })
    
    manufacturersArr.forEach(el => {
    const markup = `<li class="filter-item" id="manufacturer-item">${el}</li>`    
    manufacturersRoot.insertAdjacentHTML('beforeend', markup);
    })

    const manufacturers = document.querySelectorAll('#manufacturer-item')
    manufacturers.forEach(el => {
      el.addEventListener('click', e => {        
        manufacturerName = e.target.textContent;        
        skip = doPaginate(e, true)
        init()
      })
    })  
  }  
  
  request(url, dataProcessing) 
}

getManufacturers()

// export default getManufacturers