import { TestBed } from '@angular/core/testing';

import { UstpocserviceService } from './ustpocservice.service';

describe('UstpocserviceService', () => {
  let service: UstpocserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UstpocserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
