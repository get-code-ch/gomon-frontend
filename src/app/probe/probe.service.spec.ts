import { TestBed } from '@angular/core/testing';

import { ProbeService } from './probe.service';

describe('ProbeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProbeService = TestBed.get(ProbeService);
    expect(service).toBeTruthy();
  });
});
