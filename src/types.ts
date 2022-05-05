export interface LogRushClientOptions {
  dataSourceUrl: string;
  batchSize?: number;
}

export interface LogRushLog {
  log: string;
  timestamp: number;
}

export type LogRushApiStreamResponse = {
  id: string;
  alias: string;
  key: string;
};

export type LogRushApiSuccessResponse = {
  success: true;
};

export type LogRushApiErrorResponse = {
  message: string;
};
