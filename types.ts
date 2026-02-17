
export type ClubCategory = '運動系' | '文化系' | 'その他';

export interface Club {
  id: string;
  majorCategory: ClubCategory;
  name: string;
  subject: string;
  location: string;
  schoolId: string;
  target: string;
  fee: string;
  frequency: string;
  status: '活動中' | '調整中' | '検討中';
  coordinates: [number, number];
  description?: string;
  applyMethod?: string;
  url?: string;
}

export interface School {
  id: string;
  name: string;
  coordinates: [number, number];
}
