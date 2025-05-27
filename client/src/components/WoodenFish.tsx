import { useState, useRef, useEffect } from "react";
import woodenFishImage from "../static/sticker@2x.png";
import woodenFishSound from "../static/preview.mp3";

interface WoodenFishProps {
  onTap: () => void;
  soundEnabled: boolean;
  isLoading?: boolean;
}

export default function WoodenFish({ onTap, soundEnabled, isLoading = false }: WoodenFishProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [localCount, setLocalCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pendingTapsRef = useRef(0);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Create audio element for wooden fish sound
    audioRef.current = new Audio();
    audioRef.current.src = woodenFishSound;
    audioRef.current.volume = 0.7;
    
    // Create worker for batch processing
    workerRef.current = new Worker(
      new URL('../workers/tapWorker.ts', import.meta.url),
      { type: 'module' }
    );
    
    workerRef.current.onmessage = (e) => {
      const { type, data, error } = e.data;
      
      if (type === 'BATCH_SUCCESS') {
        // Update the parent component with the latest count
        onTap();
      } else if (type === 'BATCH_ERROR') {
        console.error('Worker error:', error);
      }
    };
    
    return () => {
      if (audioRef.current) {
        audioRef.current.remove();
      }
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [onTap]);

  const handleTap = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading) return;
    
    event.preventDefault();
    
    // Play sound if enabled
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    
    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 150); // Shorter animation for better rapid tapping
    
    // Create ripple effect
    createRippleEffect(event);
    
    // Increment local count immediately for instant feedback
    setLocalCount(prev => prev + 1);
    pendingTapsRef.current += 1;
    
    // Send to worker for batch processing
    if (workerRef.current) {
      workerRef.current.postMessage({ 
        type: 'ADD_TAPS', 
        count: 1 
      });
    } else {
      // Fallback to direct API call if worker not available
      onTap();
    }
  };

  const createRippleEffect = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('div');
    const size = 60;
    
    ripple.className = 'absolute rounded-full bg-wood-light opacity-30 pointer-events-none animate-ping';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <div className="relative">
      <div className={`transition-transform duration-300 ${isAnimating ? 'animate-float' : ''}`}>
        <button
          ref={buttonRef}
          onClick={handleTap}
          disabled={isLoading}
          className={`
            relative focus:outline-none transition-all duration-200
            ${isAnimating ? 'scale-95' : 'scale-100'}
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
            wooden-fish
          `}
          style={{
            filter: 'drop-shadow(0 10px 20px rgba(139, 69, 19, 0.3))',
          }}
        >
          {/* Wooden Fish Image */}
          <div className="w-48 h-48 flex items-center justify-center">
            <img 
              src={woodenFishImage} 
              alt="木魚" 
              className="w-full h-full object-contain filter drop-shadow-lg"
              style={{
                maxWidth: '200px',
                maxHeight: '200px',
              }}
            />
          </div>
          
          {/* Loading spinner overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
