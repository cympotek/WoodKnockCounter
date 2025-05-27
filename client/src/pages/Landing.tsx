import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🪵</div>
        <h1 className="text-4xl font-bold text-wood-brown mb-2">木魚</h1>
        <p className="text-lg text-gray-600">數位功德，心靈寧靜</p>
      </div>

      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-text-dark mb-2">
                歡迎來到木魚世界
              </h2>
              <p className="text-gray-600 text-sm">
                透過敲擊木魚獲得功德，與全球用戶一同修行
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span>🔊</span>
                <span>真實木魚音效</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span>📊</span>
                <span>每日功德記錄</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span>🏆</span>
                <span>全球排行榜</span>
              </div>
            </div>

            <Button 
              onClick={handleLogin}
              className="w-full bg-wood-brown hover:bg-wood-light text-white"
            >
              開始修行
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-gray-500 mt-6 text-center">
        登入即代表您同意使用條款
      </p>
    </div>
  );
}
