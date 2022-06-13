import data from "./data.js";

const standardPizzas = data[0].standard;
console.log(Object.keys(data[0])[0])
const veganPizzas = data[1].vegan;
const gluteFree = data[2].glutenFree;
const sides = data[3].sides;
const drinks = data[4].drinks

const homePageUrl = "http://127.0.0.1:5500/index.html";
const pizzaPageUrl = "http://127.0.0.1:5500/pizzas.html";
const sidesPageUrl = "http://127.0.0.1:5500/sides.html";
const basketPageUrl = "http://127.0.0.1:5500/basket.html";
const drinksPageUrl = "http://127.0.0.1:5500/drinks.html";
const url = window.document.documentURI;

if (url == null) {
  url = homePageUrl
}
let orders;

function isLoaded() {
  orders = loadData('orders', []);
  return true;
}

//check if the html is loaded 
if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', isLoaded)
} else {
  try {
    isLoaded();
  } catch (e) {
    console.log(e);
  }
}

// if pizza html is loaded render the elements 
if (url == pizzaPageUrl && isLoaded()) {
  const standardSection = document.getElementById("standard");
  const veganSection = document.getElementById("vegan");
  const glutenFreeSection = document.getElementById("glutenFree");

  // getting products data from data file, creating new product article and appending to sections 
  const createNewArticle = async (data, section, key) => {
    await data.forEach((product) => {

      try {
        const article = document.createElement('article');
        article.classList.add('products__card');
        article.setAttribute('data-id', product.id);
        article.setAttribute('data-key', key)
        const articleContents = `    
          <img src=${product.image} 
            alt=${product.image} class ="image">
          <div class="product__columns">
            <h5 class="product__title">${product.title}</h5>
            <p class="product__desc">${product.desc} </p>
            <select class="product__sizeSelect pizzaSize" data-value="">
              <option value="large" selected="selected"data-price="20.99">Large - 16" £20.99
              </option>
              <option value="medium" data-price="17.99">Medium - 12" £18.99</option>
              <option value="small" data-price="14.99">Small - 8" £15.99</option>
              <option value="extraLarge">Pizzanormus - 20" £29.99</option>
            </select>
            <select class="product__crustSelect pizzaCrust" data-value="">
              <option data-value="	Thin Italian" selected="selected">Thin
                Italian Base</option>
              <option data-value="Stone Crust">Stone Crust Base</option>
              <option data-value="Cheese Stuffed">Cheese Stuffed Crust Base
              </option>
              <option data-value="vegan">Vegan Base</option>
              <option data-value="glutenFree">Gluten Free Base</option>
            </select>
            <button class="btn btn__success orderBtn"
              data-order=${product.title}>Add</button>
          </div>
          `
        article.innerHTML = articleContents;
        section.append(article);
      } catch (e) {
        console.log(e)
      }
    })
  }
  //calling create product articles  
  createNewArticle(standardPizzas, standardSection, Object.keys(data[0])[0]);
  createNewArticle(veganPizzas, veganSection, Object.keys(data[1])[0]);
  createNewArticle(gluteFree, glutenFreeSection, Object.keys(data[2])[0]);
}

// getting products data from data file, creating new product article and appending to sections 
const createNewArticle = async (data, section, key) => {

  await data.forEach((product) => {

    try {
      const article = document.createElement('article');
      article.classList.add('products__card');
      article.setAttribute('data-id', product.id);
      article.setAttribute('data-key', key)
      const articleContents = `         
          <img class = "image" src=${product.image} alt=${product.image}>
          <div class="product__columns">
            <h5 class="product__title">${product.title}</h5>
            <p class="product__desc">${product.desc}</p>
            <p class="product__price"> £${product.price}</p>
            <button class="btn btn__success orderBtn"
              data-order=${product.title}>Add</button>
          </div>
          `
      article.innerHTML = articleContents;
      section.append(article);
    } catch (e) {
      console.log(e)
    }
  });
}

