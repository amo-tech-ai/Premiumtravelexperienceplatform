import React from 'react';
import { Button } from '../components/ui/button';

export default function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
        
        {/* HERO */}
        <div className="pt-32 pb-16 container mx-auto px-6 lg:px-12 border-b border-slate-100">
            <h1 className="text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-6 tracking-tight">
                I Love Medellín — Design System
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl font-light leading-relaxed">
                A premium, intelligent design language for high-end AI interfaces. 
                Focused on clarity, subtle interactions, and deep luxury aesthetics.
            </p>
        </div>

        {/* 1. COLORS */}
        <section className="py-20 container mx-auto px-6 lg:px-12 border-b border-slate-100">
            <h2 className="text-3xl font-serif font-bold mb-12 text-slate-900">Color Palette</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                
                {/* Emerald 900 */}
                <div className="group">
                    <div className="h-48 rounded-2xl bg-[#064E3B] shadow-sm mb-4 transition-transform group-hover:scale-[1.02] duration-300"></div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-900">Emerald 900</h3>
                        <code className="text-xs text-slate-400 font-mono block mb-2">#064E3B (Tailwind)</code>
                        <p className="text-sm text-slate-500 leading-relaxed">Primary Brand / Hero Backgrounds / Primary Actions</p>
                    </div>
                </div>

                 {/* Emerald 500 */}
                 <div className="group">
                    <div className="h-48 rounded-2xl bg-[#10B981] shadow-sm mb-4 transition-transform group-hover:scale-[1.02] duration-300"></div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-900">Emerald 500</h3>
                        <code className="text-xs text-slate-400 font-mono block mb-2">#10B981 (Tailwind)</code>
                        <p className="text-sm text-slate-500 leading-relaxed">Interactive Elements / Success States</p>
                    </div>
                </div>

                {/* Amber 400 */}
                <div className="group">
                    <div className="h-48 rounded-2xl bg-[#FBBF24] shadow-sm mb-4 transition-transform group-hover:scale-[1.02] duration-300"></div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-900">Amber 400</h3>
                        <code className="text-xs text-slate-400 font-mono block mb-2">#FBBF24 (Tailwind)</code>
                        <p className="text-sm text-slate-500 leading-relaxed">Gold Accents / Ratings / Highlights</p>
                    </div>
                </div>

                 {/* Slate 900 */}
                 <div className="group">
                    <div className="h-48 rounded-2xl bg-[#0F172A] shadow-sm mb-4 transition-transform group-hover:scale-[1.02] duration-300"></div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-900">Slate 900</h3>
                        <code className="text-xs text-slate-400 font-mono block mb-2">#0F172A (Tailwind)</code>
                        <p className="text-sm text-slate-500 leading-relaxed">Primary Headings / Text</p>
                    </div>
                </div>

            </div>
        </section>

        {/* 2. TYPOGRAPHY */}
        <section className="py-20 container mx-auto px-6 lg:px-12 border-b border-slate-100">
            <h2 className="text-3xl font-serif font-bold mb-12 text-slate-900">Typography</h2>
            
            <div className="grid lg:grid-cols-2 gap-20">
                <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-6 block">Headings (Serif)</span>
                    <div className="space-y-10">
                        <div className="border-b border-slate-100 pb-8">
                            <h1 className="text-6xl font-serif font-bold text-slate-900 mb-4">H1. Luxury Redefined</h1>
                            <div className="flex gap-4 text-xs text-slate-400 font-mono">
                                <span>Font: Playfair Display</span>
                                <span>Weight: Bold</span>
                                <span>Size: 6xl</span>
                            </div>
                        </div>
                        <div className="border-b border-slate-100 pb-8">
                            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">H2. Concierge Experience</h2>
                            <div className="flex gap-4 text-xs text-slate-400 font-mono">
                                <span>Font: Playfair Display</span>
                                <span>Weight: Bold</span>
                                <span>Size: 4xl</span>
                            </div>
                        </div>
                        <div className="border-b border-slate-100 pb-8">
                            <h3 className="text-3xl font-serif font-medium text-slate-900 mb-4">H3. Elegant Stays</h3>
                            <div className="flex gap-4 text-xs text-slate-400 font-mono">
                                <span>Font: Playfair Display</span>
                                <span>Weight: Medium</span>
                                <span>Size: 3xl</span>
                            </div>
                        </div>
                         <div>
                            <h4 className="text-xl font-serif font-medium text-slate-900 mb-4">H4. Section Title</h4>
                            <div className="flex gap-4 text-xs text-slate-400 font-mono">
                                <span>Font: Playfair Display</span>
                                <span>Weight: Medium</span>
                                <span>Size: xl</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-6 block">Body (Sans)</span>
                    <div className="space-y-10">
                        <div className="border-b border-slate-100 pb-8">
                            <p className="text-xl text-slate-600 mb-4 leading-relaxed">
                                Body Large. Used for introductions and lead paragraphs. The quick brown fox jumps over the lazy dog.
                            </p>
                            <div className="flex gap-4 text-xs text-slate-400 font-mono">
                                <span>Font: Inter</span>
                                <span>Size: xl</span>
                            </div>
                        </div>
                        <div className="border-b border-slate-100 pb-8">
                            <p className="text-base text-slate-600 leading-relaxed mb-4">
                                Body Default. This is the standard text size for most content blocks. It is optimized for readability with relaxed line height. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            </p>
                            <div className="flex gap-4 text-xs text-slate-400 font-mono">
                                <span>Font: Inter</span>
                                <span>Size: base</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-4">
                                Caption / Small. Used for metadata, timestamps, and secondary information.
                            </p>
                            <div className="flex gap-4 text-xs text-slate-400 font-mono">
                                <span>Font: Inter</span>
                                <span>Size: sm</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 3. RESPONSIVE BREAKPOINTS */}
        <section className="py-20 container mx-auto px-6 lg:px-12 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-3xl font-serif font-bold mb-12 text-slate-900">Responsive Layouts</h2>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="h-40 bg-slate-100 rounded-lg mb-6 flex items-center justify-center">
                        <div className="w-8 h-16 border-2 border-slate-300 rounded-md bg-white"></div>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Mobile First</h3>
                    <p className="text-sm text-slate-500 mb-4">Default styles target mobile viewports.</p>
                    <code className="text-xs bg-slate-100 p-1 rounded">w-full px-4 flex-col</code>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                     <div className="h-40 bg-slate-100 rounded-lg mb-6 flex items-center justify-center">
                        <div className="w-16 h-20 border-2 border-slate-300 rounded-md bg-white"></div>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Tablet (md)</h3>
                    <p className="text-sm text-slate-500 mb-4">Grid layouts begin to form. Navigation condenses.</p>
                    <code className="text-xs bg-slate-100 p-1 rounded">md:grid-cols-2 md:px-8</code>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                     <div className="h-40 bg-slate-100 rounded-lg mb-6 flex items-center justify-center">
                        <div className="w-32 h-20 border-2 border-slate-300 rounded-md bg-white flex gap-1 p-1">
                             <div className="w-1/4 bg-slate-100 h-full"></div>
                             <div className="w-3/4 bg-slate-100 h-full"></div>
                        </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Desktop (lg)</h3>
                    <p className="text-sm text-slate-500 mb-4">Full sidebar navigation, generous whitespace.</p>
                    <code className="text-xs bg-slate-100 p-1 rounded">lg:grid-cols-4 lg:px-12</code>
                </div>
            </div>
        </section>

        {/* 4. DASHBOARD & UI PATTERNS */}
        <section className="py-20 container mx-auto px-6 lg:px-12 border-b border-slate-100">
             <h2 className="text-3xl font-serif font-bold mb-12 text-slate-900">UI Patterns</h2>
             
             <div className="space-y-20">
                {/* Chatbot Pattern */}
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4 block">Chatbot Interface</span>
                        <h3 className="text-2xl font-serif font-bold mb-4">Conversational Concierge</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            The primary interaction mode is chat-first. AI responses are presented in clean, white cards with "emerald" verification badges. User messages use the "Soft Cream" (Amber-50) background to distinguish them clearly.
                        </p>
                        <div className="flex gap-2">
                             <span className="px-3 py-1 bg-slate-100 text-xs font-medium rounded-full text-slate-600">Motion: Spring</span>
                             <span className="px-3 py-1 bg-slate-100 text-xs font-medium rounded-full text-slate-600">Feedback: Typing Dots</span>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                         {/* AI Message */}
                         <div className="flex w-full mb-6 justify-start">
                            <div className="flex max-w-[90%] flex-row items-end gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-emerald-50 border border-emerald-100">
                                    <span className="text-emerald-700 font-serif font-bold text-xs">AI</span>
                                </div>
                                <div className="relative px-6 py-4 rounded-2xl text-sm leading-relaxed shadow-sm flex flex-col bg-white text-slate-600 rounded-bl-none border border-slate-100">
                                    <span className="text-xs font-bold text-emerald-700 mb-1 block">Concierge</span>
                                    <div className="font-normal text-[15px]">
                                        Here are the top-rated luxury stays in El Poblado available for your dates.
                                    </div>
                                </div>
                            </div>
                         </div>
                         {/* User Message */}
                         <div className="flex w-full mb-0 justify-end">
                            <div className="flex max-w-[90%] flex-row-reverse items-end gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-slate-200">
                                    <span className="text-xs font-medium text-slate-600">ME</span>
                                </div>
                                <div className="relative px-6 py-4 rounded-2xl text-sm leading-relaxed shadow-sm flex flex-col bg-[#FFFBEB] text-slate-800 rounded-br-none border border-amber-100/50">
                                    <div className="font-normal text-[15px]">
                                        Excellent. Book the penthouse for 3 nights.
                                    </div>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>

                {/* Dashboard / Cards Pattern */}
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                     <div className="order-2 lg:order-1 bg-slate-50 p-8 rounded-2xl border border-slate-200">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden max-w-sm mx-auto">
                            <div className="h-40 bg-slate-200 relative">
                                <div className="absolute inset-0 bg-slate-800/10"></div>
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-emerald-800 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                    4.9
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="font-serif text-xl text-slate-900 mb-2">El Cielo</h4>
                                <p className="text-sm text-slate-500 mb-4">Modern Colombian • Fine Dining</p>
                                <div className="flex items-center text-emerald-700 font-medium text-sm">
                                    View Details <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4 block">Dashboard Components</span>
                        <h3 className="text-2xl font-serif font-bold mb-4">Luxury Cards</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Cards use generous padding, subtle shadows (`shadow-xl`), and rounded corners (`rounded-2xl`) to evoke a premium feel. Images are treated with high quality.
                        </p>
                        <div className="flex gap-2">
                             <span className="px-3 py-1 bg-slate-100 text-xs font-medium rounded-full text-slate-600">Shadow: Luxury</span>
                             <span className="px-3 py-1 bg-slate-100 text-xs font-medium rounded-full text-slate-600">Border: Slate-100</span>
                        </div>
                    </div>
                </div>
             </div>
        </section>

        {/* 5. MARKETING & TYPOGRAPHY SCALES */}
        <section className="py-20 container mx-auto px-6 lg:px-12">
             <h2 className="text-3xl font-serif font-bold mb-12 text-slate-900">Marketing & Content</h2>
             <div className="grid md:grid-cols-2 gap-12">
                 <div>
                     <h3 className="font-bold text-lg mb-4">Landing Page Header</h3>
                     <div className="bg-emerald-900 text-white p-8 rounded-2xl text-center">
                         <h2 className="text-3xl font-serif font-bold mb-2">Experience Medellín</h2>
                         <p className="text-emerald-100/80 font-light">Curated luxury, powered by intelligence.</p>
                         <button className="mt-6 px-6 py-2 bg-white text-emerald-900 rounded-full text-sm font-medium">Get Started</button>
                     </div>
                 </div>
                 <div>
                     <h3 className="font-bold text-lg mb-4">Content Article</h3>
                     <div className="bg-white border border-slate-100 p-8 rounded-2xl">
                         <h2 className="text-2xl font-serif font-bold mb-2 text-slate-900">The Coffee Culture</h2>
                         <p className="text-slate-500 text-sm mb-4">By Concierge Team • 5 min read</p>
                         <p className="text-slate-600 text-sm leading-relaxed">
                             Medellín's coffee scene is world-renowned. From the hills of Antioquia to the cafes of El Poblado...
                         </p>
                     </div>
                 </div>
             </div>
        </section>
    </div>
  );
}

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
);
