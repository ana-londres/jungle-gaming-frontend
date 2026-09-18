import Decimal from 'decimal.js'

/** Compares canonical decimal strings without converting ETH to JavaScript numbers. */
export function compareEth(left: string, right: string) {
  return new Decimal(left).comparedTo(new Decimal(right))
}
