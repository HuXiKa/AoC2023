import * as _ from "lodash";
import { readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
    const cards = data.map(l => l.split(": ")[1].split(" | ")).map(n => n.map(c => c.match(/\d+/g)?.map(Number)))
    const res = cards.map(c => _.intersection(c[0], c[1])).map(i => i.length).filter(i => i != 0).map(n => Math.pow(2, n-1))
    console.log(_.sum(res))    
}

export function part2(data: string[]) {        
    const cards = data.map(l => l.split(": ")[1].split(" | ")).map(n => n.map(c => c.match(/\d+/g)?.map(Number)))
    const wins = cards.map(c => _.intersection(c[0], c[1])).map((i, ci) => [ci+1, i.length]).map(n => [...n, 1, 0])    
    const res = wins.reduce((acc, curr, curry) => {
        _.range(1, curr[1] + 1).forEach(i => {
            const ind = curry + i
            console.log(curr, acc[ind])
            acc[ind] = [acc[ind][0], acc[ind][1], acc[ind][2] + curr[2], 1]
        })        
        return acc
    }, wins)
    console.log(_.sum(res.map(i => i[2])))
}