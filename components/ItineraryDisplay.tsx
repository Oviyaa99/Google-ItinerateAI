
import React from 'react';
import { ItineraryResponse, Attraction, DailyForecast } from '../types';
import Card from './ui/Card';
import LoaderIcon from './icons/LoaderIcon';
import WeatherForecast from './WeatherForecast';

interface ItineraryDisplayProps {
  itinerary: ItineraryResponse | null;
  weather: DailyForecast[] | null;
  isLoading: boolean;
  error: string | null;
}

const AttractionCard: React.FC<{ activity: Attraction }> = ({ activity }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800">{activity.name}</h4>
        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
        <div className="flex justify-between items-center mt-3 text-sm">
            <span className="font-medium text-primary-700 bg-primary-100 px-2 py-1 rounded">
                💰 Entry Fee: ${activity.entry_fee}
            </span>
            <div className="text-gray-500" title={`Effort Score: ${activity.effort_score}/5`}>
                <span className="font-medium">🚶‍♂️ Effort:</span> {activity.effort_details}
            </div>
        </div>
    </div>
);

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary, weather, isLoading, error }) => {
  if (isLoading) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center h-96">
          <LoaderIcon className="w-12 h-12 text-primary-600" />
          <p className="text-gray-600 mt-4 text-lg">Our AI agents are crafting your perfect trip...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center h-96 bg-red-50 rounded-lg p-8">
            <span className="text-5xl">😞</span>
            <h3 className="text-xl font-semibold text-red-800 mt-4">Oops! Something went wrong.</h3>
            <p className="text-red-700 mt-2 text-center">{error}</p>
        </div>
      </Card>
    );
  }

  if (!itinerary) {
    return null; // The initial empty state is handled by App.tsx
  }

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{itinerary.itinerary_title}</h2>
        <p className="mt-2 text-lg text-gray-600">
            Total Estimated Cost: 
            <span className="font-bold text-primary-700"> ${itinerary.total_estimated_cost.toFixed(2)}</span>
        </p>
      </div>

      {weather && weather.length > 0 && (
          <div className="px-6 pb-6 border-b border-gray-200">
            <WeatherForecast forecasts={weather} />
          </div>
      )}

      <div className="p-6 space-y-8">
        {itinerary.itinerary_details.map((day_plan) => (
          <div key={day_plan.day}>
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary-600 text-white text-xl font-bold rounded-full">
                    {day_plan.day}
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">{day_plan.title}</h3>
                    <p className="text-md text-gray-500">Estimated Cost: ${day_plan.estimated_cost.toFixed(2)}</p>
                </div>
            </div>
            <div className="mt-4 pl-4 border-l-4 border-primary-200 ml-6">
                <div className="space-y-4">
                    {day_plan.activities.map((activity) => (
                        <AttractionCard key={activity.id} activity={activity} />
                    ))}
                </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ItineraryDisplay;
