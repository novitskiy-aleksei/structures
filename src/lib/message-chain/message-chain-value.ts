import { LinkedListValue } from '../doubly-linked-list/linked-list-value';

/**
 * Chain basic value
 * Describes fields which must exist in every chain value
 *
 * @public
 */
export interface MessageChainValue<ChainId> extends LinkedListValue<ChainId> {
  /**
   * Timestamps to determine freshness of item
   *
   * Next item always created after previous one:
   * prev \> current \< next \< next
   */
  created: number;
  updated: number;
  unSynced?: boolean;
}
