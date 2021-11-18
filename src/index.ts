export type Groups = Array<Set<number>>
type BetterDiscont = (books: Array<number>) => number
type GroupingFunction = (map: any) => Array<Groups>
type Remainder = Array<any>
type TotalDiscount = (groups: Groups) => number
type DiscountCalculator = (group: Groups) => Array<number>

interface Base {
    base: Array<Array<number>>,
    remainder: Array<number>
}

export const betterDiscontsForPurchase: BetterDiscont = (books) => {
    return [books].flatMap(fromListToMapOfFrequency)
        .flatMap(constructGroups)
        .map(calculateTotalDiscount)
        .sort().reverse()[0]
}

export const fromListToMapOfFrequency: (books: Array<number>) => Map<number, number> = (books) => {
    return books.reduce(function (map: any, obj: number) {
        if (map[obj]) map[obj]++
        else map[obj] = 1;
        return map;
    }, {})
}

export const constructGroups: GroupingFunction = (map) => {
    return [map].map(getHigherFrequencyKey)
        .map(freq => makeBase(freq, map))
        .map(buildGroupsWithRoundTrip)
}

type GroupBuilder = (base: Base) => Groups
export const buildGroupsWithRoundTrip: GroupBuilder = (base) => {
    const group: Array<Set<number>> = base.base.map(arr => new Set(arr))
    let remainder = base.remainder

    let roundTrip = 0
    let ite = remainder.shift()!
    while (remainder.length >= 0 && ite != undefined) {

        if (!group[roundTrip].has(ite)) {
            group[roundTrip].add(ite)
            ite = remainder.shift()!
        }

        if (roundTrip == group.length - 1) roundTrip = 0
        else roundTrip++
    }

    return group
}

export const makeBase: (high: number, map: any) => Base = (high, map) => {
    return {
        base: makeBaseArr(high, map),
        remainder: makeRemainder(high, map)
    }
}

export const makeRemainder: (high: number, map: any) => Remainder = (high, map) => {
    return Object.entries(map)
        .filter((t: Array<any>) => t[0] != high)
        .flatMap(t => new Array(t[1]).fill(+t[0]))
}

export const makeBaseArr = (high: number, map: any) => {
    return Array(map[high]).fill([high])
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

const discoutSwitch = (count: number) => {
    switch (count) {
        case 1: return 0
        case 2: return 0.05
        case 3: return 0.1
        case 4: return 0.15
        case 5: return 0.20
        default: return 0.00
    }
}
export const calculateDiscountsForGroup: DiscountCalculator = (group) => {
    return group.map(set => set.size)
        .map(size => discoutSwitch(size))
}

export const calculateTotalDiscount: TotalDiscount = (group) => {
    return +calculateDiscountsForGroup(group).reduce((acc, cur) => acc += cur, 0).toPrecision(2)
}

export const toPercent: (decimal: number) => string = (decimal) => {
    return `${(decimal * 100)}%`
}