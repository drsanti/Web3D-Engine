/**
 * Example-10: Applying Local-Force and Local-Impulse to center of the target
 * 
 * Dr.Santi Nuratch
 * Embedded Computing and Control Laboratory
 *  22 February, 2019
 */

//!! Import the ECC-CGP-Engine
import Engine from '../libs/ECC-CGP-Engine';

//!! Create the engine
const engine = new Engine({
    physics:{
        enabled: true,          //!! Enable the physics engine
    },
    graphics: {
        grids: {
            enabled: false,     //!! Disable grids
        }
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
const TARGET_MESH_NAME = 'SphereBall1';      //!! Target mesh name exported from Blender   
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

	//!! Change mass
    targetBody.mass = 5;
}

//!! Apply local force to the center of the target body
function addLocalForce( forceVector,  forceScale) {
    var targetPoint = new Engine.Vec3(0, 0, 0); ///!! Origin of the target

    //!! Apply the scaled local force vector to the target
    targetBody.applyLocalForce( forceVector.mult(forceScale), targetPoint );
}

//!! Apply local impulse to the center of the target body
function addLocalImpulse( impulseVector,  impulseScale) {
    var targetPoint = new Engine.Vec3(0, 0, 0); //!! Origin of the target

    //!! Apply the scaled local impulse vector to the target
    targetBody.applyLocalImpulse( impulseVector.mult(impulseScale), targetPoint );
}

//!! Local Force and Local Impulae scales
const LOCAL_FORCE_SCALE   = 20;
const LOCAL_IMPULSE_SCALE = 1;

//!! Engine callback function
function callback( args ) {

    if( !targetBody ) return;

    //!!
    //!! Local Force
    //!!
    if( engine.getKeyDown('ArrowUp') ) {
        addLocalForce( new Engine.Vec3( 0, 0, +1 ), LOCAL_FORCE_SCALE );         //!! Forward (+z)
    }
    else if( engine.getKeyDown('ArrowDown') ) {
        addLocalForce( new Engine.Vec3( 0, 0, -1 ), LOCAL_FORCE_SCALE );         //!! Backward (-z)
    }
    else if( engine.getKeyDown('ArrowRight') ) {
        addLocalForce( new Engine.Vec3( -1, 0, 0 ), LOCAL_FORCE_SCALE );         //!! Right (-x)
    }   
    else if( engine.getKeyDown('ArrowLeft') ) {
        addLocalForce( new Engine.Vec3( +1, 0, 0 ), LOCAL_FORCE_SCALE );         //!! Left (+x)
    }
    else if( engine.getKeyDown(' ', 500) ) {
        addLocalForce( new Engine.Vec3( 0, +1, 0 ), LOCAL_FORCE_SCALE * 10 );    //!! Jump/Up (+y)
    }


    //!!
    //!! Local Impulse
    //!!
    else if( engine.getKeyDown('w') ) {
        addLocalImpulse( new Engine.Vec3( 0, 0, +1 ), LOCAL_IMPULSE_SCALE );         //!! Forward (+z)
    }
    else if( engine.getKeyDown('s') ) {
        addLocalImpulse( new Engine.Vec3( 0, 0, -1 ), LOCAL_IMPULSE_SCALE );         //!! Backward (-z)
    }
    else if( engine.getKeyDown('d') ) {
        addLocalImpulse( new Engine.Vec3( -1, 0, 0 ), LOCAL_IMPULSE_SCALE );         //!! Right (-x)
    }   
    else if( engine.getKeyDown('a') ) {
        addLocalImpulse( new Engine.Vec3( +1, 0, 0 ), LOCAL_IMPULSE_SCALE );         //!! Left (+x)
    }
    else if( engine.getKeyDown('Shift', 500) ) {
        addLocalImpulse( new Engine.Vec3( 0, +1, 0 ), LOCAL_IMPULSE_SCALE * 10 );    //!! Jump/Up (+y)
    }
}
