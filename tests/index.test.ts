import {
    betterDiscontsForPurchase,
    buildGroupsWithRoundTrip,
    calculateDiscountsForGroup,
    calculateTotalDiscount,
    fromListToMapOfFrequency,
    getHigherFrequencyKey,
    makeBase, makeBaseArr, makeRemainder, toPercent
} from '../src/index'


describe('better discount for purchase', () => {
    test('should be 35%', () => {
        const discount = betterDiscontsForPurchase([1, 1, 1, 2, 2, 3, 3, 4, 5, 5])

        expect(discount).toBe(0.35)
    })

    test('should be 20%', () => {
        const discount = betterDiscontsForPurchase([1, 1, 1, 4, 5, 5])

        expect(discount).toBe(0.15)
    })
})

describe('to map frequency', () => {
    test('to map of frequency', () => {

        expect(fromListToMapOfFrequency([1, 1, 2, 3]))
            .toStrictEqual({ 1: 2, 2: 1, 3: 1 })

        expect(fromListToMapOfFrequency([1, 2, 3, 3, 3]))
            .toStrictEqual({ 1: 1, 2: 1, 3: 3 })
    })
})

describe('high and low frequency', () => {
    describe('high', () => {
        test('should be 1 with the frequency 5', () => {
            expect(getHigherFrequencyKey({ 1: 5, 2: 1, 4: 2 })).toBe(1)
        })
        test('should be 4 with the high frequncy of 2', () => {
            expect(getHigherFrequencyKey({ 1: 1, 2: 1, 4: 2 })).toBe(4)
        })
    })
})

describe('makeBaseArr', () => {
    test('base should be [[1] [1] [1]]', () => {
        expect(makeBaseArr(1, { 1: 3, 2: 1, 3: 1 }))
            .toStrictEqual([
                [1], [1], [1]
            ])
    })
})

describe('make remainder', () => {
    test('remainder should be 2,3,4', () => {
        expect(makeRemainder(1, { 1: 2, 2: 1, 3: 1, 4: 1 })).toStrictEqual([2, 3, 4])
    })
})

describe('mase base', () => {
    expect(makeBase(1, { 1: 2, 2: 1, 3: 1 }))
        .toStrictEqual({
            base: [[1], [1]],
            remainder: [2, 3]
        })
})

describe('roud trip', () => {

    test('should build the groups', () => {

        const builded = buildGroupsWithRoundTrip(makeBase(1, { 1: 2, 2: 1, 3: 1 }))

        expect(builded).toStrictEqual([
            new Set([1, 2]),
            new Set([1, 3]),
        ])
    })

    test('should build the groups', () => {

        const builded = buildGroupsWithRoundTrip(makeBase(3, { 1: 2, 2: 1, 3: 5 }))

        expect(builded).toStrictEqual([
            new Set([3, 1]),
            new Set([3, 1]),
            new Set([3, 2]),
            new Set([3]),
            new Set([3]),
        ])
    })

})

describe('discount calculator', () => {
    test('should be good', () => {
        const builded = buildGroupsWithRoundTrip(makeBase(3, { 1: 2, 2: 1, 3: 5 }))
        const discounts = calculateDiscountsForGroup(builded)

        expect(discounts).toStrictEqual([0.05, 0.05, 0.05, 0, 0])
    })

    describe('total discount', () => {
        test('should be 15%', () => {
            const builded = buildGroupsWithRoundTrip(makeBase(3, { 1: 2, 2: 1, 3: 5 }))
            const total = calculateTotalDiscount(builded)

            expect(total).toEqual(0.15)
        })

        test('should present as percentage string', () => {
            const builded = buildGroupsWithRoundTrip(makeBase(3, { 1: 2, 2: 1, 3: 5 }))
            const total = calculateTotalDiscount(builded)
            const asStr = toPercent(total)

            expect(asStr).toBe("15%")
        })
    })
})