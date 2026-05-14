export type UserRole = 'principal' | 'admin' | 'teacher' | 'secretary';

export type UserStatus = 'pending' | 'approved' | 'blocked';

export type User = {
  id: string;
  email: string;
  full_name?: string;
  school_name?: string;
  district?: string;
  teaching_level?: string;
  subjects_taught?: string[];
  classes_taught?: string[];
  phone_number?: string;
  teacher_id?: string;
  role: UserRole;
  status: UserStatus;
  plan?: 'free' | 'pro' | 'institutional';
};

export type DocumentType = 'lesson_plan' | 'questions' | 'scheme' | 'exam';

export type GeneratedDocument = {
  id: string;
  user_id: string;
  type: DocumentType;
  title: string;
  subject: string;
  class_level: string;
  content: string;
  created_at: string;
  generation_inputs?: any;
};
