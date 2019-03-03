export default Graphics;

import * as THREE   from 'three';
import * as CANNON  from 'cannon';

import * as GLTFLoader   from 'three-gltf-loader';
import * as OrbitControls  from 'threejs-orbit-controls';

//const GLTFLoader    = require('three-gltf-loader');
//const OrbitControls = require('threejs-orbit-controls');

//const Options       = require('./Options');
import Options          from './Options';
import Stats from './Stats';
import Utils from './Utils';


function Graphics( options ) {

    this.options = options || {};

    

    this.reqAnim = undefined;

    this.cameras   = [];
    this.renderers = [];
    this.scenes    = [];
    this.controls  = [];
    this.stats     = [];

    this.ambientLights      = [];
    this.pointLights        = [];
    this.spotLights         = [];
    this.directionalLights  = [];

    this.scene    = undefined;
    this.camera   = undefined;
    this.renderer = undefined;
    this.control  = undefined;

    this.fogPlane = undefined;
    this.envMap   = undefined;

}

Graphics.prototype.init = function( options, callback ) {
    
    return new Promise( (resolve, reject) => {

        //!! Scene
        this.scene    = this.createScene();
        
        //!! Camera
        this.camera   = this.createCamera();
        
        //!! Renderer
        this.renderer = this.createRenderer();
        document.body.appendChild( this.renderer.domElement );


        //!! Ambient Light
        this.options.ambientLight = Utils.opts( this.options.ambientLight, Options.graphics.ambientLight );
        if( this.options.ambientLight.enabled ) {
            this.addAmbientLight( this.options.ambientLight );
        }

        //!! Point Light
        this.options.pointLight = Utils.opts( this.options.pointLight, Options.graphics.pointLight );
        if( this.options.pointLight.enabled ) {
            this.addPointLight( this.options.pointLight );
        }

        //!! Spot Light
        this.options.spotLight = Utils.opts( this.options.spotLight, Options.graphics.spotLight );
        if( this.options.spotLight.enabled ) {
            this.addSpotLight( this.options.spotLight );
        }

        //!! Directional Light
        this.options.directionalLight = Utils.opts( this.options.directionalLight, Options.graphics.directionalLight );
        if( this.options.directionalLight.enabled ) {
            this.addDirectionalLight(  this.options.directionalLight );
        }
    
        
        //!! Stats
        this.options.stats = Utils.opts( this.options.stats, Options.graphics.stats );
        if( this.options.stats.enabled ) {
            this.addStats( this.options.stats );
        }

        //!! Controls
        this.options.controls = Utils.opts( this.options.controls, Options.graphics.controls );
        if( this.options.controls.enabled ) {
            this.control  = this.createControls( this.options.controls );
        }

        //!! Scene Type
        this.options.sceneType = Utils.opts( this.options.sceneType, Options.graphics.sceneType );
        this.setSceneType( this.options.sceneType );

        //!! Grids
        this.options.grids = Utils.opts( this.options.grids, Options.graphics.grids );
        if( this.options.grids.enabled ) {
            this.addGrids( this.options.grids );
        }

        //!! Axes
        //!! Grids
        this.options.axes = Utils.opts( this.options.axes, Options.graphics.axes );
        if( this.options.axes.enabled ) {
            this.addAxes( this.options.axes );
        }


        //!! graphics.init options
        options  = Utils.opts( options, {} );
        options.envPath   = Utils.opts( options.envPath     , Options.graphics.env.path     );
        options.models    = Utils.opts( options.models      , Options.graphics.models       );
        options.start     = Utils.opts( options.start       , Options.graphics.start        );
        options.callback  = Utils.opts( options.callback    , Options.graphics.callback     );


        const self = this;

        //!! Reflection texture and models
        this.loadCubeTexture( options.envPath, cubeTexture => {
            Utils.printInfo( 'Environment map "' + options.envPath + '" is loaded' );

            //!! Update reflection map
            self.envMap = cubeTexture;

            //!! Change Scene Background
            if( this.options.sceneType == 'env' )
                self.scene.background = cubeTexture;

            let glTFs = [];

            if( options.models.length > 0 ) {
                var cnt = 0;
                options.models.forEach( file => {
                    self.loadGLTF( file, gltf => {

                        glTFs.push( gltf );

                        Utils.printInfo( 'glTF model "' + file + '" is loaded' );
                        
                        //!! Add to the main scene
                        self.scene.add( gltf.scene );

                        //!! Apply reflection map to the loaded scene
                        this.options.useReflection = Utils.opts(this.options.useReflection, Options.graphics.useReflection);
                        if( this.options.useReflection ) {
                            self.applyReflectionMap( gltf.scene );
                        }

                        cnt++;

                        if( cnt >= options.models.length ) {
                            _do_resolve_callback( resolve, glTFs, cubeTexture );
                        }
                    });  
                });
            } 
            else{
                Utils.printWarning( 'Graphics.init: No model/file is provided' );
                _do_resolve_callback( resolve, glTFs, cubeTexture );
                
            }
        });

        function _do_resolve_callback( resolve, glTFs, cubeTexture ) {
            
            var ret = { Graphics: this, glTFs: glTFs, envMap: cubeTexture};
            //!! Resolved
            
            resolve( ret );
    
            //!! Loaded callback
            if( callback ) {
                callback( ret );
            }
    
            //!! Options
            if( options.callback ) {
                self.callback = options.callback;
            }
            if( options.start ) {
                self.start( self.callback );
            }
        }
    });
}


