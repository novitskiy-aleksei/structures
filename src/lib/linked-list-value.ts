/**
 * Data unit to use in linked list
 *
 * @param id - Unique item identifier across list
 * @param created - (optional) Timestamp to determine freshness of item
 *
 * @public
 */
export interface LinkedListValue<ListId> {
  id: ListId;
  created?: number;
}
