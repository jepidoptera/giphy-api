// jshint esversion: 6
// jshint multistr: true
class gifButton {
    constructor (name) {
        this.name = name;
        this.offset = 0;
        this.button = this.instantiate();
    }
    instantiate() {
        // create a button
        return $('<button>')
            .text (this.name)
            .on ('click', () =>{
                retrieveGifs(this.name, 10, this.offset);
                this.offset += 10;
            })
            .on ('contextmenu', (event) => {
                // delete with right click
                event.preventDefault();
                this.button.remove();
                subjects.splice(subjects.indexOf(this.name), 1);
                updateButtons();
            })
            // add to #buttons section
            .appendTo('#buttons');
    }
}

class gifImg {
    // pause/resumable gif
    constructor (animation, stillImage) {
        this.stillImg = $('<img>')
            .attr('src', stillImage)
            .on('click', this.pauseResume);
        this.playImg = $('<img>')
            .attr('src', animation)
            .on('click', this.pauseResume)
            .hide();
        // tag them to each other
        this.stillImg[0].alter = this.playImg;
        this.playImg[0].alter = this.stillImg;
        // add to #images
        $("#images").prepend(this.stillImg);
        $("#images").prepend(this.playImg);
    }

    pauseResume () {
        // switch still for animated or vice versa
        $(this).hide();
        this.alter.show();
    }
}

var buttons = [];
var subjects = [];
$(document).ready (() => {
    // get button list from storage
    subjects = JSON.parse(localStorage.getItem('subjects'));
    // defaults if there is nothing in storage
    if (subjects == null) subjects = ["cats", "dogs", "hamsters", "cheetahs", "pandas", "goats", "unicorns"];
    // generate initial buttons
    subjects.forEach((subject) => {
        buttons.push(new gifButton(subject));
    });
});

// user-generated button
function clickNewButton (event) {
    event.preventDefault(); 
    // get button name, and clear input
    var subject = $('#buttonName').val().trim();
    $('#buttonName').val("");
    // create a button
    buttons.push(new gifButton(subject));
    // remember this
    subjects.push(subject);
    // save buttons list locally
    updateButtons();
}

function updateButtons() {
    localStorage.setItem('subjects', JSON.stringify(subjects));
}

// find gifs on a subject
function retrieveGifs(subject, number, offset) {
    var url = "https://api.giphy.com/v1/gifs/search?" +
    "api_key=Eyu0Ju87bkrqmr2Eyvv9awBr9anCxodI" +
    "&q=" + subject +
    "&limit=" + number +
    "&offset=" + offset;
    // $("#images").empty();
    $.ajax(url, "GET").then ((response) => {
        // console.log(response);
        $("#images").prepend("<hr>");
        response.data.forEach((element, i) => {
            console.log("image " + i + ": ", element.images);
            new gifImg(element.images.fixed_height.url, element.images.fixed_height_still.url);
        });
    });
}