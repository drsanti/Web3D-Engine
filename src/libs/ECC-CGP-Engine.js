/*
**************************************************************************************
* ECC-CGP-Engine.js
* Computer-based Graphics and Physics Engine
* This is the wrapped version of the EngineCore
*
* Dr.Santi Nuratch
* Embedded System Computing and Control Laboratory
* ECC-Lab | INC@KMUTT
*
* 03 March, 2019
***************************************************************************************
*/

import { EngineCore, CANNON, THREE, Utils } from './EngineCore';

export { Engine, EngineCore, CANNON, THREE, Utils };


export default class Engine {

    /**
     * Constructor of the EngineCore
     * @param {object} options EngineCore options
     */
    constructor( options ) {

        this.core = new EngineCore( options );
    }


    /**
     * THREE.Color
     */
    static get Color() {
        return THREE.Color;  
    }

    /**
     * THREE.Vector3
     */
    static get Vector3(){
        return THREE.Vector3;
    }

    /**
     * CANNON.Vec3
     */
    static get Vec3(){
        return CANNON.Vec3;
    }

    /**
     * THREE.Vector2
     */
    static get Vector2(){
        return THREE.Vector2;
    }

    /**
     * CANNON.Vec2
     */
    static get Vec2(){
        return CANNON.Vec2;
    }

    /**
     * Return Forward vector (0, 0, +1)
     */
    static get ForwardVector(){
        return new CANNON.Vec3(0, 0, +1);
    }

    /**
     * Return Backward vector (0, 0, -1)
     */
    static get BackwardVector(){
        return new CANNON.Vec3(0, 0, -1);
    }

    /**
     * Return Right vector (-1, 0, 0)
     */
    static get RightVector(){
        return new CANNON.Vec3(-1, 0, 0);
    }

    /**
     * Return Left vector (+1, 0, 0)
     */
    static get LeftVector(){
        return new CANNON.Vec3(+1, 0, 0);
    }

    /**
     * Return Up vector (0, +1, 0)
     */
    static get UpVector(){
        return new CANNON.Vec3(0, +1, 0);
    }

    /**
     * Return Down vector (0, -1, 0)
     */
    static get DownVector(){
        return new CANNON.Vec3(0, -1, 0);
    }

    /**
     * Returns scaled forward vector
     * @param {number} scale vector scale
     */
    getForwardVector( scale ) {
        return new CANNON.Vec3(0, 0, +1).mult( (scale?scale:1) );   
    }

     /**
     * Returns scaled backward vector
     * @param {number} scale vector scale
     */
    getBackwardVector( scale ) {
        return new CANNON.Vec3(0, 0, -1).mult(scale?scale:1);   
    }

     /**
     * Returns scaled right vector
     * @param {number} scale vector scale
     */
    getRightVector( scale ){
        return new CANNON.Vec3(-1, 0, 0).mult(scale?scale:1); 
    }

    /**
     * Returns scaled left vector
     * @param {number} scale vector scale
     */
    getLeftVector( scale ){
        return new CANNON.Vec3(+1, 0, 0).mult(scale?scale:1); 
    }

    /**
     * Returns scaled up vector
     * @param {number} scale vector scale
     */
    getUpVector( scale ){
        return new CANNON.Vec3(0, +1, 0).mult(scale?scale:1); 
    }

    /**
     * Returns scaled down vector
     * @param {number} scale vector scale
     */
    getDownVector( scale ){
        return new CANNON.Vec3(0, -1, 0).mult(scale?scale:1); 
    }


    /**
     * Initialise the core engine. After the engine is iniialized, it will return the Promise and execute the provided callback
     * @param {object}    options   initialization options
     * @param {function}  callback  callback function will be called after all files are loaded
     * @return Promise
     */
    init( options, callback ){
        return this.core.init( options, callback );
    }


    /**
     * Start the engine
     * @param {function} callback It the callback is given, the callback will be periodically called every frame.
     */
    start( callback )  {
        return this.core.start( callback );   
    }


    /**
     * Stop the engine
     */
    stop()  {
        return this.core.stop();   
    }


