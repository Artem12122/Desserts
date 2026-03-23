const container = document.getElementById('articleContent');
let dataCards = [];
let dataBasket = []

async function fetchDataCards() {
  try {
    const response = await fetch('./data.json');
    const data = await response.json();

    dataCards = data;
    renderCards(data);
    return data;
  }
  catch (error) {
    console.error('Error fetching data:', error);
  }
}

function renderCards(data) {
  container.innerHTML = '';

  data.forEach (item => {
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
            <button href="#" class="card__button card__button-notActive" data-name="${item.name}">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', card);
  })
}

function addToBasketArr (item) {
  if (dataBasket.some(element => element.name === item.name)) {
    dataBasket.find(element => element.name === item.name).quantity += 1;
  } else {
    const itemWithQuantity = { ...item, quantity: 1 };
    dataBasket.push(itemWithQuantity);
  }
}

container.addEventListener('click', (event) => {

  if (event.target.closest('.card__button')) {
    const name = event.target.dataset.name;
    const item = dataCards.find(card => card.name === name )
    
    addToBasketArr(item);
  }
});


fetchDataCards()