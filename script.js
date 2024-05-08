//5 days Forecast url - api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}

fetch("https://api.openweathermap.org/data/2.5/forecast?q=orlando&appid=15cc27ace4d4eac55708dcf5dd1ea30d")
    .then(response => response.json())
    .then(data => console.log(data.city))
    .catch(error => console.log(error))


