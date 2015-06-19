var offset;
var menuOpen = false;
var platform;

$(function() {
// When the document is ready, execute this function.
    canvas = new CrazeCanvas();
});

function divEscapedContentElement(message) {
// This function will sanitize text by transforming special characters into
// HTML entities, so that the browser displays them as entered instead of
// trying to present these as pure HTML code. <script></script> is nasty...
    return $('<div></div>').text(message);
}
// Text data the user inputs is untrusted they may try to XSS or something!
// <script>alert('XSS attack!');</script>     gets turned into...
// <div>&lt;script&gt;alert('XSS attack!');&lt/script&gt;</div>
// We DON'T want people to XSS in their names :-)


function setupEventHandlers() {
// This function sets the event handlers corresponding some actions like 
// changing things in the HTML document such as the checkboxes, number 
// inputs, sliders, or buttons. Thx @febuiles && JQuery <3
    $('#myCanvas').bind('touchmove', 
        function(e) {
            mousemove(null);
            e.preventDefault();
        }
    );
    $('#myCanvas').bind('touchstart',
        function(e) {
            mousedown(null);
        }
    );

    $('#myCanvas').bind('mousemove',
        function(e) {
            mousemove(e);
        }
    );
    $('#myCanvas').bind('mousedown',
        function(e) {
            mousedown(e);
        }
    );
    $('#myCanvas').bind('mouseup',
        function(e) {
            mouseup(e);
        }
    );
    $('#myCanvas').bind('mouseout',
        function(e) {
            mouseout(e);
        }
    );

    $(document).keydown(function(event) {
        if(event.which == 40) {
        // Going down.
            //if(menuOpen) return;
            offset += 20;
            if(offset > window.innerWidth / 2) { offset = window.innerWidth / 2; }
            $('#myCanvas').css({'margin-top' : '-' + offset + 'px'});
        }
        if(event.which == 38) {
        // Going up.
            //if(menuOpen) return;
            offset -= 20;
            if(offset < 0) { offset = 0; }
            $('#myCanvas').css({'margin-top' : '-' + offset + 'px'});
        }
        if(event.which == 78) {
        // N key, new image.
           canvas.drawNewImage();
        }
        if(event.which == 83) {
        // S key, save image.
           canvas.saveImage();
        }
        if(event.which == 77) {
        // M key, toggle menu?   
        }
    });
}

var CrazeCanvas = function() {
// Class for the canvas object.

    var cenX, cenY;
    var canvas;
    var cnv;

    this.getCnv = function() {
    // Get the copy canvas in JPEG
        return cnv;
    }

    this.setStrokeColor = function(color) {
    // A function for setting the stroke color.
        this.getContext().strokeStyle = color;
    }

    this.toDataURL = function() {
        return canvas.toDataURL();
    }

    this.getStrokeColor = function() {
    // For getting the current stroke color.
        return this.getContext().strokeStyle;
    }

    this.getContext = function() {
    // A function for retrieving the 2D context of the canvas.
        return canvas.getContext('2d');
    }

    this.drawNewImage = function() {
    // A function for cleaning the slate and also stop the Craze Mode.
        killCrazeMode();
        this.clearImage();
        this.resetCenter();
        this.resetScroll();
    }

    this.clearImage = function() {
        this.getContext().globalAlpha = 1.0;
        this.getContext().fillRect(0, 0, canvas.width, canvas.height);
    }

    this.saveImage = function(){
    // A function to save the current image
        killCrazeMode();
        window.open(canvas.toDataURL());
    }

    this.resetScroll = function() {
    // A function for resetting the scroll.
        if(platform != 'android' && platform != 'ios') {
            offset = window.innerHeight / 2;
        }
        else {
            offset = 0;
        }
        $('#myCanvas').css({'margin-top' : '-' + offset + 'px'});
    }

    this.getCenter = function() {
    // A function for retrieving the current center of the canvas
        return {
            x: cenX,
            y: cenY
        }
    }

    this.resetCenter = function() {
        cenX = canvas.width  / 2;
        cenY = canvas.height / 2;
    }

    this.setCenter = function(x,y){
    // A function for setting a new center to the canvas.
        cenX = x;
        cenY = y;
    }

    this.transcribe = function() {
        var cnvCtx = cnv.getContext('2d');
        cnvCtx.drawImage(canvas, 0, 0);
    }

    this.width  = function() { return canvas.width;  }
    this.height = function() { return canvas.height; }
    // A couple functions for retrieving the dimensions of the canvas.

    setTimeout(function() {
        // canvas = document.createElement('canvas');
        // canvas.id = 'myCanvas';
        // document.getElementById('superDiv').appendChild(canvas);
        canvas = document.getElementById('myCanvas');
        cnv    = document.createElement('canvas');
        if(platform != 'android' && platform != 'ios') {
            canvas.height = window.innerWidth;
            offset = window.innerHeight / 2;
        }
        else {
            canvas.height = window.innerHeight;
            cnv.height = canvas.height;
            offset = 0;
        }
        $('#myCanvas').css({'margin-top' : '-' + offset + 'px'});
        canvas.width  = window.innerWidth;
        cnv.width = canvas.width;
        this.resetCenter();
        variableInitializer();
        // Initialize the variables of the application.
        setupEventHandlers();
        // Set up the handlers for all the DOM events.
        this.drawNewImage();
    }, 1500);
}

function resetCenter() {
// To reset the center of the canvas.
    canvas.resetCenter();
}

function mousedown(e) {
// Global function for when the mouse is down, called from the controller when
// a ng-mousedown event triggers it.
    if(!e) {
        e = event;
    }
    if(craze){ killCrazeMode(); }
    doMouseDown(e);
}

function mousemove(e) {
// Global function for when the mouse is moved, called from the controller when
// a ng-mousemove event triggers it.
    if(!e) {
        e = event;
    }
    if(!craze){
        doMouseMove(e);
    }
}

function mouseup(e) {
// Global function for when the mouse is up, called from the controller when
// a ng-mouseup event triggers it.
    if(!e) {
        e = event;
    }
    doMouseUp(e);
}

function mouseout(e) {
// Global function for when the mouse is up, called from the controller when
// a ng-mouseup event triggers it.
    if(!e) {
        e = event;
    }
    if(!craze){
        doMouseUp(e);
    }
}
