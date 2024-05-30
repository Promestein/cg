var canvas;
var gl;
var pointsIndividuais = [];
var pointsLinhas = [];
var program1;
var program2;
var bufferId;
var option = 0;
var pointSize = 10.0;


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    var menu = document.getElementById("mymenu");
    var button = document.getElementById("Button1");

    menu.addEventListener("click", function() {
        option = menu.selectedIndex;
         });

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    // Load shaders and initialize attribute buffers
    program1 = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program1);

    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * 1000, gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program1, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


    program2 = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program2);

    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * 1000, gl.DYNAMIC_DRAW);

    var vPosition = gl.getAttribLocation(program2, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    canvas.addEventListener("click", function(event){
        // if(option == 0){
            var rect = canvas.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;

            x = 2 * x / canvas.width - 1;
            y = 2 * (canvas.height - y) / canvas.height - 1;

            pointsIndividuais.push(vec2(x, y));

            gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(pointsIndividuais));
        // }else if(option == 1){
            var rect = canvas.getBoundingClientRect();
            var x = 2 * (event.clientX - rect.left) / canvas.width - 1;
            var y = 2 * (rect.bottom - event.clientY) / canvas.height - 1;

            pointsLinhas.push(vec2(x, y));

            if (pointsLinhas.length % 2 === 0) {
                render();
            }
        // }
        // console.log(pointsIndividuais);
        // console.log(pointsLinhas);
    });
    

    // render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram( program1 );
    for (var i = 0; i < pointsIndividuais.length; ++i) {
        gl.drawArrays(gl.POINTS, i, 1);
    }

    gl.useProgram( program2 );
    if (pointsLinhas.length >= 2 && option == 1) {
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(pointsLinhas));
        for (var j = 0; j < pointsLinhas.length; j += 2) {
            gl.drawArrays(gl.LINES, j, 2);
        }
    }

    requestAnimFrame(render);
}

function flatten(a) {
    return new Float32Array(a.reduce((acc, val) => acc.concat(val), []));
}