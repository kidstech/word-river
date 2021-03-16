import { Word } from './word';

export class WordList {
  name: string;
  enabled: boolean;
  nouns: Word[];
  verbs: Word[];
  adjectives: Word[];
  misc: Word[];

  getWordType(wordname: string) {
    [this.nouns, this.verbs, this.adjectives, this.misc].forEach(i => i.forEach(word => {
      if (word.word === wordname) {
        return Object.keys(i);
      }
    }));
    return null;
  }
  getWord(name): Word {
    [this.nouns,this.verbs,this.adjectives,this.misc].forEach(i => i.forEach(word => {
      if(word.word === name) {return word;}
    }));
    return null;
  }
}
