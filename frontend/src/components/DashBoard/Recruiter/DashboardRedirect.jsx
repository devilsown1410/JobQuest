import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (user.userType === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else {
        navigate('/jobseeker-dashboard');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return null;
};

export default DashboardRedirect;