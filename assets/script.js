var cityStart = document.getElementById("cityStart");
var cityEnd = document.getElementById("cityEnd");
var searchButton = document.getElementById("search");

searchButton.addEventListener("click", function (event) {
  var savedTrips = {
    cityStart: cityStart.value,
    cityEnd: cityEnd.value,
  };

  this.localStorage.setItem("savedTrips", JSON.stringify(savedTrips));
  displayTrip();
});

function displayTrip() {
  // add function here
}

$("#route-me").on("click", handleRouteMe);
// PLACEHOLDER
$("#origin-city").val("Denver");
$("#origin-state").val("Colorado");
$("#final-city").val("Houston");
$("#final-state").val("Texas");

//lat and long have to be int or xx.xx
// ?lat=39&lon=-105,17&appid=5a5f2543215b0ae09a5dc07887c20551
// https://api.openweathermap.org/data/2.5/forecast?q=Denver,Colorado&appid=5a5f2543215b0ae09a5dc07887c20551
// forecast?q={city name}&appid={API key}

//tom tom
//https://api.tomtom.com/routing/1/calculateRoute/lat,long:lat,long/json?key=NHxjQxwjgPZ9yPReAZPQfGoNnIYAtKIE
//52.50931,13.42936:52.50274,13.43872
function handleRouteMe(event) {
  event.preventDefault();
  var originCity = $("#origin-city").val();
  var originState = $("#origin-state").val();
  //RENAME
  retrieveGeoCoordinates(null, originCity, originState);
}
//research async await
function retrieveGeoCoordinates(originCoords, city, state) {
  fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      "," +
      state +
      ",US&limit=10&appid=5a5f2543215b0ae09a5dc07887c20551"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //FETCH...
      console.log(data);
      var coordinateResults = new Coordinates();
      if (data.length > 1) {
        //Do we want the user to pick the relevant option if multiple results are returned?
        for (var i = 0; i < data.length; i++) {
          if (
            data[i].state == state &&
            !Number.isNaN(data[i].lat) &&
            !Number.isNaN(data[i].lon)
          ) {
            coordinateResults.lat = data[i].lat;
            coordinateResults.lon = data[i].lon;
          }
        }
      } else if (
        data.length == 1 &&
        !Number.isNaN(data[0].lat) &&
        !Number.isNaN(data[0].lon)
      ) {
        coordinateResults.lat = data[0].lat;
        coordinateResults.lon = data[0].lon;
      } else {
        alert(
          "CLEAN UP THE MESSAGE; NO CITY STATE FOUND BASED ON WHAT YOU ENTERED. CITY: " +
            city +
            " and STATE: " +
            state
        );
      }
      console.log(coordinateResults);
      if (coordinateResults.lat && coordinateResults.lon) {
        if (!originCoords) {
          var finalCity = $("#final-city").val();
          var finalState = $("#final-state").val();
          retrieveGeoCoordinates(originCoords, finalCity, finalState);
        } else {
          retrieveRoute(originCoords, coordinateResults);
        }
      }
      //return coordinateResults;
    })
    .catch(function (error) {
      console.log(error);
    });
}
function retrieveRoute(originCoords, finalCoords) {
  var genericCoords =
    originCoords.lat +
    "," +
    originCoords.lon +
    ":" +
    finalCoords.lat +
    "," +
    finalCoords.lon;
  fetch(
    "https://api.tomtom.com/routing/1/calculateRoute/" +
      genericCoords +
      "/json?key=NHxjQxwjgPZ9yPReAZPQfGoNnIYAtKIE"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("data!");
      console.log(data);
      console.log(data.routes.length);

      for (var j = 0; j < data.routes.length; j++) {
        console.log("leg " + i);
        console.log(data.routes[i].legs);
        console.log(data.routes[i].legs.length);
        for (var k = 0; k < data.routes[j].legs.length; k++) {
          console.log("point " + i);
          console.log(data.routes[i].legs.points);
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
function Coordinates(lat, lon) {
  this.lat = lat;
  this.lon = lon;
}
