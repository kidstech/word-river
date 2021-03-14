import { Word } from "./word";

export interface WordList {
    name: string;
    enabled: boolean;
    nouns: Word[];
    verbs: Word[];
    adjectives: Word[];
    misc: Word[];
  }
