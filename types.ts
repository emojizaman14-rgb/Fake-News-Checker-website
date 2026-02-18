export enum InputType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  LINK = 'LINK'
}

export type VerdictType = 'REAL' | 'FAKE' | 'AI_GENERATED' | 'UNSURE' | 'MISLEADING';

export interface AnalysisResult {
  verdict: VerdictType;
  title: string;
  reason: string; // Short concise reason
  confidenceScore: number; // 0-100
  groundingUrls?: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string; // base64
  isReport?: boolean;
}