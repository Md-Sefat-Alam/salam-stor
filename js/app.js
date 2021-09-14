let data;
let productsSelectedId = [];
let itemPrice = 0;


// loader show or hidden by function
const loader = loadingStatus => {
  const loaderElement = document.getElementById('loader')
  if (loadingStatus === 'start') {
    loaderElement.style.display = 'block';
  }
  else {
    loaderElement.style.display = 'none';
  }
}


const loadProducts = () => {
  //start loader
  loader('start');
  const url = `https://fakestoreapi.com/products`;
  fetch(url)
    .then((response) => response.json())
    .then((serverData) => {
      document.getElementById("all-products").textContent = "";
      showProducts(serverData);
    });
};
loadProducts();

// show all product in UI 
const showProducts = (products) => {
  // set all product to data because ints need bellow
  data = products;
  const allProducts = products.map((pd) => pd);
  for (const product of allProducts) {
    const image = product.image;
    const div = document.createElement("div");
    div.classList.add("product");

    div.innerHTML = ` <div class="single-product">
                          <div id="productId"
                          style="text-align: left;margin-left:30px; font-size: 20px; font-weight: bolder; color: gray; cursor: pointer;">
                          Id-
                          <span>${product.id}</span>
                        </div>
                        <div>
                          <img class="product-image" src='${image}' alt="${product.title}"></img>
                        </div>
                        <h3>${product.title}</h3>
                        <p>Category: <span>${product.category}</span></p>
                        <div>
                          <span class="rateStars">
                            ${getRatingStars(product.rating.rate)}(${product.rating.rate})
                          </span>
                          
                          <span class="rating-count">
                            (${product.rating.count})
                          </span>
                        </div>
                        <h2>Price: $ ${product.price}</h2>
                        <button onclick="addToCart(${product.id}, ${product.price})" id="addToCart-btn" class="buy-now btn btn-success">add to cart</button>
                        <button class="btn btn-danger">Details</button>
                      </div>`;
    document.getElementById("all-products").appendChild(div);
  }
  // stop loader
  loader('stop');
};

//add to cart function handle cart
const addToCart = (id, price) => {
  itemPrice = price;
  if (!productsSelectedId.includes(id)) {
    productsSelectedId.push(id);
  }
  document.getElementById("total-Products").innerText = productsSelectedId.length;
  showSelectedItem(productsSelectedId);
};


// get rating stars
const getRatingStars = (rate) => {
  const rateStars = parseInt(rate);
  const getFractions = parseInt((rate % rateStars) * 10);
  switch (rateStars) {
    case 0:
      return;
    case 1:
      if (getFractions > 4) {
        return "<i class='fas fa-star'></i> <i class='fas fa-star-half-alt'></i>"
      }
      return "<i class='fas fa-star'></i>"
    case 2:
      if (getFractions > 4) {
        return "<i class='fas fa-star'></i><i class='fas fa-star'></i> <i class='fas fa-star-half-alt'></i>"
      }
      return "<i class='fas fa-star'></i><i class='fas fa-star'></i>"
    case 3:
      if (getFractions > 4) {
        return "<i class='fas fa-star'></i><i class='fas fa-star'></i></i><i class='fas fa-star'></i> <i class='fas fa-star-half-alt'></i>"
      }
      return "<i class='fas fa-star'></i><i class='fas fa-star'></i><i class='fas fa-star'></i>"
    case 4:
      if (getFractions > 4) {
        return "<i class='fas fa-star'><i class='fas fa-star'></i><i class='fas fa-star'></i></i><i class='fas fa-star'></i> <i class='fas fa-star-half-alt'></i>"
      }
      return "<i class='fas fa-star'></i><i class='fas fa-star'></i><i class='fas fa-star'></i><i class='fas fa-star'></i>"
    case 5:
      return "<i class='fas fa-star'></i><i class='fas fa-star'></i><i class='fas fa-star'></i><i class='fas fa-star'></i><i class='fas fa-star'></i>"
  };

  //  " <i class='fas fa-star-half-alt'></i>"

  // return "<i class='fas fa-star'></i><i class='fas fa-star'></i>";
}

