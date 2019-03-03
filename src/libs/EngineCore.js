export default EngineCore;
export { EngineCore, THREE, CANNON, Utils };

import * as THREE       from 'three';
import * as CANNON      from 'cannon';
import Graphics         from './Graphics';
import Physics          from './Physics';
import Utils            from './Utils';
import Keyboard         from './Keyboard';
import LabelRenderer    from './LabelRenderer';
import RayCast          from './Raycast';
import AssetLoader      from './AssetLoader';
import Options          from './Options';


EngineCore.VERSION = 'EngineCore version 1.0.2';


function EngineCore( options ) {

    Utils.printInfo( EngineCore.VERSION );

    this.options = options || {};

    this.defaultOptions = Options;
    

    this.callback = undefined;
    this.reqAnim  = undefined;

    this.services = [];

    this.properties = {
        frameCount: 0,

        timing: {
            deltaTime:      1/60,
            currentTime:    0,
            previousTime:   0,
            rocessingTime:  0,
        },
        
        graphics: {
            processingTime: 0,
        },
        physics: {
            processingTime: 0,
        }
    };

    this.graphics = undefined;
    this.physics  = undefined;

    //!! EngineCore Plugins
    this.keyboard       = undefined;//new Keyboard();
    this.labelRenderer  = undefined;// new LabelRenderer( this );
    this.raycaster      = undefined;
    this.assetLoader    = undefined;
}


//!! Called by init()
EngineCore.prototype.initPlugins = function() {
    if(!this.keyboard)      this.keyboard       = new Keyboard();
    if(!this.labelRenderer) this.labelRenderer  = new LabelRenderer( this.graphics );
    if(!this.raycaster)     this.raycaster      = new RayCast( this.graphics, this.physics );
    if(!this.assetLoader)   this.assetLoader    = new AssetLoader( this.graphics, this.physics );
}


//!! Called by init()
EngineCore.prototype.initEvents = function() {
    //!! Window Resize Event
    window.addEventListener('resize', function() {
    
        this.graphics.cameras.forEach(camera => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix(); 
        });

        this.graphics.renderers.forEach(renderer => {
            renderer.setSize( window.innerWidth, window.innerHeight );
        });

        if(this.labelRenderer)
            this.labelRenderer.renderer.setSize( window.innerWidth, window.innerHeight );

    }.bind(this), false);
}

EngineCore.prototype.init = function( options, callback ) {

    return new Promise( (resolve, reject) =>{

        var init_options = options || {};
        /*
        init_options:{
            envPath: ...
            models:  ...
        }
        */
        

        //!! Create Graphics
        var g_options = Utils.opts( this.options.graphics, {} );                //!! graphics options passed through EngineCore constructor
        this.graphics = new Graphics( g_options );


        //!! Create Physics
        var p_options = Utils.opts( this.options.physics, {}  );                 //!! physics options passed through EngineCore constructor
        this.physics  = new Physics( this.graphics, p_options );
        
        //!! Initialize Graphics
        this.graphics.init( Utils.opts( init_options, {}) ).then( params => {   //!! graphics options passed through init()

            //!! At this point, cubeTetxure and models are loaded
            //!! Update these:

            //!! Initialize Physics
            this.physics.init( Utils.opts( init_options.physics, {}) );         //!! physics options passed through init()


            //!! Create rigid-bodies from current scene
            for(var i=0; i<params.glTFs.length; i++) {
                this.physics.createBodiesFromScene( params.glTFs[i].scene );    
            }
            

            this.initPlugins();

            this.initEvents();


            //!! Create returned object
            var ret = { glTFs: params.glTFs, envMap: params.envMap, Graphics: this.graphics, Physics: this.physics, Enging: this };

            //!! Resolve
            resolve( ret );

            //!! Callback
            if(callback) {
                callback( ret );
            }
        });
    });
}

EngineCore.prototype.getMilliseconds = function() {
    return performance.now() || Date.now();
}

EngineCore.prototype.updateGraphics = function() {
    const t0 = this.getMilliseconds();
    //!!
    this.graphics.update();

    //!! Label Renderer
    if( this.labelRenderer ) {
        if( this.labelRenderer.labels.length > 0 ) {
            this.labelRenderer.renderer.render( this.graphics.scene, this.graphics.camera );
        }
    }


    return this.getMilliseconds()-t0;
}

EngineCore.prototype.updatePhysics = function( dt_ms ) {

    const t0 = this.getMilliseconds();
    this.physics.update( dt_ms );
    return this.getMilliseconds(dt_ms)-t0;
}

EngineCore.prototype.update = function( callback ) {
    this.reqAnim = undefined;
    this.reqAnim = requestAnimationFrame( this.update.bind(this) );

    this.properties.timing.currentTime = this.getMilliseconds();
    this.properties.timing.deltaTime   = this.properties.timing.currentTime - this.properties.timing.previousTime;

    

    //!! Update Physics
    this.properties.physics.processingTime = this.updatePhysics( this.properties.timing.deltaTime );

    //!! Update Graphics
    this.properties.graphics.processingTime = this.updateGraphics();


    this.properties.frameCount++;

    //!! Callback
    if( this.callback ) {
        this.callback( this.properties );
    }

    this.properties.timing.previousTime = this.properties.timing.currentTime;
}

EngineCore.prototype.start = function( callback ) {
    this.callback = callback;
    if( this.reqAnim !== undefined ) return;    //!! Started, return
    this.reqAnim = requestAnimationFrame(  this.update.bind(this) );
}

EngineCore.prototype.stop = function() {
    if( this.reqAnim === undefined ) return;    //!! Stopped, return
    cancelAnimationFrame( this.reqAnim );
    this.reqAnim = undefined;
}

