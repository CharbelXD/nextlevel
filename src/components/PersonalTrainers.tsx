import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { PersonalTrainer } from '../types';

export default function PersonalTrainers() {
  const [trainers, setTrainers] = useState<PersonalTrainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);
  const [selectedTrainerName, setSelectedTrainerName] = useState<string>('');

  useEffect(() => {
    async function fetchTrainers() {
      const { data, error } = await supabase
        .from('personal_trainers')
        .select('*')
        .order('created_at');

      if (!error && data) {
        setTrainers(data);
      }
      setLoading(false);
    }

    fetchTrainers();

    const subscription = supabase
      .channel('personal_trainers_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'personal_trainers' },
        (payload) => {
          console.log('Trainers change received:', payload);
          fetchTrainers();
        }
      )
      .subscribe((status) => {
        console.log('Trainers subscription status:', status);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSelectTrainer = (trainerId: string, trainerName: string) => {
    setSelectedTrainerId(trainerId);
    setSelectedTrainerName(trainerName);
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

  if (trainers.length === 0) {
    return null;
  }

  return (
    <div id="trainers" className="bg-black py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4">
            PERSONAL <span className="text-yellow-400">TRAINERS</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto px-2">
            Meet our expert personal trainers. Each trainer brings unique expertise and
            personalized coaching to help you achieve your fitness goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {trainers.map((trainer, index) => (
            <div
              key={trainer.id}
              className="group relative bg-neutral-900 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/20 cursor-pointer"
              onClick={() => handleSelectTrainer(trainer.id, trainer.name)}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`
              }}
            >
              <div className="relative h-48 md:h-64 overflow-hidden">
                <img
                  src={trainer.image_url}
                  alt={trainer.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />
                {selectedTrainerId === trainer.id && (
                  <div className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center">
                    <div className="bg-yellow-400 rounded-full p-2">
                      <Check className="h-8 w-8 text-black" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                  {trainer.name}
                </h3>
                {trainer.specialization && (
                  <p className="text-yellow-400 text-xs md:text-sm font-semibold mb-2 md:mb-3">
                    {trainer.specialization}
                  </p>
                )}
                <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-3 md:mb-4 line-clamp-3">
                  {trainer.description}
                </p>
                {trainer.bio && (
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed line-clamp-2">
                    {trainer.bio}
                  </p>
                )}
              </div>

              <button
                className={`w-full transition-all duration-300 py-2 md:py-3 font-bold text-sm md:text-base ${
                  selectedTrainerId === trainer.id
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-900 text-yellow-400 hover:bg-yellow-400 hover:text-black border-b-2 border-gray-800'
                }`}
              >
                {selectedTrainerId === trainer.id ? 'SELECTED' : 'CHOOSE TRAINER'}
              </button>
            </div>
          ))}
        </div>

        {selectedTrainerId && (
          <div className="mt-10 md:mt-16 text-center">
            <p className="text-gray-300 text-sm md:text-lg mb-4">
              You have selected <span className="text-yellow-400 font-bold">{selectedTrainerName}</span> as your personal trainer
            </p>
            <button className="bg-yellow-400 text-black px-6 md:px-8 py-2 md:py-3 font-bold hover:bg-yellow-500 transition-all duration-300 text-sm md:text-base">
              CONFIRM SELECTION
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
