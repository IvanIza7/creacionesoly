import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { useStore } from '../../store/useStore';

const Register = () => {
  const navigate = useNavigate();
  const brandConfig = useStore(state => state.siteConfig.brand);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (password.length < 12) {
      setError('Password must be at least 12 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/auth/register', { name, email, password });
      setSuccess(response.data.message || 'Registration successful. Check your email.');
      // Opcional: Redirigir al login después de unos segundos
      setTimeout(() => navigate('/login'), 4000);
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.errors && err.response.data.errors.length > 0) {
          setError(err.response.data.errors[0].message);
        } else {
          setError(err.response.data.message || 'Error registering user.');
        }
      } else {
        setError('Server connection error.');
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
        <span>←</span> <span>VOLVER</span>
      </button>

      <div className="w-full max-w-md text-center mb-8 flex flex-col items-center">
        {(brandConfig.displayMode === 'LOGO' || brandConfig.displayMode === 'BOTH') && brandConfig.logoUrl && (
          <img src={brandConfig.logoUrl} alt="Logo" width="160" height="48" className="h-12 w-auto object-contain mb-4" />
        )}
        {(brandConfig.displayMode === 'TEXT' || brandConfig.displayMode === 'BOTH') && (
          <h1 className="font-display text-4xl mb-4 tracking-widest uppercase text-primary">
            {brandConfig.name}
          </h1>
        )}
        <div className="w-12 h-[1px] bg-accent mx-auto mb-4"></div>
        <span className="text-xs tracking-[0.2em] text-primary/40 uppercase">Create Account</span>
      </div>

      <div className="bg-white border border-black/5 p-8 w-full max-w-md shadow-sm">
        {success ? (
          <div className="text-center space-y-4">
            <div className="text-green-600 text-sm font-serif italic mb-4">{success}</div>
            <Link to="/login" className="text-xs tracking-widest text-primary hover:text-accent uppercase">
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label className="block text-[10px] tracking-widest text-primary/60 uppercase mb-2">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#f9f9f9] border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-accent" 
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-widest text-primary/60 uppercase mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f9f9f9] border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-accent" 
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-widest text-primary/60 uppercase mb-2">Password (Min. 12 chars)</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
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
            </div>

            <div>
              <label className="block text-[10px] tracking-widest text-primary/60 uppercase mb-2">Confirm Password</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                className="w-full bg-[#f9f9f9] border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-accent" 
              />
            </div>

            {error && <p className="text-red-500 text-xs mt-2 font-serif italic text-center">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white text-xs tracking-widest py-4 hover:bg-black transition-colors uppercase font-medium flex justify-center items-center mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Sign Up'}
            </button>
            
            <div className="text-center mt-6">
              <Link to="/login" className="text-[10px] tracking-widest text-primary/60 hover:text-primary uppercase transition-colors">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
