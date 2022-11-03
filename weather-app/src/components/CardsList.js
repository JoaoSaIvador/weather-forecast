import React, { useContext } from 'react';
import WeatherCard from './WeatherCard';
import { GlobalState } from '../GlobalState';
import noLocations from '../assets/NoLocations.svg';

function CardsList() {
    const state = useContext(GlobalState);
    const [weather] = state.weather;
    const [countries] = state.countries;

    return (
        countries.length === 0 ?
            (<div className='d-flex flex-column align-items-center'>
                <img className='my-4 w-100' src={noLocations} alt="" style={{ maxWidth: "600px" }} />
                <h3>Oops...</h3>
                <span className='fs-5 text-center'>You have no locations, try adding some!</span>
            </div>)
            : (
                weather && (<div className='w-100 d-flex flex-wrap justify-content-center'>
                    <WeatherCard weather={weather.current} title="Today">
                        <span data-testid="temp" className='fw-bold mt-3 fs-5'>{Math.round(weather.current.temp)}ºC</span>
                    </WeatherCard>
                    {
                        weather.daily.map(daily => {
                            return (<WeatherCard weather={daily} title={daily.weekday} key={daily.date}>
                                <div className='w-100 d-flex justify-content-between'>
                                    <span data-testid="temp" className='fw-bold mt-3 fs-6 text-primary'>{Math.round(daily.temp_min)}ºC</span>
                                    <span data-testid="temp" className='fw-bold mt-3 fs-6 text-danger'>{Math.round(daily.temp_max)}ºC</span>
                                </div>
                            </WeatherCard>);
                        })
                    }
                </div>)
            )

    );
}

export default CardsList;