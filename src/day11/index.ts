import * as _ from "lodash"
import { readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
    const expanded = data.map(convert)//_.unzip(expand(_.unzip(expand(data.map(convert)))))
    const galaxies = _.filter(expanded.flatMap((r, ri) => r.map((c, ci) => expanded[ri][ci] == 1 ? [ri,ci] : [])), i => i.length != 0)
    console.log(galaxies)
    const r = galaxies.flatMap(c => (galaxies.map(d => c.concat(d)))).map(([a,b,c,d]) => Math.abs(c-a) + Math.abs(d-b))
    console.log(r)
    console.log(_.sum(r) / 2)
}

function expand(data: number[][]): number[][] {
    return data.reduce((acc, curr) => [...acc, ...(curr.includes(1) ? [curr] : [curr, curr])], [] as number[][])
}

function expand2(data: number[][]) {
    return data.map((l, li) => l.includes(1) ? -1 : li).filter(i => i > 0)
}

export async function part2(data: string[]) {
    const m = data.map(convert)
    const er = expand2(m)
    const ec = expand2(_.unzip(m))
    const exr = 1000000
    const galaxies = _.filter(m.flatMap((r, ri) => r.map((c, ci) => m[ri][ci] == 1 ? [ri,ci] : [])), i => i.length != 0)
    console.log(galaxies)
    const r = galaxies.flatMap(c => (galaxies.map(d => c.concat(d)))).map(([a,b,c,d]) => {
        const rr = er.filter(e => Math.min(a,c) < e && Math.max(a,c) > e)
        const cc = ec.filter(e => Math.min(b,d) < e && Math.max(b,d) > e)
        return Math.abs(c-a) + Math.abs(d-b) + (rr.length + cc.length) * (exr - 1)
    })
    console.log(_.sum(r) / 2)
}

function convert(array: string): number[] {
    return [...array].map(c => c == '.' ? 0 : 1)
}

