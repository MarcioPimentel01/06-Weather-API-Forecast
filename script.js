//5 days Forecast url - api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}
//https://api.openweathermap.org/data/2.5/forecast?q=orlando&appid=15cc27ace4d4eac55708dcf5dd1ea30d"

const APIKey = "15cc27ace4d4eac55708dcf5dd1ea30d"
const _btnSearch = document.getElementById(`btnSearch`)
const _dropdownSearch = document.querySelectorAll(`.dropdown-item`)
const _inputSearch = document.getElementById(`inputSearch`)

const cities = []

// ==============================================================================================
//                             Event Listeners
// ==============================================================================================

document.addEventListener(`DOMContentLoaded`, (ev) => {
    ev.preventDefault()
    
    _btnSearch.addEventListener(`click`, () => {
        const _inputSearch = document.getElementById(`inputSearch`).value.trim()
        console.log(_inputSearch)
        cities.unshift(_inputSearch)
        fetchData()
    })
    
    _dropdownSearch.forEach(itemSearch => { //forEach was used because I'm using a querySelectoAll to targer multiple items
        itemSearch.addEventListener(`click`, () => {
            console.log(`ok`)
        })
    })
    
    
    // fetchData()
    

    
    async function fetchData() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cities[0]}&appid=${APIKey}`)

        if (!response.ok) {
            throw new console.error('Unable to fetch information at this moment');
            }
            
            const data = await response.json()
            console.log(data)

    } catch (error) {
        console.error(error)
    }
}


})