import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  LogOut,
  Image,
  Home,
  Calendar,
  Users,
  Dumbbell,
  BadgeDollarSign,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAdmin } from '../context/AdminContext';
import type { News, Class, ClassSchedule, PersonalTrainer } from '../types';

interface NewsForm {
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
}

interface ClassForm {
  name: string;
  description: string;
  instructor: string;
  schedule: string;
  difficulty: string;
  image_url: string;
}

interface ScheduleForm {
  class_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  instructor: string;
  capacity: number;
}

interface TrainerForm {
  name: string;
  description: string;
  image_url: string;
  specialization: string;
  bio: string;
}

interface Membership {
  id: string;
  name: string;
  price: string;
  duration: string;
  features: string[];
  popular: boolean;
  created_at?: string;
}

interface MembershipForm {
  name: string;
  price: string;
  duration: string;
  featuresText: string;
  popular: boolean;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AdminPanel() {
  const { logout } = useAdmin();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    'news' | 'classes' | 'schedule' | 'trainers' | 'memberships'
  >('news');

  const [news, setNews] = useState<News[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [schedule, setSchedule] = useState<ClassSchedule[]>([]);
  const [trainers, setTrainers] = useState<PersonalTrainer[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [editingTrainerId, setEditingTrainerId] = useState<string | null>(null);
  const [editingMembershipId, setEditingMembershipId] = useState<string | null>(null);

  const [formData, setFormData] = useState<NewsForm>({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
  });

  const [classForm, setClassForm] = useState<ClassForm>({
    name: '',
    description: '',
    instructor: '',
    schedule: '',
    difficulty: 'Beginner',
    image_url: '',
  });

  const [scheduleForm, setScheduleForm] = useState<ScheduleForm>({
    class_id: '',
    day_of_week: 1,
    start_time: '09:00',
    end_time: '10:00',
    instructor: '',
    capacity: 25,
  });

  const [trainerForm, setTrainerForm] = useState<TrainerForm>({
    name: '',
    description: '',
    image_url: '',
    specialization: '',
    bio: '',
  });

  const [membershipForm, setMembershipForm] = useState<MembershipForm>({
    name: '',
    price: '',
    duration: '',
    featuresText: '',
    popular: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const [newsData, classesData, scheduleData, trainersData, membershipsData] = await Promise.all([
      supabase.from('news').select('*').order('published_at', { ascending: false }),
      supabase.from('classes').select('*').order('created_at', { ascending: false }),
      supabase
        .from('class_schedule')
        .select(`*, classes:class_id (name, image_url, difficulty)`)
        .order('day_of_week')
        .order('start_time'),
      supabase.from('personal_trainers').select('*').order('created_at', { ascending: false }),
      supabase.from('memberships').select('*').order('created_at', { ascending: false }),
    ]);

    if (newsData.data) setNews(newsData.data);
    if (classesData.data) setClasses(classesData.data);
    if (scheduleData.data) setSchedule(scheduleData.data);
    if (trainersData.data) setTrainers(trainersData.data);
    if (membershipsData.data) setMemberships(membershipsData.data as Membership[]);

    setLoading(false);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `news/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('news-images').upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('news-images').getPublicUrl(filePath);

    return data.publicUrl;
  };

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setUploading(true);

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      if (editingId) {
        const { error: updateError } = await supabase
          .from('news')
          .update({
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content,
            image_url: imageUrl,
            published_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (updateError) throw updateError;
        setSuccess('News updated successfully!');
      } else {
        const { error: insertError } = await supabase.from('news').insert({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          image_url: imageUrl,
        });

        if (insertError) throw insertError;
        setSuccess('News published successfully!');
      }

      setFormData({
        title: '',
        excerpt: '',
        content: '',
        image_url: '',
      });
      setImageFile(null);
      setEditingId(null);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: News) => {
    resetMessages();
    setEditingId(item.id);
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      image_url: item.image_url,
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news?')) return;
    resetMessages();

    try {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) throw error;
      setSuccess('News deleted successfully!');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image_url: '',
    });
    setImageFile(null);
    resetMessages();
  };

  const handleClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setUploading(true);

    try {
      let imageUrl = classForm.image_url;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      if (editingClassId) {
        const { error } = await supabase
          .from('classes')
          .update({
            name: classForm.name,
            description: classForm.description,
            instructor: classForm.instructor,
            schedule: classForm.schedule,
            difficulty: classForm.difficulty,
            image_url: imageUrl,
          })
          .eq('id', editingClassId);

        if (error) throw error;
        setSuccess('Class updated successfully!');
      } else {
        const { error } = await supabase.from('classes').insert({
          name: classForm.name,
          description: classForm.description,
          instructor: classForm.instructor,
          schedule: classForm.schedule,
          difficulty: classForm.difficulty,
          image_url: imageUrl,
        });

        if (error) throw error;
        setSuccess('Class added successfully!');
      }

      setClassForm({
        name: '',
        description: '',
        instructor: '',
        schedule: '',
        difficulty: 'Beginner',
        image_url: '',
      });
      setEditingClassId(null);
      setImageFile(null);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setUploading(false);
    }
  };

  const handleEditClass = (item: Class) => {
    resetMessages();
    setEditingClassId(item.id);
    setClassForm({
      name: item.name,
      description: item.description,
      instructor: item.instructor,
      schedule: item.schedule,
      difficulty: item.difficulty,
      image_url: item.image_url,
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return;
    resetMessages();

    try {
      const { error } = await supabase.from('classes').delete().eq('id', id);
      if (error) throw error;
      setSuccess('Class deleted successfully!');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCancelClass = () => {
    setEditingClassId(null);
    setClassForm({
      name: '',
      description: '',
      instructor: '',
      schedule: '',
      difficulty: 'Beginner',
      image_url: '',
    });
    setImageFile(null);
    resetMessages();
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    try {
      if (editingScheduleId) {
        const { error } = await supabase
          .from('class_schedule')
          .update({
            class_id: scheduleForm.class_id,
            day_of_week: scheduleForm.day_of_week,
            start_time: scheduleForm.start_time + ':00',
            end_time: scheduleForm.end_time + ':00',
            instructor: scheduleForm.instructor,
            capacity: scheduleForm.capacity,
          })
          .eq('id', editingScheduleId);

        if (error) throw error;
        setSuccess('Schedule updated successfully!');
      } else {
        const { error } = await supabase.from('class_schedule').insert({
          class_id: scheduleForm.class_id,
          day_of_week: scheduleForm.day_of_week,
          start_time: scheduleForm.start_time + ':00',
          end_time: scheduleForm.end_time + ':00',
          instructor: scheduleForm.instructor,
          capacity: scheduleForm.capacity,
        });

        if (error) throw error;
        setSuccess('Class schedule added successfully!');
      }

      setScheduleForm({
        class_id: '',
        day_of_week: 1,
        start_time: '09:00',
        end_time: '10:00',
        instructor: '',
        capacity: 25,
      });
      setEditingScheduleId(null);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEditSchedule = (item: ClassSchedule) => {
    resetMessages();
    setEditingScheduleId(item.id);
    setScheduleForm({
      class_id: item.class_id,
      day_of_week: item.day_of_week,
      start_time: item.start_time.substring(0, 5),
      end_time: item.end_time.substring(0, 5),
      instructor: item.instructor,
      capacity: item.capacity,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;
    resetMessages();

    try {
      const { error } = await supabase.from('class_schedule').delete().eq('id', id);
      if (error) throw error;
      setSuccess('Schedule deleted successfully!');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCancelSchedule = () => {
    setEditingScheduleId(null);
    setScheduleForm({
      class_id: '',
      day_of_week: 1,
      start_time: '09:00',
      end_time: '10:00',
      instructor: '',
      capacity: 25,
    });
    resetMessages();
  };

  const handleTrainerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setUploading(true);

    try {
      let imageUrl = trainerForm.image_url;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      if (editingTrainerId) {
        const { error: updateError } = await supabase
          .from('personal_trainers')
          .update({
            name: trainerForm.name,
            description: trainerForm.description,
            image_url: imageUrl,
            specialization: trainerForm.specialization,
            bio: trainerForm.bio,
          })
          .eq('id', editingTrainerId);

        if (updateError) throw updateError;
        setSuccess('Trainer updated successfully!');
      } else {
        const { error: insertError } = await supabase.from('personal_trainers').insert({
          name: trainerForm.name,
          description: trainerForm.description,
          image_url: imageUrl,
          specialization: trainerForm.specialization,
          bio: trainerForm.bio,
        });

        if (insertError) throw insertError;
        setSuccess('Trainer added successfully!');
      }

      setTrainerForm({
        name: '',
        description: '',
        image_url: '',
        specialization: '',
        bio: '',
      });
      setImageFile(null);
      setEditingTrainerId(null);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setUploading(false);
    }
  };

  const handleEditTrainer = (trainer: PersonalTrainer) => {
    resetMessages();
    setEditingTrainerId(trainer.id);
    setTrainerForm({
      name: trainer.name,
      description: trainer.description,
      image_url: trainer.image_url,
      specialization: trainer.specialization,
      bio: trainer.bio,
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTrainer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trainer?')) return;
    resetMessages();

    try {
      const { error } = await supabase.from('personal_trainers').delete().eq('id', id);
      if (error) throw error;
      setSuccess('Trainer deleted successfully!');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCancelTrainer = () => {
    setEditingTrainerId(null);
    setTrainerForm({
      name: '',
      description: '',
      image_url: '',
      specialization: '',
      bio: '',
    });
    setImageFile(null);
    resetMessages();
  };

  const handleMembershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    const features = membershipForm.featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      if (editingMembershipId) {
        const { error } = await supabase
          .from('memberships')
          .update({
            name: membershipForm.name,
            price: membershipForm.price,
            duration: membershipForm.duration,
            features,
            popular: membershipForm.popular,
          })
          .eq('id', editingMembershipId);

        if (error) throw error;
        setSuccess('Membership updated successfully!');
      } else {
        const { error } = await supabase.from('memberships').insert({
          name: membershipForm.name,
          price: membershipForm.price,
          duration: membershipForm.duration,
          features,
          popular: membershipForm.popular,
        });

        if (error) throw error;
        setSuccess('Membership added successfully!');
      }

      setMembershipForm({
        name: '',
        price: '',
        duration: '',
        featuresText: '',
        popular: false,
      });
      setEditingMembershipId(null);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEditMembership = (item: Membership) => {
    resetMessages();
    setEditingMembershipId(item.id);
    setMembershipForm({
      name: item.name,
      price: item.price,
      duration: item.duration,
      featuresText: (item.features || []).join('\n'),
      popular: item.popular,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteMembership = async (id: string) => {
    if (!confirm('Are you sure you want to delete this membership?')) return;
    resetMessages();

    try {
      const { error } = await supabase.from('memberships').delete().eq('id', id);
      if (error) throw error;
      setSuccess('Membership deleted successfully!');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCancelMembership = () => {
    setEditingMembershipId(null);
    setMembershipForm({
      name: '',
      price: '',
      duration: '',
      featuresText: '',
      popular: false,
    });
    resetMessages();
  };

  return (
    <div className="min-h-screen bg-black">
      <nav className="bg-neutral-900 border-b border-yellow-400 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors font-bold"
            >
              <Home className="h-4 w-4" />
              Back to Website
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition-colors font-bold"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-4 mb-8 border-b border-yellow-400 overflow-x-auto">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-6 py-3 font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'news'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Plus className="h-5 w-5" />
            News Management
          </button>

          <button
            onClick={() => setActiveTab('classes')}
            className={`px-6 py-3 font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'classes'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Dumbbell className="h-5 w-5" />
            Classes Management
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-6 py-3 font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'schedule'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Calendar className="h-5 w-5" />
            Schedule Management
          </button>

          <button
            onClick={() => setActiveTab('trainers')}
            className={`px-6 py-3 font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'trainers'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="h-5 w-5" />
            Personal Trainers
          </button>

          <button
            onClick={() => setActiveTab('memberships')}
            className={`px-6 py-3 font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'memberships'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BadgeDollarSign className="h-5 w-5" />
            Memberships
          </button>
        </div>

        {activeTab === 'news' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-neutral-900 border-2 border-yellow-400 p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingId ? 'Edit News' : 'Publish New News'}
                </h2>

                {success && <div className="bg-green-900 text-green-200 px-4 py-3 mb-4">{success}</div>}
                {error && <div className="bg-red-900 text-red-200 px-4 py-3 mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white font-bold mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="News title"
                      required
                      className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2 focus:border-yellow-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-2">Excerpt</label>
                    <input
                      type="text"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Short excerpt"
                      required
                      className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2 focus:border-yellow-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-2">Full Content</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Full article content"
                      required
                      rows={6}
                      className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2 focus:border-yellow-400 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-2 items-center gap-2">
                      <Image className="h-5 w-5" />
                      Featured Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2"
                    />
                    {formData.image_url && (
                      <div className="mt-4">
                        <img src={formData.image_url} alt="Preview" className="w-full h-48 object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-yellow-400 text-black font-bold py-2 hover:bg-yellow-500 transition-colors disabled:bg-gray-600"
                    >
                      {uploading ? 'Processing...' : editingId ? 'Update News' : 'Publish News'}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 bg-gray-700 text-white font-bold py-2 hover:bg-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Published News</h3>
              {loading ? (
                <div className="text-gray-400">Loading...</div>
              ) : (
                <div className="space-y-4">
                  {news.map((item) => (
                    <div key={item.id} className="bg-neutral-900 border border-gray-700 p-4">
                      <h4 className="text-white font-bold text-sm mb-2 line-clamp-2">{item.title}</h4>
                      <p className="text-gray-400 text-xs mb-3 line-clamp-2">{item.excerpt}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex-1 bg-blue-600 text-white px-2 py-1 text-xs font-bold hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex-1 bg-red-600 text-white px-2 py-1 text-xs font-bold hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-neutral-900 border-2 border-yellow-400 p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingClassId ? 'Edit Class' : 'Add Class'}
                </h2>

                {success && <div className="bg-green-900 text-green-200 px-4 py-3 mb-4">{success}</div>}
                {error && <div className="bg-red-900 text-red-200 px-4 py-3 mb-4">{error}</div>}

                <form onSubmit={handleClassSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={classForm.name}
                    onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                    placeholder="Class name"
                    required
                    className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2"
                  />

                  <textarea
                    value={classForm.description}
                    onChange={(e) => setClassForm({ ...classForm, description: e.target.value })}
                    placeholder="Description"
                    required
                    rows={4}
                    className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2 resize-none"
                  />

                  <input
                    type="text"
                    value={classForm.instructor}
                    onChange={(e) => setClassForm({ ...classForm, instructor: e.target.value })}
                    placeholder="Instructor"
                    required
                    className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2"
                  />

                  <input
                    type="text"
                    value={classForm.schedule}
                    onChange={(e) => setClassForm({ ...classForm, schedule: e.target.value })}
                    placeholder="Schedule text"
                    required
                    className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2"
                  />

                  <select
                    value={classForm.difficulty}
                    onChange={(e) => setClassForm({ ...classForm, difficulty: e.target.value })}
                    className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2"
                  />

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-yellow-400 text-black font-bold py-2"
                    >
                      {uploading ? 'Processing...' : editingClassId ? 'Update Class' : 'Add Class'}
                    </button>
                    {editingClassId && (
                      <button
                        type="button"
                        onClick={handleCancelClass}
                        className="flex-1 bg-gray-700 text-white font-bold py-2"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Classes</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {classes.map((item) => (
                  <div key={item.id} className="bg-neutral-900 border border-gray-700 p-3 text-xs">
                    <div className="font-bold text-white mb-2">{item.name}</div>
                    <div className="text-yellow-400 mb-2">{item.difficulty}</div>
                    <div className="text-gray-400 mb-3">{item.instructor}</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClass(item)}
                        className="flex-1 bg-blue-600 text-white px-2 py-1 font-bold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClass(item.id)}
                        className="flex-1 bg-red-600 text-white px-2 py-1 font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-neutral-900 border-2 border-yellow-400 p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingScheduleId ? 'Edit Class Schedule' : 'Add Class Schedule'}
                </h2>

                {success && <div className="bg-green-900 text-green-200 px-4 py-3 mb-4">{success}</div>}
                {error && <div className="bg-red-900 text-red-200 px-4 py-3 mb-4">{error}</div>}

                <form onSubmit={handleScheduleSubmit} className="space-y-4">
                  <select
                    value={scheduleForm.class_id}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, class_id: e.target.value })}
                    required
                    className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2"
                  >
                    <option value="">Select a class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={scheduleForm.day_of_week}
                    onChange={(e) =>
                      setScheduleForm({ ...scheduleForm, day_of_week: parseInt(e.target.value, 10) })
                    }
                    className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2"
                  >
                    {DAYS.map((day, idx) => (
                      <option key={idx} value={idx}>
                        {day}
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="time"
                      value={scheduleForm.start_time}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, start_time: e.target.value })}
                      className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2"
                    />
                    <input
                      type="time"
                      value={scheduleForm.end_time}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, end_time: e.target.value })}
                      className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2"
                    />
                  </div>

                  <input
                    type="text"
                    value={scheduleForm.instructor}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, instructor: e.target.value })}
                    placeholder="Instructor"
                    required
                    className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2"
                  />

                  <input
                    type="number"
                    min="1"
                    value={scheduleForm.capacity}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        capacity: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2"
                  />

                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-yellow-400 text-black font-bold py-2">
                      {editingScheduleId ? 'Update Schedule' : 'Add Schedule'}
                    </button>
                    {editingScheduleId && (
                      <button
                        type="button"
                        onClick={handleCancelSchedule}
                        className="flex-1 bg-gray-700 text-white font-bold py-2"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Class Schedules</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {schedule.map((item) => {
                  const classInfo = item.classes;
                  return (
                    <div key={item.id} className="bg-neutral-900 border border-gray-700 p-3 text-xs">
                      <div className="font-bold text-white mb-2">{classInfo?.name || 'Unknown Class'}</div>
                      <div className="text-gray-400 mb-2">
                        {DAYS[item.day_of_week]} • {item.start_time.substring(0, 5)} -{' '}
                        {item.end_time.substring(0, 5)}
                      </div>
                      <div className="text-gray-400 mb-3">
                        {item.instructor} • {item.capacity} spots
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditSchedule(item)}
                          className="flex-1 bg-blue-600 text-white px-2 py-1 font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(item.id)}
                          className="flex-1 bg-red-600 text-white px-2 py-1 font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trainers' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-neutral-900 border-2 border-yellow-400 p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingTrainerId ? 'Edit Trainer' : 'Add Personal Trainer'}
                </h2>

                {success && <div className="bg-green-900 text-green-200 px-4 py-3 mb-4">{success}</div>}
                {error && <div className="bg-red-900 text-red-200 px-4 py-3 mb-4">{error}</div>}

                <form onSubmit={handleTrainerSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Trainer Name"
                    value={trainerForm.name}
                    onChange={(e) => setTrainerForm({ ...trainerForm, name: e.target.value })}
                    className="w-full bg-black text-white px-4 py-2 border border-gray-600"
                    required
                  />

                  <input
                    type="text"
                    placeholder="Specialization"
                    value={trainerForm.specialization}
                    onChange={(e) => setTrainerForm({ ...trainerForm, specialization: e.target.value })}
                    className="w-full bg-black text-white px-4 py-2 border border-gray-600"
                  />

                  <textarea
                    placeholder="Short Description"
                    value={trainerForm.description}
                    onChange={(e) => setTrainerForm({ ...trainerForm, description: e.target.value })}
                    className="w-full bg-black text-white px-4 py-2 border border-gray-600 h-20"
                    required
                  />

                  <textarea
                    placeholder="Bio"
                    value={trainerForm.bio}
                    onChange={(e) => setTrainerForm({ ...trainerForm, bio: e.target.value })}
                    className="w-full bg-black text-white px-4 py-2 border border-gray-600 h-20"
                  />

                  <div className="border border-gray-600 p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Image className="h-5 w-5 text-yellow-400" />
                      <span className="text-white">{imageFile ? imageFile.name : 'Upload Trainer Photo'}</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-yellow-400 text-black font-bold py-2 disabled:opacity-50"
                    >
                      {uploading ? 'Saving...' : editingTrainerId ? 'Update Trainer' : 'Add Trainer'}
                    </button>
                    {editingTrainerId && (
                      <button
                        type="button"
                        onClick={handleCancelTrainer}
                        className="flex-1 bg-gray-600 text-white font-bold py-2"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Trainers</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {trainers.map((trainer) => (
                  <div key={trainer.id} className="bg-neutral-900 border border-gray-700 p-3 text-xs">
                    <div className="font-bold text-white mb-2">{trainer.name}</div>
                    {trainer.specialization && <div className="text-yellow-400 mb-2">{trainer.specialization}</div>}
                    <div className="text-gray-400 mb-3 line-clamp-2">{trainer.description}</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTrainer(trainer)}
                        className="flex-1 bg-blue-600 text-white px-2 py-1 font-bold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTrainer(trainer.id)}
                        className="flex-1 bg-red-600 text-white px-2 py-1 font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'memberships' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-neutral-900 border-2 border-yellow-400 p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingMembershipId ? 'Edit Membership' : 'Add Membership'}
                </h2>

                {success && <div className="bg-green-900 text-green-200 px-4 py-3 mb-4">{success}</div>}
                {error && <div className="bg-red-900 text-red-200 px-4 py-3 mb-4">{error}</div>}

                <form onSubmit={handleMembershipSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={membershipForm.name}
                    onChange={(e) => setMembershipForm({ ...membershipForm, name: e.target.value })}
                    placeholder="Plan name"
                    required
                    className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={membershipForm.price}
                      onChange={(e) => setMembershipForm({ ...membershipForm, price: e.target.value })}
                      placeholder="Price e.g. $49"
                      required
                      className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2"
                    />
                    <input
                      type="text"
                      value={membershipForm.duration}
                      onChange={(e) => setMembershipForm({ ...membershipForm, duration: e.target.value })}
                      placeholder="Duration e.g. Monthly"
                      required
                      className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2"
                    />
                  </div>

                  <textarea
                    value={membershipForm.featuresText}
                    onChange={(e) => setMembershipForm({ ...membershipForm, featuresText: e.target.value })}
                    placeholder={`One feature per line\nGym Access\nGroup Classes\nLocker Room`}
                    rows={6}
                    className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2 resize-none"
                  />

                  <label className="flex items-center gap-3 text-white font-bold">
                    <input
                      type="checkbox"
                      checked={membershipForm.popular}
                      onChange={(e) => setMembershipForm({ ...membershipForm, popular: e.target.checked })}
                    />
                    Mark as popular
                  </label>

                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-yellow-400 text-black font-bold py-2">
                      {editingMembershipId ? 'Update Membership' : 'Add Membership'}
                    </button>
                    {editingMembershipId && (
                      <button
                        type="button"
                        onClick={handleCancelMembership}
                        className="flex-1 bg-gray-700 text-white font-bold py-2"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Membership Plans</h3>
              <div className="space-y-3 max-h-[32rem] overflow-y-auto">
                {memberships.map((item) => (
                  <div key={item.id} className="bg-neutral-900 border border-gray-700 p-4 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-white">{item.name}</div>
                      {item.popular && (
                        <span className="bg-yellow-400 text-black px-2 py-1 text-[10px] font-bold">POPULAR</span>
                      )}
                    </div>
                    <div className="text-yellow-400 mb-1">{item.price}</div>
                    <div className="text-gray-400 mb-2">{item.duration}</div>
                    <div className="text-gray-500 mb-3">{(item.features || []).length} features</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditMembership(item)}
                        className="flex-1 bg-blue-600 text-white px-2 py-1 font-bold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMembership(item.id)}
                        className="flex-1 bg-red-600 text-white px-2 py-1 font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}