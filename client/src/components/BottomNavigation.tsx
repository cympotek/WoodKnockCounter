import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Sparkles, 
  Heart, 
  Circle, 
  Trophy 
} from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const [, setLocation] = useLocation();

  const tabs = [
    {
      id: "wooden-fish",
      label: "木魚",
      icon: Home,
      path: "/",
    },
    {
      id: "draw",
      label: "抽取",
      icon: Sparkles,
      path: "/draw",
      disabled: true,
    },
    {
      id: "prayer",
      label: "祈願",
      icon: Heart,
      path: "/prayer",
      disabled: true,
    },
    {
      id: "decision",
      label: "決策",
      icon: Circle,
      path: "/decision",
      disabled: true,
    },
    {
      id: "leaderboard",
      label: "成就",
      icon: Trophy,
      path: "/leaderboard",
    },
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    if (tab.disabled) return;
    
    onTabChange(tab.id);
    setLocation(tab.path);
  };

  return (
    <nav className="bg-white border-t border-gray-200 px-4 py-2 pb-6 safe-area-bottom">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || (tab.path === "/" && activeTab === "wooden-fish");
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => handleTabClick(tab)}
              disabled={tab.disabled}
              className={`
                flex flex-col items-center space-y-1 p-2 h-auto
                ${isActive 
                  ? 'text-wood-brown' 
                  : tab.disabled 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-400 hover:text-wood-brown'
                }
                transition-colors
              `}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
