// author: Michał Skałka
console.log("wczytano plik Ui.js")

class Ui {
    constructor() {
        this.clickableElements()
    }

    clickableElements() {
        $("#bt1").on("click", function () {
            if ($("#tb1").val()) {
                let name = $("#tb1").val()
                net.newUser(name)
            }
            else {
                alert("Podaj nazwę użytkownika!")
            }
        })

        $("#bt2").on("click", function () {
            net.clearArray()
        })
    }
}