// WeatherData class component
import { Component } from 'react';
import './App.css';

class WeatherData extends Component {
    
    render() { 
        return (
            <div className="weatherDataContainer" id="weatherDataContainer">

                {/* Setting the dom to reflect weather api data */}
                <h2>{this.props.weatherLoc}</h2>
                <h3>{this.props.currentWeathCondition} | {this.props.currentWeath.temp_c}°C </h3>
                <p>Precipitation: {this.props.currentWeath.precipText} ({this.props.currentWeath.precip_mm}mm)</p>
                <p>Wind: {this.props.currentWeath.windText} ({this.props.currentWeath.wind_kph}kph)</p>
                <p>Humidity: {this.props.currentWeath.humidText} ({this.props.currentWeath.humidity}%)</p>    
                
                {/* Button used to fire storeLocation on click */}
                <button className="saveLocationButton" onClick={this.props.firebaseAddFunc}>Save Location</button> 
                
                {/* Button to fire the function toggleWeatherForecast on click */}
                <button onClick={this.props.weatherForecast}>Show Forecast</button>

                {/* Div holding the forecast if the user wants */}
                <div id="weatherForecast">
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
                
            </div> 
        )
    }
}
export default WeatherData; 