const container = document.getElementById('articleContent');
const containerBasket = document.querySelector('aside')


let dataCards = [];
let dataBasket = []

async function fetchDataCards() {
  try {
    const response = await fetch('./data.json');
    const data = await response.json();

    dataCards = data;
    renderCards(data);
  }
  catch (error) {
    console.error('Error fetching data:', error);
  }
}

function renderCards(data) {
  container.innerHTML = '';

  data.forEach (item => {
    const basketItem = dataBasket.find(el => el.name === item.name)
    const quantity = basketItem ? basketItem.quantity : 0;

    const cardButton = quantity > 0 
    ?`
      <div class="card__button-active card__button">
      <button class="card__button-active-decrement" data-name="${item.name}"></button>
        ${quantity}
      <button class="card__button-active-increment" data-name="${item.name}"></button>
      </div>
    `
    : `
      <button href="#" class="card__button card__button-notActive" data-name="${item.name}">
        Add to Cart
      </button>
    `;

    const card = `
      <div class="card" >
        <a class="card__img">
          <img src="${item.image.desktop}" alt="Dessert">
        </a>
        <div class="card__content">
          <h3 class="card__title">${item.category}</h3>
          <a href="#" class="card__description">${item.name}</a>
          <p class="card__price">$${item.price.toFixed(2)}</p>
          <div class="card__button__container">
            ${cardButton}
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', card);
  })
  // console.log(dataBasket)
}

function renderBasket() {
  const asideTitleCount = dataBasket.reduce((sum, el) => sum + el.quantity, 0)
  const asideTotalPrice = dataBasket.reduce((sum, el) => sum + (el.price * el.quantity), 0).toFixed(2)
  containerBasket.innerHTML = ""


  if(dataBasket.length === 0) {
    const basket =  `
      <h2 class="aside__title">Your Cart 
        <span class="aside__title__count" id="ordersCount">(${asideTitleCount})</span>
      </h2>
      <div class="order__empty">
        <img class="order__empty__icon" src="./assets/images/illustration-empty-cart.svg" alt="Empty Cart">
        <p class="order__empty__text">
          Your added items will appear here
        </p>
      </div>
    `
    containerBasket.insertAdjacentHTML('beforeend', basket)
  } else {

    const asideTitle = `
      <h2 class="aside__title">Your Cart 
        <span class="aside__title__count" id="ordersCount">(${asideTitleCount})</span>
      </h2>
    `

    const asideConfirm = `
      <div class="aside__confirm">
        <div class="aside__confirm__total">
          <span>Order Total</span>
          <strong id="totalPrice">
            $${asideTotalPrice}
          </strong>
        </div>
  
        <div class="aside__confirm__delivery">
          <img class="aside__confirm__delivery__icon" src="./assets/images/icon-carbon-neutral.svg" alt="Carbon Neutral">
          <p class="aside__confirm__delivery__text">
            This is a 
            <strong>carbon-neutral</strong>
            delivery
          </p>
        </div>
  
        <button class="aside__confirm__button">
          Confirm Order
        </button>
      </div>
    `
    containerBasket.insertAdjacentHTML('afterbegin', asideTitle)

    dataBasket.forEach(el => {
      const basketItem =`
        <div class="order__content">
          <div class="order__content__product">
            <div class="product__content">
              <a class="product__content__title" href="#">
                ${el.name}
              </a>
              <div class="product__content__counter">
                <span class="product__content__quantity">${el.quantity}x</span>
                <span class="product__content__price">$${el.price.toFixed(2)}</span>
                <span class="product__content__total">$${(el.price * el.quantity).toFixed(2)}</span>
              </div>
            </div>
            <button class="product__delete" data-name="${el.name}">
            </button>
          </div>
        </div>
      `
      containerBasket.insertAdjacentHTML('beforeend', basketItem)
    })
    containerBasket.insertAdjacentHTML('beforeend', asideConfirm)
  }
}

function addToBasketArr (item) {
  if (dataBasket.some(element => element.name === item.name)) {
    dataBasket.find(element => element.name === item.name).quantity += 1;

  } else {
    const itemWithQuantity = { ...item, quantity: 1 };
    dataBasket.push(itemWithQuantity);
  }

  renderCards(dataCards)
}

container.addEventListener('click', (event) => {

  if (event.target.closest('.card__button-notActive')) {
    const name = event.target.dataset.name;
    const item = dataCards.find(card => card.name === name )
    
    addToBasketArr(item);
    renderBasket()
  }

  if (event.target.closest('.card__button-active-increment')) {
    const name = event.target.closest('.card__button-active-increment').dataset.name;
    const item = dataBasket.find(el => el.name === name)
    item.quantity += 1

    renderCards(dataCards);
    renderBasket()
  }

  if (event.target.closest('.card__button-active-decrement')) {
    const name = event.target.closest('.card__button-active-decrement').dataset.name;
    const item = dataBasket.find(el => el.name === name)
    
    if(item) {
      item.quantity -= 1

      if(item.quantity === 0) {
        dataBasket = dataBasket.filter(el => el.name !== name );
      }
    }

    renderCards(dataCards);
    renderBasket()
  }

});
containerBasket.addEventListener('click', (event) => {
  if(event.target.closest(".product__delete")) {
    const name = event.target.closest('.product__delete').dataset.name

    dataBasket = dataBasket.filter(el => el.name !== name)

    renderBasket()
    renderCards(dataCards);
  }
})


fetchDataCards()
renderBasket()