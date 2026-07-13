/** Bu dosya, statistics API service'in canlı Swagger route, query ve unwrap davranışını doğrular. */
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppConfigService } from '@core/config/app-config.service';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { StatisticsApiService } from './statistics-api.service';

/** Beş protected statistics GET operasyonunu Angular HTTP test backend'iyle sınar. */
describe('StatisticsApiService',()=>{
  let http:HttpTestingController;
  /** Kontrollü API base URL ile service containerını kurar. */
  beforeEach(()=>{TestBed.configureTestingModule({providers:[provideHttpClient(),provideHttpClientTesting(),StatisticsApiService,{provide:AppConfigService,useValue:{apiBaseUrl:'http://localhost:5000/api/'}}]});http=TestBed.inject(HttpTestingController);});
  /** Beklenmeyen HTTP isteği kalmadığını doğrular. */
  afterEach(()=>http.verify());
  /** Learning summary route'unu ownership parametresi olmadan çağırır ve zarfı açar. */
  it('loads learning summary',async()=>{const result=firstValueFrom(TestBed.inject(StatisticsApiService).getLearningSummary());const req=http.expectOne('http://localhost:5000/api/user-statistics/learning-summary');expect(req.request.method).toBe('GET');expect(req.request.params.keys()).toEqual([]);req.flush(api({generatedAt:'2026-01-01T00:00:00Z'}));await expect(result).resolves.toEqual({generatedAt:'2026-01-01T00:00:00Z'});});
  /** Quiz filterlerini Swagger alan adlarıyla query stringe taşır. */
  it('sends canonical quiz filters',()=>{TestBed.inject(StatisticsApiService).getQuizStatistics({quizType:'Test',fromUtc:'2026-01-01T00:00:00Z'}).subscribe();const req=http.expectOne(r=>r.url.endsWith('/user-statistics/quizzes'));expect(req.request.params.get('QuizType')).toBe('Test');expect(req.request.params.get('FromUtc')).toBe('2026-01-01T00:00:00Z');req.flush(api({}));});
  /** Difficult item pagination ve source filtrelerini Swagger alan adlarıyla gönderir. */
  it('sends canonical difficult item query',()=>{TestBed.inject(StatisticsApiService).getDifficultItems({pageNumber:2,pageSize:20,source:'manual',sortBy:'wrongCountDesc'}).subscribe();const req=http.expectOne(r=>r.url.endsWith('/user-statistics/difficult-items'));expect(req.request.params.get('PageNumber')).toBe('2');expect(req.request.params.get('Source')).toBe('manual');expect(req.request.params.get('SortBy')).toBe('wrongCountDesc');req.flush(api({items:null}));});
  /** Test response zarfını merkezi ApiResponse biçiminde üretir. */
  function api<T>(data:T){return{success:true,message:null,data,timestamp:'2026-01-01T00:00:00Z'};}
});
