import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { useStore } from '../../store/useStore';
import api from '../../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const brandConfig = useStore(state => state.siteConfig.brand);
  const login = useStore(state => state.login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.user);
      
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/'); // Redirigir al cliente al catálogo
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Invalid credentials');
      } else {
        setError('Connection error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 relative">
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-8 left-8 text-xs tracking-widest text-primary/60 hover:text-primary transition-colors flex items-center space-x-2"
      >
        <span>←</span> <span>BACK</span>
      </button>

      <div className="w-full max-w-md text-center mb-12 flex flex-col items-center">
        {(brandConfig.displayMode === 'LOGO' || brandConfig.displayMode === 'BOTH') && brandConfig.logoUrl && (
          <img src={brandConfig.logoUrl} alt="Logo" width="160" height="48" className="h-12 w-auto object-contain mb-4" />
        )}
        {(brandConfig.displayMode === 'TEXT' || brandConfig.displayMode === 'BOTH') && (
          <h1 className="font-display text-4xl mb-4 tracking-widest uppercase text-primary">
            {brandConfig.name}
          </h1>
        )}
        <div className="w-12 h-[1px] bg-accent mx-auto mb-4"></div>

        <span className="text-xs tracking-[0.2em] text-primary/40 uppercase">Sign In</span>
      </div>

      <div className="bg-white border border-black/5 p-8 w-full max-w-md shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-[10px] tracking-widest text-primary/60 uppercase mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#f9f9f9] border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all" 
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest text-primary/60 uppercase mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full bg-[#f9f9f9] border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-2 font-serif italic">{error}</p>}
            <div className="flex justify-end mt-2">
              <Link to="/forgot-password" className="text-[10px] tracking-widest text-primary/60 hover:text-primary uppercase transition-colors">
                Forgot your password?
              </Link>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white text-xs tracking-widest py-4 hover:bg-black transition-colors uppercase font-medium flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Sign In'}
          </button>
          
          <div className="text-center mt-6">
            <Link to="/register" className="text-[10px] tracking-widest text-primary/60 hover:text-primary uppercase transition-colors">
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
