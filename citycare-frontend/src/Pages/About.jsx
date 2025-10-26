import React from 'react';
import { assets } from '../assets/Assets';

const AboutPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 ">
      <div className=" mx-auto bg-white p-2 rounded-2xl shadow-lg">
        
        {/* Header Section */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center">
          About CityCare
        </h1>
        <p className="text-xl text-indigo-600 font-semibold text-center mt-2">
          Your Voice for a Better City
        </p>
        
        <div className="mt-8 flex justify-center gap-2 flex-wrap">
          {/* Image 1: Illustrate the problem - Pothole */}
          <img 
            src={assets.Pothole} 
            alt="Pothole on a street" 
            className="w-full md:w-1/4 object-cover rounded-lg shadow-md max-h-[200px]"
          />
          {/* Image 1.1: Illustrate the problem - Group of people holding a sign for community improvement */}
          <img 
            src={assets.Community}
            alt="Group of diverse people holding a sign for community improvement" 
            className="w-full md:w-1/4 object-cover rounded-lg shadow-md max-h-[200px]"
          />
           {/* Image 1.2: Illustrate the problem - Overfilled trash cans with litter around */}
          <img 
            src={assets.Trash}
            alt="Overfilled trash cans with litter around" 
            className="w-full md:w-1/4 object-cover rounded-lg shadow-md max-h-[200px]"
          />
        </div>
        <p className="text-lg text-gray-600 italic text-center mt-8 leading-relaxed">
          "We've all seen it: the flickering streetlight, the growing pothole, the overflowing bin. For too long, reporting these issues felt like shouting into the void. Where do you send the email? Who do you call? Does anyone even know this is a problem?"
        </p>
        
        <p className="text-lg text-gray-800 text-center mt-4 font-medium">
          CityCare was built to change that.
        </p>

        {/* Divider */}
        <hr className="my-10" />

        {/* Our Mission Section */}
        <div className="mt-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Mission
          </h2>
          {/* Image 2: Community collaboration / city hall */}
          <img 
            src={assets.OurMission}
            alt="Diverse community members collaborating with a city official in front of a modern city hall building" 
            className="mx-auto mt-4 rounded-lg shadow-md max-h-[350px] object-cover"
          />
          <p className="text-base text-gray-700 leading-relaxed mt-4">
            Our mission is to bridge the gap between citizens and municipal authorities. We empower you to become an active participant in improving your community by providing a simple, transparent, and powerful tool to report and track urban issues.
          </p>
        </div>

        {/* How It Works Section */}
        <div className="mt-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center text-center p-4 bg-gray-100 rounded-lg shadow-sm">
              {/* Image 3: Report - person taking photo of an issue with a smartphone */}
              <img 
                src={assets.HIW1}
                alt="Hand holding a smartphone taking a photo of an urban issue, with a camera icon overlay" 
                className="w-32 h-24 object-cover rounded-lg"
              />
              <h3 className="text-xl font-semibold text-gray-800 mt-4">1. Spot & Report</h3>
              <p className="text-sm text-gray-600 mt-2">See a problem? Snap a photo, add details, and log it instantly.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-gray-100 rounded-lg shadow-sm">
              {/* Image 4: Vote - hands voting / upvoting on a digital interface with numbers */}
              <img 
                src={assets.HIW2}
                alt="Multiple hands reaching to touch a digital screen with upvote icons and numbers, signifying community prioritization" 
                className="w-32 h-24 object-cover rounded-lg"
              />
              <h3 className="text-xl font-semibold text-gray-800 mt-4">2. Vote & Prioritize</h3>
              <p className="text-sm text-gray-600 mt-2">Other citizens can upvote reports, prioritizing urgent issues for officials.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-gray-100 rounded-lg shadow-sm">
              {/* Image 5: Track & Resolve - city worker fixing something with a clear progress indicator */}
              <img 
                src={assets.HIW3}
                alt="City worker in uniform fixing a utility with a 'Resolved' or 'Completed' progress bar icon" 
                className="w-32 h-24 object-cover rounded-lg"
              />
              <h3 className="text-xl font-semibold text-gray-800 mt-4">3. Track & Resolve</h3>
              <p className="text-sm text-gray-600 mt-2">Monitor your report's status in real-time, from start to completion.</p>
            </div>
          </div>
        </div>

        {/* Why We Built This Section */}
        <div className="mt-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why We Built This
          </h2>
          {/* Image 6: Vibrant, clean city skyline at sunset, showing a thriving urban environment */}
          <img 
            src={assets.WWB}
            alt="Vibrant, clean city skyline at sunset, with green spaces and happy people, representing a thriving urban environment" 
            className="mx-auto mt-4 rounded-lg shadow-md max-h-[450px] object-cover"
          />
          <p className="text-base text-gray-700 leading-relaxed mt-4 mb-4">
            This platform was born from a simple idea: <strong>citizens and city officials should be on the same team.</strong>
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            By creating a centralized hub for reporting, we foster community engagement and help authorities manage resources more efficiently. When we work together, we can build a safer, cleaner, and more responsive urban environment.
          </p>
        </div>
        
        {/* Tech Stack Section */}
        <div className="mt-10 bg-gray-100 p-6 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            The Tech Behind the Talk
          </h3>
          <p className="text-base text-gray-700 mb-4">
            For those interested, CityCare is a high-speed project built with a modern, reliable tech stack:
          </p>
          <ul className="list-disc list-inside space-y-2 inline-block text-left">
            <li><strong className="font-medium">Frontend:</strong> React & TailwindCSS</li>
            <li><strong className="font-medium">Backend:</strong> Java with Spring Boot</li>
            <li><strong className="font-medium">Database:</strong> MySQL</li>
          </ul>
          <p className="text-sm text-gray-600 italic text-center mt-6">
            (This entire platform was developed as a rapid-prototype project in just 16 hours!)
          </p>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;