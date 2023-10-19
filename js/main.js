// cart

let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");
let API_URL =
  "https://raw.githubusercontent.com/SaraElBadri/ShopApi/main/products";
let prodBox = document.querySelector("product-box");
let pageContent;

//Open cart
cartIcon.onclick = () => {
  cart.classList.add("active");
};

//Close cart
closeCart.onclick = () => {
  cart.classList.remove("active");
};

//

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  createProduct()
    // Add to cart
    .then(() => {
      const addToCartButtons = document.querySelectorAll(".add-cart");

      for (let i = 0; i < addToCartButtons.length; i++) {
        const addButton = addToCartButtons[i];
        addButton.addEventListener("click", addToCartClicked);
      }
    });

  //remove items from cart
  var removeCartButtons = document.getElementsByClassName("cart-remove");
  for (var i = 0; i < removeCartButtons.length; i++) {
    var button = removeCartButtons[i];
    button.addEventListener("click", removeCartItem);
  }

  // Quantity changes

  var quantityInputs = document.getElementsByClassName("cart-quantity");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }

  loadCartItems();
  

  document
    .getElementsByClassName("btn-buy")[0]
    .addEventListener("click", buyButtonClicked);

    
}

//Fetch products from API

async function fetchAllProducts() {
  const allData = await fetch(API_URL);
  const data = await allData.json();
  const allProducts = data.sort(function (a, b) {
    if (a.id < b.id) {
      return -1;
    } else if (a.id < b.id) {
      return 1;
    } else {
      return 0;
    }
  });

  return allProducts;
}

async function createProduct() {
  const allProducts = await fetchAllProducts();
  const shopContent = document.querySelector(".shop-content");

  allProducts.forEach((product) => {
    shopContent.innerHTML += `
        
        <div class="product-box" >
          <img src="${product.image}" alt="" class="product-img">
          <h2 class="product-title">${product.title}</h2>
          <span class="price">${product.price}€</span>
          <a href="product-page.html?uuid=${product.uuid}" class="btn-view">View Product</a>
          <i class='bx bx-shopping-bag add-cart' data-product='{"title": "${product.title}", "price":${product.price}, "image": "${product.image}", "uuid": "${product.uuid}"}'></i>
        </div>
        `;
        
    

    
  });
}

//Add to cart clicked function
function addToCartClicked(event) {
  const button = event.target;
  const productData = JSON.parse(button.getAttribute("data-product"));
  var cart = localStorage.getItem("cartItems");
  var cartItems = JSON.parse(cart);

  //console.log(productData);
  //console.log(localStorage.getItem('cartItems'));
  const title = productData.title;
  const price = productData.price;
  const image = productData.image;
  const uuid = productData.uuid;

  addProductToCart(title, price, image);
  updateTotal();
  saveCartItems();
  updateCartIcon();
}

function addProductToCart(title, price, image) {
  const cartContent = document.querySelector(".cart-content");

  const cartShopBox = document.createElement("div");
  cartShopBox.classList.add("cart-box");

  cartShopBox.innerHTML = `
    
    <img src="${image}" alt="" class="cart-img">
    <div class="detail-box">
        <div class="cart-product-title"> ${title} </div>
        <div class="cart-price">${price}</div>
        <input type="number" value="1" class="cart-quantity">
    </div>
    <i class='bx bx-trash-alt cart-remove'></i>
    `;

  cartContent.appendChild(cartShopBox);

  cartShopBox
    .getElementsByClassName("cart-remove")[0]
    .addEventListener("click", removeCartItem);

  cartShopBox
    .getElementsByClassName("cart-quantity")[0]
    .addEventListener("change", quantityChanged);

  saveCartItems();
  updateCartIcon();
}

//removeCartItem function

function removeCartItem(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.remove();
  updateTotal();
  saveCartItems();
  updateCartIcon();
}

//Quantity Changed function

function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateTotal();
  saveCartItems();
  updateCartIcon();
}

//Update total

function updateTotal() {
  var cartContent = document.getElementsByClassName("cart-content")[0];
  var cartBoxes = cartContent.getElementsByClassName("cart-box");
  var total = 0;
  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var priceElement = cartBox.getElementsByClassName("cart-price")[0];
    var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    var price = parseFloat(priceElement.innerText.replace("$", ""));
    var quantity = quantityElement.value;
    total += price * quantity;
  }

  // If price have cents
  total = Math.round(total * 100) / 100;

  document.getElementsByClassName("total-price")[0].innerText = "$" + total;

  //save current cart to local storage

  localStorage.setItem("cartTotal", total);
}

// Buy button clicked

function buyButtonClicked() {
  alert("Your order has been placed successfully");
  var cartContent = document.getElementsByClassName("cart-content")[0];
  while (cartContent.hasChildNodes()) {
    cartContent.removeChild(cartContent.firstChild);
  }
  updateTotal();
}

//Keep item in cart when refresh page

function saveCartItems() {
  var cartContent = document.getElementsByClassName("cart-content")[0];
  var cartBoxes = cartContent.getElementsByClassName("cart-box");
  var cartItems = [];

  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var titleElement = cartBox.getElementsByClassName("cart-product-title")[0];
    var priceElement = cart.getElementsByClassName("cart-price")[0];
    var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    var productImg = cartBox.getElementsByClassName("cart-img")[0].src;

    var item = {
      title: titleElement.innerText,
      price: priceElement.innerText,
      quantity: quantityElement.value,
      productImg: productImg,
    };
    cartItems.push(item);
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

//Loads in cart

function loadCartItems() {
  var cartItems = localStorage.getItem("cartItems");
  if (cartItems) {
    cartItems = JSON.parse(cartItems);

    for (var i = 0; i < cartItems.length; i++) {
      var item = cartItems[i];
      addProductToCart(item.title, item.price, item.productImg);

      var cartBoxes = document.getElementsByClassName("cart-box");
      var cartBox = cartBoxes[cartBoxes.length - 1];
      var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
      quantityElement.value = item.quantity;
    }
  }

  var cartTotal = localStorage.getItem("cartTotal");
  if (cartTotal) {
    document.getElementsByClassName("total-price")[0].innerText =
      "$" + cartTotal;
  }
  updateCartIcon();
}

//Quantity changed in cart icon

function updateCartIcon() {
  var cartBoxes = document.getElementsByClassName("cart-box");
  var quantity = 0;

  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    quantity += parseInt(quantityElement.value);
  }
  var cartIcon = document.querySelector("#cart-icon");
  cartIcon.setAttribute("data-quantity", quantity);
}

