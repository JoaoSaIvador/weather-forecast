import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import lookup from "country-code-lookup";
import { ToastContainer, toast } from 'react-toastify';
import { GlobalState } from '../GlobalState';
import CardsList from "./CardsList";
import LocationSection from './LocationSection';
import ThemeToggle from './ThemeToggle';

function Dashboard() {
    const state = useContext(GlobalState);
    const [, setUserGeoLocation] = state.userGeoLocation;
    const [isWeatherLoading] = state.isWeatherLoading;
    const [theme] = state.theme;

    useEffect(() => {
        // If user granted permission get their location information
        const success = async location => {
            const { data: locationJSON } = await axios.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${location.coords.latitude}&lon=${location.coords.longitude}&limit=1&appid=${process.env.REACT_APP_API_KEY}`);
            setUserGeoLocation({ country: lookup.byIso(locationJSON[0].country).country, city: locationJSON[0].name, lat: locationJSON[0].lat, lon: locationJSON[0].lon });
        };

        // If user denied permission set default location to Leiria, Portugal
        const error = () => {
            setUserGeoLocation({ country: "Portugal", city: "Leiria", lat: "39.74362", lon: "-8.80705" });

            toast.error("Unable to retrieve your location! Location set to Leiria, Portugal", {
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

        // Get user's device geolocation
        if (navigator.geolocation) {
            navigator.permissions
                .query({ name: "geolocation" })
                .then(function (res) {
                    // Check if user already granted permission, if not ask for it
                    if (res.state === "granted") {
                        navigator.geolocation.getCurrentPosition(success);
                    } else if (res.state === "prompt") {
                        localStorage.setItem("countries", JSON.stringify([]));
                        navigator.geolocation.getCurrentPosition(success, error);
                    }
                });
        }
    }, []);

    return (
        <div id={theme} className="w-100 pb-5 d-flex justify-content-center" style={{ minHeight: "100vh" }}>
            <div className='w-100 d-flex flex-column align-items-center' style={{ maxWidth: "800px" }}>
                <div className='d-flex justify-content-end' style={{ width: "100vw" }}>
                    <ThemeToggle />
                </div>
                <h1 className='mt-3 text-center fw-bold'>Weather Forecast</h1>
                <LocationSection />
                {isWeatherLoading ? null : <CardsList />}
                <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop={false} closeOnClickrtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
            </div>
        </div>
    );
}

export default Dashboard;