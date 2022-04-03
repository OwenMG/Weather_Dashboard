// var weatherAPIUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="{LAT}"&lon="{LON}"&exclude="{PART}"&appid=df178667ace9a3adf43127dbd063444a";

var cityNameEl = document.getElementById("cityname");
var weatherStatsEl = document.getElementById("weatherstats");
var searchFormEl=document.getElementById("searchform");
var searchBarEl=document.getElementById("searchbar");
var historyEl=document.getElementById("history");
var currentTempEl=document.getElementById("currenttemp");
var currentWindEl=document.getElementById("currentwind");
var currentHumidityEl=document.getElementById("currenthumidity");
var UVIndex=document.getElementById("uvindex");
var forecast1=document.getElementById("day1");
var forecast2=document.getElementById("day2");
var forecast3=document.getElementById("day3");
var forecast4=document.getElementById("day4");
var forecast5=document.getElementById("day5");

var now=moment().format("M/D/YY");
var forecastGenNeeded = true;


cityNameEl.textcontent=now;
console.log(now);
var fillWeatherEl = function(weather) {
    // fill current weather data
    cityNameEl.textContent = localStorage.getItem("cityName")+" "+now;
    currentTempEl.textContent = "Temp: "+weather.current.temp+"°F";
    currentWindEl.textContent = "Wind: "+weather.current.wind_speed+" MPH";
    currentHumidityEl.textContent = "Humidity: "+weather.current.humidity+"%";
    UVIndex.textContent=weather.current.uvi;

    // color uv index
    if(weather.current.uvi<3){
        UVIndex.classList.add("favorable");
    }
    else if(weather.current.uvi<6) {
        UVIndex.classList.add("moderate");
    }
    else {
        UVIndex.classList.add("severe");
    }
    
    generateForcast(weather);
};
var generateForcast = function(weather) {
    var castdays=[forecast1,forecast2,forecast3,forecast4,forecast5]
    console.log("function is functioning")
    for (i=0; i<castdays.length; i++) {
        var dateEl = castdays[i].children[0];
        var iconEl = castdays[i].children[1];
        var tempEl = castdays[i].children[2];
        var windEl = castdays[i].children[3];
        var humidEl = castdays[i].children[4];

        dateEl.textContent= moment().add(i+1, "days").format("M/D/YY");
        dateEl.classList.add("bold");
        dateEl.classList.add("dark");
        tempEl.textContent = "Temp: "+weather.daily[i].temp.day+"°F";
        windEl.textContent = "Wind: "+weather.daily[i].wind_speed+" MPH";
        humidEl.textContent = "Humidity: "+weather.daily[i].humidity+"%";

        castdays[i].classList.add("forecastcard")
        console.log(weather.daily[i].weather[0].main);
        if (weather.daily[i].weather[0].main == "Rain") {
            iconEl.classList.add("fa-cloud-showers-heavy");
        }
        if (weather.daily[i].weather[0].main == "Clear") {
            iconEl.classList.add("fa-sun");
        }
        if (weather.daily[i].weather[0].main == "Clouds") {
            iconEl.classList.add("fa-cloud-sun");
        }
        if (weather.daily[i].weather[0].main == "Snow") {
            iconEl.classList.add("fa-snowflake");
        }
        if (weather.daily[i].weather[0].main == "Drizzle") {
            iconEl.classList.add("fa-cloud-showers-heavy");
        }
        if (weather.daily[i].weather[0].main == "Thunderstorm") {
            iconEl.classList.add("fa-bolt");
        }
    }
}


var generateHistoryButton = function() {
    var newHistoric = document.createElement("button");
    console.log(newHistoric)
    newHistoric.classList.add("btn");
    newHistoric.classList.add("historic");
    newHistoric.setAttribute("data-lat", localStorage.getItem("cityLat"));
    newHistoric.setAttribute("data-lon", localStorage.getItem("cityLon"));
    newHistoric.textContent = localStorage.getItem("cityName");
    historyEl.appendChild(newHistoric);
};

var getWeather = function(cityInput) {
    var geocodeAPIUrl = "https://api.openweathermap.org/geo/1.0/direct?q="+cityInput+"&appid=df178667ace9a3adf43127dbd063444a";

    fetch(geocodeAPIUrl)
        
        .then(function(response) {
            if(response.ok) {
                console.log(response);
                response.json().then(function(data) {
                    console.log(data);
                    var cityCoords={
                        lat: data[0].lat,
                        lon: data[0].lon,
                        name: data[0].name,
                    }
                    console.log("city coords: "+cityCoords);
                    localStorage.setItem("cityLat", cityCoords.lat);
                    localStorage.setItem("cityLon", cityCoords.lon);
                    localStorage.setItem("cityName", cityCoords.name);
                    getWeatherData();
                    generateHistoryButton();
                })
            }
        })
        .catch(function(error) {
            alert('Unable to get city code');
        })

}
var getWeatherData = function() {
    var cityCoords = {
        lat: localStorage.getItem("cityLat"),
        lon: localStorage.getItem("cityLon"),
    }
    var weatherAPIUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+cityCoords.lat+"&lon="+cityCoords.lon+"&units=imperial&appid=df178667ace9a3adf43127dbd063444a";

    fetch(weatherAPIUrl)
        .then(function(response) {
            if(response.ok) {
                console.log(response);
                response.json().then(function(data) {
                    console.log(data);
                    fillWeatherEl(data);
                })
            }
        })
        .catch(function(error) {
            alert("Unable to get weather data");
        })
}

// getWeather(cityText);
// getWeatherData();
searchFormEl.addEventListener("submit", function(event) {
    event.preventDefault();

    var userInput = searchBarEl.value;
    console.log("input: " + userInput);

    getWeather(userInput);
    searchBarEl.value="";

})
historyEl.addEventListener("click", function(event){
    var clickedHistoric = event.target;
    console.log("historic target:" +clickedHistoric)
    localStorage.setItem("cityLat", clickedHistoric.getAttribute("data-lat"));
    localStorage.setItem("cityLon", clickedHistoric.getAttribute("data-lon"));
    getWeatherData();
})