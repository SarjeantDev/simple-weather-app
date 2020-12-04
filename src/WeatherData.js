import { Component } from 'react';

class WeatherData extends Component {
    
    render() { 
        // const WeatherBackground = ({ bgSrc })
        return (
            <div className="weatherDataContainer" id="weatherDataContainer">
            <h2>{this.props.weatherLoc}</h2>
            <h3>{this.props.currentWeathCondition} | {this.props.currentWeath.temp_c}°C </h3>
            <p>Humidity: {this.props.currentWeath.humidity}</p>
            <p>Wind (kph): {this.props.currentWeath.windText}, {this.props.currentWeath.wind_kph}kph</p>
            <p>Precipitation: {this.props.currentWeath.precipText}, {this.props.currentWeath.precip_mm}mm</p>
            <p>Pressure: {this.props.currentWeath.pressure_in}</p>       
            <button className="">See Five Day Forcast</button>
            <button onClick={this.props.firebaseAddFunc}>Save Location for Future Use</button> 
        </div> 


        )
    }
}
export default WeatherData; 