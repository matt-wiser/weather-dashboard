// API key c58ad9defef708e43c489a22c4980616

// example current forecast + 7 day
// fetch('https://api.openweathermap.org/data/2.5/onecall?lat=38.7267&lon=-9.1403&exclude=hourly,minutely,alerts&units=imperial&appid=c58ad9defef708e43c489a22c4980616')
// .then(response => response.json())
// .then(data => console.log(data));


const cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];

function formSubmitHandler(e){
    e.preventDefault();
    const searchedCity = $("#city").val().trim();

    if (searchedCity){
        fetchGeoCode(searchedCity);
    } else {
        alert("Please type a city name to search");
    }
}

function buttonClickHandler(e) {
    const searchedCity = e.target.textContent.trim();
    fetchGeoCode(searchedCity);
}

function requestForecast(latLon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latLon.lat}&lon=${latLon.lon}&exclude=hourly,minutely,alerts&units=imperial&appid=c58ad9defef708e43c489a22c4980616`)
    .then(response => response.json())
    .then(data => populateUI(data));
}

function fetchGeoCode(city) {
    const cityEl = document.getElementById("city");
    const currentCityEl = document.getElementById("current-city");
    cityEl.value = "";
    
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=c58ad9defef708e43c489a22c4980616`)
    .then(response => response.json())
    .then(function (data){
        if (!cityHistory.includes(city) && data[0]) {
            console.log("A new city!");
            cityHistory.splice(0, 0, city);
            localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
            currentCityEl.textContent = `${city} (${moment().format("MM/DD/YYYY")})`;
            populateBtns();
            requestForecast(data[0]);
        
        } else if (data[0]) {
            currentCityEl.textContent = `${city} (${moment().format("MM/DD/YYYY")})`;
            requestForecast(data[0]);
        }
        
        else {
            currentCityEl.textContent = "";
            alert("There was a problem processing your request, please try again!");
        }
    });
}

function populateUI(data) {
    console.log(data);
    const forecastArray = data.daily;
    const forecastContainer = document.getElementById("forecast-container");

    const currentTemp = document.getElementById("temp");
    const currentWind = document.getElementById("wind");
    const currentHumidity = document.getElementById("humidity");
    const currentUV = document.getElementById("uv");
    const weatherGlyph = document.getElementById("glyph");

    currentTemp.textContent = "Temperature: " + data.current.temp + " Degrees";
    currentWind.textContent = "Wind: " + data.current.wind_speed;
    currentHumidity.textContent = "Humidity: " + data.current.humidity + "%";
    currentUV.textContent = "UV Index: " + data.current.uvi;
    weatherGlyph.setAttribute("src", `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`);
    weatherGlyph.classList.remove("hidden");

    const dailyWeather = document.getElementById("daily-info");
    dailyWeather.classList.add("outline");

    const fiveDay = document.getElementById("5day");
    fiveDay.classList.remove("hidden");

    removeAllChildNodes(forecastContainer);
    for (let i = 1; i < 6; i++) {
        const forecastDay = document.createElement("div");
        forecastDay.classList.add("forecast");

        const date = document.createElement("h3");
        date.textContent = moment.unix(forecastArray[i].dt).format("MM/DD/YYYY");
        forecastDay.append(date);

        const glyph = document.createElement("img");
        glyph.setAttribute("src", `http://openweathermap.org/img/wn/${forecastArray[i].weather[0].icon}@2x.png`);
        forecastDay.append(glyph);

        const temp = document.createElement("h3");
        temp.textContent = `Temp: ${forecastArray[i].temp.day} Degrees`;
        forecastDay.append(temp);

        const wind = document.createElement("h3");
        wind.textContent = `Wind: ${forecastArray[i].wind_speed} MPH`;
        forecastDay.append(wind);

        const humidity = document.createElement("h3");
        humidity.textContent = `Humidity: ${forecastArray[i].humidity}%`;
        forecastDay.append(humidity);

        forecastContainer.append(forecastDay);
    }
}

function populateBtns(){
    const searchHistoryEl = document.getElementById("search-history");

    removeAllChildNodes(searchHistoryEl);

    cityHistory.forEach(e => {
        const buttonEl = document.createElement("button");
        buttonEl.classList.add("button");
        buttonEl.classList.add("searched-city");
        buttonEl.textContent = e;
        searchHistoryEl.append(buttonEl)
    });
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

populateBtns();
$(document).on("click", ".searched-city", buttonClickHandler);
$("#cityForm").on("submit", formSubmitHandler);

