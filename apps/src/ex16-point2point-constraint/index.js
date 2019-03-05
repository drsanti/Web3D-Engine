/**
 * Example-16: Point-to-Point Constraint
 * 
 * Dr.Santi Nuratch
 * Embedded Computing and Control Laboratory
 * 04 March, 2019
 */


/**
 * Press key 'a' to add the constraint
 * Press key 'r' to remove the constraint
 * Press key 'l' to show/hide labels
 * Press key 'f' to apply force to raycastted body
 */

import {Engine, CANNON} from '../libs/ECC-CGP-Engine';

//!! Create the engine with physics enabled
const engine = new Engine({
    
    physics:{
        enabled: true,     //!! Enable the physics engine
    }
});

//!! Engine initialization options
const initOpts = {  //!! 
    envPath: 'images/park',     //!! Environment texture (CubeMapTexture)
    models: [                   //!! GLTF models
        'models/scene001.gltf', //!! Grround, Walls and Basic Primitive objects
        'models/boxes001.gltf',
    ]
};

//!! Initialise the engine with the given options, the initOpts object
engine.init( initOpts ).then( ( params ) => {
    uerInit( params )
    engine.start( callback );               //!! Start and provide the callback function
});

//!! Targets
const TARGET_A_NAME = 'CubeRedWood001';             //!! Mesh name for target A
const TARGET_B_NAME = 'CubeDarkWood001';            //!! Mesh name for target B
var   bodyA = undefined;                            //!! Rigid-body A
var   bodyB = undefined;                            //!! Rigid-body B

//!! Constraint parameters
var   p2pConstraint = undefined;
const maxForce           = 1000;
var isAdded              = false;

//!! User initialization function
function uerInit( params ) {

    //!! Get the target rigid bodies
    bodyA = engine.getBodyByMeshName( TARGET_A_NAME );
    bodyB = engine.getBodyByMeshName( TARGET_B_NAME );

    if( !bodyA || !bodyB ) {
        throw "Cannot find the rigid body A|B. Check the target name";
    }

    //!! Add axes to the bodies
    engine.addAxesToBody(bodyA, 2.5);
    engine.addAxesToBody(bodyB, 2.5);

    //!! Change bodyA to static, set its position and reset its rotation
    engine.setBodyToStatic(bodyA);
    bodyA.position.set(0, 10, 0);   //!! Up
    bodyA.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 1, 1), 0); //!! Reset roration
   
    //!! Damping makes the movement slow down with time
    bodyB.linearDamping  = 0.1;    
    bodyB.angularDamping = 0.1;

    //!! Pivots
    const pivotA = new CANNON.Vec3(0, -2, 0);   //!! Change the pivotA and check the result
    const pivotB = new CANNON.Vec3(0, +5, 0);   //!! Change the pivotB and check the result

    //!! Create point-to-point constraint of the bodyA and bodyB
    p2pConstraint = new CANNON.PointToPointConstraint(
        bodyA, pivotA,
        bodyB, pivotB,
        maxForce
    );
}

//!! Engine callback function
function callback( args ) {

    if( !bodyA || !bodyB ) return;

    if( engine.getKeyDown('a', 1000) ) {

        if( isAdded === true ) return;   //!! It is added, return

        //!! Add the point-to-point to the physics world
        engine.addConstraint( p2pConstraint ); 
        isAdded = true;
    }

    else if( engine.getKeyDown('r', 1000) ) {

        //!! Remove the point-to-point from the physics world
        engine.removeConstraint( p2pConstraint );   
        isAdded = false; 
    }

    else if( engine.getKeyDown('f', 1000) ) {
        engine.applyForceToRayBody( 300 );      //!! Appy force to raycasted body   
    }
    else if( engine.getKeyDown('l', 2000) ) {   
        engine.toggleLabels();                  //!! show/hide labels
    }
}
