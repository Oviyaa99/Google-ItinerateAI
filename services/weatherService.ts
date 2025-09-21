
import { DailyForecast } from '../types';

// In a real application, this would come from process.env.WEATHER_API_KEY
// For this demo, we simulate the API and don't need a real key.
const WEATHER_API_KEY = "dummy_key"; 

const mockSingaporeForecast: Omit<DailyForecast, 'day'>[] = [
    { high_temp: 32, low_temp: 26, condition: 'Showers' },
    { high_temp: 33, low_temp: 27, condition: 'Thunderstorm' },
    { high_temp: 31, low_temp: 26, condition: 'Cloudy' },
    { high_temp: 32, low_temp: 26, condition: 'Showers' },
    { high_temp: 33, low_temp: 27, condition: 'Sunny' },
    { high_temp: 30, low_temp: 25, condition: 'Rain' },
    { high_temp: 31, low_temp: 26, condition: 'Cloudy' },
    { high_temp: 32, low_temp: 26, condition: 'Thunderstorm' },
    { high_temp: 33, low_temp: 27, condition: 'Sunny' },
    { high_temp: 31, low_temp: 26, condition: 'Showers' },
    { high_temp: 32, low_temp: 26, condition: 'Cloudy' },
    { high_temp: 30, low_temp: 25, condition: 'Rain' },
    { high_temp: 33, low_temp: 27, condition: 'Thunderstorm' },
    { high_temp: 32, low_temp: 26, condition: 'Sunny' },
];

/**
 * Simulates fetching a weather forecast for a given city and number of days.
 * In a real-world app, this would make an API call to a weather service.
 */
export const getWeatherForecast = async (
  city: string,
  numDays: number
): Promise<DailyForecast[]> => {
  if (!WEATHER_API_KEY) {
    console.warn("Weather API key not set. Skipping weather fetch.");
    return [];
  }

  console.log(`Simulating weather fetch for ${city} for ${numDays} days...`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  if (city.toLowerCase() !== 'singapore') {
    console.warn(`No mock weather data available for ${city}.`);
    return [];
  }

  // Generate a forecast for the requested number of days
  const forecast: DailyForecast[] = [];
  for (let i = 0; i < numDays; i++) {
    forecast.push({
      day: i + 1,
      ...mockSingaporeForecast[i % mockSingaporeForecast.length] // Cycle through mock data
    });
  }

  return forecast;
};
