
export interface TravelerProfile {
  age_group: string;
  travel_style: string;
  interests: string[];
  activity_level: string;
}

export interface TripRequest {
  destination: string;
  days: number;
  budget: number;
  profile: TravelerProfile;
}

export interface Attraction {
  id: number;
  name: string;
  tags: string[];
  description: string;
  entry_fee: number;
  avg_time_spent_hrs: number;
  effort_score: number;
  effort_details: string;
}

export interface DayPlan {
  day: number;
  title: string;
  activities: Attraction[];
  estimated_cost: number;
}

export interface ItineraryResponse {
  itinerary_title: string;
  total_estimated_cost: number;
  itinerary_details: DayPlan[];
}

export interface DailyForecast {
  day: number;
  high_temp: number;
  low_temp: number;
  condition: 'Showers' | 'Thunderstorm' | 'Cloudy' | 'Sunny' | 'Rain';
}

export type CityData = {
  [city: string]: Attraction[];
};
