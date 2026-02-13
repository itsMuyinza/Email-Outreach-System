
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', title }) => (
  <div className={`glass rounded-2xl p-6 transition-all duration-300 border border-white/5 hover:border-white/10 ${className}`}>
    {title && (
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center justify-between">
        {title}
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
      </h3>
    )}
    {children}
  </div>
);

export default GlassCard;
