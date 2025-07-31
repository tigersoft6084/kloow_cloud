import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ==============================|| GUEST GUARD ||============================== //

const GuestGuard = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'Y';
  console.log(isAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/main/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return children;
};

export default GuestGuard;
