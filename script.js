//5 days Forecast url - api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}
//https://api.openweathermap.org/data/2.5/forecast?q=orlando&appid=15cc27ace4d4eac55708dcf5dd1ea30d"

const APIKey = "15cc27ace4d4eac55708dcf5dd1ea30d"
const _btnSearch = document.getElementById(`btnSearch`)
const _dropdownSearch = document.querySelectorAll(`.dropdown-item`)
const _inputSearch = document.getElementById(`inputSearch`)
const _cards = document.getElementById(`forecastDiv`)
const _lastSearch0 = document.getElementById(`arrayIndex0`)
const _lastSearch1 = document.getElementById(`arrayIndex1`)
const _lastSearch2 = document.getElementById(`arrayIndex2`)
const _lastSearch3 = document.getElementById(`arrayIndex3`)
const _lastSearch4 = document.getElementById(`arrayIndex4`)

const cities = []


// ========================================================================================================================
//                             Event Listeners
// ========================================================================================================================

_btnSearch.addEventListener(`click`, async (ev) => {
    ev.preventDefault();

    const _inputSearch = document.getElementById(`inputSearch`).value.trim();
    console.log(_inputSearch);
    cities.unshift(_inputSearch);

    if (_inputSearch) {
        try {
            const forecastData = await fetchData(_inputSearch);
            console.log(forecastData)
            displayforecastInfo(forecastData);
        } catch (error) {
            console.error(error);
            displayError(error);
        }
    } else {
        // Handle case where input search is empty
    }
});

    _dropdownSearch.forEach(itemSearch => { //forEach was used because I'm using a querySelectoAll to targer multiple items
        itemSearch.addEventListener(`click`, () => {
            console.log(`ok`)
        })
    })
    
    
// ==================================================================================================================================
//                             Async Function
// ==================================================================================================================================

async function fetchData() {
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cities[0]}&appid=${APIKey}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Unable to fetch information at this moment');
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

function displayforecastInfo(data) {
    const {
        city: { name },
        list
    } = data;

    _cards.innerHTML = '';


    // Array containing the indices of the forecast entries you want to display
    const indicesToDisplay = [7, 15, 23, 31, 39];

    indicesToDisplay.forEach(index => {
        const forecastEntry = list.find((_, i) => i === index);

        if (forecastEntry) {
            const {
                main: { temp, humidity },
                weather: [{ description, id }],
                dt_txt
            } = forecastEntry;

            

            // Create a new card for each forecast entry
            const _cardDisplay = document.createElement(`div`);
            _cardDisplay.classList.add(`card`, `mb-3`); // Added mb-3 class for margin-bottom

            _cardDisplay.innerHTML = `
            <div class="card" style="width: 18rem;">
            <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${description}</h6>
            <p class="card-text" id="emoji"> ${getApiEmoji(id)}</p>
            <p class="card-text">Temperature: ${((temp - 273.15) * (9 / 5) + 32).toFixed(1)}°F</p>
            <p class="card-text">Humidity: ${humidity}%</p>
            <p class="card-text">Date Time: ${dt_txt}</p>
            </div>
            </div>
            `;
 

            _cards.appendChild(_cardDisplay);
        }
    });
}



function getApiEmoji(weatherId){

    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            return "🌧️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌦️";
        case (weatherId >= 600 && weatherId < 700):
            return "❄️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";
        case (weatherId === 800):
            return "☀️";
        case (weatherId >= 801 && weatherId < 810):
            return "☁️";
        default:
            return "❓";
    }
}

function displayError(message) {
    const errorDisplay = document.createElement(`h5`)
    errorDisplay.textContent = message
    errorDisplay.classList.add(`card-title`)

    _cards.appendChild(errorDisplay)

}




// =====================================================================================================================================
//                             End
// =====================================================================================================================================

