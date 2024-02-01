import { Sentence } from 'src/app/datatypes/sentence';

export const MockSentence: Sentence = {
  sentenceId: '1',
  sentenceText: 'This is a sample sentence.',
  timeSubmitted: '2022-01-01T12:00:00',
  learnerId: 'learner1',
  words: [{ word: 'sample', forms: ['sample'] }],
  selectedWordForms: [],
  userId: 'user1',
  contextPackIds: ['contextPack1'],
  wordCountPairs: [],
  repeatedWords: [],
  wordCountMap: {},
  calculateRepeatedWordsWithCount: function (sentenceText: string) {
    const wordCountMap = new Map<string, number>();
    const words = sentenceText.toLowerCase().split(/\s+/);

    // Count occurrences of each word
    words.forEach((word) => {
      const currentCount = wordCountMap.get(word) || 0;
      wordCountMap.set(word, currentCount + 1);
    });

    // Create an array of objects with word and count properties
    const repeatedWords = Array.from(wordCountMap.entries())
      .filter(([word, count]) => count > 1)
      .map(([word, count]) => ({ word, count }));

    return repeatedWords;
  },
};
