const request = function (url, root, template, total = undefined) {  
  let request = new XMLHttpRequest();
  let response

  request.open('GET', url);

  request.responseType = 'json';

  request.send();

  request.onload = function() {
    response = request.response;
    if (total) {
      total.textContent = response.total
    }
    
    response.data.forEach(el => {
      const markup = template(el);
      root.insertAdjacentHTML('beforeend', markup);
    })    
  };  
  return response
}

export default request