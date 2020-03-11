import { RetrieveDirection } from './retrieve-direction';

export interface LoadRequest {
  count?: number;
  direction: RetrieveDirection;
  from: any;
}
