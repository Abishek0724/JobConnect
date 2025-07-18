import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { assets, JobCategories, JobLocations } from '../assets/assets';
import JobCard from './JobCard';

const JobListing = () => {
  const {
    isSearched,
    searchFilter,
    setSearchFilter,
    jobs
  } = useContext(AppContext);

  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const matchesCategory = job =>
      selectedCategories.length === 0 || selectedCategories.includes(job.category);
    const matchesLocation = job =>
      selectedLocations.length === 0 || selectedLocations.includes(job.location);

    const filtered = jobs.filter(
      job => matchesCategory(job) && matchesLocation(job)
    );

    setFilteredJobs(filtered);
    setCurrentPage(1); 
  }, [jobs, selectedCategories, selectedLocations]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-1/4 bg-white px-4">
        {isSearched && (searchFilter.title || searchFilter.location) && (
          <>
            <h3 className="font-medium text-lg mb-4">Current Search</h3>
            <div className="mb-4 text-gray-600 space-x-2">
              {searchFilter.title && (
                <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
                  {searchFilter.title}
                  <img
                    onClick={() =>
                      setSearchFilter(prev => ({ ...prev, title: '' }))
                    }
                    className="cursor-pointer"
                    src={assets.cross_icon}
                    alt="remove title filter"
                  />
                </span>
              )}
              {searchFilter.location && (
                <span className="inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded">
                  {searchFilter.location}
                  <img
                    onClick={() =>
                      setSearchFilter(prev => ({ ...prev, location: '' }))
                    }
                    className="cursor-pointer"
                    src={assets.cross_icon}
                    alt="remove location filter"
                  />
                </span>
              )}
            </div>
          </>
        )}

        {/* Category Filter */}
        <div className="max-lg:hidden">
          <h4 className="font-medium text-lg py-4">Search by Categories</h4>
          <ul className="space-y-4 text-gray-600">
            {JobCategories.map((category, index) => (
              <li key={index} className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  className="scale-125"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Location Filter */}
        <div className="max-lg:hidden">
          <h4 className="font-medium text-lg py-4 pt-14">Search by Location</h4>
          <ul className="space-y-4 text-gray-600">
            {JobLocations.map((location, index) => (
              <li key={index} className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  className="scale-125"
                  checked={selectedLocations.includes(location)}
                  onChange={() => handleLocationChange(location)}
                />
                {location}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Job Cards Section */}
      <main className="w-full lg:w-3/4 text-gray-800 max-lg:px-4">
        <h3 className="font-medium text-3xl py-2" id="job-list">Latest Jobs</h3>
        <p className="mb-8">Get your desired jobs from top companies</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs.length > 0 ? (
            filteredJobs
              .slice((currentPage - 1) * 6, currentPage * 6)
              .map((job, index) => (
                <JobCard key={job.id || index} job={job} />
              ))
          ) : (
            <p className="text-gray-500 col-span-full">No jobs found.</p>
          )}
        </div>

        {/* Pagination */}
        {filteredJobs.length > 6 && (
          <div className="flex items-center justify-center space-x-2 mt-10">
            <a href="#job-list">
              <img
                src={assets.left_arrow_icon}
                alt="Previous"
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              />
            </a>
            {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map((_, index) => (
              <a key={index} href="#job-list">
                <button
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${
                    currentPage === index + 1
                      ? 'bg-blue-100 text-blue-500'
                      : 'text-gray-500'
                  }`}
                >
                  {index + 1}
                </button>
              </a>
            ))}
            <a href="#job-list">
              <img
                src={assets.right_arrow_icon}
                alt="Next"
                onClick={() =>
                  setCurrentPage(Math.min(currentPage + 1, Math.ceil(filteredJobs.length / 6)))
                }
              />
            </a>
          </div>
        )}
      </main>
    </div>
  );
};

export default JobListing;