    /**********************************************************************************************************/
    /*           Options           Options            Options            Options            Options           */
    /**********************************************************************************************************/

    /**
     * Returns default options
     * @return Options
     */
    getDefaultOptions() {
        return this.core.defaultOptions;
    }

    /**
     * Returns engine options
     */
    getEngineOptions() {
        return this.core.options;
    }

    /**
     * Returns graphics options
     */
    getGraphicsOptions() {
        return this.core.graphics.options;   
    }

    /**
     * Returns physics options
     */
    getPhysicsOptions() {
        return this.core.physics.options;   
    }

    /**
     * Returns engine default options
     */
    getEngineDefaultOptions() {
        return this.core.defaultOptions.engine;
    }

    /**
     * Returns graphics default options
     */
    getGraphicsDefaultOptions() {
        return this.core.defaultOptions.graphics;
    }

    /**
     * Returns Physics default options
     */
    getPhysicsDefaultOptions() {
        return this.core.defaultOptions.physics;
    }


    /**********************************************************************************************************/
    /*       Mesh Utility      Mesh Utility       Mesh Utility       Mesh Utility       Mesh Utility          */
    /**********************************************************************************************************/

    /**
     * Returns a mesh specified by the mesh name
     * @param {string} name mesh name
     * @return THREE.Mesh
     */
    getMeshByName( name ) {
        return this.core.graphics.getMeshByName( name );
    }

    /**
     * Returns meshes (excludes helpers, lights and debuggers) in the current scene
     * @return array of THREE.Mesh
     */
    getAllMeshes() {
        return this.core.graphics.getMeshes();
    }

    /**
     * Returns meshes (excludes helpers, lights and debuggers) in the current scene
     * @return array of THREE.Mesh
     */
    getMeshes() {
        return this.core.graphics.getMeshes();
    }

    /**
     * Return all meshes (array of meshes) in the provided scene. If the scene is not provided, the current scene will be used as target scene
     * @param {THREE.Scene} scene target scene
     * @return array of THREE.Mesh
     */
    getMeshesFromScene( scene ) {
        return this.core.graphics.getMeshesFromScene( scene ); 
    }


    /**
     * Adds axes to the spefied mesh
     * @param {THREE.Mesh} mesh THREE Mesh
     * @param {number} size Axes size
     */
    addAxesToMesh( mesh, size ) {
        return this.core.graphics.addAxesToMesh( mesh, size );
    }


    /**
     * Removes axes to the spefied mesh
     * @param {THREE.Mesh} mesh THREE Mesh
     */
    removeAxesFromMesh( mesh ) {
        return this.core.graphics.removeAxesFromMesh( mesh );
    }


    /**
     * Adds axes to all meshes in the currentt scene
     * @param {number} size Axes size
     */
    addAxesToAllMeshes( size ) {
        return this.core.graphics.addAxesToAllMeshes( size );
    }

    /**
     * Removes axes from all meshes in the currentt scene
     */
    removeAxesFromAllMeshes( ) {
        return this.core.graphics.removeAxesFromAllMeshes();
    }

    /**
     * Apply reflection map to all meshes
     */
    applyReflectionMapToAllMeshes() {
        return this.core.graphics.applyReflectionMap( undefined );
    }

    /**
     * Remove reflection map from all meshes
     */
    removeReflectionMapFromAllMeshes() {
        return this.core.graphics.removeReflectionMap( undefined );
    }

    /**********************************************************************************************************/
    /*        Body Utility      Body Utility       Body Utility       Body Utility       Body Utility         */
    /**********************************************************************************************************/

    /**
     * Returns a rigid body specified by mesh name
     * @param {string} name mesh name
     * @return CANNON.Body
     */
    getBodyByMeshName( name ) {
        return this.core.physics.getBodyByMeshName( name );
    }


    /**
     * Returns all rigid bodies (array of bodies) in the current world
     * @return array of CANNON.Body
     */
    getBodiesFromWorld() {
        return this.core.physics.world.bodies;
    }

