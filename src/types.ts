export type NavTab = 'home' | 'about' | 'resumaker' | 'tailor' | 'coach' | 'prep';

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

export interface ElevatorPitch {
  hook: string;
  proofPoints: string[];
  pivot: string;
  fullScript: string;
  estimatedSeconds: number;
  deliveryTips: string[];
}

export interface StarStory {
  title: string;
  contextRole: string;
  coreQuestion: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  metricHighlight: string;
  recruiterFollowUp: string;
  followUpAnswerTip: string;
}

export interface OutreachPack {
  linkedinNote: string;
  hiringManagerEmail: {
    subject: string;
    body: string;
  };
  alumniCoffeeChat: {
    subject: string;
    body: string;
  };
}

export interface InterviewQuestion {
  question: string;
  category: string;
  difficulty: 'Warmup' | 'Technical' | 'Behavioral' | 'Curveball';
  whyRecruitersAsk: string;
}

export interface PrepData {
  elevatorPitch: ElevatorPitch;
  starStories: StarStory[];
  outreachPack: OutreachPack;
  recommendedQuestions: InterviewQuestion[];
}

export interface PracticeFeedback {
  score: number;
  strengths: string[];
  areasToImprove: string[];
  starAssessment: {
    situationCovered: boolean;
    taskCovered: boolean;
    actionCovered: boolean;
    resultCovered: boolean;
    note: string;
  };
  proVersion: string;
  coachSummary: string;
}

export type CoachData = PrepData;
