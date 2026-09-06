import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadFileComponent } from '../../components/upload-file/upload-file.component';
import { ArtifactFormat } from '../../models/enums/artifactFormat.enum';
import { SourceType } from '../../models/enums/sourceType.enum';
import { AnalysisRequestBody } from '../../models/interfaces/analysisRequestBody.interface';
import { StartAnalysisResponse } from '../../models/interfaces/statusResponse.interface';
import { BucketService } from '../../services/bucketService/bucket.service';
import { InvokerService } from '../../services/invokerService/invoker.service';

type AnalyzeMode = 'repo' | 'file';

@Component({
  selector: 'app-analyze-code',
  imports: [
    CommonModule,
    FormsModule,
    UploadFileComponent,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './analyze-code.component.html',
  styleUrl: './analyze-code.component.scss'
})
export class AnalyzeCodeComponent {
  mode: AnalyzeMode = 'repo';
  repoUrl = '';
  selectedFile: File | null = null;
  loading = false;
  loadingMessage = '';
  startedAnalysis: StartAnalysisResponse | null = null;

  constructor(
    private readonly invokerService: InvokerService,
    private readonly bucketService: BucketService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {}

  get canSubmit(): boolean {
    if (this.loading) return false;
    return this.mode === 'repo' ? this.isValidUrl(this.repoUrl) : !!this.selectedFile;
  }

  onModeChange(mode: AnalyzeMode) {
    this.mode = mode;
  }

  onFileSelected(file: File) {
    this.selectedFile = file;
  }

  onFileCleared() {
    this.selectedFile = null;
  }

  async submit() {
    if (!this.canSubmit) return;

    this.loading = true;
    this.startedAnalysis = null;

    try {
      const body =
        this.mode === 'repo' ? this.buildGitBody() : await this.buildUploadBody();

      this.loadingMessage = 'Iniciando análisis...';
      const result = await this.invokerService.startAnalysis(body);

      if (!result?.jobId) {
        throw new Error('El servicio no devolvió un identificador de análisis.');
      }

      this.startedAnalysis = result;
    } catch (error) {
      this.snackBar.open(this.toMessage(error), 'Cerrar', { duration: 6000 });
    } finally {
      this.loading = false;
      this.loadingMessage = '';
    }
  }

  goToValidation() {
    if (!this.startedAnalysis) return;
    this.router.navigate(['/validate'], {
      queryParams: { jobId: this.startedAnalysis.jobId }
    });
  }

  async copyJobId() {
    if (!this.startedAnalysis) return;
    try {
      await navigator.clipboard.writeText(this.startedAnalysis.jobId);
      this.snackBar.open('Identificador copiado', 'Cerrar', { duration: 2000 });
    } catch {
      this.snackBar.open('No se pudo copiar el identificador', 'Cerrar', { duration: 3000 });
    }
  }

  reset() {
    this.startedAnalysis = null;
    this.repoUrl = '';
    this.selectedFile = null;
  }

  private buildGitBody(): AnalysisRequestBody {
    return {
      sourceType: SourceType.GIT,
      repoUrl: this.repoUrl.trim()
    };
  }

  private async buildUploadBody(): Promise<AnalysisRequestBody> {
    const file = this.selectedFile!;
    const contentType = this.resolveContentType(file.name);

    this.loadingMessage = 'Generando enlace de carga...';
    const upload = await this.invokerService.getUploadUrl(file.name, contentType);

    this.loadingMessage = 'Subiendo archivo al bucket...';
    await this.bucketService.uploadSourceCode(upload.url, file, upload.headers);

    return {
      sourceType: SourceType.UPLOAD,
      artifactPath: upload.artifactPath,
      artifactFormat: this.resolveArtifactFormat(file.name)
    };
  }

  private resolveArtifactFormat(fileName: string): ArtifactFormat {
    return /\.tar\.gz$/i.test(fileName) ? ArtifactFormat.TAR_GZ : ArtifactFormat.ZIP;
  }

  /** contentType deterministico por extension; se firma en getUploadUrl y se reusa en el PUT. */
  private resolveContentType(fileName: string): string {
    if (/\.tar\.gz$/i.test(fileName)) return 'application/gzip';
    if (/\.zip$/i.test(fileName)) return 'application/zip';
    return 'application/octet-stream';
  }

  private isValidUrl(value: string): boolean {
    try {
      const url = new URL(value.trim());
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private toMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
  }
}
