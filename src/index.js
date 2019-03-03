/**
 * Example-08: Keyboard input
 * 
 * Dr.Santi Nuratch
 * Embedded Computing and Control Laboratory
 * 22 February, 2019
 */

//!! Import the ECC-CGP-Engine
import Engine from './libs/ECC-CGP-Engine';

//!! Create the engine and enable the physics
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
    ]
};
//!! Initialise the engine with the given options, the initOpts object
engine.init( initOpts ).then( ( params ) => {
    uerInit( params )
    engine.start( callback );               //!! Start and provide the callback function
});

//!! Target
const TARGET_MESH_NAME = 'Cube002';         //!! Target mesh name exported from Blender    
var targetBody = undefined;                 //!! Target body will be used in userInit and loop/callback

//!! User initialization function
function uerInit( params ) {

    //!! Get the target mesh
    targetBody = engine.getBodyByMeshName( TARGET_MESH_NAME );

    if( !targetBody ) {
        console.error('Cannot find rigid body of the "' + TARGET_MESH_NAME + '" in the current scene!');
    }
}

//!! Engine callback function
function callback( args ) {
    if( !targetBody ) return;

    if( engine.getKeyDown('a') ) {
        targetBody.angularVelocity.set(0, +10, 0);
    }
    else if( engine.getKeyDown('d') ) {
        targetBody.angularVelocity.set(0, -10, 0);
    }
}















// import Engine from './libs/ECC-CGP-Engine';


// var targets = [];

// const initOptions = {
//     envPath:'images/park',
//     models: [
//         'models/scene001.gltf',
//         'models/boxes001.gltf'
//     ]
// };


// const engine = new Engine({
//     graphics:{
//         sceneType:      'env',
//         useReflection:  true,
//         axes: {
//             enabled:    false,
//         },
//         grids: {
//             enabled:    false,
//         } 
//     },
//     physics:{
//         debug:{
//             enabled: false,
//         }
//     }
// });

// var glTFs;

// engine.init(initOptions).then( ( params ) => {
//     glTFs = params.glTFs;
//     engine.start( callback );
// });

// function callback( arg ) {

//     if( engine.getKeyDown( '0', 1000 ) ) {
//         var cnt = 0;
//         engine.getMeshes().forEach( m => {
//             console.log( (++cnt) + ') ' + m.name, m.type);  
//         });
//     }

//     if( engine.getKeyDown( '1', 1000 ) ) {
//         var cnt = 0;
//         engine.getMeshesFromScene().forEach( m => {
//             console.log( (++cnt) + ') ' + m.name, m.type);  
//         });
//     }

//     if( engine.getKeyDown( '2', 1000 ) ) {
//         var cnt = 0;
//         engine.getMeshesFromScene(glTFs[0].scene).forEach( m => {
//             console.log( (++cnt) + ') ' + m.name, m.type);  
//         });
//     }

//     if( engine.getKeyDown( '3', 1000 ) ) {
//         var mesh = engine.getMeshByName('Cube001');
//         engine.addAxesToMesh(mesh, 3);
//     }
//     if( engine.getKeyDown( '4', 1000 ) ) {
//         var mesh = engine.getMeshByName('Cube001');
//         engine.removeAxesFromMesh(mesh);
//     }

//     if( engine.getKeyDown( '5', 1000 ) ) {
//         engine.addAxesToAllMeshes(3);
//     }
//     if( engine.getKeyDown( '6', 1000 ) ) {
//         engine.removeAxesFromAllMeshes();
//     }
//     if( engine.getKeyDown( '7', 1000 ) ) {
//         engine.applyReflectionMapToAllMeshes();
//     }
//     if( engine.getKeyDown( '8', 1000 ) ) {
//         engine.removeReflectionMapFromAllMeshes();
//     }

//     if( engine.getKeyDown( '9', 1000 ) ) {
//         engine.toggleDebug();
//     }

//     if( engine.getKeyDown( 'l', 1000 ) ) {
//         engine.toggleLabels();
//     }
//     if( engine.getKeyDown( 'f', 1000 ) ) {
//         engine.applyForceToRayBody(500);
//     }
//     if( engine.getKeyDown( 'd', 1000 ) ) {
//         engine.toggleDebug();
//     }

   
//     if( engine.getKeyDown( 'g', 1000 ) ) {
//         engine.toggleGrids();
//     }
   

//     if( engine.getKeyDown( 'a', 1000 ) ) {
//         engine.toggleAxes();
//     }

//     if( engine.getKeyDown( 'm', 1000 ) ) {
//         engine.loadModel('models/boxes001.gltf');
//     }

//     if( engine.getKeyDown( 'n', 1000 ) ) {
//         engine.loadAssets('models/actor001.gltf');
//     }

//     if( engine.getKeyDown( 'c', 1000 ) ) {
//         engine.core.graphics.clearScene(engine.core.graphics.scene);
//         engine.core.physics.clearWorld();
//     }

//     if( engine.getKeyDown( 's', 1000 ) ) {
//         console.log(engine.core.graphics.scene);
//     }
// }















// // import Graphics     from './libs/Graphics';
// // import Utils        from './libs/Utils';
// // import EngineCore   from './libs/EngineCore';

// // var targets = [];


// // var g = new Graphics();
// // g.init({
// //     envPath:    'images/bridge', 
// //     models:     ['models/scene001.gltf', 'models/boxes001.gltf'],
// //     start:      true,
// //     callback:   callback,
// // }).then( args => {
// //     g.addAxesToAllMeshes( 2 );
// //     targets = g.getMeshes();

// //     g.removeAxes();
// // });



// // const e = new EngineCore({
// //     graphics:{
// //         sceneType:      'env',
// //         useReflection:  true,
// //         axes: {
// //             enabled:    true,
// //         },
// //         grids: {
// //             enabled:    true,
// //         } 
// //     }
// // });

// // const initOptions = {
// //     envPath:'images/park',
// //     models: [
// //         'models/scene001.gltf'   
// //     ]
// // };

// // e.init(initOptions).then( (arg) => {
// //     targets = e.graphics.getMeshes();

// //     e.physics.createBodiesFromScene(arg.glTFs[0].scene);
// //     console.log(e.physics.world.bodies);

// //     e.start( callback );
// // });



// // function callback( arg ) {

// //     // if(targets) {
 
// //     //     targets.forEach(obj => {
// //     //         if( !Utils.isStatic(obj) && !Utils.isFogPlane(obj) && !Utils.isHelper(obj)) {
// //     //             obj.rotation.x += 0.01; 
// //     //             obj.rotation.y += 0.02; 
// //     //             obj.rotation.z += 0.03; 
// //     //         }
// //     //     });
// //     // }


// //     if( e.getKeyDown( 'b', 1000 ) ) {
// //         console.log( e.physics.world.bodies );
// //     }
// //     if( e.getKeyDown( 's', 1000 ) ) {
// //         console.log( e.graphics.scene );
// //     }
// //     if( e.getKeyDown( 'd', 1000 ) ) {
// //         e.physics.toggleDebug();
// //     }
// //     if( e.getKeyDown( 'l', 1000 ) ) {
// //         e.labelRenderer.toggle();
// //     }

// //     if( e.getKeyDown( 'i', 1000 ) ) {
// //         e.applyForceToRayBody(500);
// //     }
// //     if( e.getKeyDown( 'f', 1000 ) ) {
// //         e.applyImpulseToRayBody(5);
// //     }

    
// // }