    /**
     * Returns all rigid bodies (array of bodies) in the current world
     * @return array of CANNON.Body
     */
    getBodies() {
        return this.core.physics.world.bodies;
    }


    /**
     * Set/Change the provided body to static body
     * @param {CANNON.Body} body 
     */
    setBodyToStatic( body ) {
        return this.core.physics.changeBodyToStatic( body );
    }


    /**
     * Set/Change the provided body to dynamic body
     * @param {CANNON.Body} body 
     */
    setBodyToDynamic( body, mass ) {
        return this.core.physics.changeBodyToDynamic( body, mass );
    }



    /**********************************************************************************************************/
    /*  Physics Materials   Physics Materials    Physics Materials    Physics Materials    Physics Materials  */
    /**********************************************************************************************************/

    /**
     * Creates and returns ground material. The created material is added to the physics world internally
     * @param {number} friction     Ground friction
     * @param {number} restitution  Ground restitution
     * @return CANNON.Material
     */
    createGroundMaterial( friction, restitution ) {
        return this.core.physics.createGroundMaterial( friction, restitution );
    }


    /**
     * Creates and returns object (body) material. The created material is added to the physics world internally
     * @param {number} friction     Object friction
     * @param {number} restitution  Object restitution
     * @return CANNON.Material
     */
    createObjectMaterial( friction, restitution, groundMaterial ) {
        return this.core.physics.createObjectMaterial( friction, restitution, groundMaterial );
    }


    /**********************************************************************************************************/
    /*   Keyboard      Keyboard       Keyboard       Keyboard       Keyboard       Keyboard        Keyboard   */
    /**********************************************************************************************************/

    /**
     * Check key pressed, return true if the desired key is pressed
     * @param {string} key      a character or key name
     * @param {number} interval time between each key pressed
     * @return boolean
     */
    getKeyDown( key, interval ) {
        return this.core.keyboard.getKeyDown( key, interval );
    }




    /**********************************************************************************************************/
    /*       Raycaster      Raycaster       Raycaster       Raycaster       Raycaster       Raycaster         */
    /**********************************************************************************************************/

    /**
     * Returns raycasting parameters of all objects
     */
    doRaycast() {
        return this.core.raycaster.doRaycast();
    }

    /**
     * Returns raycasting parameters of the first object
     */
    getRaycast() {
        const raycast = this.core.raycaster.doRaycast();
        if(raycast.length < 1) return undefined;
        return raycast[0];
    }


    //!!---------------- Ray -------------------------------------------

    /**
     * Return Ray of the raycasting operation
     * @return object { mesh, intersecs, ray }
     */
    getRay() {
        return this.getRaycast().ray;
    }

    /**
     * Return RayDirection of the raycasting operation
     * @return ray.direction
     */
    getRayDirection() { 
        const ray = this.getRay();
        if(!ray) return undefined;
        return new CANNON.Vec3(ray.direction.x, ray.direction.y, ray.direction.z); 
    }

    /**
     * Return RayOrigin of the raycasting operation
     * @return ray.origin
     */
    getRayOrigin() {
        const ray = this.getRay();
        if(!ray) return undefined;
        return new CANNON.Vec3(ray.origin.x, ray.origin.y, ray.origin.z);
    }


    //!!-----------------------------------------------------------------
    //!!---------------- Intersect --------------------------------------
    //!!-----------------------------------------------------------------

    /**
     * Return RayIntersec of the raycasting operation
     * @return intersect
     */
    getRayIntersec() {
        const raycast = this.getRaycast();
        return raycast.intersect;
    }

    /**
     * Return RayDistance of the raycasting operation
     * @return intersect.distance
     */
    getRayDistance() {
        const raycast = this.getRaycast();
        const intersect = raycast.intersect;
        if(!intersect) return undefined;
        return intersect.distance;
    }

    /**
     * Return RayPoint of the raycasting operation
     * @return intersect.point
     */
    getRayPoint() {
        const raycast = this.getRaycast();
        const intersect = raycast.intersect;
        if(!intersect) return undefined;
        return new CANNON.Vec3(intersect.point.x, intersect.point.y, intersect.point.z);
    }
    //!!---------------- END Intersect -----------------------------------



