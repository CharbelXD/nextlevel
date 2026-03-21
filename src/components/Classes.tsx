import { useEffect, useState } from 'react';
import { Clock, User, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Class } from '../types';

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  const whatsappNumber = "96181236519"; // change if needed

  const handleBookClass = (className: string) => {
    const message = `Hello, I want to book the ${className} class`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  useEffect(() => {
    async function fetchClasses() {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('created_at');

      if (!error && data) {
        setClasses(data);
      }
      setLoading(false);
    }

    fetchClasses();

    const subscription = supabase
      .channel('classes_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'classes' },
        () => {
          fetchClasses();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'text-green-400';
      case 'intermediate':
        return 'text-yellow-400';
      case 'advanced':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-black py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <div className="text-yellow-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div id="classes" className="bg-black py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4">
            OUR <span className="text-yellow-400">CLASSES</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto px-2">
            Expert-led classes designed to challenge and inspire you. From beginners
            to advanced athletes, we have something for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {classes.map((classItem, index) => (
            <div
              key={classItem.id}
              className="group relative bg-neutral-900 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-400/20"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`
              }}
            >
              <div className="relative h-40 md:h-64 overflow-hidden">
                <img
                  src={classItem.image_url}
                  alt={classItem.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent" />
                <div className="absolute top-3 right-3 md:top-4 md:right-4">
                  <span
                    className={`px-2 md:px-3 py-1 text-xs md:text-sm font-bold bg-black/80 backdrop-blur-sm ${getDifficultyColor(
                      classItem.difficulty
                    )}`}
                  >
                    {classItem.difficulty.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="p-4 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                  {classItem.name}
                </h3>
                <p className="text-gray-400 mb-3 md:mb-4 leading-relaxed text-sm md:text-base line-clamp-3">
                  {classItem.description}
                </p>

                <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <User className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                    <span className="truncate">Instructor: {classItem.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                    <span className="truncate">{classItem.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <TrendingUp className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                    <span>{classItem.difficulty} Level</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBookClass(classItem.name)}
                  className="mt-4 md:mt-6 w-full bg-yellow-400 text-black py-2 font-bold hover:bg-yellow-500 transition-all duration-300 group-hover:scale-105 text-sm md:text-base"
                >
                  BOOK CLASS
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}