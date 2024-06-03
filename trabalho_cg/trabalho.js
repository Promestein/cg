// var canvas;
// var gl;
// var pointsIndividuais = [];
// var pointsLinhas = [];
// var program1;
// var program2;
// var program3;
// var bufferId1;
// var bufferId2;
// var bufferId3;
// var colorBufferId1;
// var colorBufferId2;
// var colorBufferId3;
// var vPosition;
// var vColor;
// var option = 0;
// var pointSize = 10.0;
// var isRotating = false;
// var rotationAngle = 0.0;

// var t;
// var tColor = vec4(1.0, 1.0, 1.0, 1.0);
// var numPolygons = 0;
// var numIndices = [];
// numIndices[0] = 0;
// var start = [0];
// var indexPoligono = 0;
// var indexPonto = 0;
// var indexLinha = 0;
// var iniciar_selecao = false;
// var coresEscolhidas = [];
// var pickingColors;
// var currentPolygon;
// var uModelViewMatrixLoc;
// var modelViewMatrix;
// var isDragging = false;
// var previousMousePosition = { x: 0, y: 0 };
// var vertexPositions = [];


// window.onload = function init() {
//     canvas = document.getElementById("gl-canvas");

//     var menu = document.getElementById("menuFuncao");
//     var menuColor = document.getElementById("menuColor");
//     var desenhar = document.getElementById("buttonDraw");
//     var translacao = document.getElementById("translacao");
//     var rotacao = document.getElementById("rotacao");
//     var clear = document.getElementById("buttonClear");

//     menu.addEventListener("click", function() {
//         option = menu.selectedIndex;
//     });

//     menuColor.addEventListener("click", function() {
//         cindex = menuColor.selectedIndex;
//         if (cindex == 0) {
//             tColor = vec4(1.0, 1.0, 1.0, 1.0);
//         } else if (cindex == 1) {
//             tColor = vec4(0.0, 0.0, 0.0, 1.0);
//         } else if (cindex == 2) {
//             tColor = vec4(1.0, 0.0, 0.0, 1.0);
//         } else if (cindex == 3) {
//             tColor = vec4(0.0, 1.0, 0.0, 1.0);
//         } else if (cindex == 4) {
//             tColor = vec4(0.0, 0.0, 1.0, 1.0);
//         } else if (cindex == 5) {
//             tColor = vec4(1.0, 0.71, 0.76, 1.0);
//         }
//         console.log(tColor);
//     });

//     desenhar.addEventListener("click", function(){
//         numPolygons++;
//         numIndices[numPolygons] = 0;
//         start[numPolygons] = indexPoligono;
//         render();
//     });

//     translacao.addEventListener("click", function(){
//         if(option === 2){
//             iniciar_selecao = !iniciar_selecao;
//         }
//     });

//     rotacao.addEventListener("click", function() {
//         option = menu.selectedIndex;
//     });


//     clear.addEventListener("click", function(){
//         pointsIndividuais = [];
//         pointsLinhas = [];
//         numPolygons = 0;
//         numIndices = [];
//         numIndices[0] = 0;
//         start = [0];
//         indexPoligono = 0;
//         indexPonto = 0;
//         indexLinha = 0;
//         render();
//     });


//     gl = WebGLUtils.setupWebGL(canvas);
//     if (!gl) { alert("WebGL isn't available"); }

//     canvas.addEventListener("mousedown", function(event){
//         if(option == 0){ // pontos
//             var t = vec2(2 * event.clientX / canvas.width - 1, 2 * (canvas.height - event.clientY) / canvas.height - 1);

//             pointsIndividuais.push(t);
//             gl.bindBuffer( gl.ARRAY_BUFFER, bufferId1 );
//             gl.bufferSubData(gl.ARRAY_BUFFER, 8*indexPonto, flatten(t));

//             gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferId1 );
//             gl.bufferSubData(gl.ARRAY_BUFFER, 16*indexPonto, flatten(tColor));

