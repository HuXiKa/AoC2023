import * as _ from "lodash"
import { readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

const neighbours = {
    left:[0,-1],
    top:[-1,0],
    right:[0,+1],
    bottom:[+1,0]
}

export function part1(data: string[]) {    
    const height = data.length-1
    const width = data[0].length-1

    const map = convert(data)
    let start = {r: map.indexOf(map.find(l => l.includes(tiles.S))!)}
    const sl = {...start, c: map[start.r].indexOf(tiles.S)}
    
    function locate(l: { c: number, r: number }) {
        return {l: l, v: map[l.r][l.c]}
    }

    const neightbours = [neighbours.left, neighbours.top, neighbours.right, neighbours.bottom]

    let running = true
    let c = locate(sl)
    let v = [] as typeof c[]
    
    while(running) {
        const nn = neightbours.filter(n => outofBound(c,n,width,height)).map(n => {return {l: {r: n[0], c:n[1]}, v: map[c.l.r + n[0]][c.l.c + n[1]]}}).filter(n => canTravel(c,n))           
        v = [...v, c]
        const next = nn.filter(n => !v.some(v => v.l.r == c.l.r + n.l.r && v.l.c == c.l.c + n.l.c))
        if(next.length > 0)
            c = locate({r: c.l.r + next[0].l.r, c: c.l.c + next[0].l.c})
        else
            running = false
    }

    console.log(v.length / 2)
}

function outofBound(t: { l: { c: number, r: number }, v: number }, n: number[], width: number, height: number): unknown {
    const nr = t.l.r + n[0]
    const nc = t.l.c + n[1]
    return nr >= 0 && nr <= height && nc >= 0 && nc <= width
}

export async function part2(data: string[]) {        
    const height = data.length-1
    const width = data[0].length-1

    const map = convert(data)
    let start = {r: map.indexOf(map.find(l => l.includes(tiles.S))!)}
    const sl = {...start, c: map[start.r].indexOf(tiles.S)}
    
    function locate(l: { c: number, r: number }) {
        return {l: l, v: map[l.r][l.c]}
    }

    const neightbours = [neighbours.left, neighbours.top, neighbours.right, neighbours.bottom]

    let running = true
    let c = locate(sl)
    let v = [] as typeof c[]
    
    while(running) {
        const nn = neightbours.filter(n => outofBound(c,n,width,height)).map(n => {return {l: {r: n[0], c:n[1]}, v: map[c.l.r + n[0]][c.l.c + n[1]]}}).filter(n => canTravel(c,n))           
        v = [...v, c]
        const next = nn.filter(n => !v.some(v => v.l.r == c.l.r + n.l.r && v.l.c == c.l.c + n.l.c))
        if(next.length > 0)
            c = locate({r: c.l.r + next[0].l.r, c: c.l.c + next[0].l.c})
        else
            running = false
    }

    console.log(v)

	let fillMap: boolean[][] = Array.from(new Array((height + 1) * 2 + 2), () => new Array((width + 1) * 2 + 2).fill(false))

    fillMap[sl.r * 2 + 2][sl.c * 2 + 2] = true
    v.filter(n => n.v != tiles.S).map(p => {
        fillMap[p.l.r * 2 + 2][p.l.c * 2 + 2] = true
        tileConnections.get(p.v)!.forEach(t => {
            fillMap[p.l.r * 2 + t[0] + 2][p.l.c * 2 + t[1] + 2] = true
        })
    })

    const fmw = fillMap[0].length - 1
    const fmh = fillMap.length - 1

    const fill = [[0,0],[0,fmw],[fmh,0],[fmh,fmw]]

	while (fill.length > 0) {
		let [i, j] = fill.shift()!
        neightbours.filter(n => outofBound({l: {r: i, c: j}} as any,n,fmw,fmh)).map(n => {return {r: i + n[0], c:j + n[1]}}).forEach(n => {
            if (!fillMap[n.r][n.c]) {
                fillMap[n.r][n.c] = true
                fill.push([n.r, n.c])
            }
		})
    }

    const res = fillMap.reduce((acc, curr, curry) => curr.reduce((a, c, cy) => a + (!c && curry % 2 == 0 && cy % 2 == 0 ? 1 : 0), acc), 0)

    console.log(res)

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
])

function convert(data: string[]): number[][] {
    return data.map(l => [...l].map(c => tiles[c]))
}

function canTravel(current: { l: { c: number, r: number }, v: number }, targetDirection: { l: { c: number, r: number }, v: number }): boolean {
    const canAccept = tileConnections.get(current.v)!.some(c => c[0] === targetDirection.l.r && c[1] === targetDirection.l.c)
    const canComeTo = tileConnections.get(targetDirection.v)!.some(c => c[1] === -targetDirection.l.c && c[0] === -targetDirection.l.r)
    return canAccept && canComeTo
}