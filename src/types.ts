export type ZoneId = 'sitabuldi' | 'sadar' | 'dharampeth' | 'gandhibagh' | 'mahal' | 'laxmi_nagar' | 'fc_road' | 'shivajinagar' | 'kothrud' | 'dadar_market';

export type BusinessCategory = 
  | 'Street Food & Snacks'
  | 'Kirana & Groceries'
  | 'Textiles & Garments'
  | 'Electronics & Mobile'
  | 'Fruits & Vegetables'
  | 'Tea & Beverages'
  | 'Sweets & Bakeries'
  | 'Jewelry & Ornaments'
  | 'Medical & Health'
  | 'Services & Repairs';

export type ActivityLevel = 'Low' | 'Medium' | 'High' | 'Very High';

export interface Zone {
  id: ZoneId;
  name: string;
  marathiName: string;
  city: string;
  lat: number;
  lng: number;
  activityScore: number; // 0 - 100
  activityLevel: ActivityLevel;
  totalVendors: number;
  activeVendorsNow: number;
  todayTransactions: number;
  peakHour: string;
  predictedPeakHour: string;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  trafficPressure: 'Normal' | 'Moderate' | 'Heavy' | 'Critical';
  trafficScore: number; // 0-100
  commercialDensity: number; // vendors/sq km
  description: string;
  policeStationWard: string;
  aiAdvisoryNote?: string;
}

export interface Vendor {
  id: string;
  shopName: string;
  marathiName?: string;
  ownerName: string;
  category: BusinessCategory;
  zoneId: ZoneId;
  zoneName: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  activityScore: number; // 0 - 100
  activityIndex: number; // index relative to zone average e.g. 1.4x
  todayTransactions: number;
  status: 'Open' | 'Crowded' | 'Normal' | 'Closing Soon' | 'Closed';
  isTrending: boolean;
  operatingHours: string;
  photoUrl: string;
  upiId: string;
  merchantId: string;
  verifiedGovt: boolean;
  cleanlinessRating: number; // 1-5
  serviceRating: number; // 1-5
  complaintsCount: number;
  peakTime: string;
  phoneContact?: string;
  dailyFootfallEst: number;
  hourlyActivity: number[]; // 24 hours of normalized activity %
  weeklyTrend: { day: string; transactions: number; footfall: number }[];
}

export interface Review {
  id: string;
  vendorId: string;
  vendorName: string;
  reviewerMobileMasked: string;
  rating: number;
  cleanliness: number;
  serviceQuality: number;
  comment: string;
  timestamp: string;
  isOtpVerified: boolean;
  status: 'Published' | 'Under Review';
}

export interface Complaint {
  id: string;
  grievanceToken: string;
  vendorId?: string;
  vendorName?: string;
  zoneId: ZoneId;
  zoneName: string;
  citizenMobileMasked: string;
  complaintType: 
    | 'Unauthorized Encroachment'
    | 'Hygiene & Garbage Disposal'
    | 'Severe Footfall Overcrowding'
    | 'Traffic / Pedestrian Blockage'
    | 'Overcharging / Price Irregularity'
    | 'Noise Pollution / Late Night Operation'
    | 'Fire & Electrical Safety';
  description: string;
  photoUrl?: string;
  timestamp: string;
  status: 'Pending' | 'In Progress' | 'Inspection Scheduled' | 'Resolved' | 'Rejected';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  actionTaken?: string;
  assignedOfficer?: string;
}

export interface VendorApplication {
  id: string;
  shopName: string;
  ownerName: string;
  category: BusinessCategory;
  zoneId: ZoneId;
  zoneName: string;
  address: string;
  mobile: string;
  aadhaarMasked: string;
  gstOrUdyamNo?: string;
  lat: number;
  lng: number;
  appliedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  remarks?: string;
}

export interface PredictionInsight {
  zoneId: ZoneId;
  zoneName: string;
  targetTime: string;
  predictedFootfall: number;
  predictedVolume: number;
  expectedCongestion: 'Normal' | 'Moderate' | 'High' | 'Severe';
  confidenceScore: number; // 0-100%
  keyDrivers: string[];
  recommendedAction: string;
}

export interface TrafficAlert {
  id: string;
  zoneId: ZoneId;
  zoneName: string;
  type: 'CONGESTION_WARNING' | 'COMMERCIAL_SURGE' | 'DIVERSION_RECOMMENDED' | 'PEAK_SPIKE';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  time: string;
  civicRecommendation: string;
}

export interface FilterState {
  searchQuery: string;
  zoneId: string; // 'all' or ZoneId
  category: string; // 'all' or BusinessCategory
  timeRange: 'today' | 'week' | 'month';
  peakHour: string; // 'all' | 'morning' | 'afternoon' | 'evening' | 'night'
  activityLevel: string; // 'all' | 'Low' | 'Medium' | 'High' | 'Very High'
  onlyTrending: boolean;
  onlyTopRated: boolean;
  sortBy: 'activityScore' | 'rating' | 'transactions' | 'complaints';
}

export type AuthRole = 'public' | 'vendor' | 'government';

export interface UserSession {
  role: AuthRole;
  name: string;
  departmentOrShop?: string;
  vendorId?: string;
  employeeId?: string;
}
