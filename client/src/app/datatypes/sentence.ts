import { Word } from './word';
export class Sentence {
      sentenceId: string;
    // the sentence contents
    sentenceText: string;
    // the time the sentence was submitted in storybuilder
    timeSubmitted: string;
    // the object id for the learner that submitted the sentence
    learnerId: string;
    words: Array<Word>;
    selectedWordForms: Array<string>;
    // mongo object Id of associated user
    userId: string;
    contextPackIds: Array<string>;
    wordCountPairs: { word: string; count: number }[];
    constructor() {
      this.wordCountPairs = [];
    }
}
