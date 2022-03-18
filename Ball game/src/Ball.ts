interface ball {
    id: number;
    y: number;
    x: number;
    div: HTMLDivElement;
}

class Ball implements ball {
    id: number;
    readonly colors: string[] = ["red", "orange", "cyan", "white", "black", "yellow", "lime"]
    public y: number;
    public x: number;
    public color: string;
    div: HTMLDivElement;

    constructor(id: number, y: number, x: number) {
        var el: HTMLDivElement = document.createElement("div")
        el.className = "ball"
        el.id = `${id}`
        let color: number = Math.floor(Math.random() * 7);
        el.style.background = this.colors[color]
        this.div = el
        this.id = id
        this.x = x
        this.y = y
        this.color = this.colors[color]
    }

    changeYX(y: number, x: number) {
        this.x = x
        this.y = y
    }

}

export { Ball };