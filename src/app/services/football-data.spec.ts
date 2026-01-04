import { TestBed } from '@angular/core/testing';

import { FootballData } from './football-data';

describe('FootballData', () => {
  let service: FootballData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FootballData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
