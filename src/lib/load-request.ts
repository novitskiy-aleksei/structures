import { RetrieveDirection } from './retrieve-direction';

/**
 * @internal
 */
export interface LoadRequest {
  count?: number;
  direction: RetrieveDirection;
  from: any;
}