//showing selected item on cart
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
        <p title="Quantity">Q. <span style="color: black; font-weight: bold;"><input class="quantityValue" min="1" max="10"
              type="number" style="width: 40px; border-radious: 5px " value="1"></span>  <span style="color: red; cursor:pointer; font-weight: bold" title="cancle" id="cancle-${singleId}" onclick="productSelectCancle()">X</span></p>

        <p>Price: <span class = 'productPriceing' style="color: black; font-weight: bold;">${serverId.price}</span></p>
        
      </td>`
        selectedItemDetail.appendChild(tr);
        const changeToSelect = window.event.target.parentNode;
        changeToSelect.style = "border: 1px solid lightgray; border-radius: 20px;box-shadow: inset 1px 1px 30px gray;";
      }
    }
  }
  //calling for update subtotal
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

// try to find price by id 
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


// working for quantity
document.getElementById("selectedItemDetail").addEventListener('click', function (event) {

  if (event.target.classList[0] === 'quantityValue') {
    const getQuantity = event.target.value
    const priceParent = event.target.parentNode.parentNode.parentNode;
    //get product id for identify uniquely
    const productId = event.target.parentNode.parentNode.parentNode.parentNode.
      childNodes[1].childNodes[1].childNodes[1].innerText;

    const mainPrice = productPrice(productId);

    //get price element for change it
    const selectPrice = priceParent.childNodes[3].childNodes[1]
    const getQuantityNumber = parseInt(getQuantity);

    const result = mainPrice * getQuantityNumber;
    selectPrice.innerText = result.toFixed(2);
    //update total value
    updateSubTotal();
  }


  // close selected item
  if (event.target.innerText === "X") {
    const priceParent = event.target.parentNode.parentNode.parentNode;
    //get price element for change it
    const selectInputField = priceParent.childNodes[3].childNodes[1].childNodes[1].childNodes[0]
    selectInputField.value = 0;
    const selectPrice = priceParent.childNodes[3].childNodes[3].childNodes[1]
    const result = 0
    selectPrice.innerText = result;
    // update total value
    updateSubTotal();
  }
})

// if write on quantity it will be changed
function productSelectCancle() {
  event.target.parentNode.childNodes[1].childNodes[0].value = 0;
  // event.target.parentNode.childNodes[1].childNodes[0].style.backgroundColor = 'red'
}

//if write on quantity it will be changed
document.getElementById("selectedItemDetail").addEventListener('keyup', function (event) {

  if (event.target.classList[0] === 'quantityValue') {
    let getQuantity = event.target.value
    if (getQuantity < 0) {
      event.target.style.backgroundColor = 'tomato';
      getQuantity = 0;
      return;
    }
    if (getQuantity === "") {
      getQuantity = 0;
    }
    event.target.style.backgroundColor = 'white';
    const priceParent = event.target.parentNode.parentNode.parentNode;
    //get product id for identify uniquely
    const productId = event.target.parentNode.parentNode.parentNode.parentNode.
      childNodes[1].childNodes[1].childNodes[1].innerText;

    const mainPrice = productPrice(productId);

    //get price element for change it
    const selectPrice = priceParent.childNodes[3].childNodes[1]
    const getQuantityNumber = parseInt(getQuantity);

    const result = mainPrice * getQuantityNumber;
    selectPrice.innerText = result.toFixed(2);
    //update total value
    updateSubTotal();
  }

})

//get element innerText float value
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
  if (priceConverted == 0) {
    setInnerText("delivery-charge", 0);
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

//try to search box fency
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


//add carousel [detail button action]
const carousel = document.getElementById('carousel');
document.getElementById('all-products').addEventListener('click', function (event) {

  if (event.target.innerText === "Details") {
    loader('start');
    const productId = event.target.parentNode.childNodes[1].childNodes[1].innerText;
    const productIdNum = parseInt(productId);

    fetch(`https://fakestoreapi.com/products/${productIdNum}`)
      .then(res => res.json())
      .then(data => {
        //carousel display block
        carousel.style.display = 'block'
        carouselDataLoad(data)
      })
  }
})

// carouselDataLoad and show
const carouselDataLoad = (carouselData) => {
  carousel.innerHTML = `
  <div id="carouselInfo" style="position: relative;">
  <span style="display: block; text-align: center; font-size: 20px;">
    Id: <span style="font-size: 30px; font-weight: bold; color: gray;">${carouselData.id}</span>
  </span>
  <div style="display: flex; justify-content: center; transform: rotate(5deg);">
    <img height="150px" src='${carouselData.image}' alt="">
  </div>
  
    <p style="width: 95%; margin: 10px auto;color: black; font-size: 20px;">Title: <span style="color: gray; font-weight: bold;">${carouselData.title}</span></p>

    <div style="width: 95%; display: flex; flex-direction: column; margin: 30px auto; max-height: 200px;  overflow-y: scroll;">

    <p style="color: black; font-size: 15px;">Category: <span style="color: gray; font-weight: bold;">${carouselData.category}</span></p>
    <p style="color: black; font-size: 15px;">description: <span>${carouselData.description}</span></p>
  </div>
  <div onclick="carouselClose()"
    style="position: absolute; top: 10px; right: 15px; font-size: 20px; font-weight: bolder; color: red; cursor: pointer;">
    X
  </div>
</div>
`
  loader('stop');
}
// click close carouse display none
const carouselClose = () => {
  carousel.style.display = 'none'
}

