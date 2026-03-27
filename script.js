const container = document.getElementById('articleContent');
const containerBasket = document.querySelector('.aside')
const modalBtn = document.getElementById('modalBtn');
const modal = document.getElementById('modal');

let dataCards = [];
let dataBasket = []

async function fetchDataCards() {
  try {
    const response = await fetch('./data.json');
    const data = await response.json();

    dataCards = data;
    updateUI();
  }
  catch (error) {
    console.error('Error fetching data:', error);
  }
}

function updateUI() {
  renderCards(dataCards)
  renderBasket()
}

function changeQuantity(name, delta) {
  const itemInBasket = dataBasket.find(el => el.name === name);

  if(itemInBasket) {
    itemInBasket.quantity += delta
    if(itemInBasket.quantity <= 0) {
      dataBasket = dataBasket.filter(el => el.name !== name)
    }
  } else if (delta > 0) {
    const product = dataCards.find(el => el.name === name)
    if (product) {
      dataBasket.push({...product, quantity: 1 })
    }
  }

  updateUI()
}

function calculateTotal() {
  return dataBasket.reduce((sum, el) => sum + (el.price * el.quantity), 0).toFixed(2)
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
        <a class="card__img ${quantity > 0 ?  'active' : ''}">
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
}

function renderBasket() {
  const asideTitleCount = dataBasket.reduce((sum, el) => sum + el.quantity, 0)

  containerBasket.innerHTML = `
    <h2 class="aside__title">Your Cart 
      <span class="aside__title__count" id="ordersCount">(${asideTitleCount})</span>
    </h2>
  `

  if(dataBasket.length === 0) {
    const basket =  `
      <div class="order__empty">
        <img class="order__empty__icon" src="./assets/images/illustration-empty-cart.svg" alt="Empty Cart">
        <p class="order__empty__text">
          Your added items will appear here
        </p>
      </div>
    `
    containerBasket.insertAdjacentHTML('beforeend', basket)
  } else {
    dataBasket.forEach(el => {
      const basketItem =`
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
      `
      containerBasket.insertAdjacentHTML('beforeend', basketItem)
    })
    const asideConfirm = `
      <div class="aside__confirm">
        <div class="aside__confirm__total">
          <span>Order Total</span>
          <strong id="totalPrice">
            $${calculateTotal()}
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
    containerBasket.insertAdjacentHTML('beforeend', asideConfirm)
  }
}

function schowModal() {
  const modalOrdersList = document.querySelector('.modal__orders__container')
  const modalOrdersTotal = document.querySelector('.total__price')

  modalOrdersList.innerHTML = ''

  const ordersHTML = dataBasket.map(el => `
    <div class="modal__orders__product">
      <div class="product__img">
        <img src="${el.image.thumbnail}" alt="${el.name}">
      </div>
      <div class="product__content">
        <p class="product__content__name">${el.name}</p>
        <span class="product__content__count">${el.quantity}x</span>
        <span class="product__content__price">$${el.price.toFixed(2)}</span>
      </div>
      <div class="product__total">$${(el.price * el.quantity).toFixed(2)}</div>
    </div>
  `).join('')

  modalOrdersList.innerHTML = ordersHTML
  modalOrdersTotal.textContent = `$${calculateTotal()}`

  modal.classList.add('active')
  document.body.style.overflow = 'hidden'
}

container.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-name]')

  if (!btn) return

  const name = btn.dataset.name

  if (event.target.closest('.card__button-notActive') || event.target.closest('.card__button-active-increment')) {
    changeQuantity(name, 1)
  } else if(event.target.closest('.card__button-active-decrement')) {
    changeQuantity(name, -1)
  }
})

containerBasket.addEventListener('click', (event) => {
  const deleteBtn = event.target.closest('.product__delete')
  const confirmButton = event.target.closest('.aside__confirm__button')

  if(deleteBtn) {
    const name = deleteBtn.dataset.name

    dataBasket = dataBasket.filter(el => el.name !== name)
    updateUI()
  }

  if (confirmButton) {
    schowModal()
  }
})

modalBtn.addEventListener('click', () => {
  dataBasket = []
  modal.classList.remove('active')
  document.body.style.overflow = ''
  updateUI()
})


fetchDataCards()