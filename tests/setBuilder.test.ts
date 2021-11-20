import { optimalAddBookBetter } from "../src/setBuilder"

describe('setBuilder', () => {

    test('builder', () => {

        optimalAddBookBetter([], [])

    })


    describe('optimal add book v2', () => {
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

})