var canvas;
var gl;
var points = [];
var shaderProgram;
var bufferId;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    // Load shaders and initialize attribute buffers
    shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(shaderProgram);

    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * 1000, gl.DYNAMIC_DRAW);

    var vPosition = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    canvas.addEventListener("mousedown", function(event) {
        var rect = canvas.getBoundingClientRect();
        var x = 2 * (event.clientX - rect.left) / canvas.width - 1;
        var y = 2 * (rect.bottom - event.clientY) / canvas.height - 1;

        points.push(vec2(x, y));

        if (points.length % 2 === 0) {
            render();
        }
    });
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (points.length >= 2) {
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
        for (var i = 0; i < points.length; i += 2) {
            gl.drawArrays(gl.LINES, i, 2);
        }
    }
}

// Vertex shader program
var vertexShaderText = `
    attribute vec4 vPosition;
    void main() {
        gl_Position = vPosition;
    }
`;

// Fragment shader program
var fragmentShaderText = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
`;

function initShaders(gl, vertexShaderId, fragmentShaderId) {
    var vertShdr = gl.createShader(gl.VERTEX_SHADER);
    var fragShdr = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertShdr, vertexShaderText);
    gl.shaderSource(fragShdr, fragmentShaderText);

    gl.compileShader(vertShdr);
    gl.compileShader(fragShdr);

    var program = gl.createProgram();
    gl.attachShader(program, vertShdr);
    gl.attachShader(program, fragShdr);
    gl.linkProgram(program);

    return program;
}

function flatten(a) {
    return new Float32Array(a.reduce((acc, val) => acc.concat(val), []));
}

function vec2(x, y) {
    return [x, y];
}