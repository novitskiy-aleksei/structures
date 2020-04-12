import { RetrieveDirection } from './retrieve-direction';

/**
 * Metadata for list items dynamic load
 *
 * @internal
 */
export interface LoadMetadata {

  /**
   * Amount of items desired to load
   */
  count?: number;

  /**
   * Load direction
   */
  direction: RetrieveDirection;


  from: any;
}
