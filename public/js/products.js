// const radioGroup = document.getElementById("radio-group");
const size = document.getElementById("dropdown-size");
const producttype = document.getElementById("dropdown-producttype");
var opengen = 0;
var opensize = 0;
var openprod = 0;

// function displayGender() {
//   if (opengen == 0) {
//     radioGroup.style.display = "block";
//     opengen = 1;
//   } else {
//     radioGroup.style.display = "none";
//     opengen = 0;
//   }
// }

function displaySize() {
  if (opensize == 0) {
    size.style.display = "block";
    opensize = 1;
  } else {
    size.style.display = "none";
    opensize = 0;
  }
}
function displayProduct() {
  if (openprod == 0) {
    producttype.style.display = "block";
    openprod = 1;
  } else {
    producttype.style.display = "none";
    openprod = 0;
  }
}
const productContainer = document.getElementById("product-container");

const searchInput = document.getElementById("search-bar");
searchInput.addEventListener("input", function () {
  const searchTerm = this.value.trim(); // Trim whitespace
  const filteredProducts = filterProducts2(searchTerm);

  updateProductList(filteredProducts);
});

function filterProducts2(searchTerm) {
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()));  //includes btt2aked en 7ata a letter matches a product
    return filteredProducts;
}

function updateProductList(filteredProducts) {
  const productContainer = document.getElementById("product-container");
  productContainer.innerHTML = ""; //3shan afady el products-container
  makeCards(filteredProducts);
}


function makeCards(productsList) {
  // let j = 0;
  products.forEach((product)=> {
    // Create product div
    var btn = document.createElement("button");
    // btn.id = "prod" + j;
    btn.classList.add("card");
    // Add product details
    var image = document.createElement("img");
    image.src = product.image_path;
    image.classList.add("img");
    btn.appendChild(image);

    var tooltiptext = document.createElement("span");
    tooltiptext.textContent = product.name;
    tooltiptext.classList.add("tooltiptext");
    btn.appendChild(tooltiptext);

    var name = document.createElement("p");
    name.textContent = product.name;
    name.classList.add("text");
    btn.appendChild(name);

    var price = document.createElement("p");
    price.textContent = "Price: " + product.price + " EGP";
    price.classList.add("price");
    btn.appendChild(price);

    var sizes = document.createElement("p");
    sizes.textContent = "Sizes: " + product.size.join(", ");
    sizes.classList.add("sizes");
    btn.appendChild(sizes);

    // Append product div to container
    btn.addEventListener("click", () => {
      showItem(product.id);
    });
    productContainer.appendChild(btn);
    // j++;
  });
  window.history.pushState({ id: 1 }, null, null);
}
//makeCards(products);


//---------------------------TO DISPLAY ALL PRODUCTS WITH FILTERS CHOSEN BY USER---------------------//
function filterProducts() {
  let fileteredProducts = new Set([]);
  productContainer.innerHTML = "";
  for (let i = 0; i < clothes.length; i++) {
    if ( //change clothes[i] with Products
      clothes[i].sizes.toUpperCase() == sizeSelected.toUpperCase() ||
      clothes[i].type.toUpperCase() == prodSelected.toUpperCase()
    ) {
      for (let j = 0; j < clothes[i].size.length; j++) {
        if (clothes[i].size[j].toUpperCase == sizeSelected.toUpperCase) {
          fileteredProducts.add(clothes[i]);
        }
      }
    }
  }
  makeCards(fileteredProducts);
  if (productContainer.innerHTML == "") {
    var name = document.createElement("p");
    name.textContent = "No searches found..";
    name.classList.add("text");
    productContainer.appendChild(name);
  }
}
let sizeIsSelected=0;//to check if a size is selected or not


