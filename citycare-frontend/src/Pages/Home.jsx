import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaLightbulb, FaVoteYea } from "react-icons/fa";

const Home = () => {

     useEffect(() => {
        console.log(localStorage.getItem("jwt"))
        console.log(localStorage.getItem("role"))
    }, []); 
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Make Your City Better, One Report at a Time
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Report potholes, broken streetlights, vandalism, and other civic issues directly to authorities. Track progress and vote on priorities.
          </p>
          <Link
            to="/report-issue"
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition"
          >
            Report an Issue
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-10">
            
            {/* Geo-Tagging */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <FaMapMarkerAlt className="text-blue-600 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Geo-Tagged Issues</h3>
              <p>
                Pin the exact location of civic issues on a map, so authorities can reach them faster.
              </p>
            </div>

            {/* Issue Details */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <FaLightbulb className="text-blue-600 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Detailed Reporting</h3>
              <p>
                Attach images, write descriptions, and provide context for faster resolution of issues.
              </p>
            </div>

            {/* Voting System */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <FaVoteYea className="text-blue-600 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community Voting</h3>
              <p>
                Citizens can vote on the severity or priority of reported issues to help authorities act efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
        <p className="mb-8">Be proactive in improving your city. Every report counts!</p>
        <Link
          to="/signup"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
};

export default Home;
