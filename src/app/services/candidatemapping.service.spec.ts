import { TestBed } from '@angular/core/testing';

import { CandidatemappingService } from './candidatemapping.service';

describe('CandidatemappingService', () => {
  let service: CandidatemappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidatemappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