    /**
     * Return RayObject of the raycasting operation
     * @return intersect.object
     */
    getRayMesh() {
        const raycast = this.getRaycast();
        const mesh = raycast.mesh;
        if( mesh && mesh.parent && mesh.parent instanceof THREE.Group ) {
            return mesh.parent;
        }
        return mesh;
    }

    /**
     * Returns a rigid body of the raycasting operation
     * @return CANNON.Body
     */
    getRayBody() {
        const raycast = this.getRaycast();
        if( raycast.mesh ) {
            return this.getBodyByMeshName( raycast.mesh.name );
        }
        return undefined;
    }

    /**
     * Helper function to apply force and impulse to world point ro local point
     * @param {number} scale force or impulse scale
     * @param {number} type  0: force, 1: local force, 2: impulse, 3: local impulse
     * @return CANNON.Body
     */
    applyForceImpulseWorldLocal( scale, type ) {
        const raycast = this.getRaycast();
        if(!raycast) return undefined;
        const direction = new CANNON.Vec3(raycast.ray.direction.x,   raycast.ray.direction.y,   raycast.ray.direction.z);
        const point     = new CANNON.Vec3(raycast.intersect.point.x, raycast.intersect.point.y, raycast.intersect.point.z);
        const body = this.getBodyByMeshName( raycast.mesh.name );
        if( !body ) return
        if( type === 0 ) {
            body.applyForce( direction.mult(scale), point );    
        }else if( type === 1 ){
            body.applyLocalForce( direction.mult(scale), point );    
        }else if( type === 2 ){
            body.applyImpulse( direction.mult(scale), point );    
        }else if( type === 3 ){
            body.applyLocalImpulse( direction.mult(scale), point );    
        }
        return body;
    }

    /**
     * Apply force to raycased rigid body
     * @param {number} forceScale force scale to be applied to the raycasted body
     * @return CANNON.Body
     */
    applyForceToRayBody( forceScale ) {
        return this.applyForceImpulseWorldLocal(forceScale, 0);
    }

    /**
     * Apply local force to raycased rigid body
     * @param {number} forceScale force scale to be applied to the raycasted body
     * @return CANNON.Body
     */
    applyLocalForceToRayBody( forceScale ) {
        return this.applyForceImpulseWorldLocal(forceScale, 1);
    }

    /**
     * Apply impulse to raycased rigid body
     * @param {number} impulseScale impulse scale to be applied to the raycasted body
     * @return CANNON.Body
     */
    applyImpulseToRayBody( impulseScale ) {
        return this.applyForceImpulseWorldLocal(impulseScale, 2);
    }

    /**
     * Apply local impulse to raycased rigid body
     * @param {number} impulseScale impulse scale to be applied to the raycasted body
     * @return CANNON.Body
     */
    applyLocalImpulseToRayBody( impulseScale ) {
        return this.applyForceImpulseWorldLocal(impulseScale, 3);
    }



    /**********************************************************************************************************/
    /*         Graphics       Graphics        Graphics        Graphics        Graphics        Graphics        */
    /**********************************************************************************************************/

    /**
     * Returns the main camera object
     * @return THREE.Camera
     */
    getCamera() {
        return this.core.graphics.camera;
    }

    /**
     * Returns the current scene object
     * @return THREE.Scene
     */
    getScene() {
        return this.core.graphics.scene;
    }
    
    /**
     * Returns current used controls
     * @return THREE.Controls
     */
    getControls() {
        return this.core.graphics.control;
    }

    /**
     * Enables/Disables controls
     * @return THREE.Controls
     */
    setControlsEnabled( enabled ) {
        this.core.graphics.control.enabled = enabled;   
        return this.core.graphics.control;
    }

     /**
     * Set damping factor of controls
     * @return THREE.Controls
     */
    setControlsDamping( damping ) {
        this.core.graphics.control.damping = damping;
        return this.core.graphic.control;
    }
    

    /**********************************************************************************************************/
    /*    Light       Light        Light        Light        Light        Light        Light        Light     */
    /**********************************************************************************************************/

