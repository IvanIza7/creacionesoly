import React from 'react';

export const TextInputWithCount = ({ label, value, onChange, maxLength, type = 'text', ...props }) => {
  const remaining = maxLength - (value ? value.length : 0);
  return (
    <div>
      <label className="flex justify-between items-end mb-2">
        <span className="block text-[10px] tracking-widest text-primary/60 uppercase">{label}</span>
        <span className={`text-[10px] tracking-widest ${remaining <= 10 ? 'text-red-500 font-bold' : 'text-primary/40'}`}>
          {remaining} restantes
        </span>
      </label>
      <input 
        type={type}
        value={value} 
        onChange={(e) => onChange(e.target.value.substring(0, maxLength))} 
        maxLength={maxLength}
        className="w-full bg-white border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-accent" 
        {...props}
      />
    </div>
  );
};

export const TextAreaWithCount = ({ label, value, onChange, maxLength, ...props }) => {
  const remaining = maxLength - (value ? value.length : 0);
  return (
    <div>
      <label className="flex justify-between items-end mb-2">
        <span className="block text-[10px] tracking-widest text-primary/60 uppercase">{label}</span>
        <span className={`text-[10px] tracking-widest ${remaining <= 20 ? 'text-red-500 font-bold' : 'text-primary/40'}`}>
          {remaining} restantes
        </span>
      </label>
      <textarea 
        value={value} 
        onChange={(e) => onChange(e.target.value.substring(0, maxLength))} 
        maxLength={maxLength}
        className="w-full bg-white border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-accent" 
        {...props}
      />
    </div>
  );
};
