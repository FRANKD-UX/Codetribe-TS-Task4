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

  // Update current time every minute for background gradient
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Get time-based background gradient
  const getTimeBasedGradient = useCallback(() => {
    const hour = currentTime.getHours();
    
    if (hour >= 5 && hour < 7) {
      return 'linear-gradient(135deg, #fbbf24, #f472b6, #a78bfa)';
    } else if (hour >= 7 && hour < 12) {
      return 'linear-gradient(135deg, #60a5fa, #34d399, #3b82f6)';
    } else if (hour >= 12 && hour < 17) {
      return 'linear-gradient(135deg, #93c5fd, #60a5fa, #6366f1)';
    } else if (hour >= 17 && hour < 19) {
      return 'linear-gradient(135deg, #fde047, #fb923c, #ef4444)';
    } else if (hour >= 19 && hour < 21) {
      return 'linear-gradient(135deg, #a78bfa, #f472b6, #fb923c)';
    } else {
      return 'linear-gradient(135deg, #374151, #7c3aed, #000000)';
    }
  }, [currentTime]);

  // Mock weather data for demo purposes
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
      country: 'Demo',
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

  // Get user's current location and fetch weather
  const getCurrentLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    
    showNotificationMessage('Getting your location...');
    
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      const mockWeather = getMockWeatherData('Your Location');
      setCurrentWeather(mockWeather);
      setActiveLocationId('current');
      setLoading(false);
      showNotificationMessage('Demo location loaded!');
    }, 1000);
  }, [getMockWeatherData]);

  // Search for location
  const searchLocation = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    showNotificationMessage('Searching for location...');
    
    // For demo purposes, use mock data with search query
    setTimeout(() => {
      const mockWeather = getMockWeatherData(searchQuery);
      setCurrentWeather(mockWeather);
      setActiveLocationId('search');
      setLoading(false);
      showNotificationMessage(`Demo data loaded for ${searchQuery}`);
      setSearchQuery('');
    }, 1000);
  }, [searchQuery, getMockWeatherData]);

  // Show notification
  const showNotificationMessage = useCallback((message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  }, []);

  // Initialize with current location
  useEffect(() => {
    if (!currentWeather) {
      getCurrentLocation();
    }
  }, [getCurrentLocation, currentWeather]);

  // Convert temperature
  const convertTemp = useCallback((temp: number) => {
    if (units === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return temp;
  }, [units]);

  // Get weather icon
  const getWeatherIcon = useCallback((condition: string, size: number = 24) => {
    const iconProps = { size, style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' } };
    switch (condition.toLowerCase()) {
      case 'clear': return <Sun {...iconProps} style={{ ...iconProps.style, color: '#fde047' }} />;
      case 'sunny': return <Sun {...iconProps} style={{ ...iconProps.style, color: '#fde047' }} />;
      case 'clouds': return <Cloud {...iconProps} style={{ ...iconProps.style, color: '#e5e7eb' }} />;
      case 'cloudy': return <Cloud {...iconProps} style={{ ...iconProps.style, color: '#e5e7eb' }} />;
      case 'rain': return <CloudRain {...iconProps} style={{ ...iconProps.style, color: '#93c5fd' }} />;
      case 'rainy': return <CloudRain {...iconProps} style={{ ...iconProps.style, color: '#93c5fd' }} />;
      case 'snow': return <CloudSnow {...iconProps} style={{ ...iconProps.style, color: '#ffffff' }} />;
      case 'snowy': return <CloudSnow {...iconProps} style={{ ...iconProps.style, color: '#ffffff' }} />;
      case 'thunderstorm': return <Zap {...iconProps} style={{ ...iconProps.style, color: '#fbbf24' }} />;
      case 'drizzle': return <CloudDrizzle {...iconProps} style={{ ...iconProps.style, color: '#bae6fd' }} />;
      default: return <Sun {...iconProps} style={{ ...iconProps.style, color: '#fde047' }} />;
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
    
    setTimeout(() => {
      const mockWeather = getMockWeatherData(location.name);
      setCurrentWeather(mockWeather);
      setActiveLocationId(location.id);
      setLoading(false);
    }, 800);
  }, [getMockWeatherData]);

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

  return (
    <>
      <div 
        className="app-container" 
        style={{ background: getTimeBasedGradient() }}
      >
        {/* Animated Background Elements */}
        <div className="bg-element bg-element-1" />
        <div className="bg-element bg-element-2" />
        <div className="bg-element bg-element-3" />
        <div className="bg-element bg-element-4" />
        <div className="bg-element bg-element-5" />

        {/* Floating Ambient Elements */}
        <div className="floating-element floating-1 glass-floating" />
        <div className="floating-element floating-2 glass-floating" />
        <div className="floating-element floating-3 glass-floating" />

        {/* Notifications */}
        {showNotification && (
          <div className="notification glass-primary">
            {notificationMessage}
          </div>
        )}

        <div className="content-container">
          {/* Header */}
          <div>
            <h1 className="main-title">SkyView</h1>
            <p className="subtitle">Beautiful weather at your fingertips</p>
          </div>

          {/* Controls */}
          <div className="controls">
            <div className="search-group">
              <div className="search-container">
                <input
                  type="text"
                  className="search-input glass-primary"
                  placeholder="Search city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
                />
                <button 
                  className="search-button"
                  onClick={searchLocation}
                  disabled={!searchQuery.trim()}
                >
                  <Search size={20} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button 
                className="control-button glass-secondary glass-hover"
                onClick={getCurrentLocation}
                disabled={loading}
              >
                <MapPin size={16} />
                My Location
              </button>
              
              <button 
                className="control-button glass-secondary glass-hover"
                onClick={saveCurrentLocation}
                disabled={loading || !currentWeather}
              >
                <Plus size={16} />
                Save
              </button>

              <button 
                className="control-button glass-secondary glass-hover"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings size={16} />
                Settings
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="settings-panel glass-primary">
              <h3 className="settings-title">Settings</h3>
              <div className="settings-grid">
                <button 
                  className="setting-button glass-secondary glass-hover"
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button>
                
                <button 
                  className="setting-button glass-secondary glass-hover"
                  onClick={toggleUnits}
                >
                  <Thermometer size={20} />
                  {units === 'celsius' ? 'Fahrenheit' : 'Celsius'}
                </button>

                <button 
                  className="setting-button glass-secondary glass-hover"
                  onClick={() => showNotificationMessage('Notifications enabled!')}
                >
                  <AlertTriangle size={20} />
                  Notifications
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="loading">
              <div className="spinner" />
              <p className="loading-text">Loading weather data...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="error">
              <div className="error-container glass-primary">
                <AlertTriangle size={48} className="error-icon" />
                <p className="error-text">{error}</p>
                <button 
                  className="control-button glass-secondary glass-hover"
                  onClick={getCurrentLocation}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Weather Content */}
          {currentWeather && !loading && (
            <div className="weather-container">
              {/* Current Weather */}
              <div className="current-weather glass-primary">
                <div className="weather-header">
                  <div className="location-info">
                    <div className="location-title">
                      <MapPin size={24} />
                      {currentWeather.location}
                    </div>
                    <p className="location-country">{currentWeather.country}</p>
                    <p className="location-date">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="location-description">{currentWeather.description}</p>
                  </div>

                  <div className="temp-circle-container">
                    <div className="temp-circle glass-secondary">
                      <div className="temp-circle-outer glass-floating">
                        <div className="temp-circle-inner">
                          <div className="temp-circle-bg" />
                          <div className="temp-circle-bg2" />
                          
                          <div className="weather-icon-container glass-floating">
                            {getWeatherIcon(currentWeather.condition, 48)}
                          </div>
                          
                          <div className="temp-display">
                            {convertTemp(currentWeather.temperature)}
                            <span className="temp-unit">°{units === 'celsius' ? 'C' : 'F'}</span>
                          </div>
                          
                          <p className="feels-like">
                            Feels like {convertTemp(currentWeather.feelsLike)}°
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Floating Info Bubbles */}
                    <div className="info-bubble info-bubble-wind">
                      <Wind size={16} color="white" />
                      <span className="bubble-value">{currentWeather.windSpeed}</span>
                      <span className="bubble-label">km/h</span>
                    </div>

                    <div className="info-bubble info-bubble-humidity">
                      <Droplets size={16} color="white" />
                      <span className="bubble-value">{currentWeather.humidity}</span>
                      <span className="bubble-label">%</span>
                    </div>

                    <div className="info-bubble info-bubble-small info-bubble-visibility">
                      <Eye size={12} color="white" />
                      <span className="bubble-value">{currentWeather.visibility}</span>
                      <span className="bubble-label">km</span>
                    </div>

                    <div className="info-bubble info-bubble-small info-bubble-pressure">
                      <Gauge size={12} color="white" />
                      <span className="bubble-value">{currentWeather.pressure}</span>
                      <span className="bubble-label">hPa</span>
                    </div>
                  </div>
                </div>

                {/* Weather Info Grid */}
                <div className="weather-info-grid">
                  <div className="info-card">
                    <div className="info-card-circle glass-secondary">
                      <Sunrise size={20} color="white" className="info-card-icon" />
                      <span className="info-card-value">{currentWeather.sunrise}</span>
                    </div>
                    <span className="info-card-label">Sunrise</span>
                  </div>

                  <div className="info-card">
                    <div className="info-card-circle glass-secondary">
                      <Sunset size={20} color="white" className="info-card-icon" />
                      <span className="info-card-value">{currentWeather.sunset}</span>
                    </div>
                    <span className="info-card-label">Sunset</span>
                  </div>

                  <div className="info-card">
                    <div className="info-card-circle glass-secondary">
                      <Sun size={20} color="white" className="info-card-icon" />
                      <span className="info-card-value">{currentWeather.uvIndex}</span>
                      <span className="info-card-unit">/10</span>
                    </div>
                    <span className="info-card-label">UV Index</span>
                  </div>

                  <div className="info-card">
                    <div className="info-card-circle glass-secondary">
                      <Wind size={20} color="white" className="info-card-icon" />
                      <span className="info-card-value">{currentWeather.windSpeed}</span>
                      <span className="info-card-unit">km/h</span>
                    </div>
                    <span className="info-card-label">Wind Speed</span>
                  </div>
                </div>
              </div>

              {/* View Toggle */}
              <div className="view-toggle">
                <div className="toggle-container glass-secondary">
                  <button 
                    className={`toggle-button ${viewMode === 'hourly' ? 'active glass-active' : ''}`}
                    onClick={() => setViewMode('hourly')}
                  >
                    <Clock size={16} />
                    Hourly
                  </button>
                  <button 
                    className={`toggle-button ${viewMode === 'daily' ? 'active glass-active' : ''}`}
                    onClick={() => setViewMode('daily')}
                  >
                    <Calendar size={16} />
                    Daily
                  </button>
                </div>
              </div>

              {/* Forecast */}
              <div className="forecast-container glass-primary">
                <h3 className="forecast-title">
                  {viewMode === 'hourly' ? '8-Hour Forecast' : '7-Day Forecast'}
                </h3>
                <div className="forecast-grid">
                  {viewMode === 'hourly' 
                    ? currentWeather.hourlyForecast.map((hour, index) => (
                        <div key={index} className="forecast-item glass-secondary glass-hover">
                          <p className="forecast-time">{hour.time}</p>
                          <div className="forecast-icon">
                            {getWeatherIcon(hour.condition, 32)}
                          </div>
                          <p className="forecast-temp">{convertTemp(hour.temperature)}°</p>
                          <p className="forecast-detail">{hour.humidity}% humidity</p>
                        </div>
                      ))
                    : currentWeather.dailyForecast.map((day, index) => (
                        <div key={index} className="forecast-item glass-secondary glass-hover">
                          <p className="forecast-time">{day.date}</p>
                          <div className="forecast-icon">
                            {getWeatherIcon(day.condition, 32)}
                          </div>
                          <p className="forecast-temp">
                            {convertTemp(day.maxTemp)}° / {convertTemp(day.minTemp)}°
                          </p>
                          <p className="forecast-detail">{day.condition}</p>
                        </div>
                      ))
                  }
                </div>
              </div>

              {/* Saved Locations */}
              {savedLocations.length > 0 && (
                <div className="saved-locations glass-primary">
                  <h3 className="saved-locations-title">Saved Locations</h3>
                  <div className="locations-grid">
                    {savedLocations.map(location => (
                      <div 
                        key={location.id} 
                        className="location-item glass-secondary glass-hover"
                        onClick={() => loadSavedLocation(location)}
                      >
                        <div className="location-content">
                          <div>
                            <p className="location-name">{location.name}</p>
                            <p className="location-country">{location.country}</p>
                          </div>
                          <button 
                            className="remove-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSavedLocation(location.id);
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="footer">
            <div className="footer-content glass-secondary">
              <p className="footer-text">SkyView Weather Dashboard</p>
              <p className="footer-subtext">Crafted with modern web technologies</p>
            </div>
          </div>
        </div>
      </div>
    </>
    );
  
  }
