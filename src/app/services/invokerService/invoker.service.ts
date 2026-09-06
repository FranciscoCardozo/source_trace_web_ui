import { Injectable } from '@angular/core';
import config from '../../config';
import { AnalysisRequestBody } from '../../models/interfaces/analysisRequestBody.interface';
import { StartAnalysisResponse, UploadUrlResponse } from '../../models/interfaces/statusResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class InvokerService {
  private readonly baseUrl = config.invokerApiEndpoint;

  /**
   * Solicita (GET) una URL prefirmada para subir el artefacto a S3.
   * Los parámetros viajan como query string. El contentType queda incluido en
   * la firma: el PUT posterior debe usar exactamente el mismo (viene en response.headers).
   */
  async getUploadUrl(
    fileName: string,
    contentType?: string,
    projectId?: string
  ): Promise<UploadUrlResponse> {
    const params = new URLSearchParams({ fileName });
    if (contentType) params.set('contentType', contentType);
    if (projectId) params.set('projectId', projectId);

    const endpoint = `${this.baseUrl}${config.serviceEndpoints.getUploadUrl}?${params.toString()}`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`No se pudo generar el enlace de carga (${response.status}).`);
    }

    return response.json();
  }

  /**
   * Inicia el análisis. Según el origen se envían props distintas:
   * - GIT:    { sourceType: 'GIT', repoUrl }
   * - UPLOAD: { sourceType: 'UPLOAD', artifactPath, artifactFormat }
   */
  async startAnalysis(body: AnalysisRequestBody): Promise<StartAnalysisResponse> {
    const endpoint = `${this.baseUrl}${config.serviceEndpoints.startAnalysis}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`No se pudo iniciar el análisis (${response.status}).`);
    }

    return response.json();
  }
}
