/**
 * Example-12: Show/Hide Mesh-Debug and Mesh-Label
 * 
 * Dr.Santi Nuratch
 * Embedded Computing and Control Laboratory
 * 01 March, 2019
 */


/**
 * Press key 'm' and 'n' to show and hide the mesh debug
 * Press key 'l' and 'k' to show and hide the mesh labels
 */

import Engine from '../libs/ECC-CGP-Engine';

//!! Create the engine with physics enabled
const engine = new Engine({
    physics:{
        enabled:  true,     //!! Enable the physics engine
        debug: {
            enabled: true,
            color: 0xffff00,
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


const KEY_DELAY = 1000; //!! Key delay (1000 is 1 second)

//!! Callback function
function callback() {

    //!! Apply force to raycasted object
    if( engine.getKeyDown('f', KEY_DELAY) ) {
        engine.applyForceToRayBody( 500 );              //!! Apply force to raycasted body
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
