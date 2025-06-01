import React from 'react';
import { Smartphone } from 'lucide-react';

const Logo = ({ color = 'blue' }) => {
  const textColor = color === 'blue' ? 'text-blue-600' : 'text-white';
  
  return (
    <div className="flex items-center">
      <Smartphone 
        size={28} 
        className={`${color === 'blue' ? 'text-blue-600' : 'text-white'} mr-2`} 
      />
      <span className={`text-xl font-bold ${textColor}`}>
        Smart<span className="text-orange-500">Shop</span>
      </span>
    </div>
  );
};

export default Logo;