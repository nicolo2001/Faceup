export type User = {
  id: string;
  name: string;
  email: string;
  type: 'creator' | 'actor' | 'admin';
  avatarUrl?: string;
  verified?: boolean;
  createdAt: string;
};

export type Actor = {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string;
  tagline: string;
  bio: string;
  languages: string[];
  videoTypes: string[];
  tones: string[];
  basePrice: number;
  expressDeliveryPrice?: number;
  expressDeliveryTime?: number;
  standardDeliveryTime: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  verified: boolean;
  completedOrders: number;
  averageResponseTime: string;
  nextAvailable: string;
  workingHours: string;
  timezone: string;
  packages: Package[];
};

export type Package = {
  name: string;
  price: number;
  deliveryTime: number;
  features: string[];
  popular?: boolean;
};

export type Review = {
  id: string;
  actorId: string;
  creatorId: string;
  creatorName: string;
  creatorAvatarUrl?: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type PortfolioItem = {
  id: string;
  actorId: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  videoType: string;
  language: string;
  tone: string;
  createdAt: string;
};

export type Order = {
  id: string;
  creatorId: string;
  actorId: string;
  status: 'pending' | 'in-progress' | 'delivered' | 'completed' | 'revision' | 'cancelled';
  scriptUrl?: string;
  assetsUrl?: string;
  videoUrl?: string;
  instructions?: string;
  expressDelivery: boolean;
  price: number;
  createdAt: string;
  deliveryDate: string;
  revisionsLeft: number;
};

export type FilterOptions = {
  languages?: string[];
  videoTypes?: string[];
  tones?: string[];
  minPrice?: number;
  maxPrice?: number;
  maxDeliveryTime?: number;
};

export type SearchHistory = {
  term: string;
  timestamp: number;
};

export type ComparisonItem = {
  actorId: string;
  selected: boolean;
};