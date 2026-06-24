import Navbar from "./pages/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Portfolio from "./pages/Portfilio/Portfolio";
import Auth from "./pages/Auth/Auth";
import { Route, Routes } from "react-router-dom";
import StockDetails from "./pages/StockDetails/StockDetails";
import Profile from "./pages/Profile/Profile";
import Notfound from "./pages/Notfound/Notfound";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getUser } from "./Redux/Auth/Action";
import SplashScreen from "./components/SplashScreen";
import StarBackground from "./components/StarBackground";
import Wallet from "./pages/Wallet/Wallet";
import Watchlist from "./pages/Watchlist/Watchlist";
import TwoFactorAuth from "./pages/Auth/TwoFactorAuth";
import ResetPasswordForm from "./pages/Auth/ResetPassword";
import PasswordUpdateSuccess from "./pages/Auth/PasswordUpdateSuccess";
import LoginWithGoogle from "./pages/Auth/LoginWithGoogle.";
import PaymentSuccess from "./pages/Wallet/PaymentSuccess";
import Withdrawal from "./pages/Wallet/Withdrawal";
import PaymentDetails from "./pages/Wallet/PaymentDetails";
import WithdrawalAdmin from "./Admin/Withdrawal/WithdrawalAdmin";
import Activity from "./pages/Activity/Activity";
import SearchCoin from "./pages/Search/Search";
import { shouldShowNavbar } from "./Util/shouldShowNavbar";
import { SessionBlur } from "./components/SessionBlur";

// Add these imports for react-toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import the Analytics component from Vercel
import { Analytics } from "@vercel/analytics/react";

const routes = [
  { path: "/", role: "ROLE_USER" },
  { path: "/portfolio", role: "ROLE_USER" },
  { path: "/activity", role: "ROLE_USER" },
  { path: "/wallet", role: "ROLE_USER" },
  { path: "/withdrawal", role: "ROLE_USER" },
  { path: "/payment-details", role: "ROLE_USER" },
  { path: "/wallet/success", role: "ROLE_USER" },
  { path: "/market/:id", role: "ROLE_USER" },
  { path: "/watchlist", role: "ROLE_USER" },
  { path: "/profile", role: "ROLE_USER" },
  { path: "/search", role: "ROLE_USER" },
  { path: "/admin/withdrawal", role: "ROLE_ADMIN" }
];

function App() {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();

  // Show splash once per browser session
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("splashShown");
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem("splashShown", "true");
    setShowSplash(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      dispatch(getUser(token));
    }
  }, [auth.jwt]);

  const showNavbar = !auth.user
    ? false
    : shouldShowNavbar(location.pathname, routes, auth.user?.role);

  return (
    <div
      className="app-root"
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        background: "radial-gradient(125% 125% at 50% 90%, #000000 40%, #0d1a36 100%)",
        overflow: "hidden",
      }}
    >
      {/* Parallax Pixel Stars */}
      <StarBackground />

      {/* Splash screen — once per browser session */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Session idle security blur */}
      {auth.user && <SessionBlur />}

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 99999 }}
      />

      {auth.user ? (
        <>
          {showNavbar && <Navbar />}
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Portfolio />} path="/portfolio" />
            <Route element={<Activity />} path="/activity" />
            <Route element={<Wallet />} path="/wallet" />
            <Route element={<Withdrawal />} path="/withdrawal" />
            <Route element={<PaymentDetails />} path="/payment-details" />
            <Route element={<Wallet />} path="/wallet/:order_id" />
            <Route element={<StockDetails />} path="/market/:id" />
            <Route element={<Watchlist />} path="/watchlist" />
            <Route element={<Profile />} path="/profile" />
            <Route element={<SearchCoin />} path="/search" />
            {auth.user.role === "ROLE_ADMIN" && (
              <Route element={<WithdrawalAdmin />} path="/admin/withdrawal" />
            )}
            <Route element={<Notfound />} path="*" />
          </Routes>
        </>
      ) : (
        <>
          <Routes>
            <Route element={<Auth />} path="/" />
            <Route element={<Auth />} path="/signup" />
            <Route element={<Auth />} path="/signin" />
            <Route element={<Auth />} path="/forgot-password" />
            <Route element={<LoginWithGoogle />} path="/login-with-google" />
            <Route
              element={<ResetPasswordForm />}
              path="/reset-password/:session"
            />
            <Route
              element={<PasswordUpdateSuccess />}
              path="/password-update-successfully"
            />
            <Route
              element={<TwoFactorAuth />}
              path="/two-factor-auth/:session"
            />
            <Route element={<Notfound />} path="*" />
          </Routes>
        </>
      )}

      {/* Vercel Analytics */}
      <Analytics />
    </div>
  );
}

export default App;
