// src/components/Profile.jsx

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import AccountVarificationForm from "./AccountVarificationForm";
import { VerifiedIcon } from "lucide-react";
import {
  enableTwoStepAuthentication,
  verifyOtp,
  updateUserInformation,
} from "@/Redux/Auth/Action"; // Import the updateUserInformation action
import { toast } from "react-toastify"; // For notifications

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

const Profile = () => {
  const dispatch = useDispatch();

  // Access authentication state from Redux store
  const authState = useSelector((state) => state.auth);
  const { user, loading, error, updateSuccess } = authState;

  // Local state for managing edit mode and form fields
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableUserInfo, setEditableUserInfo] = useState({
    fullName: user?.fullName || "",
    mobile: user?.mobile || "",
    gender: user?.gender || "",
    dob: user?.dob || "", // Format: "YYYY-MM-DD"
    address: user?.address || "",
    city: user?.city || "",
    postcode: user?.postcode || "",
    country: user?.country || "",
    profilePhoto: user?.profilePhoto || "", // Add this line
  });


 
 
  useEffect(() => {
    if (user) {
      setEditableUserInfo({
        fullName: user.fullName || "",
        gender: user.gender || "",
        dob: user.dob ? user.dob.substring(0, 10) : "", // Format to YYYY-MM-DD
        address: user.address || "",
        city: user.city || "",
        postcode: user.postcode || "",
        country: user.country || "",
        mobile: user.mobile || "",
        profilePhoto: user.profilePhoto || "", // Initialize profile photo
      });
    }
  }, [user]);

  // Handle success and error messages
 
  

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission to update user information
  const handleSaveChanges = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Validate required fields
    if (!editableUserInfo.fullName || !editableUserInfo.mobile) {
      toast.error("Please fill in all required fields.");
      return;
    }

    console.log("Editable User Info to Save:", editableUserInfo);

    try {
      // Remove default profile photo assignment
      const updatedInfo = { ...editableUserInfo };

      // Dispatch action to update user information
      await dispatch(updateUserInformation(updatedInfo));
      console.log("Profile update dispatched.");

      // No need to set isEditMode here; it's handled in useEffect
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes.");
    }
  };

  // Handle enabling two-step verification
  const handleEnableTwoStepVerification = (otp) => {
    console.log("EnableTwoStepVerification", otp);
    dispatch(
      enableTwoStepAuthentication({
        jwt: localStorage.getItem("jwt"),
        otp,
      })
    );
  };

  const handleSaveChangesClick = () => {
    setIsEditMode(false);
    toast.success("Changes saved successfully!");
  };
  // Handle OTP verification
  const handleVerifyOtp = (otp) => {
    console.log("otp  - ", otp);
    dispatch(verifyOtp({ jwt: localStorage.getItem("jwt"), otp }));
  };

  // -------------------- Theme Selection State --------------------
  const availableThemes = ["default", "red", "green", "orange", "rose", "blue", "pink", "yellow", "violet"];
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);

  // Function to handle theme change
  const handleThemeChange = async (selectedTheme) => {
    try {
      // Determine current mode (dark or light)
      const currentMode = document.documentElement.classList.contains("dark") ? "dark" : "light";

      // Dispatch action to update theme in the backend
      const themePayload = selectedTheme === "" ? { theme: "" } : { theme: selectedTheme };
      await dispatch(updateUserInformation(themePayload));

      // Remove existing theme classes
      const themeClasses = ["red", "green", "orange", "rose", "blue", "pink", "yellow", "violet"];
      document.documentElement.classList.remove(...themeClasses);

      // Apply the selected theme class if not default
      if (selectedTheme !== ""&& themeClasses.includes(selectedTheme)) {
        document.documentElement.classList.add(selectedTheme);
      }

      // Optionally, show a success notification
      toast.success(
        selectedTheme === "default"
          ? "Default theme applied!"
          : `${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)} theme applied!`
      );

      // Close the dialog
      setIsThemeDialogOpen(false);
    } catch (error) {
      console.error("Error changing theme:", error);
      toast.error("Failed to change theme. Please try again.");
    }
  };
  // ------------------------------------------------------------------

  return (
   <div className="flex flex-col items-center mb-5 px-4">
  <div className="pt-10 w-full lg:w-[60%]">
    {/* Profile Information Card */}
    <Card className="shadow-lg rounded-lg">
      <CardHeader className="pb-9">
        <CardTitle>Your Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSaveChanges}>
          <div className="lg:flex gap-10 flex-col lg:flex-row">
            {/* Left Column */}
            <div className="space-y-7 w-full lg:w-[48%]">
              {/* Profile Photo */}
              <div className="flex items-center">
                <p className="w-[9rem] font-semibold">Profile Photo :</p>
                {isEditMode ? (
                  <div className="flex flex-col">
                    {/* Gender-Based Profile Photo Options */}
                    <div className="flex flex-wrap gap-4">
                      {getProfilePhotosByGender(editableUserInfo.gender).map((photo) => (
                        <label key={photo} className="cursor-pointer">
                          <input
                            type="radio"
                            name="profilePhoto"
                            value={photo}
                            checked={editableUserInfo.profilePhoto === photo}
                            onChange={handleInputChange}
                            className="hidden"
                          />
                          <img
                            src={`/${photo}`}
                            alt={photo}
                            className={`w-16 h-16 rounded-full object-cover border-2 ${
                              editableUserInfo.profilePhoto === photo
                                ? "border-blue-500"
                                : "border-transparent"
                            }`}
                          />
                        </label>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-center">Select a profile photo</p>
                  </div>
                ) : (
                  <img
                    src={
                      editableUserInfo.profilePhoto
                        ? `/${editableUserInfo.profilePhoto}`
                        : `/${getProfilePhotosByGender(editableUserInfo.gender)[0]}` // Default based on gender
                    }
                    alt="Profile"
                    className={`w-16 h-16 rounded-full object-cover transition-all duration-300 ${
                      isEditMode ? "ring-20 ring-blue-300" : ""
                    }`}
                  />
                )}
              </div>

              {/* Show email only when not in edit mode */}
              {!isEditMode && (
                <div className="flex items-center">
                  <p className="w-[9rem] font-semibold">Email : </p>
                  <p className="">{user?.email}</p>
                </div>
              )}

              {/* Full Name */}
              <div className="flex items-center">
                <p className="w-[9rem] font-semibold">Full Name :</p>
                {isEditMode ? (
                  <input
                    type="text"
                    name="fullName"
                    value={editableUserInfo.fullName}
                    onChange={handleInputChange}
                    className="bg-transparent border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <p className="">{editableUserInfo.fullName}</p>
                )}
              </div>

              {/* Date Of Birth */}
              <div className="flex items-center">
                <p className="w-[9rem] font-semibold">Date Of Birth :</p>
                {isEditMode ? (
                  <input
                    type="date"
                    name="dob"
                    value={editableUserInfo.dob}
                    onChange={handleInputChange}
                    className="bg-transparent border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <p className="">{editableUserInfo.dob}</p>
                )}
              </div>

              {/* Gender */}
              <div className="flex items-center">
                <p className="w-[9rem] font-semibold">Gender :</p>
                {isEditMode ? (
                  <select
                    name="gender"
                    value={editableUserInfo.gender}
                    onChange={handleInputChange}
                    className="bg-transparent border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                ) : (
                  <p className="">{editableUserInfo.gender}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-7 w-full lg:w-[48%] mt-7 lg:mt-0"> {/* Added margin-top for mobile spacing */}
              {/* Address */}
              <div className="flex items-center">
                <p className="w-[9rem] font-semibold">Address : </p>
                {isEditMode ? (
                  <input
                    type="text"
                    name="address"
                    value={editableUserInfo.address}
                    onChange={handleInputChange}
                    className="bg-transparent border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="">{editableUserInfo.address}</p>
                )}
              </div>

              {/* City */}
              <div className="flex items-center">
                <p className="w-[9rem] font-semibold">City : </p>
                {isEditMode ? (
                  <input
                    type="text"
                    name="city"
                    value={editableUserInfo.city}
                    onChange={handleInputChange}
                    className="bg-transparent border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="">{editableUserInfo.city}</p>
                )}
              </div>

              {/* Postcode */}
              <div className="flex items-center">
                <p className="w-[9rem] font-semibold">Postcode : </p>
                {isEditMode ? (
                  <input
                    type="text"
                    name="postcode"
                    value={editableUserInfo.postcode}
                    onChange={handleInputChange}
                    className="bg-transparent border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className=" ">{editableUserInfo.postcode}</p>
                )}
              </div>

              {/* Country */}
              <div className="flex items-center">
                <p className="w-[9rem] font-semibold">Country :</p>
                {isEditMode ? (
                  <input
                    type="text"
                    name="country"
                    value={editableUserInfo.country}
                    onChange={handleInputChange}
                    className="bg-transparent border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <p className="">{editableUserInfo.country}</p>
                )}
              </div>

              {/* Mobile Number Field */}
              <div className="flex items-center">
                <p className="w-[9rem] font-semibold">Mobile :</p>
                {isEditMode ? (
                  <input
                    type="text"
                    name="mobile"
                    value={editableUserInfo.mobile}
                    onChange={handleInputChange}
                    className="bg-transparent border border-gray-400 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="+1234567890"
                  />
                ) : (
                  <p className="">{editableUserInfo.mobile}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-end gap-3">
            {isEditMode ? (
              <>
                <Button
                  type="submit"
                  className="px-6 py-2"
                  disabled={loading}
                  onClick={handleSaveChangesClick}
                >
                  {loading ? "Updating..." : "Save Changes"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsEditMode(false)}
                  className="px-6 py-2"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setEditableUserInfo({
                    fullName: user.fullName || "",
                    mobile: user.mobile || "",
                    gender: user.gender || "",
                    dob: user.dob ? user.dob.substring(0, 10) : "",
                    address: user.address || "",
                    city: user.city || "",
                    postcode: user.postcode || "",
                    country: user.country || "",
                    profilePhoto: user.profilePhoto || "",
                  });
                  setIsEditMode(true);
                }}
                className="px-6 py-2"
              >
                Edit
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  





        {/* 2 Step Verification Section */}
        <div className="mt-6">
          <Card className="w-full shadow-lg rounded-lg">
            <CardHeader className="pb-7">
              <div className="flex items-center gap-3">
                <CardTitle>2 Step Verification</CardTitle>
                {user?.twoFactorAuth?.enabled ? (
                  <Badge className="space-x-2 text-white bg-green-600">
                    <VerifiedIcon /> <span>{"Enabled"}</span>
                  </Badge>
                ) : (
                  <Badge className="bg-orange-500">Disabled</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-5 ">
              {!user?.twoFactorAuth?.enabled && (
                <Dialog>
                  <DialogTrigger>
                    <Button>Enable Two Step Verification</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="px-10 pt-5 text-center">
                        Enable Two-Step Verification
                      </DialogTitle>
                    </DialogHeader>
                    <AccountVarificationForm
                      handleSubmit={handleEnableTwoStepVerification}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </div>

{/* Change Theme and Account Status Section */}
<div className="flex flex-col lg:flex-row gap-5 mt-5">
  {/* Change Theme Card */}
  <Card className="w-full shadow-lg rounded-lg">
    <CardHeader className="pb-7 flex justify-center">
      <CardTitle className="text-center">Change Theme</CardTitle>
    </CardHeader>
    <CardContent className="space-y-5">
      {/* Added margin-top to position the button lower */}
      <div className="flex justify-center mt-4">
        <Button onClick={() => setIsThemeDialogOpen(true)}>
          Select Theme
        </Button>
      </div>

      {/* Theme Selection Dialog */}
      <Dialog open={isThemeDialogOpen} onOpenChange={setIsThemeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              Choose Your Theme
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {availableThemes.map((theme) => (
              <Button
                key={theme}
                onClick={() => handleThemeChange(theme)}
                className={`w-24 h-12 rounded-full border-2 flex items-center justify-center`}
                style={{
                  backgroundColor:
                    theme === "default"
                      ? "#4B5563" // Gray color for default
                      : theme === "red"
                      ? "#EF4444"
                      : theme === "green"
                      ? "#10B981"
                      : theme === "orange"
                      ? "#F97316"
                      : theme === "rose"
                      ? "#F43F5E"
                      : theme === "blue"
                      ? "#3B82F6"
                      : theme === "pink"
                      ? "#EC4899"
                      : theme === "yellow"
                      ? "#F59E0B"
                      : theme === "violet"
                      ? "#8B5CF6"
                      : "#4B5563", // Fallback to gray
                  color: "#FFFFFF",
                }}
                aria-label={`Select ${theme} theme`}
              >
                <span className="font-semibold">
                  {theme === "default"
                    ? "Default"
                    : theme.charAt(0).toUpperCase() + theme.slice(1)}
                </span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </CardContent>
  </Card>

  {/* Account Status Card */}
  <Card className="w-full shadow-lg rounded-lg">
    <CardHeader className="pb-7">
      <div className="flex items-center gap-3">
        <CardTitle>Account Status</CardTitle>
        {user?.verified ? (
          <Badge className="space-x-2 text-white bg-green-600">
            <VerifiedIcon /> <span>Verified</span>
          </Badge>
        ) : (
          <Badge className="bg-orange-500">Pending</Badge>
        )}
      </div>
    </CardHeader>
    <CardContent className="space-y-5">
      <div className="flex items-center font-semibold">
        <p className="w-[8rem] ">Email :</p>
        <p>{user?.email}</p>
      </div>
      <div className="flex items-center font-semibold ">
        <p className="w-[8rem]">Mobile :</p>
        <p>{user?.mobile}</p>
      </div>
      {!user?.verified && (
        <Dialog>
          <DialogTrigger>
            <Button>Verify Account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="px-10 pt-5 text-center">
                Verify Your Account
              </DialogTitle>
            </DialogHeader>
            <AccountVarificationForm handleSubmit={handleVerifyOtp} />
          </DialogContent>
        </Dialog>
      )}
    </CardContent>
  </Card>
</div>

      </div>
    </div>
  );
};

export default Profile;
