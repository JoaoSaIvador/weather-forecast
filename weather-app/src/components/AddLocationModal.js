import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import lookup from "country-code-lookup";
import { GlobalState } from '../GlobalState';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function AddLocationModal({ show, setShow, addLocation, errorToastNotification }) {
    const initialLocation = { country: "", city: "" };
    const [location, setLocation] = useState(initialLocation);
    const [formDisabled, setFormDisabled] = useState(true);
    const state = useContext(GlobalState);
    const [theme] = state.theme;

    const onHide = () => {
        setLocation(initialLocation);
        setShow(false);
    };

    const initCap = value => {
        return value
            .toLowerCase()
            .replace(/(?:^|[^a-zØ-öø-ÿ])[a-zØ-öø-ÿ]/g, function (m) {
                return m.toUpperCase();
            });
    };

    const handleChangeInput = e => {
        const { name, value } = e.target;
        setLocation({ ...location, [name]: value });
    };

    useEffect(() => {
        if (location.country !== "" && location.city !== "") {
            setFormDisabled(false);
        }

        if (!formDisabled && (location.country === "" || location.city === "")) {
            setFormDisabled(true);
        }
    }, [location]);

    const handleSubmit = async e => {
        e.preventDefault();

        // Check if inserted country is valid
        const formattedCountry = initCap(location.country.trim());
        const countryLookup = lookup.byCountry(formattedCountry);

        if (countryLookup) {
            const code = countryLookup.iso2;
            const { data: locationJSON } = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${location.city.trim()},${code}&limit=5&appid=${process.env.REACT_APP_API_KEY}`);

            // Check if location (Country + City) is valid
            if (locationJSON.length > 0) {
                addLocation({ country: formattedCountry, city: initCap(location.city), lat: locationJSON[0].lat, lon: locationJSON[0].lon });
            } else {
                errorToastNotification("Invalid location!");
            }
        } else {
            errorToastNotification("Invalid country!");
        }

        onHide();
    };

    return (
        <Modal id="addLocationModal" className={theme === 'light' ? '' : 'dark-modal'} show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">
                    Add a new Location:
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id='locationForm' className='d-flex flex-column' onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 px-4" controlId="formCountry">
                        <Form.Label>Country:</Form.Label>
                        <Form.Control name="country" type="text" value={location.country} placeholder="Enter a country" onChange={handleChangeInput} autoFocus />
                    </Form.Group>
                    <Form.Group className="mb-3 px-4" controlId="formCity">
                        <Form.Label>City:</Form.Label>
                        <Form.Control name="city" type="text" value={location.city} placeholder="Enter a city" onChange={handleChangeInput} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onHide}>Cancel</Button>
                <Button data-testid="confirmBtn" form="locationForm" variant={theme === 'light' ? 'dark' : 'secondary'} type="submit" disabled={formDisabled}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddLocationModal;