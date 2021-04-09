import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DictionaryService } from './dictionary.service';

describe('DictionaryService', () => {
  let service: DictionaryService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(DictionaryService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('getType() calls the right link', () => {
    service.getType('bear',type=>{},err=>{});
    const req = httpTestingController.expectOne(service.generateLink('bear'));
    expect(req.request.method).toEqual('GET');
  });
  it('generateLink() generates the right link', () => {
    const link = service.generateLink('bear');
    expect(link).toEqual('https://www.dictionaryapi.com/api/v3/references/collegiate/json/bear?key=79a089d4-002b-4bd0-a177-6eae2a531161');
  });

});
