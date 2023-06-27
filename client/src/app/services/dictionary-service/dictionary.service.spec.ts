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
      imports: [HttpClientTestingModule],
      providers: [DictionaryService]
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
    expect(link).toEqual('https://www.dictionaryapi.com/api/v3/references/sd2/json/bear?key=0ac50be7-6f80-4a30-bde1-305366d66800');
  });

  it('should call API and execute onLoaded callback with type', () => {
    const word = 'example';
    const type = 'noun';
    const onLoadedSpy = jasmine.createSpy('onLoaded');

    service.getType(word, onLoadedSpy);

    const req = httpTestingController.expectOne(service.generateLink(word));
    req.flush([{ fl: type }]);

    expect(req.request.method).toBe('GET');
    expect(onLoadedSpy).toHaveBeenCalledWith(type);
  });

  it('should call API and execute onLoaded callback with forms', () => {
    const word = 'example';
    const forms = ['form1', 'form2', 'form3'];
    const onLoadedSpy = jasmine.createSpy('onLoaded');

    service.getForms(word, onLoadedSpy);

    const req = httpTestingController.expectOne(service.generateLink(word));
    req.flush([{ meta: { stems: forms } }]);

    expect(req.request.method).toBe('GET');
    expect(onLoadedSpy).toHaveBeenCalledWith(forms);
  });
});
