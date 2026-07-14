/**
 * @param previousLength how many rows there were *before* the removal
 * @param removedIndex   the index that was removed
 * @param startAt        0 for `display_order`, 1 for `day_number` ("Day 0" would be nonsense)
 */
export function shiftedOrderValues(
  previousLength: number,
  removedIndex: number,
  startAt: number
): { index: number; value: number }[] {
  const survivors = previousLength - 1
  const updates: { index: number; value: number }[] = []

  for (let index = removedIndex; index < survivors; index++) {
    updates.push({ index, value: index + startAt })
  }

  return updates
}
