import { TestBed } from '@angular/core/testing';

import { SOWService } from './sow.service';

describe('SOWService', () => {
  let service: SOWService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SOWService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
