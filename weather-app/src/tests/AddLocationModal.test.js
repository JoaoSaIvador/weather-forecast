import { render, screen, fireEvent } from "@testing-library/react";
import AddLocationModal from "../components/AddLocationModal";
import { WeatherProvider } from '../GlobalState';

test('AddLocationModal renders country input correctly', () => {
    const show = true;
    render(<WeatherProvider><AddLocationModal show={show} /></WeatherProvider>);
    const countryInputElement = screen.getByPlaceholderText('Enter a country');

    expect(countryInputElement).toBeInTheDocument();
});

test('AddLocationModal renders city input correctly', () => {
    const show = true;
    render(<WeatherProvider><AddLocationModal show={show} /></WeatherProvider>);
    const cityInputElement = screen.getByPlaceholderText('Enter a city');

    expect(cityInputElement).toBeInTheDocument();
});

test('AddLocationModal country input is empty', () => {
    const show = true;
    render(<WeatherProvider><AddLocationModal show={show} /></WeatherProvider>);
    const countryInputElement = screen.getByPlaceholderText('Enter a country');

    expect(countryInputElement.value).toBe("");
});

test('AddLocationModal city input is empty', () => {
    const show = true;
    render(<WeatherProvider><AddLocationModal show={show} /></WeatherProvider>);
    const cityInputElement = screen.getByPlaceholderText('Enter a city');

    expect(cityInputElement.value).toBe("");
});

test('AddLocationModal country input changes', () => {
    const show = true;
    render(<WeatherProvider><AddLocationModal show={show} /></WeatherProvider>);
    const countryInputElement = screen.getByPlaceholderText('Enter a country');

    fireEvent.change(countryInputElement, { target: { value: "Spain" } });

    expect(countryInputElement.value).toBe("Spain");
});

test('AddLocationModal city input changes', () => {
    const show = true;
    render(<WeatherProvider><AddLocationModal show={show} /></WeatherProvider>);
    const cityInputElement = screen.getByPlaceholderText('Enter a city');

    fireEvent.change(cityInputElement, { target: { value: "Madrid" } });

    expect(cityInputElement.value).toBe("Madrid");
});

test('AddLocationModal confirm button is disabled by default', () => {
    const show = true;
    render(<WeatherProvider><AddLocationModal show={show} /></WeatherProvider>);
    const buttonElement = screen.getByTestId('confirmBtn');

    expect(buttonElement).toBeDisabled();
});

test('AddLocationModal confirm button is enabled when inputs are filled', () => {
    const show = true;
    render(<WeatherProvider><AddLocationModal show={show} /></WeatherProvider>);
    const buttonElement = screen.getByTestId('confirmBtn');

    const countryInputElement = screen.getByPlaceholderText('Enter a country');
    fireEvent.change(countryInputElement, { target: { value: "Spain" } });

    const cityInputElement = screen.getByPlaceholderText('Enter a city');
    fireEvent.change(cityInputElement, { target: { value: "Madrid" } });

    expect(buttonElement).not.toBeDisabled();
});