/**
 * Add Grids helper
 */
Graphics.prototype.addGrids = function( options ) {

    if( this.isGridsAdded () ) return;

    options = options || {};
    options.colorGrid = options.colorGrid ? options.colorGrid : options.color;
    const defOpts = Options.graphics.grids;
    const gridHelper = new THREE.GridHelper( 
        Utils.opts ( options.size           ,   defOpts.size            ),
        Utils.opts ( options.divisions      ,   defOpts.divisions       ),
        Utils.opts ( options.colorCenterLine,   defOpts.colorCenterLine ),
        Utils.opts ( options.colorGrid      ,   defOpts.colorGrid       )
    );
    
    gridHelper.name         = Utils.HELPER.PREFIX + Utils.GRIDS.PREFIX;

    gridHelper.material.opacity     = Utils.opts ( options.opacity, 0.5 );
    gridHelper.material.transparent = gridHelper.material.opacity   < 1 ? true : false;

    options.position        = options.position || {};
    gridHelper.position.x   = Utils.opts ( options.position.x, defOpts.position.x );
    gridHelper.position.y   = Utils.opts ( options.position.y, defOpts.position.y );
    gridHelper.position.z   = Utils.opts ( options.position.z, defOpts.position.z );
    this.scene.add( gridHelper );  
}

/**
 * Check if grids helper is added or not
 */
Graphics.prototype.isGridsAdded = function( options ) {
    var objects = this.getObjects();
    for(var i=0; i<objects.length; i++) {
        if( objects[i].name.includes(Utils.HELPER.PREFIX + Utils.GRIDS.PREFIX) ) {
            return true;
        }
    }
    return false;
}

/**
 * Toggle grids helper visibility
 */
Graphics.prototype.toggleGrids = function( options ) {
    if( this.isGridsAdded() ) {
        this.removeGrids();
    }
    else {
        this.addGrids();
    }
}
/**
 * Add Axes helper
 */
Graphics.prototype.addAxes = function( options ) {

    var objects = this.getObjects();
    for(var i=0; i<objects.length; i++) {
        if( objects[i].name.includes(Utils.HELPER.PREFIX + Utils.AXES.PREFIX) ) {
            return; //!! Added, return
        }
    }


    options = options || {};
    const defOpts = Options.graphics.grids;
    const axesHelper = new THREE.AxesHelper( Utils.opts ( options.size, defOpts.size ) );
    axesHelper.name  = Utils.HELPER.PREFIX + Utils.AXES.PREFIX;

    options.position = options.position || {};
    axesHelper.position.x = Utils.opts ( options.position.x, defOpts.position.x );
    axesHelper.position.y = Utils.opts ( options.position.y, defOpts.position.y );
    axesHelper.position.z = Utils.opts ( options.position.z, defOpts.position.z );
    this.scene.add( axesHelper );
}

/**
 * Check if axes helper is added or not
 */
Graphics.prototype.isAxesAdded = function( options ) {
    var objects = this.getObjects();
    for(var i=0; i<objects.length; i++) {
        if( objects[i].name.includes(Utils.HELPER.PREFIX + Utils.AXES.PREFIX) ) {
            return true;
        }
    }
    return false;
}

/**
 * Toggle axes helper visibility
 */
Graphics.prototype.toggleAxes = function( options ) {
    if( this.isAxesAdded() ) {
        this.removeAxes();
    }
    else {
        this.addAxes();
    }
}

/**
 * Remove Grids helper
 */
Graphics.prototype.removeGrids = function() {
    var grids = this.getObjectByName(Utils.HELPER.PREFIX + Utils.GRIDS.PREFIX);
    if( grids && grids instanceof THREE.GridHelper ) {
        this.scene.remove(grids);   
    }
    grids = undefined;
}

/**
 * Remove Axes helper
 */
Graphics.prototype.removeAxes = function() {
    var axes = this.getObjectByName(Utils.HELPER.PREFIX + Utils.AXES.PREFIX);
    
    if( axes && axes instanceof THREE.AxesHelper ) {
        this.scene.remove(axes);   
    }
    axes = undefined;
}

Graphics.prototype.createCamera = function( options ) {

    options = Utils.opts( options, {} );
    const defOpts = Options.graphics.camera;

    const camera = new THREE.PerspectiveCamera( 
            Utils.opts( options.fov     ,  defOpts.fov      ), 
            Utils.opts( options.aspect  ,  defOpts.aspect   ),
            Utils.opts( options.near    ,  defOpts.near     ),
            Utils.opts( options.far     ,  defOpts.far      ),
    );
    camera.name = (options.name ? options.name : Utils.CAMERA.PREFIX + Utils.zerosPad( this.cameras.length, 3 ));
    
    options.position = Utils.opts( options.position, {} );
    camera.position.set (
        Utils.opts( options.position.x, defOpts.position.x ), 
        Utils.opts( options.position.y, defOpts.position.y ), 
        Utils.opts( options.position.z, defOpts.position.z ), 
    );

    options.lookAt = Utils.opts( options.lookAt, {} );
    camera.lookAt( 
        Utils.opts( options.lookAt.x, defOpts.lookAt.x ), 
        Utils.opts( options.lookAt.y, defOpts.lookAt.y ), 
        Utils.opts( options.lookAt.z, defOpts.lookAt.z ), 
    );

    this.cameras.push( camera );
    return camera;
}

