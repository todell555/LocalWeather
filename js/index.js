/* based on this tutorial: https://fourtonfish.makes.org/thimble/make-your-own-web-mashup */

var weatherData = {
  city: document.querySelector("#city"),
	weather: document.querySelector("#weather"),
	temperature: document.querySelector("#temperature"),
	temperatureValue: 0,
	units: "°C"
};

function roundTemperature(temperature){
	temperature = +temperature.toFixed();
	return temperature;
}

function switchUnits(){
/*
		Conversion Formulas:
		°F = °C  x  9/5 + 32 
		°C = (°F  -  32)  x  5/9 
*/
  if (weatherData.units == "°C"){
    weatherData.temperatureValue = roundTemperature(weatherData.temperatureValue * 9/5 + 32);
    weatherData.units = "°F";
  } else {
    weatherData.temperatureValue = roundTemperature((weatherData.temperatureValue -  32) * 5/9);
    weatherData.units = "°C";
  }
  
  weatherData.temperature.innerHTML = weatherData.temperatureValue + weatherData.units;
}

function getLocationAndWeather(){
  if (window.XMLHttpRequest){
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {
      console.log("Processing weather info...");
      var response = JSON.parse(xhr.responseText);
      
      console.log(response);
      var position = {
        latitude: response.latitude,
        longitude: response.longitude
      };
      var cityName = response.city;
      if (cityName == "Earth"){
// IP-based location detection failed. Let's ask the user where he or she lives.
        getWeatherForLocation();
      } else {
        var weatherSimpleDescription = response.weather.simple;
        var weatherDescription = response.weather.description;
        var weatherTemperature = roundTemperature(response.weather.temperature);
        weatherData.temperatureValue = weatherTemperature;
        loadBackground(position.latitude, position.longitude, weatherSimpleDescription);
        weatherData.city.innerHTML = cityName;
        weatherData.weather.innerHTML =  weatherDescription;
        weatherData.temperature.innerHTML = weatherTemperature + weatherData.units;
        console.log("Finished processing and displaying weather info...");
      }
    }, false);
    
    xhr.addEventListener("error", function(err){
      alert("Could not complete the request");
    }, false);
    
    xhr.open("GET", "https://fourtonfish.com/tutorials/weather-web-app/getlocationandweather.php?owapikey=bf1f4ecf76cbc8e8fdb30e9dc2c2f26a&units=metric", true);
    xhr.send();
    console.log("Requesting weather info...");
  } else {
    alert("Unable to fetch the location and weather data.");
  }
}

function getWeatherForLocation(){
  var location = prompt("Your location could not be detected automatically, can you tell me where you live?");
  if (location != null){
    document.querySelector("body").style.backgroundImage = "url('https://www.w3schools.com/w3images/forestbridge.jpg')";
    document.querySelector("#image-source").setAttribute("href", "https://www.w3schools.com/w3images/forestbridge.jpg");
    
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {
      var response = JSON.parse(xhr.responseText);
     
      console.log(response);
      var position = {
        latitude: response.latitude,
        longitude: response.longitude
      };
      var cityName = response.city;

      var weatherSimpleDescription = response.weather.simple;
      var weatherDescription = response.weather.description;
      var weatherTemperature = roundTemperature(response.weather.temperature);
      weatherData.temperatureValue = weatherTemperature;

      weatherData.city.innerHTML = cityName;
      weatherData.weather.innerHTML =  ", " + weatherDescription;
      weatherData.temperature.innerHTML = weatherTemperature + weatherData.units;					
				}, false);
    
    xhr.addEventListener("error", function(err){
      alert("Could not complete the request");
    }, false);
    
    xhr.open("GET", "https://fourtonfish.com/tutorials/weather-web-app/getweatherforlocation.php?owapikey=bf1f4ecf76cbc8e8fdb30e9dc2c2f26a&units=metric&location=" + location, true);
    xhr.send();
  } else {
    alert("Unable to fetch the location and weather data.");
  }						
}

function loadBackground(lat, lon, weatherTag) {
  var script_element = document.createElement('script');
  
  script_element.src = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=7c04a88e0e43fec05631096858f3c94e&lat=" + lat + "&lon=" + lon + "&tags=" + weatherTag + "&sort=relevance&extras=url_l&format=json";
  
  document.getElementsByTagName('head')[0].appendChild(script_element);
}

function jsonFlickrApi(data){
  console.log("fetching flickr image");
  if (data.photos.pages > 0){
    var photo = data.photos.photo[0];
    document.querySelector("body").style.backgroundImage = "url('" + photo.url_l + "')";
    document.querySelector("#image-source").setAttribute("href", "http://www.flickr.com/photos/" + photo.owner + "/" + photo.id);
  } else {
    document.querySelector("body").style.backgroundImage = "url('https://www.w3schools.com/w3images/forestbridge.jpg')";
    document.querySelector("#image-source").setAttribute("href", "https://www.w3schools.com/w3images/forestbridge.jpg");
  }
}
		getLocationAndWeather();