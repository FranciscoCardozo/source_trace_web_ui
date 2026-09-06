import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryComponent } from './summary.component';
import { AnalysisStatusResponse } from '../../models/interfaces/statusResponse.interface';

const mockResult: AnalysisStatusResponse = {
  PK: 'JOB#a1b2c3',
  SK: 'METADATA',
  status: 'completed',
  createdAt: '2026-09-04T15:00:00Z',
  updatedAt: '2026-09-04T15:03:12Z'
};

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('result', mockResult);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
