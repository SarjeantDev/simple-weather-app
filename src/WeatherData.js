import { Component } from 'react';

class WeatherData extends Component {
    render() { 
        return (
        <div>
            <h2>{this.props.location}</h2>
            <h2>Temperature: {this.props.temp}</h2>
            <p>Humidity: {this.props.humidity}</p>
            <p>Wind (kph): {this.props.wind}</p>
            <p>Precipitation: {this.props.precip}</p>
            <p>Pressure: {this.props.pressure}</p>
        </div>
        )
    }
}
export default WeatherData;