    /**
     * Returns array of ambient lights lights
     * @return Array of THREE.AmbientLight
     */
    getAmbientLights() {
        return this.core.graphics.ambientLights;
    }

    /**
     * Returns array of point lights
     * @return Array of THREE.PointLight
     */
    getPointLights() {
        return this.core.graphics.pointLights;
    }

    /**
     * Returns array of spot lights
     * @return Array of THREE.SpotLight
     */
    getSpotLights() {
        return this.core.graphics.spotLights;
    }

     /**
     * Returns array of directional lights
     * @return Array of THREE.DirectionalLight
     */
    getDirectionalLights() {
        return this.core.graphics.directionalLights;
    }

    /**
     * Set color of the target light
     * @param {THREE.Light} light target light
     * @param {THREE.Color} color color, THREE.Color or HEX color 
     * @return THREE.Color 
     */
    setLightColor( light, color ) {
        light.color = new Engine.Color( color );
        return light.color;
    }

    /**
     * Set light visibility
     * @param {THREE.Light} light target light
     * @param {boolean} visible   true: visible, false: invisible
     * @return the garget light
     */
    setLightVisible( light, visible ) {
        light.visible = visible;
        return light;
    }

    /**
     * Set light intensity
     * @param {THREE.Light} light target light
     * @param {number} intensity  intensity of light
     * @return the garget light
     */
    setLightIntensity( light, intensity ) {
        light.intensity = intensity;
        return light;
    }



    /**********************************************************************************************************/
    /*       Print      Print       Print       Print       Print       Print       Print       Print         */
    /**********************************************************************************************************/

    /**
     * Print message to console window
     * @param {string} message      message to be printed to console window
     * @param {string} typeOrColor  message type or message color code
     * @return Utils object
     */
    print( message, typeOrColor ) {
        return Utils.print( message, typeOrColor );
    }

    /**
     * Print info-message to console window
     * @param {string} message message to be printed to console window
     * @return Utils object
     */
    printInfo( message ) {
        return Utils.printInfo( message );
    }

    /**
     * Print success-message to console window
     * @param {string} message message to be printed to console window
     * @return Utils object
     */
    printSuccess( message ) {
        return Utils.printSuccess( message );
    }

    /**
     * Print warning-message to console window
     * @param {string} message message to be printed to console window
     * @return Utils object
     */
    printWarning( message ) {
        return Utils.printWarning( message );
    }

    /**
     * Print danger-message to console window
     * @param {string} message message to be printed to console window
     * @return Utils object
     */
    printDanger( message ) {
        return Utils.printDanger( message );
    }

    /**
     * Print primary-message to console window
     * @param {string} message message to be printed to console window
     * @return Utils object
     */
    printPrimary( message ) {
        return Utils.printPrimary( message );
    }


    /**********************************************************************************************************/
    /*       Label      Label       Label       Label       Label       Label       Label       Label         */
    /**********************************************************************************************************/
    /**
     * Adds label to the mesh
     * @param {THREE.Mesh} mesh  target mesh 
     * @param {string}     label label/text to be displayed on the mesh
     * @return CSS2DObject label
     */
    addLabel( mesh, label ) {
        return this.core.labelRenderer.addLabel( mesh, label );
    }

    /**
     * Changes css class name of the label
     * @param {THREE.Mesh} mesh  target mesh 
     * @param {string} className css class name
     * @return CSS2DObject label
     */
    setLabelClass( mesh, className ) {
        return this.core.labelRenderer.setLabelClass( mesh, className );
    }

    /**
     * Adds css class name into css classList of the label element
     * @param {HREE.Mesh} mesh   target mesh 
     * @param {string} className css class name
     * @return CSS2DObject label
     */
    addLabelClass( mesh, className ) {
        return this.core.labelRenderer.addLabelClass( mesh, className );
    }

    /**
     * Returns label of the provided mesh
     * @param {THREE.Mesh} mesh target mesh
     * @return CSS2DObject label
     */
    getLabel( mesh ) {
        return this.core.labelRenderer.getLabel( mesh );
    }

