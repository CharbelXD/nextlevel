import { useEffect, useState } from 'react';
import { Clock, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { ClassSchedule } from '../types';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const COLORS: { [key: string]: string } = {
  'Beginner': 'border-l-4 border-l-green-400',
  'Intermediate': 'border-l-4 border-l-yellow-400',
  'Advanced': 'border-l-4 border-l-red-400',
};

export default function Schedule() {
  const [schedule, setSchedule] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchedule() {
      const { data } = await supabase
        .from('class_schedule')
        .select(`
          *,
          classes:class_id (name, image_url, difficulty)
        `)
        .order('day_of_week')
        .order('start_time');

      if (data) {
        setSchedule(data);
      }
      setLoading(false);
    }

    fetchSchedule();

    const subscription = supabase
      .channel('class_schedule_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'class_schedule' },
        (payload) => {
          console.log('Schedule change received:', payload);
          fetchSchedule();
        }
      )
      .subscribe((status) => {
        console.log('Schedule subscription status:', status);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const groupByDay = () => {
    const grouped: { [key: number]: ClassSchedule[] } = {};
    schedule.forEach((item) => {
      if (!grouped[item.day_of_week]) {
        grouped[item.day_of_week] = [];
      }
      grouped[item.day_of_week].push(item);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-yellow-400">Loading...</div>
        </div>
      </div>
    );
  }

  const grouped = groupByDay();

  return (
    <div id="schedule" className="bg-black py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4">
            WEEKLY <span className="text-yellow-400">SCHEDULE</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto px-2">
            Plan your fitness journey with our comprehensive weekly class schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 md:gap-4">
          {DAYS.map((day, dayIndex) => (
            <div
              key={day}
              className="bg-neutral-900 border-2 border-gray-800 p-3 md:p-4 min-h-auto md:min-h-96"
              style={{
                animation: `fadeInUp 0.6s ease-out ${dayIndex * 0.05}s backwards`
              }}
            >
              <h3 className="text-base md:text-lg font-bold text-yellow-400 mb-3 md:mb-4 text-center">
                {day}
              </h3>

              <div className="space-y-2 md:space-y-3">
                {grouped[dayIndex]?.length > 0 ? (
                  grouped[dayIndex].map((item) => {
                    const classInfo = item.classes as any;
                    const difficultyColor = COLORS[classInfo?.difficulty] || 'border-l-4 border-l-gray-400';

                    return (
                      <div
                        key={item.id}
                        className={`bg-black p-2 md:p-3 text-xs md:text-sm ${difficultyColor} hover:shadow-lg hover:shadow-yellow-400/20 transition-all duration-300`}
                      >
                        <div className="font-bold text-white mb-1 md:mb-2 line-clamp-2">
                          {classInfo?.name}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-1 md:mb-2">
                          <Clock className="h-3 w-3 text-yellow-400 flex-shrink-0" />
                          <span className="truncate">{formatTime(item.start_time)} - {formatTime(item.end_time)}</span>
                        </div>
                        <div className="text-gray-500 text-xs mb-1 md:mb-2 truncate">
                          {item.instructor}
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Users className="h-3 w-3 text-yellow-400 flex-shrink-0" />
                          <span>{item.capacity} spots</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-600 text-xs text-center py-3 md:py-4">
                    No classes
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 md:mt-12 flex justify-center gap-4 md:gap-6 flex-wrap px-2">
          <div className="flex items-center gap-2">
            <div className="h-2 md:h-3 w-2 md:w-3 bg-green-400 rounded-full" />
            <span className="text-gray-400 text-xs md:text-sm">Beginner</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 md:h-3 w-2 md:w-3 bg-yellow-400 rounded-full" />
            <span className="text-gray-400 text-xs md:text-sm">Intermediate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 md:h-3 w-2 md:w-3 bg-red-400 rounded-full" />
            <span className="text-gray-400 text-xs md:text-sm">Advanced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
