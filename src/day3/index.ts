import * as _ from "lodash";
import { inspect, readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
    const height = data.length-1
    const width = data[0].length-1

    const symbols = data.map(l => Array.from(l.matchAll(/[^\d\.]/g))).flatMap((row, ri) => row.map(m => {return {r: ri, c: m['index']}}))    
        
    const neightbours = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
    const numbers = data.map(l => Array.from(l.matchAll(/\d+/g))).flatMap((row, ri) => row.map(m => {return {r: ri, c: m['index'], v: m[0], l: m[0].length}}))
        
    const cells = _.uniq(symbols.flatMap(s => neightbours.reduce((acc, curr) => { return [...acc, {r: inBounds(s.r!, curr[0], height), c: inBounds(s.c!, curr[1], width)}]}, [] as typeof symbols)))
    
    const res = numbers.map(n => {return {v: n.v, p: _.range(0,n.l).map(c => {return {r: n.r, c: n.c! + c}})}}).filter(n => n.p.some(c => _.find(cells, {r: c.r, c: c.c}))).map(r => r.v)
    
    console.log(_.sum(res.map(Number)))
    
}

function inBounds(r: number, curr: number, height: number): number {
    return Math.min(Math.max(r + curr, 0), height);
}

export function part2(data: string[]) {        
    const height = data.length-1
    const width = data[0].length-1
    let mi = 0

    const symbols = data.map(l => Array.from(l.matchAll(/\*/g))).flatMap((row, ri) => row.map((m) => {return {r: ri, c: m['index'], i: mi++}}))    
        
    const neightbours = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
    const numbers = data.map(l => Array.from(l.matchAll(/\d+/g))).flatMap((row, ri) => row.map(m => {return {r: ri, c: m['index'], v: m[0], l: m[0].length}}))
        
    const cells = _.uniq(symbols.flatMap(s => neightbours.reduce((acc, curr) => { return [...acc, {r: inBounds(s.r!, curr[0], height), c: inBounds(s.c!, curr[1], width), i: s.i}]}, [] as typeof symbols)))

    const matches = cells.flatMap(c => numbers.filter(n => _.find(_.range(0,n.l).map(c => {return {r: n.r, c: n.c! + c}}), {r: c.r, c: c.c})).map(n => {return {v: n.v, cv: c.i}}))
    const multi = Object.entries(_.countBy(matches, e => e.cv)).filter(e => e[1] > 1)    

    const v = matches.filter(m => multi.map(m => Number(m[0])).includes(m.cv))    

    const res = Object.entries(_.groupBy(v, i => i.cv)).map(([k,v]) => {return {[k]: _.uniq(v.map(i => Number(i.v)))}}).filter(i => Object.values(i)[0].length == 2).flatMap(i => Object.values(i)[0][0] * Object.values(i)[0][1])
    console.log(_.sum(res))
}