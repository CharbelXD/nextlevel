import Hero from '../components/Hero';
import Memberships from '../components/Memberships';
import Classes from '../components/Classes';
import Schedule from '../components/Schedule';
import PersonalTrainers from '../components/PersonalTrainers';
import NewsSection from '../components/News';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Memberships />
      <Classes />
      <Schedule />
      <PersonalTrainers />
      <NewsSection />
      <Footer />
    </div>
  );
}
