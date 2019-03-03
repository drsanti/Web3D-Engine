/**
 * Example-13: Raycasting and Applying Force and Impulse to raycasted body
 * 
 * Dr.Santi Nuratch
 * Embedded Computing and Control Laboratory
 * 01 March, 2019
 */


/**
 * Press key 'r' to perform the raycast operation
 * Press key 't' to get Ray object
 * Press key 'y' to get Ray-Intersec object
 * Press key 'f' to apply force to the raycasted body
 * Press key 'g' to apply impulse to the raycasted body
 */

import Engine from '../libs/ECC-CGP-Engine';

//!! Create the engine with physics enabled
const engine = new Engine({
    physics:{
        enabled:  true,         //!! Enable the physics engine
        debug:{
            enabled: true,      //!! Disable mesh debugging
        }       
    },
});

//!! Initialization options
const initOpts = {

    envPath: 'images/park',     //!! Environmant directory
    models: [ 
        'models/scene001.gltf', //!! Ground and basic primitive objects
        'models/boxes001.gltf', //!! Textured boxes
    ]
};

//!! Initialze and start the engine
engine.init( initOpts ).then( () => {
    engine.start( callback );
});


const KEY_DELAY     = 1000; //!! Key delay (1000 is 1 second)
const FORCE_SCALE   = 500;  //!! Force scale
const IMPULSE_SCALE = 10;   //!! Imnpulse scale

//!! Callback function
function callback() {

    if( engine.getKeyDown('r', KEY_DELAY) ) {           
        var rc = engine.doRaycast();                    //!! Do raycast and receive raycasted objects
        console.log(rc);
    }
    else if( engine.getKeyDown('t', KEY_DELAY) ) {
        var ray = engine.getRay();                      //!! Get Ray object
        console.log(ray);
    }
    else if( engine.getKeyDown('y', KEY_DELAY) ) {
        var ints = engine.getRayIntersec();             //!! Get RayIntersec object
        console.log(ints);
    }
    else if( engine.getKeyDown('f', KEY_DELAY) ) {
        engine.applyForceToRayBody( FORCE_SCALE );      //!! Apply force to raycasted body
    }
    else if( engine.getKeyDown('g', KEY_DELAY) ) {
        engine.applyImpulseToRayBody( IMPULSE_SCALE );  //!! Apply force to raycasted body
    }

    //!! Debug
    else if( engine.getKeyDown('m', KEY_DELAY) ) {      //!! Show/Hide debug meshes
        engine.toggleDebug();
    }

    //!! Labels
    else if( engine.getKeyDown('l', KEY_DELAY) ) {      //!! Show/Hide labels
        engine.toggleLabels();
    }
}
