/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { AssetTable } from "./AssetTable";
import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  Cross1Icon,
  DotIcon,
} from "@radix-ui/react-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCoinDetails,
  fetchCoinList,
  fetchTreadingCoinList,
  getTop50CoinList,
} from "@/Redux/Coin/Action";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { sendMessage } from "@/Redux/Chat/Action";
import { updateUserInformation } from "@/Redux/Auth/Action";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

// Define a constant base URL for API calls
const BASE_URL = "https://crypto-bot-uipq.onrender.com";

// Dummy AI suggested coins
const aiSuggestedCoins = [
  {
    coinName: "Bitcoin",
    currentPrice: 86000,
    buyPrice: 85000,
    tp: 91500,
    sl: 80000,
    bot: "Yuichi Bot",
    winRate: "78%",
  },
  {
    coinName: "Ethereum",
    currentPrice: 1750,
    buyPrice: 1750,
    tp: 1820,
    sl: 1680,
    bot: "Kei Bot",
    winRate: "72%",
  },
  {
    coinName: "Litecoin",
    currentPrice: 85,
    buyPrice: 85,
    tp: 90,
    sl: 80,
    bot: "Light Bot",
    winRate: "65%",
  },
  {
    coinName: "Ripple",
    currentPrice: 2.33,
    buyPrice: 2.08,
    tp: 3.72,
    sl: 1.64,
    bot: "Johan Bot",
    winRate: "80%",
  },
  {
    coinName: "Dogecoin",
    currentPrice: 0.09,
    buyPrice: 0.09,
    tp: 0.10,
    sl: 0.08,
    bot: "Le Leouch Bot",
    winRate: "55%",
  },
  {
    coinName: "Cardano",
    currentPrice: 0.38,
    buyPrice: 0.38,
    tp: 0.42,
    sl: 0.35,
    bot: "Aizen Bot",
    winRate: "68%",
  },
  {
    coinName: "Polkadot",
    currentPrice: 6.2,
    buyPrice: 6.2,
    tp: 6.8,
    sl: 5.8,
    bot: "Yuichi Bot",
    winRate: "74%",
  },
  {
    coinName: "Solana",
    currentPrice: 20,
    buyPrice: 20,
    tp: 22,
    sl: 18,
    bot: "Kei Bot",
    winRate: "70%",
  },
  {
    coinName: "Chainlink",
    currentPrice: 7.5,
    buyPrice: 7.5,
    tp: 8,
    sl: 7,
    bot: "Light Bot",
    winRate: "66%",
  },
  {
    coinName: "Stellar",
    currentPrice: 0.32,
    buyPrice: 0.32,
    tp: 0.35,
    sl: 0.30,
    bot: "Johan Bot",
    winRate: "72%",
  },
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  // Categories: "all", "top50", "user", "trading" (if needed)
  const [category, setCategory] = useState("all");
  const { coin, chatBot, auth } = useSelector((store) => store);
  const [isBotRelease, setIsBotRelease] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  
  // Refs for scrolling and toast flag
  const chatContainerRef = useRef(null);
  const toastShownRef = useRef(false);

  // Profile Form State
  const [profileFormData, setProfileFormData] = useState({
    fullName: "",
    mobile: "",
    gender: "",
    dob: "",
    address: "",
    city: "",
    postcode: "",
    country: "",
    profilePhoto: "",
  });

  // Initialize profile form data when user data is available
  useEffect(() => {
    if (auth.user) {
      setProfileFormData({
        fullName: auth.user.fullName || "",
        mobile: auth.user.mobile || "",
        gender: auth.user.gender || "",
        dob: auth.user.dob ? auth.user.dob.substring(0, 10) : "",
        address: auth.user.address || "",
        city: auth.user.city || "",
        postcode: auth.user.postcode || "",
        country: auth.user.country || "",
        profilePhoto: auth.user.profilePhoto || "",
      });
    }
  }, [auth.user]);

  // Check for missing profile information and show dialog if needed
  useEffect(() => {
    if (auth.user) {
      const requiredFields = [
        "fullName",
        "mobile",
        "gender",
        "dob",
        "address",
        "city",
        "postcode",
        "country",
        "profilePhoto",
      ];
      const missingFields = requiredFields.filter(
        (field) =>
          !auth.user[field] ||
          (typeof auth.user[field] === "string" && auth.user[field].trim() === "")
      );
      if (missingFields.length > 0) {
        setIsProfileDialogOpen(true);
        if (!toastShownRef.current) {
          toast.info("Please complete your profile to continue.", {
            toastId: "profile-completion-toast",
          });
          toastShownRef.current = true;
        }
      }
    }
  }, [auth.user]);

  // Fetch coins for "all" and "top50" categories
  useEffect(() => {
    if (category !== "trading" && category !== "user") {
      dispatch(fetchCoinList(page));
    }
  }, [dispatch, page, category]);

  // Fetch coin details for "all" and "top50"
  useEffect(() => {
    if (category !== "trading" && category !== "user") {
      dispatch(
        fetchCoinDetails({
          coinId: "bitcoin",
          jwt: auth.jwt || localStorage.getItem("jwt"),
        })
      );
    }
  }, [dispatch, auth.jwt, category]);

  // Fetch top50 or trading coins as needed
  useEffect(() => {
    if (category === "top50") {
      dispatch(getTop50CoinList());
    } else if (category === "trading") {
      dispatch(fetchTreadingCoinList());
    }
  }, [dispatch, category]);

  // ---------- State for User Generated Coins ----------
  // userCoinView can be "portfolio", "all", or "my"
  const [userCoinView, setUserCoinView] = useState("portfolio");
  const [userCoinsData, setUserCoinsData] = useState(null);
  const [userCoinPortfolioData, setUserCoinPortfolioData] = useState(null);
  const [userCoinsMyData, setUserCoinsMyData] = useState(null);
  const [isCreateCoinModalOpen, setIsCreateCoinModalOpen] = useState(false);
  const [coinFormData, setCoinFormData] = useState({
    coin_name: "",
    coin_symbol: "",
    price: "",
    quantity: "",
    volume: "",
    coin_picture: "",
  });

  // Trade Modal State for buying/selling user coins
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [selectedUserCoin, setSelectedUserCoin] = useState(null);
  const [tradeType, setTradeType] = useState("buy");
  const [tradeFormData, setTradeFormData] = useState({
    quantity: "",
    price: "",
  });

  // Fetch user generated coins when category === "user"
  useEffect(() => {
    if (category === "user") {
      if (userCoinView === "all") {
        axios
          .get(`${BASE_URL}/usercoins/all`, {
            headers: {
              Authorization: `Bearer ${auth.jwt || localStorage.getItem("jwt")}`,
            },
          })
          .then((res) => {
            setUserCoinsData(res.data);
          })
          .catch((err) => {
            console.error("Error fetching all user coins:", err);
          });
      } else if (userCoinView === "portfolio") {
        axios
          .get(`${BASE_URL}/usercoinPortfolio`, {
            headers: {
              Authorization: `Bearer ${auth.jwt || localStorage.getItem("jwt")}`,
            },
          })
          .then((res) => {
            setUserCoinPortfolioData(res.data);
          })
          .catch((err) => {
            console.error("Error fetching user coin portfolio:", err);
          });
      } else if (userCoinView === "my") {
        axios
          .get(`${BASE_URL}/usercoins`, {
            headers: {
              Authorization: `Bearer ${auth.jwt || localStorage.getItem("jwt")}`,
            },
          })
          .then((res) => {
            setUserCoinsMyData(res.data);
          })
          .catch((err) => {
            console.error("Error fetching user generated coins:", err);
          });
      }
    }
  }, [category, userCoinView, auth.jwt]);
  // ---------- End User Generated Coins State ----------

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleBotRelease = () => setIsBotRelease(!isBotRelease);

  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      console.log("Enter key pressed:", inputValue);
      dispatch(
        sendMessage({
          prompt: inputValue,
          jwt: auth.jwt || localStorage.getItem("jwt"),
        })
      );
      setInputValue("");
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  // Scroll to the latest chat message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatBot.messages]);

  // Handle Profile Form Changes
  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePhotoChange = (photo) => {
    setProfileFormData((prev) => ({
      ...prev,
      profilePhoto: photo,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "fullName",
      "mobile",
      "gender",
      "dob",
      "country",
      "profilePhoto",
    ];
    const missingFields = requiredFields.filter(
      (field) =>
        !profileFormData[field] ||
        (typeof profileFormData[field] === "string" &&
          profileFormData[field].trim() === "")
    );
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await dispatch(updateUserInformation(profileFormData));
      toast.success("Profile updated successfully!");
      setIsProfileDialogOpen(false);
      toastShownRef.current = false;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  // ---------- Handlers for Create Coin Modal ----------
  const handleOpenCreateCoinModal = () => {
    setIsCreateCoinModalOpen(true);
  };

  const handleCloseCreateCoinModal = () => {
    setIsCreateCoinModalOpen(false);
    setCoinFormData({
      coin_name: "",
      coin_symbol: "",
      price: "",
      quantity: "",
      volume: "",
      coin_picture: "",
    });
  };

  const handleCoinFormChange = (e) => {
    const { name, value } = e.target;
    setCoinFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCoinFormSubmit = (e) => {
    e.preventDefault();
    const { coin_name, coin_symbol, price, quantity, volume } = coinFormData;
    if (!coin_name || !coin_symbol || !price || !quantity || !volume) {
      toast.error("Please fill in all required fields for coin creation.");
      return;
    }
    axios
      .post(
        `${BASE_URL}/usercoins/create`,
        coinFormData,
        {
          headers: {
            Authorization: `Bearer ${auth.jwt || localStorage.getItem("jwt")}`,
          },
        }
      )
      .then((res) => {
        toast.success("Coin created and minted successfully.");
        handleCloseCreateCoinModal();
        if (userCoinView === "all") {
          axios
            .get(`${BASE_URL}/usercoins/all`, {
              headers: {
                Authorization: `Bearer ${auth.jwt || localStorage.getItem("jwt")}`,
              },
            })
            .then((res) => setUserCoinsData(res.data))
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => {
        console.error("Error creating coin:", err);
        toast.error("Failed to create coin. Please try again.");
      });
  };
  // ---------- End Create Coin Modal Handlers ----------

  // ---------- Handlers for Trade Modal (Buy/Sell) ----------
  const openTradeModal = (coin, type) => {
    setSelectedUserCoin(coin);
    setTradeType(type);
    setTradeFormData({
      quantity: "",
      price: coin.price || "",
    });
    setIsTradeModalOpen(true);
  };

  const closeTradeModal = () => {
    setIsTradeModalOpen(false);
    setSelectedUserCoin(null);
    setTradeFormData({ quantity: "", price: "" });
  };

  const handleTradeFormChange = (e) => {
    const { name, value } = e.target;
    setTradeFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTradeFormSubmit = (e) => {
    e.preventDefault();
    if (!selectedUserCoin) return;
    const endpoint =
      tradeType === "buy"
        ? `${BASE_URL}/usercoinPortfolio/buy`
        : `${BASE_URL}/usercoinPortfolio/sell`;
    const payload = {
      coin_id: selectedUserCoin.coin_id,
      quantity: tradeFormData.quantity,
      price: tradeFormData.price,
    };
    axios
      .post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${auth.jwt || localStorage.getItem("jwt")}`,
        },
      })
      .then((res) => {
        toast.success(`Coin ${tradeType === "buy" ? "bought" : "sold"} successfully.`);
        closeTradeModal();
        // Refresh portfolio data
        axios
          .get(`${BASE_URL}/usercoinPortfolio`, {
            headers: {
              Authorization: `Bearer ${auth.jwt || localStorage.getItem("jwt")}`,
            },
          })
          .then((res) => setUserCoinPortfolioData(res.data))
          .catch((err) => console.error("Error refreshing portfolio:", err));
      })
      .catch((err) => {
        console.error(`Error executing ${tradeType} order:`, err);
        toast.error("Trade failed. Please try again.");
      });
  };
  // ---------- End Trade Modal Handlers ----------

  if (coin.loading) {
    return <SpinnerBackdrop />;
  }

// Helper function to generate a unique color from a string
function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
}

// Helper function to generate unique initials from a name
function getInitials(name) {
  const nameParts = name.trim().split(" ");
  if (nameParts.length === 1) {
    return name.substring(0, 2).toUpperCase();
  }
  return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
}

// Updated renderAvatar function that uses unique background color and initials
const renderAvatar = (name) => {
  const bgColor = stringToColor(name);
  const initials = getInitials(name);
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold"
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
};



  // Helper function to get profile photos based on gender
  const getProfilePhotosByGender = (gender) => {
    const malePhotos = [
      "Men.jpg",
      "Men(2).jpg",
      "Men(3).jpg",
      "Men(4).jpg",
      "Men(5).jpg",
      "Men(6).jpg",
      "Men(7).jpg",
      "Men(8).jpg",
      "Men(9).jpg",
      "Default (1).jpg",
      "Default (2).jpg",
      "Default (3).jpg",
      "Default (4).jpg",
      "Default (5).jpg",
      "Default (6).jpg",
      "Default (7).jpg",
      "Default (8).jpg",
      "Default (9).jpg",
      "Default (10).jpg",
      "Default (11).jpg",
    ];
    const femalePhotos = [
      "Default-Women (1).jpg",
      "Default-Women (2).jpg",
      "Default-Women (3).jpg",
      "Default-Women (4).jpg",
      "Default-Women (5).jpg",
      "Default-Women (6).jpg",
      "Default-Women (7).jpg",
      "Default-Women (8).jpg",
      "Default-Women (9).jpg",
      "Default (1).jpg",
      "Default (2).jpg",
      "Default (3).jpg",
      "Default (4).jpg",
      "Default (5).jpg",
      "Default (6).jpg",
      "Default (7).jpg",
      "Default (8).jpg",
      "Default (9).jpg",
      "Default (10).jpg",
      "Default (11).jpg",
    ];
    const otherPhotos = [
      "Default (1).jpg",
      "Default (2).jpg",
      "Default (3).jpg",
      "Default (4).jpg",
      "Default (5).jpg",
      "Default (6).jpg",
      "Default (7).jpg",
      "Default (8).jpg",
      "Default (9).jpg",
      "Default (10).jpg",
      "Default (11).jpg",
    ];

    switch (gender.toUpperCase()) {
      case "MALE":
        return malePhotos;
      case "FEMALE":
        return femalePhotos;
      default:
        return otherPhotos;
    }
  };

  return (
    <div className="relative">
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Profile Completion Dialog */}
      <Dialog
        open={isProfileDialogOpen}
        onOpenChange={(open) => {
          // Prevent closing if profile is incomplete
          if (open) setIsProfileDialogOpen(open);
        }}
      >
        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
        <DialogContent className="max-w-4xl w-full max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
            <DialogDescription>
              Please fill in the missing information to continue using the application.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleProfileSubmit} className="space-y-4 px-4">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                {/* Left Section */}
                <div className="space-y-7 w-full lg:w-1/2">
                  {/* Profile Photo */}
                  <div className="flex items-center">
                    <p className="w-[9rem] text-gray-500 font-medium">
                      Profile Photo<span className="text-red-500"> *</span>:
                    </p>
                    <div className="flex flex-col">
                      <div className="flex flex-wrap gap-4">
                        {getProfilePhotosByGender(profileFormData.gender).map((photo) => (
                          <label key={photo} className="cursor-pointer">
                            <input
                              type="radio"
                              name="profilePhoto"
                              value={photo}
                              checked={profileFormData.profilePhoto === photo}
                              onChange={() => handleProfilePhotoChange(photo)}
                              className="hidden"
                              required
                            />
                            <Avatar
                              className={`w-16 h-16 rounded-full border-2 ${
                                profileFormData.profilePhoto === photo
                                  ? "border-blue-500"
                                  : "border-transparent"
                              }`}
                            >
                              <AvatarImage src={`/${photo}`} alt={photo} />
                            </Avatar>
                          </label>
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-gray-500 text-center">
                        Select a profile photo
                      </p>
                    </div>
                  </div>
                  {/* Full Name */}
                  <div className="flex items-center">
                    <p className="w-[9rem] text-gray-500 font-medium">
                      Full Name<span className="text-red-500"> *</span>:
                    </p>
                    <input
                      type="text"
                      name="fullName"
                      value={profileFormData.fullName}
                      onChange={handleProfileInputChange}
                      className="text-gray-600 bg-transparent border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  {/* Date of Birth */}
                  <div className="flex items-center">
                    <p className="w-[9rem] text-gray-500 font-medium">
                      Date Of Birth<span className="text-red-500"> *</span>:
                    </p>
                    <input
                      type="date"
                      name="dob"
                      value={profileFormData.dob}
                      onChange={handleProfileInputChange}
                      className="text-gray-600 bg-transparent border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  {/* Gender */}
                  <div className="flex items-center">
                    <p className="w-[9rem] text-gray-500 font-medium">
                      Gender<span className="text-red-500"> *</span>:
                    </p>
                    <select
                      name="gender"
                      value={profileFormData.gender}
                      onChange={handleProfileInputChange}
                      required
                      className="text-gray-600 bg-transparent border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
                {/* Right Section */}
                <div className="space-y-7 w-full lg:w-1/2">
                  {/* Address */}
                  <div className="flex items-center">
                    <p className="w-[9rem] text-gray-500 font-medium">Address:</p>
                    <input
                      type="text"
                      name="address"
                      value={profileFormData.address}
                      onChange={handleProfileInputChange}
                      className="text-gray-600 bg-transparent border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your address"
                    />
                  </div>
                  {/* City */}
                  <div className="flex items-center">
                    <p className="w-[9rem] text-gray-500 font-medium">City:</p>
                    <input
                      type="text"
                      name="city"
                      value={profileFormData.city}
                      onChange={handleProfileInputChange}
                      className="text-gray-600 bg-transparent border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your city"
                    />
                  </div>
                  {/* Postcode */}
                  <div className="flex items-center">
                    <p className="w-[9rem] text-gray-500 font-medium">Postcode:</p>
                    <input
                      type="text"
                      name="postcode"
                      value={profileFormData.postcode}
                      onChange={handleProfileInputChange}
                      className="text-gray-600 bg-transparent border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your postcode"
                    />
                  </div>
                  {/* Country */}
                  <div className="flex items-center">
                    <p className="w-[9rem] text-gray-500 font-medium">
                      Country<span className="text-red-500"> *</span>:
                    </p>
                    <input
                      type="text"
                      name="country"
                      value={profileFormData.country}
                      onChange={handleProfileInputChange}
                      className="text-gray-600 bg-transparent border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your country"
                      required
                    />
                  </div>
                  {/* Mobile */}
                  <div className="flex items-center">
                    <p className="w-[9rem] text-gray-500 font-medium">
                      Mobile<span className="text-red-500"> *</span>:
                    </p>
                    <input
                      type="text"
                      name="mobile"
                      value={profileFormData.mobile}
                      onChange={handleProfileInputChange}
                      className="text-gray-600 bg-transparent border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+1234567890"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button type="submit" className="px-6 py-2">
                  Save Changes
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsProfileDialogOpen(false)}
                  className="px-6 py-2"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Coin Modal */}
      <Dialog
        open={isCreateCoinModalOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseCreateCoinModal();
        }}
      >
        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
        <DialogContent className="max-w-2xl w-full max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Create Your Coin</DialogTitle>
            <DialogDescription>
              Fill in the details to create and mint your own coin.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-4 py-2">
            <form onSubmit={handleCoinFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Coin Name *</label>
                <Input
                  name="coin_name"
                  value={coinFormData.coin_name}
                  onChange={handleCoinFormChange}
                  placeholder="Enter coin name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Coin Symbol *</label>
                <Input
                  name="coin_symbol"
                  value={coinFormData.coin_symbol}
                  onChange={handleCoinFormChange}
                  placeholder="Enter coin symbol"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Price *</label>
                <Input
                  name="price"
                  value={coinFormData.price}
                  onChange={handleCoinFormChange}
                  placeholder="Enter price"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Quantity *</label>
                <Input
                  name="quantity"
                  value={coinFormData.quantity}
                  onChange={handleCoinFormChange}
                  placeholder="Enter quantity"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Volume *</label>
                <Input
                  name="volume"
                  value={coinFormData.volume}
                  onChange={handleCoinFormChange}
                  placeholder="Enter Initial Liquidity "
                  required
                />
              </div>
             
              <div className="flex justify-end gap-4">
                <Button type="submit" className="px-6 py-2">
                  Create Coin
                </Button>
                <Button variant="ghost" onClick={handleCloseCreateCoinModal} className="px-6 py-2">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Trade Modal for Buying/Selling Coins */}
      <Dialog
        open={isTradeModalOpen}
        onOpenChange={(open) => {
          if (!open) closeTradeModal();
        }}
      >
        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
        <DialogContent className="max-w-md w-full max-h-[70vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {tradeType === "buy" ? "Buy" : "Sell"} {selectedUserCoin?.coin_name}
            </DialogTitle>
            <DialogDescription>Enter trade details below:</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-4 py-2">
            <form onSubmit={handleTradeFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Quantity *</label>
                <Input
                  type="number"
                  name="quantity"
                  value={tradeFormData.quantity}
                  onChange={handleTradeFormChange}
                  placeholder="Enter quantity"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Price *</label>
                <Input
                  type="number"
                  name="price"
                  value={tradeFormData.price}
                  onChange={handleTradeFormChange}
                  placeholder="Enter price"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button type="submit" className="px-6 py-2">
                  {tradeType === "buy" ? "Buy" : "Sell"}
                </Button>
                <Button variant="ghost" onClick={closeTradeModal} className="px-6 py-2">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="lg:flex flex-col lg:flex-row">
        <div className="w-full p-6 sm:p-10 flex flex-col flex-grow">
          {/* Category Buttons */}
          <div className="flex items-center gap-4 mb-4 flex-nowrap">
            <Button
              variant={category === "all" ? "default" : "outline"}
              onClick={() => setCategory("all")}
              className="rounded-full"
            >
              All
            </Button>
            <Button
              variant={category === "top50" ? "default" : "outline"}
              onClick={() => setCategory("top50")}
              className="rounded-full"
            >
              Top 50
            </Button>
            <Button
              variant={category === "user" ? "default" : "outline"}
              onClick={() => setCategory("user")}
              className="rounded-full"
            >
              User Generated Coins
            </Button>
            {/* Uncomment Trading if needed */}
            {/* <Button
              variant={category === "trading" ? "default" : "outline"}
              onClick={() => setCategory("trading")}
              className="rounded-full"
            >
              Trading
            </Button> */}
          </div>
          {(category === "all" || category === "top50") && (
            <>
              <AssetTable
                category={category}
                coins={category === "all" ? coin.coinList : coin.top50}
              />
              {category === "all" && (
                <>
                  <Pagination className="border-t py-3">
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          variant="ghost"
                          disabled={page === 1}
                          onClick={() => handlePageChange(page - 1)}
                        >
                          <ChevronLeftIcon className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink onClick={() => handlePageChange(1)} isActive={page === 1}>
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink onClick={() => handlePageChange(2)} isActive={page === 2}>
                          2
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink onClick={() => handlePageChange(3)} isActive={page === 3}>
                          3
                        </PaginationLink>
                      </PaginationItem>
                      {page > 3 && (
                        <PaginationItem>
                          <PaginationLink onClick={() => handlePageChange(page)}>
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext onClick={() => handlePageChange(page + 1)} className="cursor-pointer" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                  {/* AI Suggested Coins Section */}
                  <div className="mt-6">
                    <h2 className="text-lg font-bold mb-2">AI Suggested Trades</h2>
                    <div className="flex space-x-4 overflow-x-auto pb-4">
                      {aiSuggestedCoins.map((suggestion, index) => (
                        <div key={index} className="min-w-[200px] bg-gray-100 dark:bg-gray-800 p-4 rounded shadow">
                          <div className="mb-2">
                            <p className="font-semibold">Suggested by: {suggestion.bot}</p>
                            <p className="text-xs">Win Rate: {suggestion.winRate}</p>
                          </div>
                          <div>
                            <p className="font-bold">{suggestion.coinName}</p>
                            <p className="text-xs">Buy Price: ${suggestion.buyPrice}</p>
                            <p className="text-xs">TP: ${suggestion.tp} | SL: ${suggestion.sl}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          {category === "user" && (
            <div className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="userCoinView"
                      value="portfolio"
                      checked={userCoinView === "portfolio"}
                      onChange={() => setUserCoinView("portfolio")}
                      className="mr-1"
                    />
                    <span>Portfolio</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="userCoinView"
                      value="all"
                      checked={userCoinView === "all"}
                      onChange={() => setUserCoinView("all")}
                      className="mr-1"
                    />
                    <span>All Coins</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="userCoinView"
                      value="my"
                      checked={userCoinView === "my"}
                      onChange={() => setUserCoinView("my")}
                      className="mr-1"
                    />
                    <span>My Coins</span>
                  </label>
                </div>
                <Button onClick={handleOpenCreateCoinModal}>Create Coin</Button>
              </div>
              {userCoinView === "portfolio" ? (
                <div>
                  {userCoinPortfolioData && userCoinPortfolioData.portfolio ? (
                    userCoinPortfolioData.portfolio.map((coin) => (
                      <div key={coin.holding_id} className="p-2 border-b flex flex-col sm:flex-row justify-between items-center">
                        <div className="flex items-center gap-2">
                          {renderAvatar(coin.coin_name, coin.coin_picture)}
                          <div className="flex flex-col">
                            <p className="text-sm font-bold">
                              {coin.coin_name} ({coin.coin_symbol})
                            </p>
                            <p className="text-xs">
                              Holding ID: {coin.holding_id} | Quantity: {coin.quantity}
                            </p>
                            <p className="text-xs">
                              Average Price: ${coin.average_price} | Price: ${coin.price}
                            </p>
                            <p className="text-xs">Volume: {coin.volume}</p>
                            <p className="text-xs">Contract Address: {coin.contract_address}</p>
                          </div>
                        </div>
                        {coin.user_id && coin.user_id === auth.user.id ? null : (
                          <div className="mt-2 sm:mt-0 flex gap-2">
                            <Button size="sm" onClick={() => openTradeModal(coin, "sell")}>
                              Sell
                            </Button>
                            <Button size="sm" onClick={() => openTradeModal(coin, "buy")}>
                              Buy
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No portfolio data available.</p>
                  )}
                </div>
              ) : userCoinView === "all" ? (
                <div>
                  {userCoinsData && userCoinsData.coins ? (
                    userCoinsData.coins.map((coin) => (
                      <div key={coin.coin_id} className="p-2 border-b flex flex-col sm:flex-row justify-between items-center">
                        <div className="flex items-center gap-2">
                          {renderAvatar(coin.coin_name, coin.coin_picture)}
                          <div className="flex flex-col">
                            <p className="text-sm font-bold">
                              {coin.coin_name} ({coin.coin_symbol})
                            </p>
                            <p className="text-xs">
                              Price: ${coin.price} | Volume: {coin.volume}
                            </p>
                            <p className="text-xs">Contract Address: {coin.contract_address}</p>
                            <p className="text-xs">Created by: {coin.user_id}</p>
                          </div>
                        </div>
                        {coin.user_id && coin.user_id === auth.user.id ? null : (
                          <div className="mt-2 sm:mt-0 flex gap-2">
                            <Button size="sm" onClick={() => openTradeModal(coin, "buy")}>
                              Buy
                            </Button>
                            <Button size="sm" onClick={() => openTradeModal(coin, "sell")}>
                              Sell
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No user generated coins available.</p>
                  )}
                </div>
              ) : userCoinView === "my" ? (
                <div>
                  {userCoinsMyData && userCoinsMyData.coins ? (
                    userCoinsMyData.coins.map((coin) => (
                      <div key={coin.coin_id} className="p-2 border-b flex flex-col sm:flex-row justify-between items-center">
                        <div className="flex items-center gap-2">
                          {renderAvatar(coin.coin_name, coin.coin_picture)}
                          <div className="flex flex-col">
                            <p className="text-sm font-bold">
                              {coin.coin_name} ({coin.coin_symbol})
                            </p>
                            <p className="text-xs">
                              Price: ${coin.price} | Volume: {coin.volume}
                            </p>
                            <p className="text-xs">Contract Address: {coin.contract_address}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No coins generated by you available.</p>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Chat Bot Section */}
      <section className="fixed bottom-5 right-5 z-50 flex flex-col justify-end items-end gap-2">
        {isBotRelease && (
          <div className="rounded-md w-[20rem] md:w-[25rem] lg:w-[25rem] h-[70vh] bg-slate-900 shadow-lg flex flex-col">
            <div className="flex justify-between items-center border-b px-6 h-[12%] bg-slate-800">
              <p className="text-white font-medium">Chat Bot</p>
              <Button onClick={handleBotRelease} size="icon" variant="ghost" className="text-white">
                <Cross1Icon />
              </Button>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto gap-5 px-5 py-2 bg-slate-700">
              <div className="self-start pb-5 w-auto">
                <div className="px-5 py-2 rounded-md bg-slate-800 w-auto text-white">
                  {`Hi, ${auth.user?.fullName}`}
                  <p>You can ask any crypto-related question.</p>
                  <p>For example, price, market cap, etc.</p>
                </div>
              </div>
              {chatBot.messages.map((item, index) => (
                <div
                  ref={chatContainerRef}
                  key={index}
                  className={`${item.role === "user" ? "self-end" : "self-start"} pb-5 w-auto`}
                >
                  {item.role === "user" ? (
                    <div className="self-end px-5 py-2 rounded-full bg-slate-800 text-white w-auto">
                      {item.prompt}
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="bg-slate-700 flex gap-2 py-4 px-4 rounded-md min-w-[15rem] w-full text-white">
                        {item.ans ? (
                          <p>{item.ans}</p>
                        ) : (
                          <p className="text-red-400">
                            Currently, we can't proceed as we're using a free-tier API.
                            Please wait for some time and try again.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {chatBot.loading && <p className="text-white">Fetching data...</p>}
            </div>
            <div className="h-[12%] border-t bg-slate-800 flex items-center px-4">
              <Input
                className="w-full h-full border-none outline-none text-white bg-transparent placeholder-gray-400"
                placeholder="Write a prompt"
                onChange={handleChange}
                value={inputValue}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
        )}
        <div
          onClick={handleBotRelease}
          className="w-[3rem] h-[3rem] rounded-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 cursor-pointer shadow-lg"
        >
          <MessageCircle className="fill-current text-white" size={24} />
        </div>
      </section>
    </div>
  );
};

export default Home;
