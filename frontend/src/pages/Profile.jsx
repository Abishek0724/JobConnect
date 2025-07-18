import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';

const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    skills: '',
    resumeUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/candidate/my-profile');
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('fullName', profile.fullName);
      formData.append('email', profile.email);
      formData.append('phone', profile.phone);
      formData.append('education', profile.education);
      formData.append('experience', profile.experience);
      formData.append('skills', profile.skills);
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const response = await api.put('/candidate/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setProfile(response.data);
      setIsEditing(false);
      setResumeFile(null);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Candidate Profile</h2>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input label="Full Name" name="fullName" value={profile.fullName} onChange={handleChange} required />
                  <Input label="Email" name="email" type="email" value={profile.email} onChange={handleChange} required />
                  <Input label="Phone" name="phone" value={profile.phone} onChange={handleChange} />
                  <Input label="Education" name="education" value={profile.education} onChange={handleChange} />
                  <Textarea label="Experience" name="experience" value={profile.experience} onChange={handleChange} />
                  <Textarea label="Skills" name="skills" value={profile.skills} onChange={handleChange} />

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Resume</label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {profile.resumeUrl && !resumeFile && (
                      <p className="mt-2 text-sm text-gray-500">
                        Current resume:{' '}
                        <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Resume
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6">
                <ProfileField label="Full Name" value={profile.fullName} />
                <ProfileField label="Email" value={profile.email} />
                <ProfileField label="Phone" value={profile.phone} />
                <ProfileField label="Education" value={profile.education} />
                <ProfileField label="Experience" value={profile.experience} multiline />
                <ProfileField label="Skills" value={profile.skills} multiline />

                {profile.resumeUrl && (
                  <div className="sm:col-span-2 mt-4">
                    <h3 className="text-sm font-medium text-gray-500">Resume</h3>
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      View Resume
                    </a>
                  </div>
                )}

                <div className="mt-6">
                  <button onClick={() => setIsEditing(true)} className="btn-primary">
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};


const Input = ({ label, name, type = 'text', value, onChange, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
    />
  </div>
);

const Textarea = ({ label, name, value, onChange }) => (
  <div className="sm:col-span-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={3}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
    />
  </div>
);

const ProfileField = ({ label, value, multiline = false }) => (
  <div className={`sm:col-span-${multiline ? '2' : '1'} mb-4`}>
    <h3 className="text-sm font-medium text-gray-500">{label}</h3>
    <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{value || 'Not provided'}</p>
  </div>
);

export default Profile;
