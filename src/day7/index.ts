import * as _ from "lodash";
import { inspect, readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
    const hands = data.map(l => l.split(" ")).map(l => {return {h: l[0], v: l[1]}})
    console.log(hands)
    const counts = hands.map(h => { return {...h, f: _.sortBy(freq(h.h), i => -i.v)}})    
    const types = _.sortBy(counts.map(c => {return {...c, t: handType(c.f)}}), i => -i.t)
    const ordered = types.sort((a,b) => handSorter(a,b,cardTypes))
    inspect(_.takeRight(ordered, 10))
    const res = ordered.reduce((acc,curr,curry) => acc+(curry+1)*Number(curr.v), 0)
    console.log(res)
}

function freq(h: string) {
    return Object.entries(_.groupBy(h)).map(([k, v]) => { return { k, v: v.length }; });
}

export function part2(data: string[]) {        
    const hands = data.map(l => l.split(" ")).map(l => {return {h: l[0], v: l[1]}})
    console.log(hands)
    const counts = hands.map(h => { return {...h, f: _.sortBy(freq(h.h), i => -i.v)}})    
    const types = _.sortBy(counts.map(c => {return {...c, t: handType2(c.f)}}), i => -i.t)
    const ordered = types.sort((a,b) => handSorter(a,b,cardTypes2))
    inspect(_.takeRight(ordered, 10))
    const res = ordered.reduce((acc,curr,curry) => acc+(curry+1)*Number(curr.v), 0)
    console.log(res)
}

const handTypes = {
    'highCard': 1,
    'pair': 2,
    'twoPairs': 3,
    'threeOfAKind': 4,
    'fullHouse': 5,
    'fourOfAKind': 6,
    'fiveOfAKind': 7,
}

function handType(f: { k: string; v: number; }[]): any {
    if(f[0].v === 5) return handTypes.fiveOfAKind
    else if(f[0].v === 4) return handTypes.fourOfAKind
    else if(f[0].v === 3 && f[1].v == 2) return handTypes.fullHouse
    else if(f[0].v === 3) return handTypes.threeOfAKind
    else if(f[0].v === 2 && f[1].v == 2) return handTypes.twoPairs    
    else if(f[0].v === 2) return handTypes.pair
    else return handTypes.highCard
}

function handType2(f: { k: string; v: number; }[]): any {    
    const jc = f.find(f => f.k == 'J')?.v ?? 0
    const nonJokerMax = f.filter(f => f.k != 'J')[0]
    if(f[0].v === 5 || (nonJokerMax.v + jc) == 5) return handTypes.fiveOfAKind
    else if(f[0].v === 4 || (nonJokerMax.v + jc) == 4) return handTypes.fourOfAKind
    else if((f[0].v === 3 && f[1].v == 2) || (f[0].v === 2 && f[1].v == 2 && jc == 1)) return handTypes.fullHouse
    else if(f[0].v === 3 || (nonJokerMax.v+jc) === 3) return handTypes.threeOfAKind
    else if(f[0].v === 2 && f[1].v == 2) return handTypes.twoPairs    
    else if(f[0].v === 2 || jc == 1) return handTypes.pair
    else return handTypes.highCard
}

const cardTypes = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'T': 10,
    'J': 11,
    'Q': 12,
    'K': 13,
    'A': 14,
}

const cardTypes2 = {
    'J': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'T': 10,    
    'Q': 12,
    'K': 13,
    'A': 14,
}


function handSorter(a: { t: any; f: { k: string; v: number; }[]; h: string; v: string; }, b: { t: any; f: { k: string; v: number; }[]; h: string; v: string; }, ct: typeof cardTypes) {
    if(a.t != b.t) return Math.sign(a.t - b.t)
    else {
        return compareHands(a.h, b.h, ct)
    }
}

function compareHands(h: string, h1: string,ct: typeof cardTypes) {    
    const i = findFirstDiff(h, h1)
    return Math.sign(ct[h.charAt(i)]-ct[h1.charAt(i)])
}

function findFirstDiff(str1: string, str2: string){ 
    return [...str1].findIndex((el, index) => el !== str2[index])
}
/* 
const order = "23456789TJQKA"
function getHandDetails(hand: string) {    
    const faces = Array.from(hand).map(a => String(order.indexOf(a.charAt(0)))).sort()
    //console.log(faces)
    const counts = faces.reduce(count, {})
    //console.log(counts)
    const duplicates = Object.values(counts).reduce(count, {}) as any[]
    //console.log(duplicates)
    const first = faces[0].charCodeAt(0)
    //console.log(first)
    const straight = faces.every((f, index) => f.charCodeAt(0) - first === index)
    //console.log(straight)
    let rank =
        (straight && 1) ||
        (duplicates[4] && 2) ||
        (duplicates[3] && duplicates[2] && 3) ||
        (straight && 5) ||
        (duplicates[3] && 6) ||
        (duplicates[2] > 1 && 7) ||
        (duplicates[2] && 8) ||
        9

    return { rank, value: faces.sort(byCountFirst).join("") }

    function byCountFirst(a: any, b: any) {
        //Counts are in reverse order - bigger is better
        const countDiff = counts[b] - counts[a]
        if (countDiff) return countDiff // If counts don't match return
        return b > a ? -1 : b === a ? 0 : 1
    }

    function count(c: any, a: any) {
        c[a] = (c[a] || 0) + 1
        return c
    }
}

function compareHands(h1: string[], h2: string[]) {
    console.log(`compare ${h1} and ${h2}`)
    let d1 = getHandDetails(h1[0])
    let d2 = getHandDetails(h2[1])
    if (d1.rank === d2.rank) {
        if (d1.value < d2.value) {
            return 1
        } else if (d1.value > d2.value) {
            return -1
        } else {
            return 0
        }
    }
    return d1.rank < d2.rank ? 1 : -1
}
*/