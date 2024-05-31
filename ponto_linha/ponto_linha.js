const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
    alert("WebGL não suportado, tente usar um navegador diferente.");
}

let drawMode = 'points';
let points = [];
let pointCount = 0;

// Shaders
const vertexShaderSource = `
    attribute vec4 aVertexPosition;
    void main(void) {
        gl_Position = aVertexPosition;
    }
`;

const fragmentShaderSource = `
    void main(void) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
`;

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Não foi possível inicializar o shader: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('Ocorreu um erro ao compilar o shader: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

const shaderProgram = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
const programInfo = {
    attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    },
    program: shaderProgram,
};

function setDrawMode(mode) {
    drawMode = mode;
    points = [];
    pointCount = 0;
    drawScene();
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const glX = (x / canvas.width) * 2 - 1;
    const glY = (y / canvas.height) * -2 + 1;

    if (drawMode === 'line' && pointCount < 2) {
        points.push(glX, glY);
        pointCount++;
        if (pointCount === 2) {
            drawScene();
            pointCount = 0;
            points = [];
        }
    } else if (drawMode === 'points') {
        points.push(glX, glY);
        drawScene();
    }
});

function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (points.length > 0) {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

        gl.useProgram(programInfo.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

        if (drawMode === 'line' && points.length === 4) {
            gl.drawArrays(gl.LINES, 0, 2);
        } else if (drawMode === 'points') {
            gl.drawArrays(gl.POINTS, 0, points.length / 2);
        }
    }
}

function initWebGL() {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);  // Clear to white, fully opaque
    gl.clear(gl.COLOR_BUFFER_BIT);      // Clear the color buffer with specified clear color
}

initWebGL();