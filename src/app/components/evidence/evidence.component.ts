import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import config from '../../config';
import { AnalysisEvidence } from '../../models/interfaces/statusResponse.interface';

@Component({
  selector: 'app-evidence',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './evidence.component.html',
  styleUrl: './evidence.component.scss'
})
export class EvidenceComponent {
  /** Lista de evidencias tal como llega en getStatusAnalysis (key + label). */
  @Input() evidences: AnalysisEvidence[] | null | undefined = [];
  /** Base pública (CloudFront) sobre la que se resuelve cada key. */
  @Input() baseUrl = config.evidencesUrl;
  @Input() title = 'Evidencias';

  get items(): AnalysisEvidence[] {
    return this.evidences ?? [];
  }

  evidenceUrl(key: string): string {
    const base = this.baseUrl.replace(/\/+$/, '');
    const path = key.replace(/^\/+/, '');
    return `${base}/${path}`;
  }
}
