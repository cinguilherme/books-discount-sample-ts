import {
    Base,
    betterDiscontsForPurchase,
    buildGroupsWithRoundTrip,
    discoutSwitch,
    fromListToMapOfFrequency,
    getHigherFrequencyKey,
    makeBase, makeBaseArr, makePermutationsAndReturnTheBestDiscountResult, makeRemainder
} from '../src/index'


xdescribe('better discount for purchase', () => {

    test('two groups of four is cheaper than group of five plus group of three', () => {
        const basket = [1, 1, 2, 2, 3, 3, 4, 5];
        expect(betterDiscontsForPurchase(basket)).toEqual(5120);
    });

    test('only a single book', () => {
        const basket = [1];
        expect(betterDiscontsForPurchase(basket)).toEqual(800);
    });

    test('two of the same book', () => {
        const basket = [2, 2];
        expect(betterDiscontsForPurchase(basket)).toEqual(1600);
    });

    test('two different books', () => {
        const basket = [1, 2];
        expect(betterDiscontsForPurchase(basket)).toEqual(1520);
    });

    test('three different books', () => {
        const basket = [1, 2, 3];
        expect(betterDiscontsForPurchase(basket)).toEqual(2160);
    });

    test('four different books', () => {
        const basket = [1, 2, 3, 4];
        expect(betterDiscontsForPurchase(basket)).toEqual(2560);
    });

    test('five different books', () => {
        const basket = [1, 2, 3, 4, 5];
        expect(betterDiscontsForPurchase(basket)).toEqual(3000);
    });

    test('two groups of four is cheaper than group of five plus group of three', () => {
        const basket = [1, 1, 2, 2, 3, 3, 4, 5];
        expect(betterDiscontsForPurchase(basket)).toEqual(5120);
    });

    test('two groups of four is cheaper than groups of five and three', () => {
        const basket = [1, 1, 2, 3, 4, 4, 5, 5];
        expect(betterDiscontsForPurchase(basket)).toEqual(5120);
    });

    test('group of four plus group of two is cheaper than two groups of three', () => {
        const basket = [1, 1, 2, 2, 3, 4];
        expect(betterDiscontsForPurchase(basket)).toEqual(4080);
    });

    test('two each of first 4 books and 1 copy each of rest', () => {
        const basket = [1, 1, 2, 2, 3, 3, 4, 4, 5];
        expect(betterDiscontsForPurchase(basket)).toEqual(5560);
    });

    test('two copies of each book', () => {
        const basket = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
        expect(betterDiscontsForPurchase(basket)).toEqual(6000);
    });

    test('three copies of first book and 2 each of remaining', () => {
        const basket = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 1];
        expect(betterDiscontsForPurchase(basket)).toEqual(6800);
    });

    test('three each of first 2 books and 2 each of remaining books', () => {
        const basket = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 1, 2];
        expect(betterDiscontsForPurchase(basket)).toEqual(7520);
    });

    test('four groups of four are cheaper than two groups each of five and three', () => {
        const basket = [1, 1, 2, 2, 3, 3, 4, 5, 1, 1, 2, 2, 3, 3, 4, 5];
        expect(betterDiscontsForPurchase(basket)).toEqual(10240);
    });

    test('two groups of four and a group of five', () => {
        const basket = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5];
        expect(betterDiscontsForPurchase(basket)).toEqual(8120);
    });

    test('shuffled book order', () => {
        const basket = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3];
        expect(betterDiscontsForPurchase(basket)).toEqual(8120);
    });

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

describe('makePermutationsAndReturnTheBestDiscountResult', () => {

    const sample: Base = {
        base: [[1], [1], [1]],
        remainder: [2, 3, 4]
    }

    test('should be', () => {
        const res = makePermutationsAndReturnTheBestDiscountResult(sample, discoutSwitch)
        console.log(res);
        
        expect(res).toStrictEqual([
            new Set([1, 2]),
            new Set([1, 3]),
            new Set([1, 4]),
        ])
        console.log(res);

    })


    test('should fix this issue', () => {
        const basket = [1, 1, 2, 2, 3, 4];
        const baseX = {
            base: [[1], [1]],
            remainder: [2, 2, 3, 4]
        }

        const res = makePermutationsAndReturnTheBestDiscountResult(baseX, discoutSwitch)
        console.log(res);
        
    })

})