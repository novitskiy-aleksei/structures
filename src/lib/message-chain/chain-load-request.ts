import { LoadDirection } from './load-direction';

/**
 * Describes request for initial loading or load more items, also used when applying update to chain
 * @public
 */
export interface ChainLoadRequest<ChainId> {
  /**
   * Amount of items to load
   */
  count?: number;

  /**
   * Direction for moving through chain - down to old elements or up to new
   */
  direction: LoadDirection;

  /**
   * Pointer item for retrieving or applying items.
   */
  from: ChainId;
}
