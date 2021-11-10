function initMap() {
  const location = {
    lat: 49.5535,
    lng: 25.5947
  }
    const options = {    
    center: location,
    zoom: 12
  }
  
  map = new google.maps.Map(document.getElementById('map'), options);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((loc) => {
      location.lat = loc.coords.latitude
      location.lng = loc.coords.longitude
      map = map
    })
  } else {
    map = map
  }

  const handleInput = (input, namePlace, addressPlace, cityPlace) => {
    const autocomplete = new google.maps.places.Autocomplete(input, {      
      componentRestrictions: { country: "ua" },
      fields: ["address_components", "geometry", "name"],      
      types: ["establishment"]
    })
    
    autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    
    namePlace.textContent = place.name    
    addressPlace.textContent = `${place.address_components[0].long_name}, ${place.address_components[2].long_name}, ${place.address_components[1].long_name}`
    cityPlace.textContent = place.address_components[4].long_name
      
    new google.maps.Marker({
      position: place.geometry.location,      
      map: map
    })
    map.setCenter(place.geometry.location);
  })    
  }

  // shops
  const shopInput = document.querySelector('#shop-input')
  const shopName = document.querySelector('.shop-name')
  const shopAddress = document.querySelector('.shop-address')
  const shopCity = document.querySelector('.shop-city')
  

  handleInput(shopInput, shopName, shopAddress, shopCity)  
  
  // post  
  const postInput = document.querySelector('#post-input')
  const postName = document.querySelector('.post-name')
  const postAddress = document.querySelector('.post-address')
  const postCity = document.querySelector('.post-city')

  handleInput(postInput, postName, postAddress, postCity)
}

google.maps.event.addDomListener(window, 'load', initMap);