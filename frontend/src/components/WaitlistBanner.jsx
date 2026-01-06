import React, { useState, useEffect } from 'react';
import { Flame, Clock, Users } from 'lucide-react';
import { calculateSpotsRemaining } from '../utils/waitlistSpots';

const WaitlistBanner = ({ onClick }) => {
  const [spotsRemaining, setSpotsRemaining] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // Next drop date - February 2, 2026
  const targetDate = new Date('2026-02-02T00:00:00');

  useEffect(() => {
    const spots = calculateSpotsRemaining();
    setSpotsRemaining(spots);

    // Countdown timer
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    // Slowly decrease spots remaining for urgency
    const spotsTimer = setInterval(() => {
      setSpotsRemaining(prev => Math.max(1, prev - Math.floor(Math.random() * 2)));
    }, 60000); // Every minute

    return () => {
      clearInterval(timer);
      clearInterval(spotsTimer);
    };
  }, []);

  // Scroll detection - show banner after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.85; // 85vh hero height
      const scrollY = window.scrollY;
      
      // Show banner when scrolled past hero
      if (scrollY > heroHeight) {
        setIsVisible(true);
        setIsSticky(true);
      } else {
        setIsVisible(false);
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatTime = (num) => String(num).padStart(2, '0');

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <div 
      className={`waitlist-banner ${isSticky ? 'sticky-banner' : ''}`} 
      onClick={onClick} 
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="banner-content">
        <div className="banner-left">
          <Flame size={20} className="banner-icon" />
          <span className="sold-out-text">FIRST DROP SOLD OUT</span>
        </div>
        
        <div className="banner-center">
          <Clock size={16} />
          <span className="countdown-inline">
            Next drop: {formatTime(timeLeft.days)}d {formatTime(timeLeft.hours)}h {formatTime(timeLeft.minutes)}m {formatTime(timeLeft.seconds)}s
          </span>
        </div>
        
        <div className="banner-right">
          <Users size={16} />
          <span className="waitlist-count-inline">
            Only <strong>{spotsRemaining}</strong> spots left
          </span>
        </div>
      </div>
    </div>
  );
};

export default WaitlistBanner;
