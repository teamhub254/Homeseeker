
import { useEffect, useState } from 'react';

const Statistics = () => {
  const stats = [
    {
      target: 3500,
      label: "Properties Listed"
    },
    {
      target: 2900,
      label: "Happy Customers"
    },
    {
      target: 15,
      label: "Cities Covered"
    }
  ];

  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const animationDuration = 2000; // 2 seconds
    const steps = 50;
    const intervals = stats.map((stat, index) => {
      const increment = stat.target / steps;
      return setInterval(() => {
        setCounts(prev => {
          const newCounts = [...prev];
          if (newCounts[index] < stat.target) {
            newCounts[index] = Math.min(
              Math.ceil(newCounts[index] + increment),
              stat.target
            );
          }
          return newCounts;
        });
      }, animationDuration / steps);
    });

    return () => intervals.forEach(interval => clearInterval(interval));
  }, []);

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Perfect Home?</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Join thousands of satisfied customers who found their dream properties through Habix.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-[#1E1E30] border border-gray-800 rounded-xl p-8 text-center"
            >
              <div className="text-habix-purple text-4xl md:text-5xl font-bold mb-2">
                {counts[index].toLocaleString()}+
              </div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
