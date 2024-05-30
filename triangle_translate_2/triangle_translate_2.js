
var canvas;
var gl;

var t = vec4(0.0,0.0,0.0, 1.0);
var T_loc1;
var T_loc2;
var t_step = 0.02;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Three Vertices

    var vertices1 = [
        vec2( -0.5, -0.5 ),
        vec2(  0,  0.5 ),
        vec2(  0.5, -0.5 )
    ];

    var vertices2 = [
        vec2( -0.5, -0.5 ),
        vec2(  0,  0.5 ),
        vec2(  0.5, -0.5 )
    ];

    var colors = [
        vec3( 1, 0, 0 ),
        vec3( 0, 1, 0 ),
        vec3( 0, 0, 1 )
    ];

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program1 = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program1 );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices1), gl.STATIC_DRAW );
    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program1, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Repeat the above process for vertices color attributes
    var cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program1, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    T_loc1 = gl.getUniformLocation(program1, "T");  

    //  Load shaders and initialize attribute buffers
    var program2 = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program2 );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices2), gl.STATIC_DRAW );
    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program2, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Repeat the above process for vertices color attributes
    var cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program2, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    T_loc2 = gl.getUniformLocation(program2, "T");

    render();        
    
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (t[0]> 0.5 || t[0]<-0.5){
        t_step*=-1
    }   
    t[0]+=t_step 

    gl.uniformMatrix4fv( T_loc, false, flatten(translate(t[0],t[1],t[2]) ));

    str = JSON.stringify(t);
    console.log(t); // Logs output to dev tools console.
    gl.drawArrays( gl.TRIANGLES, 0, 3);
    requestAnimFrame( render );
}