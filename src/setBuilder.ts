import { discoutSwitch } from "./utils"

export const optimalAddBookBetter = (sets: Array<Set<number>>, remainder: Array<number>) => {
    let inserted = false

    const bestCandidate = getBestPossibleCandidateSetToAddNewBook(sets)
    for (var i = 0; i < remainder.length; i++) {
        if (!sets[bestCandidate.index].has(remainder[i])) {
            sets[bestCandidate.index].add(remainder[i])
            delete remainder[i]
            remainder = remainder.filter(v => v != undefined)
            inserted = true
            break
        }
    }

    return { sets: sets, remainder: remainder, inserted: inserted }
}

const getBestPossibleCandidateSetToAddNewBook = (sets: Array<Set<number>>) => {
    const diffHigh: number[] = buildDiscountDiffArray(sets)
    const highestDiffValM = Math.max(...diffHigh)
    const indexesX = getIndexesWithHighVal(diffHigh, highestDiffValM)
    return getBestCandidate(indexesX, sets)
}

const getBestCandidate = (indexes: Array<any>, subSets: Array<Set<number>>) => {
    const indexWithSize: Array<any> = indexes.map(i => {
        return {
            index: i,
            size: subSets[i].size
        }
    })

    let best = {
        index: -1,
        size: 1000
    }

    indexWithSize.forEach(c => {
        if (c.size == 3 || c.size < best.size) {
            best = c
        }
    })

    return best
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

