import { LinkedListValue } from '../doubly-linked-list/linked-list-value';

/**
 * Chain basic value
 * Describes fields which must exist in every chain value
 */
export interface MessageChainValue<ChainId> extends LinkedListValue<ChainId> {
  /**
   * Timestamp to determine freshness of item
   */
  updated: number;
  unSynced?: boolean;
}
