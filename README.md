

**Example-01: Getting Started**
```javascript
 //!! Create the engine
 const engine = new Engine();
 
 //!! Initialize the engine
 engine.init().then( ( params ) => {
    console.log( params );  //!! Check the params object in the console window
    engine.start();         //!! Start the engine
    engine.printInfo( "Engine started. Please wait..." );
    setTimeout( () => {
        engine.stop();      //!! Stop the engine
        engine.printInfo( "Engine stopped. Refresh the browser to try again" );
    }, 5000);
 });
```

***

**Example-02: Engine callback function**
```javascript
 //!! Create the engine
 const engine = new Engine();
  
 //!! Initialize the engine
 engine.init().then( ( params ) => {
    console.log( params );      //!! Check the params object in the console window
    engine.start( callback );   //!! Start the engine and give it the callback
 });

 //!! Engine callback function called every frame (60 fps)
 function callback( args ) {
    //!! Do something here
 }
```

***

**Example-03: User initialization function**
```javascript
///!! Create the engine
const engine = new Engine();

//!! Initialize the engine
engine.init().then( ( params ) => {
    userInit( params );             //!! User initialization function
    engine.start();                 //!! Start the engine
});

//!! User initialize function
function userInit( params ) {
    engine.printInfo("Put your initialized code here");
}
```
***
**Example-04: Engine configuration options**
```javascript
//!! Create the engine with options
const engine = new Engine({
    graphics:{  //!! Graphics options
        
        sceneType: 'fog',       //!! Scene type, 'env', 'fog', 'basic'

        grids:{                         //!! Grids
            enabled:   true,            //!! Use grids
            colorGrid: 0x224411,        //!! Grid color
            colorCenterLine: 0x442211,  //!! Center line color
        }
    },
    physics:{                   //!! Physics options
        enabled:  true,         //!! Use physics engine
        timeStep: 1/500,        //!! Time step of physics solver
        debug: {
            enabled: true,      //!! Use physics debug
        }
    }
});
//!! Initialize the engine
engine.init().then( ( params ) => {
    engine.start();             //!! Start without callback function
});
```

***
**Example-05: Engine initialization options**
```javascript
//!! Create the engine
const engine = new Engine();

//!! Engine initialization options
const initOpts = {  //!! 
    envPath: 'images/bridge',   //!! Environment texture (CubeMapTexture)
    models: [                   //!! GLTF models
        'models/scene001.gltf', //!! Grround, Walls and Basic Primitive objects
        'models/boxes001.gltf', //!! Textured boxes
    ]
};

//!! Initialise the engine with the given options, the initOpts object
engine.init( initOpts ).then( ( params ) => {
    engine.start();             //!! Start without callback function
});
```

***
**Example-06: Mesh(es) manipulation**
```javascript
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
```

***
**Example-07: Rigid Body manipulation**
```javascript
//!! Create the engine and enable the physics
const engine = new Engine({
    physics:{
        enabled: true,     //!! Enable the physics engine
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
const TARGET_MESH_NAME = 'Cube002';         //!! Target mesh name exported from Blender   
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
```

***
**Example-08: Keyboard input**
```javascript
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
```

***
**Example-09: Applying Force and Impulse to center of the target (world point)**
```javascript
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
```

***
**Example-10: Applying Local-Force and Local-Impulse to center of the target**
```javascript
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
```

***
**Example-11: Physics Materials (Ground and Object Materials**
```javascript
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
```

**Example-12: Show/Hide Body-Debugger and Labels**
```javascript
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
```

***

**Example-13: Raycasting with Force and Impulse**
```javascript
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
```

***

**Example-14: Models and Assets Loading**
```javascript
//!! Create the engine with physics enabled
const engine = new Engine({
    physics:{
        enabled:  true,         //!! Enable the physics engine
        useDebug: false,        //!! Disable mesh debugging
    },
});

//!! Initialization options
const initOpts = {

    envPath: 'images/park',     //!! Environmant directory
    models: [ 
        'models/scene001.gltf', //!! Ground and basic primitive objects
    ]
};

//!! Initialze and start the engine
engine.init( initOpts ).then( () => {
    engine.start( callback );
});


const KEY_DELAY     = 1000; //!! Key delay (1000 is 1 second)
const FORCE_SCALE   = 500;  //!! Force scale
const IMPULSE_SCALE = 10;   //!! Imnpulse scale

var model_loaded = false;   //!! model loaded flag
var asset_loaded = false;   //!! asset loaded flag

//!! Callback function
function callback() {

    //!! Loading
    if( engine.getKeyDown('[', KEY_DELAY) ) {
        if(model_loaded === true) return;   //!! model was loaded, return
        model_loaded = true;
        engine.loadModel('models/boxes001.gltf', function( gltf ){
            engine.printInfo('The boxes001 is loaded!'); 
        });
    }
    else if( engine.getKeyDown(']', KEY_DELAY) ) {
        if(asset_loaded === true) return;   //!! Asset was loaded, return
        asset_loaded = true;
        engine.loadAssets('models/actor001.gltf', function( args ){
            engine.printInfo('The actor001 is loaded!');   
        });
    }

    //!! Raycast
    else if( engine.getKeyDown('r', KEY_DELAY) ) {           
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
```
***