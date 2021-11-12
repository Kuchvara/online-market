const request = function (url, callback, total = undefined) {  
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
    callback(response)
  };  
  return response
}

export default request