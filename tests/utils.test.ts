import { breakerSequences, groupRepeats } from '../src/utils'

describe('utils', () => {

    test('utils', () => {

        breakerSequences([1, 2, 3])
        groupRepeats([1, 2, 3])

    })

    describe('group repeats', () => {
        test('make list repeats', () => {

            const list = [1, 1, 3, 4, 5, 2, 1, 2]
            const actual = groupRepeats(list)

            expect(actual).toStrictEqual([
                [1, 1, 1],
                [2, 2],
                [3],
                [4],
                [5]
            ])
        })
    })

    describe('breaker sequence', () => {

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

})