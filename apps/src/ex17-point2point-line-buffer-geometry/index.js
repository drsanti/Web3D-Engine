/**
 * Example-17: Point-to-Point Constraint and Point-to-Point Line
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
 * Press key '0' to use method 0
 * Press key '1' to use method 1
 */

import {Engine, CANNON, THREE} from '../libs/ECC-CGP-Engine';

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
const maxForce      = 1000;
var isAdded         = false;

var lineA = undefined;
var lineB = undefined;
var pivotA = undefined;
var pivotB = undefined;

const OPACITY_VAL = 0.6;
var   method = 1;
//!! User initialization function
function uerInit( params ) {

    //!! Get the target rigid bodies
    bodyA = engine.getBodyByMeshName( TARGET_A_NAME );
    bodyB = engine.getBodyByMeshName( TARGET_B_NAME );
    bodyB.mass = 3;
    if( !bodyA || !bodyB ) {
        throw "Cannot find the rigid body A|B. Check the target name";
    }
    
    
    //!! Make them transparent
    bodyB.threemesh.material.transparent = true;
    bodyB.threemesh.material.opacity = OPACITY_VAL;

    bodyA.threemesh.material.transparent = true;
    bodyA.threemesh.material.opacity = OPACITY_VAL;
    
    //!! Add axes to the bodies
    engine.addAxesToBody(bodyA, 0.5);
    engine.addAxesToBody(bodyB, 0.5);

    //!! Change bodyA to static, set its position and reset its rotation
    engine.setBodyToStatic(bodyA);
    bodyA.position.set(0, 10, 0);   //!! Up
    bodyA.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 1, 1), 0); //!! Reset roration
   
    //!! Damping makes the movement slow down with time
    bodyB.linearDamping  = 0.1;    
    bodyB.angularDamping = 0.1;

    //!! Pivots
    pivotA = new CANNON.Vec3(0, -2, 0);   //!! Change the pivotA and check the result
    pivotB = new CANNON.Vec3(0, +4, 0);   //!! Change the pivotB and check the result

    //!! Create point-to-point constraint of the bodyA and bodyB
    p2pConstraint = new CANNON.PointToPointConstraint(
        bodyA, pivotA,
        bodyB, pivotB,
        maxForce
    );
}

function createPointToPointLine(p1, p2) {

    //!! Geometry and material
    var geometry = new THREE.BufferGeometry();
    var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );

    var positions = []; //!! Point array (x, y, z)
    var colors    = []; //!! Color array (r, g, b)
    
    //!! Ponts
    positions.push(p1.x); positions.push(p1.y); positions.push(p1.z);    //!! p1: x, y, z
    positions.push(p2.x); positions.push(p2.y); positions.push(p2.z);    //!! p2: x, y, z

    //!! Colors
    colors.push(0); colors.push(1); colors.push(1);    //!! Blue: r, g, b
    colors.push(1); colors.push(1); colors.push(0);    //!! Red:  r, g, b

    //!! Adds attributes, the positions and colors
    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'color'   , new THREE.Float32BufferAttribute( colors   , 3 ) );

    //!! Computes bounding
    //geometry.computeBoundingSphere();

    //!! Creates line and adds to scene
    var line =  new THREE.Line( geometry, material );
    engine.getScene().add( line );

    return line;
}

function updatePointToPointLine(ln, p1, p2) {

    var positions = ln.geometry.attributes.position.array;
    var i=0;
    //!! P1
    positions[i++] = p1.x;
    positions[i++] = p1.y;
    positions[i++] = p1.z;
    //!! P2
    positions[i++] = p2.x;
    positions[i++] = p2.y;
    positions[i++] = p2.z;
    ln.geometry.attributes.position.needsUpdate = true; 
}

//!! Engine callback function
function callback( args ) {

    if( !bodyA || !bodyB ) return;

    if( method == 0 ) {
        if( lineA ) { //!! If the lines are created, update them
            updatePointToPointLine(lineA, bodyA.position, bodyA.position.vadd(pivotA) ); //!! OriginA-to-tipA
            updatePointToPointLine(lineB, bodyB.position, bodyA.position.vadd(pivotA) ); //!! OriginB-to-tipA
        }
    }
    else if( method == 1 ) {
        if( lineA ) { //!! If the lines are created, update them

            //!! pinA is sticked to the bottom face of the static box
            var pinA = new CANNON.Vec3().copy(bodyA.position);
            pinA.y -= 1;

            //!! HookA
            var hookA = new CANNON.Vec3();
            bodyA.position.vadd(pivotA, hookA);

            //!! Direction from hookA to originB  
            var dir = new CANNON.Vec3();
            hookA.vsub(bodyB.position, dir);
            dir.normalize();

            //!! Offset vector from origin to the top face of the bodyB
            var offset = new CANNON.Vec3();
            dir.mult(bodyB.threemesh.scale.y, offset);

            //!! pinB is sticked to the bottom face of the bynamic box (bodyB)
            var pinB = new CANNON.Vec3();
            bodyB.position.vadd(offset, pinB);

            //!! Update the lines
            updatePointToPointLine(lineA, pinA, hookA ); //!! OriginA-to-hookA
            updatePointToPointLine(lineB, pinB, hookA ); //!! OriginB-to-hookA
        }
    }

    if( engine.getKeyDown('a', 1000) ) {

        if( isAdded === true ) return;   //!! It is added, return

        //!! Add the point-to-point to the physics world
        engine.addConstraint( p2pConstraint ); 
        isAdded = true;

        if( !lineA ) {  //!! If the lines are not created, create them

            //!! Origin of bodyA to tipA
            lineA = createPointToPointLine( bodyA.position, bodyA.position.vadd(pivotA) );

            //!! Origin of bodyB to tipA (tipA and tipB are located in the same location)
            lineB = createPointToPointLine( bodyB.position, bodyA.position.vadd(pivotA) );
        }
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

    else if( engine.getKeyDown('0', 2000) ) {   
        method = 0;
    }
    else if( engine.getKeyDown('1', 2000) ) {   
        method = 1;
    }
}
