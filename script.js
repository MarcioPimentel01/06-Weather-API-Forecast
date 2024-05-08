//5 days Forecast url - api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}
//https://api.openweathermap.org/data/2.5/forecast?q=orlando&appid=15cc27ace4d4eac55708dcf5dd1ea30d"

fetchData()

async function fetchData() {
    try {
        const response = await fetch("https://api.openweathermap.org/data/2.5/forecast?q=orlando&appid=15cc27ace4d4eac55708dcf5dd1ea30d")

            if (!response.ok) {
                throw new console.error('Unable to fetch information at this moment');
            }

            const data = await response.json()
            console.log(data)

    } catch (error) {
        console.error(error)
    }
}

