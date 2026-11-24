export interface User {
  id: string;
  email: string;
  penName: string;
  avatarSticker: string;
  bio?: string;
  signature: string;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  title: string;
  year?: string;
  category: 'film' | 'series' | 'video' | 'youtube' | 'song';
  imageUrl?: string;
  note?: string;
}

export interface ReadingItem {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  note?: string;
  status: 'reading' | 'read' | 'tbr';
}

export interface SnapshotItem {
  id: string;
  caption: string;
  imageUrl: string;
  rotationDeg?: number;
}

export interface CheerfulComment {
  id: string;
  journalId: string;
  userId: string;
  authorPenName: string;
  authorAvatar: string;
  authorSignature?: string;
  content: string;
  createdAt: string;
  aiModeration: {
    isApproved: boolean;
    warmthScore: number;
    cheerfulReason: string;
    tag: string;
  };
  likes: number;
}

export interface JournalDigest {
  id: string;
  userId: string;
  authorPenName: string;
  authorAvatar: string;
  authorSignature: string;
  title: string;
  monthLabel: string;
  date: string;
  isPublic: boolean;
  mood: 'heavy-hearted' | 'overwhelmed' | 'numb' | 'holding-on' | 'tender' | 'seeking-light' | 'grieving' | 'hopeful';
  reflectionBody: string;
  // Core emotional reflection fields requested:
  currentStruggle?: string; // Why I am feeling low & current scenario
  copingMechanism?: string; // How I am currently coping with it
  adviceWanted?: string;    // Specific advice / cheer I am looking for from the community
  stepsTaking?: string[];   // Small steps I am taking to improve my situation
  
  watchedMedia?: MediaItem[];
  readingItems?: ReadingItem[];
  featuredQuote?: {
    text: string;
    author: string;
    flowerDeco?: string;
  };
  listeningTo?: {
    track: string;
    artist: string;
    albumArt?: string;
    note?: string;
  };
  snapshots?: SnapshotItem[];
  smallWins?: string[];
  reactions: {
    '🤍': number; // You Matter
    '🫂': number; // Sending a Hug
    '🕯️': number; // Holding Space
    '🌱': number; // Strength & Courage
    '✨': number; // Gentle Light
  };
  userReactions?: Record<string, string>; // userId -> emoji
  comments: CheerfulComment[];
  createdAt: string;
  updatedAt: string;
}

export interface ActionStepItem {
  id: string;
  userId?: string;
  phase: 'emergency' | 'ground' | 'breathe' | 'gentle' | 'action' | 'anchor';
  title: string;
  subtitle: string;
  detail: string;
  timeEstimate: string;
  iconName: string;
  completed: boolean;
  completedAt?: string;
  isCustom?: boolean;
  reflectionNote?: string;
}

