import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { assets } from '../assets/assets';

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const dropdownRefs = useRef([]);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/employer/applications');
      setApplications(res.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleAction = async (applicationId, status) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, { status });
      setApplications(prev =>
        prev.map(app =>
          app.applicationId === applicationId
            ? { ...app, applicationStatus: status }
            : app
        )
      );
      setOpenDropdownIndex(null);
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRefs.current.every(ref => ref && !ref.contains(e.target))
      ) {
        setOpenDropdownIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-6xl overflow-x-auto">
          <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md max-sm:text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-3 px-4 border-b">#</th>
                <th className="py-3 px-4 border-b">Candidate</th>
                <th className="py-3 px-4 border-b max-sm:hidden">Job Title</th>
                <th className="py-3 px-4 border-b max-sm:hidden">Location</th>
                <th className="py-3 px-4 border-b">Resume</th>
                <th className="py-3 px-4 border-b">Status</th> 
                <th className="py-3 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr key={app.applicationId || index} className="text-gray-700">
                  <td className="py-2 px-4 border-b text-center">{index + 1}</td>

                  <td className="py-2 px-4 border-b">
                    <span>{app.candidateName || 'N/A'}</span>
                  </td>

                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {app.jobTitle || 'N/A'}
                  </td>

                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {app.jobLocation || 'N/A'}
                  </td>

                  <td className="py-2 px-4 border-b">
                    {app.resumeUrl ? (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-50 text-blue-500 px-3 py-1 rounded inline-flex items-center gap-2"
                      >
                        Resume <img src={assets.resume_download_icon} alt="Download" />
                      </a>
                    ) : (
                      <span className="text-gray-400">No resume</span>
                    )}
                  </td>

                  <td className="py-2 px-4 border-b capitalize font-medium text-sm">
                    <span
                      className={
                        app.applicationStatus === 'REJECTED'
                          ? 'text-red-500'
                          : app.applicationStatus === 'SELECTED'
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }
                    >
                      {app.applicationStatus || 'APPLIED'}
                    </span>
                  </td>

                  <td className="py-2 px-4 border-b relative">
                    <div
                      ref={(el) => (dropdownRefs.current[index] = el)}
                      className="relative inline-block text-left"
                    >
                      <button
                        onClick={() =>
                          setOpenDropdownIndex(
                            openDropdownIndex === index ? null : index
                          )
                        }
                        className="text-gray-700 font-bold text-xl"
                      >
                        &#8942;
                      </button>

                      {openDropdownIndex === index && (
                        <div className="absolute right-0 z-10 mt-2 w-32 bg-white border border-gray-200 rounded shadow">
                          <button
                            onClick={() => handleAction(app.applicationId, 'SELECTED')}
                            className="block w-full text-left px-4 py-2 text-green-600 hover:bg-gray-100"
                          >
                            SELECTED
                          </button>
                          <button
                            onClick={() => handleAction(app.applicationId, 'REJECTED')}
                            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {applications.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-gray-400">
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ViewApplications;
