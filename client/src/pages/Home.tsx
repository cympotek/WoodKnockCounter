import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import TopNavigation from "@/components/TopNavigation";
import WoodenFish from "@/components/WoodenFish";
import BottomNavigation from "@/components/BottomNavigation";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("wooden-fish");

  // Fetch daily tap count
  const { data: dailyData, isLoading: isDailyLoading } = useQuery({
    queryKey: ["/api/taps/daily"],
  });

  // Fetch user settings
  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
  });

  // Tap mutation
  const tapMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/taps"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/taps/daily"] });
    },
    onError: () => {
      toast({
        title: "錯誤",
        description: "記錄敲擊失敗，請重試",
        variant: "destructive",
      });
    },
  });

  // Settings mutation
  const settingsMutation = useMutation({
    mutationFn: (soundEnabled: boolean) =>
      apiRequest("PUT", "/api/settings", { soundEnabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  const handleTap = () => {
    tapMutation.mutate();
  };

  const handleSoundToggle = (checked: boolean) => {
    settingsMutation.mutate(checked);
  };

  if (isDailyLoading) {
    return (
      <div className="min-h-screen bg-warm-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wood-brown mx-auto mb-4"></div>
          <p className="text-wood-brown">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col">
      <TopNavigation />

      <main className="flex-1 flex flex-col items-center justify-center px-6 relative">
        {/* Daily Counter Display */}
        <div className="text-center mb-8">
          <div className="text-6xl font-light text-wood-brown mb-2">
            {dailyData?.tapCount || 0}
          </div>
          <p className="text-lg text-gray-600 font-light">今日功德</p>
        </div>

        {/* Interactive Wooden Fish */}
        <div className="relative mb-12">
          <WoodenFish 
            onTap={handleTap} 
            soundEnabled={settings?.soundEnabled ?? true}
            isLoading={tapMutation.isPending}
          />
          <p className="text-center text-gray-500 text-sm mt-4 font-light">
            輕觸木魚獲得功德
          </p>
        </div>

        {/* Sound Toggle */}
        <div className="flex items-center space-x-3 mb-8">
          <span className="text-sm text-gray-600">自動</span>
          <Switch
            checked={settings?.soundEnabled ?? true}
            onCheckedChange={handleSoundToggle}
            disabled={settingsMutation.isPending}
            className="data-[state=checked]:bg-wood-brown"
          />
        </div>
      </main>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
