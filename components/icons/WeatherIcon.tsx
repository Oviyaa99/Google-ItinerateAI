
import React from 'react';
import { DailyForecast } from '../../types';

interface WeatherIconProps {
  condition: DailyForecast['condition'];
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, className }) => {
  const getIcon = () => {
    switch (condition) {
      case 'Sunny':
        return '☀️';
      case 'Cloudy':
        return '☁️';
      case 'Rain':
        return '🌧️';
      case 'Showers':
        return '🌦️';
      case 'Thunderstorm':
        return '⛈️';
      default:
        return '🌍';
    }
  };

  return <span role="img" aria-label={condition} className={className}>{getIcon()}</span>;
};

export default WeatherIcon;
