import React, { useContext, useRef } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Hero = () => {
  const {
    setSearchFilter,
    setIsSearched,
    searchFilter,
    isSearched,
    jobs
  } = useContext(AppContext);

  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const onSearch = () => {
    const title = titleRef.current.value;
    const location = locationRef.current.value;

    setSearchFilter({ title, location });
    setIsSearched(true);
  };

  return (
    <div className="container 2xl:px-20 mx-auto my-10">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-950 text-white py-16 text-center mx-2 rounded-xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">Over 10,000+ jobs to apply</h2>
        <p className="mb-8 max-w-xl mx-auto text-sm font-light px-5">
          Your Next Big Career Move Starts Right Here – Explore The Best Job Opportunities And Take The First Step Toward Your Future!
        </p>
        <div className="flex items-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto">
          <div className="flex items-center w-full gap-2">
            <img className="h-4 sm:h-5" src={assets.search_icon} alt="search" />
            <input
              type="text"
              placeholder="Search for jobs"
              className="max-sm:text-xs p-2 rounded outline-none w-full"
              ref={titleRef}
            />
          </div>
          <div className="flex items-center w-full gap-2">
            <img className="h-4 sm:h-5" src={assets.location_icon} alt="location" />
            <input
              type="text"
              placeholder="Location"
              className="max-sm:text-xs p-2 rounded outline-none w-full"
              ref={locationRef}
            />
          </div>
          <button
            className="bg-blue-600 px-6 py-2 rounded text-white m-1"
            onClick={onSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Company Logos */}
      <div className="border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-md flex">
        <div className="flex justify-center gap-10 lg:gap-16 flex-wrap">
          <p className="font-medium">Trusted By:</p>
          <img className="h-6" src={assets.microsoft_logo} alt="Microsoft" />
          <img className="h-6" src={assets.walmart_logo} alt="Walmart" />
          <img className="h-6" src={assets.accenture_logo} alt="Accenture" />
          <img className="h-6" src={assets.samsung_logo} alt="Samsung" />
          <img className="h-6" src={assets.amazon_logo} alt="Amazon" />
          <img className="h-6" src={assets.adobe_logo} alt="Adobe" />
        </div>
      </div>

      {/* Search Results Section */}
      {isSearched && (
        <div className="mt-8 px-4" id="search-results">
          <h3 className="text-xl font-semibold mb-4 text-purple-800">Search Results</h3>
          {jobs.length > 0 ? (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <div key={job.id} className="border rounded p-4 shadow">
                  <h3 className="text-xl font-semibold text-purple-800">{job.title}</h3>
                  <p className="text-gray-600">{job.description}</p>
                  <p className="text-sm text-gray-500">
                    📍 {job.location} | 💰 ₹{job.salary}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No jobs found for your search.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Hero;
