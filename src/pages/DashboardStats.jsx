// src/components/dashboard/DashboardStats.jsx
export default function DashboardStats({ stats }) {
   return (
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
       {stats.map((stat, index) => (
         <div key={index} className="bg-white shadow rounded-lg p-6">
           <div className="flex items-center">
             <div className="bg-indigo-100 rounded-lg p-3 mr-4">
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 className="h-6 w-6 text-indigo-600"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
               >
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
               </svg>
             </div>
             <div>
               <p className="text-sm font-medium text-gray-600">{stat.label}</p>
               <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
             </div>
           </div>
           <div className="mt-4">
             <p className="text-xs font-medium text-green-600 flex items-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
               </svg>
               {stat.change} from last month
             </p>
           </div>
         </div>
       ))}
     </div>
   );
 }