// General App Functionality Description
// Loads current and forecasted weather based off users input (https://www.weatherapi.com/)
// Changes background of results screen based off users input (https://unsplash.com/)
// Ben Sarjeant | Juno College 2020

// General Imports
import { Component, Fragment } from 'react';
import './App.js';
import './App.css';
// NPM Installs
import firebase from './firebaseUsersLocation.js';
import axios from 'axios';
// Class Components
import WeatherData from './WeatherData.js';
import Header from './Header.js';
import Footer from './Footer.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      locations: [],
      currentWeatherData: [],
      forecastWeatherData: [],
      weatherLocation: '',
      userInput: '',
      weatherLocationBg: '', 
      currentConditionData: ''
    }
  }


  // On mount load function that retrieves list of previously saved locations from firebase
  componentDidMount() {
    this.storeUserLocationFB();
  }

  handleInputChange = (e) => {
    this.setState({
      // converting user input to have a capitalized first letter
      userInput: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // call both api requests based off of the user input received from the input change
    this.callWeatherAPI(`${this.state.userInput}`);
    this.callUnsplashImgAPI(`${this.state.userInput}`);
  }


  // Firebase: Function to retrieve list of previously entered locations from Firebase
  storeUserLocationFB() {
    const dbRef = firebase.database().ref()
    dbRef.on('value', (data) => {
      const firebaseDataObj = data.val();
      let locationArray = [];
      for (let propertyKey in firebaseDataObj) {
        const propertyVal = firebaseDataObj[propertyKey];
        const formattedObj = {
          id: propertyKey,
          name: propertyVal
        }
        locationArray.push(formattedObj)
      }
      this.setState({
        locations: locationArray,
      })
    })
  }
  // End of Firebase function
  

  // WeatherAPI: Calling to retrieve weather data when user clicks submit button
  // Function takes the city which is derieved from the users input above
  // Throws error in console regardless of catch if user inputs random string (not a city)
  callWeatherAPI = (city) => {
    axios({
      method: 'GET',
      url: 'https://api.weatherapi.com/v1/forecast.json',
      dataResponse: 'json',
      params: {
        key: '29c5ceb051fc45c29ac204434202611',
        q: city,
        days: 3
      }
    }).then((apiData) => {
      this.filterWeatherData(apiData.data);    
      document.getElementById('weatherDataContainer').style.display = 'flex';
    }).catch(err => {
      alert("No data for that city, please try again.") 
    })
  }

  // Filtering weather data to add specific text to DOM and retrieved weather array
  // Contains series of conditionals to add some text based off of retrieved weather values
  filterWeatherData = (origWeatherData) => {

    // variables used in setState at end of function
    const forecastApiData = origWeatherData.forecast.forecastday;
    const weatherLocationFullName = origWeatherData.location.name + ', ' + origWeatherData.location.country;
    const currentCondition = origWeatherData.current.condition.text;
    
    // variables used in conditionals
    // currentApiData holds all the relevant info
    let currentApiData = origWeatherData.current;
    let currentHumid = origWeatherData.current.humidity;
    let currentWindSpeed = origWeatherData.current.wind_kph;
    let currentPrecip = origWeatherData.current.precip_mm;

    // conditionals for precipitation 
    if (currentPrecip >= 20) {
      currentApiData = { ...currentApiData, precipText: "Hurricane Rain" };
    } else if (currentPrecip < 20 & currentPrecip >= 10) {
      currentApiData = { ...currentApiData, precipText: "Pouring" };
    } else if (currentPrecip < 10 & currentPrecip >= 4) {
      currentApiData = { ...currentApiData, precipText: "Raining" };
    } else if (currentPrecip < 4 & currentPrecip >= 0.1) {
      currentApiData = { ...currentApiData, precipText: "Drizzling" };
    } else {
      currentApiData = { ...currentApiData, precipText: "No Rain" }
    }

    //conditionals for wind speed
    if (currentWindSpeed >= 60) {
      currentApiData = { ...currentApiData, windText: "Hurricane Winds" };
    } else if (currentWindSpeed < 60 & currentWindSpeed >= 30) {
      currentApiData = { ...currentApiData, windText: "Windy" };
    } else if (currentWindSpeed < 30 & currentWindSpeed >= 15) {
      currentApiData = { ...currentApiData, windText: "Breezy" };
    } else {
      currentApiData = { ...currentApiData, windText: "Little to no wind" }
    }

    // conditionals for humidity
    if (currentHumid >= 85) {
      currentApiData = { ...currentApiData, humidText: "Very humid" };
    } else if (currentHumid < 85 & currentHumid >= 50) {
      currentApiData = { ...currentApiData, humidText: "Humid" };
    } else if (currentHumid < 50 & currentHumid >= 15) {
      currentApiData = { ...currentApiData, humidText: "Not Very Humid" };
    } else {
      currentApiData = { ...currentApiData, humidText: "No Humidity" }
    }

    // setting state to reflect updated weather obj
    this.setState({
      weatherLocation: weatherLocationFullName,
      currentWeatherData: currentApiData,
      currentConditionData: currentCondition,
      forecastWeatherData: forecastApiData
    });
  }


  // Calling the unsplash API to retrieve a background photo based off of the users requested location
  callUnsplashImgAPI = (city) => {
    const unsplashPhotoKey = 'ZxjN4qAJgh0cJ5Lz2Lm47cXNiqzVZVZ69KLm5386GtM';
    axios({
      method: 'GET',
      url: 'https://api.unsplash.com/search/photos',
      dataResponse: 'json',
      params: {
        client_id: unsplashPhotoKey,
        query: city,
        orientation: 'landscape'
      }
    }).then((apiData) => {
      // setting the state of the weather location background to that of the url retrieved from api
      this.setState({
        weatherLocationBg: apiData.data.results[0].urls.regular
      })
      // setting the background image of the section holding all weather data based off of the state
      document.getElementById('weatherSection').style.backgroundImage = `url(${this.state.weatherLocationBg})`;
      
    }).catch(err => {
      // catching to ensure app won't break
      // was logging the errors to console prior
    })
  }
  // End of unsplash api call

  
  // Function to scroll down to the next section - called from chevron click in Header class component
  scrollToWeather = () => {
    this.weatherSection.scrollIntoView({ behavior: "smooth" });
  }

  // START of Firebase functions
  // Function checks to see if value is already stored in database, if it is let user know otherwise store location
  storeLocation = () => {
    const dbRef = firebase.database().ref();
    let locationTextArray = []
    // iterating over locations (array holding current firebase items) and pushing the name, not the key to a new array
    this.state.locations.forEach(element => {
      locationTextArray.push(element.name)
    });
    // seeing if the user input exists in the new array
    const indexOf = locationTextArray.indexOf(this.state.userInput);
    if (indexOf >= 0) {
      alert("This city is already a stored location!")
    } else {
      dbRef.push(this.state.userInput)
    }
  }

  // remove location when user selects the button marked with an X
  removeLocation = (locId) => {
    const dbRef = firebase.database().ref()
    dbRef.child(locId).remove();
  }

  // load a stored location if user clicks on it - stored locations are shown as an <a> and fire this function on click
  loadPreviousCity = (e) => {
    e.preventDefault();
    this.setState({
      userInput: e.target.text
    })
    this.callWeatherAPI(e.target.text);
    this.callUnsplashImgAPI(e.target.text);
  }
  // End of Firebase functions


  // function to toggle the forecast 
  toggleWeatherForecast = (e) => {
    if (e.target.textContent === "Show Forecast") {
      document.getElementById('weatherForecast').style.display = 'flex';
      e.target.textContent = "Hide Forecast"  
    } else if (e.target.textContent === "Hide Forecast") {
      document.getElementById('weatherForecast').style.display = 'none';
      e.target.textContent = "Show Forecast"
    }
  }


  render() { 
    return (
      <Fragment>
        <Header scrollFunc={this.scrollToWeather} />
        
        {/* Main section used to change background */}
        <section
          className="weatherMain wrapper"
          id="weatherSection"
          ref={(el) => { this.weatherSection = el; }}>

          {/* Section containing all retrieved weather api info */}
          <section className="requestedWeather">

            {/* Form for user input - handles api calls on submit */}
            <form onSubmit={this.handleSubmit} className="weatherDataForm">
              <label htmlFor="userLocation" className="srOnly">location:</label>
              <input
                type="text"
                id="userLocation"
                name="userLocation"
                placeholder="Search for a city"
                onChange={this.handleInputChange}
              />
              <button>Find Weather</button>
            </form>

            {/* Firebase stored locations */}
            <p>Stored Locations</p>
            <div className="firebaseStoredLocations">
              {
                this.state.locations.map((loc) => {
                  return (
                    <li key={loc.id}>
                      {/* On <a> click fire api call based on selected tag */}
                      <a href="#weatherSection" onClick={this.loadPreviousCity}>{loc.name}</a>
                      {/* Button to remove stored location from firebase */}
                      <button className="removeButton" onClick={() => { this.removeLocation(loc.id) }}>X</button>
                    </li>
                  )
                })
              }
            </div>

            {/* Weather Data class component */}
            <WeatherData
              weatherLoc={this.state.weatherLocation}
              currentWeathCondition={this.state.currentConditionData}
              currentWeath={this.state.currentWeatherData}
              bgSrc={this.state.weatherLocationBg}
              firebaseAddFunc={this.storeLocation}
              weatherForecast={this.toggleWeatherForecast}
              forecastData={this.state.forecastWeatherData}
            />
            
          </section>
          {/* END OF requestedWeather SECTION */}

        </section>
        {/* END OF weatherMain SECTION  */}
      
        <Footer />

      </Fragment>     
    )
  }
}

export default App;