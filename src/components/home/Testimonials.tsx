import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  text: string;
}

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&w=600',
      rating: 5,
      text: 'Our family had the best day ever at Splash Adventure! The kids couldn\'t get enough of the water slides, and the staff was incredibly friendly. We\'ll definitely be coming back next summer!'
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4,
      text: 'Great variety of rides for all ages. The wave pool was my favorite! Food was pretty good too, better than most amusement parks I\'ve been to.'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      avatar: 'https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 5,
      text: 'We celebrated my son\'s birthday here and it couldn\'t have been better. The birthday package was worth every penny. The kids had a blast and the parents could relax. Highly recommend!'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={18}
        fill={index < rating ? 'currentColor' : 'none'}
        className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  return (
    <section className="py-20 bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            What Our Visitors Say
          </h2>
          <p className="mt-4 text-xl text-primary-200 max-w-3xl mx-auto">
            Don't just take our word for it. Hear from families who have experienced the magic of Splash Adventure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-primary-800 rounded-xl p-6 shadow-xl"
            >
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-medium">{testimonial.name}</h3>
                  <div className="flex mt-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              <p className="text-primary-100 italic">"{testimonial.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;