// if sidesPage is laoded render the elemnts 
if (url == sidesPageUrl && isLoaded()) {
  const sidesSection = document.getElementById("sides");
  createNewArticle(sides, sidesSection, Object.keys(data[3])[0]);
  updateBasketIcon();
}
// if drinksPage is laoded reander the elemnts 
if (url == drinksPageUrl && isLoaded()) {
  const drinksSection = document.getElementById("drinks");
  createNewArticle(drinks, drinksSection, Object.keys(data[4])[0]);
  updateBasketIcon();
}

if (url == basketPageUrl && isLoaded()) {

  let orders = loadData('orders', []);

  function createBasketRows(orders) {
    // render basket elements on page with data from local stroage 
    const basketItemsContainer = document.getElementsByClassName('basket__items')[0];
    orders.forEach(el => {
      const basketRow = document.createElement('div');
      basketRow.classList.add('basket__row');
      const sizeElement = !el.size ? `<span class="basket__itemSize"> </span>` : `<span class="basket__itemSize">${el.size} </span>`;
      const crustElement = !el.crust ? `<span class="basket__itemCrust"> </span>` : `<span class="basket__itemCrust">${el.crust} </span>`;
      const basketRowContents = `
            <div class="basket__item ">
              <img src=${el.imageSrc} 
                class="basket__image">
              <div class="basket__itemInfo">
                <h5 class="basket__itemTitle">${el.title} </h5>
               ${sizeElement} 
               ${crustElement}
              </div>
            </div>
            <div class="basket__itemDetails">
              <span class="basket__itemPrice ">£${el.price} </span>
              <div class="basket__quantity basket__column">
                <input class="basket__quantityInput" type="number" value="1"
                  min="1" max="10" step="1">
                <button class="btn btn__danger" type="button" data-remove = ${el.id} >REMOVE</button>
              </div>
            </div>
    `
      basketRow.innerHTML = basketRowContents;
      basketItemsContainer.append(basketRow);

    })
  }
  createBasketRows(orders);

  const updateBasketTotal = () => {

    const basketItemsContainer = document.getElementsByClassName('basket__items')[0];
    const basketRows = basketItemsContainer.getElementsByClassName('basket__row');
    let total = 0;
    for (let i = 0; i < basketRows.length; i++) {
      let basketRow = basketRows[i]
      let priceElement = basketRow.getElementsByClassName('basket__itemPrice')[0];
      let quantityElement = basketRow.getElementsByClassName('basket__quantityInput')[0];
      let price = priceElement.innerText.replace('£', "");
      let quantity = quantityElement.value;
      total = total + (price * quantity);
    }
    //to keep the total to max 2 decimal places
    total = total.toFixed(2);
    document.getElementsByClassName("basket__totalPrice")[0].innerText = '£' + total;
  }
  updateBasketTotal();
  updateBasketIcon();


  //add event listener to remove from busket button 
  const removeBasketItemButtons = document.getElementsByClassName("btn__danger");
  for (let i = 0; i < removeBasketItemButtons.length; i++) {
    let removeBtn = removeBasketItemButtons[i];
    removeBtn.addEventListener('click', removeBasketItem)
  }

  //add event listener to quantity inputs 
  const quantityInputs = document.getElementsByClassName('basket__quantityInput');
  for (let i = 0; i < quantityInputs.length; i++) {
    let quantity = quantityInputs[i];
    quantity.addEventListener('change', quantityChanged)
  }

  //remove item from basket and call update function to update the total price and local storage
  function removeBasketItem(event) {
    let buttonClicked = event.target;
    removeFromStorage(buttonClicked);
    buttonClicked.parentElement.parentElement.parentElement.remove();
    updateBasketTotal();

  }

  function quantityChanged(event) {
    let quantityInput = event.target;
    console.log(quantityInput)
    //  check if the input is a valid number 
    if (isNaN(quantityInput.value) || quantityInput.value <= 0) {
      quantityInput.value = 1;
    }
    updateBasketTotal();
  }
  // TODO:// when quantity changes get the item from local storage add another item to local storage  the basket icon v

  function removeFromStorage(buttonClicked) {

    const productContainer = buttonClicked.parentElement.parentElement.parentElement;
    const title = productContainer.getElementsByClassName("basket__itemTitle")[0].innerText;
    const size = productContainer.getElementsByClassName('basket__itemSize')[0].innerText;
    const crust = productContainer.getElementsByClassName('basket__itemCrust')[0].innerText;

    let orders = loadData('orders', []);
    console.log(orders)
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].key == "pizza") {
        if (orders[i].title == title && orders[i]?.size == size && orders[i]?.crust == crust) {
          let removeItemIndex = orders.indexOf(orders[i]);
          console.log(removeItemIndex)
          orders.splice(removeItemIndex, 1);
          saveOrdersToLocalStroage(orders);
          updateBasketIcon();
        }
      } else {
        if (orders[i].title == title) {
          let removeItemIndex = orders.indexOf(orders[i]);
          console.log(removeItemIndex)
          orders.splice(removeItemIndex, 1);
          saveOrdersToLocalStroage(orders);
          updateBasketIcon();
        }
      }



    }

    if (orders.length == 0) {
      console.log("you hv=ave no orders in your basket")
      const url = window.location.href.replace(basketPageUrl, pizzaPageUrl)
      window.location.href = url;
    }

  }
}

//add event listeners to add to basket buttons 
const addToBasketButtons = document.querySelectorAll("button[data-order]");

for (let i = 0; i < addToBasketButtons.length; i++) {
  let addToBasketBtn = addToBasketButtons[i];
  addToBasketBtn.addEventListener('click', addToBasketClicked)
};

//util: get option value from select menu
const getOption = (select) => {
  return select.options[select.selectedIndex]
}
let i = 1;
//create product when add is clicked
function addToBasketClicked(event) {

  let addButton = event.target;
  const productContainer = addButton.parentElement.parentElement;
  const selectSizeEl = productContainer.getElementsByClassName('pizzaSize')[0];
  const selectCrustEl = productContainer.getElementsByClassName('pizzaCrust')[0];
  let product;

  if (url == pizzaPageUrl) {

    product = {
      id: productContainer.dataset.id,
      key: "pizza",
      imageSrc: productContainer.getElementsByClassName('image')[0].src,
      title: productContainer.getElementsByClassName('product__title')[0].innerText,
      desc: productContainer.getElementsByClassName('product__desc')[0].innerText,
      size: getOption(selectSizeEl).value,
      crust: getOption(selectCrustEl).value,
      price: getOption(selectSizeEl).dataset.price,
      quantity: 1
    }


  } else {

    product = {
      id: productContainer.dataset.id,
      key: productContainer.dataset.key,
      imageSrc: productContainer.getElementsByClassName('image')[0].src,
      title: productContainer.getElementsByClassName('product__title')[0].innerText,
      desc: productContainer.getElementsByClassName('product__desc')[0].innerText,
      price: productContainer.getElementsByClassName('product__price')[0].innerText.replace("£", ""),
      quantity: 1

    }


  }

  addProduct(product)
}

function addProduct(product) {
  // check if there is data in local storage 
  let orders = loadData('orders', []);

  for (let i = 0; i < orders.length; i++) {
    if (orders[i].title == product.title && orders[i].size == product?.size && orders[i].crust == product?.crust) {
      alert("This item is already in the cart");
      return;
    }
  }
  let newOrders = [...orders, product];


  saveOrdersToLocalStroage(newOrders);


}

// add order to local storage 

function saveOrdersToLocalStroage(orders) {
  localStorage.clear();
  localStorage.setItem('orders', JSON.stringify(orders));
  updateBasketIcon();
}

window.addEventListener('storage', updateBasketIcon);

function updateBasketIcon() {
  let basketBtnQuantity = document.getElementsByClassName('basket__button__quantity')[0];
  const ordersQuantity = JSON.parse(localStorage.getItem("orders"))?.length || 0;
  basketBtnQuantity.innerText = ordersQuantity
}

//if there is nothing in storage it will return empty array otherwise it will return data from local Storage 
function loadData(orders, def) {
  var data = localStorage.getItem(orders);
  return null == data ? def : JSON.parse(data);
}





