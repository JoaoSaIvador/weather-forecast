import React, { useState, useEffect, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { GlobalState } from '../GlobalState';
import AddLocationModal from './AddLocationModal';
import RemoveLocationModal from './RemoveLocationModal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function LocationSection() {
    const state = useContext(GlobalState);
    const [userLocation, setUserLocation] = state.userLocation;
    const [countries, setCountries] = state.countries;
    const [currentCountry, setCurrentCountry] = state.currentCountry;
    const [currentCity, setCurrentCity] = state.currentCity;
    const [theme] = state.theme;
    const [showAddModal, setShowAddModal] = useState(false);
    const [showRemoveBtn, setShowRemoveBtn] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    useEffect(() => {
        if (currentCity === -1) {
            setShowRemoveBtn(false);
        } else {
            setShowRemoveBtn(true);
        }
    }, [userLocation]);

    const setCurrentLocation = (location) => {
        setCurrentCountry({ ...currentCountry, name: location.country });
        setCurrentCity(location.city);
        setUserLocation({ lat: location.lat, lon: location.lon });
    };

    const errorToastNotification = message => {
        toast.error(message, {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    };

    const handleCountryChange = e => {
        if (parseInt(e.target.value) !== -1) {
            const countryIndex = countries.findIndex(country => country.country === e.target.value);
            setCurrentCountry({ name: e.target.value, index: countryIndex });
            setCurrentCity(-1);
            setShowRemoveBtn(false);
        }
    };

    const handleCityChange = e => {
        if (parseInt(e.target.value) !== -1) {
            const cityIndex = countries[currentCountry.index].cities.findIndex(city => city.city === e.target.value);
            setCurrentLocation({ country: currentCountry.name, city: e.target.value, lat: countries[currentCountry.index].cities[cityIndex].lat, lon: countries[currentCountry.index].cities[cityIndex].lon });
        }
    };

    const addLocation = location => {
        const i = countries.findIndex(country => country.country === location.country);

        // Check if inserted country already exists
        // If yes, just update the cities array, 
        // if not just insert a new country in the countries array
        if (i > -1) {
            // Check if inserted city already exists
            if (countries[i].cities.every(city => city.city !== location.city)) {
                setCountries(prevCountries => {
                    prevCountries[i].cities.push({ city: location.city, lat: location.lat, lon: location.lon });
                    prevCountries[i].cities.sort((a, b) => a.city.toLowerCase().localeCompare(b.city.toLowerCase()));
                    return [...prevCountries];
                });
            } else {
                errorToastNotification("Location is already in you list!");
                setCurrentLocation({ country: location.country, city: location.city, lat: location.lat, lon: location.lon });
                return;
            }
        } else {
            const newCountry = {
                country: location.country,
                cities: [{
                    city: location.city,
                    lat: location.lat,
                    lon: location.lon
                }]
            };
            setCountries(prevCountries => {
                prevCountries.push(newCountry);
                prevCountries.sort((a, b) => a.country.toLowerCase().localeCompare(b.country.toLowerCase()));
                return [...prevCountries];
            });
        }

        setCurrentLocation({ country: location.country, city: location.city, lat: location.lat, lon: location.lon });

        toast.success(`${location.city}, ${location.country} was added to your locations!`, {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    };

    const removeLocation = () => {
        if (countries[currentCountry.index].cities.length > 1) {
            const cityIndex = countries[currentCountry.index].cities.findIndex(city => city.city === currentCity);

            // Remove selected city from cities array
            setCountries(prevCountries => {
                prevCountries[currentCountry.index].cities.splice(cityIndex, 1);
                return [...prevCountries];
            });

            // Set default location
            setCurrentCountry({ ...currentCountry, name: countries[0].country });
            setCurrentCity(countries[0].cities[0].city);
            setUserLocation({ lat: countries[0].cities[0].lat, lon: countries[0].cities[0].lon });
        } else {
            if (countries.length > 1) {
                // Remove country from countries array
                setCountries(prevCountries => {
                    prevCountries.splice(currentCountry.index, 1);
                    return [...prevCountries];
                });

                // Set default location
                setCurrentCountry({ name: countries[0].country, index: 0 });
                setCurrentCity(countries[0].cities[0].city);
                setUserLocation({ lat: countries[0].cities[0].lat, lon: countries[0].cities[0].lon });
            } else {
                setCountries([]);
                setCurrentCountry({ name: -1, index: null });
                setCurrentCity(-1);
                setUserLocation();

                // Clear localStorage since the useEffect
                // in GlobalState will only trigger if countries.length > 0
                localStorage.removeItem("countries");
            }
        }

        toast.success(`${currentCity}, ${currentCountry.name} was removed from your locations!`, {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });

        setShowRemoveModal(false);
    };

    return (

        <div className='w-100 d-flex flex-wrap justify-content-center mt-4 mb-4 px-4 location-section'>
            <Form.Select data-testid="countrySelect" className='me-2 my-2' value={currentCountry.name} onChange={handleCountryChange} style={{ maxWidth: "200px" }}>
                <option value="-1" >Choose a country</option>
                {
                    countries && countries.map((country) => <option value={country.country} key={country.country}>{country.country}</option>)
                }
            </Form.Select>
            <Form.Select data-testid="citySelect" className='me-2 my-2' value={currentCity} onChange={handleCityChange} style={{ maxWidth: "200px" }}>
                <option value="-1">Choose a city</option>
                {
                    countries && (currentCountry.index != null) && currentCountry !== -1 && countries[currentCountry.index].cities.map((city) => <option value={city.city} key={city.lat + city.lon}>{city.city}</option>)
                }
            </Form.Select>
            <Button data-testid="addLocationBtn" className="me-2 my-2" variant={theme === 'light' ? 'dark' : 'secondary'} onClick={() => setShowAddModal(true)}>Add New</Button>
            {showRemoveBtn ? <Button data-testid="removeLocationBtn" className='my-2' variant="danger" onClick={() => setShowRemoveModal(true)}>Remove</Button> : null}
            <AddLocationModal show={showAddModal} setShow={setShowAddModal} addLocation={addLocation} errorToastNotification={errorToastNotification} />
            <RemoveLocationModal show={showRemoveModal} onHide={() => setShowRemoveModal(false)} removeLocation={removeLocation} />
            <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop={false} closeOnClickrtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
        </div>
    );
}

export default LocationSection;