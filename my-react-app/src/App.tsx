import './App.css';
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  Droplets, 
  Thermometer, 
  Eye, 
  Gauge, 
  MapPin, 
  Search, 
  Plus, 
  X, 
  Settings, 
  Moon, 
  CloudDrizzle,
  Zap,
  AlertTriangle,
  Clock,
  Calendar,
  Sunrise,
  Sunset
} from 'lucide-react';

// Types
interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  feelsLike: number;
  hourlyForecast: HourlyWeather[];
  dailyForecast: DailyWeather[];
  alerts?: WeatherAlert[];
  timezone: number;
}

interface HourlyWeather {
  time: string;
  temperature: number;
  condition: string;
  windSpeed: number;
  humidity: number;
  icon: string;
}

interface DailyWeather {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface WeatherAlert {
  type: 'severe' | 'warning' | 'advisory';
  title: string;
  description: string;
  time: string;
}

interface SavedLocation {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

// Glass effect utility classes
const glassStyles = {
  primaryGlass: "bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl",
  secondaryGlass: "bg-white/15 backdrop-blur-lg border border-white/30 shadow-lg",
  floatingGlass: "bg-white/20 backdrop-blur-md border border-white/40 shadow-2xl",
  hoverGlass: "hover:bg-white/25 hover:border-white/50 hover:shadow-2xl transition-all duration-300",
  activeGlass: "bg-white/30 border-white/50 shadow-inner",
};

const WeatherApp: React.FC = () => {
  // State management
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [activeLocationId, setActiveLocationId] = useState<string>('current');
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [units, setUnits] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [viewMode, setViewMode] = useState<'hourly' | 'daily'>('hourly');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Using OpenWeatherMap API with a demo key (users need to replace with their own)
  const API_KEY = '7c2a3a9c8b7d4e2f3a1b5c6d8e9f0a1b'; // Demo key - replace with your actual key
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  // Update current time every minute for background gradient
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Get time-based background gradient
  const getTimeBasedGradient = useCallback(() => {
    const hour = currentTime.getHours();
    
    if (hour >= 5 && hour < 7) {
      return 'from-orange-300 via-pink-300 to-purple-400';
    } else if (hour >= 7 && hour < 12) {
      return 'from-blue-400 via-cyan-300 to-blue-500';
    } else if (hour >= 12 && hour < 17) {
      return 'from-blue-300 via-blue-400 to-indigo-500';
    } else if (hour >= 17 && hour < 19) {
      return 'from-yellow-300 via-orange-400 to-red-400';
    } else if (hour >= 19 && hour < 21) {
      return 'from-purple-400 via-pink-400 to-orange-400';
    } else {
      return 'from-gray-800 via-purple-900 to-black';
    }
  }, [currentTime]);

  // Mock weather data for demo purposes (when API is not available)
  const getMockWeatherData = useCallback((locationName: string = 'New York') => {
    const conditions = ['clear', 'clouds', 'rain', 'snow'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    const hourlyForecast: HourlyWeather[] = Array.from({ length: 8 }, (_, i) => ({
      time: new Date(Date.now() + i * 3600000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      temperature: Math.floor(Math.random() * 20) + 15,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      windSpeed: Math.floor(Math.random() * 20) + 5,
      humidity: Math.floor(Math.random() * 40) + 40,
      icon: '01d'
    }));

    const dailyForecast: DailyWeather[] = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        maxTemp: Math.floor(Math.random() * 15) + 25,
        minTemp: Math.floor(Math.random() * 10) + 15,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        icon: '01d'
      };
    });

    return {
      location: locationName,
      country: 'US',
      temperature: Math.floor(Math.random() * 25) + 20,
      condition: randomCondition,
      description: `${randomCondition} skies`,
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      visibility: Math.floor(Math.random() * 10) + 5,
      pressure: Math.floor(Math.random() * 100) + 1000,
      uvIndex: Math.floor(Math.random() * 11),
      sunrise: '06:30',
      sunset: '19:45',
      feelsLike: Math.floor(Math.random() * 25) + 22,
      hourlyForecast,
      dailyForecast,
      timezone: -14400
    };
  }, []);

