import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { AnalysisStatusResponse } from '../../models/interfaces/statusResponse.interface';

@Component({
  selector: 'app-summary',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  /** Resultado tal cual lo devuelve getStatusAnalysis. */
  @Input({ required: true }) result!: AnalysisStatusResponse;
  /** Se emite cuando el usuario pide refrescar (análisis aún en curso). */
  @Output() refresh = new EventEmitter<void>();

  private readonly statusLabels: Record<string, string> = {
    started: 'Iniciado',
    pending: 'Pendiente',
    queued: 'En cola',
    processing: 'Procesando',
    running: 'Procesando',
    in_progress: 'En progreso',
    completed: 'Completado',
    succeeded: 'Completado',
    failed: 'Fallido',
    error: 'Fallido'
  };

  get normalizedStatus(): string {
    return (this.result?.status ?? '').toLowerCase();
  }

  get statusLabel(): string {
    return this.statusLabels[this.normalizedStatus] ?? this.result.status;
  }

  get isCompleted(): boolean {
    return this.normalizedStatus === 'completed' || this.normalizedStatus === 'succeeded';
  }

  get isFailed(): boolean {
    return this.normalizedStatus === 'failed' || this.normalizedStatus === 'error';
  }
}
