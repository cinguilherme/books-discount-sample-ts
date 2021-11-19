import {
    betterDiscontsForPurchase,
    breakerSequences,
    fromListToMapOfFrequency,
    getHigherFrequencyKey,
    groupRepeats,
    makeBase, makeBaseArr,
    makeRemainder, optimalAddBookBetter, optimalAddBookToBestSetForBestDiscount
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

xdescribe('to map frequency', () => {
    test('to map of frequency', () => {

        expect(fromListToMapOfFrequency([1, 1, 2, 3]))
            .toStrictEqual({ 1: 2, 2: 1, 3: 1 })

        expect(fromListToMapOfFrequency([1, 2, 3, 3, 3]))
            .toStrictEqual({ 1: 1, 2: 1, 3: 3 })
    })
})

xdescribe('high and low frequency', () => {
    describe('high', () => {
        test('should be 1 with the frequency 5', () => {
            expect(getHigherFrequencyKey({ 1: 5, 2: 1, 4: 2 })).toBe(1)
        })
        test('should be 4 with the high frequncy of 2', () => {
            expect(getHigherFrequencyKey({ 1: 1, 2: 1, 4: 2 })).toBe(4)
        })
    })
})

xdescribe('makeBaseArr', () => {
    test('base should be [[1] [1] [1]]', () => {
        expect(makeBaseArr(1, { 1: 3, 2: 1, 3: 1 }))
            .toStrictEqual([
                [1], [1], [1]
            ])
    })
})

xdescribe('make remainder', () => {
    test('remainder should be 2,3,4', () => {
        expect(makeRemainder(1, { 1: 2, 2: 1, 3: 1, 4: 1 })).toStrictEqual([2, 3, 4])
    })
})

xdescribe('mase base', () => {
    expect(makeBase(1, { 1: 2, 2: 1, 3: 1 }))
        .toStrictEqual({
            base: [[1], [1]],
            remainder: [2, 3]
        })
})

xdescribe('optimalAddBookToBestSetForBestDiscount', () => {
    test('should make best decision to where to insert the new book resulting in the largest difference in discount and increasing the smallest set', () => {

        const baseSets = [
            new Set([1, 2, 3]),
            new Set([1, 2]),
        ]

        const expected = [
            new Set([1, 2, 3, 4]),
            new Set([1, 2]),
        ]

        const actual = optimalAddBookToBestSetForBestDiscount(baseSets, 4)
        expect(actual).toStrictEqual(expected)

    })
})

xdescribe('breakdown', () => {
    test('two groups of four expected', () => {
        const basket = [1, 1, 2, 2, 3, 3, 4, 5];

        betterDiscontsForPurchase(basket)
    })

    test('nice observation', () => {

        const basket = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 1, 2];

        const baseSets = [
            new Set([1, 2]),
            new Set([1, 2]),
            new Set([1, 2]),
        ]

        const afterBreak = [3, 3, 4, 4, 5, 5]

        let nextGroup = optimalAddBookToBestSetForBestDiscount(baseSets, 3)
        nextGroup = optimalAddBookToBestSetForBestDiscount(nextGroup, 4)
        nextGroup = optimalAddBookToBestSetForBestDiscount(nextGroup, 5)
        nextGroup = optimalAddBookToBestSetForBestDiscount(nextGroup, 3)
        nextGroup = optimalAddBookToBestSetForBestDiscount(nextGroup, 4)
        nextGroup = optimalAddBookToBestSetForBestDiscount(nextGroup, 5)
        console.log(nextGroup);
    })
})

xdescribe('combining breaker sequence with grouping', () => {

    test('should do appropriate groupings', () => {

        const baseSets = [
            new Set([1, 2]),
            new Set([1, 2]),
            new Set([1, 2]),
        ]

        const afterBreak = [3, 3, 4, 4, 5, 5]

        const realStuff = breakerSequences(afterBreak)
        let actual = undefined
        realStuff.forEach(s => {
            s.forEach(n => {
                actual = optimalAddBookToBestSetForBestDiscount(baseSets, n)
            })
        })
        const expected = [new Set([1, 2, 5, 3]), new Set([1, 2, 3, 4]), new Set([1, 2, 4, 5])]

        expect(actual).toStrictEqual(expected)
    })
})

xdescribe('breaker sequence', () => {

    test('breaker', () => {
        const arr = [1, 1, 2, 3]
        const actual = breakerSequences(arr)
        const expected = [new Set([1, 2, 3]), new Set([1])]
        expect(actual).toStrictEqual(expected)

    })

    test('breaker 2', () => {
        const arr = [1, 1, 2, 2, 2, 3]
        const actual = breakerSequences(arr)
        const expected = [new Set([1, 2, 3]), new Set([1, 2]), new Set([2])]
        expect(actual).toStrictEqual(expected)

    })

    test('breaker 3', () => {
        const arr = [1, 2, 2, 2, 3, 4, 5, 5, 5, 5]
        const actual = breakerSequences(arr)
        const expected = [new Set([1, 2, 3, 4, 5]),
        new Set([2, 5]),
        new Set([2, 5]),
        new Set([5])]
        expect(actual).toStrictEqual(expected)

    })

})

xdescribe('optimal add book v2', () => {
    test('test optimal strat v2', () => {

        const baseSets = [
            new Set([1, 2]),
            new Set([1, 2]),
            new Set([1, 2]),
        ]

        const afterBreak = [3, 3, 4, 4, 5, 5]

        const { sets, remainder } = optimalAddBookBetter(baseSets, afterBreak)

        console.log(sets);
        console.log(remainder);
    })
})

describe('group repeats', () => {
    test('make list repeats', () => {

        const list = [1, 1, 3, 4, 5, 2, 1, 2]
        const actual = groupRepeats(list)
        console.log(actual);
        
        expect(actual).toStrictEqual([
            [1, 1, 1],
            [2, 2],
            [3],
            [4],
            [5]
        ])
    })
})