/**
 * Example-07: Rigid Body manipulation
 * 
 * Dr.Santi Nuratch
 * Embedded Computing and Control Laboratory
 *  22 February, 2019
 */

//!! Import the ECC-CGP-Engine
import Engine from '../libs/ECC-CGP-Engine';

//!! Create the engine and enable the physics
const engine = new Engine({
    physics:{
        enabled: true,     //!! Enable the physics engine
    }
});
//!! Engine initialization options
const initOpts = {  //!! 
    envPath: 'images/Bridge2',  //!! Environment texture (CubeMapTexture)
    models: [                   //!! GLTF models
        'models/prebuilds/grounds/ground1.gltf',
    ]
};

//!! Initialise the engine with the given options, the initOpts object
engine.init( initOpts ).then( ( params ) => {
    uerInit( params )
    engine.start( callback );               //!! Start and provide the callback function
});

//!! Target
const TARGET_MESH_NAME = 'CubeBrick1';      //!! Target mesh name exported from Blender   
var targetBody = undefined;                 //!! Target body will be used in userInit and loop/callback

//!! User initialization function
function uerInit( params ) {

    //!! Get the target mesh
    targetBody = engine.getBodyByMeshName( TARGET_MESH_NAME );

    if( !targetBody ) {
        console.error('Cannot find rigid body of the "' + TARGET_MESH_NAME + '" in the current scene!');
    }

    //!! See in the console window
    console.log( targetBody );
}
//!! Engine callback function
function callback( args ) {
    if( !targetBody ) return;

    //!! Angular velocity of the y-axis
    targetBody.angularVelocity.set(0, 10, 0);
}