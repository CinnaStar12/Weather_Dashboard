$("document").ready(function () {
    $(".btn").on("click", function () {
        $("#results-div").empty();
        var location = $("#city-input").val()
        currentWeather(location);

    });
    currentWeather("London");
    

});



function currentWeather(city) {
    var queryUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&apikey=f955041c9dab522ef41c605e377bdbdc"
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        cityName = $("<p>");
        cityName.text(response.name + "(" + moment().format("MM/DD/YYYY") + ")")
        cityName.attr("class", "h2");
        var temperature = $("<p>")
        $("#results-div").append(cityName);
        temperature.text("Temperature: " + kelvinToFarenheit(response.main.temp) + String.fromCharCode(176));
        $("#results-div").append(temperature)
        var humidity = $("<p>");
        humidity.text("Humidity: " + response.main.humidity + String.fromCharCode(37));
        $("#results-div").append(humidity)
        var windSpeed = $("<p>");
        windSpeed.text("Wind Speed: " + mpsToMph(response.wind.speed) + " mph");
        $("#results-div").append(windSpeed);
        uvIndex(response.coord.lat, response.coord.lon);
        forecast(city);
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
    var queryUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&apikey=f955041c9dab522ef41c605e377bdbdc"
    $.ajax({
        url:queryUrl,
        method: "GET"
    }).then(function (response){
        console.log(response)
        var day = response.list
        var forecastIndex = 0;
        var dayIndex = 1;
        var forecastDeck = $("<div>")
        forecastDeck.attr("class", "container flex-right")

        for(var i = 4; i < day.length; i+=8){
            var tempMin = 0;
            var humidity = 0;
            tempMin = day[i].main.temp_min
            tempMin = tempMin/8;
            tempMin = tempMin.toFixed(2);
            humidity = day[i].main.humidity;
            humidity = humidity/8;
            humidity = humidity.toFixed(2);
            var forecastCard = $("<div>")
            forecastCard.attr("class", "card-body");
            var forecastDay = $("<h5>")
            forecastDay.text(moment().add(dayIndex, 'd').format('dddd'));
            dayIndex++;
            forecastCard.append(forecastDay);
            var forecastTemp = $("<p>");
            forecastTemp.text(tempMin);
            forecastCard.append(forecastTemp);
            var forecastHumidity = $("<p>");
            forecastHumidity.text(humidity);
            forecastCard.append(forecastHumidity);
            forecastDeck.append(forecastCard);
            
        }
        $("#results-div").append(forecastDeck);
        

    })
}