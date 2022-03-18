import { Ball } from "./Ball"

export function wall(target: any, name: string, descriptor: any) {
    console.log("log z dekoratora")
    const method = descriptor.value
    descriptor.value = function (...args: any) {
        method.apply(this, args)
        console.log(this.wall)
        this.wall.style.display = "flex"
        let comment: string = ""
        if (this.points < 3000) {
            comment = "Oj słabiutko :c"
        } else if (this.points >= 3000 && this.points < 6000) {
            comment = "Ujdzie w tłumie.."
        } else if (this.points >= 6000 && this.points < 10000) {
            comment = "Woow!"
        } else if (this.points >= 10000) {
            comment = "Wymiatasz!"
        }
        this.wall.innerHTML = `<h3>Game over</h3></br><h3>Punkty: ${this.points}</h3></br><em>~ ${comment} ~</em>`
    }
}