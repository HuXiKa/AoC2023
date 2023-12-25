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