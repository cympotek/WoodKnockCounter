import { useState, useRef, useEffect } from "react";

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
    // Using a web audio API to generate a wooden percussion sound
    audioRef.current.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBSqM1fPHdCUFLYPQ8tuRQgoYZLnr5Z9OFAxOpuPxtWMcBzqI0vPIeisEKIDK8d6PQQoUWrPp7apXFAlBnt/wvF8cBSuV2PPPfiwGMIE=";
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
          <div className="w-48 h-36 rounded-full overflow-hidden bg-gradient-to-br from-wood-light to-wood-brown shadow-2xl">
            <div className="w-full h-full bg-gradient-radial from-wood-light via-wood-brown to-amber-800 relative">
              {/* Wood grain texture simulation */}
              <div className="absolute inset-0 opacity-30">
                <div className="w-full h-1 bg-amber-900 mt-4"></div>
                <div className="w-3/4 h-1 bg-amber-900 mt-6 ml-6"></div>
                <div className="w-2/3 h-1 bg-amber-900 mt-8 ml-8"></div>
                <div className="w-1/2 h-1 bg-amber-900 mt-12 ml-12"></div>
              </div>
              
              {/* Fish mouth/opening */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-4 bg-gray-900 rounded-full opacity-80"></div>
              
              {/* Highlight */}
              <div className="absolute top-4 left-8 w-16 h-8 bg-white opacity-20 rounded-full blur-sm"></div>
            </div>
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
