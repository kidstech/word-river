import { Word } from './word';

export class WordList {
  name: string;
  enabled: boolean;
  nouns: Word[];
  verbs: Word[];
  adjectives: Word[];
  misc: Word[];

  static getWordType(list: WordList,wordname: string ) {
    let result = '';
    [list.nouns, list.verbs, list.adjectives, list.misc].forEach(i => i.forEach(word => {
      if (word.word === wordname && result.length===0) {
        result = i === list.nouns ? 'Noun' : i === list.verbs ? 'Verb' : i === list.adjectives ? 'Adjective' : 'Misc';
      }
    }));
    return result;
  }
  static getWord(list: WordList,name: string ): Word {
    let result: Word;
    [list.nouns,list.verbs,list.adjectives,list.misc].forEach(i => i.forEach(word => {
      if(word.word === name) {result = word;}
    }));
    return result;
  }
}
