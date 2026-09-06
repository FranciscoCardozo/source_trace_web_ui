import { Injectable } from '@angular/core';
import config from '../../config';
import { AnalysisStatusResponse } from '../../models/interfaces/statusResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private readonly baseUrl = config.statusApiEndpoint || config.invokerApiEndpoint;

  /**
   * Consulta el estado y los resultados de un análisis por su identificador.
   * El jobId viaja en el header 'x-job-id'.
   */
  async getAnalysisStatus(jobId: string): Promise<AnalysisStatusResponse> {
    const endpoint = `${this.baseUrl}${config.serviceEndpoints.getStatusAnalysis}`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-job-id': jobId
      }
    });

    if (response.status === 404) {
      throw new Error('No se encontró ningún análisis con ese identificador.');
    }

    if (!response.ok) {
      throw new Error(`No se pudo consultar el estado del análisis (${response.status}).`);
    }

    return response.json();
  }
}
