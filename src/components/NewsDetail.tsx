import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { News } from '../types';

interface NewsDetailProps {
  newsId: string;
  onClose: () => void;
}

export default function NewsDetail({ newsId, onClose }: NewsDetailProps) {
  const [newsItem, setNewsItem] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      const { data } = await supabase
        .from('news')
        .select('*')
        .eq('id', newsId)
        .maybeSingle();

      if (data) {
        setNewsItem(data);
      }
      setLoading(false);
    }

    fetchNews();
  }, [newsId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-neutral-900 p-8 text-white">Loading...</div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-neutral-900 p-8 text-white">News not found</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto bg-neutral-900 border-2 border-yellow-400">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-500 transition-colors p-6 font-bold"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to News
          </button>

          <div className="relative h-96 overflow-hidden">
            <img
              src={newsItem.image_url}
              alt={newsItem.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent" />
          </div>

          <div className="p-8">
            <div className="flex items-center gap-2 text-yellow-400 mb-4">
              <Calendar className="h-5 w-5" />
              <span>{formatDate(newsItem.published_at)}</span>
            </div>

            <h1 className="text-4xl font-bold text-white mb-6">{newsItem.title}</h1>

            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                {newsItem.content}
              </p>
            </div>

            <div className="flex items-center gap-4 pt-8 border-t border-gray-700">
              <button className="flex items-center gap-2 text-yellow-400 hover:text-yellow-500 transition-colors font-bold">
                <Share2 className="h-5 w-5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
