// author: Michał Skałka
var net;
var ui;
var game;
var pionek;
$(document).ready(function () {
    game = new Game()
    net = new Net() // utworzenie obiektu klasy Net
    ui = new Ui() // utworzenie obiektu klasy Ui
})