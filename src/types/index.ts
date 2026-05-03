export interface MaturityModel {
  [key: string]: {
    [key: string]: string[];
  };
}

export interface QuestionData {
  pillar: string;
  fn: string;
  options: string[];
}

export interface FormAnswers {
  [key: string]: number;
}

export interface PillarResult {
  pillar: string;
  level: string;
  levelIndex: number;
}

export type MaturityLevel = 'Traditional' | 'Initial' | 'Advanced' | 'Optimal';
