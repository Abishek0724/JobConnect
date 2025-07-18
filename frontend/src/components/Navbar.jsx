import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const userName = localStorage.getItem('username');
    if (token && userRole) {
      setIsLoggedIn(true);
      setRole(userRole);
      setUsername(userName || '');
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole(null);
    setUsername('');
    navigate('/');
  };

  return (
    <div className="shadow py-4">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        <img
          src={assets.logo}
          alt="JobConnect Logo"
          className="h-10 cursor-pointer"
          onClick={() => navigate('/')}
        />

        <div className="flex gap-4 max-sm:text-xs items-center">
          {!isLoggedIn && (
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full"
            >
              Login
            </button>
          )}

          {isLoggedIn && role === 'CANDIDATE' && (
            <>
              <p className="text-sm font-medium text-gray-700">Hi, {username}</p>
              <button onClick={() => navigate('/applications')} className="text-blue-600">
                My Applications
              </button>
              <button onClick={() => navigate('/profile')} className="text-blue-600">
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="bg-blue-600 text-white px-4 py-2 rounded-full"
              >
                Logout
              </button>
            </>
          )}

          {isLoggedIn && role === 'EMPLOYER' && (
            <>
              <button onClick={() => navigate('/add-job')} className="text-blue-600">
                Post Job
              </button>
              <button onClick={() => navigate('/manage-job')} className="text-blue-600">
                Manage Jobs
              </button>
              <button onClick={() => navigate('/view-application')} className="text-blue-600">
                View Applications
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-full"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
