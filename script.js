$("document").ready(function () {
    $("#search").on("click", function () {
        $("#results-div").empty();
        var location = $("#city-input").val()
        currentWeather(location);
        locationButton(location);
    });
    currentWeather("Houston");
    

});



function currentWeather(city) {
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&apikey=f955041c9dab522ef41c605e377bdbdc"
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        cityName = $("<p>");
        cityName.text(response.name + " (" + moment().format("MM/DD/YYYY") + ") ")
        cityName.attr("class", "h2");
        var weatherIcon = $("<span>");
        if(response.weather[0].main === "Clouds")
        {
            weatherIcon.attr("class", "fas fa-cloud")
        }
        else if(response.weather[0].main === "Clear"){
            weatherIcon.attr("class", "fas fa-sun")
        }
        else if(response.weather[0].main === "Thunderstorm"){
            weatherIcon.attr("class", "fas fa-bolt")
        }
        else if(response.weather[0].main === "Drizzle"){
            weatherIcon.attr("class", "fas fa-cloud-rain")
        }
        else if(response.weather[0].main === "Rain"){
            weatherIcon.attr("class", "fas fa-cloud-showers-heavy")
        }
        else if(response.weather[0].main === "Snow"){
            weatherIcon.attr("class", "fas fa-snowflake")
        }
        else if(response.weather[0].id >= 700 && response.weather[0].id < 800){
            weatherIcon.attr("class", "fas fa-smog")
        }
        var temperature = $("<p>")
        cityName.append(weatherIcon);
        $("#results-div").append(cityName);
        temperature.text("Temperature: " + kelvinToFarenheit(response.main.temp) + String.fromCharCode(176) + "F");
        $("#results-div").append(temperature)
        var humidity = $("<p>");
        humidity.text("Humidity: " + response.main.humidity + String.fromCharCode(37));
        $("#results-div").append(humidity)
        var windSpeed = $("<p>");
        windSpeed.text("Wind Speed: " + mpsToMph(response.wind.speed) + " mph");
        $("#results-div").append(windSpeed);
        uvIndex(response.coord.lat, response.coord.lon);
        forecast(city)
    })
}

function kelvinToFarenheit(num) {
    var temp = (num - 273.15) * 1.8000 + 32.00;
    temp = temp.toFixed(1);
    return temp;
}

function mpsToMph(num) {
    var mph = num / 0.44704
    mph = mph.toFixed(2);
    return mph;
}
function uvIndex(lat, lon) {
    var uvUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=f955041c9dab522ef41c605e377bdbdc&lat=" + lat + "&lon=" + lon
    $.ajax({
        url: uvUrl,
        method: "GET"
    }).then(function (response) {
        var uvIndex = response.value;
        var uvIndexDisplay = $("<p>")
        var uvIndexSpan = $("<span>")
        uvIndexDisplay.text("UV Index: ")
        uvIndexSpan.text(uvIndex)
        uvIndexSpan.attr("id", "uv")
        if (uvIndex < 3) {
            uvIndexSpan.attr("class", "uv-low")
        }
        else if (uvIndex > 3 && uvIndex < 6) {
            uvIndexSpan.attr("class", "uv-moderate")
        }
        else if (uvIndex > 6 && uvIndex < 8) {
            uvIndexSpan.attr("class", "uv-high")
        }
        else if (uvIndex > 8 && uvIndex < 11) {
            uvIndexSpan.attr("class", "uv-very-high")
        }
        else {
            uvIndexSpan.attr("class", "uv-extreme")
        }
        uvIndexDisplay.append(uvIndexSpan);
        $("#results-div").append(uvIndexDisplay);
    })
}

function forecast(city){
    var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&apikey=f955041c9dab522ef41c605e377bdbdc"
    $.ajax({
        url:queryUrl,
        method: "GET"
    }).then(function (response){
        console.log(response)
        $(".forecast-div").empty();
        var day = response.list
        var forecastIndex = 0;
        var dayIndex = 1;
        var forecastDeck = $("<div>")
        forecastDeck.attr("class", "card-deck")

        for(var i = 4; i < day.length; i+=8){
            var tempMin = 0;
            var humidity = 0;
            tempMin = day[i].main.temp_min
            tempMin = kelvinToFarenheit(tempMin);
            //tempMin = tempMin.toFixed(1);
            humidity = day[i].main.humidity;
            humidity = humidity.toFixed(0);
            var forecastCard = $("<div>")
            forecastCard.attr("class", "card col-lg");
            var forecastDay = $("<h5>")
            forecastDay.text(moment().add(dayIndex, 'd').format("ddd") + " ");
            dayIndex++;
            var forecastIcon = $("<span>")
            if(day[i].weather[0].main === "Clouds")
            {
                forecastIcon.attr("class", "fas fa-cloud")
            }
            else if(day[i].weather[0].main === "Clear"){
                forecastIcon.attr("class", "fas fa-sun")
            }
            else if(day[i].weather[0].main === "Thunderstorm"){
                forecastIcon.attr("class", "fas fa-bolt")
            }
            else if(day[i].weather[0].main === "Drizzle"){
                forecastIcon.attr("class", "fas fa-cloud-rain")
            }
            else if(day[i].weather[0].main === "Rain"){
                forecastIcon.attr("class", "fas fa-cloud-showers-heavy")
            }
            else if(day[i].weather[0].main === "Snow"){
                forecastIcon.attr("class", "fas fa-snowflake")
            }
            else if(day[i].weather[0].main >= 700 && response.weather[0].id < 800){
                forecastIcon.attr("class", "fas fa-smog")
            }
            forecastDay.append(forecastIcon);
            forecastCard.append(forecastDay);
            var forecastTemp = $("<p>");
            forecastTemp.text(" " + tempMin + String.fromCharCode(176) + "F");
            var forecastTempIcon = $("<span>");
            if(tempMin <= "75")
            {
                forecastTempIcon.attr("class", "fas fa-temperature-low");
            }
            else{
                forecastTempIcon.attr("class", "fas fa-temperature-high");
            }
            forecastCard.append(forecastTemp);
            forecastTemp.prepend(forecastTempIcon);
            var forecastHumidity = $("<p>");
            forecastHumidity.text(" " + humidity + "%");
            var forecastHumidityIcon = $("<span>");
            forecastHumidityIcon.attr("class", "fas fa-tint");
            forecastCard.append(forecastHumidity);
            forecastHumidity.prepend(forecastHumidityIcon);
            forecastDeck.append(forecastCard);
            
        }
        $(".forecast-div").append(forecastDeck);
        

    })
}
function locationButton(location){
    var locationButton = $("<button>");
    locationButton.text(location)
    locationButton.attr("class", "btn btn-secondary loc-btn")
    $("#loc-button-div").append(locationButton)
}