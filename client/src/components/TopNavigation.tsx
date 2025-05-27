import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, User, LogOut } from "lucide-react";

export default function TopNavigation() {
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.email?.split('@')[0] || "木魚";

  const avatarInitial = user?.firstName?.[0] || user?.email?.[0] || "木";

  return (
    <header className="flex justify-between items-center p-4 pt-12 bg-transparent">
      <div className="flex items-center space-x-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.profileImageUrl} />
          <AvatarFallback className="bg-wood-brown text-white text-sm font-medium">
            {avatarInitial}
          </AvatarFallback>
        </Avatar>
        <span className="text-lg font-medium text-text-dark">{displayName}</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-text-dark hover:text-wood-brown">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>
              <User className="mr-2 h-4 w-4" />
              個人資料
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              登出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.profileImageUrl} />
          <AvatarFallback className="bg-wood-brown text-white text-sm font-medium">
            {avatarInitial}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
