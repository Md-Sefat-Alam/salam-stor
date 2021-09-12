let data;
const loadProducts = () => {
  const url = `https://fakestoreapi.com/products`;
  // fetch(url)
  //   .then((response) => response.json())
  //   .then((data) => {
  //     showProducts(data);
  //     console.log(data)
  //     const localData = JSON.stringify(data);
  //     localStorage.setItem("data", localData)
  //   });
  const getLocalData = localStorage.getItem('data');
  data = JSON.parse(getLocalData);
  console.log(data)
};
loadProducts();

// show all product in UI 
const showProducts = (products) => {
  const allProducts = products.map((pd) => pd);
  for (const product of allProducts) {
    const image = product.image;
    const div = document.createElement("div");
    div.classList.add("product");

    div.innerHTML = `<div class="single-product">
                        <div>
                          <img class="product-image" src='${image}' alt="${product.title}"></img>
                        </div>
                        <h3>${product.title}</h3>
                        <p>Category: <span>${product.category}</span></p>

                        <div>
                          <span id="rateStars">
                            <i>${product.rating.rate}</i>
                          </span>

                          <span> count </span>
                          <span class="rating-count">
                            ${product.rating.count}
                          </span>
                        </div>

                        <h2>Price: $ ${product.price}</h2>
                        <button onclick="addToCart(${product.id},${product.price})" id="addToCart-btn" class="buy-now btn btn-success">add to cart</button>
                        <button id="details-btn" class="btn btn-danger">Details</button>
                      </div>`;


    document.getElementById("all-products").appendChild(div);
  }
};
let count = 0;
const addToCart = (id, price) => {
  count = count + 1;
  updatePrice("total", price);

  updateTaxAndCharge();
  document.getElementById("total-Products").innerText = count;
};

const getInputValue = (id) => {
  const element = document.getElementById(id).innerText;
  const converted = parseInt(element);
  return converted;
};

// main price update function
const updatePrice = (id, value) => {
  const convertedOldPrice = getInputValue(id);
  const convertPrice = parseFloat(value);
  const total = convertedOldPrice + convertPrice;
  document.getElementById(id).innerText = total.toFixed(2);
};

// set innerText function
const setInnerText = (id, value) => {
  document.getElementById(id).innerText = Math.round(value);
};

// update delivery charge and total Tax
const updateTaxAndCharge = () => {
  const priceConverted = getInputValue("price");
  if (priceConverted > 200) {
    setInnerText("delivery-charge", 30);
    setInnerText("total-tax", priceConverted * 0.2);
  }
  if (priceConverted > 400) {
    setInnerText("delivery-charge", 50);
    setInnerText("total-tax", priceConverted * 0.3);
  }
  if (priceConverted > 500) {
    setInnerText("delivery-charge", 60);
    setInnerText("total-tax", priceConverted * 0.4);
  }
};

//grandTotal update function
const updateTotal = () => {
  const grandTotal =
    getInputValue("price") + getInputValue("delivery-charge") +
    getInputValue("total-tax");
  document.getElementById("total").innerText = grandTotal;
};


// create rating stars dynamically change stars


/* 
<span>

                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>


                            <i class="fas fa-star-half-alt"></i>
                            
                            
                          </span>
                          
*/

document.getElementById('input-field').addEventListener('focus', () => {
  document.getElementById("input-field").style = `background-color: white;`
});
document.getElementById('input-field').addEventListener('blur', () => {
  document.getElementById("input-field").style = `background-color: rgba(240, 236, 236, 0.322);`
});
document.getElementById('search-btn').addEventListener('focus', () => {
  document.getElementById("search-btn").style = `background-color: rgba(255, 255, 255, 0.664);
  color:gray;
  outline: none;`
});
document.getElementById('search-btn').addEventListener('mousemove', () => {
  document.getElementById("search-btn").style = `background-color: rgba(255, 255, 255, 0.664);
  color:rgba(0, 128, 0, 0.63);
  box-shadow: inset 0px 0px 20px gray;
  outline: none;`
});
document.getElementById('search-btn').addEventListener('mouseout', () => {
  document.getElementById("search-btn").style = `background-color: rgba(255, 255, 255, 0.664);
  color:gray;
  box-shadow: inset 0px 0px 15px gray;
  outline: none;`
});
document.getElementById('search-btn').addEventListener('click', () => {
  const inputField = document.getElementById('input-field');
  const inputFieldText = inputField.value;
  if (inputFieldText) {
    document.title = inputFieldText + " - Salam Stor Search"
  }
  else {
    document.title = "Salam Stor"
  }
})


showProducts(data);