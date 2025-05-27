import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TopNavigation from "@/components/TopNavigation";
import BottomNavigation from "@/components/BottomNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("leaderboard");
  const today = new Date().toISOString().split('T')[0];

  const { data: dailyLeaderboard, isLoading: isDailyLoading } = useQuery({
    queryKey: ["/api/leaderboard/daily", { date: today }],
    queryFn: () => fetch(`/api/leaderboard/daily?date=${today}`).then(res => res.json()),
  });

  const { data: allTimeLeaderboard, isLoading: isAllTimeLoading } = useQuery({
    queryKey: ["/api/leaderboard/all-time"],
    queryFn: () => fetch("/api/leaderboard/all-time").then(res => res.json()),
  });

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500";
    if (rank === 2) return "bg-gray-400";
    if (rank === 3) return "bg-amber-600";
    return "bg-wood-brown";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "👑";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "🏅";
  };

  const LeaderboardList = ({ data, isLoading, type }: { 
    data: any[], 
    isLoading: boolean, 
    type: 'daily' | 'allTime' 
  }) => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-white rounded-lg animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🪵</div>
          <p>還沒有排行榜數據</p>
          <p className="text-sm">開始敲擊木魚吧！</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {data.map((entry, index) => (
          <div 
            key={entry.user.id} 
            className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm"
          >
            <Badge className={`${getRankBadgeColor(entry.rank)} text-white px-2 py-1 text-xs`}>
              {getRankIcon(entry.rank)} {entry.rank}
            </Badge>
            
            <Avatar className="h-8 w-8">
              <AvatarImage src={entry.user.profileImageUrl} />
              <AvatarFallback className="bg-wood-brown text-white text-xs">
                {entry.user.firstName?.[0] || entry.user.email?.[0] || "木"}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-dark truncate">
                {entry.user.firstName && entry.user.lastName 
                  ? `${entry.user.firstName} ${entry.user.lastName}`
                  : entry.user.email?.split('@')[0] || "修行者"}
              </p>
              <p className="text-xs text-gray-500">
                {type === 'daily' ? "今日功德" : "總功德"}
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-semibold text-wood-brown">
                {type === 'daily' ? entry.tapCount : entry.totalTaps}
              </p>
              <p className="text-xs text-gray-500">敲擊</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col">
      <TopNavigation />

      <main className="flex-1 px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-wood-brown">
              功德排行榜
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daily" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="daily">今日排行</TabsTrigger>
                <TabsTrigger value="all-time">總排行</TabsTrigger>
              </TabsList>
              
              <TabsContent value="daily" className="mt-4">
                <LeaderboardList 
                  data={dailyLeaderboard} 
                  isLoading={isDailyLoading} 
                  type="daily"
                />
              </TabsContent>
              
              <TabsContent value="all-time" className="mt-4">
                <LeaderboardList 
                  data={allTimeLeaderboard} 
                  isLoading={isAllTimeLoading} 
                  type="allTime"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
