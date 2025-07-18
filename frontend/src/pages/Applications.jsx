import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { assets } from '../assets/assets';
import moment from 'moment';
import api from '../api/api';

const Applications = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/candidate/applications');
        setApplications(res.data);
      } catch (err) {
        console.error('Error fetching applications:', err);
        alert('Failed to fetch applied jobs.');
      }
    };

    fetchApplications();
  }, []);

  const handleResumeUpload = async () => {
    const formData = new FormData();
    formData.append("resume", resume);

    try {
      await api.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("Resume uploaded successfully!");
      setIsEdit(false);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Resume upload failed.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        <h2 className="text-xl font-semibold">Your Resume</h2>
        <div className="flex gap-2 mb-6 mt-3">
          {isEdit ? (
            <>
              <label className="flex items-center cursor-pointer" htmlFor="resumeUpload">
                <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2">Select Resume</p>
                <input
                  id="resumeUpload"
                  onChange={(e) => setResume(e.target.files[0])}
                  accept="application/pdf"
                  type="file"
                  hidden
                />
                <img src={assets.profile_upload_icon} alt="Upload" />
              </label>
              <button
                onClick={handleResumeUpload}
                className="bg-green-100 border-green-400 rounded-lg px-4 py-2"
              >
                Save
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <a className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg" href="">
                Resume
              </a>
              <button
                onClick={() => setIsEdit(true)}
                className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b text-left">Job Title</th>
              <th className="py-3 px-4 border-b text-left">Location</th>
              <th className="py-3 px-4 border-b text-left">Applied On</th>
              <th className="py-3 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={app.id || index}>
                <td className="py-2 px-4 border-b">{app.jobTitle}</td>
                <td className="py-2 px-4 border-b">{app.jobLocation}</td>
                <td className="py-2 px-4 border-b">
                  {moment(app.appliedAt).format("ll")}
                </td>
                <td className="py-2 px-4 border-b">
                  <span
                    className={`${
                      app.status === "ACCEPTED"
                        ? "bg-green-100 text-green-700"
                        : app.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    } px-4 py-1.5 rounded-lg`}
                  >
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Applications;
