
![screenshort](https://github.com/drsanti/INC691-2019/blob/master/apps/public/images/snapshot002.png)

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

**Example-15: Distance Constraint**
```javascript
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
var   distanceConstraint = undefined;
const desiredDistance    = 5;
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
    engine.addAxesToBody(bodyA);
    engine.addAxesToBody(bodyB);

    //!! Change bodyA to static, set its position and reset its rotation
    engine.setBodyToStatic(bodyA);
    bodyA.position.set(0, 10, 0);   //!! Up
    bodyA.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 1, 1), 0); //!! Reset roration
   
    //!! Damping makes the movement slow down with time
    bodyB.linearDamping  = 0.1;    
    bodyB.angularDamping = 0.1;

    //!! Create distance constraint of the bodyA and bodyB
    distanceConstraint = new CANNON.DistanceConstraint(
        bodyA, bodyB,
        desiredDistance, maxForce
    );
}

//!! Engine callback function
function callback( args ) {

    if( !bodyA || !bodyB ) return;

    if( engine.getKeyDown('a', 1000) ) {

        if( isAdded === true ) return;   //!! It is added, return

        //!! Add the constraint to the physics world
        engine.addConstraint( distanceConstraint ); 
        isAdded = true;
    }

    else if( engine.getKeyDown('r', 1000) ) {

        //!! Remove the constraint from the physics world
        engine.removeConstraint( distanceConstraint );   
        isAdded = false; 
    }

    else if( engine.getKeyDown('f', 1000) ) {
        engine.applyForceToRayBody( 300 );      //!! Appy force to raycasted body   
    }
    else if( engine.getKeyDown('l', 2000) ) {   
        engine.toggleLabels();                  //!! show/hide labels
    }
}
```

**Example-16: Point to Point Constraint**
```javascript
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
```

***

**Example-17: Point to Point Line using Buffer Geometry**
```javascript
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
```
