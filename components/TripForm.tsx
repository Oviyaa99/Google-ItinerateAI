
import React, { useState } from 'react';
import { TripRequest } from '../types';
import SparklesIcon from './icons/SparklesIcon';

interface TripFormProps {
  onSubmit: (request: TripRequest) => void;
  isLoading: boolean;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading }) => {
  const [destination, setDestination] = useState('Singapore');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(1500);
  const [ageGroup, setAgeGroup] = useState('Adults (20-35)');
  const [travelStyle, setTravelStyle] = useState('Couple');
  const [activityLevel, setActivityLevel] = useState('Moderate');
  const [interests, setInterests] = useState<string[]>(['nature', 'culture']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      destination,
      days,
      budget,
      profile: {
        age_group: ageGroup,
        travel_style: travelStyle,
        interests,
        activity_level: activityLevel
      }
    });
  };

  const InterestCheckbox = ({ value, label }: { value: string, label: string }) => (
    <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer hover:text-primary-600 transition-colors">
      <input
        type="checkbox"
        value={value}
        checked={interests.includes(value)}
        onChange={(e) => {
          if (e.target.checked) {
            setInterests([...interests, value]);
          } else {
            setInterests(interests.filter(i => i !== value));
          }
        }}
        className="form-checkbox h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
      />
      <span>{label}</span>
    </label>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 sticky top-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">✈️ Plan Your Trip</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
          <input type="text" id="destination" value={destination} onChange={e => setDestination(e.target.value)} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm cursor-not-allowed" />
          <p className="text-xs text-gray-500 mt-1">"Singapore" is the only destination for this demo.</p>
        </div>
        
        <div>
          <label htmlFor="days" className="block text-sm font-medium text-gray-700">Number of Days: <span className="font-bold text-primary-600">{days}</span></label>
          <input type="range" id="days" min="1" max="14" value={days} onChange={e => setDays(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600" />
        </div>

        <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget (USD)</label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input type="number" id="budget" value={budget} onChange={e => setBudget(Number(e.target.value))} min="100" step="50" className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" />
            </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Traveler Profile</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700">Age Group</label>
                    <select id="ageGroup" value={ageGroup} onChange={e => setAgeGroup(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                        <option>Adults (20-35)</option>
                        <option>Family with Kids</option>
                        <option>Seniors (50+)</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="travelStyle" className="block text-sm font-medium text-gray-700">Travel Style</label>
                    <select id="travelStyle" value={travelStyle} onChange={e => setTravelStyle(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                        <option>Family</option>
                        <option>Couple</option>
                        <option>Solo</option>
                    </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Activity Level</label>
                  <div className="mt-2 flex rounded-md shadow-sm">
                    {['Relaxed', 'Moderate', 'Active'].map(level => (
                        <button type="button" key={level} onClick={() => setActivityLevel(level)} className={`px-4 py-2 text-sm font-medium border -ml-px first:ml-0 first:rounded-l-md last:rounded-r-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${activityLevel === level ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                            {level}
                        </button>
                    ))}
                  </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Interests</label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                        <InterestCheckbox value="nature" label="Nature" />
                        <InterestCheckbox value="adventure" label="Adventure" />
                        <InterestCheckbox value="culture" label="Culture" />
                        <InterestCheckbox value="shopping" label="Shopping" />
                    </div>
                </div>
            </div>
        </div>

        <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed transition-colors">
          <SparklesIcon className="w-5 h-5 mr-2" />
          {isLoading ? 'Crafting Your Trip...' : 'Generate Itinerary'}
        </button>
      </form>
    </div>
  );
};

export default TripForm;
