import { Word } from './word';

export class Sentence {
  sentenceId: string;
  sentenceText: string;
  timeSubmitted: string;
  learnerId: string;
  words: Array<Word>;
  selectedWordForms: Array<string>;
  userId: string;
  contextPackIds: Array<string>;
  wordCountPairs: { word: string; count: number }[];
  repeatedWords: { word: string; count: number }[];
  uniqueWords: { word: string; count: number }[] = []; // New property for unique words
  uniqueWordCount: number; // For total count of unique words
  wordCountMap: Record<string, number>;

  constructor() {
    this.repeatedWords = [];
    this.wordCountPairs = [];
    this.uniqueWords = []; // Initialize uniqueWords array
    this.uniqueWordCount = 0;
  }
}
