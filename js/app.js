let data;
let productsSelectedId = [];
let itemPrice = 0;
const loadProducts = () => {
  const url = `https://fakestoreapi.com/products`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // showProducts(data);
      // console.log(data)
      // const localData = JSON.stringify(data);
      // localStorage.setItem("data", localData)
    });
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
                        <button onclick="addToCart(${product.id}, ${product.price})" id="addToCart-btn" class="buy-now btn btn-success">add to cart</button>
                        <button id="details-btn" class="btn btn-danger">Details</button>
                      </div>`;
    document.getElementById("all-products").appendChild(div);
  }
};

const addToCart = (id, price) => {
  // console.log(id)
  // console.log(price)
  // count = count + 1;
  // updatePrice("total", price);
  // updateTaxAndCharge();

  itemPrice = price;

  if (!productsSelectedId.includes(id)) {
    productsSelectedId.push(id);
  }

  document.getElementById("total-Products").innerText = productsSelectedId.length;
  showSelectedItem(productsSelectedId);
};


const showSelectedItem = (selectedId) => {
  const selectedItemDetail = document.getElementById('selectedItemDetail');
  selectedItemDetail.textContent = '';
  for (const singleId of selectedId) {
    for (const serverId of data) {
      if (singleId === serverId.id) {
        const tr = document.createElement('tr');
        tr.style = 'background-color: rgb(245, 241, 241);'
        tr.innerHTML = `
      <td>
        <p id="product Id">productId: <span style="color: black; font-weight: bold;">${serverId.id}</span></p>
        <p title="Catagory">Cat. <span style="color: black; font-weight: bold;">${serverId.category}</span></p>
      </td>

      <td>
        <p title="Quantity">Q. <span style="color: black; font-weight: bold;"><input class="quantityValue" min="1" max="5"
              type="number" style="width: 35px; " value="1"></span></p>

        <p>Price: <span class = 'productPriceing' style="color: black; font-weight: bold;">${serverId.price}</span></p>
        
      </td>`
        selectedItemDetail.appendChild(tr);
        const changeToSelect = window.event.target.parentNode;
        changeToSelect.style = "border: 1px solid lightgray; border-radius: 20px;box-shadow: inset 1px 1px 30px gray;";
      }
    }
  }
  updateSubTotal();
}

// create subtotal value and set it
const updateSubTotal = () => {
  const getSubTotal = document.querySelectorAll('.productPriceing');
  let subTotal = 0;
  for (const singlePrice of getSubTotal) {
    subTotal += parseFloat(singlePrice.innerText)
  }

  if (productsSelectedId.length !== 0) {
    document.getElementById('subTotalShow').style = 'visibility: visible;background-color: rgba(0, 0, 0, 0.355); color: white;'
  }
  document.getElementById('subTotal').innerText = subTotal.toFixed(2);
  updateTaxAndCharge();
  updateTotal();
}

// try to find by id price
const productPrice = (getId) => {
  const getIdInt = parseInt(getId);
  let price = 0;
  for (const serverId of data) {
    if (getIdInt === serverId.id) {
      price = serverId.price;
    }
  }
  return parseFloat(price);
}


document.getElementById("selectedItemDetail").addEventListener('click', function (event) {

  if (event.target.classList[0] === 'quantityValue') {
    const getQuantity = event.target.value
    const priceParent = event.target.parentNode.parentNode.parentNode;
    //get product id for identify uniquely
    const productId = event.target.parentNode.parentNode.parentNode.parentNode.
      childNodes[1].childNodes[1].childNodes[1].innerText;

    const mainPrice = productPrice(productId);
    console.log(mainPrice)

    //get price element for change it
    const selectPrice = priceParent.childNodes[3].childNodes[1]
    const getQuantityNumber = parseInt(getQuantity);

    const result = mainPrice * getQuantityNumber;
    selectPrice.innerText = result;
    //update total value
    updateSubTotal();
  }
})


const getInputValue = (id) => {
  const element = document.getElementById(id).innerText;
  const converted = parseFloat(element);
  return converted;
};

// main price update function
const updatePrice = (id, value) => {
  const convertedOldPrice = getInputValue(id);
  const convertPrice = parseFloat(value);
  const total = convertedOldPrice + convertPrice;
  document.getElementById(id).innerText = total;
};

// set innerText function
const setInnerText = (id, value) => {
  document.getElementById(id).innerText = value.toFixed(2);
};

// update delivery charge and total Tax 
const updateTaxAndCharge = () => {
  const priceConverted = getInputValue("subTotal");
  if (priceConverted <= 200) {
    setInnerText("delivery-charge", 20);
    setInnerText("total-tax", priceConverted * 0.2);
  }
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
  const subTotal = getInputValue('subTotal');
  const deliveryCharg = getInputValue('delivery-charge');
  const totalTax = getInputValue('total-tax');

  const grandTotal = subTotal + deliveryCharg + totalTax;
  document.getElementById("total").innerText = grandTotal.toFixed(2);
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

// document.getElementById('input-field').addEventListener('focus', () => {
//   document.getElementById("input-field").style = `background-color: lightgray;`
// });
// document.getElementById('input-field').addEventListener('blur', () => {
//   document.getElementById("input-field").style = `background-color: rgba(240, 236, 236, 0.322);`
// });
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