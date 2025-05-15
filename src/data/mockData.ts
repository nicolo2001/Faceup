import { Actor, PortfolioItem, Review, Order } from '../types';

// Mock Actors
export const actors: Actor[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Emma Johnson',
    avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    tagline: 'Professional spokesperson with 5+ years experience',
    bio: 'I specialize in creating engaging, professional videos for businesses and content creators. My background in marketing helps me understand how to convey your message effectively.',
    languages: ['English', 'Spanish'],
    videoTypes: ['Explainer', 'Product Demo', 'Tutorial'],
    tones: ['Professional', 'Friendly', 'Energetic'],
    basePrice: 150,
    expressDeliveryPrice: 75,
    expressDeliveryTime: 1,
    standardDeliveryTime: 3,
    rating: 4.8,
    reviewCount: 127,
    featured: true,
    verified: true,
    completedOrders: 243,
    averageResponseTime: '2 hours',
    nextAvailable: 'Tomorrow',
    workingHours: '9 AM - 6 PM',
    timezone: 'EST (UTC-5)',
    packages: [
      {
        name: 'Basic',
        price: 150,
        deliveryTime: 3,
        features: [
          'Up to 2 minutes video',
          'Professional lighting',
          '2 revisions',
          'HD 1080p delivery'
        ]
      },
      {
        name: 'Standard',
        price: 250,
        deliveryTime: 2,
        features: [
          'Up to 5 minutes video',
          'Professional lighting',
          '3 revisions',
          'HD 1080p delivery',
          'Custom background setup',
          'Script review & feedback'
        ],
        popular: true
      },
      {
        name: 'Premium',
        price: 400,
        deliveryTime: 2,
        features: [
          'Up to 10 minutes video',
          'Professional lighting',
          'Unlimited revisions',
          '4K delivery',
          'Custom background setup',
          'Script review & feedback',
          'Multiple video formats',
          'Rush delivery option'
        ]
      }
    ]
  },
  {
    id: '2',
    userId: 'user2',
    name: 'Marcus Chen',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    tagline: 'Tech explainer and software demonstrator',
    bio: 'Former software engineer turned video presenter. I specialize in explaining complex tech concepts in simple terms and creating engaging software demonstrations.',
    languages: ['English', 'Mandarin'],
    videoTypes: ['Tech Review', 'Software Demo', 'Tutorial'],
    tones: ['Professional', 'Educational', 'Casual'],
    basePrice: 175,
    expressDeliveryPrice: 100,
    expressDeliveryTime: 1,
    standardDeliveryTime: 4,
    rating: 4.9,
    reviewCount: 86,
    featured: true,
    verified: true,
    completedOrders: 156,
    averageResponseTime: '3 hours',
    nextAvailable: 'Today',
    workingHours: '10 AM - 7 PM',
    timezone: 'PST (UTC-8)',
    packages: [
      {
        name: 'Basic',
        price: 175,
        deliveryTime: 4,
        features: [
          'Up to 2 minutes video',
          'Professional lighting',
          '2 revisions',
          'HD 1080p delivery'
        ]
      },
      {
        name: 'Standard',
        price: 275,
        deliveryTime: 3,
        features: [
          'Up to 5 minutes video',
          'Professional lighting',
          '3 revisions',
          'HD 1080p delivery',
          'Custom background setup',
          'Script review & feedback'
        ],
        popular: true
      },
      {
        name: 'Premium',
        price: 450,
        deliveryTime: 2,
        features: [
          'Up to 10 minutes video',
          'Professional lighting',
          'Unlimited revisions',
          '4K delivery',
          'Custom background setup',
          'Script review & feedback',
          'Multiple video formats',
          'Rush delivery option'
        ]
      }
    ]
  },
  {
    id: '3',
    userId: 'user3',
    name: 'Sophia Rodriguez',
    avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    tagline: 'Energetic presenter for lifestyle & product content',
    bio: 'I bring products to life with my energetic and engaging presentation style. Specialized in lifestyle products, beauty, fitness, and consumer electronics.',
    languages: ['English', 'Spanish', 'Portuguese'],
    videoTypes: ['Product Review', 'Lifestyle', 'Unboxing'],
    tones: ['Energetic', 'Casual', 'Enthusiastic'],
    basePrice: 125,
    expressDeliveryPrice: 60,
    expressDeliveryTime: 1,
    standardDeliveryTime: 3,
    rating: 4.7,
    reviewCount: 94,
    verified: true,
    featured: false,
    completedOrders: 178,
    averageResponseTime: '1 hour',
    nextAvailable: 'Tomorrow',
    workingHours: '8 AM - 4 PM',
    timezone: 'CST (UTC-6)',
    packages: [
      {
        name: 'Basic',
        price: 125,
        deliveryTime: 3,
        features: [
          'Up to 2 minutes video',
          'Professional lighting',
          '2 revisions',
          'HD 1080p delivery'
        ]
      },
      {
        name: 'Standard',
        price: 200,
        deliveryTime: 2,
        features: [
          'Up to 5 minutes video',
          'Professional lighting',
          '3 revisions',
          'HD 1080p delivery',
          'Custom background setup',
          'Script review & feedback'
        ],
        popular: true
      },
      {
        name: 'Premium',
        price: 350,
        deliveryTime: 2,
        features: [
          'Up to 10 minutes video',
          'Professional lighting',
          'Unlimited revisions',
          '4K delivery',
          'Custom background setup',
          'Script review & feedback',
          'Multiple video formats',
          'Rush delivery option'
        ]
      }
    ]
  },
  {
    id: '4',
    userId: 'user4',
    name: 'James Wilson',
    avatarUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
    tagline: 'Corporate and professional video spokesperson',
    bio: 'With 10+ years experience in corporate communications, I create polished, professional videos that represent your brand with the utmost integrity.',
    languages: ['English', 'French'],
    videoTypes: ['Corporate', 'Training', 'Promotional'],
    tones: ['Professional', 'Authoritative', 'Trustworthy'],
    basePrice: 200,
    expressDeliveryPrice: 100,
    expressDeliveryTime: 2,
    standardDeliveryTime: 5,
    rating: 4.9,
    reviewCount: 152,
    verified: true,
    featured: true,
    completedOrders: 312,
    averageResponseTime: '4 hours',
    nextAvailable: '2 days',
    workingHours: '9 AM - 5 PM',
    timezone: 'GMT (UTC+0)',
    packages: [
      {
        name: 'Basic',
        price: 200,
        deliveryTime: 5,
        features: [
          'Up to 2 minutes video',
          'Professional lighting',
          '2 revisions',
          'HD 1080p delivery'
        ]
      },
      {
        name: 'Standard',
        price: 300,
        deliveryTime: 3,
        features: [
          'Up to 5 minutes video',
          'Professional lighting',
          '3 revisions',
          'HD 1080p delivery',
          'Custom background setup',
          'Script review & feedback'
        ],
        popular: true
      },
      {
        name: 'Premium',
        price: 500,
        deliveryTime: 2,
        features: [
          'Up to 10 minutes video',
          'Professional lighting',
          'Unlimited revisions',
          '4K delivery',
          'Custom background setup',
          'Script review & feedback',
          'Multiple video formats',
          'Rush delivery option'
        ]
      }
    ]
  },
  {
    id: '5',
    userId: 'user5',
    name: 'Aisha Patel',
    avatarUrl: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
    tagline: 'Friendly and approachable educational content creator',
    bio: 'I specialize in educational content that breaks down complex topics into easy-to-understand explanations. My teaching background helps me create engaging learning experiences.',
    languages: ['English', 'Hindi'],
    videoTypes: ['Educational', 'Explainer', 'Tutorial'],
    tones: ['Friendly', 'Educational', 'Calm'],
    basePrice: 140,
    expressDeliveryPrice: 70,
    expressDeliveryTime: 1,
    standardDeliveryTime: 4,
    rating: 4.6,
    reviewCount: 78,
    verified: true,
    featured: false,
    completedOrders: 134,
    averageResponseTime: '3 hours',
    nextAvailable: 'Today',
    workingHours: '10 AM - 6 PM',
    timezone: 'IST (UTC+5:30)',
    packages: [
      {
        name: 'Basic',
        price: 140,
        deliveryTime: 4,
        features: [
          'Up to 2 minutes video',
          'Professional lighting',
          '2 revisions',
          'HD 1080p delivery'
        ]
      },
      {
        name: 'Standard',
        price: 225,
        deliveryTime: 3,
        features: [
          'Up to 5 minutes video',
          'Professional lighting',
          '3 revisions',
          'HD 1080p delivery',
          'Custom background setup',
          'Script review & feedback'
        ],
        popular: true
      },
      {
        name: 'Premium',
        price: 375,
        deliveryTime: 2,
        features: [
          'Up to 10 minutes video',
          'Professional lighting',
          'Unlimited revisions',
          '4K delivery',
          'Custom background setup',
          'Script review & feedback',
          'Multiple video formats',
          'Rush delivery option'
        ]
      }
    ]
  }
];

