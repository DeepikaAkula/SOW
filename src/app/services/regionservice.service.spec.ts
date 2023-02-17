import { TestBed } from '@angular/core/testing';

import { RegionserviceService } from './regionservice.service';

describe('RegionserviceService', () => {
  let service: RegionserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
