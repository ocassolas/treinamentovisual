import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

const Index = () => {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.role === 'admin' ? '/admin' : '/app');
    } else {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return null;
};

export default Index;
