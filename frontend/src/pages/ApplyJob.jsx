
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar';
import { assets } from '../assets/assets';
import kconvert from 'k-convert';
import moment from 'moment';
import JobCard from '../components/JobCard';
import api from '../api/api';

const ApplyJob = () => {
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const { jobs, fetchJobs } = useContext(AppContext);

  const fetchJob = async () => {
    try {
      const res = await api.get(`candidate/jobs/${id}`);
      setJobData(res.data);
    } catch (err) {
      console.error('Error fetching job:', err);
      alert('Failed to load job details');
    }
  };

  useEffect(() => {
    if (id) fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      await api.post('/candidate/apply', { jobId: id });
      alert('Applied successfully!');
    } catch (error) {
      console.error('Apply error:', error);
      alert('Failed to apply. You may have already applied or are not logged in.');
    }
  };

  return jobData ? (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          {/* Header */}
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <img
                className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border"
                src={jobData?.company?.image || assets.company_icon}
                alt="company-logo"
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl font-medium">{jobData.title}</h1>
                <div className="flex flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="" />
                    {jobData?.company?.name || "Unknown Company"}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="" />
                    {jobData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="" />
                    {jobData.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="" />
                    CTC: {kconvert.convertTo(jobData.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
              <button
                onClick={handleApply}
                className="bg-blue-600 p-2.5 px-20 text-white rounded"
              >
                Apply Now
              </button>
              <p className="mt-1 text-gray-600">
                Posted {moment(jobData.date).fromNow()}
              </p>
            </div>
          </div>

          {/* Description + More Jobs */}
          <div className="flex flex-col lg:flex-row justify-between items-start">
            {/* Description */}
            <div className="w-full lg:w-2/3">
              <h2 className="font-bold text-2xl mb-4">Job description</h2>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: jobData.description }}
              ></div>
              <button
                onClick={handleApply}
                className="bg-blue-600 p-2.5 px-20 text-white rounded mt-10"
              >
                Apply Now
              </button>
            </div>

            {/* More Jobs from Company */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2 className="font-semibold text-lg mb-2">
                More jobs from {jobData?.company?.name || "this company"}
              </h2>
              {jobs
                .filter(
                  (job) =>
                    job.id !== jobData.id &&
                    job.company?.id === jobData.company?.id
                )
                .slice(0, 4)
                .map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ApplyJob;
