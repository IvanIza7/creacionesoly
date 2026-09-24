import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { useStore } from '../../store/useStore';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const brandConfig = useStore(state => state.siteConfig.brand);
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccess(response.data.message || 'If the email is registered, we have sent a recovery link.');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error sending recovery email.');
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
        onClick={() => navigate('/login')} 
        className="absolute top-8 left-8 text-xs tracking-widest text-primary/60 hover:text-primary transition-colors flex items-center space-x-2"
      >
        <span>←</span> <span>BACK TO LOGIN</span>
      </button>

      <div className="w-full max-w-md text-center mb-8 flex flex-col items-center">
        {(brandConfig.displayMode === 'LOGO' || brandConfig.displayMode === 'BOTH') && brandConfig.logoUrl && (
          <img src={brandConfig.logoUrl} alt="Logo" className="h-12 object-contain mb-4" />
        )}
        {(brandConfig.displayMode === 'TEXT' || brandConfig.displayMode === 'BOTH') && (
          <h1 className="font-display text-4xl mb-4 tracking-widest uppercase text-primary">
            {brandConfig.name}
          </h1>
        )}
        <div className="w-12 h-[1px] bg-accent mx-auto mb-4"></div>
        <span className="text-xs tracking-[0.2em] text-primary/40 uppercase">Forgot Password</span>
      </div>

      <div className="bg-white border border-black/5 p-8 w-full max-w-md shadow-sm">
        {success ? (
          <div className="text-center space-y-4">
            <div className="text-green-600 text-sm font-serif italic mb-4">{success}</div>
            <p className="text-xs text-primary/60">Please check your inbox and spam folder.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-xs text-primary/60 text-center mb-6 leading-relaxed">
              Enter your email address and we will send you a link to reset your password safely.
            </p>

            <div>
              <label className="block text-[10px] tracking-widest text-primary/60 uppercase mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full bg-[#f9f9f9] border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-accent" 
              />
            </div>

            {error && <p className="text-red-500 text-xs mt-2 font-serif italic text-center">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white text-xs tracking-widest py-4 hover:bg-black transition-colors uppercase font-medium flex justify-center items-center mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Send Recovery Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
