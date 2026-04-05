import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import AuthLayout from './AuthLayout';

interface AuthPageProps {
  onAuthSuccess: (user: any) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitchToSignup = () => {
    setIsLogin(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <AuthLayout
      title={isLogin ? 'Login' : 'Sign up'}
      subtitle={isLogin 
        ? 'Login to access your account.'
        : 'Create an account to get started.'
      }
    >
      {isLogin ? (
        <LoginForm 
          onLogin={onAuthSuccess} 
          onSwitchToSignup={handleSwitchToSignup} 
        />
      ) : (
        <SignupForm 
          onSignup={onAuthSuccess} 
          onSwitchToLogin={handleSwitchToLogin} 
        />
      )}
    </AuthLayout>
  );
};

export default AuthPage;