//             indexPonto++;
//             render()
//         }else if(option == 1){ // linhas
//             var t = vec2(2 * event.clientX / canvas.width - 1, 2 * (canvas.height - event.clientY) / canvas.height - 1);
            
//             pointsLinhas.push(t);
//             gl.bindBuffer( gl.ARRAY_BUFFER, bufferId2 );
//             gl.bufferSubData(gl.ARRAY_BUFFER, 8*indexLinha, flatten(t));
            
//             gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferId2 );
//             gl.bufferSubData(gl.ARRAY_BUFFER, 16*indexLinha, flatten(tColor));

//             indexLinha++;
//             render()
//         }else if(option == 2){ // poligonos

//             if(!iniciar_selecao){
//                 var t = vec2(2 * event.clientX / canvas.width - 1, 2 * (canvas.height - event.clientY) / canvas.height - 1);
//                 vertexPositions.push(t);
//                 // usa o buffer de posicao
//                 gl.bindBuffer( gl.ARRAY_BUFFER, bufferId3 );
//                 gl.bufferSubData(gl.ARRAY_BUFFER, 8*indexPoligono, flatten(t));
                
//                 coresEscolhidas.push(tColor);
//                 // usa o buffer de cores
//                 gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferId3 );
//                 gl.bufferSubData(gl.ARRAY_BUFFER, 16*indexPoligono, flatten(tColor));
    
//                 numIndices[numPolygons]++;
//                 indexPoligono++;  
//             }else{

//                 isDragging = true;
//                 previousMousePosition = { x: event.clientX, y: event.clientY };

//                 gl.useProgram(program3);
//                 gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//                 gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

//                 // Gera uma cor para cada vertice de cada poligono
//                 pickingColors = [];
//                 for (var i = 0; i < numPolygons; i++) {
//                     var color = vec4((i + 1) / 255.0, 0.0, 0.0, 1.0);
//                     for (var j = start[i]; j < start[i] + numIndices[i]; j++) {
//                         pickingColors.push(color);
//                     }
//                 }

//                 // renderiza os poligonos com as cores do mapa de pick
//                 renderPicking();

//                 var x = event.clientX;
//                 var y = canvas.height - event.clientY;

//                 var pixels = new Uint8Array(4);
//                 gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

//                 gl.bindFramebuffer(gl.FRAMEBUFFER, null);

//                 render();

//                 var pickedColorIndex = pixels[0] - 1;
//                 if (pickedColorIndex >= 0 && pickedColorIndex < numPolygons) {
//                     currentPolygon = pickedColorIndex;
//                     console.log(currentPolygon);
//                 }
//             }
            
//         }
        

//     } );


//     // Função para arrastar o polígono
//     canvas.addEventListener("mousemove", function (event) {
//         if (isDragging && currentPolygon !== -1) {
//             var rect = canvas.getBoundingClientRect();
//             var dx = (event.clientX - previousMousePosition.x) / rect.width * 2;
//             var dy = -(event.clientY - previousMousePosition.y) / rect.height * 2;

//             // Atualizar a posição dos vértices do polígono selecionado
//             for (var i = start[currentPolygon]; i < start[currentPolygon] + numIndices[currentPolygon]; i++) {
//                 vertexPositions[i][0] += dx;
//                 vertexPositions[i][1] += dy;
//             }

//             previousMousePosition = { x: event.clientX, y: event.clientY };
//             render();
//         } else if (isRotating && currentPolygon !== -1) {
//             var deltaX = event.clientX - previousMousePosition.x;
//             rotationAngle += deltaX * 0.7;
//             previousMousePosition = { x: event.clientX, y: event.clientY };

//             render();
//         }
//     });

//     canvas.addEventListener("mouseup", function () {
//         isDragging = false;
//     });


