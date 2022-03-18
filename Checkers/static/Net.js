// author: Michał Skałka
console.log("wczytano plik Net.js")

class Net {
    constructor() {
        this.playerName = ""
        this.playerColor = ""
        this.gameStatus = ""
        this.turn = ""
        this.turnTime = 30
        this.turnTimer
    }

    newUser(name) {
        $.ajax({
            url: "/",
            data: { action: "ADD_USER", user: name },
            type: "POST",
            success: function (data) {
                //czytamy odesłane z serwera dane
                console.log(data);
                var obj = JSON.parse(data)
                console.log(obj.response);
                $("#status").text(`${obj.response}`)
                if (obj.response == "USER_ADDED") {
                    $("#centerMenu").css("display", "none")
                    net.playerName = obj.user
                    net.playerColor = obj.playerColor
                    net.gameStatus = "waiting"
                    $("#info").html(`Witaj <em>${obj.user}</em>, grasz ${(obj.playerColor == "white") ? "białymi" : "pomarańczowymi"}`)
                    game.setCamera(obj.playerColor)
                    game.addCyliders()
                    net.wait()
                } else if (obj.response == "USER_EXIST") {
                    $("#info").html(`Jest już user <em>${obj.user}</em>, wybierz inny login`)
                    $("#tb1").val("")
                } else if (obj.response == "TOO_MANY_USERS") {
                    $("#info").html(`Witaj <em>${obj.user}</em>, jest już dwuch graczy :c`)
                    $("#tb1").val("")
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }

    clearArray() {
        $.ajax({
            url: "/",
            data: { action: "CLEAR_MAP" },
            type: "POST",
            success: function (data) {
                //czytamy odesłane z serwera dane
                // console.log(data);
                var obj = JSON.parse(data)
                $("#status").text(`${obj.response}`)
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }

    wait() {
        //---waiting---
        $("#loading").css("display", "block")
        var loading = "o O o"
        $("#loading").html(`Czekaj na drugiego gracza...<br>${loading}`)
        var licznik = 0
        let wiatForPlayer = setInterval(() => {
            $.ajax({
                url: "/",
                data: { action: "IS_SECOND_PLAYER" },
                type: "POST",
                success: function (data) {
                    //czytamy odesłane z serwera dane
                    var obj2 = JSON.parse(data)
                    if (obj2.userArray.length == 2) {
                        $("#shadow").css("display", "none")
                        $("#loading").css("display", "none")
                        net.gameStatus = "playing"
                        clearInterval(wiatForPlayer)
                        $("#info1").css("width", "200px")
                        $("#info1").css("height", "200px")
                        $("#info1").css("font-size", "25px")
                        $("#info1").css("line-height", "25px")
                        let mapText = ""
                        if (net.playerColor == "white") {
                            net.yourTurnTime()
                            var text = $("#info").html()
                            $("#info").html(`${text}; Podłączył się gracz <em>${obj2.userArray[1]}</em>, gra pomarańczowymi!`)
                            net.turn = "white"
                            net.arrayUpdate("start")
                            for (let j = 7; j >= 0; j--) {
                                for (let i = 0; i < 8; i++) {
                                    mapText += game.szachownica[i][j] + " "
                                }
                                mapText += "<br>"
                            }
                        }
                        else {
                            net.turn = "white"
                            for (let j = 0; j < 8; j++) {
                                for (let i = 7; i >= 0; i--) {
                                    mapText += game.szachownica[i][j] + " "
                                }
                                mapText += "<br>"
                            }
                            net.waitForPlayer()
                        }
                        $("#info1").html(mapText)
                    } else {
                        if (licznik % 4 == 0)
                            loading = "O o o"
                        else if (licznik % 4 == 1)
                            loading = "o O o"
                        else if (licznik % 4 == 2)
                            loading = "o o O"
                        else if (licznik % 4 == 3)
                            loading = "o O o"

                        $("#loading").html(`Czekaj na drugiego gracza...<br>${loading}`)
                    }
                    licznik++

                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                },
            });
        }, 500)
    }

    waitForPlayer() {
        $("#shadow").css("display", "block")
        $("#roundloading").css("display", "block")
        let time = 30
        $("#roundloading").html(`Ruch ma przeciwnik...<br>${time}`)
        let roundTimer = setInterval(() => {
            if (time == 0) {
                if (net.turn == "white")
                    net.turn = "orange"
                else
                    net.turn = "white"
                $("#shadow").css("display", "none")
                $("#roundloading").css("display", "none")
                net.yourTurnTime()
                clearInterval(roundTimer)
            } else {
                $.ajax({
                    url: "/",
                    data: { action: "ARRAY_CHECK", oldArray: JSON.stringify(game.szachownica) },
                    type: "POST",
                    success: function (data) {
                        var obj = JSON.parse(data)
                        if (obj.newArray != false) {
                            clearInterval(net.turnTimer)
                            // console.log("RUCH!");
                            if (net.turn == "white")
                                net.turn = "orange"
                            else
                                net.turn = "white"
                            console.log(obj.newArray);
                            game.szachownica = obj.newArray
                            clearInterval(roundTimer)
                            game.movePawn(obj.pawnToMove)
                            net.updateInfo1()

                            if (obj.toDelete != false) {
                                game.deleteByName(obj.toDelete)
                            }
                            $("#shadow").css("display", "none")
                            $("#roundloading").css("display", "none")
                            net.yourTurnTime()
                        }
                    },
                    error: function (xhr, status, error) {
                        console.log(xhr);
                    },
                });
                time--
                $("#roundloading").html(`Ruch ma przeciwnik...<br>${time}`)
            }

        }, 1000)
    }

    yourTurnTime = () => {
        this.turnTime = 30
        this.turnTimer = setInterval(() => {
            if (this.turnTime == 0) {
                if (game.isPawnSelected != false) {
                    game.isPawnSelected.object.unselect = "X"
                    game.lightUpArea(game.isPawnSelected.object.szachownicaX, game.isPawnSelected.object.szachownicaY, game.isPawnSelected.object.team, "unselect")
                }
                if (net.turn == "white")
                    net.turn = "orange"
                else
                    net.turn = "white"
                this.waitForPlayer()
                clearInterval(this.turnTimer)
            }
            this.turnTime--;
        }, 1000)
    }


    arrayUpdate(type, pawn, toDelete) {
        console.log("UPDATED!");
        $.ajax({
            url: "/",
            data: { action: "ARRAY_UPDATE", array: JSON.stringify(game.szachownica), type: type, pawnToMove: pawn, toDelete: toDelete },
            type: "POST",
            success: function (data) {
                if (type != "start")
                    clearInterval(net.turnTimer)
                var obj = JSON.parse(data)
                if (obj.type == "turn") {
                    net.waitForPlayer()
                    net.updateInfo1()
                    if (net.turn == "white")
                        net.turn = "orange"
                    else
                        net.turn = "white"
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }

    updateInfo1() {
        let mapText = ""
        if (this.playerColor == "white") {
            for (let j = 7; j >= 0; j--) {
                for (let i = 0; i < 8; i++) {
                    mapText += game.szachownica[i][j] + " "
                }
                mapText += "<br>"
            }
        }
        else {
            for (let j = 0; j < 8; j++) {
                for (let i = 7; i >= 0; i--) {
                    mapText += game.szachownica[i][j] + " "
                }
                mapText += "<br>"
            }
        }
        $("#info1").html(mapText)
    }
}