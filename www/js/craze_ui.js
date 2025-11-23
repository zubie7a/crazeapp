var offsetY = 0;
var offsetX = 0;
var menuOpen = false;
var bigdim = Math.max(window.innerHeight, window.innerWidth);
var platform;
var blank = true;
// Meaning canvas is blank.

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
    $('#myCanvas').bind('touchend', 
        function(e) {
            mouseup(null);
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

    $(window).resize(function() {
        //resize just happened, pixels changed
        canvas.resetOffsets();
        canvas.resetMargins();
    });

    $(document).keydown(function(event) {
        if(event.which == 40) {
        // Going down.
            //if(menuOpen) return;
            offsetY += 20;
            if(offsetY > window.innerWidth / 2 - 42) { offsetY = window.innerWidth / 2 - 42; }
            $('#myCanvas').css({'margin-top' : '-' + (offsetY + 21) + 'px'});
        }
        if(event.which == 38) {
        // Going up.
            //if(menuOpen) return;
            offsetY -= 20;
            if(offsetY < 0) { offsetY = 0; }
            $('#myCanvas').css({'margin-top' : '-' + (offsetY + 21) + 'px'});
        }
        if(event.which == 78) {
        // N key, new image.
            canvas.pushLeft();
            canvas.drawNewImage();
        }
        if(event.which == 83) {
        // S key, save image.
        }
        if(event.which == 77) {
        // M key, toggle menu?
        }
        if(event.which == 85) {
        // U key, undo.
            canvas.undo();
        }
        if(event.which == 82) {
        // R key, redo.
            canvas.redo();
        }
    });
}

var CrazeCanvas = function() {
// Class for the canvas object.

    var cenX, cenY;
    var canvas;
    var cnv;

    var left  = [];
    var right = [];
    // Two 'stacks' for undoing/redoing drawings.


    this.transcribe = function() {
        var cnvCtx = cnv.getContext('2d');
        cnvCtx.drawImage(canvas, 0, 0);
    }

    this.getCnv = function() {
    // Get the copy canvas in JPEG
        return cnv;
    }

    this.pushLeft = function() {
    // A new element is pushed into the 'undo' stack (the previous image)
    // every time the user starts drawing ~ a new stroke is detected, and
    // this is the state of the canvas at the moment the stroke begins 
    // (so the contents of the current stroke are not part of it).
        if(blank) return;
        // If canvas is blank, do nothing.
        var leftCnv = document.createElement('canvas');
        // Create the new canvas to push to the left. Pushing the current
        // canvas 'as is' would not create a copy, we want separate states.
        leftCnv.width  = canvas.width;
        leftCnv.height = canvas.height;
        // Set the dimensions of this new canvas to match the previous canvas.
        var leftCtx = leftCnv.getContext('2d');
        leftCtx.drawImage(canvas, 0, 0);
        // Draw the previous canvas over the canvas to be stored.
        left.push(leftCnv);
        // Store the past drawing into the undo stack.
        if(left.length > 10) {
        // We'll have for now a limit of 10 undo operations, lets estimate
        // each canvas being at most 3mb in size being very rich in content.
            left.splice(0, 1);
        }
    }

    this.clearRight = function() {
        right = [];
        // Clear the 'redo' stack. If there are things on the 'redo' stack,
        // lets dispose of them once a new stroke is detected.
    }

    this.pushRight = function() {
    // A new element is pushed into the 'redo' stack (the current image), 
    // every time the user undoes an operation, to be able to restore an
    // undone operation.
        var rightCnv = document.createElement('canvas');
        // Create the new canvas to push to the right. Pushing the current
        // canvas 'as is' would not create a copy, we want separate states.
        rightCnv.width  = canvas.width;
        rightCnv.height = canvas.height;
        // Set the dimensions of this new canvas to match the current canvas.
        var rightCtx = rightCnv.getContext('2d');
        rightCtx.drawImage(canvas, 0, 0);
        // Draw the current canvas over the canvas to be stored.
        right.push(rightCnv);
        // Store the current drawing into the 'redo' stack.
        // No need to set a size limit, since it will be limited by the 'undo'
        // operations, limited by the length of the 'undo' stack, which has a
        // control for size limit.
    }

    this.redo = function() {
        if(right.length == 0) return;
        // If there's nothing to redo, return.
        this.pushLeft();
        var redoCnv = right[right.length - 1];
        // Get the last undone image.
        var canvasCtx = canvas.getContext('2d');
        // Get the current canvas.
        canvasCtx.drawImage(redoCnv, 0, 0);
        // Draw into the screen's canvas.
        right.splice(right.length - 1, 1);
        // Erase that last undone image.
    }

    this.undo = function() {
        if(left.length == 0) return;
        // If there's nothing to undo, return.
        this.pushRight();
        // Since the current image will be overwritten with a past one, lets
        // put the current image on the redo stack in case we want it back.
        var undoCnv = left[left.length - 1];
        // Get the last image.
        var canvasCtx = canvas.getContext('2d');
        // Get the current canvas.
        canvasCtx.drawImage(undoCnv, 0, 0);
        // Draw into the screen's canvas.
        left.splice(left.length - 1, 1);
        // Erase that last image.
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
        bigdim = Math.max(window.innerHeight, window.innerWidth);
        canvas.width = bigdim;
        canvas.height = bigdim;
        this.clearImage();
        this.resetCenter();
        this.resetOffsets();
        this.resetMargins();
        cnv.width = canvas.width;
        cnv.height = canvas.height;
        blank = true;
    }

    this.clearImage = function() {
        this.getContext().globalAlpha = 1.0;
        this.getContext().fillRect(0, 0, canvas.width, canvas.height);
    }

    this.saveImage = function(dataUrl){
    // A function to save the current image
        killCrazeMode();
        window.open(dataUrl);
    }

    this.resetOffsets = function() {
        if(canvas.width < window.innerWidth) {
        // Canvas width is lesser than window width, white bars.
            offsetX = -(window.innerWidth - canvas.width) / 2;
        }
        else {
        // Canvas with is bigger than window width, canvas clipped.
            offsetX = (canvas.width - window.innerWidth) / 2;
        }
        if(canvas.height < window.innerHeight) {
        // Canvas height is lesser than window height, white bars.
            offsetY = -(window.innerHeight - canvas.height) / 2;
        }
        else {
        // Canvas height is bigger than window height, canvas clipped.
            offsetY = (canvas.height - window.innerHeight) / 2;
        }
    }

    this.resetMargins = function() {
        if(canvas.width < window.innerWidth) {
        // Canvas width is lesser than window width, white bars.
            $('#myCanvas').css({'margin-left' : Math.abs(offsetX) + 'px'});
        }
        else {
        // Canvas with is bigger than window width, canvas clipped.
            $('#myCanvas').css({'margin-left' : '-' + offsetX + 'px'});
        }
        if(canvas.height < window.innerHeight) {
        // Canvas height is lesser than window height, white bars.
            $('#myCanvas').css({'margin-top' : Math.abs(offsetY) - 21 + 'px'});
        }
        else {
        // Canvas height is bigger than window height, canvas clipped.
            $('#myCanvas').css({'margin-top' : '-' + (offsetY + 21) + 'px'});
        }
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

    this.width  = function() { return canvas.width;  }
    this.height = function() { return canvas.height; }
    // A couple functions for retrieving the dimensions of the canvas.

    var self = this; // Store reference to 'this' for use inside setTimeout
    setTimeout(function() {
        canvas = document.getElementById('myCanvas');
        cnv    = document.createElement('canvas');
        canvas.width = bigdim;
        canvas.height = bigdim;
        if(canvas.width < window.innerWidth) {
        // Canvas width is lesser than window width, white bars.
            offsetX = -(window.innerWidth - canvas.width) / 2;
        }
        else {
        // Canvas with is bigger than window width, canvas clipped.
            offsetX = (canvas.width - window.innerWidth) / 2;
        }
        if(canvas.height < window.innerHeight) {
        // Canvas height is lesser than window height, white bars.
            offsetY = -(window.innerHeight - canvas.height) / 2;
        }
        else {
        // Canvas height is bigger than window height, canvas clipped.
            offsetY = (canvas.height - window.innerHeight) / 2;
        }
        if(canvas.width < window.innerWidth) {
        // Canvas width is lesser than window width, white bars.
            $('#myCanvas').css({'margin-left' : Math.abs(offsetX) + 'px'});
        }
        else {
        // Canvas with is bigger than window width, canvas clipped.
            $('#myCanvas').css({'margin-left' : '-' + offsetX + 'px'});
        }
        if(canvas.height < window.innerHeight) {
        // Canvas height is lesser than window height, white bars.
            $('#myCanvas').css({'margin-top' : Math.abs(offsetY) - 21 + 'px'});
        }
        else {
        // Canvas height is bigger than window height, canvas clipped.
            $('#myCanvas').css({'margin-top' : '-' + (offsetY + 21) + 'px'});
        }
        cnv.width = canvas.width;
        cnv.height = canvas.height;
        self.resetCenter();
        variableInitializer();
        // Initialize the variables of the application.
        setupEventHandlers();
        // Set up the handlers for all the DOM events.
        self.drawNewImage();
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