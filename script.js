// API key c58ad9defef708e43c489a22c4980616

fetch('https://api.openweathermap.org/data/2.5/onecall?lat=38.7267&lon=-9.1403&exclude=current,hourly,minutely,alerts&units=imperial&appid=c58ad9defef708e43c489a22c4980616')
.then(response => response.json())
.then(data => console.log(data));

