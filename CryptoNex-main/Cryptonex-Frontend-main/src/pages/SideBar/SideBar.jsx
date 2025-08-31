import { logout } from "@/Redux/Auth/Action";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { useState } from "react";
import { Sheet } from "@/components/ui/sheet";
import {
  ExitIcon,
  HandIcon,
  BookmarkFilledIcon,
  BookmarkIcon,
  PersonIcon,
  DashboardIcon,
  HomeIcon,
  BellIcon,
  ActivityLogIcon,
} from "@radix-ui/react-icons";
import { CreditCardIcon, LandmarkIcon, SettingsIcon, WalletIcon } from "lucide-react";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
const menu = [
  { name: "Home", path: "/", icon: <HomeIcon className="h-6 w-6" /> },
  {
    name: "Portfolio",
    path: "/portfolio",
    icon: <DashboardIcon className="h-6 w-6" />,
  },

  {
    name: "Watchlist",
    path: "/watchlist",
    icon: <BookmarkIcon className="h-6 w-6" />,
  },
  {
    name: "Activity",
    path: "/activity",
    icon: <ActivityLogIcon className="h-6 w-6" />,
  },
  { name: "Wallet", path: "/wallet", icon: <WalletIcon /> },
  {
    name: "Payment Details",
    path: "/payment-details",
    icon: <LandmarkIcon className="h-6 w-6" />,
  },

  {
    name: "Withdrawal",
    path: "/withdrawal",
    icon: <CreditCardIcon className="h-6 w-6" />,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: <PersonIcon className="h-6 w-6" />,
  },
  
  { name: "Logout", path: "/", icon: <ExitIcon className="h-6 w-6" /> },
];
const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSheetOpen, setIsSheetOpen] = useState(true); // Track sheet state

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleMenuClick = (item) => {
    if (item.name === "Logout") {
      handleLogout();
    }

    // Navigate to the selected path
    navigate(item.path);

    // Close the sheet after navigation
    setIsSheetOpen(false);

    // Refresh the page if navigating to /profile or /wallet
   
      window.location.reload();
    
  };

  return (
    <Sheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} className="w-full">
      <div className="mt-10 space-y-5">
        {menu.map((item) => (
          <div key={item.name} className="">
            <Button
              onClick={() => handleMenuClick(item)}
              variant="outline"
              className="flex items-center gap-5 py-6 w-full"
            >
              <span className="w-8">{item.icon}</span>
              <p>{item.name}</p>
            </Button>
          </div>
        ))}
      </div>
    </Sheet>
  );
};

export default SideBar;
