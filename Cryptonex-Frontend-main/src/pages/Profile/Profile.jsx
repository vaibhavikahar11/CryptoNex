// src/pages/Profile/Profile.jsx — Glassmorphism Redesign
// All existing form logic is preserved, only the visual wrapper changes.

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import AccountVarificationForm from "./AccountVarificationForm";
import {
  VerifiedIcon,
  Shield,
  Palette,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
} from "lucide-react";
import {
  enableTwoStepAuthentication,
  verifyOtp,
  updateUserInformation,
} from "@/Redux/Auth/Action";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const getProfilePhotosByGender = (gender) => {
  const malePhotos = ["Men.jpg","Men(2).jpg","Men(3).jpg","Men(4).jpg","Men(5).jpg","Men(6).jpg","Men(7).jpg","Men(8).jpg","Men(9).jpg","Default (1).jpg","Default (2).jpg","Default (3).jpg","Default (4).jpg","Default (5).jpg","Default (6).jpg","Default (7).jpg","Default (8).jpg","Default (9).jpg","Default (10).jpg","Default (11).jpg"];
  const femalePhotos = ["Default-Women (1).jpg","Default-Women (2).jpg","Default-Women (3).jpg","Default-Women (4).jpg","Default-Women (5).jpg","Default-Women (6).jpg","Default-Women (7).jpg","Default-Women (8).jpg","Default-Women (9).jpg","Default (1).jpg","Default (2).jpg","Default (3).jpg","Default (4).jpg","Default (5).jpg","Default (6).jpg","Default (7).jpg","Default (8).jpg","Default (9).jpg","Default (10).jpg","Default (11).jpg"];
  const otherPhotos = ["Default (1).jpg","Default (2).jpg","Default (3).jpg","Default (4).jpg","Default (5).jpg","Default (6).jpg","Default (7).jpg","Default (8).jpg","Default (9).jpg","Default (10).jpg","Default (11).jpg"];
  switch ((gender || "").toUpperCase()) {
    case "MALE": return malePhotos;
    case "FEMALE": return femalePhotos;
    default: return otherPhotos;
  }
};

const THEME_OPTIONS = [
  { id: "default", label: "Default",  color: "#6366f1" },
  { id: "red",     label: "Red",      color: "#ef4444" },
  { id: "green",   label: "Emerald",  color: "#10b981" },
  { id: "orange",  label: "Orange",   color: "#f97316" },
  { id: "rose",    label: "Rose",     color: "#f43f5e" },
  { id: "blue",    label: "Blue",     color: "#3b82f6" },
  { id: "pink",    label: "Pink",     color: "#ec4899" },
  { id: "yellow",  label: "Amber",    color: "#f59e0b" },
  { id: "violet",  label: "Violet",   color: "#8b5cf6" },
];

// --- Small reusable glassmorphism card ---
function GlassPanel({ children, style = {}, className = "" }) {
  return (
    <div
      className={`glass-card ${className}`}
      style={{ padding: "24px 28px", ...style }}
    >
      {children}
    </div>
  );
}

