var canvas;
var gl;
var pointsIndividuais = [];
var pointsLinhas = [];
var program1;
var program2;
var bufferId1;
var bufferId2;
var option = 0;
var pointSize = 10.0;

var t;
var numPolygons = 0;
var numIndices = [];
numIndices[0] = 0;
var start = [0];
var index = 0;


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    var menu = document.getElementById("mymenu");
    var button = document.getElementById("Button1");

    menu.addEventListener("click", function() {
        option = menu.selectedIndex;
                // gl.clearColor(0.8, 0.8, 0.8, 1.0);
        // gl.clear(gl.COLOR_BUFFER_BIT);
        // pointsIndividuais = [];
        // pointsLinhas = [];
         });

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    canvas.addEventListener("mousedown", function(event){
        if(option == 2){
            t  = vec2(2*event.clientX/canvas.width-1, 
            2*(canvas.height-event.clientY)/canvas.height-1);
            gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));

            // t = vec4(colors[cindex]);
            
            // gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
            // gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));

            numIndices[numPolygons]++;
            index++;
        } else 
        if(option == 0){
            t  = vec2(2*event.clientX/canvas.width-1, 
            2*(canvas.height-event.clientY)/canvas.height-1);

            pointsIndividuais.push(t);
            gl.bindBuffer( gl.ARRAY_BUFFER, bufferId1 );
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(pointsIndividuais));
            console.log(pointsIndividuais)
            console.log(gl.POINTS)
        }else if(option == 1){
            t  = vec2(2*event.clientX/canvas.width-1, 
            2*(canvas.height-event.clientY)/canvas.height-1);
            console.log(t)

            gl.bindBuffer( gl.ARRAY_BUFFER, bufferId2 );
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(t));
            pointsLinhas.push(t);
        }

    } );


    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    // Load shaders and initialize attribute buffers
    program1 = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program1);

    bufferId1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId1);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * 1000, gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program1, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


    program2 = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program2);

    bufferId2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * 1000, gl.DYNAMIC_DRAW);

    var vPosition = gl.getAttribLocation(program2, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram( program1 );
    for (var i = 0; i < pointsIndividuais.length; ++i) {
        gl.drawArrays(gl.POINTS, i, 1);
    }

    gl.useProgram( program2 );
    if (pointsLinhas.length >= 2 && option == 1) {
        // gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(pointsLinhas));
        for (var j = 0; j < pointsLinhas.length; j += 2) {
            gl.drawArrays(gl.LINES, j, 2);
        }
    }

    requestAnimFrame(render);
}

function flatten(a) {
    return new Float32Array(a.reduce((acc, val) => acc.concat(val), []));
}