const container = document.getElementById('articleContent');

console.log("js")

async function fetchDataCards() {
  try {
    const response = await fetch('./data.json');
    const data = await response.json();

    console.log(data)
  }
  catch (error) {
    console.error('Error fetching data:', error);
  }
}

// fetchDataCards()