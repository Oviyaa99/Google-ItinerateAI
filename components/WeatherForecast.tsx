
import React from 'react';
import { DailyForecast } from '../types';
import WeatherIcon from './icons/WeatherIcon';

interface WeatherForecastProps {
  forecasts: DailyForecast[];
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecasts }) => {
  return (
    <div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">Weather Forecast</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {forecasts.map((daily) => (
                <div key={daily.day} className="flex flex-col items-center p-3 bg-gray-100 rounded-lg border border-gray-200 text-center">
                    <p className="font-bold text-sm text-gray-700">Day {daily.day}</p>
                    <div className="text-4xl my-1">
                        <WeatherIcon condition={daily.condition} />
                    </div>
                    <p className="font-semibold text-gray-800">{daily.high_temp}° / {daily.low_temp}°C</p>
                    <p className="text-xs text-gray-500">{daily.condition}</p>
                </div>
            ))}
        </div>
    </div>
  );
};

export default WeatherForecast;
