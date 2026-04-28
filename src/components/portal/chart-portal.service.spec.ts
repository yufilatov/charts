import { TestBed, inject } from '@angular/core/testing';
import { ChartPortalService } from './chart-portal.service';

describe('ChartPortalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartPortalService],
    });
  });

  it('should be created', inject([ChartPortalService], (service: ChartPortalService) => {
    expect(service).toBeTruthy();
  }));
});
