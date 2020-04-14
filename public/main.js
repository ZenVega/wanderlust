// Foursquare API Info
const clientId = 'SWVU3P00ZFERSOHGENBS15DE3QRYTWUBFE1CZKLO25M1C3VG';
const clientSecret = 'JU50PRC1GEGBBC4J3SUGS1Z0PR2C2EFFFTUU3JJEAOF2ZBMP';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';
const picsUrl = 'https://api.foursquare.com/v2/venues/';

// OpenWeather Info
const openWeatherKey = '4dedb1c9e979013425758b7b595b9434';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';


// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4"), $("#venue5")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Add AJAX functions here:
const getVenues = async () => {
  const city = $input.val();
  const urlToFetch = url + city + '&limit=50&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20180401';
 // console.log(urlToFetch);
try{
  const response = await fetch(urlToFetch);
  if(response.ok){
    const jsonResponse = await response.json();
  //  console.log(jsonResponse);
    const venues = jsonResponse.response.groups[0].items.map(parameter => parameter.venue);
 //  console.log('venues: ' + jsonResponse);
    return venues;
  }
  }catch(error) {
    console.log(error);
  }
};

const getForecast = async () => {

  const urlToFetch = weatherUrl +'?&q=' + $input.val() + '&APPID=' + openWeatherKey;

  try{
    const response = await fetch(urlToFetch);
    if(response.ok) {
      const jsonResponse = await response.json();
     // console.log('forecast: '+jsonResponse);
      return jsonResponse;
    }

  }catch(error){
    console.log(error);
  }
}
//getting the photos

const getPic = async (venueID) => {
    const urlToFetch = await picsUrl + venueID + '/photos/' + '?client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20180401';
   // console.log(urlToFetch);
    try{
        const response = await fetch(urlToFetch);
        if(response.ok){
          const jsonResponse = await response.json();
          console.log(jsonResponse);
         // debugger;
          const venue = jsonResponse.response.photos.items[0];
          console.log( 'venue' + venue)
          //debugger;
          const venuePicSrc = venue.prefix + 'width250' + venue.suffix;
          console.log('venuePicSrc' + venuePicSrc);
          debugger;
          return venuePicSrc;
        }
        }catch(error) {
          console.log(error);
    }

}


// Render functions
const renderVenues = (venues) => {
  $venueDivs.forEach( async ($venue) => {
    // Add your code here:
    let index = Math.floor(Math.random()*49);
    const venue = venues[index];
    const venueIcon = venue.categories[0].icon;
  //  console.log(venue);
    //Get the venue's photos
    const venueID = venue.id;

    const venPicSrc = await getPic(venueID);
 

    //how to construct venueImgSrc: https://developer.foursquare.com/docs/api-reference/venues/categories/
    const venueImgSrc = venueIcon.prefix + 'bg_64' + venueIcon.suffix;
  // console.log("now: " + venueImgSrc);
  //  console.log('venueIcon' + venueIcon);
    let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc, venPicSrc);

    $venue.append(venueContent);
  });
  $destination.append(`<h2>${venues[0].location.city}</h2>`);
}

const renderForecast = (day) => {
  // Add your code here:
  
	let weatherContent = createWeatherHTML(day);
  $weatherDiv.append(weatherContent);
}

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDiv.empty();
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues().then(venues => renderVenues(venues));
  getForecast().then(forecast => renderForecast(forecast))
  return false;
}

$submit.click(executeSearch)


//https://api.foursquare.com/v2/venues/4bf58dd8d48988d171941735/photos/&client_id=SWVU3P00ZFERSOHGENBS15DE3QRYTWUBFE1CZKLO25M1C3VG&client_secret=JU50PRC1GEGBBC4J3SUGS1Z0PR2C2EFFFTUU3JJEAOF2ZBMP&v=20180401