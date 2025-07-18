import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/api';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const ManageJob = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    try {
      const res = await api.get('/employer/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (jobId, currentVisibility) => {
    try {
      await api.patch(`/jobs/${jobId}/visibility`, {
        visible: !currentVisibility,
      });
      setJobs(prev =>
        prev.map(job =>
          job.id === jobId ? { ...job, visible: !currentVisibility } : job
        )
      );
    } catch (err) {
      console.error('Error updating visibility:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="container p-4 max-w-5xl w-full">
          {loading ? (
            <p className="text-center text-gray-500">Loading jobs...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : jobs.length === 0 ? (
            <p className="text-center text-gray-400">No jobs posted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm max-sm:text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b text-left">#</th>
                    <th className="py-2 px-4 border-b text-left">Job Title</th>
                    <th className="py-2 px-4 border-b text-left">Date</th>
                    <th className="py-2 px-4 border-b text-left">Location</th>
                    <th className="py-2 px-4 border-b text-center">Applicants</th>
                    <th className="py-2 px-4 border-b text-center">Visible</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job, index) => (
                    <tr key={job._id} className="text-gray-700">
                      <td className="py-2 px-4 border-b">{index + 1}</td>
                      <td className="py-2 px-4 border-b">{job.title}</td>
                      <td className="py-2 px-4 border-b">
                        {moment(job.postedDate).format('ll')}
                      </td>
                      <td className="py-2 px-4 border-b">{job.location}</td>
                      <td className="py-2 px-4 border-b text-center">{job.applicants?.length || 0}</td>
                      <td className="py-2 px-4 border-b text-center">
                        <input
                          type="checkbox"
                          className="scale-125 cursor-pointer"
                          checked={job.visible}
                          onChange={() => toggleVisibility(job._id, job.visible)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate('/add-job')}
              className="bg-black text-white py-2 px-5 rounded hover:bg-gray-800 transition"
            >
              Add New Job
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageJob;
