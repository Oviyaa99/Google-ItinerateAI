
import React, { useState } from 'react';
import TripForm from './components/TripForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import { generateItinerary } from './services/geminiService';
import { getWeatherForecast } from './services/weatherService';
import { TripRequest, ItineraryResponse, DailyForecast } from './types';
import SparklesIcon from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [weather, setWeather] = useState<DailyForecast[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (request: TripRequest) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);
    setWeather(null);
    try {
      const itineraryResult = await generateItinerary(request);
      setItinerary(itineraryResult);
      
      const weatherResult = await getWeatherForecast(request.destination, request.days);
      setWeather(weatherResult);

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate itinerary. ${errorMessage} Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🌍</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
              Itinerate<span className="text-primary-600">AI</span>
            </h1>
          </div>
          <p className="text-gray-500 mt-1">Your Personal Travel Co-Pilot</p>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <TripForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="h-full">
               <ItineraryDisplay 
                  itinerary={itinerary} 
                  weather={weather}
                  isLoading={isLoading} 
                  error={error} 
               />
               {!itinerary && !isLoading && !error && (
                 <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-md p-8 border border-gray-200">
                    <SparklesIcon className="w-16 h-16 text-primary-500 mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">Ready for an Adventure?</h2>
                    <p className="text-gray-500 text-center max-w-md">
                        Fill out your trip details on the left, and our AI agents will craft a personalized itinerary just for you.
                    </p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
