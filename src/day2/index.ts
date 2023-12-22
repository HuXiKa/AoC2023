import * as _ from "lodash";
import { readFile } from "../utils"
import wordsToNumbers from 'words-to-numbers';

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {        
    const res = data.map(d => {
        const l = d.split(":")
        const i = Number(_.last(l[0].split(" ")))
        const r = l[1].split("; ").reduce((acc, curr) => {
            const g = curr.trim().split(', ')
            const r = g.reduce((a, c) => {
                const s = c.split(" ")
                switch(s[1]) {
                    case "red": {
                        return {...a, r: Math.max(Number(s[0]), a.r)}
                    } 
                    case "blue": {
                        return {...a, b: Math.max(Number(s[0]), a.b)}
                    }
                    case "green": {
                        return {...a, g: Math.max(Number(s[0]), a.g)}
                    }
                    default: return a
                }
            }, acc)
            return r;
        }, {r: 0, g: 0, b: 0});
        return {i, ...r};
    })
    console.log(_.sum(res.filter(r => r.r <= 12 && r.g <= 13 && r.b <= 14).map(r => r.i)))
}

export function part2(data: string[]) {        
    const res = data.map(d => {
        const l = d.split(":")
        const i = Number(_.last(l[0].split(" ")))
        const r = l[1].split("; ").reduce((acc, curr) => {
            const g = curr.trim().split(', ')
            const r = g.reduce((a, c) => {
                const s = c.split(" ")
                switch(s[1]) {
                    case "red": {
                        return {...a, r: Math.max(Number(s[0]), a.r)}
                    } 
                    case "blue": {
                        return {...a, b: Math.max(Number(s[0]), a.b)}
                    }
                    case "green": {
                        return {...a, g: Math.max(Number(s[0]), a.g)}
                    }
                    default: return a
                }
            }, acc)
            return r;
        }, {r: 0, g: 0, b: 0});
        return {i, ...r};
    })    
    console.log(_.sum(res.map(r => r.r * r.g * r.b)))
}