function showItem(item) {
  
 // let number = parseInt(extractNumber(id));
  var product = document.createElement("div");
  product.classList.add("productDetails");

  var photosContainer = document.createElement("div");
  photosContainer.classList.add("photosContainer");

  var image = document.createElement("img");
  image.src = item.image1;
  image.classList.add("image");
  photosContainer.appendChild(image);
  var image2 = document.createElement("img");
  image2.src = item.image2;
  image2.classList.add("image");
  photosContainer.appendChild(image2);
  var image3 = document.createElement("img");
  image3.src = item.image3;
  image3.classList.add("image");
  photosContainer.appendChild(image3);

  var details = document.createElement("div");
  details.classList.add("details");

  var heartIcon = document.createElement("i");
  heartIcon.innerHTML =
    '<a><i class="fa-regular fa-heart"></i></a>';
  details.appendChild(heartIcon);

  var name = document.createElement("p");
  name.classList.add("name");
  name.textContent = item.name;
  details.appendChild(name);

  var itemSizes = document.createElement("p");
  itemSizes.classList.add("itemSizes");
  for (let i = 0; i < item.size.length; i++) {
    console.log(item.size[i]);
    var sizesButtons = document.createElement("button");
    sizesButtons.textContent=item.size[i];
    sizesButtons.classList.add("sizesButtons");
    sizesButtons.id="size"+i;
    sizesButtons.addEventListener("click", () => {
      colorUp("size"+i);
    });
    itemSizes.appendChild(sizesButtons);
  }
  details.appendChild(itemSizes);

  var quantityDiv = document.createElement("div");
  quantityDiv.classList.add("quantityDiv");
  var quantity = document.createElement("p");
  quantity.textContent = "1";
  quantity.id = "quantityID";

  var quantityBtn = document.createElement("button");
  quantityBtn.innerHTML = '<i class="fa-solid fa-caret-up"></i>';
  quantityBtn.classList.add("quantityBtn");
  quantityBtn.addEventListener("click", () => {
    incNumber("quantityID");
  });

  var quantityDownBtn = document.createElement("button");
  quantityDownBtn.innerHTML = '<i class="fa-solid fa-caret-down"></i>';
  quantityDownBtn.classList.add("quantityBtn");
  quantityDownBtn.addEventListener("click", () => {
    decNumber("quantityID");
  });

  quantityDiv.appendChild(quantity);
  quantityDiv.appendChild(quantityDownBtn);
  quantityDiv.appendChild(quantityBtn);
  details.appendChild(quantityDiv);

  var price = document.createElement("p");
  price.classList.add("itemPrice");
  price.textContent = clothes[number].price + " EGP";
  details.appendChild(price);

  var addToCartBtn = document.createElement("button");
  addToCartBtn.classList.add("addToCartBtn");
  addToCartBtn.textContent = "Add To Cart";
  addToCartBtn.addEventListener("click", () => {
    //if size is selected and quantity>0
    if(sizeIsSelected==1){
    incCartNumber("Cart-Quantity");}
    else{
      alert("You should choose Size and Quantity");
    }
  });
  addToCartBtn.addEventListener("click", () => {
    addToArray(number);
  });
  details.appendChild(addToCartBtn);

  product.appendChild(photosContainer);
  product.appendChild(details);

  //append photos div and details div on productdetails and productdetails to page div
  let fullpage = document.getElementById("fullpage");
  fullpage.innerHTML = "";

  // var continueShoppingDiv=document.createElement("div");
  var continueShopping = document.createElement("button");
  continueShopping.id="continueShopping";
  continueShopping.textContent="Continue Shopping";
  continueShopping.addEventListener("click", function(){
    
    window.open("productsPage.html", "_self");
    printDetails();

  });

  // continueShopping.innerHTML='<a href="productsPage.html">Continue Shopping</a>';
  fullpage.appendChild(continueShopping);
  fullpage.appendChild(product);
}








function extractNumber(id) {
  let str = id;
  let number = str.match(/\d+/g);
  return number;
}


function colorUp(id) {
  let sizesButtons=document.getElementsByClassName("sizesButtons");
  for(let i=0; i<sizesButtons.length; i++){
    if(document.getElementById("size"+i).style.backgroundColor=="rgb(0, 58, 205)"){
      document.getElementById("size"+i).style.backgroundColor="white"
    }
  }
  document.getElementById(id).style.backgroundColor="rgb(0, 58, 205)";
  sizeIsSelected=1;
}

