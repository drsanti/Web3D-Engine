**Computer-based Graphics and Physics Engine**
***

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
        engine.printInfo( "Engine stopped" );
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
//!! Create the engine
const engine = new Engine();

//!! Initialize the engine
engine.init().then( ( params ) => {
    userInit( params );             //!! User initialization function
    engine.start();                 //!! Start the engine without callback
});

//!! User initialize function
function userInit( params ) {
    engine.printInfo("Put initialized code here");
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
        useDebug: true,         //!! Use physics debug
        stepTime: 1/10          //!! Step time of physics solver
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
    envPath: 'images/Bridge2',  //!! Environment texture (CubeMapTexture)
    models: [                   //!! GLTF models
        'models/prebuilds/grounds/ground1.gltf',
        'models/prebuilds/boxes/box1.gltf',
        'models/prebuilds/boxes/box2.gltf',
        'models/prebuilds/boxes/box3.gltf',
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
    envPath: 'images/Bridge2',  //!! Environment texture (CubeMapTexture)
    models: [                   //!! GLTF models
        'models/prebuilds/grounds/ground1.gltf',
    ]
};

//!! Initialise the engine with the given options, the initOpts object
engine.init( initOpts ).then( ( params ) => {
    uerInit( params );
    engine.start( callback );   //!! Start and provide the callback function
});

//!! Target
const TARGET_MESH_NAME = 'CubeBrick1';      //!! Target mesh name exported from the Blender   
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

    if( !targetMesh ) return;   //!! If the targetMesh is not defined, do nothing

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
const initOpts = {              //!! Initialization options
    envPath: 'images/Bridge2',  //!! Environment texture (CubeMapTexture)
    models: [                   //!! GLTF models
        'models/prebuilds/grounds/ground1.gltf',
    ]
};

//!! Initialise the engine with the given options, the initOpts object
engine.init( initOpts ).then( ( params ) => {
    uerInit( params );                      //!! Execute the userInit function
    engine.start( callback );               //!! Start and provide the callback function
});

//!! Target
const TARGET_MESH_NAME = 'CubeBrick1';      //!! Target mesh name exported from the Blender   
var targetBody = undefined;                 //!! Target body will be used in userInit and loop/callback

//!! User initialization function
function uerInit( params ) {

    //!! Get the target mesh
    targetBody = engine.getBodyByMeshName( TARGET_MESH_NAME );

    if( !targetBody ) {
        console.error('Cannot find rigid body of the "' + TARGET_MESH_NAME + '" in the current scene!');
    }

    //!! See its details in the console window
    console.log( targetBody );
}
//!! Engine callback function
function callback( args ) {
    if( !targetBody ) return;    //!! If the targetMesh is not defined, do nothing

    //!! Angular velocity of the y-axis (make it rotate)
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
const initOpts = {              //!! Initialization options
    envPath: 'images/Bridge2',  //!! Environment texture (CubeMapTexture)
    models: [                   //!! GLTF models
        'models/prebuilds/grounds/ground1.gltf',
    ]
};
//!! Initialise the engine with the given options, the initOpts object
engine.init( initOpts ).then( ( params ) => {
    uerInit( params );                      //!! Execute the userInit function
    engine.start( callback );               //!! Start and provide the callback function
});

//!! Target
const TARGET_MESH_NAME = 'CubeBrick1';      //!! Target mesh name exported from Blender   
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
    if( !targetBody ) return;               //!! If the targetMesh is not defined, do nothing

    if( engine.getKeyDown('a') ) {          //!! If the 'a' key is pressed, rotate +y
        targetBody.angularVelocity.set(0, +10, 0);
    }
    else if( engine.getKeyDown('d') ) {     //!! If the 'd' key is pressed, rotate -y
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
        enabled: true,      //!! Enable the physics engine
    },
    graphics: {
        grids: {
            enabled: false, //!! Disable the grids
        }
    }
});

//!! Engine initialization options
const initOpts = {              //!! Initialization options
    envPath: 'images/Bridge2',  //!! Environment texture (CubeMapTexture)
    models: [                   //!! GLTF models
        'models/prebuilds/grounds/ground1.gltf',
    ]
};

//!! Initialise the engine with the given options, the initOpts object
engine.init( initOpts ).then( ( params ) => {
    uerInit( params );                      //!! Execute the userInit function
    engine.start( callback );               //!! Start and provide the callback function
});

//!! Target
const TARGET_MESH_NAME = 'CubeBrick3';      //!! Target mesh name exported from Blender   
var targetBody = undefined;                 //!! Target body will be used in userInit and loop/callback

//!! User initialization function
function uerInit( params ) {

    //!! Get the target mesh
    targetBody = engine.getBodyByMeshName( TARGET_MESH_NAME );

    if( !targetBody ) {
        console.error('Cannot find rigid body of the "' + TARGET_MESH_NAME + '" in the current scene!');
    }

    //!! Add axes to the target mesh, the threemesh of the rigid body
    engine.addAxesToMesh( targetBody.threemesh, 3 );    //!! 3 is the axes size
}