Graphics.prototype.createControls = function( options ) {
    options = Utils.opts( options, {} );
    const control = new OrbitControls( this.camera );
    control.name  = (options.name ? options.name : Utils.CONTROL.PREFIX + Utils.zerosPad( this.controls.length, 3 ));

    options.controls = Utils.opts( options.controls, {} );
    options.controls.useKeys = Utils.opts( options.controls.useKeys, Options.graphics.controls.useKeys );
    if(!options.controls.useKeys) {
        control.keys = {};
    }


    this.control  = control;
    this.controls.push( control );
}

Graphics.prototype.createScene = function( options ) {
    options = Utils.opts( options, {} );
    const defOpts = Options.graphics;
    const scene = new THREE.Scene();
    scene.name  = (options.name ? options.name : Utils.SCENE.PREFIX + Utils.zerosPad( this.scenes.length, 3 ));

    const type = Utils.opts( options.sceneType, defOpts.sceneType );

    this.scenes.push( scene );
    return scene;
}


/*****************************************************************************/
/*                            Ambient Light                                  */
/*****************************************************************************/

Graphics.prototype.createAmbientLight = function( options ) {
    options = options || {};
    const defOpts = Options.graphics.ambientLight;
    const ambientLight = new THREE.AmbientLight( Utils.opts(options.color, 0xffffff ) );
    ambientLight.intensity  = Utils.opts( options.intensity,  defOpts.intensity  );
    ambientLight.name = Utils.LIGHT.PREFIX + Utils.AMBIENTLIGHT.PREFIX + Utils.zerosPad( this.ambientLights.length, 3 );
    return ambientLight;
}

Graphics.prototype.addAmbientLight = function( options ) {
    options = options || {};
    const ambientLight = this.createAmbientLight( options );
    this.scene.add( ambientLight );
    this.ambientLights.push( ambientLight );
    return ambientLight;
}


/*****************************************************************************/
/*                             Point Light                                   */
/*****************************************************************************/

Graphics.prototype.createPointLight = function( options ) {
    options = options || {};
    const defOpts = Options.graphics.pointLight;
    const pointLight = new THREE.PointLight( Utils.opts(options.color, defOpts.color ) );
    pointLight.name  = Utils.LIGHT.PREFIX + Utils.POINTLIGHT.PREFIX + Utils.zerosPad( this.pointLights.length, 3 );

    pointLight.intensity  = Utils.opts(options.intensity,     defOpts.intensity     );
    pointLight.castShadow = Utils.opts(options.castShadow,    defOpts.castShadow    );
    pointLight.distance   = Utils.opts(options.distance,      defOpts.distance      );
    pointLight.decay      = Utils.opts(options.decay,         defOpts.decay         );

    options.position = Utils.opts( options.position, defOpts.position );
    pointLight.position.copy( new THREE.Vector3(
        Utils.opts( options.position.x, defOpts.position.x),
        Utils.opts( options.position.y, defOpts.position.y),
        Utils.opts( options.position.z, defOpts.position.z)
    ));
    
    options.shadow         = Utils.opts( options.shadow     ,   defOpts.shadow      );
    pointLight.shadow.bias = Utils.opts( options.shadow.bias,   defOpts.shadow.bias );

    options.shadow.mapSize           = Utils.opts( options.shadow.mapSize, defOpts.shadow.mapSize );
    pointLight.shadow.mapSize.width  = Utils.opts( options.shadow.mapSize.width ,   defOpts.shadow.mapSize.width    );
    pointLight.shadow.mapSize.height = Utils.opts( options.shadow.mapSize.height,   defOpts.shadow.mapSize.height   );
    
    options.shadow.camera            = Utils.opts( options.shadow.camera, defOpts.shadow.camera );
    pointLight.shadow.camera.visible = Utils.opts( options.shadow.camera.visible,    defOpts.shadow.camera.visible  );
    pointLight.shadow.camera.Fov     = Utils.opts( options.shadow.camera.fov,        defOpts.shadow.camera.fov      );
    pointLight.shadow.camera.near    = Utils.opts( options.shadow.camera.near,       defOpts.shadow.camera.near     );
    pointLight.shadow.camera.far     = Utils.opts( options.shadow.camera.far,        defOpts.shadow.camera.far      );
   
    console.log(pointLight);

    //pointLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 90, window.aspect, 500, 1000 ) );
    return pointLight;
}
Graphics.prototype.createPointLightHelper = function( pointLight, options ) {
    const defOpts = Options.graphics.pointLight.helper;
    const pointLightHelper = new THREE.PointLightHelper( 
        pointLight, 
        Utils.opts(options.size,  defOpts), 
        Utils.opts(options.color, pointLight.color) 
    );
    pointLightHelper.name = Utils.HELPER.PREFIX + pointLight.name;
    return pointLightHelper;
}
Graphics.prototype.addPointLight = function( options ) {
    options = options || {};
    const pointLight = this.createPointLight( options );
    this.scene.add( pointLight );
    
    options.helper = Utils.opts(options.helper, Options.graphics.pointLight.helper);

    if( options.helper.enabled ) {
        const pointLightHelper = this.createPointLightHelper( pointLight, options.helper );
        this.scene.add( pointLightHelper );
    }
    this.pointLights.push( pointLight );
    return pointLight;
}  


