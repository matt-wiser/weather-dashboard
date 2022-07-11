// API key c58ad9defef708e43c489a22c4980616

// example current forecast + 7 day
// fetch('https://api.openweathermap.org/data/2.5/onecall?lat=38.7267&lon=-9.1403&exclude=hourly,minutely,alerts&units=imperial&appid=c58ad9defef708e43c489a22c4980616')
// .then(response => response.json())
// .then(data => console.log(data));




function formSubmitHandler(e){
    e.preventDefault();
    const selectedCity = $("#city").val();

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${selectedCity}&appid=c58ad9defef708e43c489a22c4980616`)
    .then(response => response.json())
    .then(function (data){
        requestForecast(data[0]);
    });
}

function requestForecast(latLon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latLon.lat}&lon=${latLon.lon}&exclude=hourly,minutely,alerts&units=imperial&appid=c58ad9defef708e43c489a22c4980616`)
    .then(response => response.json())
    .then(data => console.log(data));
}

$("#cityForm").on("submit", formSubmitHandler);

