import * as _ from "lodash";
import { readFile } from "../utils"
import wordsToNumbers from 'words-to-numbers';

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {        
    const res = data.map((o) => {
        const nums = Array.from(o.match(/\d/g)!)
        const n = [_.head(nums), _.last(nums)].join('')
        return Number(n)
    })
    console.log(_.sum(res))
}

export function part2(data: string[]) {        
    const res = data.map((o) => {
        const r = o.matchAll(/(?<=(\d|one|two|three|four|five|six|seven|eight|nine))/g)
        const nums = Array.from(r).map(o => o[1])
        const mapped = nums.map(n => {
            const r = Number(n)
            if(isNaN(r)){
                return wordsToNumbers(n)
            } else {
                return r
            }
        })
        const n = [_.head(mapped), _.last(mapped)].join('')
        return Number(n)
    })
    console.log(_.sum(res))
}