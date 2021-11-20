
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

type GroupRepeats = (arr: Array<number>) => Array<Array<number>>
export const groupRepeats: GroupRepeats = (arr) => {
    const list: Array<Array<number>> = [[], [], [], [], []]

    for (var i = 0; i < arr.length; i++) {
        list[arr[i] - 1].push(arr[i])
    }

    return list
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