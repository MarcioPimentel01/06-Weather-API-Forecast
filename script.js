const APIKey = "15cc27ace4d4eac55708dcf5dd1ea30d";
const _btnSearch = document.getElementById('btnSearch');
const _dropdownSearch = document.querySelectorAll('.dropdown-menu-dark');
const _inputSearch = document.getElementById('inputSearch');
const _cards = document.getElementById('forecastDiv');
const _banner = document.getElementById('bannerDiv');
const _buttons = document.querySelectorAll('.btn-light');
const _clearHistory = document.getElementById('clearHistory');
const _dropdownMenu = document.querySelector('.dropdown-menu');

// Retrieve cities from localStorage or initialize to an empty array
let cities = JSON.parse(localStorage.getItem('cities')) || [];

// Load the last search menu on page load
document.addEventListener('DOMContentLoaded', () => {
  cities.forEach(city => {
    addCityToMenu(city);
  });

  if (cities.length > 0) {
    fetchData(cities[0])
      .then(data => {
        displayforecastInfo(data);
        displayBanner(data);
      })
      .catch(error => console.error(error));
  }
});

// ========================================================================================================================
//                             Event Listeners
// ========================================================================================================================

_btnSearch.addEventListener('click', async (ev) => {
  ev.preventDefault();
  const city = _inputSearch.value.trim();

  if (city) {
    try {
      const forecastData = await fetchData(city);
      cities.unshift(city);
      localStorage.setItem('cities', JSON.stringify(cities));
      localStorage.setItem('forecastData', JSON.stringify(forecastData));
      displayforecastInfo(forecastData);
      displayBanner(forecastData);
      addCityToMenu(city);
    } catch (error) {
      console.error(error);
      displayError(error.message);
    }
  }
});

_buttons.forEach((button) => {
  button.addEventListener('click', async (clickEvent) => {
    const cityName = clickEvent.target.textContent;
    if (cityName) {
      try {
        const forecastData = await fetchData(cityName);
        cities.unshift(cityName);
        localStorage.setItem('cities', JSON.stringify(cities));
        localStorage.setItem('forecastData', JSON.stringify(forecastData));
        displayforecastInfo(forecastData);
        displayBanner(forecastData);
        addCityToMenu(cityName);
      } catch (error) {
        console.error(error);
        displayError(error.message);
      }
    }
  });
});

_clearHistory.addEventListener('click', () => {
  clearAllSearches();
});

// ==================================================================================================================================
//                             Async Function
// ==================================================================================================================================

async function fetchData(city) {
  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Unable to fetch information at this moment");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// =====================================================================================================================================
//                             Functions
// =====================================================================================================================================

function addCityToMenu(city) {
  const menuItem = document.createElement('li');
  menuItem.classList.add('dropdown-item');
  menuItem.textContent = city;
  _dropdownMenu.appendChild(menuItem);
  menuItem.addEventListener('click', async () => {
    try {
      const forecastData = await fetchData(city);
      displayforecastInfo(forecastData);
      displayBanner(forecastData);
    } catch (error) {
      console.error(error);
      displayError(error.message);
    }
  });
}

function displayforecastInfo(data) {
  const { city: { name }, list } = data;
  _cards.innerHTML = "";

  const indicesToDisplay = [7, 15, 23, 31, 39];
  indicesToDisplay.forEach(index => {
    const forecastEntry = list[index];
    if (forecastEntry) {
      const { main: { temp, humidity }, weather: [{ description, id }], dt_txt } = forecastEntry;

      const cardDisplay = document.createElement('div');
      cardDisplay.classList.add('card', 'mb-3');
      cardDisplay.innerHTML = `
        <div class="card" style="width: 17rem;">
          <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${description}</h6>
            <p class="card-text" id="emoji"><img width="120" height="120" src="${getApiEmoji(id)}" alt="weather-icon"/></p>
            <p class="card-text">Temperature: ${((temp - 273.15) * (9 / 5) + 32).toFixed(1)}°F</p>
            <p class="card-text">Humidity: ${humidity}%</p>
            <p class="card-text">Date Time: ${dt_txt}</p>
          </div>
        </div>`;
      _cards.appendChild(cardDisplay);
    }
  });
}

function displayBanner(data) {
  const { city: { name }, list } = data;
  _banner.innerHTML = "";
  const index = 0;
  const bannerInfo = list[index];

  if (bannerInfo) {
    const { main: { temp, humidity }, weather: [{ description, id }], dt_txt } = bannerInfo;

    const bannerDisplay = document.createElement('div');
    bannerDisplay.classList.add('card', 'mb-3');
    bannerDisplay.innerHTML = `
      <div class="card">
        <div class="card-body" id="banner">
          <h5 class="card-title">${name}</h5>
          <h6 class="card-subtitle mb-3 text-muted">${description}</h6>
          <p class="card-text" id="emoji"><img width="120" height="120" src="${getApiEmoji(id)}" alt="weather-icon"/></p>
          <p class="card-text">Temperature: ${((temp - 273.15) * (9 / 5) + 32).toFixed(1)}°F</p>
          <p class="card-text">Humidity: ${humidity}%</p>
          <p class="card-text">Date Time: ${dt_txt}</p>
        </div>
      </div>`;
    _banner.appendChild(bannerDisplay);
  }
}

function getApiEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "images/icons8-storm-100.png";
    case weatherId >= 300 && weatherId < 400:
      return "images/icons8-rain-cloud-100.png";
    case weatherId >= 500 && weatherId < 510:
      return "images/icons8-rainfall-100.png";
    case weatherId === 511:
      return "images/icons8-snow-storm-100.png";
    case weatherId >= 512 && weatherId < 600:
      return "images/icons8-moderate-rain-100.png";
    case weatherId >= 600 && weatherId < 700:
      return "images/icons8-snow-100.png";
    case weatherId >= 700 && weatherId < 800:
      return "images/icons8-snow-100.png";
    case weatherId === 800:
      return "images/icons8-summer-100.png";
    case weatherId >= 801 && weatherId < 900:
      return "images/icons8-haze-100.png";
    default:
      return "❓";
  }
}

function displayError(message) {
  const errorDisplay = document.createElement('h5');
  errorDisplay.textContent = message;
  errorDisplay.classList.add('card-title');
  _cards.appendChild(errorDisplay);
}

function clearAllSearches() {
  _dropdownMenu.innerHTML = "";
  cities = [];
  localStorage.removeItem('cities');
}
