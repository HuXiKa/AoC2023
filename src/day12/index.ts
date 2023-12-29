import * as _ from "lodash"
import { inspect, readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
    const lines = data.map(l => l.split(' '))
    const combs = lines.map(l => l[0]).map(p => {
        const l = [...p].filter(c => c == '?').length
        return combinations(['.', '#'], l, l)
    }) 
    const ci = lines.map(l => [...l[0].matchAll(/\?/g)].map(m => m['index']!))

    const r = combs.map((lc,i) => lc.map(c => [...c].reduce((acc, curr, curry) => acc.substring(0, ci[i][curry]) + curr + acc.substring(ci[i][curry] + 1), lines[i][0])))
    const res = r.map((r, i) => r.map(m => [...m.matchAll(/\#+/g)].map(m => m[0].length)).filter(n => _.isEqual(n, [...lines[i][1].split(',')].map(Number))).length)
    console.log(_.sum(res))
}

export function part2(data: string[]) {
    const f = data.reduce((acc,curr) => {
        const [str, numsS] = curr.split(" ")
        const nums = numsS.split(",").map(Number)
      
        const strExpanded = [str, str, str, str, str].join("?")
        const numsExpanded = [...nums, ...nums, ...nums, ...nums, ...nums]
      
        return acc + countWays(strExpanded, numsExpanded)
    },0)

    console.log(f)
}

//https://gist.github.com/Nathan-Fenner/781285b77244f06cf3248a04869e7161
const countWays = _.memoize((line: string, runs: readonly number[]): number => {
    if (line.length === 0) {
      if (runs.length === 0) {
        return 1
      }
      return 0
    }
    if (runs.length === 0) {
      for (let i = 0; i < line.length; i++) {
        if (line[i] === "#") {
          return 0
        }
      }
      return 1
    }
  
    if (line.length < _.sum(runs) + runs.length - 1) {
      // The line is not long enough for all runs
      return 0
    }
  
    if (line[0] === ".") {
      return countWays(line.slice(1), runs)
    }
    if (line[0] === "#") {
      const [run, ...leftoverRuns] = runs
      for (let i = 0; i < run; i++) {
        if (line[i] === ".") {
          return 0
        }
      }
      if (line[run] === "#") {
        return 0
      }
  
      return countWays(line.slice(run + 1), leftoverRuns)
    }
    // Otherwise dunno first spot, pick
    return (
      countWays("#" + line.slice(1), runs) + countWays("." + line.slice(1), runs)
    )
  }, (line: string, runs: readonly number[]) => [line,runs].join())

//https://stackoverflow.com/questions/67411935/how-to-get-all-the-combinations-for-an-array-of-a-specific-length
function combinations<T>(arr: T[], min = 1, max: number): T[] {
  return [...Array(max).keys()]
    .reduce(
      (result) =>
        arr.concat(result.flatMap((val) => arr.map((char) => val + char))),
      [] as any[]
    )
    .filter((val) => val.length >= min)
}
