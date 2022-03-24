import { Observable, of } from 'rxjs';
import { Sentence } from 'src/app/datatypes/sentence';
import { SentencesService } from 'src/app/services/sentences-service/sentences.service';

export class MockSentencesService extends SentencesService {
  static testSentences: Array<Sentence> = [
    {  sentenceId: '06748b8c-d080-4e72-bba1-274438449727',
       sentenceText: 'a active ant at the alphabet',
       timeSubmitted: '3/8/2022 8:28:10 PM',
       learnerId: '1623445120497',
       words: [
        {
          word: 'a',
          forms: [
            'a'
          ]
        },
        {
          word: 'active',
          forms: [
            'active',
            'a',
            'as'
          ]
        },
        {
          word: 'ant',
          forms: [
            'ant',
            'ants'
          ]
        },
        {
          word: 'at',
          forms: [
            'at'
          ]
        },
        {
          word: 'the',
          forms: [
            'the'
          ]
        },
        {
          word: 'alphabet',
          forms: [
            'alphabet',
            'alphabets'
          ]
        }
      ],
     selectedWordForms: [
        'a',
        'active',
        'ant',
        'at',
        'the',
        'alphabet'
     ],
    userId: '60c1a985926f9c1edcc3a6d9',
     contextPackIds: [
      '60d7cfa7c02ced09b6750223',
      '610376992c96b6238f61bc1a',
      '60beabcbbbaa96763c50ae16'
     ]
    }
  ];
  constructor() {
    super(null);
  }

  getSentences(id: string): Observable<Sentence[]> {
      return of(MockSentencesService.testSentences);
  }

}
