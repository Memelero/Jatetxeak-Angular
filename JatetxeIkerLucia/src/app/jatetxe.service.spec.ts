import { TestBed } from '@angular/core/testing';

import { JatetxeService } from './jatetxe.service';

describe('JatetxeService', () => {
  let service: JatetxeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JatetxeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
