import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../State/Store";
import { logout } from "../State/AuthSlice";

const Navbar = () => {



  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { role } = useAppSelector((state) => state.auth); // user object with role, name, etc.

  const handleLogout = () => {
    dispatch(logout());

    navigate("/login"); // redirect to login
  };

  const profileLink = () => {
    switch (role) {
      case "CITIZEN": return "/citizen/profile";
      case "OFFICER": return "/officer/profile";
      case "TECHNICIAN": return "/technician/profile";
      case "HEAD": return "/head/profile";
      default: return "/profile";
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold">
              UrbanReporter
            </Link>
          </div>

          {/* Menu Items */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:bg-blue-500 px-3 py-2 rounded-md">
              Home
            </Link>
            <Link to="/about" className="hover:bg-blue-500 px-3 py-2 rounded-md">
              About
            </Link>
            <Link to="/issues" className="hover:bg-blue-500 px-3 py-2 rounded-md">
              Issues
            </Link>

            {!role && (
              <>
                <Link to="/login" className="hover:bg-blue-500 px-3 py-2 rounded-md">
                  Login
                </Link>
                <Link to="/signup" className="hover:bg-blue-500 px-3 py-2 rounded-md">
                  Signup
                </Link>
              </>
            )}

            {role === "ROLE_CITIZEN" && (
              <>
                <Link to="/report-issue" className="hover:bg-blue-500 px-3 py-2 rounded-md">
                  Report Issue
                </Link>
                <Link to="/my-issues" className="hover:bg-blue-500 px-3 py-2 rounded-md">
                  My Issues
                </Link>
              </>
            )}

            {role === "ROLE_TECHNICIAN" && (
                  <>
                    <Link
                      to="/technician-issues"
                      className="hover:bg-blue-500 px-2 py-1 rounded-md mt-1"
                    >
                      My Issues
                    </Link>

                    
                  </>
                )}

            {(role === "ROLE_OFFICER" )&& (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {/* Common to both Officer and Head */}
                <Link
                  to="/all-issues"
                  className="hover:bg-blue-500 px-2 py-1 rounded-md"
                >
                  All Issues
                </Link>

                

                {role === "ROLE_OFFICER" && (
                  <>
                    {/* <Link
                      to="/assign-issues"
                      className="hover:bg-blue-500 px-2 py-1 rounded-md"
                    >
                      Assign Issues
                    </Link> */}

                    <Link
                      to="/create-technician"
                      className="hover:bg-blue-500 px-2 py-1 rounded-md"
                    >
                      Create Technician
                    </Link>

                    <Link
                      to="/officer-dashboard"
                      className="hover:bg-blue-500 px-2 py-1 rounded-md"
                    >
                      Officer Dashboard
                    </Link>
                  </>
                )}
                

                

                
              </div>
            )}

            {role === "ROLE_HEAD" && (
                  <>
                    <Link
                      to="/reports"
                      className="hover:bg-blue-500 px-2 py-1 rounded-md mt-1"
                    >
                      Reports
                    </Link>

                    {/* <Link
                      to="/head-dashboard"
                      className="hover:bg-blue-500 px-2 py-1 rounded-md"
                    >
                      Head Profile
                    </Link> */}
                  </>
                )}


          </div>

          {/* User Section */}
          {role && (
            <div className="flex items-center space-x-4">
              <Link
                to={
                  role === "ROLE_CITIZEN" ? "/citizen/profile" :
                    role === "ROLE_OFFICER" ? "/officer/profile" :
                      role === "ROLE_TECHNICIAN" ? "/technician/profile" :
                        role === "ROLE_HEAD" ? "/head-dashboard" :
                          "/"
                }
                className="flex items-center hover:bg-blue-500 px-3 py-2 rounded-md"
              >
                <FaUser className="mr-1" /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center hover:bg-blue-500 px-3 py-2 rounded-md"
              >
                <FaSignOutAlt className="mr-1" /> Logout
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-white focus:outline-none">☰</button>
          </div>
        </div>
      </div>
    </nav>
  );
};





export default Navbar;
