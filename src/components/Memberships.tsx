import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Membership {
  id: string;
  name: string;
  price: string;
  duration: string;
  features: string[];
  popular: boolean;
}

export default function Memberships() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberships = async () => {
      const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setMemberships(data as Membership[]);
      }

      setLoading(false);
    };

    fetchMemberships();
  }, []);

  return (
    <section id="memberships" className="py-20 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-yellow-400 font-bold tracking-widest uppercase mb-3">Memberships</p>
          <h2 className="text-4xl md:text-5xl font-black text-white">Choose Your Plan</h2>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading memberships...</div>
        ) : memberships.length === 0 ? (
          <div className="text-center text-gray-400">No membership plans available yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {memberships.map((plan) => (
              <div
                key={plan.id}
                className={`relative border-2 p-8 bg-black ${
                  plan.popular ? 'border-yellow-400' : 'border-gray-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-black px-4 py-1">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="text-2xl font-black text-white mb-3">{plan.name}</h3>
                <div className="text-yellow-400 text-4xl font-black mb-1">{plan.price}</div>
                <div className="text-gray-400 mb-8">{plan.duration}</div>

                <div className="space-y-3 mb-8">
                  {(plan.features || []).map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 text-gray-300">
                      <Check className="h-5 w-5 text-yellow-400 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-yellow-400 text-black font-black py-3 hover:bg-yellow-500 transition-colors">
                  Get Started
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}