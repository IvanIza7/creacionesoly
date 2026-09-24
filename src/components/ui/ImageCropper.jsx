import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../utils/cropImage';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const ImageCropper = ({ 
  aspectRatio = 1, // 1 para cuadrados (productos), 16/9 para hero
  onUploadSuccess, 
  currentImageUrl,
  label = "Subir Imagen"
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validación básica en frontend
      if (file.size > 2 * 1024 * 1024) {
        setError('La imagen es demasiado pesada. Máximo 2MB.');
        return;
      }
      
      setError('');
      let imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setIsCropping(true);
      // Reset input
      e.target.value = '';
    }
  };

  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      setError('');
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      const formData = new FormData();
      formData.append('image', croppedBlob, 'cropped-image.jpg');

      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onUploadSuccess(response.data.url);
      setIsCropping(false);
      setImageSrc(null);
    } catch (e) {
      console.error(e);
      if (e.response && e.response.data) {
        setError(e.response.data.message);
      } else {
        setError('Error al subir la imagen.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-[10px] tracking-widest text-primary/60 uppercase mb-2">{label}</label>
      
      <div className="flex items-center space-x-4">
        {currentImageUrl && !isCropping && (
          <img src={currentImageUrl} alt="Current" className="w-16 h-16 object-cover border border-black/10" />
        )}
        
        <label className="cursor-pointer bg-[#f9f9f9] border border-black/10 px-4 py-3 text-sm flex items-center justify-center hover:bg-black/5 transition-colors flex-1">
          <UploadCloud size={18} className="mr-2 text-primary/60" />
          <span className="text-primary/60 uppercase tracking-widest text-[10px]">Elegir Archivo</span>
          <input 
            type="file" 
            accept="image/jpeg, image/png, image/webp" 
            onChange={onFileChange} 
            className="hidden" 
          />
        </label>
      </div>

      {error && <p className="text-red-500 text-xs mt-2 italic font-serif">{error}</p>}

      {isCropping && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10">
          <div className="bg-white p-6 w-full max-w-2xl flex flex-col h-[80vh] shadow-2xl relative">
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm tracking-widest uppercase font-medium">Ajustar Imagen</h3>
              <button 
                onClick={() => setIsCropping(false)}
                className="text-gray-500 hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative flex-1 bg-gray-100 overflow-hidden border border-black/5">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="mt-6 flex flex-col space-y-4">
              <div>
                <label className="text-[10px] tracking-widest uppercase text-primary/60 mb-2 block">Zoom</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-full accent-black"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsCropping(false)}
                  className="px-4 py-2 border border-black/10 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="px-6 py-2 bg-primary text-white text-xs tracking-widest uppercase flex items-center hover:bg-black transition-colors"
                >
                  {isUploading ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
                  {isUploading ? 'Subiendo...' : 'Recortar y Subir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
