import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { heroProduct } from '../data/mock';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

/**
 * Canvas-based PNG Alpha Sanitization
 * Fixes premultiplied alpha / dark RGB data in transparent pixels
 */
const sanitizePng = async (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha === 0) {
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
          } else if (alpha < 15) {
            const factor = alpha / 15;
            data[i] = Math.round(data[i] * factor);
            data[i + 1] = Math.round(data[i + 1] * factor);
            data[i + 2] = Math.round(data[i + 2] * factor);
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/png');
      } catch (err) {
        reject(err);
      }
    };
    
    img.onerror = () => reject(new Error(`Failed to load image: ${imageUrl}`));
    img.src = imageUrl;
  });
};

const sanitizeWithFallback = async (originalUrl) => {
  try {
    return await sanitizePng(originalUrl);
  } catch (directError) {
    try {
      const proxyUrl = `${API_URL}/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
      return await sanitizePng(proxyUrl);
    } catch (proxyError) {
      return originalUrl;
    }
  }
};

const Hero = ({ onEarlyAccessClick }) => {
  const [showBack, setShowBack] = useState(false);
  const [frontSanitized, setFrontSanitized] = useState(null);
  const [backSanitized, setBackSanitized] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  const frontOriginal = heroProduct.image;
  const backOriginal = heroProduct.backImage;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const sanitizeImages = async () => {
      const [sanitizedFront, sanitizedBack] = await Promise.all([
        sanitizeWithFallback(frontOriginal),
        sanitizeWithFallback(backOriginal)
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
  
  const currentSanitized = showBack 
    ? (backSanitized || backOriginal) 
    : (frontSanitized || frontOriginal);

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
                />
              </div>
              <div className="hero-image-container hero-shirt-back">
                <div className="hero-shirt-glow-layer" />
                <img 
                  src={backSanitized || backOriginal}
                  alt="Performance T-Shirt - Back View"
                  className="hero-shirt-single"
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
