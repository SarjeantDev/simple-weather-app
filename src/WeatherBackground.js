const WeatherBackground = ({ bgSrc }) => {
    return (
        <div 
            className="weatherBg"
            style={{
                backgroundImage:`url(${bgSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '40vh'
            }}
        >
            
        </div>
    )
}

export default WeatherBackground;
