import React, { useEffect } from 'react';
import './BubbleBackground.css'; // Create this CSS file

const BubbleBackground = () => {
  useEffect(() => {
    const container = document.querySelector('.bubbles');
    for (let i = 0; i < 20; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      const size = Math.random() * 60 + 20;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.animationDuration = `${Math.random() * 10 + 5}s`;
      bubble.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(bubble);
    }
  }, []);

  return <div className="bubbles"></div>;
};

export default BubbleBackground;
