// var weatherAPIUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="{LAT}"&lon="{LON}"&exclude="{PART}"&appid=df178667ace9a3adf43127dbd063444a";

var cityNameEl = document.getElementById("cityname");
var weatherStatsEl = document.getElementById("weatherstats");
var searchFormEl=document.getElementById("searchform");
var searchBarEl=document.getElementById("searchbar");
var historyEl=document.getElementById("history");

cityNameEl.textContent = "Hello";

var fillWeatherEl = function(weather) {
    var weatherdata = document.createElement("p");
    weatherdata.textContent = weather.current.clouds;
    weatherStatsEl.appendChild(weatherdata);
};


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
    var geocodeAPIUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+cityInput+"&appid=df178667ace9a3adf43127dbd063444a";

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
    var weatherAPIUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+cityCoords.lat+"&lon="+cityCoords.lon+"&appid=df178667ace9a3adf43127dbd063444a";

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

})
historyEl.addEventListener("click", function(event){
    var clickedHistoric = event.target;
    console.log("historic target:" +clickedHistoric)
    localStorage.setItem("cityLat", clickedHistoric.getAttribute("data-lat"));
    localStorage.setItem("cityLon", clickedHistoric.getAttribute("data-lon"));
    getWeatherData();
})