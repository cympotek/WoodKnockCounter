import { useState, useEffect, useRef } from "react";
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
  const [localTapCount, setLocalTapCount] = useState(0);
  const pendingTapsRef = useRef(0);
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch daily tap count
  const { data: dailyData, isLoading: isDailyLoading } = useQuery({
    queryKey: ["/api/taps/daily"],
  });

  // Fetch user settings
  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
  });

  // Batch tap mutation for sending multiple taps at once
  const batchTapMutation = useMutation({
    mutationFn: (count: number) => apiRequest("POST", "/api/taps/batch", { count }),
    onSuccess: (data) => {
      // Update local count with server response
      setLocalTapCount((data as any).tapCount);
      pendingTapsRef.current = 0;
      // Don't invalidate queries to avoid UI jumping
    },
    onError: () => {
      // Rollback the local count on error
      setLocalTapCount(prev => prev - pendingTapsRef.current);
      pendingTapsRef.current = 0;
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

  // Initialize local count when daily data loads
  useEffect(() => {
    if (dailyData && (dailyData as any).tapCount !== undefined) {
      setLocalTapCount((dailyData as any).tapCount);
    }
  }, [dailyData]);

  // Function to send batched taps
  const sendBatchedTaps = () => {
    if (pendingTapsRef.current > 0) {
      const tapsToSend = pendingTapsRef.current;
      batchTapMutation.mutate(tapsToSend);
    }
  };

  const handleTap = () => {
    // Immediately increment local count for instant feedback
    setLocalTapCount(prev => prev + 1);
    pendingTapsRef.current += 1;

    // Clear existing timeout
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }

    // Set new timeout to batch requests
    batchTimeoutRef.current = setTimeout(() => {
      sendBatchedTaps();
    }, 300); // Send batch after 300ms of no new taps
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
            {localTapCount || 0}
          </div>
          <p className="text-lg text-gray-600 font-light">今日功德</p>
        </div>

        {/* Interactive Wooden Fish */}
        <div className="relative mb-12">
          <WoodenFish 
            onTap={handleTap} 
            soundEnabled={(settings as any)?.soundEnabled ?? true}
            isLoading={false}
          />
          <p className="text-center text-gray-500 text-sm mt-4 font-light">
            輕觸木魚獲得功德
          </p>
        </div>

        {/* Sound Toggle */}
        <div className="flex items-center space-x-3 mb-8">
          <span className="text-sm text-gray-600">自動</span>
          <Switch
            checked={(settings as any)?.soundEnabled ?? true}
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