//     // Configure WebGL
//     gl.viewport(0, 0, canvas.width, canvas.height);
//     gl.clearColor(0.8, 0.8, 0.8, 1.0);

//     // ------------------------- Configuração do programa de pontos ------------------------

//     program1 = initShaders(gl, "vertex-shader", "fragment-shader");
//     gl.useProgram(program1);

//     bufferId1 = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, bufferId1);
//     gl.bufferData(gl.ARRAY_BUFFER, 8 * 1000, gl.STATIC_DRAW);

//     // vPosition = gl.getAttribLocation(program1, "vPosition");
//     // gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
//     // gl.enableVertexAttribArray(vPosition);

//     colorBufferId1 = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId1);
//     gl.bufferData(gl.ARRAY_BUFFER, 16 * 1000, gl.STATIC_DRAW);

//     modelViewMatrix = mat4();
//     modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0, 0.0));
//     uModelViewMatrixLoc = gl.getUniformLocation(program1, "uModelViewMatrix");


//     // vColor = gl.getAttribLocation(program1, "vColor");
//     // gl.vertexAttribPointer(vColor, 2, gl.FLOAT, false, 0, 0);
//     // gl.enableVertexAttribArray(vColor);


//     // -------------------------------- Configuração do programa de linhas ----------------------
    
//     program2 = initShaders(gl, "vertex-shader", "fragment-shader");
//     gl.useProgram(program2);

//     bufferId2 = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2);
//     gl.bufferData(gl.ARRAY_BUFFER, 8 * 1000, gl.STATIC_DRAW);

//     // vPosition = gl.getAttribLocation(program2, "vPosition");
//     // gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
//     // gl.enableVertexAttribArray(vPosition);

//     colorBufferId2 = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId2);
//     gl.bufferData(gl.ARRAY_BUFFER, 16 * 1000, gl.STATIC_DRAW);

//     // vColor = gl.getAttribLocation(program2, "vColor");
//     // gl.vertexAttribPointer(vColor, 2, gl.FLOAT, false, 0, 0);
//     // gl.enableVertexAttribArray(vColor);

//     modelViewMatrix = mat4();
//     modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0, 0.0));
//     uModelViewMatrixLoc = gl.getUniformLocation(program2, "uModelViewMatrix");
    


//     // --------------------------- Configuração do programa de poligonos --------------------------
//     program3 = initShaders(gl, "vertex-shader", "fragment-shader");
//     gl.useProgram(program3);

//     bufferId3 = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, bufferId3);
//     gl.bufferData(gl.ARRAY_BUFFER, 8 * 1000, gl.STATIC_DRAW);

//     vPosition = gl.getAttribLocation(program3, "vPosition");
//     gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(vPosition);

//     colorBufferId3 = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId3);
//     gl.bufferData(gl.ARRAY_BUFFER, 16 * 1000, gl.STATIC_DRAW);

//     vColor = gl.getAttribLocation(program3, "vColor");
//     gl.vertexAttribPointer(vColor, 2, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(vColor);

//     // criação das texturas para o pick
//     var framebuffer = gl.createFramebuffer();
//     gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

//     var texture = gl.createTexture();
//     gl.bindTexture(gl.TEXTURE_2D, texture);
//     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
//     gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
//     gl.bindFramebuffer(gl.FRAMEBUFFER, null);

//     uModelViewMatrixLoc = gl.getUniformLocation(program3, "uModelViewMatrix");

//     render();
// }

// function render() {
//     gl.clear(gl.COLOR_BUFFER_BIT);

//     if (pointsIndividuais.length > 0) {
//         gl.useProgram(program1);
//         gl.bindBuffer(gl.ARRAY_BUFFER, bufferId1);
//         vPosition = gl.getAttribLocation(program1, "vPosition");
//         gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
//         gl.enableVertexAttribArray(vPosition);
//         gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId1);
//         vColor = gl.getAttribLocation(program1, "vColor");
//         gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
//         gl.enableVertexAttribArray(vColor);
//         gl.drawArrays(gl.POINTS, 0, indexPonto);
//     }

