import { TestBed } from '@angular/core/testing';

import { NotescollectionService } from './notescollection.service';

describe('NotescollectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotescollectionService = TestBed.get(NotescollectionService);
    expect(service).toBeTruthy();
  });
});
