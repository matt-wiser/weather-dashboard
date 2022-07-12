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
            currentCityEl.textContent = city;
            populateBtns();
            requestForecast(data[0]);
        
        } else if (data[0]) {
            currentCityEl.textContent = city;
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
    const currentTemp = document.getElementById("temp");
    const currentWind = document.getElementById("wind");
    const currentHumidity = document.getElementById("humidity");
    const currentUV = document.getElementById("uv");
    

    currentTemp.textContent = "Temperature: " + data.current.temp + " Degrees";
    currentWind.textContent = "Wind: " + data.current.wind_speed;
    currentHumidity.textContent = "Humidity: " + data.current.humidity + "%";
    currentUV.textContent = "UV Index: " + data.current.uvi;
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

