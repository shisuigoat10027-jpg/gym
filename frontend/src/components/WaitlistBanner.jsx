import React, { useState, useEffect } from 'react';
import { Flame, Clock, Users } from 'lucide-react';
import { calculateSpotsRemaining } from '../utils/waitlistSpots';

const WaitlistBanner = ({ onClick }) => {
  const [spotsRemaining, setSpotsRemaining] = useState(null);
  const [waitlistCount, setWaitlistCount] = useState(2847);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Next drop date - February 15, 2026
  const targetDate = new Date('2026-02-15T00:00:00');

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

    // Simulate live waitlist updates
    const waitlistTimer = setInterval(() => {
      setWaitlistCount(prev => prev + Math.floor(Math.random() * 2));
    }, 45000);

    return () => {
      clearInterval(timer);
      clearInterval(waitlistTimer);
    };
  }, []);

  const formatTime = (num) => String(num).padStart(2, '0');

  return (
    <div className="waitlist-banner" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="banner-content">
        <div className="banner-left">
          <Flame size={20} className="banner-icon" />
          <span className="sold-out-text">FIRST DROP SOLD OUT</span>
        </div>
        
        <div className="banner-center">
          <Clock size={16} />
          <span className="countdown-inline">
            {formatTime(timeLeft.days)}d {formatTime(timeLeft.hours)}h {formatTime(timeLeft.minutes)}m {formatTime(timeLeft.seconds)}s
          </span>
        </div>
        
        <div className="banner-right">
          <Users size={16} />
          <span className="waitlist-count-inline">
            <strong>{waitlistCount.toLocaleString()}</strong> waiting
          </span>
        </div>
      </div>
    </div>
  );
};

export default WaitlistBanner;
