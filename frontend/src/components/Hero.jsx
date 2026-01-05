import React, { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { heroProduct } from '../data/mock';
import { getSanitizedImage, preloadCriticalImages } from '../utils/imageSanitizer';

const Hero = ({ onEarlyAccessClick }) => {
  const [showBack, setShowBack] = useState(false);
  const [frontSanitized, setFrontSanitized] = useState(null);
  const [backSanitized, setBackSanitized] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  const frontOriginal = heroProduct.image;
  const backOriginal = heroProduct.backImage;

  // Preload hero images immediately on mount
  useEffect(() => {
    preloadCriticalImages([frontOriginal, backOriginal]);
  }, [frontOriginal, backOriginal]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sanitize images in background
  useEffect(() => {
    let mounted = true;
    
    const sanitizeImages = async () => {
      // Process both images in parallel
      const [sanitizedFront, sanitizedBack] = await Promise.all([
        getSanitizedImage(frontOriginal),
        getSanitizedImage(backOriginal)
      ]);
      
      if (mounted) {
        setFrontSanitized(sanitizedFront);
        setBackSanitized(sanitizedBack);
      }
    };
    
    sanitizeImages();
    
    return () => {
      mounted = false;
    };
  }, [frontOriginal, backOriginal]);
  
  // Memoize current image to prevent unnecessary re-renders
  const currentSanitized = useMemo(() => {
    return showBack 
      ? (backSanitized || backOriginal) 
      : (frontSanitized || frontOriginal);
  }, [showBack, frontSanitized, backSanitized, frontOriginal, backOriginal]);

  return (
    <section className="hero-section">
      <div className="hero-inner">
        {/* Text content */}
        <div className="hero-content">
          <h1 className="hero-title">RAZE</h1>
          <p className="hero-tagline">BUILT BY DISCIPLINE</p>
          <p className="hero-description">
            Minimalist performance training wear engineered for gymnastics — Designed for those who value freedom of movement, in and out of training.
          </p>
          <div className="hero-cta">
            <Button 
              className="btn-primary"
              onClick={() => {
                document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              SHOP NOW
            </Button>
          </div>
        </div>

        {/* Hero shirt display */}
        <div className="hero-product-display">
          {isMobile ? (
            /* Mobile: Show both shirts side by side */
            <div className="hero-shirts-mobile">
              <div className="hero-image-container hero-shirt-front">
                <div className="hero-shirt-glow-layer" />
                <img 
                  src={frontSanitized || frontOriginal}
                  alt="Performance T-Shirt - Front View"
                  className="hero-shirt-single"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                />
              </div>
              <div className="hero-image-container hero-shirt-back">
                <div className="hero-shirt-glow-layer" />
                <img 
                  src={backSanitized || backOriginal}
                  alt="Performance T-Shirt - Back View"
                  className="hero-shirt-single"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          ) : (
            /* Desktop: Show single shirt with toggle */
            <>
              <div className="hero-image-container">
                <div className="hero-shirt-glow-layer" />
                <img 
                  src={currentSanitized}
                  alt={`Performance T-Shirt - ${showBack ? 'Back' : 'Front'} View`}
                  className="hero-shirt-single"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                />
              </div>
              
              {/* Front/Back Toggle - Desktop only */}
              <div className="hero-view-toggle">
                <button 
                  className={`toggle-btn ${!showBack ? 'active' : ''}`}
                  onClick={() => setShowBack(false)}
                >
                  Front
                </button>
                <button 
                  className={`toggle-btn ${showBack ? 'active' : ''}`}
                  onClick={() => setShowBack(true)}
                >
                  Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
