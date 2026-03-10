export interface Membership {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular: boolean;
  created_at: string;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  instructor: string;
  schedule: string;
  difficulty: string;
  image_url: string;
  created_at: string;
}

export interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  published_at: string;
  created_at: string;
}

export interface ClassSchedule {
  id: string;
  class_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  instructor: string;
  capacity: number;
  created_at: string;
  classes?: {
    name: string;
    image_url: string;
    difficulty: string;
  };
}

export interface PersonalTrainer {
  id: string;
  name: string;
  description: string;
  image_url: string;
  specialization: string;
  bio: string;
  created_at: string;
}
