import { TestBed } from '@angular/core/testing';

import { BackServiceService } from './back-service.service';

describe('BackServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BackServiceService = TestBed.get(BackServiceService);
    expect(service).toBeTruthy();
  });
});
