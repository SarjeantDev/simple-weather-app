// WeatherData class component
import { Component } from 'react';
import './App.css';

class WeatherData extends Component {
    constructor() {
        super();
        this.state = {
            showForecast: false
        }
    }

    // function to toggle the forecast 
    toggleWeatherForecast = (e) => {
        if (e.target.textContent === "Show Forecast") {
            this.setState({
                showForecast: true
            })
            e.target.textContent = "Hide Forecast"
        } else if (e.target.textContent === "Hide Forecast") {
            this.setState({
                showForecast: false
            })
            e.target.textContent = "Show Forecast"
        }
    }

    render() { 
        return (
            <>
                {/* Setting the dom to reflect weather api data */}
                <h2>{this.props.weatherLoc}</h2>
                <h3>{this.props.currentWeathCondition} | {this.props.currentWeath.temp_c}°C </h3>
                <p>Precipitation: {this.props.currentWeath.precipText} ({this.props.currentWeath.precip_mm}mm)</p>
                <p>Wind: {this.props.currentWeath.windText} ({this.props.currentWeath.wind_kph}kph)</p>
                <p>Humidity: {this.props.currentWeath.humidText} ({this.props.currentWeath.humidity}%)</p>    
                
                {/* Button used to fire storeLocation on click */}
                <button className="saveLocationButton" onClick={this.props.firebaseAddFunc}>Save Location</button> 
                
                {/* Button to fire the function toggleWeatherForecast on click */}
                <button onClick={this.toggleWeatherForecast} className="showForecastButton">Show Forecast</button>

                {/* Div holding the forecast if the user wants */}
                <div className={this.state.showForecast ? 'show' : 'hide'}>
                    {
                        this.props.forecastData.map((dayObj) => {
                            return (
                                <div className="forecastDayContainer" key={dayObj.date_epoch}>
                                    <h3>{dayObj.date}</h3>
                                    <h4>{dayObj.day.condition.text}</h4>
                                    <p>High: {dayObj.day.maxtemp_c}°C</p>
                                    <p>Low: {dayObj.day.mintemp_c}°C</p>
                                    <p>Precip: {dayObj.day.totalprecip_mm}mm</p>
                                </div>
                            )
                        })
                    }
                </div>
                

            </>
        )
    }
}
export default WeatherData; 