/*****************************************************************************/
/*                              Spot Light                                   */
/*****************************************************************************/

Graphics.prototype.createSpotLight = function( options ) {
    options = options || {};
    const defOpts    = Options.graphics.spotLight;
    const spotLight  = new THREE.SpotLight( Utils.opts(options.color, defOpts.color ) );
    spotLight.name   = Utils.LIGHT.PREFIX + Utils.SPOTLIGHT.PREFIX + Utils.zerosPad( this.spotLights.length, 3 );//Utils.opts(options.name, this.generateLightName('SpotLight') );

    options.position = Utils.opts( options.position, defOpts.position );
    spotLight.position.copy( new THREE.Vector3(
        Utils.opts( options.position.x, defOpts.position.x),
        Utils.opts( options.position.y, defOpts.position.y),
        Utils.opts( options.position.z, defOpts.position.z)
    ));


    spotLight.intensity   = Utils.opts(options.intensity    ,   defOpts.intensity   );
    spotLight.castShadow  = Utils.opts(options.castShadow   ,   defOpts.castShadow  );
    spotLight.distance    = Utils.opts(options.distance     ,   defOpts.distance    );
    spotLight.decay       = Utils.opts(options.decay        ,   defOpts.decay       );
    spotLight.angle       = Utils.opts(options.angle        ,   defOpts.angle       );
    spotLight.penumbra    = Utils.opts(options.penumbra     ,   defOpts.penumbra    );
    

    options.shadow        = Utils.opts( options.shadow      , defOpts.shadow        );
    spotLight.shadow.bias = Utils.opts(options.shadow.bias  , defOpts.shadow.bias   );

    options.shadow.mapSize          = Utils.opts( options.shadow.mapSize        ,   defOpts.shadow.mapSize          );
    spotLight.shadow.mapSize.width  = Utils.opts( options.shadow.mapSize.width  ,   defOpts.shadow.mapSize.width    );
    spotLight.shadow.mapSize.height = Utils.opts( options.shadow.mapSize.height ,   defOpts.shadow.mapSize.height   );

    options.shadow.camera           = Utils.opts( options.shadow.camera         ,   defOpts.shadow.camera           );
    spotLight.shadow.camera.visible = Utils.opts( options.shadow.camera.visible ,   defOpts.shadow.camera.visible   );
    spotLight.shadow.camera.Fov     = Utils.opts( options.shadow.camera.Fov     ,   defOpts.shadow.camera.fov       );
    spotLight.shadow.camera.near    = Utils.opts( options.shadow.camera.near    ,   defOpts.shadow.camera.near      );
    spotLight.shadow.camera.far     = Utils.opts( options.shadow.camera.far     ,   defOpts.shadow.camera.far       );

    return spotLight;
}
Graphics.prototype.createSpotLightHelper = function( spotLight, options ) {
    const spotLightHelper = new THREE.SpotLightHelper( spotLight,  Utils.opts(options.color, spotLight.color) );
    spotLightHelper.name  = Utils.HELPER.PREFIX + spotLight.name;
    return spotLightHelper;
}
Graphics.prototype.addSpotLight = function ( options ) {
    options =  Utils.opts(options, Options.graphics.spotLight);
    const spotLight = this.createSpotLight( options );
    this.scene.add(spotLight);

    options.helper = Utils.opts(options.helper, Options.graphics.spotLight.helper);
    if( options.helper.enabled ) {
        const spotLightHelper = this.createSpotLightHelper( spotLight, options.helper );
        this.scene.add( spotLightHelper );
    }
    this.spotLights.push( spotLight );
    return spotLight;
}


/*****************************************************************************/
/*                           Directional Light                               */
/*****************************************************************************/

