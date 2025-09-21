
import { GoogleGenAI, Type } from "@google/genai";
import { TripRequest, Attraction, ItineraryResponse } from '../types';
import { demoData } from '../data/demoData';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const loadAttractionData = (city: string): Attraction[] => {
    return demoData[city] || [];
};

const experienceAgent = (profile: TripRequest['profile'], city: string): Attraction[] => {
    const allAttractions = loadAttractionData(city);
    if (!allAttractions) return [];

    const filtered = allAttractions.filter(attraction => 
        profile.interests.some(interest => attraction.tags.includes(interest))
    );
    return filtered;
};

const budgetAndLogisticsAgent = (attractions: Attraction[], days: number, budget: number): Attraction[] => {
    attractions.sort((a, b) => a.entry_fee - b.entry_fee);
    
    // Heuristic: Aim for 2 activities per day, but allow up to 3 if budget permits
    const maxActivities = days * 2;
    const selectedAttractions: Attraction[] = [];
    let currentCost = 0.0;

    for (const attraction of attractions) {
        if (selectedAttractions.length < maxActivities && currentCost + attraction.entry_fee <= budget) {
            selectedAttractions.push(attraction);
            currentCost += attraction.entry_fee;
        }
    }
    return selectedAttractions;
};

const masterPlannerAgent = async (request: TripRequest, finalAttractions: Attraction[]): Promise<any> => {
    const prompt = `
    Act as a friendly and expert travel agent. You are creating a personalized itinerary for a trip to ${request.destination}.
    
    Traveler's Profile:
    - Age Group: ${request.profile.age_group}
    - Travel Style: ${request.profile.travel_style}
    - Interests: ${request.profile.interests.join(', ')}
    - Activity Level: ${request.profile.activity_level}
    - Trip Duration: ${request.days} days
    - Budget: $${request.budget}

    Selected Attractions based on profile and budget:
    ${JSON.stringify(finalAttractions.map(({ id, avg_time_spent_hrs, tags, ...rest }) => rest), null, 2)}

    Your task is to organize these attractions into a coherent and enjoyable ${request.days}-day itinerary.
    - For each day, provide a creative and thematic title (e.g., 'Day 1: Cultural Immersion & City Lights').
    - Assign the attractions to different days logically.
    - Generate an engaging, short, one-paragraph summary for each day's plan.
    - Return the output ONLY as a valid JSON object, adhering to the specified schema. Do not include any text, markdown formatting, or code fences before or after the JSON object.
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            itinerary_title: {
                type: Type.STRING,
                description: `A creative, catchy title for the entire trip to ${request.destination}.`
            },
            itinerary_details: {
                type: Type.ARRAY,
                description: `An array of daily plans for the ${request.days}-day trip.`,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        day: { type: Type.INTEGER, description: "The day number, starting from 1." },
                        title: { type: Type.STRING, description: "A creative, thematic title for the day's activities." },
                        summary: {type: Type.STRING, description: "An engaging, one-paragraph summary of the day's plan."},
                        activities_names: {
                            type: Type.ARRAY,
                            description: "An array of attraction names for this day.",
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["day", "title", "summary", "activities_names"],
                }
            }
        },
        required: ["itinerary_title", "itinerary_details"]
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });
    
    return JSON.parse(response.text);
};


export const generateItinerary = async (request: TripRequest): Promise<ItineraryResponse> => {
    // 1. Experience Agent finds potential attractions
    const potentialAttractions = experienceAgent(request.profile, request.destination);
    
    // 2. Budget & Logistics Agent selects a feasible set
    const finalAttractions = budgetAndLogisticsAgent(potentialAttractions, request.days, request.budget);

    if (finalAttractions.length === 0) {
        throw new Error("Could not find any suitable attractions for the given profile and budget.");
    }

    // 3. Master Planner Agent (Gemini) creates the narrative and structure
    const itineraryData = await masterPlannerAgent(request, finalAttractions);

    // 4. Post-process and combine data to build the final response object
    let totalCost = 0;
    const attractionMap = new Map(finalAttractions.map(attr => [attr.name, attr]));

    const dayPlans = itineraryData.itinerary_details.map((day_data: any) => {
        let dayCost = 0;
        const activitiesForDay: Attraction[] = [];
        
        day_data.activities_names.forEach((name: string) => {
            const attrData = attractionMap.get(name);
            if (attrData) {
                activitiesForDay.push(attrData);
                dayCost += attrData.entry_fee;
            }
        });

        totalCost += dayCost;
        return {
            day: day_data.day,
            title: day_data.title,
            activities: activitiesForDay,
            estimated_cost: dayCost
        };
    });

    return {
        itinerary_title: itineraryData.itinerary_title,
        total_estimated_cost: totalCost,
        itinerary_details: dayPlans
    };
};
