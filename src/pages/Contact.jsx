import React from 'react';

const Contact = () => {
  return (
    <div className="flex-grow py-24 px-4 bg-[#2C2C2C] text-[#F9F6F0]">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-5xl font-bold mb-6 text-white">Get in touch</h2>
          <p className="opacity-80 font-serif mb-10 text-lg leading-relaxed">
            Have questions regarding submissions or journal policies? Reach out to our editorial office directly.
          </p>
          <div className="space-y-6 text-sm">
            <div className="flex items-start">
              <div className="mt-1 mr-4 text-[#8E7C68]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <div>
                <strong className="uppercase tracking-widest block mb-1 opacity-60 text-xs">Publisher</strong> 
                <span className="text-lg">Md Arif Uddin Mondal</span>
                <p className="text-sm opacity-80 mt-1">Assistant Professor, Department of Basic science and Humanities,<br/>Swami Vivekanand institute of Science and Technology</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mt-1 mr-4 text-[#8E7C68]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <strong className="uppercase tracking-widest block mb-1 opacity-60 text-xs">Email</strong> 
                <a href="mailto:khepaarif@gmail.com" className="text-lg hover:text-blue-300 transition-colors">khepaarif@gmail.com</a>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mt-1 mr-4 text-[#8E7C68]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </div>
              <div>
                <strong className="uppercase tracking-widest block mb-1 opacity-60 text-xs">Phone</strong> 
                <span className="text-lg">7980206261</span>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mt-1 mr-4 text-[#8E7C68]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <div>
                <strong className="uppercase tracking-widest block mb-1 opacity-60 text-xs">Address</strong> 
                <span className="text-lg">Vill- Nischintapur khodar bazar,<br/>Baruipur, West Bengal, Pin-70144</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-10 rounded-2xl border border-gray-200 text-[#2C2C2C] shadow-2xl">
           <form className="space-y-5">
             <div>
               <label className="block text-sm font-bold mb-2">Full Name</label>
               <input type="text" className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8E7C68] transition-shadow" placeholder="Jane Doe" />
             </div>
             <div>
               <label className="block text-sm font-bold mb-2">Email Address</label>
               <input type="email" className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8E7C68] transition-shadow" placeholder="jane@example.com" />
             </div>
             <div>
               <label className="block text-sm font-bold mb-2">Message</label>
               <textarea rows="4" className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8E7C68] transition-shadow" placeholder="How can we help you?"></textarea>
             </div>
             <button type="button" className="w-full py-4 bg-[#8E7C68] text-white font-bold rounded-lg hover:bg-[#737067] transition-colors shadow-md">Send Message</button>
           </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
