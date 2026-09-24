import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Mail, Loader2, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  const fetchSubscribers = async (pageNum = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/newsletter?page=${pageNum}&limit=10`);
      setSubscribers(response.data.subscribers);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar la lista de suscriptores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers(page);
  }, [page]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-display mb-2">Newsletter Subscribers</h2>
        <p className="text-gray-500 text-sm">Correos registrados desde el pie de página.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-black/5 flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-black/5 flex items-center justify-between bg-[#F8F9FA]">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Mail size={16} />
            <span>Total: {pagination.total}</span>
          </div>
          <button 
            onClick={() => fetchSubscribers(page)} 
            disabled={loading}
            className="text-xs font-medium uppercase tracking-widest text-primary/60 hover:text-black transition-colors"
          >
            Actualizar
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto min-h-[200px]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20 text-red-500 text-sm">
              {error}
            </div>
          ) : subscribers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Mail size={48} className="mb-4 opacity-20" />
              <p>Aún no hay suscriptores registrados.</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#fcfcfc] text-xs uppercase tracking-widest text-gray-400 border-b border-black/5 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 font-medium">Correo Electrónico</th>
                      <th className="px-6 py-4 font-medium">Estado</th>
                      <th className="px-6 py-4 font-medium">Fecha de Registro</th>
                      <th className="px-6 py-4 font-medium text-right">Origen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {subscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{sub.email}</td>
                        <td className="px-6 py-4">
                          {sub.isActive ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle2 size={12} className="mr-1" /> Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle size={12} className="mr-1" /> Inactivo
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-500">{formatDate(sub.createdAt)}</td>
                        <td className="px-6 py-4 text-gray-400 text-right text-xs uppercase tracking-widest">{sub.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-black/5">
                {subscribers.map((sub) => (
                  <div key={sub.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900 truncate mr-2">{sub.email}</p>
                      {sub.isActive ? (
                        <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle2 size={10} className="mr-1" /> Activo
                        </span>
                      ) : (
                        <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle size={10} className="mr-1" /> Inactivo
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-gray-400">
                      <span>{formatDate(sub.createdAt)}</span>
                      <span>•</span>
                      <span className="uppercase tracking-widest">{sub.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination Footer */}
        {!loading && subscribers.length > 0 && (
          <div className="p-4 border-t border-black/5 flex items-center justify-between bg-white text-sm">
            <span className="text-gray-500 text-xs">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Subscribers;
