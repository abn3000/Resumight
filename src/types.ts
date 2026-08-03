export type NavTab = 'home' | 'about' | 'resumaker' | 'tailor';

export interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  tag: string;
  colorHex: string;
}

export interface StudentFeature {
  title: string;
  description: string;
  iconName: string;
  badge?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
