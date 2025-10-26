import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { sendLoginSignupOtp, signup } from '../State/AuthSlice';
import { FaUser, FaEnvelope, FaMobileAlt, FaKey, FaShieldAlt } from "react-icons/fa";

const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');

    const { loading, otpSent, error } = useSelector((state) => state.auth);

    const handleSendOtp = () => {
        if (!email) return;
        dispatch(sendLoginSignupOtp({ email }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signup({ name, email, phone, password, otp }))
            .unwrap()
            .then(() => {
                navigate("/");
            })
            .catch((err) => {
                console.error("Signup failed:", err);
            });
    };

    // A small helper component for input fields to keep the code DRY
    const InputField = ({ icon, type, placeholder, value, onChange }) => (
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                {icon}
            </span>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
            />
        </div>
    );

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg'>

                {/* Header */}
                <div className="text-center">
                    <h2 className='text-3xl font-bold text-gray-900'>
                        Create Your Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Get started with your digital insurance journey.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className='space-y-6'>
                    <InputField 
                        icon={<FaUser className="text-gray-400" />} 
                        type="text" 
                        placeholder="Full Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                    <InputField 
                        icon={<FaEnvelope className="text-gray-400" />} 
                        type="email" 
                        placeholder="Email Address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <InputField 
                        icon={<FaMobileAlt className="text-gray-400" />} 
                        type="tel" 
                        placeholder="phone Number" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                    />
                    <InputField 
                        icon={<FaKey className="text-gray-400" />} 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />

                    {/* OTP Section */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex-grow">
                             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <FaShieldAlt className="text-gray-400" />
                            </span>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={!otpSent} // Disable input until OTP is sent
                                required
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={loading || otpSent || !email}
                            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md whitespace-nowrap hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {otpSent ? "OTP Sent" : "Send OTP"}
                        </button>
                    </div>

                    {error && <p className="text-sm text-center text-red-600">{error}</p>}
                    
                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                {/* Link to Login */}
                <div className='text-sm text-center text-gray-600'>
                    <p>Already have an account?
                        <span onClick={() => navigate("/login")} className='ml-1 font-medium text-indigo-600 cursor-pointer hover:text-indigo-500'>
                            Sign in instead
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;