//!! Apply force to the position of the target body
function addForce( forceVector,  forceScale) {
    var targetPoint = new Engine.Vec3(0, 0, 0);     //!! Create a zero vector
    targetPoint.copy( targetBody.position );        //!! Copy the target position

    //!! Apply the scaled force vector to the target point
    targetBody.applyForce( forceVector.mult(forceScale), targetPoint );
}

//!! Apply impulse to the position of the target body
function addImpulse( impulseVector,  impulseScale) {
    var targetPoint = new Engine.Vec3(0, 0, 0);     //!! Create a zero vector
    targetPoint.copy( targetBody.position );        //!! Copy the target position

    //!! Apply the scaled impulse vector to the target point (orgin of the target)
    targetBody.applyImpulse( impulseVector.mult(impulseScale), targetPoint );
}

//!! Force and Impulse scales
const FORCE_SCALE   = 20;   //!! Force scale
const IMPULSE_SCALE = 1;    //!! Impulse scale

//!! Engine callback function
function callback( args ) {

    if( !targetBody ) return;    //!! If the targetMesh is not defined, do nothing

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
            enabled: false,     //!! Disable the helper grids
        }
    }
});

//!! Engine initialization options
const initOpts = {              //!! Initialization options
    envPath: 'images/Bridge2',  //!! Environment texture (CubeMapTexture)
    models: [                   //!! GLTF models
        'models/prebuilds/grounds/ground1.gltf',
    ]
};

//!! Initialise the engine with the given options, the initOpts object
engine.init( initOpts ).then( ( params ) => {
    uerInit( params );                      //!! Execute the userInit function
    engine.start( callback );               //!! Start and provide the callback function
});

//!! Target
const TARGET_MESH_NAME = 'SphereBall1';     //!! Target mesh name exported from the Blender   
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
    var targetPoint = new Engine.Vec3(0, 0, 0);     ///!! Origin of the target

    //!! Apply the scaled local force vector to the target (origin of the target)
    targetBody.applyLocalForce( forceVector.mult(forceScale), targetPoint );
}

//!! Apply local impulse to the center of the target body
function addLocalImpulse( impulseVector,  impulseScale) {
    var targetPoint = new Engine.Vec3(0, 0, 0);     //!! Origin of the target

    //!! Apply the scaled local impulse vector to the target (origin of the target)
    targetBody.applyLocalImpulse( impulseVector.mult(impulseScale), targetPoint );
}

//!! Local Force and Local Impulae scales
const LOCAL_FORCE_SCALE   = 20;     //!! Force scale
const LOCAL_IMPULSE_SCALE = 1;      //!! Impulse scale

//!! Engine callback function
function callback( args ) {

    if( !targetBody ) return;       //!! If the targetMesh is not defined, do nothing

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
const engine = new Engine({
    physics:{
        enabled:  true,     //!! Enable the physics engine
        useDebug: true,
        debugColor: 0x448877
    },
    graphics: {
        grids: {
            enabled: false, //!! Disable the helper grids
        }
    }
});

//!! Engine initialization options
const initOpts = {              //!! Initialization options 
    envPath: 'images/Bridge2',  //!! Environment texture (CubeMapTexture)
    models: [                   //!! GLTF models
        'models/prebuilds/grounds/ground1.gltf',
    ]
};

//!! Initialise the engine with the given options, the initOpts object
engine.init( initOpts ).then( ( params ) => {
    uerInit( params );                      //!! Execute the userInit function
    engine.start( callback );               //!! Start and provide the callback function
});


//!! Targets
const GROUND_MESH_NAME = 'StaticCube';      //!! Ground mesh name exported from the Blender   
const TARGET_MESH_NAME = 'SphereBall1';     //!! Ball mesh name exported from the Blender   
var targetBody = undefined;                 //!! Target body will be used in userInit and loop/callback

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


//!! Apply force to the position (origin) of the target body
function addForce( forceVector,  forceScale ) {
    var targetPoint = new Engine.Vec3(0, 0, 0); //!! Create a vector
    targetPoint.copy( targetBody.position );    //!! Copy the target position

    //!! Apply the scaled force vector to the target point
    targetBody.applyForce( forceVector, targetPoint );
}

//!! Apply impulse to the position (origin) of the target body
function addImpulse( impulseVector,  impulseScale) {
    var targetPoint = new Engine.Vec3(0, 0, 0); //!! Create a vector
    targetPoint.copy( targetBody.position );    //!! Copy the target position

    //!! Apply the scaled impulse vector to the target point
    targetBody.applyImpulse( impulseVector, targetPoint );
}


//!! Force and Impluse scales
const FORCE_SCALE   = 20;   //!! Force scale
const IMPULSE_SCALE = 1;    //!! Impulse scale

//!! Engine callback function
function callback( args ) {

    if( !targetBody ) return;   //!! If the targetMesh is not defined, do nothing

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