//     if (pointsLinhas.length > 0) {
//         gl.useProgram(program2);
//         gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2);
//         vPosition = gl.getAttribLocation(program2, "vPosition");
//         gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
//         gl.enableVertexAttribArray(vPosition);
//         gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId2);
//         vColor = gl.getAttribLocation(program2, "vColor");
//         gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
//         gl.enableVertexAttribArray(vColor);
//         // if(pointsLinhas.length % 2 == 0){
//         gl.drawArrays(gl.LINES, 0, indexLinha);
//         // }else{
//         //     gl.drawArrays(gl.LINES, 0, pointsLinhas.length-1);
//         // }
//     }

//     if (numPolygons > 0) {
//         gl.useProgram(program3);
//         gl.bindBuffer(gl.ARRAY_BUFFER, bufferId3);
//         vPosition = gl.getAttribLocation(program3, "vPosition");
//         gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
//         gl.enableVertexAttribArray(vPosition);
//         gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId3);
//         vColor = gl.getAttribLocation(program3, "vColor");
//         gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
//         gl.enableVertexAttribArray(vColor);

//         var vBuffer = gl.createBuffer();
//         gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
//         gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexPositions), gl.STATIC_DRAW);

//         var vPos = gl.getAttribLocation(program3, "vPosition");
//         gl.vertexAttribPointer(vPos, 2, gl.FLOAT, false, 0, 0);
//         gl.enableVertexAttribArray(vPos);

//         for (var i = 0; i < numPolygons; i++) {
//             if (i === currentPolygon) {
//                 var centroid = calculateCentroid(currentPolygon);
//                 var translationMatrix = translate(centroid[0], centroid[1], 0.0);
//                 var rotationMatrix = rotate(rotationAngle, 0, 0, 1);
//                 var reverseTranslationMatrix = translate(-centroid[0], -centroid[1], 0.0);

//                 modelViewMatrix = mult(mult(translationMatrix, rotationMatrix), reverseTranslationMatrix);
//                 gl.uniformMatrix4fv(uModelViewMatrixLoc, false, flatten(modelViewMatrix));
//             } else {
//                 gl.uniformMatrix4fv(uModelViewMatrixLoc, false, flatten(mat4()));
//             }
//             gl.drawArrays(gl.TRIANGLE_FAN, start[i], numIndices[i]);
//         }
//         // for(var i=0; i<numPolygons; i++) {
//         //     gl.drawArrays(gl.TRIANGLE_FAN, start[i], numIndices[i]);
//         // }
//     }

//     requestAnimFrame(render);
// }

// function renderPicking() {
//     gl.useProgram(program3);
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//     var cBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, flatten(pickingColors), gl.STATIC_DRAW);

//     var vColor = gl.getAttribLocation(program3, "vColor");
//     gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(vColor);

//     for (var i = 0; i < numPolygons; i++) {
//         gl.drawArrays(gl.TRIANGLE_FAN, start[i], numIndices[i]);
//     }
// }

// function calculateCentroid(polygonIndex) {
//     var centroid = vec2(0, 0);
//     var startIdx = start[polygonIndex];
//     var endIdx = startIdx + numIndices[polygonIndex];
//     for (var i = startIdx; i < endIdx; i++) {
//         centroid[0] += vertexPositions[i][0];
//         centroid[1] += vertexPositions[i][1];
//     }
//     centroid[0] /= numIndices[polygonIndex];
//     centroid[1] /= numIndices[polygonIndex];
//     return centroid;
// }

// function startRotation() {
//     if (!rotationActive) return;

//     rotationAngle += 1.0;
//     render();
//     requestAnimationFrame(startRotation);
// }

// function flatten(a) {
//     return new Float32Array(a.reduce((acc, val) => acc.concat(val), []));
// }




