import { optimalAddBookBetter } from "./setBuilder"
import { breakerSequences, discoutSwitch, groupRepeats } from "./utils"

export type Groups = Array<Set<number>>

type BetterDiscont = (books: Array<number>) => number
type GroupingFunction = (map: any) => Array<Groups>
type Remainder = Array<any>
type GroupBuilder = (base: Base) => Groups
type TotalDiscount = (groups: Groups) => Array<DiscountedWithFinalPrice>
type DiscountCalculator = (group: Groups) => Array<Discounted>
type TrasformArrayToMap = (books: Array<number>) => Map<number, number>

interface Discounted {
    set: Set<number>
    discount: number
}

interface DiscountedWithFinalPrice {
    set: Set<number>
    discount: number
    finalPrice: number
}

export interface Base {
    base: Array<Array<number>>,
    remainder: Array<number>
}

export const betterDiscontsForPurchase: BetterDiscont = (books) => {
    const priceReducer = (acc: number, cur: DiscountedWithFinalPrice) => acc += cur.finalPrice
    const sum = (acc: number, cur: number) => acc += cur

    return [books].flatMap(fromListToMapOfFrequency)
        .flatMap(constructGroups)
        .map(calculateTotalDiscount)
        .flatMap(d => d.reduce(priceReducer, 0))
        .reduce(sum, 0)
}

export const fromListToMapOfFrequency: TrasformArrayToMap = (books) => {
    return books.reduce(function (map: any, obj: number) {
        if (map[obj]) map[obj]++
        else map[obj] = 1;
        return map;
    }, {})
}

export const constructGroups: GroupingFunction = (map) => {
    const constructed = [map].map(getHigherFrequencyKey)
        .map(freq => makeBase(freq, map))
        .map(buildOptimalGroups)

    return constructed
}
const makeBase: (high: number, map: any) => Base = (high, map) => {
    const basex = makeBaseArr(high, map)
    const remainderx = makeRemainder(high, map)
    return {
        base: basex,
        remainder: remainderx
    }
}

const makeRemainder: (high: number, map: any) => Remainder = (high, map) => {
    return Object.entries(map)
        .filter((t: Array<any>) => t[0] != high)
        .flatMap(t => new Array(t[1]).fill(+t[0]))
}

const makeBaseArr = (high: number, map: any) => {
    return Array(map[high]).fill([high])
}

export const buildOptimalGroups: GroupBuilder = (base) => {

    let group: Array<Set<number>> = base.base.map(arr => new Set(arr))
    const remainderV1 = base.remainder

    const sequence = breakerSequences(remainderV1)
    const sequencev2 = groupRepeats(remainderV1)

    sequencev2.forEach(s => {
        let remainderX = Array.from(s)
        while (remainderX.length) {
            const { sets, remainder } = optimalAddBookBetter(group, remainderX)
            group = sets
            remainderX = remainder;
        }
    })

    return group
}

export const getHigherFrequencyKey = (map: any) => {
    let max = 0
    let key = -1
    Object.entries(map).forEach((t: Array<any>) => {
        if (t[1] > max) {
            max = t[1]
            key = +t[0]
        }
    })
    return key
}

const calculateDiscountsForGroup: DiscountCalculator = (group) => {
    return group.map(set => { return { set: set, discount: discoutSwitch(set.size) } })
}

const calculateTotalDiscount: TotalDiscount = (group) => {
    return calculateDiscountsForGroup(group)
        .map(g => {
            const { set, discount } = g
            const price = (set.size * 800)
            return {
                set,
                discount,
                finalPrice: price - (price * discount)
            }
        })
}
