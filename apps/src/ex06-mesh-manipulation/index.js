/**
 * Example-06: Meshes manipulation
 * 
 * Dr.Santi Nuratch
 * Embedded Computing and Control Laboratory
 *  22 February, 2019
 */

//!! Import the ECC-CGP-Engine
import Engine from '../libs/ECC-CGP-Engine';

//!! Create the engine and disable the physics
const engine = new Engine({
    physics:{
        enabled: false,     //!! Disable the physics engine
    }
});

//!! Engine initialization options
const initOpts = {  //!! 
    envPath: 'images/bridge',   //!! Environment texture (CubeMapTexture)
    models: [                   //!! GLTF models
        'models/scene001.gltf', //!! Grround, Walls and Basic Primitive objects
    ]
};

//!! Initialise the engine with the given options, the initOpts object
engine.init( initOpts ).then( ( params ) => {
    uerInit( params );
    engine.start( callback );   //!! Start and provide the callback function
});

//!! Target
const TARGET_MESH_NAME = 'Cube002';         //!! Target mesh name exported from Blender   
var targetMesh = undefined;                 //!! Target mesh will be used in userInit and loop/callback

//!! User initialization function
function uerInit( params ) {

    //!! Get the target mesh
    targetMesh = engine.getMeshByName( TARGET_MESH_NAME );

    if( !targetMesh ) {
        console.error('Cannot find the "' + TARGET_MESH_NAME + '" in the current scene!');
    }
}

var alpha = 0;  //!! Rotation angle
function callback( args ) {
    if( !targetMesh ) return;

    //!! Rotation
    targetMesh.rotation.x += Math.PI/100;
    targetMesh.rotation.y += Math.PI/200;
    targetMesh.rotation.z += Math.PI/300;

    //!! Translation
    targetMesh.position.z = 10 * Math.sin( alpha );
    alpha += Math.PI/100;
}
