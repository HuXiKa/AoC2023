import * as _ from "lodash";
import { readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {    
    const p = data.map(r => {
        const m = r.split(' ').map(Number)
        let l = true
        let p = [m]
        while(l) {
            const d = _.last(p)!.slice(1).map(function(n, i) { return n - _.last(p)![i]; });
            p = [...p, d]
            if(_.first(d) == _.last(d)) l = false
        }
        return p
    })
    console.log(p)
    const res = p.map(m => _.sum(m.map(i => _.last(i))))
    console.log(_.sum(res))
}

export async function part2(data: string[]) {        
    const p = data.map(r => {
        const m = r.split(' ').map(Number).reverse()
        let l = true
        let p = [m]
        while(l) {
            const d = _.last(p)!.slice(1).map(function(n, i) { return n - _.last(p)![i]; });
            p = [...p, d]
            if(_.first(d) == _.last(d)) l = false
        }
        return p
    })
    console.log(p)
    const res = p.map(m => _.sum(m.map(i => _.last(i))))
    console.log(res)
    console.log(_.sum(res))
}