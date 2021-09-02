import { TestBed } from '@angular/core/testing';

import { ExchangeDataService } from './exchange-data.service';

describe('ExchangeDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExchangeDataService = TestBed.get(ExchangeDataService);
    expect(service).toBeTruthy();
  });
});
