import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#1E2530] text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center space-y-2 text-[15px]">
        <p>
          <strong className="font-bold">Publisher:</strong> Md Arif Uddin Mondal
        </p>
        <p>
          <strong className="font-bold">Publisher Designation:</strong> Assistant Professor, Department of Basic science and Humanities, Swami Vivekanand institute of Science and Technology
        </p>
        <p>
          <strong className="font-bold">Publisher Address:</strong> Vill- Nischintapur khodar bazar, Baruipur, West Bengal, Pin-70144
        </p>
        <p>
          <strong className="font-bold">Contact:</strong> 7980206261 <span className="mx-2">|</span> 
          <strong className="font-bold">Email ID:</strong> <a href="mailto:khepaarif@gmail.com" className="hover:text-blue-300 transition-colors">khepaarif@gmail.com</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
