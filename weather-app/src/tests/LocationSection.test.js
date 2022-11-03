import { render, screen } from "@testing-library/react";
import LocationSection from "../components/LocationSection";
import { WeatherProvider } from '../GlobalState';

test('LocationSection country select sets default option correctly', () => {
    render(<WeatherProvider><LocationSection /></WeatherProvider>);
    const optionElement = screen.getByRole('option', { name: 'Choose a country' });

    expect(optionElement.selected).toBe(true);
});

test('LocationSection city select sets default option correctly', () => {
    render(<WeatherProvider><LocationSection /></WeatherProvider>);
    const optionElement = screen.getByRole('option', { name: 'Choose a city' });

    expect(optionElement.selected).toBe(true);
});

test('LocationSection renders add location button correctly', () => {
    render(<WeatherProvider><LocationSection /></WeatherProvider>);
    const buttonElement = screen.getByTestId('addLocationBtn');

    expect(buttonElement).toBeInTheDocument();
});

test('LocationSection renders remove location button correctly', () => {
    render(<WeatherProvider><LocationSection /></WeatherProvider>);
    const buttonElement = screen.queryByRole('button', { name: 'Remove' });

    expect(buttonElement).not.toBeInTheDocument();
});