import React from 'react';
import { Mail, Smartphone } from 'lucide-react';

export const SubscribeSection = () => {
  return (
    <section className="bg-slate-900 text-white overflow-hidden relative py-20 lg:py-0">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2 py-10 lg:py-24 z-10">
            <h2 className="text-4xl lg:text-5xl font-serif mb-6 leading-tight">
              Subscribe and get 10% OFF <br/> on your first experience!
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-lg">
              Join our community of travelers and get exclusive access to hidden gems, secret spots, and curated experiences.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md">
              <div className="relative flex-grow">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button className="h-14 px-8 bg-[#FF4D4D] text-white font-semibold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-900/20 whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>

          {/* Visual Side (Mockup) */}
          <div className="hidden lg:flex w-1/2 justify-center relative h-[500px] items-end">
            {/* Abstract Background Shapes */}
            <div className="absolute bottom-0 right-0 w-full h-[80%] bg-gradient-to-t from-emerald-900/20 to-transparent rounded-t-full blur-3xl" />
            
            {/* Phone Mockup Placeholder (Using CSS shapes or SVG to simulate if no image, but better to use a generic phone frame style) */}
            <div className="relative z-10 w-[280px] h-[480px] bg-slate-800 rounded-[3rem] border-8 border-slate-700 shadow-2xl overflow-hidden transform translate-y-12">
               {/* Screen Content */}
               <div className="w-full h-full bg-white relative">
                  <div className="absolute top-0 w-full h-24 bg-slate-100 p-6 flex flex-col justify-end">
                      <div className="h-4 w-24 bg-slate-200 rounded mb-2"/>
                      <div className="h-2 w-16 bg-slate-200 rounded"/>
                  </div>
                  <div className="p-6">
                      <div className="h-32 w-full bg-slate-100 rounded-xl mb-4" />
                      <div className="h-4 w-full bg-slate-100 rounded mb-2" />
                      <div className="h-4 w-2/3 bg-slate-100 rounded" />
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
