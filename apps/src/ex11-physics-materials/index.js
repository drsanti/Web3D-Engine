/**
 * Example-11: Physics Materials (Ground and Object Materials
 * 
 * Dr.Santi Nuratch
 * Embedded Computing and Control Laboratory
 *  22 February, 2019
 */


import Engine from '../libs/ECC-CGP-Engine';

//!! Create the engine
const engine = new Engine({
    physics:{
        enabled:  true,     //!! Enable the physics engine
    },
    graphics: {
        grids: {
            enabled: false,
        },
        pointLight:{
            enabled: true,
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

const GROUND_MESH_NAME = 'CubeStaticGround';    //!! Ground mesh name exported from the Blender   
const TARGET_MESH_NAME = 'Sphere001';           //!! Target mesh name exported from Blender   
var targetBody = undefined;                     //!! Target body will be used in userInit and loop/callback

function uerInit( params ) {

    //!! Get the target mesh
    targetBody = engine.getBodyByMeshName( TARGET_MESH_NAME );

    //!! Get ground body
    const groundBody = engine.getBodyByMeshName( GROUND_MESH_NAME );

    if( !targetBody ) {
        console.error('Cannot find rigid body of the "' + TARGET_MESH_NAME + '" in the current scene!');
    }
    if( !groundBody ) {
        console.error('Cannot find rigid body of the "' + GROUND_MESH_NAME + '" in the current scene!');
    }

    //!! Add axes to the target mesh, the threemesh of the rigidbody
    engine.addAxesToMesh( targetBody.threemesh, 3 );

    //!! Change mass of the rigid body
    targetBody.mass = 1;


    //!! Create ground material and add to the physics world
    const groundFriction    = 0.1;
    const groundRestitution = 0.5;
    const groundMaterial = engine.createGroundMaterial( groundFriction, groundRestitution );

    //!! Create object material and add to the physics world
    const objectFriction    = 0.1;
    const objectRestitution = 0.5;
    const objectMaterial = engine.createObjectMaterial( objectFriction, objectRestitution, groundMaterial );

    //!! Apply the created materials to the rigid bodies
    groundBody.material = groundMaterial;
    targetBody.material = objectMaterial;
}


//!! Apply force to the position of the target body
function addForce( forceVector,  forceScale) {
    var targetPoint = new Engine.Vec3(0, 0, 0); //!! Create a vector
    targetPoint.copy( targetBody.position );    //!! Copy the target position

    //!! Apply the scaled force vector to the target point
    targetBody.applyForce( forceVector, targetPoint );
}

//!! Apply impulse to the position of the target body
function addImpulse( impulseVector,  impulseScale) {
    var targetPoint = new Engine.Vec3(0, 0, 0); //!! Create a vector
    targetPoint.copy( targetBody.position );    //!! Copy the target position

    //!! Apply the scaled impulse vector to the target point
    targetBody.applyImpulse( impulseVector, targetPoint );
}


const FORCE_SCALE   = 20;
const IMPULSE_SCALE = 1;

function callback( args ) {

    if( !targetBody ) return;

    //!!
    //!! Force
    //!!
    if( engine.getKeyDown('ArrowUp') ) {
        addForce( engine.getForwardVector( FORCE_SCALE ));      //!! Forward (+z)
    }
    else if( engine.getKeyDown('ArrowDown') ) {
        addForce( engine.getBackwardVector( FORCE_SCALE ));     //!! Backward (-z)
    }
    else if( engine.getKeyDown('ArrowRight') ) {
        addForce( engine.getRightVector( FORCE_SCALE ));        //!! Right (-x)
    }   
    else if( engine.getKeyDown('ArrowLeft') ) {
        addForce( engine.getLeftVector( FORCE_SCALE ));          //!! Left (+x)
    }
    else if( engine.getKeyDown(' ', 500) ) {                    //!! SPACE BAR with interval
        addForce( engine.getUpVector( FORCE_SCALE*10 ));        //!! Jump/Up (+y)
    }


    //!!
    //!! Impulse
    //!!
    else if( engine.getKeyDown('w') ) {
        addImpulse( engine.getForwardVector( IMPULSE_SCALE ));          //!! Forward (+z)
    }
    else if( engine.getKeyDown('s') ) {
        addImpulse( engine.getBackwardVector( IMPULSE_SCALE ));         //!! Backward (-z)
    }
    else if( engine.getKeyDown('d') ) {
        addImpulse( engine.getRightVector( IMPULSE_SCALE ));            //!! Right (-x)
    }   
    else if( engine.getKeyDown('a') ) {
        addImpulse( engine.getLeftVector( IMPULSE_SCALE ));             //!! Left (+x)
    }
    else if( engine.getKeyDown('Shift', 500) ) {                        //!! Shift key with inter val
        addImpulse( engine.getUpVector( IMPULSE_SCALE*4 ));             //!! Jump/Up (+y)
    }
}
