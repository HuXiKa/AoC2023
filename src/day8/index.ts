import * as _ from "lodash";
import { readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n\r\n')
}

export function part1(data: string[]) {
    const steps = data[0]
    console.log(steps)
    const edges = data[1].split("\r\n").map(e => {        
        const l = e.split(' = ')
        const d = l[1].slice(1, -1).split(", ")
        return {s: l[0], l: d[0], r: d[1]}
    })
    console.log(edges)

    const lookup = _.memoize((s: string) => { return edges.find(e => e.s === s) }, (s: string) => [s].join())

    let node = 'AAA'
    let step = 0
    while(node != 'ZZZ') {
        const s = steps[step++ % steps.length]
        const e = lookup(node)!
        if(s == 'R') node = e.r
        else node = e.l
    }

    console.log(step)
}

export async function part2(data: string[]) {        
    const steps = data[0]
    const edges = data[1].split("\r\n").map(e => {        
        const l = e.split(' = ')
        const d = l[1].slice(1, -1).split(", ")
        return {s: l[0], l: d[0], r: d[1]}
    })
    console.log(edges)

    const lookup = _.memoize((s: string) => { return edges.find(e => e.s === s) }, (s: string) => [s].join())
    
    let nodes = edges.filter(e => e.s.endsWith("A"))    
    console.log(nodes)

    const r = nodes.map(n => {        
            let n2 = n
            let step = 0
            while(!n2.s.endsWith('Z')) {
                const s = steps[step++ % steps.length]        
                if(s == 'R') n2 = lookup(n2.r)!
                else n2 = lookup(n2.l)!
            }
            return [n, step]            
          })
    
    const nums = r.map(r => r[1] as number)
    const res = lowestCommonMultiply(...nums)
    console.log(res)
}

// https://stackoverflow.com/questions/41863426/javascript-least-common-multiple-algorithm
function greatestCommonDivider(x: number, y: number): number {
    if (y === 0) {
      return x;
    }
  
    return greatestCommonDivider(y, x % y);
}

function singleLowestCommonMultiply(x: number, y: number): number {
    return (x * y) / greatestCommonDivider(x, y);
}

function lowestCommonMultiply(...numbers: number[]): number {
    /**
     * For each number, get it's lowest common multiply with next number.
     * 
     * Then using new number, compute new lowest common multiply
     */
    return numbers.reduce((a, b) => {
        return singleLowestCommonMultiply(a, b);
    });
}