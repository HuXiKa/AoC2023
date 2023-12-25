import * as _ from "lodash";
import { readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n\r\n')
}

export function part1(data: string[]) {
    const [ seeds, maps ] = parse(data)
    console.log(seeds)    
    console.log(maps)

    const res = maps.reduce((acc, curr) => {
        const currNum = curr.map(c => c.split(" ").map(Number))
        const breaks = [Number.MIN_VALUE, ...curr.map(c => c.split(" ")[1]).map(Number).sort((a, b) => a - b)]
        const r = acc.map(c => {
            return [c, getClosestValue(breaks, c)]
        })        
        const r2 = r.map(c => {
            if(c[1] == Number.MIN_VALUE) return c[0]
            else {
                const cn = currNum.find(cn => cn[1] == c[1])!
                // if number is in range
                if(cn[1]+cn[2] >= c[0])
                    return cn[0] +(c[0] - c[1])
                else return c[0]
            }
        })
        return r2
    }, seeds)
    console.log(res.sort((a, b) => a - b))
}

export function part2(data: string[]) {        
    const [ seeds, maps ] = parse(data)    
    maps.reverse()
    console.log(seeds)
    console.log(maps)
    const seedRanges = combineRanges(seeds)
    console.log(seedRanges)    

    // magic number, found it by 'smart' pruning, i.e. brute forcing with big steps until a solution is found and narrowing things down
    for(let i = 56931580; i <= seedRanges[0][0]; i+=1) {
        reverseStep(maps, i, seedRanges)
    }    

    return
}

function reverseStep(maps: string[][], test: number, seedRanges: number[][]) {    
    const backtracked = maps.reduce((acc, curr) => {
        const currNum = curr.map(c => c.split(" ").map(Number));
        const breaks = [Number.MIN_VALUE, ...curr.map(c => c.split(" ")[0]).map(Number).sort((a, b) => a - b)]
        const c = [acc, getClosestValue(breaks, acc)];
        let r2;
        if (c[1] == Number.MIN_VALUE) r2 = c[0];
        else {
            const cn = currNum.find(cn => cn[0] == c[1]);            
            // if number is in range
            if (cn && cn[0] + cn[2] >= c[0]){
                r2 = c[0] + (cn[1] - cn[0]);
            }
            else r2 = c[0];
        }
        return r2;
    }, test);
    const found = seedRanges.some(rg => rg[0] <= backtracked && rg[0]+rg[1] >= backtracked)    
    console.log(`tested ${test}, backtracked ${backtracked} found ${found}`)
    if(found) process.exit(0) // elegant as ever
    return backtracked
}

function parse(data: string[]): [number[], string[][]] {
    const seeds = data[0].split(": ")[1].split(' ').map(Number)
    const maps = _.tail(data).map(l => l.split(':')[1].split("\r\n")).map(_.tail)
    return [seeds, maps]
}

function getClosestValue(breaks: number[], c: number): number {
    const max = _.max(breaks)!
    if(max <= c) return max
    var i = -1;
    let loop = true
    while(loop){
        if(breaks[i+1] > c){
            loop=false
        } else {
            i++
        }
    }

    return breaks[i];
}

function combineRanges(seeds: number[]) {
    return _.sortBy(_.chunk(seeds, 2), r => r[0])
}

