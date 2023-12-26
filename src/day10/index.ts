import * as _ from "lodash";
import { readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

const neighbours = {
    left:[-1,+0],
    top:[+0,-1],
    right:[1,+0],
    bottom:[+0,1]
}

export function part1(data: string[]) {    
    console.log(data.join("\r\n"))
    const height = data.length-1
    const width = data[0].length-1

    const map = convert(data)
    console.log(map)    
    let start = {r: map.indexOf(map.find(l => l.includes(tiles.S))!)}
    const sl = {...start, c: map[start.r].indexOf(tiles.S)}
    console.log(sl)
    
    function locate(l: { c: number; r: number; }) {
        return {l: l, v: map[l.r][l.c]}
    }

    /*const t = locate(sl)
    const neightbours = [neighbours.left, neighbours.top, neighbours.right, neighbours.bottom]
    const sn = neightbours.filter(n => outofBound(t,n,width,height)).map(n => {return {l: {r: n[0], c:n[1]}, v: map[t.l.r + n[0]][t.l.c + n[1]]}})
    console.log(sn)
    const f = sn.filter(n => canTravel(t,n))
    console.log(f)*/

    const neightbours = [neighbours.left, neighbours.top, neighbours.right, neighbours.bottom]

    let running = true
    let c = locate(sl)
    let v = [] as typeof c[]
    
    while(running) {
        console.log('current', c)
        console.log('visited', v)
        const nn = neightbours.filter(n => outofBound(c,n,width,height)).map(n => {return {l: {r: n[0], c:n[1]}, v: map[c.l.r + n[0]][c.l.c + n[1]]}}).filter(n => canTravel(c,n))
        console.log('nn', nn)
        if(nn.some(i => i.v === tiles.S)){
            running = false
        }                
        v = [...v, c]
        const next = nn.filter(n => !v.some(v => v.l.r == c.l.r + n.l.r && v.l.c == c.l.c + n.l.c))
        console.log('next', next)
        c = locate({r: c.l.r + next[0].l.r, c: c.l.c + next[0].l.c})
    }

    
}

function outofBound(t: { l: { c: number; r: number; }; v: number; }, n: number[], width: number, height: number): unknown {
    const nr = t.l.r + n[0]
    const nc = t.l.c + n[1]
    return nr >= 0 && nr <= height && nc >= 0 && nc <= width
}

export async function part2(data: string[]) {        
    console.log(data.join("\r\n"))
}

const tiles = {
    '.': 0,
    'S': 1,
    '|': 2,
    '-': 3,
    'L': 4,
    'J': 5,
    '7': 6,
    'F': 7,
}

const tileConnections = new Map<number, number[][]>([
    [tiles["."], []],
    [tiles["S"], [neighbours.left, neighbours.top, neighbours.right, neighbours.bottom]],
    [tiles["|"], [neighbours.top, neighbours.bottom]],
    [tiles["-"], [neighbours.left, neighbours.right]],
    [tiles["L"], [neighbours.top, neighbours.right]],
    [tiles["J"], [neighbours.left, neighbours.top]],
    [tiles["7"], [neighbours.left, neighbours.bottom]],
    [tiles["F"], [neighbours.right, neighbours.bottom]],
]);

function convert(data: string[]): number[][] {
    return data.map(l => [...l].map(c => tiles[c]))
}

function canTravel(t: { l: { c: number; r: number; }; v: number; }, n: { l: { c: number; r: number; }; v: number; }): boolean {
    const canAccept = tileConnections.get(t.v)!.some(c => c[0] === n.l.r && c[1] === n.l.c)
    const canComeTo = tileConnections.get(n.v)!.some(c => c[0] === -n.l.c && c[1] === -n.l.r)
    console.log(t, n, canAccept, canComeTo)
    return canAccept && canComeTo
}