//-------------------------------TO APPLY FILTERS SEARCH CHOSEN BY USER-------------------------//
let sizeSelected = "hi";
let prodSelected = "hi";

function searchProduct() {
  let siz = document.getElementsByName("size");
  let prod = document.getElementsByName("prod");

  for (let i = 0; i < siz.length; i++) {
    if (siz[i].checked) {
      sizeSelected = siz[i].value;
      //get all products with this size
    }
  }
  for (let i = 0; i < prod.length; i++) {
    if (prod[i].checked) {
      prodSelected = prod[i].value;
      //get all pr+oducts with this type
    }
  }
  fetch('/filter-products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      size: sizeSelected,
      type: prodSelected,
    }),
  })
  .then(response => response.json())
  .then(data => {
    displayFilteredProducts(data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });}

  function displayFilteredProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = ''; // Clear previous products
  
    products.forEach(product => {
      const card = document.createElement('a');
      card.className = 'card';
      card.href = `/products/${product.id}`;
      
      const img = document.createElement('img');
      img.src = product.image1;
      img.className = 'img';
      card.appendChild(img);
      
      const tooltip = document.createElement('span');
      tooltip.className = 'tooltiptext';
      tooltip.textContent = product.name;
      card.appendChild(tooltip);
      
      const name = document.createElement('p');
      name.className = 'text';
      name.textContent = product.name;
      card.appendChild(name);
      
      const price = document.createElement('p');
      price.className = 'price';
      price.textContent = `Price: ${product.price} EGP`;
      card.appendChild(price);
      
      container.appendChild(card);
    });
  }

// let counter = document.getElementById("counter")
// counter.addEventListener("click", func);
function incNumber(id) {
  var quantity = document.getElementById(id);
  let number = parseInt(quantity.innerText);
  quantity.innerHTML = number + 1;
}
function decNumber(id) {
  var quantity = document.getElementById(id);
  let number = parseInt(quantity.innerText);
  if (number > 0) quantity.innerHTML = number - 1;
}

function incCartNumber(CartId) {
  var quantitySelected = document.getElementById("quantityID");
  let number = parseInt(quantitySelected.innerText);

  var Cart = document.getElementById(CartId);
  let CartQuantity = parseInt(Cart.innerText);
  Cart.innerHTML = number + CartQuantity;
}

function addToArray(index){
  let quantity=document.getElementById("quantityID");
let number=parseInt(quantity.textContent);

let sizesButtons=document.getElementsByClassName("sizesButtons");
let sizeChosen="f";
  for(let i=0; i<sizesButtons.length; i++){
    if(document.getElementById("size"+i).style.backgroundColor=="rgb(0, 58, 205)"){
      sizeChosen=document.getElementById("size"+i).textContent;
      console.log(document.getElementById("size"+i).textContent +" is the size chosen");
    }
  }
  
  cart.push({
  size:sizeChosen,price:clothes[index].price,
    type: clothes[index].type, name: clothes[index].name, quantity:number,image:clothes[index].image_path});
    localStorage.setItem('cart', JSON.stringify(cart));
}

function printDetails(){
  let storedCart = JSON.parse(localStorage.getItem('cart'));
  for(let i=0; i<storedCart.length; i++){
    console.log(storedCart[i].size + storedCart[i].price + storedCart[i].type + storedCart[i].name + storedCart[i].quantity + storedCart[i].image);
  }
  
}
let quantity=0;
if(cart.length>0){
    for(let i=0; i<cart.length; i++){
        quantity+=cart[i].quantity;
    }
  var Cart = document.getElementById("Cart-Quantity");
  Cart.innerHTML = quantity;
}

function clearCart(){  cart=[];
  localStorage.removeItem('cart');
//and cart-quantity=0
var Cart = document.getElementById("Cart-Quantity");
Cart.innerHTML = "0";
}
  
