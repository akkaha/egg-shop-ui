import * as math from 'mathjs'

export function mathSort(nums: any[]): string[] {
  try {
    const mathNums = nums.map(num => math.number(math.bignumber(math.eval(num))))
    const sortedNums = math.sort(mathNums as number[]) as number[]
    return sortedNums.map(num => num.toString())
  } catch (error) {
    console.error(error)
    return []
  }
}

export function mathIsNumeric(num: any): boolean {
  return !isNaN(num)
}
