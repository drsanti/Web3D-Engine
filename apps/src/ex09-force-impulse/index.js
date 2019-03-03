/**
 * Example-09: Applying Force and Impulse to center of the target (world point)
 * 
 * Dr.Santi Nuratch
 * Embedded Computing and Control Laboratory
 * 22 February, 2019
 */

//!! Import the ECC-CGP-Engine
import Engine from '../libs/ECC-CGP-Engine';
//!! Create the engine and enable the physics, disable grids
const engine = new Engine({
    physics:{
        enabled: true,     //!! Enable the physics engine
    },
    graphics: {
        grids: {
            enabled: false,
        }
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
    uerInit( params )
    engine.start( callback );               //!! Start and provide the callback function
});

//!! Target
const TARGET_MESH_NAME = 'Sphere001';       //!! Target mesh name exported from Blender   
var targetBody = undefined;                 //!! Target body will be used in userInit and loop/callback

//!! User initialization function
function uerInit( params ) {

    //!! Get the target mesh
    targetBody = engine.getBodyByMeshName( TARGET_MESH_NAME );

    if( !targetBody ) {
        console.error('Cannot find rigid body of the "' + TARGET_MESH_NAME + '" in the current scene!');
    }

    //!! Add axes to the target mesh, the threemesh of the rigidbody
    engine.addAxesToMesh( targetBody.threemesh, 3 );
}

//!! Apply force to the position of the target body
function addForce( forceVector,  forceScale) {
    var targetPoint = new Engine.Vec3(0, 0, 0); //!! Create a vector
    targetPoint.copy( targetBody.position );    //!! Copy the target position

    //!! Apply the scaled force vector to the target point
    targetBody.applyForce( forceVector.mult(forceScale), targetPoint );
}

//!! Apply impulse to the position of the target body
function addImpulse( impulseVector,  impulseScale) {
    var targetPoint = new Engine.Vec3(0, 0, 0); //!! Create a vector
    targetPoint.copy( targetBody.position );    //!! Copy the target position

    //!! Apply the scaled impulse vector to the target point
    targetBody.applyImpulse( impulseVector.mult(impulseScale), targetPoint );
}

//!! Force and Impulse scales
const FORCE_SCALE   = 20;
const IMPULSE_SCALE = 1;

//!! Engine callback function
function callback( args ) {

    if( !targetBody ) return;

    //!!
    //!! Force
    //!!
    if( engine.getKeyDown('ArrowUp') ) {
        addForce( new Engine.Vec3( 0, 0, +1 ), FORCE_SCALE );         //!! Forward (+z)
    }
    else if( engine.getKeyDown('ArrowDown') ) {
        addForce( new Engine.Vec3( 0, 0, -1 ), FORCE_SCALE );         //!! Backward (-z)
    }
    else if( engine.getKeyDown('ArrowRight') ) {
        addForce( new Engine.Vec3( -1, 0, 0 ), FORCE_SCALE );         //!! Right (-x)
    }   
    else if( engine.getKeyDown('ArrowLeft') ) {
        addForce( new Engine.Vec3( +1, 0, 0 ), FORCE_SCALE );         //!! Left (+x)
    }
    else if( engine.getKeyDown(' ', 500) ) {
        addForce( new Engine.Vec3( 0, +1, 0 ), FORCE_SCALE * 10 );    //!! Jump/Up (+y)
    }


    //!!
    //!! Impulse
    //!!
    else if( engine.getKeyDown('w') ) {
        addImpulse( new Engine.Vec3( 0, 0, +1 ), IMPULSE_SCALE );         //!! Forward (+z)
    }
    else if( engine.getKeyDown('s') ) {
        addImpulse( new Engine.Vec3( 0, 0, -1 ), IMPULSE_SCALE );         //!! Backward (-z)
    }
    else if( engine.getKeyDown('d') ) {
        addImpulse( new Engine.Vec3( -1, 0, 0 ), IMPULSE_SCALE );         //!! Right (-x)
    }   
    else if( engine.getKeyDown('a') ) {
        addImpulse( new Engine.Vec3( +1, 0, 0 ), IMPULSE_SCALE );         //!! Left (+x)
    }
    else if( engine.getKeyDown('Shift', 500) ) {
        addImpulse( new Engine.Vec3( 0, +1, 0 ), IMPULSE_SCALE * 10 );    //!! Jump/Up (+y)
    }
}
