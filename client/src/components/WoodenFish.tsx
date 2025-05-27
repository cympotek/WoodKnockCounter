import { useState, useRef, useEffect } from "react";
import woodenFishImage from "@/static/wooden-fish.png";
import woodenFishSound from "@/static/wooden-fish-sound.wav";

interface WoodenFishProps {
  onTap: () => void;
  soundEnabled: boolean;
  isLoading?: boolean;
}

export default function WoodenFish({ onTap, soundEnabled, isLoading = false }: WoodenFishProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Create audio element for wooden fish sound
    audioRef.current = new Audio();
    audioRef.current.src = woodenFishSound;
    audioRef.current.volume = 0.7;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.remove();
      }
    };
  }, []);

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
    setTimeout(() => setIsAnimating(false), 300);
    
    // Create ripple effect
    createRippleEffect(event);
    
    // Call the tap handler
    onTap();
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