// --- Field row for display / edit mode ---
function ProfileField({ icon, label, value, editMode, name, type = "text", onChange, required, options }) {
  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: 10,
    padding: "8px 12px",
    color: "#e2e8f0",
    width: "100%",
    fontSize: 13,
    outline: "none",
    transition: "border-color 0.2s",
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(99,102,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(148,163,184,0.6)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
          {label}
        </p>
        {editMode ? (
          options ? (
            <select name={name} value={value} onChange={onChange} style={{ ...inputStyle, background: "rgba(15,23,42,0.8)" }} required={required}>
              <option value="">Select {label}</option>
              {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ) : (
            <input type={type} name={name} value={value} onChange={onChange} style={inputStyle} required={required} />
          )
        ) : (
          <p style={{ fontSize: 14, color: value ? "#e2e8f0" : "rgba(148,163,184,0.4)", fontWeight: value ? 500 : 400 }}>
            {value || "—"}
          </p>
        )}
      </div>
    </div>
  );
}

const Profile = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const { user, loading } = authState;

  const [isEditMode, setIsEditMode] = useState(false);
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [editableUserInfo, setEditableUserInfo] = useState({
    fullName: user?.fullName || "",
    mobile: user?.mobile || "",
    gender: user?.gender || "",
    dob: user?.dob || "",
    address: user?.address || "",
    city: user?.city || "",
    postcode: user?.postcode || "",
    country: user?.country || "",
    profilePhoto: user?.profilePhoto || "",
  });

  useEffect(() => {
    if (user) {
      setEditableUserInfo({
        fullName: user.fullName || "",
        gender: user.gender || "",
        dob: user.dob ? user.dob.substring(0, 10) : "",
        address: user.address || "",
        city: user.city || "",
        postcode: user.postcode || "",
        country: user.country || "",
        mobile: user.mobile || "",
        profilePhoto: user.profilePhoto || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!editableUserInfo.fullName || !editableUserInfo.mobile) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await dispatch(updateUserInformation({ ...editableUserInfo }));
      setIsEditMode(false);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to save changes.");
    }
  };

  const handleEnableTwoStepVerification = (otp) => {
    dispatch(enableTwoStepAuthentication({ jwt: localStorage.getItem("jwt"), otp }));
  };

  const handleVerifyOtp = (otp) => {
    dispatch(verifyOtp({ jwt: localStorage.getItem("jwt"), otp }));
  };

  const handleThemeChange = async (selectedTheme) => {
    try {
      await dispatch(updateUserInformation({ theme: selectedTheme === "default" ? "" : selectedTheme }));
      const themeClasses = ["red","green","orange","rose","blue","pink","yellow","violet"];
      document.documentElement.classList.remove(...themeClasses);
      if (selectedTheme !== "default" && themeClasses.includes(selectedTheme)) {
        document.documentElement.classList.add(selectedTheme);
      }
      toast.success(`${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)} theme applied!`);
      setIsThemeDialogOpen(false);
    } catch {
      toast.error("Failed to change theme.");
    }
  };

  const profilePhoto = editableUserInfo.profilePhoto
    ? `/${editableUserInfo.profilePhoto}`
    : `/${getProfilePhotosByGender(editableUserInfo.gender)[0]}`;

  const isVerified = user?.verified;
  const is2FAEnabled = user?.twoFactorAuth?.enabled;

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── HEADER HERO CARD ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <GlassPanel style={{ padding: 0, overflow: "hidden" }}>
          {/* Banner */}
          <div style={{
            height: 90,
            background: "linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(139,92,246,0.3) 50%, rgba(16,245,160,0.15) 100%)",
            position: "relative",
          }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
          </div>

          {/* Avatar + info */}
          <div style={{ padding: "0 28px 24px", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginTop: -36 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <img
                  src={profilePhoto}
                  alt="Profile"
                  style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(99,102,241,0.6)", boxShadow: "0 0 30px rgba(99,102,241,0.4)" }}
                />
                {isVerified && (
                  <div style={{ position: "absolute", bottom: 2, right: 2, width: 20, height: 20, borderRadius: "50%", background: "#10f5a0", border: "2px solid #0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CheckCircle size={12} color="#0f172a" strokeWidth={3} />
                  </div>
                )}
              </div>
              <div style={{ flex: 1, paddingBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
                    {user?.fullName || user?.email?.split("@")[0] || "Trader"}
                  </h1>
                  <span className={isVerified ? "badge-verified" : "badge-unverified"}>
                    {isVerified ? "✓ Verified" : "⚠ Unverified"}
                  </span>
                  {is2FAEnabled && (
                    <span className="badge-verified" style={{ background: "rgba(99,102,241,0.12)", borderColor: "rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
                      🔐 2FA On
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: "rgba(148,163,184,0.7)", marginTop: 2 }}>{user?.email}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditMode((v) => !v)}
                style={{ borderColor: "rgba(99,102,241,0.4)", color: "#a5b4fc", background: "rgba(99,102,241,0.1)", borderRadius: 10, display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: "7px 14px" }}
              >
                <Edit3 size={13} />
                {isEditMode ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      {/* ── PROFILE FORM ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <GlassPanel>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>Personal Information</h2>
              <p style={{ fontSize: 11, color: "rgba(148,163,184,0.5)", marginTop: 2 }}>Update your profile details</p>
            </div>
          </div>

          <form onSubmit={handleSaveChanges}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
              {/* Left column */}
              <div>
                <ProfileField icon={<User size={14} color="#6366f1" />} label="Full Name" name="fullName" value={editableUserInfo.fullName} editMode={isEditMode} onChange={handleInputChange} required />
                <ProfileField icon={<Mail size={14} color="#6366f1" />} label="Email" name="email" value={user?.email} editMode={false} />
                <ProfileField icon={<Calendar size={14} color="#6366f1" />} label="Date of Birth" name="dob" type="date" value={editableUserInfo.dob} editMode={isEditMode} onChange={handleInputChange} />
                <ProfileField icon={<User size={14} color="#6366f1" />} label="Gender" name="gender" value={editableUserInfo.gender} editMode={isEditMode} onChange={handleInputChange}
                  options={[{ value: "MALE", label: "Male" }, { value: "FEMALE", label: "Female" }, { value: "OTHER", label: "Other" }]} />
              </div>
              {/* Right column */}
              <div>
                <ProfileField icon={<Phone size={14} color="#6366f1" />} label="Mobile" name="mobile" value={editableUserInfo.mobile} editMode={isEditMode} onChange={handleInputChange} required />
                <ProfileField icon={<MapPin size={14} color="#6366f1" />} label="Address" name="address" value={editableUserInfo.address} editMode={isEditMode} onChange={handleInputChange} />
                <ProfileField icon={<MapPin size={14} color="#6366f1" />} label="City" name="city" value={editableUserInfo.city} editMode={isEditMode} onChange={handleInputChange} />
                <ProfileField icon={<MapPin size={14} color="#6366f1" />} label="Country" name="country" value={editableUserInfo.country} editMode={isEditMode} onChange={handleInputChange} />
              </div>
            </div>

            {/* Avatar picker in edit mode */}
            {isEditMode && (
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(148,163,184,0.7)", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Choose Avatar
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {getProfilePhotosByGender(editableUserInfo.gender).slice(0, 10).map((photo) => (
                    <label key={photo} style={{ cursor: "pointer", position: "relative" }}>
                      <input type="radio" name="profilePhoto" value={photo} checked={editableUserInfo.profilePhoto === photo} onChange={handleInputChange} style={{ display: "none" }} />
                      <img
                        src={`/${photo}`} alt={photo}
                        style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: editableUserInfo.profilePhoto === photo ? "2px solid #6366f1" : "2px solid transparent", boxShadow: editableUserInfo.profilePhoto === photo ? "0 0 12px rgba(99,102,241,0.6)" : "none", transition: "all 0.2s" }}
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {isEditMode && (
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
                <Button type="button" variant="ghost" onClick={() => setIsEditMode(false)} style={{ fontSize: 13, color: "#94a3b8" }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: 10, fontSize: 13, padding: "8px 20px", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}>
                  {loading ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            )}
          </form>
        </GlassPanel>
      </motion.div>

      {/* ── SECURITY & THEME ROW ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* 2FA Card */}
          <GlassPanel>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: is2FAEnabled ? "rgba(16,245,160,0.12)" : "rgba(255,51,102,0.12)", border: `1px solid ${is2FAEnabled ? "rgba(16,245,160,0.3)" : "rgba(255,51,102,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {is2FAEnabled ? <Lock size={18} color="#10f5a0" /> : <Unlock size={18} color="#ff3366" />}
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 2 }}>Two-Factor Auth</h3>
                <span className={is2FAEnabled ? "badge-verified" : "badge-unverified"}>
                  {is2FAEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "rgba(148,163,184,0.6)", lineHeight: 1.6, marginBottom: 16 }}>
              {is2FAEnabled ? "Your account is protected with 2FA. Your sessions are highly secure." : "Enable 2-step verification to add an extra layer of security to your account."}
            </p>
            {!is2FAEnabled && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="neon-btn w-full" style={{ fontSize: 13, padding: "8px 0" }}>
                    Enable 2FA
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center pt-2">Enable Two-Step Verification</DialogTitle>
                  </DialogHeader>
                  <AccountVarificationForm handleSubmit={handleEnableTwoStepVerification} />
                </DialogContent>
              </Dialog>
            )}
          </GlassPanel>

          {/* Account Status Card */}
          <GlassPanel>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: isVerified ? "rgba(16,245,160,0.12)" : "rgba(245,200,66,0.12)", border: `1px solid ${isVerified ? "rgba(16,245,160,0.3)" : "rgba(245,200,66,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Shield size={18} color={isVerified ? "#10f5a0" : "#f5c842"} />
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 2 }}>Account Status</h3>
                <span className={isVerified ? "badge-verified" : "badge-unverified"} style={!isVerified ? { background: "rgba(245,200,66,0.12)", borderColor: "rgba(245,200,66,0.3)", color: "#f5c842" } : {}}>
                  {isVerified ? "Verified" : "Pending Verification"}
                </span>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "rgba(148,163,184,0.6)", marginBottom: 16, lineHeight: 1.7 }}>
              <div style={{ display: "flex", gap: 8 }}><span style={{ color: "rgba(148,163,184,0.4)", minWidth: 56 }}>Email</span><span style={{ color: "#e2e8f0" }}>{user?.email}</span></div>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}><span style={{ color: "rgba(148,163,184,0.4)", minWidth: 56 }}>Mobile</span><span style={{ color: "#e2e8f0" }}>{user?.mobile || "—"}</span></div>
            </div>
            {!isVerified && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button style={{ width: "100%", fontSize: 13, padding: "8px 0", background: "rgba(245,200,66,0.15)", border: "1px solid rgba(245,200,66,0.3)", color: "#f5c842", borderRadius: 10 }}>
                    Verify Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center pt-2">Verify Your Account</DialogTitle>
                  </DialogHeader>
                  <AccountVarificationForm handleSubmit={handleVerifyOtp} />
                </DialogContent>
              </Dialog>
            )}
          </GlassPanel>
        </div>
      </motion.div>

      {/* ── THEME SELECTOR ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
        <GlassPanel>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Palette size={18} color="#8b5cf6" />
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>App Theme</h3>
                <p style={{ fontSize: 11, color: "rgba(148,163,184,0.5)" }}>Customize your color palette</p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            {THEME_OPTIONS.map((theme, idx) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                title={theme.label}
                className="theme-dot"
                style={{
                  background: theme.color,
                  border: "2px solid rgba(255,255,255,0.15)",
                  "--dot-color": theme.color,
                  "--dot-color-dim": `${theme.color}55`,
                  animationDelay: `${idx * 0.3}s`,
                }}
                aria-label={`Select ${theme.label} theme`}
              />
            ))}
          </div>
          <p style={{ fontSize: 11, color: "rgba(148,163,184,0.4)", marginTop: 12 }}>
            Click any color to instantly apply that theme across the app
          </p>
        </GlassPanel>
      </motion.div>

    </div>
  );
};

export default Profile;
