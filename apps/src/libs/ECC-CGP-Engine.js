
import { EngineCore, CANNON, THREE, Utils }         from './EngineCore';
import { Graphics, Physics, RayCast, Keyboard }     from './EngineCore';
import { ActorLoader, Options }                     from './EngineCore';



export default class Engine {

    static get Color() {
        return THREE.Color;  
    }

    static get Vector3(){
        return THREE.Vector3;
    }
    static get Vec3(){
        return CANNON.Vec3;
    }
    static get Vector2(){
        return THREE.Vector2;
    }
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
     * Constructor of the EngineCore
     * @param {object} options EngineCore options
     */
    constructor( options ) {

        this.core = new EngineCore( options );
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
        return this.core.graphics.meshUtils.getMeshByName( name );
    }

     /**
     * Returns all meshes in the current scene
     * @return array of THREE.Mesh
     */
    getAllMeshes() {
        return this.core.graphics.meshUtils.getAllMeshes( name );
    }

    /**
     * Return all meshes (array of meshes) in the provided scene. If the scene is not provided, the current scene will be used as target scene
     * @param {THREE.Scene} scene target scene
     * @return array of THREE.Mesh
     */
    getMeshesFromScene( scene ) {
        return this.core.graphics.meshUtils.getMeshesFromScene( scene ); 
    }


    /**
     * Adds axes to the spefied mesh
     * @param {THREE.Mesh} mesh THREE Mesh
     * @param {number} size Axes size
     */
    addAxesToMesh( mesh, size ) {
        return this.core.graphics.meshUtils.addAxesToMesh( mesh, size );
    }


    /**
     * Removes axes to the spefied mesh
     * @param {THREE.Mesh} mesh THREE Mesh
     */
    removeAxesFromMesh( mesh ) {
        return this.core.graphics.meshUtils.removeAxesFromMesh( mesh );
    }


    /**
     * Adds axes to all meshes in the currentt scene
     * @param {number} size Axes size
     */
    addAxesToAllMeshes( size ) {
        return this.core.graphics.meshUtils.addAxesToAllMeshes( size );
    }

    /**
     * Removes axes from all meshes in the currentt scene
     */
    removeAxesFromAllMeshes( ) {
        return this.core.graphics.meshUtils.removeAxesFromAllMeshes();
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
        return this.core.physics.bodyUtils.getBodyByMeshName( name );
    }

    /**
     * Returns all rigid bodies (array of bodies) in the current world
     * @return array of CANNON.Body
     */
    getBodiesFromWorld() {
        return this.core.physics.world.bodies;
    }

    /**
     * Returns all meshes (array of mesh) in the current world
     * @return array of THREE.Mesh
     */
    getMeshesFromWorld() {
        return this.core.physics.bodyUtils.getMeshesFromWorld();
    }

    /**
     * Set/Change the provided body to static body
     * @param {CANNON.Body} body 
     */
    setBodyToStatic( body ) {
        return this.core.physics.bodyUtils.changeBodyToStatic( body );
    }

    /**
     * Set/Change the provided body to dynamic body
     * @param {CANNON.Body} body 
     */
    setBodyToDynamic( body, mass ) {
        return this.core.physics.bodyUtils.changeBodyToStatic( body, mass );
    }

    setBodyMass( body, mass ) {

    }