var canvas;
var gl;
var pointsIndividuais = [];
var pointsLinhas = [];
var program1;
var program2;
var program3;
var bufferId1;
var bufferId2;
var bufferId3;
var colorBufferId1;
var colorBufferId2;
var colorBufferId3;
var vPosition;
var vColor;
var option = 0;
var pointSize = 10.0;
var isRotating = false;
var rotationAngle = 0.0;

var t;
var tColor = vec4(1.0, 1.0, 1.0, 1.0);
var numPolygons = 0;
var numIndices = [];
numIndices[0] = 0;
var start = [0];
var indexPoligono = 0;
var indexPonto = 0;
var indexLinha = 0;
var iniciar_selecao = false;
var coresEscolhidas = [];
var pickingColors;
var currentPolygon;
var uModelViewMatrixLoc;
var modelViewMatrix;
var isDragging = false;
var previousMousePosition = { x: 0, y: 0 };
var vertexPositions = [];
var iniciar_rotacao = false;


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    var menu = document.getElementById("menuFuncao");
    var menuColor = document.getElementById("menuColor");
    var desenhar = document.getElementById("buttonDraw");
    var translacao = document.getElementById("translacao");
    var rotacao = document.getElementById("rotacao");
    var clear = document.getElementById("buttonClear");

    menu.addEventListener("click", function() {
        option = menu.selectedIndex;
    });

    menuColor.addEventListener("click", function() {
        cindex = menuColor.selectedIndex;
        if (cindex == 0) {
            tColor = vec4(1.0, 1.0, 1.0, 1.0);
        } else if (cindex == 1) {
            tColor = vec4(0.0, 0.0, 0.0, 1.0);
        } else if (cindex == 2) {
            tColor = vec4(1.0, 0.0, 0.0, 1.0);
        } else if (cindex == 3) {
            tColor = vec4(0.0, 1.0, 0.0, 1.0);
        } else if (cindex == 4) {
            tColor = vec4(0.0, 0.0, 1.0, 1.0);
        } else if (cindex == 5) {
            tColor = vec4(1.0, 0.71, 0.76, 1.0);
        }
        console.log(tColor);
    });

    desenhar.addEventListener("click", function(){
        numPolygons++;
        numIndices[numPolygons] = 0;
        start[numPolygons] = indexPoligono;
        render();
    });

    translacao.addEventListener("click", function(){
        if(option === 2){
            iniciar_selecao = !iniciar_selecao;
        }
    });

    rotacao.addEventListener("click", function() {
        if(option === 2){
            iniciar_rotacao = !iniciar_rotacao;
        }
    });


    clear.addEventListener("click", function(){
        pointsIndividuais = [];
        pointsLinhas = [];
        numPolygons = 0;
        numIndices = [];
        numIndices[0] = 0;
        start = [0];
        indexPoligono = 0;
        indexPonto = 0;
        indexLinha = 0;
        render();
    });


    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    canvas.addEventListener("mousedown", function(event){
        if(option == 0){ // pontos
            var t = vec2(2 * event.clientX / canvas.width - 1, 2 * (canvas.height - event.clientY) / canvas.height - 1);

            pointsIndividuais.push(t);
            gl.bindBuffer( gl.ARRAY_BUFFER, bufferId1 );
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*indexPonto, flatten(t));

            gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferId1 );
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*indexPonto, flatten(tColor));

            indexPonto++;
            render()
        }else if(option == 1){ // linhas
            var t = vec2(2 * event.clientX / canvas.width - 1, 2 * (canvas.height - event.clientY) / canvas.height - 1);
            
            pointsLinhas.push(t);
            gl.bindBuffer( gl.ARRAY_BUFFER, bufferId2 );
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*indexLinha, flatten(t));
            
            gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferId2 );
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*indexLinha, flatten(tColor));

            indexLinha++;
            render()
        }else if(option == 2){ // poligonos

            if(!iniciar_selecao && !iniciar_rotacao){
                var t = vec2(2 * event.clientX / canvas.width - 1, 2 * (canvas.height - event.clientY) / canvas.height - 1);
                vertexPositions.push(t);
                // usa o buffer de posicao
                gl.bindBuffer( gl.ARRAY_BUFFER, bufferId3 );
                gl.bufferSubData(gl.ARRAY_BUFFER, 8*indexPoligono, flatten(t));
                
                coresEscolhidas.push(tColor);
                // usa o buffer de cores
                gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferId3 );
                gl.bufferSubData(gl.ARRAY_BUFFER, 16*indexPoligono, flatten(tColor));
    
                numIndices[numPolygons]++;
                indexPoligono++;  
            }else{

                isDragging = true;
                previousMousePosition = { x: event.clientX, y: event.clientY };

                gl.useProgram(program3);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

                // Gera uma cor para cada vertice de cada poligono
                pickingColors = [];
                for (var i = 0; i < numPolygons; i++) {
                    var color = vec4((i + 1) / 255.0, 0.0, 0.0, 1.0);
                    for (var j = start[i]; j < start[i] + numIndices[i]; j++) {
                        pickingColors.push(color);
                    }
                }

                // renderiza os poligonos com as cores do mapa de pick
                renderPicking();

                var x = event.clientX;
                var y = canvas.height - event.clientY;

                var pixels = new Uint8Array(4);
                gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

                gl.bindFramebuffer(gl.FRAMEBUFFER, null);

                render();

                var pickedColorIndex = pixels[0] - 1;
                if (pickedColorIndex >= 0 && pickedColorIndex < numPolygons) {
                    currentPolygon = pickedColorIndex;
                    console.log(currentPolygon);
                }
            }
            
        }
        

    } );


    // Função para arrastar o polígono
    canvas.addEventListener("mousemove", function (event) {
        if (iniciar_selecao && isDragging && currentPolygon !== -1) {
            var rect = canvas.getBoundingClientRect();
            var dx = (event.clientX - previousMousePosition.x) / rect.width * 2;
            var dy = -(event.clientY - previousMousePosition.y) / rect.height * 2;

            // Atualizar a posição dos vértices do polígono selecionado
            for (var i = start[currentPolygon]; i < start[currentPolygon] + numIndices[currentPolygon]; i++) {
                vertexPositions[i][0] += dx;
                vertexPositions[i][1] += dy;
            }

            previousMousePosition = { x: event.clientX, y: event.clientY };
            render();
        } else if (iniciar_rotacao && isRotating && currentPolygon !== -1) {
            var deltaX = event.clientX - previousMousePosition.x;
            rotationAngle += deltaX * 0.7;
            previousMousePosition = { x: event.clientX, y: event.clientY };

            render();
        }
    });

    canvas.addEventListener("mouseup", function () {
        isDragging = false;
    });


    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    // ------------------------- Configuração do programa de pontos ------------------------

    program1 = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program1);

    bufferId1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId1);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * 1000, gl.STATIC_DRAW);

    // vPosition = gl.getAttribLocation(program1, "vPosition");
    // gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(vPosition);

    colorBufferId1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId1);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * 1000, gl.STATIC_DRAW);

    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0, 0.0));
    uModelViewMatrixLoc = gl.getUniformLocation(program1, "uModelViewMatrix");


    // vColor = gl.getAttribLocation(program1, "vColor");
    // gl.vertexAttribPointer(vColor, 2, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(vColor);


    // -------------------------------- Configuração do programa de linhas ----------------------
    
    program2 = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program2);

    bufferId2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * 1000, gl.STATIC_DRAW);

    // vPosition = gl.getAttribLocation(program2, "vPosition");
    // gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(vPosition);

    colorBufferId2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId2);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * 1000, gl.STATIC_DRAW);

    // vColor = gl.getAttribLocation(program2, "vColor");
    // gl.vertexAttribPointer(vColor, 2, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(vColor);

    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0, 0.0));
    uModelViewMatrixLoc = gl.getUniformLocation(program2, "uModelViewMatrix");
    


    // --------------------------- Configuração do programa de poligonos --------------------------
    program3 = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program3);

    bufferId3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId3);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * 1000, gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation(program3, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    colorBufferId3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId3);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * 1000, gl.STATIC_DRAW);

    vColor = gl.getAttribLocation(program3, "vColor");
    gl.vertexAttribPointer(vColor, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    // criação das texturas para o pick
    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    uModelViewMatrixLoc = gl.getUniformLocation(program3, "uModelViewMatrix");

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (pointsIndividuais.length > 0) {
        gl.useProgram(program1);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId1);
        vPosition = gl.getAttribLocation(program1, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId1);
        vColor = gl.getAttribLocation(program1, "vColor");
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);
        gl.drawArrays(gl.POINTS, 0, indexPonto);
    }

    if (pointsLinhas.length > 0) {
        gl.useProgram(program2);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2);
        vPosition = gl.getAttribLocation(program2, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId2);
        vColor = gl.getAttribLocation(program2, "vColor");
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);
        // if(pointsLinhas.length % 2 == 0){
        gl.drawArrays(gl.LINES, 0, indexLinha);
        // }else{
        //     gl.drawArrays(gl.LINES, 0, pointsLinhas.length-1);
        // }
    }

    if (numPolygons > 0) {
        gl.useProgram(program3);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId3);
        vPosition = gl.getAttribLocation(program3, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId3);
        vColor = gl.getAttribLocation(program3, "vColor");
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);

        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexPositions), gl.STATIC_DRAW);

        var vPos = gl.getAttribLocation(program3, "vPosition");
        gl.vertexAttribPointer(vPos, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPos);

        for (var i = 0; i < numPolygons; i++) {
            if (i === currentPolygon) {
                var centroid = calculateCentroid(currentPolygon);
                var translationMatrix = translate(centroid[0], centroid[1], 0.0);
                var rotationMatrix = rotate(rotationAngle, 0, 0, 1);
                var reverseTranslationMatrix = translate(-centroid[0], -centroid[1], 0.0);

                modelViewMatrix = mult(mult(translationMatrix, rotationMatrix), reverseTranslationMatrix);
                gl.uniformMatrix4fv(uModelViewMatrixLoc, false, flatten(modelViewMatrix));
            } else {
                gl.uniformMatrix4fv(uModelViewMatrixLoc, false, flatten(mat4()));
            }
            gl.drawArrays(gl.TRIANGLE_FAN, start[i], numIndices[i]);
        }
        // for(var i=0; i<numPolygons; i++) {
        //     gl.drawArrays(gl.TRIANGLE_FAN, start[i], numIndices[i]);
        // }
    }

    requestAnimFrame(render);
}

function renderPicking() {
    gl.useProgram(program3);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pickingColors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program3, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    for (var i = 0; i < numPolygons; i++) {
        gl.drawArrays(gl.TRIANGLE_FAN, start[i], numIndices[i]);
    }
}

function calculateCentroid(polygonIndex) {
    var centroid = vec2(0, 0);
    var startIdx = start[polygonIndex];
    var endIdx = startIdx + numIndices[polygonIndex];
    for (var i = startIdx; i < endIdx; i++) {
        centroid[0] += vertexPositions[i][0];
        centroid[1] += vertexPositions[i][1];
    }
    centroid[0] /= numIndices[polygonIndex];
    centroid[1] /= numIndices[polygonIndex];
    return centroid;
}

function startRotation() {
    if (!rotationActive) return;

    rotationAngle += 1.0;
    render();
    requestAnimationFrame(startRotation);
}

function flatten(a) {
    return new Float32Array(a.reduce((acc, val) => acc.concat(val), []));
}