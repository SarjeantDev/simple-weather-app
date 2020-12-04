import { Component, Fragment } from 'react';
import firebase from './firebaseUsersLocation.js';
import './App.js';
import axios from 'axios';
import WeatherData from './WeatherData.js';
import Header from './Header.js'

class App extends Component {
  constructor() {
    super();
    this.state = {
      locations: [],
      currentWeatherData: [],
      weatherLocation: '',
      userInput: '',
      weatherRange: '',
      weatherLocationBg: '', 
      currentConditionData: ''
    }
  }

//   MVP
//   1. Landing page welcoming user to site -- done 
//   2. Prompt user for location of choice, and range of forecast
// 3. Show weather related to that location from third - party api based off prompt(Weather API)

// Stretch
// 1. Allow users to save location for future use
// 2. Allow users view satellite imagery
// 3. Allow users to see weather on mars for same range of forecast(NASA API)

  componentDidMount() {
    this.storeUserLocationFB();
  }

  handleInputChange = (e) => {
    this.setState({
      // converting user input to have a capitalized first letter
      userInput: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1),
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.callWeatherAPI(`${this.state.userInput}`);
    this.callUnsplashImgAPI(`${this.state.userInput}`);
  }

  // Function to retrieve list of previously entered locations from Firebase
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
  
  // Calling weather api to retrieve weather data when user submits button
  callWeatherAPI = (city) => {
    const weatherKey = '29c5ceb051fc45c29ac204434202611';

    axios({
      method: 'GET',
      url: 'https://api.weatherapi.com/v1/current.json',
      dataResponse: 'json',
      params: {
        key: weatherKey,
        q: city
      }
    }).then((apiData) => {

      this.filterWeatherData(apiData.data);    
      document.getElementById('weatherDataContainer').style.display = 'flex';

    }).catch(err => {
      console.log(err);
      alert("No data for that city, please try again.") 
    })
  }

  // Filtering weather data to add specific text
  filterWeatherData = (origWeatherData) => {
    console.log("original weather data", origWeatherData);
    let currentApiData = origWeatherData.current;
    const weatherLocationCity = origWeatherData.location.name;
    const weatherLocationCountry = origWeatherData.location.country;
    const weatherLocationFullName = weatherLocationCity + ', ' + weatherLocationCountry;
    const currentCondition = origWeatherData.current.condition.text;

    let currentHumid = origWeatherData.current.humidity;
    let currentWindSpeed = origWeatherData.current.wind_kph;
    // const currentWindGust = origWeatherData.current.temp_c;
    let currentPrecip = origWeatherData.current.precip_mm;
    let currentPressure = origWeatherData.current.pressure_in;

    //conditionals for humidity
    // if (currentHumid >= 60) {
    //   currentApiData = { ...currentApiData, humidText: "Very windy - stay inside or you'll turn into a kite" };
    // } else if (currentHumid < 60 & currentHumid >= 40) {
    //   currentApiData = { ...currentApiData, humidText: "Windy - enjoy the strong winds" };
    // } else if (currentHumid < 40 & currentHumid >= 15) {
    //   currentApiData = { ...currentApiData, humidText: "Breezy - the perfect amount of breeze" };
    // } else {
    //   currentApiData = { ...currentApiData, humidText: "No wind right now" }
    // }

    
    //conditionals for wind speed
    if (currentWindSpeed >= 60) {
       currentApiData = {...currentApiData, windText: "Very windy - stay inside or you'll turn into a kite"};
    } else if (currentWindSpeed < 60 & currentWindSpeed >= 40) {
      currentApiData = { ...currentApiData, windText: "Windy - enjoy the strong winds"};
    } else if (currentWindSpeed < 40 & currentWindSpeed >= 15) {
      currentApiData = { ...currentApiData, windText: "Breezy - the perfect amount of breeze" };
    } else {
      currentApiData = {...currentApiData, windText: "Hardly any wind right now"}
    }


    // conditionals for precipitation 
    if (currentPrecip >= 20) {
      currentApiData = {...currentApiData, precipText: "It's raining cats and dogs - stay inside or you'll drown"};
    } else if (currentPrecip < 20 & currentPrecip >= 10) {
      currentApiData = { ...currentApiData, precipText: "It's pouring - wear that rain coat you don't own"};
    } else if (currentPrecip < 10 & currentPrecip >= 4) {
      currentApiData = { ...currentApiData, precipText: "It's raining - better bundle up" };
    } else if (currentPrecip < 4 & currentPrecip >= 0.1) {
      currentApiData = { ...currentApiData, precipText: "It's drizzling - at least it's not pouring" };
    } else {
      currentApiData = {...currentApiData, precipText: "No rain right now"}
    }

  


    this.setState({
      weatherLocation: weatherLocationFullName,
      currentWeatherData: currentApiData,
      currentConditionData: currentCondition
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
      const weatherLocationBgSrc = apiData.data.results[0].urls.regular
      this.setState({
        weatherLocationBg: weatherLocationBgSrc
      })
      document.getElementById('weatherSection').style.backgroundImage = `url(${this.state.weatherLocationBg})`;
      
    }).catch(err => {
      console.log(err);
    })
  }
  // End of unsplash api call

  
  // Function to scroll down to the next section - called from chevron click
  scrollToWeather = () => {
    this.weatherSection.scrollIntoView({ behavior: "smooth" });
  }

  removeLocation = (locId) => {
    const dbRef = firebase.database().ref()
    dbRef.child(locId).remove();
  }

  storeLocation = () => {
    const dbRef = firebase.database().ref();
    let locationTextArray = []
    this.state.locations.forEach(element => {
      locationTextArray.push(element.name)
    });
    const indexOf = locationTextArray.indexOf(this.state.userInput);
    const userInputCity = this.state.userInput
    if (indexOf >= 0) {
      alert("This city is already a stored location!")
    } else {
      dbRef.push(this.state.userInput)
    }
  }

  loadPreviousCity = (e) => {
    e.preventDefault();
    this.setState({
      userInput: e.target.text
    })
    this.callWeatherAPI(e.target.text);
    this.callUnsplashImgAPI(e.target.text);
  }


  render() { 
    return (
      <Fragment>
        <Header scrollFunc={this.scrollToWeather} />
        <section
          className="weatherMain"
          id="weatherSection"
          ref={(el) => { this.weatherSection = el; }}>

          <section className="requestedWeather">
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
               

            <WeatherData
              weatherLoc={this.state.weatherLocation}
              currentWeathCondition={this.state.currentConditionData}
              currentWeath={this.state.currentWeatherData}
              bgSrc={this.state.weatherLocationBg}
              firebaseAddFunc={this.storeLocation}
            />

            <div className="firebaseStoredLocations">  
              {
                this.state.locations.map((loc) => {
                  return (
                    <li key={loc.id}>
                      <a href="" onClick={this.loadPreviousCity}>{loc.name}</a>
                      <button className="removeButton" onClick={() => { this.removeLocation(loc.id) }}>X</button>
                    </li>
                  )
                })
              }
            </div>

          </section>
        </section>
      </Fragment>       
    )
  }
}

export default App