// Mock Portfolio Items
export const portfolioItems: PortfolioItem[] = [
  {
    id: 'port1',
    actorId: '1',
    title: 'SaaS Product Explainer',
    description: 'A clear, professional explanation of a project management SaaS tool.',
    videoUrl: 'https://example.com/videos/saas-explainer',
    thumbnailUrl: 'https://images.pexels.com/photos/7433822/pexels-photo-7433822.jpeg',
    videoType: 'Explainer',
    language: 'English',
    tone: 'Professional',
    createdAt: '2024-04-01'
  },
  {
    id: 'port2',
    actorId: '1',
    title: 'E-commerce Product Demo',
    description: 'Showcasing the features and benefits of a premium headphone set.',
    videoUrl: 'https://example.com/videos/headphone-demo',
    thumbnailUrl: 'https://images.pexels.com/photos/7521422/pexels-photo-7521422.jpeg',
    videoType: 'Product Demo',
    language: 'English',
    tone: 'Friendly',
    createdAt: '2024-03-15'
  },
  {
    id: 'port3',
    actorId: '2',
    title: 'AI Software Tutorial',
    description: 'Step-by-step guide on using a new AI image generation tool.',
    videoUrl: 'https://example.com/videos/ai-tutorial',
    thumbnailUrl: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg',
    videoType: 'Tutorial',
    language: 'English',
    tone: 'Educational',
    createdAt: '2024-04-05'
  },
  {
    id: 'port4',
    actorId: '3',
    title: 'Smart Home Product Review',
    description: 'Energetic review of the latest smart home assistant device.',
    videoUrl: 'https://example.com/videos/smarthome-review',
    thumbnailUrl: 'https://images.pexels.com/photos/3958849/pexels-photo-3958849.jpeg',
    videoType: 'Product Review',
    language: 'English',
    tone: 'Enthusiastic',
    createdAt: '2024-03-28'
  }
];

