import React, { useState } from 'react';
import { SignupCredentials } from '../types/auth';
import { authService } from '../services/authService';
import { User, Mail, Lock, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

interface SignupFormProps {
  onSignup: (user: any) => void;
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onSwitchToLogin }) => {
  const [credentials, setCredentials] = useState<SignupCredentials>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (credentials.password !== credentials.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (credentials.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.signup(credentials);
      authService.setAuth(response.token, response.user);
      onSignup(response.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-forensic-red rounded-xl p-4 flex items-center shadow-sm">
            <div className="text-forensic-red text-sm font-medium">{error}</div>
          </div>
        )}

        <div>
           <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <User className="h-5 w-5 text-gray-400" />
             </div>
             <input
              id="username"
              name="username"
              type="text"
              required
              value={credentials.username}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-forensic-blue focus:border-transparent transition-all outline-none font-medium placeholder-gray-400 shadow-sm text-sm"
              placeholder="Username"
            />
          </div>
        </div>

        <div>
           <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <Mail className="h-5 w-5 text-gray-400" />
             </div>
             <input
              id="email"
              name="email"
              type="email"
              required
              value={credentials.email}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-forensic-blue focus:border-transparent transition-all outline-none font-medium placeholder-gray-400 shadow-sm text-sm"
              placeholder="Email"
            />
          </div>
        </div>

        <div>
           <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <Lock className="h-5 w-5 text-gray-400" />
             </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={credentials.password}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-forensic-blue focus:border-transparent transition-all outline-none font-medium placeholder-gray-400 shadow-sm text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
           <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <ShieldCheck className="h-5 w-5 text-gray-400" />
             </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={credentials.confirmPassword}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-forensic-blue focus:border-transparent transition-all outline-none font-medium placeholder-gray-400 shadow-sm text-sm"
              placeholder="Confirm password"
            />
          </div>
        </div>

        <div className="flex items-start mt-2 pt-2">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 text-forensic-blue focus:ring-forensic-blue border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-600 leading-tight cursor-pointer">
            I agree to the <span className="font-semibold text-gray-700">Terms</span>.
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-forensic-dark text-white py-3.5 px-4 rounded-xl hover:bg-forensic-darker focus:ring-2 focus:ring-forensic-dark focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg flex justify-center items-center space-x-2"
        >
          {loading ? (
             <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Sign up</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-gray-200 pt-6">
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-forensic-blue hover:text-blue-800 font-semibold transition-colors"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
