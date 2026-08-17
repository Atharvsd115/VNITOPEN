import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Zone,
  Vendor,
  Review,
  Complaint,
  VendorApplication,
  PredictionInsight,
  TrafficAlert,
  FilterState,
  UserSession,
  ZoneId,
  BusinessCategory
} from '../types';
import {
  INITIAL_ZONES,
  INITIAL_VENDORS,
  INITIAL_REVIEWS,
  INITIAL_COMPLAINTS,
  INITIAL_VENDOR_APPLICATIONS,
  INITIAL_PREDICTIONS,
  INITIAL_TRAFFIC_ALERTS
} from '../data/mockData';

interface AppContextType {
  // Data
  zones: Zone[];
  vendors: Vendor[];
  reviews: Review[];
  complaints: Complaint[];
  vendorApplications: VendorApplication[];
  predictions: PredictionInsight[];
  trafficAlerts: TrafficAlert[];
  
  // Filtering & Computed
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  filteredVendors: Vendor[];
  filteredZones: Zone[];
  totalTodayTransactions: number;
  highActivityZonesCount: number;
  predictedPeakZonesCount: number;
  
  // Selected state & navigation
  activeTab: 'home' | 'map' | 'vendors' | 'peak' | 'traffic' | 'government' | 'vendor-portal';
  setActiveTab: (tab: 'home' | 'map' | 'vendors' | 'peak' | 'traffic' | 'government' | 'vendor-portal') => void;
  selectedVendor: Vendor | null;
  setSelectedVendor: (vendor: Vendor | null) => void;
  selectedZone: Zone | null;
  setSelectedZone: (zone: Zone | null) => void;

  // Modals
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  isComplaintModalOpen: boolean;
  setIsComplaintModalOpen: (open: boolean) => void;
  isVendorAppModalOpen: boolean;
  setIsVendorAppModalOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  loginModalTargetRole: 'vendor' | 'government';
  setLoginModalTargetRole: (role: 'vendor' | 'government') => void;

  // User Auth & Role
  userSession: UserSession;
  loginAs: (role: 'public' | 'vendor' | 'government', name?: string, shopOrDept?: string, vendorId?: string) => void;
  logout: () => void;

  // Actions
  addReview: (review: Omit<Review, 'id' | 'timestamp' | 'isOtpVerified' | 'status'>) => void;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'grievanceToken' | 'timestamp' | 'status'>) => string;
  updateComplaintStatus: (id: string, status: Complaint['status'], actionTaken?: string, assignedOfficer?: string) => void;
  submitVendorApplication: (application: Omit<VendorApplication, 'id' | 'appliedDate' | 'status'>) => void;
  handleVendorApplicationStatus: (id: string, status: 'Approved' | 'Rejected', remarks?: string) => void;
  updateVendorDetails: (vendorId: string, updates: Partial<Vendor>) => void;
  broadcastAlert: (alert: Omit<TrafficAlert, 'id' | 'time'>) => void;
  
  // Accessibility & Localization
  language: 'en' | 'mr';
  setLanguage: (lang: 'en' | 'mr') => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  t: (en: string, mr: string) => string;
}

