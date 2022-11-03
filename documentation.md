# Documentation

### Quick Start Guide

-   First, you need to have Node.js installed on your machine
-   Clone this repository
-   Run "cd fe-assignment-JoaoSalvador/weather-app"
-   Add a file named ".env" to this weather-app folder containing this "REACT_APP_API_KEY=YOUR_KEY", replacing the "YOUR_KEY" with your OpenWeatherMap api key
-   Run "npm start" to launch the application
-   Or run "npm test" to run the unit tests

### Notes

-   Your OpenWeatherMap api key should have access to the "One Call API 3.0" plan for the application to function properly

### Component Tree

For faster understanding of this application the component tree is as such:

-   GlobalState
    -   Dashboard
        -   ThemeToggle
        -   LocationSection
            -   AddLocationModal
            -   RemoveLocationModal
        -   CardsList
            -   WeatherCard
    -   NotFound