    /**
     * Updates label of the provided mesh
     * @param {THREE.Mesh} mesh  target mesh
     * @param {string}     label label/text to be displayed on the mesh
     * @return CSS2DObject label
     */
    updateLabel( mesh, label ) {
        return this.core.labelRenderer.updateLabel( mesh, label );
    }

    /**
     * Sets label position relative to the target mesh
     * @param {THREE.Mesh}    mesh     target mesh
     * @param {THREE.Vector3} position label position
     * @return CSS2DObject label
     */
    setLabelPosition(mesh, position) {
        return this.core.labelRenderer.setLabelPosition( mesh, position );
    }

    /**
     * Add labels to meshes in the current scene
     * @return THREE.Mesh[ ]
     */
    addLabelToObjects() {
        return this.core.labelRenderer.addLabelToObjects( );
    }

    /**
     * Removes all labels from meshes in the current scene
     * @return THREE.Mesh[ ]
     */
    removeLabel( mesh ) {
        return this.core.labelRenderer.removeLabel( mesh );   
    }

    /**
     * Removes all labels from meshes in the current scene
     * @return THREE.Mesh[ ]
     */
    removeLabelFromObjects() {
        return this.core.labelRenderer.removeLabelFromObjects();   
    }

    /**
     * Show labels
     */
    showLabels() {
        return this.core.labelRenderer.show();
    }
    
    
    /**
     * Hide labels
     */
    hideLabels() {
        return this.core.labelRenderer.hide();
    }

    /**
     * Toggle labels visibility
     */
    toggleLabels() {
        return this.core.labelRenderer.toggle();
    }

    /**********************************************************************************************************/
    /*  Asset Loader      AssetLoader       AssetLoader       AssetLoader       AssetLoader       AssetLoader */
    /**********************************************************************************************************/
    
    /**
     * Load asset, the special model. This model includes actor/character and colliders
     * @param {string} model GLTF file name
     * @param {*} callback   callback function
     * @return Promise
     */
    loadAssets( model, callback ) {
        this.core.assetLoader.load( model, callback );
    }

    /**
     * Loads models, adds to scene, creates rigid-body and applies reflection-map
     * @param {string} model file name
     * @param {*} callback callback function
     * @return Promise
     */
    loadModel( model, callback ) {

        return new Promise( (resolve, reject) => {

            //!! 1) Load model
            this.core.graphics.loadGLTF(model).then( (gltf) => {

                //!! 2) Add all objects to scene
                this.core.graphics.scene.add( gltf.scene );

                //!! 3) Create rigid-bodies
                this.core.physics.createBodiesFromScene( gltf.scene );

                //!! 4) Apply reflection map to all meshes
                if( this.core.graphics.options.useReflection ) {
                    this.core.graphics.applyReflectionMap( gltf.scene );
                }
                
                //!! 5) Resolve
                resolve(gltf);

                //!! Callback
                if( callback ) {
                   callback(gltf); 
                }
            });  
        });
    }

    /**
     * Show body-debugger
     */
    showDebug() {
        return this.core.physics.bodyDebug.show();  
    }

    /**
     * Hide body-debugger
     */
    hideDebug() {
        return this.core.physics.bodyDebug.hide();  
    }

    /**
     * Toggle body-debugger visibility
     */
    toggleDebug() {
        return this.core.physics.bodyDebug.toggle();  
    }

    /**
     * Show grids helper
     */
    showGrids() {
        this.core.graphics.addGrids();
    }

    /**
     * Hide grids helper
     */
    hideGrids() {
        this.core.graphics.removeGrids();
    }

    /**
     * Toggle grids visibility
     */
    toggleGrids() {
        this.core.graphics.toggleGrids();
    }


    /**
     * Show axes helper
     */
    showAxes() {
        this.core.graphics.addAxes();
    }

    
    /**
     * Hide axes helper
     */
    hideAxes() {
        this.core.graphics.removeAxes();
    }

    /**
     * Toggle axes visibility
     */
    toggleAxes() {
        this.core.graphics.toggleAxes();
    }
}