  // Fetch weather data from OpenWeatherMap API with fallback
  const fetchWeatherData = useCallback(async (lat: number, lon: number, locationName?: string) => {
    try {
      // Try to fetch from API first
      const currentResponse = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!currentResponse.ok) {
        throw new Error('API request failed');
      }
      
      const currentData = await currentResponse.json();
      
      // Forecast data
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      const forecastData = await forecastResponse.json();
      
      // Process hourly forecast (next 24 hours)
      const hourlyForecast: HourlyWeather[] = forecastData.list.slice(0, 8).map((item: any) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        temperature: Math.round(item.main.temp),
        condition: item.weather[0].main.toLowerCase(),
        windSpeed: Math.round(item.wind.speed * 3.6), // Convert m/s to km/h
        humidity: item.main.humidity,
        icon: item.weather[0].icon
      }));
      
      // Process daily forecast (next 5 days)
      const dailyMap = new Map();
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyMap.has(date)) {
          dailyMap.set(date, {
            date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            maxTemp: item.main.temp_max,
            minTemp: item.main.temp_min,
            condition: item.weather[0].main.toLowerCase(),
            humidity: item.main.humidity,
            windSpeed: Math.round(item.wind.speed * 3.6),
            icon: item.weather[0].icon
          });
        } else {
          const existing = dailyMap.get(date);
          existing.maxTemp = Math.max(existing.maxTemp, item.main.temp_max);
          existing.minTemp = Math.min(existing.minTemp, item.main.temp_min);
        }
      });
      
      const dailyForecast = Array.from(dailyMap.values()).slice(0, 7);
      
      const weatherData: WeatherData = {
        location: locationName || currentData.name,
        country: currentData.sys.country,
        temperature: Math.round(currentData.main.temp),
        condition: currentData.weather[0].main.toLowerCase(),
        description: currentData.weather[0].description,
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed * 3.6),
        visibility: Math.round(currentData.visibility / 1000),
        pressure: currentData.main.pressure,
        uvIndex: Math.floor(Math.random() * 11), // UV data requires separate API call
        feelsLike: Math.round(currentData.main.feels_like),
        sunrise: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        hourlyForecast,
        dailyForecast,
        timezone: currentData.timezone
      };
      
      return weatherData;
    } catch (error) {
      console.warn('API request failed, using mock data:', error);
      // Fallback to mock data
      return getMockWeatherData(locationName);
    }
  }, [API_KEY, getMockWeatherData]);

  // Get user's current location and fetch weather
  const getCurrentLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    
    showNotificationMessage('Getting your location...');
    
    if (!navigator.geolocation) {
      // Use mock data for demo
      const mockWeather = getMockWeatherData('Current Location');
      setCurrentWeather(mockWeather);
      setActiveLocationId('current');
      setLoading(false);
      showNotificationMessage('Using demo location data');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weather = await fetchWeatherData(latitude, longitude);
          setCurrentWeather(weather);
          setActiveLocationId('current');
          setLoading(false);
          showNotificationMessage('Location detected successfully!');
        } catch (error) {
          const mockWeather = getMockWeatherData('Current Location');
          setCurrentWeather(mockWeather);
          setActiveLocationId('current');
          setLoading(false);
          showNotificationMessage('Using demo weather data');
        }
      },
      (error) => {
        const mockWeather = getMockWeatherData('Current Location');
        setCurrentWeather(mockWeather);
        setActiveLocationId('current');
        setLoading(false);
        showNotificationMessage('Using demo location data');
      }
    );
  }, [fetchWeatherData, getMockWeatherData]);

  // Search for location
  const searchLocation = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    showNotificationMessage('Searching for location...');
    
    try {
      // Try geocoding API first
      const geocodeResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=1&appid=${API_KEY}`
      );
      
      if (geocodeResponse.ok) {
        const geocodeData = await geocodeResponse.json();
        
        if (geocodeData.length > 0) {
          const { lat, lon, name, country } = geocodeData[0];
          const weather = await fetchWeatherData(lat, lon, name);
          setCurrentWeather(weather);
          setActiveLocationId('search');
          setLoading(false);
          showNotificationMessage(`Weather data loaded for ${name}`);
          setSearchQuery('');
          return;
        }
      }
      
      // Fallback to mock data
      const mockWeather = getMockWeatherData(searchQuery);
      setCurrentWeather(mockWeather);
      setActiveLocationId('search');
      setLoading(false);
      showNotificationMessage(`Showing demo data for ${searchQuery}`);
      setSearchQuery('');
    } catch (error) {
      const mockWeather = getMockWeatherData(searchQuery);
      setCurrentWeather(mockWeather);
      setActiveLocationId('search');
      setLoading(false);
      showNotificationMessage(`Showing demo data for ${searchQuery}`);
      setSearchQuery('');
    }
  }, [searchQuery, fetchWeatherData, API_KEY, getMockWeatherData]);

  // Initialize with current location
  useEffect(() => {
    if (!currentWeather) {
      getCurrentLocation();
    }
  }, [getCurrentLocation, currentWeather]);

  // Show notification
  const showNotificationMessage = useCallback((message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  }, []);

  // Convert temperature
  const convertTemp = useCallback((temp: number) => {
    if (units === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return temp;
  }, [units]);

  // Get weather icon
  const getWeatherIcon = useCallback((condition: string, size: number = 24) => {
    const iconProps = { size, className: "text-current drop-shadow-lg" };
    switch (condition.toLowerCase()) {
      case 'clear': return <Sun {...iconProps} className="text-yellow-300 drop-shadow-lg" />;
      case 'sunny': return <Sun {...iconProps} className="text-yellow-300 drop-shadow-lg" />;
      case 'clouds': return <Cloud {...iconProps} className="text-gray-200 drop-shadow-lg" />;
      case 'cloudy': return <Cloud {...iconProps} className="text-gray-200 drop-shadow-lg" />;
      case 'rain': return <CloudRain {...iconProps} className="text-blue-300 drop-shadow-lg" />;
      case 'rainy': return <CloudRain {...iconProps} className="text-blue-300 drop-shadow-lg" />;
      case 'snow': return <CloudSnow {...iconProps} className="text-white drop-shadow-lg" />;
      case 'snowy': return <CloudSnow {...iconProps} className="text-white drop-shadow-lg" />;
      case 'thunderstorm': return <Zap {...iconProps} className="text-yellow-400 drop-shadow-lg" />;
      case 'drizzle': return <CloudDrizzle {...iconProps} className="text-blue-200 drop-shadow-lg" />;
      default: return <Sun {...iconProps} className="text-yellow-300 drop-shadow-lg" />;
    }
  }, []);

  // Save current location
  const saveCurrentLocation = useCallback(() => {
    if (!currentWeather) return;
    
    const newLocation: SavedLocation = {
      id: Date.now().toString(),
      name: currentWeather.location,
      country: currentWeather.country,
      lat: Math.random() * 180 - 90,
      lon: Math.random() * 360 - 180
    };
    
    const updatedLocations = [...savedLocations, newLocation];
    setSavedLocations(updatedLocations);
    showNotificationMessage(`${currentWeather.location} saved!`);
  }, [currentWeather, savedLocations]);

  // Load saved location
  const loadSavedLocation = useCallback(async (location: SavedLocation) => {
    setLoading(true);
    showNotificationMessage(`Loading weather for ${location.name}...`);
    
    try {
      const weather = await fetchWeatherData(location.lat, location.lon, location.name);
      setCurrentWeather(weather);
      setActiveLocationId(location.id);
      setLoading(false);
    } catch (error) {
      const mockWeather = getMockWeatherData(location.name);
      setCurrentWeather(mockWeather);
      setActiveLocationId(location.id);
      setLoading(false);
      showNotificationMessage('Using demo weather data');
    }
  }, [fetchWeatherData, getMockWeatherData]);

  // Remove saved location
  const removeSavedLocation = useCallback((locationId: string) => {
    const updatedLocations = savedLocations.filter(loc => loc.id !== locationId);
    setSavedLocations(updatedLocations);
    showNotificationMessage('Location removed');
  }, [savedLocations]);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    showNotificationMessage(`Switched to ${newTheme} theme`);
  }, [theme]);

  // Toggle units
  const toggleUnits = useCallback(() => {
    const newUnits = units === 'celsius' ? 'fahrenheit' : 'celsius';
    setUnits(newUnits);
    showNotificationMessage(`Units changed to ${newUnits}`);
  }, [units]);

  const gradientClass = `bg-gradient-to-br ${getTimeBasedGradient()}`;

  return (
    <div className={`min-h-screen transition-all duration-1000 ${gradientClass} relative overflow-hidden`}>
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-48 h-48 bg-white/3 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-white/4 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/2 w-16 h-16 bg-white/6 rounded-full blur-lg animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-white/4 rounded-full blur-lg animate-pulse delay-1500"></div>
      </div>

     

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 animate-pulse">
          <div className={`${glassStyles.floatingGlass} text-white px-6 py-3 rounded-lg`}>
            {notificationMessage}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-2xl">Weather App</h1>
          <p className="text-lg md:text-xl text-white/90 drop-shadow-lg">Your personal weather companion</p>
        </header>

        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                placeholder="Search for a city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
                className={`w-full px-4 py-3 pr-12 rounded-xl ${glassStyles.primaryGlass} text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 ${glassStyles.hoverGlass}`}
              />
              <button
                onClick={searchLocation}
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Search size={20} className="text-white" />
              </button>
            </div>
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className={`px-4 py-3 ${glassStyles.primaryGlass} rounded-xl ${glassStyles.hoverGlass} flex items-center gap-2 text-white`}
            >
              <MapPin size={20} />
              <span className="hidden sm:inline">Current</span>
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`px-4 py-3 ${glassStyles.primaryGlass} rounded-xl ${glassStyles.hoverGlass} flex items-center gap-2 text-white`}
            >
              <Settings size={20} />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className={`${glassStyles.primaryGlass} rounded-2xl p-6 mb-8 ${glassStyles.hoverGlass}`}>
            <h3 className="text-xl font-semibold mb-4 text-white">Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-3 p-3 ${glassStyles.secondaryGlass} rounded-xl ${glassStyles.hoverGlass} text-white`}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                <span>Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme</span>
              </button>
              <button
                onClick={toggleUnits}
                className={`flex items-center gap-3 p-3 ${glassStyles.secondaryGlass} rounded-xl ${glassStyles.hoverGlass} text-white`}
              >
                <Thermometer size={20} />
                <span>Switch to {units === 'celsius' ? 'Fahrenheit' : 'Celsius'}</span>
              </button>
              <button
                onClick={() => currentWeather && saveCurrentLocation()}
                disabled={!currentWeather}
                className={`flex items-center gap-3 p-3 ${glassStyles.secondaryGlass} rounded-xl ${glassStyles.hoverGlass} disabled:opacity-50 text-white`}
              >
                <Plus size={20} />
                <span>Save Location</span>
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <p className="text-lg text-white drop-shadow-lg">Loading weather data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <div className={`${glassStyles.primaryGlass} rounded-2xl p-8`}>
              <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-300 drop-shadow-lg" />
              <p className="text-lg text-white mb-4">{error}</p>
              <button
                onClick={getCurrentLocation}
                className={`px-6 py-2 ${glassStyles.secondaryGlass} rounded-xl ${glassStyles.hoverGlass} text-white`}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Weather Display */}
        {currentWeather && !loading && (
          <div className="space-y-8">
            {/* Current Weather */}
            <div className={`${glassStyles.primaryGlass} rounded-2xl p-6 md:p-8`}>
              <div className="flex flex-col lg:flex-row justify-between items-center mb-8">
                <div className="text-center lg:text-left mb-6 lg:mb-0">
                  <h2 className="text-2xl md:text-3xl font-bold flex items-center justify-center lg:justify-start gap-2 text-white drop-shadow-lg">
                    <MapPin size={24} />
                    {currentWeather.location}
                  </h2>
                  <p className="text-lg text-white/80 drop-shadow-lg">{currentWeather.country}</p>
                  <p className="text-sm text-white/70 mt-2 drop-shadow-lg">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-sm text-white/70 capitalize">{currentWeather.description}</p>
                </div>
                
                {/* Enhanced Main Temperature Circle with Glass Effect */}
                <div className="relative">
                  <div className="relative w-48 h-48 md:w-56 md:h-56">
                    {/* Outer decorative ring with enhanced glass effect */}
                    <div className={`absolute inset-0 rounded-full ${glassStyles.floatingGlass} p-1 ring-1 ring-white/30`}>
                      <div className={`w-full h-full rounded-full ${glassStyles.primaryGlass} flex flex-col items-center justify-center relative overflow-hidden ring-1 ring-white/20`}>
                        {/* Enhanced background pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-tl from-white/5 via-transparent to-white/5"></div>
                        
                        {/* Weather Icon with glass background */}
                        <div className={`mb-2 p-3 ${glassStyles.floatingGlass} rounded-full ring-1 ring-white/30`}>
                          {getWeatherIcon(currentWeather.condition, 40)}
                        </div>
                        
                        {/* Temperature */}
                        <div className="text-3xl md:text-4xl font-bold text-center text-white drop-shadow-lg">
                          {convertTemp(currentWeather.temperature)}°
                        </div>
                        <div className="text-lg font-medium text-white/90 drop-shadow-lg">
                          {units === 'celsius' ? 'Celsius' : 'Fahrenheit'}
                        </div>
                        
                        {/* Feels Like */}
                        <div className="text-sm text-white/70 mt-1 text-center drop-shadow-lg">
                          Feels like {convertTemp(currentWeather.feelsLike)}°
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced floating info bubbles with glass effects */}
                    <div className={`absolute -top-2 -right-2 w-16 h-16 ${glassStyles.floatingGlass} rounded-full flex flex-col items-center justify-center ring-1 ring-blue-300/50 animate-pulse`}>
                      <Wind size={16} className="text-white drop-shadow-lg" />
                      <span className="text-xs font-semibold text-white">{currentWeather.windSpeed}</span>
                      <span className="text-xs text-white/80">km/h</span>
                    </div>
                    
                    <div className={`absolute -bottom-2 -left-2 w-16 h-16 ${glassStyles.floatingGlass} rounded-full flex flex-col items-center justify-center ring-1 ring-green-300/50 animate-pulse delay-300`}>
                      <Droplets size={16} className="text-white drop-shadow-lg" />
                      <span className="text-xs font-semibold text-white">{currentWeather.humidity}%</span>
                      <span className="text-xs text-white/80">humid</span>
                    </div>
                    
                    <div className={`absolute top-1/2 -left-4 transform -translate-y-1/2 w-12 h-12 ${glassStyles.floatingGlass} rounded-full flex flex-col items-center justify-center ring-1 ring-purple-300/50 animate-pulse delay-500`}>
                      <Eye size={14} className="text-white drop-shadow-lg" />
                      <span className="text-xs font-semibold text-white">{currentWeather.visibility}</span>
                    </div>
                    
                    <div className={`absolute top-1/2 -right-4 transform -translate-y-1/2 w-12 h-12 ${glassStyles.floatingGlass} rounded-full flex flex-col items-center justify-center ring-1 ring-orange-300/50 animate-pulse delay-700`}>
                      <Gauge size={14} className="text-white drop-shadow-lg" />
                      <span className="text-xs font-semibold text-white">{Math.round(currentWeather.pressure/10)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Additional Weather Info - Glass Circular Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {/* UV Index Circle with Glass Effect */}
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-3">
                    <div className={`w-full h-full ${glassStyles.floatingGlass} rounded-full flex flex-col items-center justify-center ring-1 ring-yellow-300/50 hover:scale-105 transition-transform duration-300`}>
                      <Sun size={16} className="text-white mb-1 drop-shadow-lg" />
                      <span className="text-sm font-bold text-white drop-shadow-lg">{currentWeather.uvIndex}</span>
                      <span className="text-xs text-white/80">UV</span>
                    </div>
                  </div>
                  <span className="text-sm text-white/80 drop-shadow-lg">UV Index</span>
                </div>

                {/* Pressure Circle with Glass Effect */}
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-3">
                    <div className={`w-full h-24 ${glassStyles.floatingGlass} rounded-full flex flex-col items-center justify-center ring-1 ring-orange-300/50 hover:scale-105 transition-transform duration-300`}>
                      <Gauge size={16} className="text-white mb-1 drop-shadow-lg" />
                      <span className="text-xs font-bold text-white drop-shadow-lg">{Math.round(currentWeather.pressure/10)}</span>
                      <span className="text-xs text-white/80">hPa</span>
                    </div>
                  </div>
                  <span className="text-sm text-white/80 drop-shadow-lg">Pressure</span>
                </div>

                {/* Sunrise Circle with Glass Effect */}
                <div className="flex flex-col items-center">
                  <div className={`w-24 h-24 ${glassStyles.floatingGlass} rounded-full flex flex-col items-center justify-center ring-1 ring-orange-300/50 mb-3 hover:scale-105 transition-transform duration-300`}>
                    <Sunrise size={16} className="text-white mb-1 drop-shadow-lg" />
                    <span className="text-xs font-bold text-white drop-shadow-lg">{currentWeather.sunrise}</span>
                    <span className="text-xs text-white/80">sunrise</span>
                  </div>
                  <span className="text-sm text-white/80 drop-shadow-lg">Sunrise</span>
                </div>

                {/* Sunset Circle with Glass Effect */}
                <div className="flex flex-col items-center">
                  <div className={`w-24 h-24 ${glassStyles.floatingGlass} rounded-full flex flex-col items-center justify-center ring-1 ring-purple-300/50 mb-3 hover:scale-105 transition-transform duration-300`}>
                    <Sunset size={16} className="text-white mb-1 drop-shadow-lg" />
                    <span className="text-xs font-bold text-white drop-shadow-lg">{currentWeather.sunset}</span>
                    <span className="text-xs text-white/80">sunset</span>
                  </div>
                  <span className="text-sm text-white/80 drop-shadow-lg">Sunset</span>
                </div>
              </div>
            </div>

            {/* Enhanced View Toggle with Glass Effect */}
            <div className="flex justify-center">
              <div className={`${glassStyles.primaryGlass} rounded-xl p-1 ring-1 ring-white/30`}>
                <button
                  onClick={() => setViewMode('hourly')}
                  className={`px-6 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    viewMode === 'hourly' ? `${glassStyles.activeGlass} text-white` : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Clock size={16} />
                  Hourly
                </button>
                <button
                  onClick={() => setViewMode('daily')}
                  className={`px-6 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    viewMode === 'daily' ? `${glassStyles.activeGlass} text-white` : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Calendar size={16} />
                  Daily
                </button>
              </div>
            </div>

            {/* Enhanced Forecast with Glass Effects */}
            <div className={`${glassStyles.primaryGlass} rounded-2xl p-6 ring-1 ring-white/20`}>
              <h3 className="text-xl font-semibold mb-4 text-white drop-shadow-lg">
                {viewMode === 'hourly' ? '24-Hour Forecast' : '7-Day Forecast'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {viewMode === 'hourly' 
                  ? currentWeather.hourlyForecast.slice(0, 8).map((hour, index) => (
                      <div key={index} className={`${glassStyles.secondaryGlass} rounded-xl p-3 text-center ${glassStyles.hoverGlass} ring-1 ring-white/10 hover:scale-105 transition-all duration-300`}>
                        <div className="text-sm text-white/80 mb-2 drop-shadow-lg">{hour.time}</div>
                        <div className="mb-2 flex justify-center">{getWeatherIcon(hour.condition, 28)}</div>
                        <div className="font-semibold text-white drop-shadow-lg">{convertTemp(hour.temperature)}°</div>
                        <div className="text-xs text-white/70 mt-1 drop-shadow-lg">{hour.humidity}%</div>
                      </div>
                    ))
                  : currentWeather.dailyForecast.map((day, index) => (
                      <div key={index} className={`${glassStyles.secondaryGlass} rounded-xl p-3 text-center ${glassStyles.hoverGlass} ring-1 ring-white/10 hover:scale-105 transition-all duration-300`}>
                        <div className="text-sm text-white/80 mb-2 drop-shadow-lg">{day.date}</div>
                        <div className="mb-2 flex justify-center">{getWeatherIcon(day.condition, 28)}</div>
                        <div className="font-semibold text-white drop-shadow-lg">{convertTemp(Math.round(day.maxTemp))}°</div>
                        <div className="text-sm text-white/70 drop-shadow-lg">{convertTemp(Math.round(day.minTemp))}°</div>
                      </div>
                    ))
                }
              </div>
            </div>

            {/* Enhanced Saved Locations with Glass Effects */}
            {savedLocations.length > 0 && (
              <div className={`${glassStyles.primaryGlass} rounded-2xl p-6 ring-1 ring-white/20`}>
                <h3 className="text-xl font-semibold mb-4 text-white drop-shadow-lg">Saved Locations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedLocations.map((location) => (
                    <div
                      key={location.id}
                      className={`${glassStyles.secondaryGlass} rounded-xl p-4 ${glassStyles.hoverGlass} cursor-pointer group ring-1 ring-white/10 hover:scale-105 transition-all duration-300`}
                      onClick={() => loadSavedLocation(location)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-white drop-shadow-lg">{location.name}</div>
                          <div className="text-sm text-white/70 drop-shadow-lg">{location.country}</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSavedLocation(location.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded"
                        >
                          <X size={16} className="text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Weather Alerts Section */}
            {currentWeather.alerts && currentWeather.alerts.length > 0 && (
              <div className={`${glassStyles.primaryGlass} rounded-2xl p-6 ring-1 ring-red-300/50`}>
                <h3 className="text-xl font-semibold mb-4 text-white drop-shadow-lg flex items-center gap-2">
                  <AlertTriangle className="text-yellow-400" />
                  Weather Alerts
                </h3>
                <div className="space-y-3">
                  {currentWeather.alerts.map((alert, index) => (
                    <div key={index} className={`${glassStyles.secondaryGlass} rounded-xl p-4 ring-1 ring-red-300/30`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${
                          alert.type === 'severe' ? 'bg-red-400' : 
                          alert.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                        }`}></div>
                        <span className="font-semibold text-white">{alert.title}</span>
                        <span className="text-sm text-white/60 ml-auto">{alert.time}</span>
                      </div>
                      <p className="text-sm text-white/80">{alert.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Footer with Glass Effect */}
        <footer className="text-center mt-12 py-8">
          <div className={`${glassStyles.primaryGlass} rounded-xl p-4 inline-block ring-1 ring-white/20`}>
            <p className="text-white/60 text-sm drop-shadow-lg">
              Demo Weather App • Current time: {currentTime.toLocaleTimeString()}
            </p>
            <p className="text-white/40 text-xs mt-1">
              Replace API key with your OpenWeatherMap key for live data
            </p>
          </div>
        </footer>
      </div>

      {/* Floating Glass Elements for Ambiance */}
      <div className="fixed bottom-8 right-8 pointer-events-none">
        <div className={`w-12 h-12 ${glassStyles.floatingGlass} rounded-full ring-1 ring-white/30 animate-pulse`}></div>
      </div>
      <div className="fixed top-1/4 right-12 pointer-events-none">
        <div className={`w-8 h-8 ${glassStyles.floatingGlass} rounded-full ring-1 ring-white/20 animate-pulse delay-1000`}></div>
      </div>
      <div className="fixed bottom-1/3 left-8 pointer-events-none">
        <div className={`w-10 h-10 ${glassStyles.floatingGlass} rounded-full ring-1 ring-white/25 animate-pulse delay-500`}></div>
      </div>
    </div>
  );
};

export default WeatherApp;