Graphics.prototype.createDirectionalLight = function ( options ) {

    options = options || {};
    const defOpts = Options.graphics.directionalLight;

    const directionalLight = new THREE.DirectionalLight( Utils.opts(options.color, defOpts.color )  );
    directionalLight.name  = Utils.LIGHT.PREFIX + Utils.DIRECTIONALLIGHT.PREFIX + Utils.zerosPad( this.directionalLights.length, 3 );

    options.position = Utils.opts( options.position, defOpts.position );
    directionalLight.position.copy( new THREE.Vector3(
        Utils.opts( options.position.x, defOpts.position.x),
        Utils.opts( options.position.y, defOpts.position.y),
        Utils.opts( options.position.z, defOpts.position.z)
    ));

    directionalLight.intensity   = Utils.opts(options.intensity    ,   defOpts.intensity    );
    directionalLight.castShadow  = Utils.opts(options.castShadow   ,   defOpts.castShadow   );

    options.shadow               = Utils.opts( options.shadow      ,    defOpts.shadow      );
    directionalLight.shadow.bias = Utils.opts(options.shadow.bias  ,    defOpts.shadow.bias );

    options.shadow.mapSize                 = Utils.opts( options.shadow.mapSize         ,   defOpts.shadow.mapSize          );
    directionalLight.shadow.mapSize.width  = Utils.opts( options.shadow.mapSize.width   ,   defOpts.shadow.mapSize.width    );
    directionalLight.shadow.mapSize.height = Utils.opts( options.shadow.mapSize.height  ,   defOpts.shadow.mapSize.height   );

    options.shadow.camera                  = Utils.opts( options.shadow.camera          ,   defOpts.shadow.camera           );
    directionalLight.shadow.camera.visible = Utils.opts( options.shadow.camera.visible  ,   defOpts.shadow.camera.visible   );
    directionalLight.shadow.camera.near    = Utils.opts( options.shadow.camera.near     ,   defOpts.shadow.camera.near      );
    directionalLight.shadow.camera.far     = Utils.opts( options.shadow.camera.far      ,   defOpts.shadow.camera.far       );

    directionalLight.shadow.camera.top     = Utils.opts( options.shadow.camera.top      ,   options.shadow.camera.top       );
    directionalLight.shadow.camera.bottom  = Utils.opts( options.shadow.camera.bottom   ,   options.shadow.camera.bottom    );
    directionalLight.shadow.camera.right   = Utils.opts( options.shadow.camera.right    ,   options.shadow.camera.right     );
    directionalLight.shadow.camera.left    = Utils.opts( options.shadow.camera.left     ,   options.shadow.camera.left      );

    return directionalLight;
}
Graphics.prototype.createDirectionalLightHelper = function ( directionalLight, options ) {
    const directionalLightHelper = new THREE.DirectionalLightHelper( 
        directionalLight,  
        Utils.opts(options.size,  Options.graphics.directionalLight.helper.size), 
        Utils.opts(options.color, directionalLight.color) 
    );
    directionalLightHelper.name = Utils.HELPER.PREFIX + directionalLight.name;
    return directionalLightHelper;
}
Graphics.prototype.addDirectionalLight = function( options ) {
    options = options || {};
    const directionalLight = this.createDirectionalLight( options );
    this.scene.add( directionalLight );

    options.helper = Utils.opts(options.helper, Options.graphics.directionalLight.helper);
    if( options.helper.enabled ) {
        const directionalLightHelper = this.createDirectionalLightHelper( directionalLight, options.helper );
        this.scene.add( directionalLightHelper );
        const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
        this.scene.add( helper );
    }
    this.directionalLights.push( directionalLight );
    return directionalLight;
}




Graphics.prototype.update = function() {
    // this.reqAnim = undefined;
    // this.reqAnim = requestAnimationFrame( this.update.bind(this) );

    //!!
    if( this.control ) {
        if( this.control.enableDamping || this.control.autoRotate ) {
            this.control.update();
        }
    }

    //!! Stats
    this.stats.forEach( stats => {
        stats.update();   
    });

    if( this.callback ){
        this.callback( this );
    }

    this.renderer.render( this.scene, this.camera );

}

// Graphics.prototype.start = function( callback ) {
//     this.callback = callback;
//     if( this.reqAnim !== undefined ) return;    //!! Started, return
//     this.reqAnim = requestAnimationFrame(  this.update.bind(this) );

// }

// Graphics.prototype.stop = function() {
//     if( this.reqAnim === undefined ) return;    //!! Stopped, return
//     cancelAnimationFrame( this.reqAnim );
//     this.reqAnim = undefined;
// }

Graphics.prototype.setSceneBackground = function( cubeTexture ) {
    this.envMap           = cubeTexture;
    this.scene.background = cubeTexture;
}


Graphics.prototype.addGroundPlane = function( options ) {

    if( this.fogPlane ) {
        this.scene.remove( this.fogPlane );
        this.fogPlane = undefined;
    }

    options = Utils.opts(options, {} );

    const fogPlane = new THREE.Mesh( 
            new THREE.PlaneBufferGeometry( Utils.opts( options.width, 1500), Utils.opts(options.height, 1500 ) ), 
            new THREE.MeshBasicMaterial( { color: Utils.opts( options.color, 0x101010 ), depthWrite: false } ) );
    fogPlane.name = Utils.FOGPLANE.PREFIX;
    fogPlane.rotation.x = - Math.PI / 2;
    fogPlane.position.y = - 0.05;
    fogPlane.receiveShadow = Utils.opts(options.receiveShadow, false);
    
    this.scene.add( fogPlane );
    this.fogPlane = fogPlane;
}

Graphics.prototype.removeGroundPlane = function() {
    this.scene.remove( this.fogPlane );
    this.fogPlane = undefined;  
}

