
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
    $(document).bind('touchmove',
        function(e) {
        }
    );
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
}

var CrazeCanvas = function() {
// Class for the canvas object.

    var cenX, cenY;
    var canvas;

    setTimeout(function() {
        canvas = document.getElementById('myCanvas');
        alert(canvas);
        canvas.height = window.innerHeight;
        canvas.width  = window.innerWidth;
        cenX = canvas.width  / 2;
        cenY = canvas.height / 2;
        variableInitializer();
        // Initialize the variables of the application.
        setupEventHandlers();
        // Set up the handlers for all the DOM events.
        canvas.drawNewImage();

    }, 2000);
    
    this.setStrokeColor = function(color) {
    // A function for setting the stroke color.
        this.getContext().strokeStyle = color;
    }

    this.getStrokeColor = function() {
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

    this.getCenter = function() {
    // A function for retrieving the current center of the canvas
        return {
            x: cenX,
            y: cenY
        }
    }

    this.setCenter = function(x,y){
    // A function for setting a new center to the canvas, not used for now.
        cenX = x;
        cenY = y;
    }
    this.width  = function() { return canvas.width;  }
    this.height = function() { return canvas.height; }
    // A couple functions for retrieving the dimensions of the canvas.
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
