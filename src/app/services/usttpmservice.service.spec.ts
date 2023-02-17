import { TestBed } from '@angular/core/testing';

import { UsttpmserviceService } from './usttpmservice.service';

describe('UsttpmserviceService', () => {
  let service: UsttpmserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsttpmserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