Graphics.prototype.setSceneType = function( type, options ) {

    //!! Scene Type == fog
    if( type === 'fog' ) {
        options = Utils.opts( options, {} );
        const fogOpts = Options.graphics.fog;
        const fogColor = new THREE.Color( Utils.opts( options.color, fogOpts.color ) );
        if( !this.scene.fog ) {
            this.scene.fog = new THREE.Fog(fogColor);
        }
        this.scene.fog.color  = fogColor;
        this.scene.fog.near   = Utils.opts( options.near ,   fogOpts.near );
        this.scene.fog.far    = Utils.opts( options.far  ,   fogOpts.far  );
        this.scene.background = this.scene.fog.color;
        options.plane = Utils.opts( options.plane, Options.graphics.fog.plane );
        if( options.plane.enabled ) {
            this.addGroundPlane( options.plane );
        }
    }
    else if( type !== 'fog' ) {
        //!! Remove the fog, special technique
        if( this.scene.fog ) {
            this.scene.fog.near = 0.1;
            this.scene.fog.far  = 0;
        }
        this.scene.background = new THREE.Color( Options.graphics.bkg.color );
        this.removeGroundPlane();
    }

    

    //!! Scene Type == env
    if( type === 'env' ) {
        if( this.envMap === undefined ) {
            options = Utils.opts( options, {} );
            const path = Utils.opts( options.path, Options.graphics.env.path );
            const self = this;
            this.loadCubeTexture( path, ( cubeMap ) => {
                //Utils.printSuccess( 'The environment map "' + path + '" is loaded' );
                self.envMap = cubeMap;
                self.scene.background = cubeMap;

                //!!
                options.useReflection = Utils.opts( options.useReflection, Options.graphics.useReflection );
                if( options.useReflection ) {
                    self.applyReflectionMap( undefined );
                }
            });
        }
    }
    
    //!! Scene Type == basic
    if( type === 'basic' ) {
        options = Utils.opts( options, {} );
        this.scene.background = new THREE.Color( Utils.opts( options.color, Options.graphics.bkg.color ) );
        options.plane = Utils.opts( options.plane, Options.graphics.bkg.plane );
        if( options.plane.enabled ) {
            this.addGroundPlane( options.plane );
        }
    }
}

