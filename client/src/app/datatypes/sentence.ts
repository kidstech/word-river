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
  repeatedWords: { word: string; count: number }[] = [];
  wordCountMap: Record<string, number>;

  constructor() {
    this.repeatedWords = [];
    this.wordCountPairs = [];
  }

  calculateRepeatedWordsWithCount(sentenceText: string): { word: string; count: number }[] {
    const wordCountMap = new Map<string, number>();
    const words = sentenceText.toLowerCase().split(/\s+/);

    // Count occurrences of each word
    words.forEach((word) => {
      const currentCount = wordCountMap.get(word) || 0;
      wordCountMap.set(word, currentCount + 1);
    });

    // Create an array of objects with word and count properties
    const repeatedWords: { word: string; count: number }[] = Array.from(wordCountMap.entries())
      .filter(([word, count]) => count > 1)
      .map(([word, count]) => ({ word, count }));

    return repeatedWords;
  }
}
