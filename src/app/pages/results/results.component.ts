import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EvidenceComponent } from '../../components/evidence/evidence.component';
import { SummaryComponent } from '../../components/summary/summary.component';
import { AnalysisStatusResponse } from '../../models/interfaces/statusResponse.interface';
import { StatusService } from '../../services/statusService/status.service';

@Component({
  selector: 'app-results',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SummaryComponent,
    EvidenceComponent
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {
  jobId = '';
  loading = false;
  error = '';
  result: AnalysisStatusResponse | null = null;

  constructor(
    private readonly statusService: StatusService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    const jobId = this.route.snapshot.queryParamMap.get('jobId');
    if (jobId) {
      this.jobId = jobId;
      this.consult();
    }
  }

  async consult() {
    const jobId = this.jobId.trim();
    if (!jobId || this.loading) return;

    this.loading = true;
    this.error = '';
    this.result = null;

    try {
      this.result = await this.statusService.getAnalysisStatus(jobId);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'No se pudo consultar el estado.';
    } finally {
      this.loading = false;
    }
  }
}
