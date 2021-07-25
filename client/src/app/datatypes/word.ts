export class Word {
  word: string;
  forms: string[];
  contextPackId: string;
  type?: string;

  constructor(word: string,forms: string[], contextPackId: string,type?: string){}
}
