import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/apply-jobs/${job.id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="border p-6 shadow rounded hover:shadow-md transition duration-200 bg-white">
      {/* Top: Company Icon */}
      <div className="flex justify-between items-center mb-2">
        <img className="h-8" src={assets.company_icon} alt="Company icon" />
      </div>

      {/* Job Title */}
      <h4 className="font-semibold text-lg line-clamp-2">{job.title || 'Untitled Position'}</h4>

      {/* Tags */}
      <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
        {job.location && (
          <span className="bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
            {job.location}
          </span>
        )}
        {job.level && (
          <span className="bg-red-50 border border-red-200 px-4 py-1.5 rounded">
            {job.level}
          </span>
        )}
      </div>

      {/* Description Preview */}
      <p className="text-gray-600 text-sm mt-4">
        {job.description
          ? job.description.slice(0, 150) + (job.description.length > 150 ? '...' : '')
          : 'No description available.'}
      </p>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-4 text-sm">
        <button
          onClick={handleNavigate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Apply now
        </button>
        <button
          onClick={handleNavigate}
          className="text-gray-600 border border-gray-400 rounded px-4 py-2 hover:text-black hover:border-black transition"
        >
          Learn more
        </button>
      </div>
    </div>
  );
};

export default JobCard;
