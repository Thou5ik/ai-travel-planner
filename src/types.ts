/**
 * Types and interfaces for the Travel Itinerary Generator
 */

export type TravelStyle = 'Budget' | 'Balanced' | 'Luxury' | 'Adventure' | 'Culture' | 'Relaxing' | 'Family';

export interface TripParameters {
  destination: string;
  duration: number; // 1 to 10 days
  style: TravelStyle;
  interests: string[];
  season: string;
  extraDetails: string;
}

export interface Activity {
  timeSlot: 'Morning' | 'Afternoon' | 'Evening';
  title: string;
  description: string;
  costEstimate: string; // e.g., "Free", "$", "$$", "$$$"
  location: string;
  category: 'sightseeing' | 'food' | 'relaxation' | 'adventure' | 'shopping' | 'transit' | 'culture';
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  theme: string;
  activities: Activity[];
}

export interface BudgetBreakdown {
  accommodation: string;
  foodAndDrinks: string;
  activities: string;
  transport: string;
  estimatedTotal: string;
}

export interface CulinaryRecommendation {
  name: string;
  description: string;
  type: 'Dish' | 'Restaurant' | 'Street Food' | 'Area';
}

export interface Itinerary {
  id: string;
  destination: string;
  duration: number;
  style: TravelStyle;
  interests: string[];
  season: string;
  extraDetails?: string;
  title: string;
  summary: string;
  highlights: string[];
  days: DayPlan[];
  budgetBreakdown: BudgetBreakdown;
  culinaryHighlights: CulinaryRecommendation[];
  packingGuide: string[];
  localTips: string[];
  createdAt: number;
  isFallback?: boolean;
  fallbackReason?: string;
}