// Mock Reviews
export const reviews: Review[] = [
  {
    id: 'rev1',
    actorId: '1',
    creatorId: 'creator1',
    creatorName: 'TechStartup Inc.',
    creatorAvatarUrl: 'https://images.pexels.com/photos/15031949/pexels-photo-15031949.jpeg',
    rating: 5,
    comment: 'Emma was fantastic to work with! She understood our product perfectly and delivered a professional video that exceeded our expectations. Will definitely work with her again.',
    createdAt: '2024-04-02'
  },
  {
    id: 'rev2',
    actorId: '1',
    creatorId: 'creator2',
    creatorName: 'MarketingPro',
    creatorAvatarUrl: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg',
    rating: 4.5,
    comment: 'Great delivery and communication throughout the process. The video was exactly what we needed for our campaign.',
    createdAt: '2024-03-25'
  },
  {
    id: 'rev3',
    actorId: '2',
    creatorId: 'creator3',
    creatorName: 'SoftwareSolutions',
    creatorAvatarUrl: 'https://images.pexels.com/photos/7772016/pexels-photo-7772016.jpeg',
    rating: 5,
    comment: 'Marcus has a real talent for explaining complex software features in an accessible way. Our customers loved the tutorial videos.',
    createdAt: '2024-04-01'
  }
];

// Mock Orders
export const orders: Order[] = [
  {
    id: 'order1',
    creatorId: 'creator1',
    actorId: '1',
    status: 'completed',
    videoUrl: 'https://example.com/videos/completed-project-1',
    instructions: 'We need a professional introduction to our new project management software. Please emphasize the collaboration features.',
    expressDelivery: false,
    price: 150,
    createdAt: '2024-03-20',
    deliveryDate: '2024-03-23',
    revisionsLeft: 0
  },
  {
    id: 'order2',
    creatorId: 'creator2',
    actorId: '1',
    status: 'in-progress',
    scriptUrl: 'https://example.com/scripts/project-2',
    assetsUrl: 'https://example.com/assets/project-2',
    instructions: 'Looking for an energetic presentation of our new fitness app. Please wear casual, athletic clothing.',
    expressDelivery: true,
    price: 225,
    createdAt: '2024-04-05',
    deliveryDate: '2024-04-06',
    revisionsLeft: 2
  },
  {
    id: 'order3',
    creatorId: 'creator3',
    actorId: '2',
    status: 'delivered',
    scriptUrl: 'https://example.com/scripts/project-3',
    assetsUrl: 'https://example.com/assets/project-3',
    videoUrl: 'https://example.com/videos/delivered-project-3',
    instructions: 'We need a technical explanation of our API integration process. Please use the provided diagrams.',
    expressDelivery: false,
    price: 175,
    createdAt: '2024-04-02',
    deliveryDate: '2024-04-06',
    revisionsLeft: 2
  }
];

// Predefined filter options
export const languageOptions = ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Hindi', 'Portuguese', 'Arabic'];
export const videoTypeOptions = ['Explainer', 'Tutorial', 'Product Demo', 'Corporate', 'Training', 'Promotional', 'Educational', 'Lifestyle', 'Tech Review', 'Software Demo', 'Unboxing'];
export const toneOptions = ['Professional', 'Friendly', 'Energetic', 'Casual', 'Authoritative', 'Educational', 'Enthusiastic', 'Trustworthy', 'Calm'];