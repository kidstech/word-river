export interface LearnerData {
  _id?: string;
  learnerId: string;
  learnerName: string;
  wordCounts: Map<string, number>;
  sessionTimes: Map<string, string>;
  }
