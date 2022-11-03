import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';

export const GlobalState = createContext();

export const WeatherProvider = ({ children }) => {
    const [weather, setWeather] = useState();
    const [countries, setCountries] = useState([]);
    const [userLocation, setUserLocation] = useState(); // Current weather location
    const [userGeoLocation, setUserGeoLocation] = useState(); // User's device location
    const [currentCountry, setCurrentCountry] = useState({ name: -1, index: null }); // Current selected country
    const [currentCity, setCurrentCity] = useState(-1); // Current selected city
    const [isWeatherLoading, setIsWeatherLoading] = useState(false);
    const [theme, setTheme] = useState('light');

    // Load previously added locations and theme and set initial location if there are any
    useEffect(() => {
        if (countries.length === 0) {
            let oldCountries = localStorage.getItem("countries");
            if (oldCountries != null) {
                oldCountries = JSON.parse(oldCountries);
                setCountries(oldCountries);
                setCurrentCountry({ name: oldCountries[0].country });
                setCurrentCity(oldCountries[0].cities[0].city);
                setUserLocation({ lat: oldCountries[0].cities[0].lat, lon: oldCountries[0].cities[0].lon });
            }
        }

        const prevTheme = localStorage.getItem("theme");
        if (prevTheme != null) {
            setTheme(prevTheme);
        }
    }, []);

    // Persist countries to the local storage
    useEffect(() => {
        if (countries.length > 0) {
            localStorage.setItem("countries", JSON.stringify(countries));
        }
    }, [countries]);

    // Get weather data every time the location changes
    useEffect(() => {
        if (userLocation) {
            const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            const getWeather = async () => {
                setIsWeatherLoading(true);
                const { data: weatherJSON } = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${userLocation.lat}&lon=${userLocation.lon}&exclude=minutely,hourly,alerts&units=metric&appid=${process.env.REACT_APP_API_KEY}`);

                // Remove current day from forecast list
                weatherJSON.daily.shift();

                // Filter out useless data
                const formattedDaily = weatherJSON.daily.map(daily => (
                    {
                        date: new Date(daily.dt * 1000),
                        weekday: weekDays[(new Date(daily.dt * 1000).getDay())],
                        temp_min: daily.temp.min,
                        temp_max: daily.temp.max,
                        description: daily.weather[0].description,
                        icon: daily.weather[0].icon
                    }
                ));

                const data = {
                    current: {
                        date: weatherJSON.current.dt,
                        temp: weatherJSON.current.temp,
                        description: weatherJSON.current.weather[0].description,
                        icon: weatherJSON.current.weather[0].icon
                    },
                    daily: formattedDaily
                };

                setWeather(data);
                setIsWeatherLoading(false);
            };

            getWeather();

            const countryIndex = countries.findIndex(country => country.country === currentCountry.name);
            setCurrentCountry({ ...currentCountry, index: countryIndex });
        }
    }, [userLocation]);

    // Save user geolocation if he has allowed it
    useEffect(() => {
        if (userGeoLocation) {
            const i = countries.findIndex(country => country.country === userGeoLocation.country);

            // Check if user's country already exists
            // If yes, just update the cities array, 
            // if not just insert a new country in the countries array
            if (i > -1) {
                // Check if user's city already exists
                if (countries[i].cities.every(city => city.city !== userGeoLocation.city)) {
                    setCountries(prevCountries => {
                        prevCountries[i].cities.push({ city: userGeoLocation.city, lat: userGeoLocation.lat, lon: userGeoLocation.lon });
                        return [...prevCountries];
                    });
                }
            } else {
                const newCountry = {
                    country: userGeoLocation.country,
                    cities: [{
                        city: userGeoLocation.city,
                        lat: userGeoLocation.lat,
                        lon: userGeoLocation.lon
                    }]
                };

                setCountries(prevCountries => [...prevCountries, newCountry]);
            }

            setCurrentCountry({ ...currentCountry, name: userGeoLocation.country });
            setCurrentCity(userGeoLocation.city);
            setUserLocation({ lat: userGeoLocation.lat, lon: userGeoLocation.lon });
        }

    }, [userGeoLocation]);

    const state = {
        weather: [weather, setWeather],
        countries: [countries, setCountries],
        userLocation: [userLocation, setUserLocation],
        userGeoLocation: [userGeoLocation, setUserGeoLocation],
        currentCountry: [currentCountry, setCurrentCountry],
        currentCity: [currentCity, setCurrentCity],
        isWeatherLoading: [isWeatherLoading, setIsWeatherLoading],
        theme: [theme, setTheme]
    };

    return (
        <GlobalState.Provider value={state}>
            {children}
        </GlobalState.Provider>
    );
};