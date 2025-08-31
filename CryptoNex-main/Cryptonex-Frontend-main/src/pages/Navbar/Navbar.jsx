// src/components/Navbar.jsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AvatarIcon,
  DragHandleHorizontalIcon,
  MagnifyingGlassIcon,
  SunIcon, // Import Sun Icon
  MoonIcon, // Import Moon Icon
} from "@radix-ui/react-icons"; // Ensure SunIcon and MoonIcon are available or use alternative icons
import SideBar from "../SideBar/SideBar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react"; // Import useEffect
import { useSelector, useDispatch } from "react-redux"; // Import useDispatch
import { updateUserInformation } from "@/Redux/Auth/Action"; // Import the update action

// Define the Navbar component
const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch
  const { auth } = useSelector((store) => store); // Get auth state from Redux
  const profilePhoto = auth.user?.profilePhoto;

  // Local state for mode and theme
  const [mode, setMode] = useState("dark"); // Default to dark
  const [colorTheme, setColorTheme] = useState(""); // Default to no color theme

  // List of available color themes
  const availableThemes = ["red", "green", "orange", "rose", "blue", "pink", "yellow", "violet","default"];

  // -------------------- Apply Theme and Mode Based on Redux Store --------------------
  useEffect(() => {
    if (auth.user && auth.user.mode) {
      const userMode = auth.user.mode.toLowerCase(); // "dark" or "light"
      const userTheme = auth.user.theme ? auth.user.theme.toLowerCase() : ""; // e.g., "red"

      // Update local states
      setMode(userMode);
      setColorTheme(userTheme);

      // Remove all color theme classes
      availableThemes.forEach((theme) => {
        document.documentElement.classList.remove(theme);
      });

      // Apply the current color theme class if exists
      if (userTheme && availableThemes.includes(userTheme)) {
        document.documentElement.classList.add(userTheme);
      }

      // Apply the mode class
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(userMode);

      // Optionally, store the theme and mode in localStorage for persistence
      localStorage.setItem("themeMode", userMode);
      localStorage.setItem("colorTheme", userTheme);
    } else {
      // If user is not authenticated or theme is not set, apply default dark mode
      setMode("dark");
      setColorTheme("");

      document.documentElement.classList.remove(
        ...availableThemes,
        "light"
      );
      document.documentElement.classList.add("dark");

      localStorage.setItem("themeMode", "dark");
      localStorage.removeItem("colorTheme"); // Remove color theme from localStorage
    }
  }, [auth.user, auth.token]); // Re-run if auth.user or auth.token changes
  // ------------------------------------------------------------------------------------

  // -------------------- Theme Toggle Function --------------------
  const toggleTheme = async () => {
    const newMode = mode === "dark" ? "light" : "dark";

    try {
      // Update local mode state
      setMode(newMode);

      // Apply the new mode class
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(newMode);

      // Dispatch the updateUserInformation action to update mode in the backend
      await dispatch(updateUserInformation({ mode: newMode.toUpperCase() }));

      // Save the new mode to localStorage
      localStorage.setItem("themeMode", newMode);

      // Optionally, show a success notification
      // e.g., toast.success("Theme updated successfully!");
    } catch (error) {
      console.error("Error updating theme mode:", error);

      // Revert the mode state if the update fails
      setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));

      // Revert the mode class on the root element
      const revertedMode = mode === "dark" ? "light" : "dark";
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(revertedMode);

      // Optionally, show an error notification
      // e.g., toast.error("Failed to update theme. Please try again.");
    }
  };
  // -------------------------------------------------------------------------------

  // -------------------- Handler for Navigating Based on User Role --------------------
 const handleNavigate = () => {
  if (auth.user) {
    // First, navigate to the appropriate page
    if (auth.user.role === "ROLE_ADMIN") {
      navigate("/admin/withdrawal");
    } else {
      navigate("/profile");
    }

    // After the navigation happens, refresh the page
    setTimeout(() => {
      window.location.reload();
    }, 100); // Slight delay to ensure navigation happens first
  }
};

  // ------------------------------------------------------------------------------------

  return (
    <>
      <div className="px-2 py-3 border-b z-50 bg-background bg-opacity-0 sticky top-0 left-0 right-0 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger>
              <Button
                className="rounded-full h-11 w-11"
                variant="ghost"
                size="icon"
              >
                <DragHandleHorizontalIcon className="h-7 w-7" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="w-72 border-r-0 flex flex-col justify-center"
              side="left"
            >
              <SheetHeader>
                <SheetTitle>
                  <div className="text-3xl flex justify-center items-center gap-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="https://img.freepik.com/premium-vector/cryptocurrency-coin-vector-design-bitcoin-icon-modern-style_142112-9889.jpg?w=740" />
                    </Avatar>
                    <div>
                      <span className="font-bold text-orange-700">Crypto</span>
                      <span>Nex</span>
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <SideBar />
            </SheetContent>
          </Sheet>

          <p
            onClick={() => navigate("/")}
            className="text-sm lg:text-base cursor-pointer"
          >
            CryptoNex
          </p>
          <div className="p-0 ml-9">
            <Button
              variant="outline"
              onClick={() => navigate("/search")}
              className="flex items-center gap-3"
            >
              <MagnifyingGlassIcon className="left-2 top-3 " />
              <span>Search</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* -------------------- Theme Toggle Button -------------------- */}
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className="rounded-full h-11 w-11 p-0 flex items-center justify-center"
            aria-label="Toggle Theme"
          >
            {mode === "dark" ? (
              <SunIcon className="h-6 w-6 text-yellow-400" /> // Display Sun Icon for Dark Mode
            ) : (
              <MoonIcon className="h-6 w-6 text-gray-700" /> // Display Moon Icon for Light Mode
            )}
          </Button>
          {/* ----------------------------------------------------------- */}

          {/* -------------------- User Avatar -------------------- */}
          <Avatar className="cursor-pointer" onClick={handleNavigate}>
            {!auth.user ? (
              <AvatarIcon className="h-8 w-8" />
            ) : (
              <>
                <AvatarImage
                  src={auth.user.profilePhoto}
                  alt={auth.user.fullName}
                />
                <AvatarFallback>
                  <img
                   src={`/${profilePhoto}`} // Add the path to your default profile image
                  alt={auth.user.fullName}
            
                   />
                </AvatarFallback>
              </>
            )}
          </Avatar>
          {/* ----------------------------------------------------- */}
        </div>
      </div>
    </>
  );
};

export default Navbar;