Graphics.prototype.createRenderer = function( options ) {

    options = Utils.opts( options, {} );
    const defOpts = Options.graphics.renderer;
    

    const renderer = new THREE.WebGLRenderer( {
        antialias:  Utils.opts( options.antialias   , defOpts.antialias ), 
        alpha:      Utils.opts( options.alpha       , defOpts.alpha     )
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.name  = (options.name ? options.name : Utils.RENDERER.PREFIX + Utils.zerosPad( this.renderers.length, 3 ));

    renderer.gammaInput        = Utils.opts( options.gammaInput         ,   defOpts.gammaInput          );
    renderer.gammaOutput       = Utils.opts( options.gammaOutput        ,   defOpts.gammaOutput         );

    options.shadowMap          = Utils.opts( options.shadowMap          ,   defOpts.shadowMap           );
    renderer.shadowMap.enabled = Utils.opts( options.shadowMap.enabled  ,   defOpts.shadowMap.enabled   );
    renderer.shadowMap.soft    = Utils.opts( options.shadowMap.soft     ,   defOpts.shadowMap.soft      );
    renderer.shadowMap.type    = Utils.opts( options.shadowMap.type     ,   defOpts.shadowMap.type      );

    this.renderers.push( renderer );
    return renderer;
}

Graphics.prototype.addStats = function ( options ) {
    //!! Stats
    options = options || {};
    const stats = new Stats();
    stats.showPanel( Utils.opts( options.type, 0 ) ); //!! 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );
    const left = Utils.opts( options.left, 0 );
    const top  = Utils.opts( options.top,  0 );
    stats.dom.style.cssText = "position:absolute;left:" + left  +"px;top:" + top + "px;cursor:pointer;opacity:0.5;z-index:10000";
    this.stats.push( stats );
    return this;
}





/**
 * Apply reflection map to a mesh or meshes in the current scene depended on the target.
 * If the target is undefined, all objects in the current scene will be selected.
 * If the target is a mesh, only this mesh will be selected.
 * If the target is a group (or scene), all meshes in this group (or scene) will be selected.
 * @param target target can be undefined, mesh group or scene.
 * @return Graphics
 */
Graphics.prototype.applyReflectionMap = function( target ) {

    var meshes = [];
    var scene = (target === undefined ? this.scene : target);

    //!! Mesh
    if( target instanceof THREE.Mesh ) {
        meshes.push(child);  
    }

    
    //!! Group or Scene
    else{
        scene.traverse( (child) => {
            if( child instanceof THREE.Mesh &&  Utils.isFace(child) ) {
                meshes.push(child);
            }
        });
    }

    if( this.envMap === undefined ) {
        this.loadCubeTexture( undefined, ( cubeMap ) => {
            this.envMap = cubeMap;  

            meshes.forEach(child => {
                child.material.envMap = this.envMap;
                child.material.needsUpdate = true;     
            });

        });
    }
    else {
        meshes.forEach(child => {
            child.material.envMap      = this.envMap;
            child.material.needsUpdate = true;     
        });  
    }
    meshes = undefined;

    return this;
}


/**
 * Remove reflection map from a mesh or meshes in the current scene depended on the target.
 * If the target is undefined, all objects in the current scene will be selected.
 * If the target is a mesh, only this mesh will be selected.
 * If the target is a group (or scene), all meshes in this group (or scene) will be selected.
 * @param target target can be undefined, mesh group or scene.
 * @return Graphics
 */
Graphics.prototype.removeReflectionMap = function( target ) {
    var meshes = [];
    var scene = (target === undefined ? this.scene : target);

     //!! Mesh
     if( target instanceof THREE.Mesh ) {
        meshes.push(child);  
    }

    
    //!! Group or Scene
    else{
        scene.traverse( (child) => {
            if( child instanceof THREE.Mesh &&  Utils.isFace(child) ) {
                meshes.push(child);
            }
        });
    }

    meshes.forEach(child => {
        child.material.envMap = undefined;
        child.material.needsUpdate = true;     
    });

    meshes = undefined;
}


/**
 * Loads glTF file/model and make all meshes receive and cast shadow
 * @param path full path of the gltf file
 * @param callback callback function executed when the model is loaded
 * @return Promise
 */
Graphics.prototype.loadGLTF = function( path, callback ) {

    return new Promise( ( resolve, reject ) => {

        const loader = new GLTFLoader();
        loader.crossOrigin = 'anonymous';

        const meshes = [];

        loader.load( path, function( gltf ) {

            gltf.scene.name = Utils.SCENE.PREFIX + Utils.getFileName( path );

            gltf.scene.traverse( function( child ) {

                if( child instanceof THREE.Mesh && child.parent instanceof THREE.Scene ) {

                    //!! Utils.print( child.name, Utils.COLOR.INFO, 'Mesh' );
                    meshes.push(child);
                }

                else if( child instanceof THREE.Group ) {

                    //!! Utils.print( child.name, Utils.COLOR.DANGER, 'Group' );

                    child.traverse( function( c ) {

                        //!! Utils.print( c.name, Utils.COLOR.SECONDARY, '   sub' );   
                        meshes.push(c);
                    });
                }
            });

            //!! Mesh Properties
            for(var i=0; i<meshes.length; i++) {
                const mesh = meshes[i];
                mesh.receiveShadow = true;
                mesh.castShadow    = true;
            }

            resolve( gltf );

            if( callback ) {
                callback( gltf );
            }
        });
    });
}

/**
 * Loads cube-texture 
 * @param path full path of the cube-texture 
 * @param callback callback function executed when the texture is loaded
 * @return Promise
 */
Graphics.prototype.loadCubeTexture = function( path, callback ) {

    return new Promise( ( resolve, reject ) => {

        if( path === undefined ) {
            path = Options.graphics.env.path;
        } 

        path += path[ path.length-1 ] !== '/' ? '/' : '';

        const loader = new THREE.CubeTextureLoader().setPath( path );
        loader.crossOrigin = 'anonymous';
        const urls = ['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg'];

        loader.load( urls, ( cubeTexture ) => {

            cubeTexture.format = THREE.RGBAFormat;

            var ss = path.split('/');
            cubeTexture.name = Utils.CUBETEXTURE.PREFIX + ss[ss.length-2];

            resolve( cubeTexture );

            if( callback ) {
                callback( cubeTexture );
            }

        },(xhr)=>{},(err)=>{
            reject('Error: The CubeTexture ' + path + ' cannot be downloaded!');     
        });
    });
}

Graphics.prototype.loadTexture = function( path, callback ) {

}


/*****************************************************************************/
/*                                 AXES                                      */
/*****************************************************************************/

Graphics.prototype.addAxesToMesh = function( mesh, size ) {

    if(!mesh.children) return;

    var added = false;
    for( let i=0; i<mesh.children.length; i++ ) {
        if( mesh.children[i] instanceof THREE.LineSegments ) {
            added = true;
            break;
        }
    }
    if( !added ) {
        size = Utils.opts(size, 2);
        var axes = new THREE.AxesHelper( size );
        axes.scale.x = size/mesh.scale.x;
        axes.scale.y = size/mesh.scale.y;
        axes.scale.z = size/mesh.scale.z;
        axes.name = Utils.HELPER.PREFIX + Utils.AXES.PREFIX + mesh.name;//Utils.generateId();
        mesh.add(axes);
    }
    return this;
}

Graphics.prototype.addAxesToAllMeshes = function( size ) {
    const self = this;
    size = Utils.opts(size, 2);
    this.scene.traverse( ( mesh ) => {
        
         if( mesh instanceof THREE.Mesh && mesh.parent instanceof THREE.Scene ) {
            self.addAxesToMesh( mesh, size  );
         }
    }); 
    return this;  
}

Graphics.prototype.removeAxesFromMesh = function( mesh ) {

    var axes = undefined;
    for( let i=0; i<mesh.children.length; i++ ) {
        if( mesh.children[i] instanceof THREE.LineSegments ) {
            axes = mesh.children[i];
            break;
        }
    }
    if( axes ) {
        mesh.remove(axes);
    }  
    return this;
}

Graphics.prototype.removeAxesFromAllMeshes = function() {
    const self = this;
    this.scene.traverse( ( mesh ) => {
        
        if( mesh instanceof THREE.Mesh ) {
            
            self.removeAxesFromMesh( mesh );
        }
    });  
    return this; 
}


/**
 * Returns meshes (excludes all of helpers, lights and debuggers) in the current scene
 * @return array of THREE.Mesh
 */
Graphics.prototype.getMeshes = function() {

    const meshes = [];
    this.scene.traverse( (child) => {
        if( child instanceof THREE.Mesh || child instanceof THREE.Group ) {
            if( child.parent instanceof THREE.Scene && !Utils.isHelper(child) && !Utils.isLight(child)  && !Utils.isDebugger(child)  && !Utils.isFogPlane(child)) {
                meshes.push( child );
            }
        }
    });

    return meshes;
}

Graphics.prototype.getMeshByName = function( name ) {
    var meshes = this.getMeshes();
    var target = name.toLowerCase();
    for(var i=0; i<meshes.length; i++) {
        var mesh = meshes[i];
        if( mesh.name.toLowerCase() === target ) {
            if( mesh instanceof THREE.Mesh || mesh instanceof THREE.Group ) {
                return mesh;
            }
        }
    }
    Utils.printWarning('Graphics.getMeshByName: The mesh/group "' + name + '" cannot be found');
    return undefined;
}

/**
 * Return all meshes (array of meshes) in the provided scene. If the scene is not provided, the current scene will be used as target scene
 * @param {THREE.Scene} scene target scene
 * @return array of THREE.Mesh
 */
Graphics.prototype.getMeshesFromScene = function( scene ) {
    const _scene = scene || this.scene;
    const meshes = [];
    _scene.traverse( (child) => {
        if( child instanceof THREE.Mesh || child instanceof THREE.Group ) {
            if( child.parent instanceof THREE.Scene && !Utils.isHelper(child) && !Utils.isLight(child)  && !Utils.isDebugger(child) && !Utils.isFogPlane(child) ) {
                meshes.push( child );
            }
        }
    });
    return meshes;
}

Graphics.prototype.getObjects = function() {
    var objects = [];
    this.scene.traverse( ( obj ) => {
        objects.push( obj );
    });  
    return objects;
}

Graphics.prototype.getObjectByName = function( name ) {
    var meshes = this.getObjects();
    var target = name.toLowerCase();
    for(var i=0; i<meshes.length; i++) {
        var mesh = meshes[i];
        if( mesh.name.toLowerCase() === target ) {
            return mesh;
        }
    }
    Utils.printWarning('Graphics.getObjectByName: The object "' + name + '" cannot be found');
    return undefined;
}

/*****************************************************************************/
/*                                 SCENE                                     */
/*****************************************************************************/

Graphics.prototype.getScenes = function() {
    const scenes = [];
    this.scene.traverse( child => {
        if( child instanceof THREE.Scene) {
            scenes.push( child );
        }
    }); 
    return scenes; 
}

Graphics.prototype.getSceneByName = function( name ) {
    const scenes = this.getScenes();
    var target = name.toLowerCase();
    for(var i=0; i<scenes.length; i++) {
        if( scenes[i].name.toLowerCase() === target ) {
            if( child instanceof THREE.Scene) {
                return scenes[i];
            }
        }
    }
    Utils.printWarning('Graphics.getSceneByName: The scene "' + name + '" cannot be found');
    return undefined;
}

Graphics.prototype.getParentScene = function() {

    const scenes = this.getScenes();
    for(var i=0; i<scenes.length; i++) {
        if( !scenes[i].parent ) {
            return scenes[i];
        }
    }
    return undefined;
}

Graphics.prototype.getMainScene = function() {
    return this.getParentScene();
}

Graphics.prototype.getChildScenes = function() {

    const childScenes = [];
    const mainScane = this.getParentScene();
    const scenes = this.getScenes();
    for(var i=0; i<scenes.length; i++) {
        if( scenes[i].parent === mainScane ) {
            childScenes.push( scenes[i] );
        }
    }
    return childScenes;
}

Graphics.prototype.getSubScenes = function() {
    return this.getChildScenes();
}

Graphics.prototype.clearScene = function( scene ) {
    if( scene && scene instanceof THREE.Scene ) {
        while( scene.children.length > 0 ) { 
            this.clearScene( scene.children[0] );
            scene.remove( scene.children[0] );
        }
        if( scene.geometry )  scene.geometry.dispose();
        if( scene.material )  scene.material.dispose();
        if( scene.texture )   scene.texture.dispose();
    }
}   

Graphics.prototype.printScene = function( scene ) {
    scene = (scene ? scene : this.scene);

    var colors=['#000000', '#005be5', '#9403bc', '#01914b', '#915501', '#3f0191', '#917901'];
    scene.traverse( child => {
        var str = '';
        var p = child; var i = 0;
        while( p ) {
            p = p.parent; str += '   '; i++;
        }
        console.log( '%c'+ str + '-> ' + i + ') name: ' + child.name + '\ttype: ' + child.type + '\tnc: ' + child.children.length, 'color:'+colors[i] );
    });  
}

/*****************************************************************************/
/*                              END OF FILE                                  */
/*****************************************************************************/
