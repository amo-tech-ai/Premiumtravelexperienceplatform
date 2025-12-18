import React from 'react';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { TrendingUp, ArrowUpRight, DollarSign } from 'lucide-react';

const PRICE_DATA = [
  { year: '2019', medellin: 2500, poblado: 4200 },
  { year: '2020', medellin: 2650, poblado: 4400 },
  { year: '2021', medellin: 2800, poblado: 4900 },
  { year: '2022', medellin: 3100, poblado: 5600 },
  { year: '2023', medellin: 3450, poblado: 6200 },
  { year: '2024', medellin: 3800, poblado: 7100 },
];

const YIELD_DATA = [
  { name: 'El Poblado', yield: 8.5 },
  { name: 'Laureles', yield: 7.2 },
  { name: 'Envigado', yield: 6.8 },
  { name: 'Sabaneta', yield: 6.5 },
  { name: 'Belen', yield: 7.8 },
];

export const MarketInsights = () => {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 text-emerald-800 text-sm font-medium mb-4 border border-emerald-200/50">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Market Intelligence</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif text-slate-900 mb-4">Medellín Market Trends</h2>
            <p className="text-slate-600 max-w-xl text-lg">
              Data-driven insights to help you identify high-growth opportunities and maximize rental yields.
            </p>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="flex gap-4"
          >
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 min-w-[160px]">
                <div className="text-sm text-slate-500 mb-1">Avg. Appreciation</div>
                <div className="text-2xl font-bold text-emerald-700 flex items-center gap-1">
                    +12.4% <ArrowUpRight className="w-4 h-4" />
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 min-w-[160px]">
                <div className="text-sm text-slate-500 mb-1">Avg. Rental Yield</div>
                <div className="text-2xl font-bold text-slate-900 flex items-center gap-1">
                    8.2% <span className="text-xs text-slate-400 font-normal self-end mb-1">p.a.</span>
                </div>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Chart 1: Price Trends */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-slate-100"
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-serif text-slate-900">Price per m² (USD)</h3>
                    <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-1.5 outline-none focus:border-emerald-500 text-slate-600">
                        <option>Last 5 Years</option>
                        <option>Last 10 Years</option>
                    </select>
                </div>
                
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={PRICE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorPoblado" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#065f46" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#065f46" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorMedellin" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="year" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#64748b', fontSize: 12 }} 
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#64748b', fontSize: 12 }} 
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#1e293b' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Area 
                                type="monotone" 
                                dataKey="poblado" 
                                name="El Poblado"
                                stroke="#065f46" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorPoblado)" 
                            />
                            <Area 
                                type="monotone" 
                                dataKey="medellin" 
                                name="Medellín Avg"
                                stroke="#94a3b8" 
                                strokeWidth={3}
                                strokeDasharray="5 5"
                                fillOpacity={1} 
                                fill="url(#colorMedellin)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Chart 2: Rental Yields */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-slate-100"
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-serif text-slate-900">Avg. Airbnb Rental Yield</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <span>Net ROI</span>
                    </div>
                </div>
                
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={YIELD_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} layout="vertical">
                             <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                             <XAxis type="number" hide />
                             <YAxis 
                                dataKey="name" 
                                type="category" 
                                axisLine={false} 
                                tickLine={false}
                                width={100}
                                tick={{ fill: '#334155', fontSize: 13, fontWeight: 500 }}
                             />
                             <Tooltip 
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                             />
                             <Bar 
                                dataKey="yield" 
                                name="Yield %"
                                fill="#10b981" 
                                radius={[0, 6, 6, 0]} 
                                barSize={32}
                                activeBar={{ fill: '#047857' }}
                             >
                             </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
};
