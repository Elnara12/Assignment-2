let gl, program;
let vertexCount = 36;
let modelViewMatrix;

let eye = [0, 0, 0.1];
let at = [0, 0, 0];
let up = [0, 1, 0];
let theta = 0.1;
onload = () => {
    let canvas = document.getElementById("webgl-canvas");
    
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert('No webgl for you');
        return;
    }

    program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(0, 0, 0, 0.5);

    let vertices = [
        -1, -1, 1,
        -1, 1, 1,
        1, 1, 1,
        1, -1, 1,
        -1, -1, -1,
        -1, 1, -1,
        1, 1, -1,
        1, -1, -1,
    ];

    let indices = [
        0, 3, 1,
        1, 3, 2,
        4, 7, 5,
        5, 7, 6,
        3, 7, 2,
        2, 7, 6,
        4, 0, 5,
        5, 0, 1,
        1, 2, 5,
        5, 2, 6,
        0, 3, 4,
        4, 3, 7,
    ];

    let colors = [
        0, 0, 0,
        0, 0, 1,
        0, 1, 0,
        0, 1, 1,
        1, 0, 0,
        1, 0, 1,
        1, 1, 0,
        1, 1, 1,
    ];

    // You should get rid of the line below eventually
    vertices = scale(0.5, vertices); 

    let vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    let vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vPosition);

    let iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    let cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    let vColor = gl.getAttribLocation(program, 'vColor');
    gl.vertexAttribPointer(vColor,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vColor);

    modelViewMatrix = gl.getUniformLocation(program, 'modelViewMatrix');
    
    document.onkeydown = (event) => {
    if(event.key === 'T' || event.key === 't'){

        eye = [0, 1,0];

        at = [0, 0, 0];

        up = [1, 0, 0];
    }
    else 
    if(event.key === 'L' || event.key === 'l'){

        eye = [-0.1, 0, 0];

        at = [0, 0, 0];

        up = [0, 1, 0];
    }

    else 
    if(event.key === 'F' || event.key === 'f'){

        eye = [0, 0, 0.1];

        at = [0, 0, 0];

        up = [0, 1, 0];
    }
    
    else
    if(event.key === 'D' || event.key === 'd'){

        eye = rotateCamPositi(eye, theta);

        up = rotateCamPositi(up, theta);
    }
    else 
    if(event.key === 'A' || event.key === 'a'){

        eye = rotateCamPositi(eye, -theta);

        up = rotateCamPositi(up, -theta);
    }
    }

   
    render();
};

function rotateCamPositi(vector, angle){

    let cosinus = Math.cos(angle);

    let sinus = Math.sin(angle);

    let x = vector [0];

    let y = vector [1];

    let z = vector [2];

    let rotateX = x * cosinus - y * sinus;

    let rotateY = x * sinus + y * cosinus;

    return [rotateX, rotateY, z];
}
function render() { 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mvm = lookAt(eye, at, up);

    gl.uniformMatrix4fv(modelViewMatrix, false,
    flatten(mvm));

    gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(render);
}

