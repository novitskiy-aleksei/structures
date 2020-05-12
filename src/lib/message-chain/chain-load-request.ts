import { RetrieveDirection } from './retrieve-direction';

export interface ChainLoadRequest {
  count: number;
  direction: RetrieveDirection;
  from: any;
}
