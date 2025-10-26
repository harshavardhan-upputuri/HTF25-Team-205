import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { sendLoginSignupOtp, login } from '../State/AuthSlice';
import { FaGithub, FaGoogle } from "react-icons/fa";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [loginMethod, setLoginMethod] = useState("password"); // 'password' or 'otp'

    const { loading, otpSent, error } = useSelector((state) => state.auth);

    const handleSendOtp = () => {
        if (!email) return;
        dispatch(sendLoginSignupOtp({ email }));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const payload = loginMethod === "password"
            ? { email, password, loginMethod }
            : { email, otp, loginMethod };

        dispatch(login(payload))
            .unwrap()
            .then(() => navigate("/"))
            .catch((err) => console.error("Login failed:", err));
    };

 

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg'>
                
                {/* Header */}
                <div className="text-center">
                    <h2 className='text-3xl font-bold text-gray-900'>
                        Welcome Back!
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to continue to your account.
                    </p>
                </div>

                
       
                {/* Form */}
                <form onSubmit={handleLogin} className='space-y-6'>
                    <div>
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Email address"
                            required
                        />
                    </div>

                    {loginMethod === 'password' && (
                        <div>
                             <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Password"
                                required
                            />
                        </div>
                    )}

                    {loginMethod === 'otp' && (
                        <div className="flex gap-4">
                             <label htmlFor="otp" className="sr-only">OTP</label>
                            <input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter OTP"
                                required={otpSent}
                            />
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={loading || otpSent}
                                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md whitespace-nowrap hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {otpSent ? "Sent" : "Send OTP"}
                            </button>
                        </div>
                    )}
                    
                    {error && <p className="text-sm text-red-600">{error}</p>}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>

                    {/* Toggle Login Method */}
                    <div className="text-sm text-center">
                        <span 
                            onClick={() => setLoginMethod(loginMethod === 'password' ? 'otp' : 'password')}
                            className="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500"
                        >
                            {loginMethod === 'password' ? 'Sign in with OTP instead' : 'Sign in with Password instead'}
                        </span>
                    </div>
                </form>

                {/* Link to Signup */}
                <div className='text-sm text-center text-gray-600'>
                    <p>Don't have an account?
                        <span onClick={() => navigate("/signup")} className='ml-1 font-medium text-indigo-600 cursor-pointer hover:text-indigo-500'>
                            Create one now
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;