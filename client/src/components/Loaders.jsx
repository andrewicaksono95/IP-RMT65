import React from 'react';

export const FruitLoader = ({ message = 'Loading...', size = 'medium' }) => {
  const sizes = {
    small: { container: '2rem', fruit: '1.5rem', text: '0.9rem' },
    medium: { container: '3rem', fruit: '2rem', text: '1.1rem' },
    large: { container: '4rem', fruit: '3rem', text: '1.3rem' }
  };
  
  const currentSize = sizes[size];
  
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4">
      <div 
        className="d-flex align-items-center justify-content-center mb-3"
        style={{
          width: currentSize.container,
          height: currentSize.container,
          position: 'relative'
        }}
      >
        <div
          style={{
            fontSize: currentSize.fruit,
            animation: 'fruitBounce 1.5s ease-in-out infinite',
            position: 'absolute'
          }}
        >
          🍓
        </div>
        <div
          style={{
            fontSize: currentSize.fruit,
            animation: 'fruitBounce 1.5s ease-in-out infinite 0.3s',
            position: 'absolute',
            left: '20px'
          }}
        >
          🍊
        </div>
        <div
          style={{
            fontSize: currentSize.fruit,
            animation: 'fruitBounce 1.5s ease-in-out infinite 0.6s',
            position: 'absolute',
            left: '40px'
          }}
        >
          🍇
        </div>
      </div>
      <p 
        className="text-muted text-center mb-0"
        style={{ 
          fontSize: currentSize.text,
          fontWeight: '500',
          color: '#ec4899'
        }}
      >
        {message}
      </p>
      
      <style jsx>{`
        @keyframes fruitBounce {
          0%, 80%, 100% {
            transform: scale(0.8) translateY(0);
            opacity: 0.7;
          }
          40% {
            transform: scale(1.2) translateY(-10px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export const HeartLoader = ({ message = 'Adding to my froots...', color = '#ec4899' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4">
      <div 
        className="mb-3"
        style={{
          fontSize: '2.5rem',
          animation: 'heartPulse 1s ease-in-out infinite',
          color: color
        }}
      >
        💖
      </div>
      <p 
        className="text-center mb-0"
        style={{ 
          fontSize: '1rem',
          fontWeight: '600',
          color: color
        }}
      >
        {message}
      </p>
      
      <style jsx>{`
        @keyframes heartPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  );
};

export const SparkleLoader = ({ message = 'Getting suggestions...', color = '#8b5cf6' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4">
      <div 
        className="d-flex gap-2 mb-3"
        style={{
          fontSize: '1.5rem'
        }}
      >
        <span style={{ animation: 'sparkle 1.5s ease-in-out infinite 0s' }}>✨</span>
        <span style={{ animation: 'sparkle 1.5s ease-in-out infinite 0.3s' }}>⭐</span>
        <span style={{ animation: 'sparkle 1.5s ease-in-out infinite 0.6s' }}>💫</span>
        <span style={{ animation: 'sparkle 1.5s ease-in-out infinite 0.9s' }}>🌟</span>
      </div>
      <p 
        className="text-center mb-0"
        style={{ 
          fontSize: '1rem',
          fontWeight: '600',
          color: color
        }}
      >
        {message}
      </p>
      
      <style jsx>{`
        @keyframes sparkle {
          0%, 100% {
            transform: scale(0.8) rotate(0deg);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

// Global CSS for animations (to be included once)
export const LoaderStyles = () => (
  <style>{`
    @keyframes fruitBounce {
      0%, 80%, 100% {
        transform: scale(0.8) translateY(0);
        opacity: 0.7;
      }
      40% {
        transform: scale(1.2) translateY(-10px);
        opacity: 1;
      }
    }
    
    @keyframes heartPulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.3);
      }
    }
    
    @keyframes sparkle {
      0%, 100% {
        transform: scale(0.8) rotate(0deg);
        opacity: 0.5;
      }
      50% {
        transform: scale(1.2) rotate(180deg);
        opacity: 1;
      }
    }
    
    @keyframes slideInUp {
      0% {
        transform: translateY(30px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes fadeInScale {
      0% {
        transform: scale(0.9);
        opacity: 0;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    
    .animate-slide-in {
      animation: slideInUp 0.6s ease-out;
    }
    
    .animate-fade-in-scale {
      animation: fadeInScale 0.4s ease-out;
    }
    
    .card-hover {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .card-hover:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.05);
    }
  `}</style>
);

export default { FruitLoader, HeartLoader, SparkleLoader, LoaderStyles };