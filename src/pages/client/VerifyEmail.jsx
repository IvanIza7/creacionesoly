import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('Verificando tu cuenta...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('El enlace de verificación no es válido o está incompleto.');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await api.get(`/auth/verify?token=${token}`);
        setStatus('success');
        setMessage(response.data.message || 'Cuenta verificada correctamente.');
        
        // Redirigir al login después de 4 segundos
        setTimeout(() => navigate('/login'), 4000);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Error al verificar la cuenta. El enlace pudo haber expirado.');
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 relative">
      <div className="w-full max-w-md bg-white border border-black/5 p-8 shadow-sm text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-accent mb-4" size={48} />
            <h2 className="text-xl font-display uppercase tracking-widest text-primary mb-2">Verificando</h2>
            <p className="text-sm text-gray-500 font-serif italic">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="text-green-500 mb-4" size={48} />
            <h2 className="text-xl font-display uppercase tracking-widest text-primary mb-2">¡Éxito!</h2>
            <p className="text-sm text-gray-500 font-serif italic mb-6">{message}</p>
            <p className="text-xs text-primary/40 uppercase tracking-widest">Serás redirigido al inicio de sesión...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-display uppercase tracking-widest text-primary mb-2">Error</h2>
            <p className="text-sm text-gray-500 font-serif italic mb-6">{message}</p>
            <Link 
              to="/login"
              className="text-xs tracking-widest text-white bg-primary hover:bg-black px-6 py-3 uppercase transition-colors"
            >
              Ir al Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
