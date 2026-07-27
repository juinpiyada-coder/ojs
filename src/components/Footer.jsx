import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#1E2530] text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center space-y-2 text-[15px]">
        <p>
          <strong className="font-bold">Publisher:</strong> Prof. (Dr.)Chandrava Chakravarty (Editor)
        </p>
        <p>
          <strong className="font-bold">Publisher Designation:</strong> Professor,  Department of English, West Bengal State University
        </p>
        <p>
          <strong className="font-bold">Publisher's Address:</strong> Berunanpukuria, P.O. Malikapur, Barasat, North 24 Parganas, WB, PIN 700126
        </p>
        <p>
          <strong className="font-bold">Contact :</strong> 9831953239 <span className="mx-2">|</span> 
          <strong className="font-bold">Email ID:</strong> <a href="mailto:chandrava09@gmail.com" className="hover:text-blue-300 transition-colors">chandrava09@gmail.com</a>
        </p>
        <p className="pt-2 text-[15px]">
          Copyright &copy; 2026 literaria <span className="mx-2">|</span> Developed by <span className="text-gray-400">GlobeForge</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
