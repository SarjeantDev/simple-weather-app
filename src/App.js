import { Component, Fragment } from 'react';
import firebase from './firebaseUsersLocation.js';
import './App.js';
import axios from 'axios';
import WeatherData from './WeatherData.js';
import WeatherBackground from './WeatherBackground.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      locations: [],
      currentWeather: [],
      weatherLocation: '',
      userInput: '',
      weatherLocationBg: '' 
    }
  }

  componentDidMount() {
    const dbRef = firebase.database().ref()
    // get data from the database
    dbRef.on('value', (data) => {
      const firebaseDataObj = data.val();
      console.log(firebaseDataObj);

      let locationArray = [];

      for (let propertyKey in firebaseDataObj) {
        const propertyVal = firebaseDataObj[propertyKey];
        const formattedObj = {
          id: propertyKey,
          name: propertyVal
        }
        locationArray.push(formattedObj)
      }

      console.log('locations:', locationArray)

      this.setState({
        locations: locationArray
      })
    })

    
  }
  
  scrollToWeather = () => {
    this.weatherSection.scrollIntoView({behavior:"smooth"});
  }

  handleInputChange = (e) => {
    console.log(e.target.value);
    this.setState({
      userInput: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    axios({
      method: 'GET',
      url: 'https://api.unsplash.com/search/photos',
      dataResponse: 'json',
      params: {
        client_id: 'ZxjN4qAJgh0cJ5Lz2Lm47cXNiqzVZVZ69KLm5386GtM',
        query: `${this.state.userInput}`,
        orientation: 'landscape'
      }
      
    }).then((apiData) => {
      console.log('unsplash data', apiData);
      console.log('unsplash data', apiData.data.results[0].urls.regular);

      const weatherLocationBgSrc = apiData.data.results[0].urls.regular
      this.setState({
        weatherLocationBg: weatherLocationBgSrc
      })
    }).catch(err => {
      console.log("Sorry try again");
    })



    axios({
      method: 'GET',
      url: 'https://api.weatherapi.com/v1/current.json',
      dataResponse: 'json',
      params: {
        key: '29c5ceb051fc45c29ac204434202611',
        q: `${this.state.userInput}`
      }
    }).then((apiData) => {
      console.log(apiData);

      const currentApiData = apiData.data.current;
      const weatherLocationCity = apiData.data.location.name;
      const weatherLocationCountry = apiData.data.location.country;
      const weatherLocationFullName = weatherLocationCity + ', ' + weatherLocationCountry;

      this.setState({
        currentWeather: currentApiData,
        weatherLocation: weatherLocationFullName
      });
    }).catch(err => {
      alert("Sorry try again")
    })


  }
  
  render() { 
    return (
      <Fragment>
        <header>
          <div className="wrapper headerFlexChild">
            <h1>Welcome to a new weather experience!</h1>
            <i onClick={() => { this.scrollToWeather() }} className="fas fa-chevron-down chevron"></i>
          </div>
          <p>artwork byyyy</p>
        </header>

        
        <section className="weatherMain" id="weatherSection" ref={(el) => { this.weatherSection = el; }}>

        <WeatherBackground 
            bgSrc= {this.state.weatherLocationBg}
        />

          {/* {
          
            this.state.locations.map((loc) => {
              return (
                <li key={loc.id}>
                  <p>{loc.name}</p>
                </li>
      
              )
            })
            
          } */}

          

          <section className="requestedWeather">
            
            <form onSubmit={this.handleSubmit}>
              <label htmlFor="userLocation" className="srOnly">location:</label>
              <input
                type="text"
                id="userLocation"
                name="userLocation"
                placeholder="Find New City"
                onChange={this.handleInputChange}
              />
              <button>Find Weather</button>

            </form>



            <WeatherData
              location={this.state.weatherLocation}
              temp={this.state.currentWeather.temp_c}
              humidity={this.state.currentWeather.humidity}
              wind={this.state.currentWeather.wind_kph}
              precip={this.state.currentWeather.precip_mm}
              pressure={this.state.currentWeather.pressure_in}
            />
          </section>
          
        
        </section>

      </Fragment>  

     
    )
  }
}

export default App