import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../State/Store";
import {
    fetchCitizenProfile,
    updateCitizenProfile,
    updateCitizenPassword,
    clearCitizenError,
    clearPasswordSuccessMessage,
} from "../../State/Citizen/CitizenSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate=useNavigate();
    const dispatch = useAppDispatch();

    const { profile, loading, error, updatePasswordSuccessMessage } = useAppSelector(
        (state) => state.citizen
    );
      const { isLoggedIn, error: authError } = useAppSelector((state) => state.auth); // Get login status


    const [editMode, setEditMode] = useState(false);
    const [passwordMode, setPasswordMode] = useState(false);

    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
        addresses: [],
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });


    useEffect(() => {
    // Check if the user is logged in according to Redux state
    if (!isLoggedIn) {
       console.log("User not logged in, redirecting to login...");
       navigate("/login"); // Redirect to login page if not authenticated
       return; // Stop further execution in this effect
    }

    // Only fetch if logged in AND profile is not already loaded
    if (isLoggedIn && !profile) {
      console.log("User logged in, fetching profile...");
      dispatch(fetchCitizenProfile());
    }
  }, [dispatch, profile, isLoggedIn, navigate]); 


    // Fetch profile on mount if not already fetched
    // useEffect(() => {
    //     if (!profile) dispatch(fetchCitizenProfile());
    // }, [dispatch, profile]);

    // Sync profile data to local state
    useEffect(() => {
        if (profile) {
            setProfileData({
                name: profile.name || "",
                email: profile.email || "",
                phone: profile.phone || "",
                addresses: profile.addresses || [],
            });
        }
    }, [profile]);

    // Clear error messages when editMode or passwordMode changes
    useEffect(() => {
        dispatch(clearCitizenError());
        dispatch(clearPasswordSuccessMessage());
    }, [editMode, passwordMode, dispatch]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (index, e) => {
        const { name, value } = e.target;
        const updatedAddresses = [...profileData.addresses];
        if (updatedAddresses[index]) {
            updatedAddresses[index] = { ...updatedAddresses[index], [name]: value };
            setProfileData((prev) => ({ ...prev, addresses: updatedAddresses }));
        }
    };

    const handleAddAddress = () => {
        setProfileData((prev) => ({
            ...prev,
            addresses: [
                ...prev.addresses,
                { name: "", locality: "", streetAddress: "", city: "", state: "", pinCode: "", mobile: "", id: null },
            ],
        }));
    };
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };
    const handleUpdateProfile = () => {
        dispatch(updateCitizenProfile(profileData))
            .unwrap()
            .then(() => setEditMode(false))
            .catch(() => { });
    };

    const handleUpdatePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New password and confirm password do not match!");
            return;
        }
        dispatch(updateCitizenPassword({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword
        }))
            .unwrap()
            .then(() => {
                setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
                setPasswordMode(false);
            })
            .catch(() => { });
    };

    if (loading && !profile) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-gray-600">Loading profile...</p>
            </div>
        );
    }

    if (!profile && !loading && error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-center p-4">
                <p className="text-xl text-red-600 mb-4">Failed to load profile.</p>
                <p className="text-sm text-gray-500 mb-4">{JSON.stringify(error)}</p>
                <button
                    onClick={() => dispatch(fetchCitizenProfile())}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Profile</h1>
                {!editMode && (
                    <button
                        onClick={() => setEditMode(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md shadow-sm text-sm font-medium"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {error && editMode && (
                <div className="mb-4 rounded-md bg-red-100 p-4 border border-red-200">
                    <p className="text-sm font-medium text-red-700">
                        {typeof error === 'object' && error !== null ? error.message || JSON.stringify(error) : String(error)}
                    </p>
                </div>
            )}

            {updatePasswordSuccessMessage && passwordMode && (
                <div className="mb-4 rounded-md bg-green-100 p-4 border border-green-200">
                    <p className="text-sm font-medium text-green-700">{updatePasswordSuccessMessage}</p>
                </div>
            )}

            {/* Profile Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-5 border-b pb-3">Personal Information</h2>
                {["name", "email", "phone"].map((field) => (
                    <div className="mb-4" key={field}>
                        <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
                            {field === 'name' ? 'Full Name' : field === 'phone' ? 'phone' : 'Email'}
                        </label>
                        <input
                            id={field}
                            type={field === "email" ? "email" : (field === "phone" ? "tel" : "text")}
                            name={field}
                            value={profileData[field]}
                            onChange={handleProfileChange}
                            disabled={!editMode || field === 'email'}
                            className={`w-full p-2.5 border rounded-md text-sm ${editMode && field !== 'email'
                                ? "border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                : "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                                }`}
                        />
                        {field === 'email' && <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>}
                    </div>
                ))}
            </div>

            {/* Addresses */}
            <h2 className="text-xl font-semibold text-gray-700 mb-5 border-b pb-3">My Addresses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {profileData.addresses.map((addr, index) => (
                    <div key={addr.id || `new-${index}`} className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
                        {editMode ? (
                            <div className="space-y-3">
                                {["name", "locality", "streetAddress", "city", "state", "pinCode", "mobile"].map((field) => (
                                    <div key={field}>
                                        <label htmlFor={`addr-${index}-${field}`} className="block text-xs font-medium text-gray-600 mb-1">
                                            {field === 'streetAddress' ? 'Street Address' : field === 'pinCode' ? 'PIN Code' : field.charAt(0).toUpperCase() + field.slice(1)}
                                        </label>
                                        <input
                                            id={`addr-${index}-${field}`}
                                            type={field === "mobile" || field === "pinCode" ? "tel" : "text"}
                                            name={field}
                                            value={addr[field] || ''}
                                            onChange={(e) => handleAddressChange(index, e)}
                                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-700 space-y-1">
                                <p className="font-semibold text-base text-gray-800">{addr.name}</p>
                                <p>{addr.streetAddress}, {addr.locality}</p>
                                <p>{addr.city}, {addr.state} - {addr.pinCode}</p>
                                <p><span className="font-medium text-gray-600">mobile:</span> {addr.mobile}</p>
                            </div>
                        )}
                    </div>
                ))}
                {(!profileData.addresses || profileData.addresses.length === 0) && !editMode && (
                    <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500 text-sm md:col-span-2">
                        You haven't added any addresses yet.
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 flex-wrap">
                {editMode && (
                    <>
                        <button
                            onClick={handleAddAddress}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium"
                            disabled={loading}
                        >
                            Add Address
                        </button>
                        <button
                            onClick={handleUpdateProfile}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md shadow-sm text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            onClick={() => {
                                setEditMode(false);
                                if (profile) setProfileData({ name: profile.name, email: profile.email, mobile: profile.mobile, addresses: profile.addresses });
                            }}
                            disabled={loading}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                        >
                            Cancel
                        </button>
                    </>
                )}
                {!editMode && (
                    <button
                        onClick={() => setPasswordMode(!passwordMode)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                        {passwordMode ? 'Cancel Password Change' : 'Change Password'}
                    </button>
                )}
            </div>

            {/* Password Change Form */}
            {passwordMode && (
                <div className="bg-white p-6 rounded-lg shadow-md mt-6 max-w-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-5 border-b pb-3">Change Password</h2>
                    {["oldPassword", "newPassword", "confirmPassword"].map((field) => (
                        <div className="mb-4" key={field}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field === 'oldPassword' ? 'Old Password' : field === 'newPassword' ? 'New Password' : 'Confirm Password'}
                            </label>
                            <input
                                type="password"
                                name={field}
                                value={passwordData[field]}
                                onChange={handlePasswordChange}
                                className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                    ))}
                    <button
                        onClick={handleUpdatePassword}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md shadow-sm text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Update Password'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;
