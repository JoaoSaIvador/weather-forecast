import { render, screen } from "@testing-library/react";
import WeatherCard from "../components/WeatherCard";

test('WeatherCard renders the title correctly', () => {
    render(<WeatherCard title="Today" />);
    const titleElement = screen.getByText('Today');
    expect(titleElement).toBeInTheDocument();
});

test('WeatherCard renders the icon correctly', () => {
    const weather = {
        icon: '01d'
    };

    render(<WeatherCard weather={weather} />);
    const iconElement = screen.getByTestId('icon');
    expect(iconElement.src).toContain("http://openweathermap.org/img/wn/01d@2x.png");
});

test('WeatherCard renders the description correctly', () => {
    const weather = {
        description: 'few clouds'
    };

    render(<WeatherCard weather={weather} />);
    const descriptionElement = screen.getByText(/few clouds/i);
    expect(descriptionElement).toBeInTheDocument();
});