
class Menu {
    div_Preview: HTMLDivElement;
    div_Points: HTMLElement;

    constructor() {
        this.div_Preview = document.createElement("div")
        this.div_Preview.id = "preview"
        document.body.appendChild(this.div_Preview)

        this.div_Points = document.createElement("h1")
        this.div_Points.id = "points"
        this.div_Points.innerHTML = "Points: 0"
        document.body.appendChild(this.div_Points)
    }



}

export { Menu };