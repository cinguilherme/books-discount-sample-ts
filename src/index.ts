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

const bookPrice = 800

export const betterDiscontsForPurchase: BetterDiscont = (books) => {
    return [books].flatMap(fromListToMapOfFrequency)
        .flatMap(constructGroups)
        .map(calculateTotalDiscount)
        .flatMap(d => d.reduce((acc, cur) => acc += cur.finalPrice, 0))
        .reduce((acc, cur) => acc += cur, 0)
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
        .map(buildGroupsWithRoundTrip)

    return constructed

}

//bug! here the logic of combinations with better discounts are required
export const buildGroupsWithRoundTrip: GroupBuilder = (base) => {

    console.log(base);

    let group: Array<Set<number>> = base.base.map(arr => new Set(arr))
    const remainder = base.remainder
    
    const sequence = breakerSequences(remainder)
    sequence.forEach(s => {
        s.forEach(n => {
            group = optimalAddBookToBestSetForBestDiscount(group, n)    
        })
    })
    console.log(group);
    

    return group
}

const buildDiscountDiffArray = (subSets: Array<Set<number>>) => {
    const currDiscounts = subSets.map(s => discoutSwitch(s.size))
    const nextDiscounts = subSets.map(s => discoutSwitch(s.size + 1))
    const diff: Array<number> = []
    for (var i = 0; i < currDiscounts.length; i++) {
        diff.push(nextDiscounts[i] - currDiscounts[i])
    }
    return diff
}

const getIndexesWithHighVal: (diff: Array<number>, highval: number) => Array<number> = (diff, highval) => {
    const indexes = []
    for (var i = 0; i < diff.length; i++) {
        if (diff[i] == highval) {
            indexes.push(i)
        }
    }
    return indexes
}
const notAlreadyInSet = (set: Set<number>, book: number) => !set.has(book)
const alreadyInSet = (set: Set<number>, book: number) => set.has(book)
const getBestCandidate = (indexes: Array<any>, subSets: Array<Set<number>>) => {
    const indexWithSize = indexes.map(i => {
        return {
            index: i,
            size: subSets[i].size
        }
    })

    let smallest = {
        index: -1,
        size: 1000
    }
    indexWithSize.forEach(c => {
        if (c.size < smallest.size)
            smallest = c
    })
    return smallest
}

type OptimalAddBook = (sets: Array<Set<number>>, newBook: number) => Array<Set<number>>
export const optimalAddBookToBestSetForBestDiscount: OptimalAddBook = (sets, newBook) => {

    const notToTouch = sets.filter(set => alreadyInSet(set, newBook))
    const subSets = sets.filter(set => notAlreadyInSet(set, newBook))

    const diff: number[] = buildDiscountDiffArray(subSets)

    const highestDiffVal = Math.max(...diff)
    const indexes = getIndexesWithHighVal(diff, highestDiffVal)

    const smallest = getBestCandidate(indexes, subSets)

    subSets[smallest.index].add(newBook)

    return [...notToTouch, ...subSets]
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

export const discoutSwitch = (count: number) => {
    switch (count) {
        case 1: return 0
        case 2: return 0.05
        case 3: return 0.10
        case 4: return 0.20
        case 5: return 0.25
        default: return 0.00
    }
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

export const breakerSequences = (arr: Array<number>) => {

    const sets: Array<Set<number>> = []

    arr.forEach(n => {
        const candidates = sets.filter(s => !s.has(n))
        if (candidates.length == 0) {
            sets.push(new Set([n]))
        } else {
            candidates[0].add(n)
        }
    })

    return sets

}