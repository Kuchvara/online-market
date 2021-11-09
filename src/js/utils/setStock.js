const setStock = function (id) {
  const currentStock = JSON.parse(localStorage.getItem('stock')) ? JSON.parse(localStorage.getItem('stock')) : localStorage.setItem('stock', JSON.stringify([]))
  const findStock = currentStock.find(el => el.id === id)
  const randumStock = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
  }

  if (findStock) {
    return findStock.stock
  } else {
    const newItem = {
    id: id,
    stock: randumStock(5, 10)
  }
  currentStock.push(newItem)
  localStorage.setItem('stock', JSON.stringify(currentStock))
  return newItem.stock
  }    
}

export default setStock