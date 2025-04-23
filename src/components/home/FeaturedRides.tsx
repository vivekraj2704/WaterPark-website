import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Ride {
  _id: string;
  name: string;
  description: string;
  image: string;
  thrillLevel: 'Mild' | 'Moderate' | 'High' | 'Extreme';
}

const FeaturedRides: React.FC = () => {
  // This would come from an API in a real app
  const featuredRides: Ride[] = [
    {
      _id: '1',
      name: 'Tsunami Twister',
      description: 'A heart-pounding 360-degree loop that sends you spiraling through a massive funnel.',
      image: 'https://images.pexels.com/photos/7541299/pexels-photo-7541299.jpeg?auto=compress&cs=tinysrgb&w=1600',
      thrillLevel: 'Extreme'
    },
    {
      _id: '2',
      name: 'River Rapids',
      description: 'Cruise down our lazy river with unexpected rapids and beautiful scenery.',
      image: 'https://images.pexels.com/photos/7456112/pexels-photo-7456112.jpeg?auto=compress&cs=tinysrgb&w=1600',
      thrillLevel: 'Moderate'
    },
    {
      _id: '3',
      name: 'Wave Pool Paradise',
      description: 'Experience the ocean without the sharks in our massive wave pool.',
      image: 'https://images.pexels.com/photos/6858673/pexels-photo-6858673.jpeg?auto=compress&cs=tinysrgb&w=1600',
      thrillLevel: 'Mild'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
            Featured Attractions
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our most popular rides and attractions that guarantee an unforgettable experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRides.map((ride) => (
            <div 
              key={ride._id}
              className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105"
            >
              <div className="h-60 overflow-hidden">
                <img 
                  src={ride.image} 
                  alt={ride.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{ride.name}</h3>
                  <span 
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ride.thrillLevel === 'Mild' ? 'bg-green-100 text-green-800' :
                      ride.thrillLevel === 'Moderate' ? 'bg-blue-100 text-blue-800' :
                      ride.thrillLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {ride.thrillLevel}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{ride.description}</p>
                <Link
                  to={`/rides/${ride._id}`}
                  className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
                >
                  Learn More <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/rides"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition duration-300 ease-in-out"
          >
            View All Attractions <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRides;