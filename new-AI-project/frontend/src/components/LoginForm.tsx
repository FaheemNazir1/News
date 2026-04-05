import React, { useState } from 'react';
import { LoginCredentials } from '../types/auth';
import { authService } from '../services/authService';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

interface LoginFormProps {
  onLogin: (user: any) => void;
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToSignup }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(credentials);
      authService.setAuth(response.token, response.user);
      onLogin(response.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-forensic-red rounded-xl p-4 flex items-center shadow-sm">
            <div className="text-forensic-red text-sm font-medium">{error}</div>
          </div>
        )}

        <div>
           <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <Mail className="h-5 w-5 text-gray-400" />
             </div>
             <input
              id="username"
              name="username"
              type="text"
              required
              value={credentials.username}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-forensic-blue focus:border-transparent transition-all outline-none font-medium placeholder-gray-400 shadow-sm"
              placeholder="Username"
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
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-forensic-blue focus:border-transparent transition-all outline-none font-medium placeholder-gray-400 shadow-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 text-forensic-blue focus:ring-forensic-blue border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-600 cursor-pointer">
              Remember me
            </label>
          </div>
          <span className="text-sm font-medium text-gray-400">
            Forgot password?
          </span>
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
              <span>Login</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-gray-200 pt-6">
        <p className="text-sm text-gray-500">
          Don’t have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-forensic-blue hover:text-blue-800 font-semibold transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>

      {/* Demo Info */}
      <div className="mt-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-bold">Standard Clearance:</p>
          <div className="flex space-x-4">
             <div className="font-mono text-sm text-gray-800 bg-gray-50 px-2 py-1 rounded">user: demo</div>
             <div className="font-mono text-sm text-gray-800 bg-gray-50 px-2 py-1 rounded">pass: demo123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