    getMass(mesh) {
        const name = mesh.name.toLowerCase();
        if( name.includes('static') || name.includes('ground') )
            return 0;
        return (mesh.scale.x + mesh.scale.y + mesh.scale.z)/3;   
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
     * Returns raycasting objects
     */
    doRaycast() {
        return this.core.raycaster.doRaycast();
    }

    //!!---------------- Ray -------------------------------------------

    /**
     * Return Ray of the raycasting operation
     * @return object { mesh, intersecs, ray }
     */
    getRay() {
        const rc = this.doRaycast();
        return rc.length < 1 ? undefined : rc[0].ray;//this.core.raycaster.doRaycast()[0].ray;   
    }

    /**
     * Return RayDirection of the raycasting operation
     * @return ray.direction
     */
    getRayDirection() {
        const rc = this.doRaycast();
        return rc.length < 1 ? undefined : rc[0].ray.direction;//return this.core.raycaster.doRaycast()[0].ray.direction;   
    }

    /**
     * Return RayOrigin of the raycasting operation
     * @return ray.origin
     */
    getRayOrigin() {
        const rc = this.doRaycast();
        return rc.length < 1 ? undefined : rc[0].ray.origin;//return this.core.raycaster.doRaycast()[0].ray.origin;   
    }

    //!!---------------- Intersect --------------------------------------

    /**
     * Return RayIntersec of the raycasting operation
     * @return intersect
     */
    getRayIntersec() {
        const rc = this.doRaycast();
        return rc.length < 1 ? undefined : rc[0].intersect;
    }

    /**
     * Return RayDistance of the raycasting operation
     * @return intersect.distance
     */
    getRayDistance() {
        const rc = this.doRaycast();
        return rc.length < 1 ? undefined : rc[0].intersect.distance;
    }

    /**
     * Return RayPoint of the raycasting operation
     * @return intersect.point
     */
    getRayPoint() {
        const rc = this.doRaycast();
        return rc.length < 1 ? undefined : rc[0].intersect.point;
    }

    /**
     * Return RayObject of the raycasting operation
     * @return intersect.object
     */
    getRayObject() {
        const rc = this.doRaycast();
        return rc.length < 1 ? undefined : rc[0].intersect.object;
    }

    /**********************************************************************************************************/
    /*       Camera       Camera        Camera        Camera        Camera        Camera        Camera        */
    /**********************************************************************************************************/

    /**
     * Returns the main camera object
     */
    getCamera() {
        return this.core.graphics.camera;
    }


    /**********************************************************************************************************/
    /* Controls       Controls        Controls        Controls        Controls        Controls       Controls */
    /**********************************************************************************************************/
    getControls() {
        return this.core.graphics.controls;
    }

    setControlsEnabled( enabled ) {
        this.core.graphics.controls.enabled = enabled;   
        return this;
    }

    setControlsDamping( damping ) {
        this.core.graphics.controls.damping = damping;
        return this;
    }
    

    /**********************************************************************************************************/
    /*    Light       Light        Light        Light        Light        Light        Light        Light     */
    /**********************************************************************************************************/

    /**
     * Returns array of ambient lights lights
     */
    getAmbientLights() {
        return this.core.graphics.ambientLights;
    }

    /**
     * Returns array of point lights
     */
    getPointLights() {
        return this.core.graphics.pointLights;
    }

    /**
     * Returns array of spot lights
     */
    getSpotLights() {
        return this.core.graphics.spotLights;
    }

     /**
     * Returns array of directional lights
     */
    getDirectionalLights() {
        return this.core.graphics.directionalLights;
    }

    /**
     * Set color of the target light
     * @param {THREE.Light} light target light
     * @param {THREE.Color} color color, THREE.Color or HEX color  
     */
    setLightColor( light, color ) {
        light.color = new Engine.Color(color);
    }

    /**
     * Set light visibility
     * @param {THREE.Light} light target light
     * @param {boolean} visible   true: visible, false: invisible
     */
    setLightVisible( light, visible ) {
        light.visible = visible;
    }

    /**
     * Set light intensity
     * @param {THREE.Light} light target light
     * @param {number} intensity  intensity of light
     */
    setLightIntensity( light, intensity ) {
        light.intensity = intensity;
    }



    /**********************************************************************************************************/
    /*       Print      Print       Print       Print       Print       Print       Print       Print         */
    /**********************************************************************************************************/

    /**
     * Print message to console window
     * @param {string} message message to be printed to console window
     * @param {*} typeOrColor  message type or message color code
     */
    print( message, typeOrColor ) {
        return Utils.print( message, typeOrColor);
    }

    /**
     * Print info-message to console window
     * @param {string} message message to be printed to console window
     */
    printInfo( message ) {
        return Utils.printInfo( message );
    }

    /**
     * Print success-message to console window
     * @param {string} message message to be printed to console window
     */
    printSuccess( message ) {
        return Utils.printSuccess( message );
    }

    /**
     * Print warning-message to console window
     * @param {string} message message to be printed to console window
     */
    printWarning( message ) {
        return Utils.printWarning( message );
    }

    /**
     * Print danger-message to console window
     * @param {string} message message to be printed to console window
     */
    printDanger( message ) {
        return Utils.printDanger( message );
    }

    /**
     * Print primary-message to console window
     * @param {string} message message to be printed to console window
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
    addMeshLabel( mesh, label ) {
        return this.core.graphics.labelRenderer.addMeshLabel( mesh, label );
    }

    /**
     * Changes css class name of the label
     * @param {THREE.Mesh} mesh  target mesh 
     * @param {string} className css class name
     * @return CSS2DObject label
     */
    setMeshLabelClass( mesh, className ) {
        return this.core.graphics.labelRenderer.setMeshLabelClass( mesh, className );
    }

    /**
     * Adds css class name into css classList of the label element
     * @param {HREE.Mesh} mesh   target mesh 
     * @param {string} className css class name
     * @return CSS2DObject label
     */
    addMeshLabelClass( mesh, className ) {
        return this.core.graphics.labelRenderer.addMeshLabelClass( mesh, className );
    }

    /**
     * Returns label of the provided mesh
     * @param {THREE.Mesh} mesh target mesh
     * @return CSS2DObject label
     */
    getMeshLabel( mesh ) {
        return this.core.graphics.labelRenderer.getMeshLabel( mesh );
    }

    /**
     * Updates label of the provided mesh
     * @param {THREE.Mesh} mesh  target mesh
     * @param {string}     label label/text to be displayed on the mesh
     * @return CSS2DObject label
     */
    updateMeshLabel( mesh, label ) {
        return this.core.graphics.labelRenderer.updateMeshLabel( mesh, label );
    }

    /**
     * Sets label position relative to the target mesh
     * @param {THREE.Mesh}    mesh     target mesh
     * @param {THREE.Vector3} position label position
     * @return CSS2DObject label
     */
    setMeshLabelPosition(mesh, position) {
        return this.core.graphics.labelRenderer.setMeshLabelPosition( mesh, position );
    }

    /**
     * Add labels to meshes in the current scene
     * @return THREE.Mesh[ ]
     */
    addMeshLabelToMeshes() {
        return this.core.graphics.labelRenderer.addMeshLabelToMeshes( );
    }

    /**
     * Removes all labels from meshes in the current scene
     * @return THREE.Mesh[ ]
     */
    removeMeshLabel( mesh ) {
        return this.core.graphics.labelRenderer.removeMeshLabel( mesh );   
    }

    /**
     * Removes all labels from meshes in the current scene
     * @return THREE.Mesh[ ]
     */
    removeMeshLabelFromMeshes() {
        return this.core.graphics.labelRenderer.removeMeshLabelFromMeshes();   
    }
}
