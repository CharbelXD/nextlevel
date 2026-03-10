import { useEffect, useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewsDetail from './NewsDetail';
import type { News } from '../types';

export default function NewsSection() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });

      if (!error && data) {
        setNews(data);
      }
      setLoading(false);
    }

    fetchNews();

    const subscription = supabase
      .channel('news_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'news' },
        (payload) => {
          console.log('News change received:', payload);
          fetchNews();
        }
      )
      .subscribe((status) => {
        console.log('News subscription status:', status);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-neutral-900 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <div className="text-yellow-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="news" className="bg-neutral-900 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4">
              LATEST <span className="text-yellow-400">NEWS</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto px-2">
              Stay updated with the latest from NextLevel Gym. New classes, equipment,
              and community events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {news.map((item, index) => (
              <div
                key={item.id}
                className="group bg-black overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-400/20 cursor-pointer"
                onClick={() => setSelectedNewsId(item.id)}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`
                }}
              >
                <div className="relative h-40 md:h-56 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                <div className="p-4 md:p-6">
                  <div className="flex items-center gap-2 text-yellow-400 text-xs md:text-sm mb-2 md:mb-3">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>{formatDate(item.published_at)}</span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 group-hover:text-yellow-400 transition-colors duration-300 line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-400 mb-3 md:mb-4 line-clamp-3 text-sm md:text-base">
                    {item.excerpt}
                  </p>

                  <button className="flex items-center gap-2 text-yellow-400 font-bold hover:gap-4 transition-all duration-300 text-sm md:text-base">
                    READ MORE
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedNewsId && (
        <NewsDetail
          newsId={selectedNewsId}
          onClose={() => setSelectedNewsId(null)}
        />
      )}
    </>
  );
}
