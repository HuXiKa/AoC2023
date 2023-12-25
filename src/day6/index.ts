import * as _ from "lodash";
import { readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
    const lines = data.flatMap(l => l.match(/\d+/g)?.map(Number))    
    const pairs = _.zip(lines.splice(0, lines.length/2), lines) as any as number[][]
    const r = pairs.map(([t,dst]) => {
        return _.zip(_.range(0,t+1), _.range(t,0-1)).map(([t,d]) => {
            const v = t!//(t!*t!+t!)/2
            return [d!*v, dst]
        })
    })
    const res = r.map(m => m.filter(([s,r]) => s > r))
    console.log(res.map(i => i.length).reduce((a,b) => a*b))
}

export function part2(data: string[]) {        
    const pairs = data.map(l => l.match(/\d+/g)?.join('')).map(Number)
    const res = _.range(1,pairs[0]+2).map(i => func(i, pairs[0]))
    console.log(res.filter(r => r > pairs[1]).length)
}

function func(n: number, v: number) {
    return Math.max(0, -(-(v+1) + n) * (-1 + n))
}
