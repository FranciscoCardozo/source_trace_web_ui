export type AnalysisStatusValue =
  | 'pending'
  | 'queued'
  | 'processing'
  | 'running'
  | 'completed'
  | 'failed'
  | 'error'
  | string;

export interface AnalysisGeneralInfo {
  projectName: string;
  mainLanguage: string;
  mainFramework: string;
  approxFileCount: number;
}

export interface AnalysisFunctionalAnalysis {
  summary: string;
}

export interface AnalysisEvidence {
  key: string;
  label: string;
}

export interface AnalysisStatusResponse {
  PK: string;
  SK: string;
  status: AnalysisStatusValue;
  createdAt: string;
  updatedAt: string;
  generalInfo?: AnalysisGeneralInfo;
  functionalAnalysis?: AnalysisFunctionalAnalysis;
  componentsIdentified?: string[];
  architecturePattern?: string;
  evidences?: AnalysisEvidence[];
}

/** Respuesta de /V1/product/analysis/uploadUrl */
export interface UploadUrlResponse {
  uploadId: string;
  bucket: string;
  key: string;
  /** Ruta final del artefacto: s3://bucket/key */
  artifactPath: string;
  method: string;
  /** URL prefirmada a la que se hace el PUT del archivo. */
  url: string;
  /** Headers exactos que exige la firma; deben enviarse tal cual en el PUT. */
  headers: Record<string, string>;
  expiresIn: number;
}

/** Respuesta de /V1/product/analysis/invoke */
export interface StartAnalysisResponse {
  jobId: string;
  executionArn?: string;
  startDate?: string;
  status?: string;
}