const initialFilters: FilterState = {
  searchQuery: '',
  zoneId: 'all',
  category: 'all',
  timeRange: 'today',
  peakHour: 'all',
  activityLevel: 'all',
  onlyTrending: false,
  onlyTopRated: false,
  sortBy: 'activityScore'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zones, setZones] = useState<Zone[]>(() => {
    const saved = localStorage.getItem('lokvyapar_zones');
    return saved ? JSON.parse(saved) : INITIAL_ZONES;
  });

  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem('lokvyapar_vendors');
    return saved ? JSON.parse(saved) : INITIAL_VENDORS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('lokvyapar_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('lokvyapar_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [vendorApplications, setVendorApplications] = useState<VendorApplication[]>(() => {
    const saved = localStorage.getItem('lokvyapar_vendor_apps');
    return saved ? JSON.parse(saved) : INITIAL_VENDOR_APPLICATIONS;
  });

  const [predictions] = useState<PredictionInsight[]>(INITIAL_PREDICTIONS);
  const [trafficAlerts, setTrafficAlerts] = useState<TrafficAlert[]>(INITIAL_TRAFFIC_ALERTS);

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [activeTab, setActiveTab] = useState<'home' | 'map' | 'vendors' | 'peak' | 'traffic' | 'government' | 'vendor-portal'>('home');
  
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  // Modals
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [isVendorAppModalOpen, setIsVendorAppModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalTargetRole, setLoginModalTargetRole] = useState<'vendor' | 'government'>('government');

  // User session
  const [userSession, setUserSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem('lokvyapar_session');
    return saved ? JSON.parse(saved) : { role: 'public', name: 'Citizen / Visitor' };
  });

  // Localization & Accessibility
  const [language, setLanguage] = useState<'en' | 'mr'>('en');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('lokvyapar_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('lokvyapar_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('lokvyapar_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('lokvyapar_vendor_apps', JSON.stringify(vendorApplications));
  }, [vendorApplications]);

  useEffect(() => {
    localStorage.setItem('lokvyapar_session', JSON.stringify(userSession));
  }, [userSession]);

  // Translation helper
  const t = (en: string, mr: string) => (language === 'mr' ? mr : en);

  // Filtered vendors computation
  const filteredVendors = useMemo(() => {
    return vendors
      .filter((vendor) => {
        // Search query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchName = vendor.shopName.toLowerCase().includes(q) || (vendor.marathiName && vendor.marathiName.toLowerCase().includes(q));
          const matchOwner = vendor.ownerName.toLowerCase().includes(q);
          const matchCat = vendor.category.toLowerCase().includes(q);
          const matchZone = vendor.zoneName.toLowerCase().includes(q);
          if (!matchName && !matchOwner && !matchCat && !matchZone) return false;
        }

        // Zone filter
        if (filters.zoneId !== 'all' && vendor.zoneId !== filters.zoneId) {
          return false;
        }

        // Category filter
        if (filters.category !== 'all' && vendor.category !== filters.category) {
          return false;
        }

        // Activity Level
        if (filters.activityLevel !== 'all') {
          if (filters.activityLevel === 'Very High' && vendor.activityScore < 90) return false;
          if (filters.activityLevel === 'High' && (vendor.activityScore < 75 || vendor.activityScore >= 90)) return false;
          if (filters.activityLevel === 'Medium' && (vendor.activityScore < 50 || vendor.activityScore >= 75)) return false;
          if (filters.activityLevel === 'Low' && vendor.activityScore >= 50) return false;
        }

        // Trending filter
        if (filters.onlyTrending && !vendor.isTrending) {
          return false;
        }

        // Top rated filter
        if (filters.onlyTopRated && vendor.rating < 4.7) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'activityScore') return b.activityScore - a.activityScore;
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        if (filters.sortBy === 'transactions') return b.todayTransactions - a.todayTransactions;
        if (filters.sortBy === 'complaints') return b.complaintsCount - a.complaintsCount;
        return 0;
      });
  }, [vendors, filters]);

  // Filtered zones computation
  const filteredZones = useMemo(() => {
    if (filters.zoneId === 'all') return zones;
    return zones.filter((z) => z.id === filters.zoneId);
  }, [zones, filters.zoneId]);

  // Aggregated Stats
  const totalTodayTransactions = useMemo(() => {
    return zones.reduce((acc, z) => acc + z.todayTransactions, 0);
  }, [zones]);

  const highActivityZonesCount = useMemo(() => {
    return zones.filter((z) => z.activityLevel === 'High' || z.activityLevel === 'Very High').length;
  }, [zones]);

  const predictedPeakZonesCount = useMemo(() => {
    return zones.filter((z) => z.trafficPressure === 'Heavy' || z.trafficPressure === 'Critical').length;
  }, [zones]);

  // Auth actions
  const loginAs = (role: 'public' | 'vendor' | 'government', name?: string, shopOrDept?: string, vendorId?: string) => {
    const session: UserSession = {
      role,
      name: name || (role === 'government' ? 'Ward Executive Officer' : (role === 'vendor' ? 'Registered Merchant' : 'Citizen')),
      departmentOrShop: shopOrDept || (role === 'government' ? 'Urban Mobility & Commercial Tax Dept' : 'Nagpur Tarri Poha'),
      vendorId: vendorId || (role === 'vendor' ? 'v-101' : undefined),
      employeeId: role === 'government' ? 'MAHA-ULB-8842' : undefined
    };
    setUserSession(session);
    if (role === 'government') setActiveTab('government');
    if (role === 'vendor') setActiveTab('vendor-portal');
  };

  const logout = () => {
    setUserSession({ role: 'public', name: 'Citizen / Visitor' });
    setActiveTab('home');
  };

  // Action implementations
  const addReview = (reviewData: Omit<Review, 'id' | 'timestamp' | 'isOtpVerified' | 'status'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      timestamp: 'Just now',
      isOtpVerified: true,
      status: 'Published'
    };
    setReviews((prev) => [newRev, ...prev]);

    // Update vendor rating & review count
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === reviewData.vendorId) {
          const newCount = v.reviewCount + 1;
          const newRating = Number(((v.rating * v.reviewCount + reviewData.rating) / newCount).toFixed(1));
          return { ...v, reviewCount: newCount, rating: newRating };
        }
        return v;
      })
    );
  };

  const addComplaint = (complaintData: Omit<Complaint, 'id' | 'grievanceToken' | 'timestamp' | 'status'>): string => {
    const token = `MAHA-GRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newComp: Complaint = {
      ...complaintData,
      id: `comp-${Date.now()}`,
      grievanceToken: token,
      timestamp: 'Just now',
      status: 'Pending',
      assignedOfficer: 'Auto-Routed to Ward Encroachment Cell'
    };
    setComplaints((prev) => [newComp, ...prev]);

    // Increment vendor complaint count if vendor specific
    if (complaintData.vendorId) {
      setVendors((prev) =>
        prev.map((v) => (v.id === complaintData.vendorId ? { ...v, complaintsCount: v.complaintsCount + 1 } : v))
      );
    }
    return token;
  };

  const updateComplaintStatus = (id: string, status: Complaint['status'], actionTaken?: string, assignedOfficer?: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status,
            actionTaken: actionTaken || c.actionTaken,
            assignedOfficer: assignedOfficer || c.assignedOfficer
          };
        }
        return c;
      })
    );
  };

  const submitVendorApplication = (appData: Omit<VendorApplication, 'id' | 'appliedDate' | 'status'>) => {
    const newApp: VendorApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setVendorApplications((prev) => [newApp, ...prev]);
  };

  const handleVendorApplicationStatus = (id: string, status: 'Approved' | 'Rejected', remarks?: string) => {
    setVendorApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status, remarks } : app))
    );

    // If approved, create active vendor in registry
    if (status === 'Approved') {
      const app = vendorApplications.find((a) => a.id === id);
      if (app) {
        const newVendor: Vendor = {
          id: `v-${Date.now()}`,
          shopName: app.shopName,
          ownerName: app.ownerName,
          category: app.category,
          zoneId: app.zoneId,
          zoneName: app.zoneName,
          address: app.address,
          lat: app.lat,
          lng: app.lng,
          rating: 5.0,
          reviewCount: 1,
          activityScore: 65,
          activityIndex: 1.0,
          todayTransactions: 120,
          status: 'Open',
          isTrending: false,
          operatingHours: '9:00 AM - 9:00 PM',
          photoUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80',
          upiId: `${app.ownerName.toLowerCase().replace(/\s+/g, '')}@upi`,
          merchantId: `MH-VEND-${Date.now().toString().slice(-4)}`,
          verifiedGovt: true,
          cleanlinessRating: 4.8,
          serviceRating: 4.8,
          complaintsCount: 0,
          peakTime: '6:00 PM - 8:00 PM',
          phoneContact: `+91 ${app.mobile}`,
          dailyFootfallEst: 350,
          hourlyActivity: Array.from({ length: 24 }, () => Math.floor(Math.random() * 40)),
          weeklyTrend: [
            { day: 'Mon', transactions: 110, footfall: 200 },
            { day: 'Tue', transactions: 130, footfall: 220 },
            { day: 'Wed', transactions: 125, footfall: 215 },
            { day: 'Thu', transactions: 140, footfall: 250 },
            { day: 'Fri', transactions: 160, footfall: 290 },
            { day: 'Sat', transactions: 190, footfall: 340 },
            { day: 'Sun', transactions: 210, footfall: 380 }
          ]
        };
        setVendors((prev) => [newVendor, ...prev]);
      }
    }
  };

  const updateVendorDetails = (vendorId: string, updates: Partial<Vendor>) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, ...updates } : v))
    );
  };

  const broadcastAlert = (alertData: Omit<TrafficAlert, 'id' | 'time'>) => {
    const newAlert: TrafficAlert = {
      ...alertData,
      id: `alt-${Date.now()}`,
      time: 'Just now'
    };
    setTrafficAlerts((prev) => [newAlert, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        zones,
        vendors,
        reviews,
        complaints,
        vendorApplications,
        predictions,
        trafficAlerts,
        filters,
        setFilters,
        filteredVendors,
        filteredZones,
        totalTodayTransactions,
        highActivityZonesCount,
        predictedPeakZonesCount,
        activeTab,
        setActiveTab,
        selectedVendor,
        setSelectedVendor,
        selectedZone,
        setSelectedZone,
        isReviewModalOpen,
        setIsReviewModalOpen,
        isComplaintModalOpen,
        setIsComplaintModalOpen,
        isVendorAppModalOpen,
        setIsVendorAppModalOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        loginModalTargetRole,
        setLoginModalTargetRole,
        userSession,
        loginAs,
        logout,
        addReview,
        addComplaint,
        updateComplaintStatus,
        submitVendorApplication,
        handleVendorApplicationStatus,
        updateVendorDetails,
        broadcastAlert,
        language,
        setLanguage,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        t
      }}
    >
      <div className={`${fontSize === 'large' ? 'text-[1.08rem]' : fontSize === 'xlarge' ? 'text-[1.18rem]' : 'text-[1rem]'} ${highContrast ? 'contrast-125 saturate-150' : ''}`}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
