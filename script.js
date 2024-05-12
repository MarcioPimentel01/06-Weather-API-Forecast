//5 days Forecast url - api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}
//https://api.openweathermap.org/data/2.5/forecast?q=orlando&appid=15cc27ace4d4eac55708dcf5dd1ea30d"

const APIKey = "15cc27ace4d4eac55708dcf5dd1ea30d"
const _btnSearch = document.getElementById(`btnSearch`)
const _dropdownSearch = document.querySelectorAll(`.dropdown-item`)
const _inputSearch = document.getElementById(`inputSearch`)
const _cards = document.getElementById(`forecastDiv`)
const _banner = document.getElementById(`bannerDiv`)
const _buttons = document.querySelectorAll(`.btn-light`)


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
            localStorage.setItem('forecastData', JSON.stringify(forecastData));
            displayforecastInfo(forecastData);
            displayBanner(forecastData)
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

    _buttons.forEach(button => {
        button.addEventListener('click', async (clickEvent) => {
            const cityName = clickEvent.target.textContent;
            console.log('Clicked city:', cityName);
            cities.unshift(cityName)

            if (cityName) {
                try {
                    const forecastData = await fetchData(cityName);
                    console.log(forecastData)
                    localStorage.setItem('forecastData', JSON.stringify(forecastData));
                    displayforecastInfo(forecastData);
                    displayBanner(forecastData)
                } catch (error) {
                    console.error(error);
                    displayError(error);
                }
            } else {
                // Handle case where input search is empty
            }
        });
    });
    
    
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

            
            const cardDisplay = document.createElement(`div`);
            cardDisplay.classList.add(`card`, `mb-3`); // Added mb-3 class for margin-bottom

            cardDisplay.innerHTML = `
            <div class="card" style="width: 17rem;">
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${description}</h6>
                        <p class="card-text" id="emoji"><img width="120" height="120" src="${getApiEmoji(id)}" alt="snow-storm"/></p>
                        <p class="card-text">Temperature: ${((temp - 273.15) * (9 / 5) + 32).toFixed(1)}°F</p>
                        <p class="card-text">Humidity: ${humidity}%</p>
                        <p class="card-text">Date Time: ${dt_txt}</p>
                </div>
            </div>
            `;
 
            _cards.appendChild(cardDisplay);
        }
    });
}

function displayBanner(data) {
    const storedForecastData = localStorage.getItem('forecastData');
    const forecastData = JSON.parse(storedForecastData);
    console.log(forecastData);
    
    const { city: { name }, list } = data;
 
    _banner.innerHTML = '';
    const dataToDisplay = [5];

    dataToDisplay.forEach(index => {
        const bannerInfo = list.find((_, i) => i === index);

        if (bannerInfo) {
            const { main: { temp, humidity }, weather: [{ description, id }], dt_txt } = bannerInfo;
    
            const bannerDisplay = document.createElement(`div`);
            bannerDisplay.classList.add(`card`, `mb-3`); // Added mb-3 class for margin-bottom

            bannerDisplay.innerHTML = `
                <div class="card">
                    <div class="card-body" id="banner">
                        <h5 class="card-title">${name}</h5>
                            <h6 class="card-subtitle mb-3 text-muted">${description}</h6>
                            <p class="card-text" id="emoji"><img width="120" height="120" src="${getApiEmoji(id)}" alt="snow-storm"/></p>
                            <p class="card-text">Temperature: ${((temp - 273.15) * (9 / 5) + 32).toFixed(1)}°F</p>
                            <p class="card-text">Humidity: ${humidity}%</p>
                            <p class="card-text">Date Time: ${dt_txt}</p>
                    </div>
                </div>
            `;
 
            _banner.appendChild(bannerDisplay);
        }
    });
}

function getApiEmoji(weatherId){

    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "images/icons8-storm-100.png"
        case (weatherId >= 300 && weatherId < 400):
            return "images/icons8-rain-cloud-100.png"
        case (weatherId >= 500 && weatherId < 510):
            return "images/icons8-rainfall-100.png";
        case (weatherId === 511):
            return "images/icons8-snow-storm-100.png";
        case (weatherId >= 512 && weatherId < 600):
            return "images/icons8-moderate-rain-100.png";
        case (weatherId >= 600 && weatherId < 700):
            return "images/icons8-snow-100.png";
        case (weatherId >= 700 && weatherId < 800):
            return "images/icons8-snow-100.png";
        case (weatherId === 800):
            return "images/icons8-summer-100.png"
        case (weatherId >= 801 && weatherId < 900):
            return "images/icons8-haze-100.png";
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

