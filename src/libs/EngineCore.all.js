'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var THREE = require('three');
var CANNON = require('cannon');
var GLTFLoader = require('three-gltf-loader');
var GLTFLoader__default = _interopDefault(GLTFLoader);
var OrbitControls = require('threejs-orbit-controls');
var threeCss2drender = require('three-css2drender');

var Options = {

    //!!
    //!! Engine
    //!!
    engine: {

    },

    //!!
    //!! Physics
    //!!
    physics: {

        enabled:    true,
        timeStep:   1/60,   //!! 'dt' or number

        debug: {
            enabled:    false,
            color:      0x225511,
            offset:     0.01,
        },


        solver: {
            iterations: 10,
            tolerance:  1e-6,
            split:      true,
        },


        world: {
            allowSleep:         false,
            quatNormalizeFast:  true,
            quatNormalizeSkip:  0,
            gravity:            new CANNON.Vec3(0, -10, 0),

            defaultContactMaterial:{
                contactEquationStiffness:  1e8,
                contactEquationRelaxation: 1.5
            },

            broadphase:{
                useBoundingBoxes: true,
            },
           
        }
    },

    //!!
    //!! Graphics
    //!!
    graphics: {

        sceneType:          'env',  //!! 'env', 'fog', 'basic'
        useReflection:      true,


        //!! Used whrn the sceneType == 'fog'
        fog: {
            color: 0xffeecc,
            near:  1,
            far:   100,
            plane: {
                enabled: true,
                width:   1500,
                height:  1500,
                color:   0x334433,
                receiveShadow: false,
            }
        },

        //!! Used when the sceneType == 'env'
        env: {
            path: './images/snow',   //!! Default environment path
        },

        //!! Used when the sceneType == 'basic'
        bkg: {
            color: 0x101010,
            plane: {
                enabled: false,
                width:   1500,
                height:  1500,
                color:   0x101510,
                receiveShadow: false,
            }
        },

        models: [
            './models/scene001.gltf',   //!! Default model file, the GLTF file
        ],

        camera: {
            fov:        45,
            near:       0.1,
            far:        1000,
            aspect:     window.innerWidth / window.innerHeight,
            position:   {x: 30, y: 15, z: -30 },
            lookAt:     {x: 0, y: 0, z: 0}
        },
        renderer:{
            antialias:      false,
            alpha:          false,
            gammaInput:     true,
            gammaOutput:    true,
            shadowMap:{
                enabled:    true,
                soft:       true,
                type:       THREE.PCFSoftShadowMap,
            }
        },
        controls: {
            enabled: true,
            useKeys: false,
        },

        directionalLight: {
            enabled:    true,
            color:      0xffffcc,
            intensity:  1.5,
            castShadow:  true,
            position: {
                x: 10,
                y: 30,
                z: 10
            },
            shadow: {
                bias: 0,
                mapSize: {
                    width:  1024,
                    height: 1024,
                },
                camera: {
                    visible:    true,
                    near:       -55,
                    far:        +55,
                    top:        +55,
                    bottom:     -55,
                    right:      +55,
                    left:       -55
                },
            },
            helper: {
                enabled:    false,
                size:       2,
            }
        },

        spotLight: {
            enabled:    false,
            color:      0xffffff,
            intensity:  5,
            castShadow:  true,
            distance:   100,
            decay:      2,
            angle:      Math.PI/4,
            penumbra:   0.8,
            position: {
                x: 35,
                y: 50,
                z: -10
            },
            shadow: {
                bias: 0,
                mapSize: {
                    width:  1024,
                    height: 1024,
                },
                camera: {
                    visible:    true,
                    fov:        90,
                    near:       0.5,
                    far:        1000
                }
            },
            helper:{
                enabled:    true,
            } 
        },

        pointLight: {
            enabled:    false,
            color:      0xffffff,
            intensity:  2,
            castShadow:  true,
            distance:   50,
            decay:      2,
            position: {
                x: 3,
                y: 20,
                z: -5
            },
            shadow: {
                bias: 0,
                mapSize: {
                    width:  1024,
                    height: 1024,
                },
                camera: {
                    visible:    true,
                    fov:        90,
                    near:       0.5,
                    far:        1000
                }
            },
            helper: {
                enabled:    true,
                size:       1,
                color:      0xCCCCCC,
            }
        },

        ambientLight: {
            enabled:    true,
            color:      0xffffff,
            intensity:  0.7,
        },
        
        grids: {
            enabled:            false,
            size:               40,
            divisions:          40,
            colorCenterLine:    0xff55ff,
            colorGrid:          0x888888,
            opacity:            0.5,
            position: {
                x: 0.0,
                y: 0.01,
                z: 0
            }
        },

        axes: {
            enabled:    false,
            size:       4,
            position: {
                x: 0.0,
                y: 0.02,
                z: 0
            }
        },
        stats:{
            enabled: true,
            type:    0,
            left:    3,
            top:     3,
        }
    }
};

var Stats = function () {

	var mode = 0;

	var container = document.createElement( 'div' );
	container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
	container.addEventListener( 'click', function ( event ) {

		event.preventDefault();
		showPanel( ++ mode % container.children.length );

	}, false );

	//

	function addPanel( panel ) {

		container.appendChild( panel.dom );
		return panel;

	}

	function showPanel( id ) {

		for ( var i = 0; i < container.children.length; i ++ ) {

			container.children[ i ].style.display = i === id ? 'block' : 'none';

		}

		mode = id;

	}

	//

	var beginTime = ( performance || Date ).now(), prevTime = beginTime, frames = 0;

	var fpsPanel = addPanel( new Stats.Panel( 'FPS', '#0af', '#001' ) );
	var msPanel = addPanel( new Stats.Panel( 'MS', '#0f0', '#121' ) );

	if ( self.performance && self.performance.memory ) {

		var memPanel = addPanel( new Stats.Panel( 'MB', '#f0f', '#212' ) );

	}

	showPanel( 0 );

	return {

		REVISION: 16,

		dom: container,

		addPanel: addPanel,
		showPanel: showPanel,

		begin: function () {

			beginTime = ( performance || Date ).now();

		},

		end: function () {

			frames ++;

			var time = ( performance || Date ).now();

			msPanel.update( time - beginTime, 200 );

			if ( time >= prevTime + 1000 ) {

				fpsPanel.update( ( frames * 1000 ) / ( time - prevTime ), 100 );

				prevTime = time;
				frames = 0;

				if ( memPanel ) {

					var memory = performance.memory;
					memPanel.update( memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576 );

				}

			}

			return time;

		},

		update: function () {

			beginTime = this.end();

		},

		// Backwards Compatibility

		domElement: container,
		setMode: showPanel

	};

};

Stats.Panel = function ( name, fg, bg ) {

	var min = Infinity, max = 0, round = Math.round;
	var PR = round( window.devicePixelRatio || 1 );

	var WIDTH = 80 * PR, HEIGHT = 48 * PR,
			TEXT_X = 3 * PR, TEXT_Y = 2 * PR,
			GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR,
			GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;

	var canvas = document.createElement( 'canvas' );
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.style.cssText = 'width:80px;height:48px';

	var context = canvas.getContext( '2d' );
	context.font = 'bold ' + ( 9 * PR ) + 'px Helvetica,Arial,sans-serif';
	context.textBaseline = 'top';

	context.fillStyle = bg;
	context.fillRect( 0, 0, WIDTH, HEIGHT );

	context.fillStyle = fg;
	context.fillText( name, TEXT_X, TEXT_Y );
	context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

	context.fillStyle = bg;
	context.globalAlpha = 0.9;
	context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

	return {

		dom: canvas,

		update: function ( value, maxValue ) {

			min = Math.min( min, value );
			max = Math.max( max, value );

			context.fillStyle = bg;
			context.globalAlpha = 1;
			context.fillRect( 0, 0, WIDTH, GRAPH_Y );
			context.fillStyle = fg;
			context.fillText( round( value ) + ' ' + name + ' (' + round( min ) + '-' + round( max ) + ')', TEXT_X, TEXT_Y );

			context.drawImage( canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT );

			context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT );

			context.fillStyle = bg;
			context.globalAlpha = 0.9;
			context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round( ( 1 - ( value / maxValue ) ) * GRAPH_HEIGHT ) );

		}

	};

};

/**
 * Utility functions
 */
function Utils() {}


Utils.VERSION = 'Utils version 0.0.1';

Utils.COLOR = {};
Utils.COLOR.NORMAL              = 0x333333;
Utils.COLOR.PRIMARY             = 0x0055FF;
Utils.COLOR.SECONDARY           = 0x777799;
Utils.COLOR.INFO                = 0x3366FF;
Utils.COLOR.SUCCESS             = 0x33DD77;
Utils.COLOR.WARNING             = 0xFF7733;
Utils.COLOR.DANGER              = 0xFF1111;

Utils.CAMERA = {};
Utils.CAMERA.PREFIX             = '_camera_';

Utils.RENDERER = {};
Utils.RENDERER.PREFIX           = '_renderer_';

Utils.SCENE = {};
Utils.SCENE.PREFIX              = '_scene_';

Utils.LIGHT = {};
Utils.LIGHT.PREFIX              = '_light_';

Utils.AMBIENTLIGHT = {};
Utils.AMBIENTLIGHT.PREFIX       = '_AmbientLight_';

Utils.POINTLIGHT = {};
Utils.POINTLIGHT.PREFIX         = '_PointLight_';

Utils.SPOTLIGHT = {};
Utils.SPOTLIGHT.PREFIX          = '_SpotLight_';

Utils.DIRECTIONALLIGHT = {};
Utils.DIRECTIONALLIGHT.PREFIX   = '_DirectionalLight_';

Utils.GRIDS = {};
Utils.GRIDS.PREFIX              = '_grids_';

Utils.AXES = {};
Utils.AXES.PREFIX               = '_axes_';

Utils.HELPER = {};
Utils.HELPER.PREFIX             = '_helper_';

Utils.CONTROL = {};
Utils.CONTROL.PREFIX            = '_control_';

Utils.FOGPLANE = {};
Utils.FOGPLANE.PREFIX           = '_fogplane_';

Utils.CUBETEXTURE = {};
Utils.CUBETEXTURE.PREFIX        = '_cubetexture_';

Utils.BODYDEBUG = {};
Utils.BODYDEBUG.PREFIX          = '_bodydebug_';

Utils.COLLIDER = {};
Utils.COLLIDER.PREFIX           = '_collider_';

Utils.STATIC = {};
Utils.STATIC.PREFIX             = '_static_';

Utils.DYNAMIC = {};
Utils.DYNAMIC.PREFIX            = '_dynamic_';

Utils.MESHLABEL = {};
Utils.MESHLABEL.PREFIX          = '_meshlabel_';

Utils.PHYGROUNDMAT = {};
Utils.PHYGROUNDMAT.PREFIX       = '_physicsgroudmat_';

Utils.PHYOBJECTMAT = {};
Utils.PHYOBJECTMAT.PREFIX       = '_physicsobjectmat_';

/**
 * Convert hex-code color to rgb format
 * @param {number} hex hex-color
 * @return rgb(r,g,b)
 */
Utils.hexToCss = function( hex ) {
    var b = (hex>>0)%0x100;
    var g = (hex>>8)%0x100;
    var r = (hex>>16)%0x100;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
};

/**
 * Print message to console window
 * @param {string} message message to be printed
 * @param {number} color   hex color
 * @param {string} sender  prefix message
 */
Utils.print = function( message, color, prefix ) {
    console.log('%c' +(prefix?prefix+': ':'') + message, 'color:' + Utils.hexToCss(color));
};

/**
 * Print information message
 * @param {string} message information message
 */
Utils.printInfo = function( message ) {
    Utils.print( message, Utils.COLOR.INFO );
};

/**
 * Print warning message
 * @param {string} message warning message
 */
Utils.printWarning = function( message ) {
    Utils.print( message, Utils.COLOR.WARNING );
};

/**
 * Print danger message
 * @param {string} message danger message
 */
Utils.printDanger = function( message ) {
    Utils.print( message, Utils.COLOR.DANGER);
};

/**
 * Print success message
 * @param {string} message success message
 */
Utils.printSuccess = function( message ) {
    Utils.print( message, Utils.COLOR.SUCCESS );
};

/**
 * Print primary message
 * @param {string} message primary message
 */
Utils.printPrimary = function( message ) {
    Utils.print( message, Utils.COLOR.PRIMARY );
};

/**
 * Print secondary message
 * @param {string} message secondary message
 */
Utils.printSecondary = function( message ) {
    Utils.print( message, Utils.COLOR.SECONDARY );
};

/**
 * Generate id. prefix_numbers or numders
 * @param {string} prefix prefix string
 * @return string
 */
Utils.generateId = function( prefix ) {
    return (prefix? prefix + '_' : '') + Math.floor(Math.random()*1000000) + '';
};

/**
 * Pads zeros
 * @param {number} value number
 * @param {number} value length of string output
 * @return string
 */
Utils.zerosPad = function ( value, length ) {
    var str = value+'';
    const nz = length - str.length;
    for(var i=0; i<nz; i++) {
        str = '0'+str;
    }
    return str;
};

/**
 * Parse options
 * @param {object} opt options
 * @param {object} def default options
 * @return options
 */
Utils.opts = function( opt, def ) {
    return (opt === null || opt === undefined) ? def : opt;
};

/**
 * Return name of provided object
 * @param {object} obj object
 * @return name of the object
 */
Utils.getName = function( obj ) {
    var name = undefined;
    if( typeof obj === 'string' ) {
        name = obj;
    }
    else {
        name = obj.name;
    }
    return name.toLowerCase();
};

/**
 * Returns true if the object is body-debug
 * @param {object} obj object
 * @return boolean
 */
Utils.isDebugger = function( obj ) {
    return Utils.getName(obj).includes( Utils.BODYDEBUG.PREFIX );
};

/**
 * Returns true if the object is helper
 * @param {object} obj object
 * @return boolean
 */
Utils.isHelper = function( obj ) {
    return Utils.getName(obj).includes( Utils.HELPER.PREFIX );
};

/**
 * Returns true if the object is fog-plane
 * @param {object} obj object
 * @return boolean
 */
Utils.isFogPlane = function( obj ) {
    return Utils.getName(obj).includes( Utils.FOGPLANE.PREFIX );
};

/**
 * Returns true if the object is collider
 * @param {object} obj object
 * @return boolean
 */
Utils.isCollider = function( obj ) {
    return Utils.getName(obj).includes( Utils.COLLIDER.PREFIX );
};

/**
 * Returns true if the object is static
 * @param {object} obj object
 * @return boolean
 */
Utils.isStatic = function( obj ) {
    return Utils.getName(obj).includes( Utils.STATIC.PREFIX );
};

/**
 * Returns true if the object is light
 * @param {object} obj object
 * @return boolean
 */
Utils.isLight = function( obj ) {
    return Utils.getName(obj).includes( Utils.LIGHT.PREFIX );
};

/**
 * Returns true if the object is mesh
 * @param {object} obj object
 * @return boolean
 */
Utils.isMesh = function( obj ) {
    return ( obj instanceof THREE.Mesh );
};

/**
 * Returns true if the object is group
 * @param {object} obj object
 * @return boolean
 */
Utils.isGroup = function( obj ) {
    return ( obj instanceof THREE.Group );
};

/**
 * Returns true if the object is scene
 * @param {object} obj object
 * @return boolean
 */
Utils.isScene = function( obj ) {
    return ( obj instanceof THREE.Scene );
};

/**
 * Returns true if the object is face
 * @param {object} obj object
 * @return boolean
 */
Utils.isFace = function( obj ) {
    return ( Utils.isMesh(obj) & !Utils.isHelper(obj) & !Utils.isFogPlane(obj) & !Utils.isCollider(obj) & !Utils.isLight(obj) );
};

/**
 * Print mesh information
 * @param {THREE.Mesh} mesh mesh target
 */
Utils.printMesh = function( mesh ) {
    var str = 'Name:\t'     + mesh.name +        ',\t';
    str     += 'Type:\t'    + mesh.type +        ',\t';
    str     += 'Parent:\t'  + mesh.parent.name + ',\t';
    str    += 'Children:\t' + mesh.children.length;
    Utils.printSecondary(str);
};

/**
 * Get file name from full path
 * @param {string} path path (full file name)
 */
Utils.getFileName = function( path ) {
    const sp = path.split('/');
    const name = sp[sp.length-1];
    if( !name ) return undefined;
    const ext = name.split('.');
    return ext.length > 0 ? ext[0] : ext;   
};

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
};


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
};

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
};

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
};
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
};

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
};

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
};

/**
 * Remove Grids helper
 */
Graphics.prototype.removeGrids = function() {
    var grids = this.getObjectByName(Utils.HELPER.PREFIX + Utils.GRIDS.PREFIX);
    if( grids && grids instanceof THREE.GridHelper ) {
        this.scene.remove(grids);   
    }
    grids = undefined;
};

/**
 * Remove Axes helper
 */
Graphics.prototype.removeAxes = function() {
    var axes = this.getObjectByName(Utils.HELPER.PREFIX + Utils.AXES.PREFIX);
    
    if( axes && axes instanceof THREE.AxesHelper ) {
        this.scene.remove(axes);   
    }
    axes = undefined;
};

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
};

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
};

Graphics.prototype.createScene = function( options ) {
    options = Utils.opts( options, {} );
    const defOpts = Options.graphics;
    const scene = new THREE.Scene();
    scene.name  = (options.name ? options.name : Utils.SCENE.PREFIX + Utils.zerosPad( this.scenes.length, 3 ));

    const type = Utils.opts( options.sceneType, defOpts.sceneType );

    this.scenes.push( scene );
    return scene;
};


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
};

Graphics.prototype.addAmbientLight = function( options ) {
    options = options || {};
    const ambientLight = this.createAmbientLight( options );
    this.scene.add( ambientLight );
    this.ambientLights.push( ambientLight );
    return ambientLight;
};


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
};
Graphics.prototype.createPointLightHelper = function( pointLight, options ) {
    const defOpts = Options.graphics.pointLight.helper;
    const pointLightHelper = new THREE.PointLightHelper( 
        pointLight, 
        Utils.opts(options.size,  defOpts), 
        Utils.opts(options.color, pointLight.color) 
    );
    pointLightHelper.name = Utils.HELPER.PREFIX + pointLight.name;
    return pointLightHelper;
};
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
};  


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
};
Graphics.prototype.createSpotLightHelper = function( spotLight, options ) {
    const spotLightHelper = new THREE.SpotLightHelper( spotLight,  Utils.opts(options.color, spotLight.color) );
    spotLightHelper.name  = Utils.HELPER.PREFIX + spotLight.name;
    return spotLightHelper;
};
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
};


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
};
Graphics.prototype.createDirectionalLightHelper = function ( directionalLight, options ) {
    const directionalLightHelper = new THREE.DirectionalLightHelper( 
        directionalLight,  
        Utils.opts(options.size,  Options.graphics.directionalLight.helper.size), 
        Utils.opts(options.color, directionalLight.color) 
    );
    directionalLightHelper.name = Utils.HELPER.PREFIX + directionalLight.name;
    return directionalLightHelper;
};
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
};




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

};

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
};


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
};

Graphics.prototype.removeGroundPlane = function() {
    this.scene.remove( this.fogPlane );
    this.fogPlane = undefined;  
};

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
};

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
};

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
};





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
};


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
};


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
};

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
};

Graphics.prototype.loadTexture = function( path, callback ) {

};


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
};

Graphics.prototype.addAxesToAllMeshes = function( size ) {
    const self = this;
    size = Utils.opts(size, 2);
    this.scene.traverse( ( mesh ) => {
        
         if( mesh instanceof THREE.Mesh && mesh.parent instanceof THREE.Scene ) {
            self.addAxesToMesh( mesh, size  );
         }
    }); 
    return this;  
};

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
};

Graphics.prototype.removeAxesFromAllMeshes = function() {
    const self = this;
    this.scene.traverse( ( mesh ) => {
        
        if( mesh instanceof THREE.Mesh ) {
            
            self.removeAxesFromMesh( mesh );
        }
    });  
    return this; 
};


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
};

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
};

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
};

Graphics.prototype.getObjects = function() {
    var objects = [];
    this.scene.traverse( ( obj ) => {
        objects.push( obj );
    });  
    return objects;
};

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
};

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
};

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
};

Graphics.prototype.getParentScene = function() {

    const scenes = this.getScenes();
    for(var i=0; i<scenes.length; i++) {
        if( !scenes[i].parent ) {
            return scenes[i];
        }
    }
    return undefined;
};

Graphics.prototype.getMainScene = function() {
    return this.getParentScene();
};

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
};

Graphics.prototype.getSubScenes = function() {
    return this.getChildScenes();
};

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
};   

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
};

/*****************************************************************************/
/*                              END OF FILE                                  */
/*****************************************************************************/

/*
**************************************************************************************
* BodyDebug.js
* BodyDebug is used as the rigid-body debugging. It shows rigid-body as wireframe
*
* Dr.Santi Nuratch
* Embedded System Computing and Control Laboratory
* ECC-Lab | INC@KMUTT
*
* 03 March, 2019
***************************************************************************************
*/

//console.log('%cmesh debugger v0.3 loaded', 'color:#338833');


        
class BodyDebug {

    constructor(graphics, physics, options) {

        options = options || {};

        this.graphics = graphics;
        this.physics  = physics;

        this.scene = new THREE.Scene();//graphics.scene;    //!! THREE Scene
        this.scene.name = Utils.SCENE.PREFIX +  Utils.BODYDEBUG.PREFIX;
        this.world = physics.world;     //!! CANNON World

        this.graphics.scene.add(this.scene);


        this.visibled = true;

        this._meshes = [];

        this._material = new THREE.MeshBasicMaterial({ color: options.color || 0xcccc00, wireframe: true });
        this._sphereGeometry = new THREE.SphereGeometry(1);
        this._boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        this._planeGeometry = new THREE.PlaneGeometry( 10, 10, 10, 10 );
        this._cylinderGeometry = new THREE.CylinderGeometry( 1, 1, 10, 10 );


        this.tmpVec0  = new CANNON.Vec3();
        this.tmpVec1  = new CANNON.Vec3();
        this.tmpVec2  = new CANNON.Vec3();
        this.tmpQuat0 = new CANNON.Vec3();
    }

    getPrefix() {
        return Utils.HELPER.PREFIX + Utils.BODYDEBUG.PREFIX;
    }

    update() {

        var bodies = this.world.bodies;

        var meshes = this._meshes;
        var shapeWorldPosition = this.tmpVec0;
        var shapeWorldQuaternion = this.tmpQuat0;

        var meshIndex = 0;

        for (var i = 0; i !== bodies.length; i++) {
            var body = bodies[i];

            for (var j = 0; j !== body.shapes.length; j++) {
                var shape = body.shapes[j];

                //!!this._updateMesh(meshIndex, body, shape);
                this._updateMesh(meshIndex, shape);

                var mesh = meshes[meshIndex];

                if(mesh){

                    // Get world position
                    body.quaternion.vmult(body.shapeOffsets[j], shapeWorldPosition);
                    body.position.vadd(shapeWorldPosition, shapeWorldPosition);

                    // Get world quaternion
                    body.quaternion.mult(body.shapeOrientations[j], shapeWorldQuaternion);

                    // Copy to meshes
                    mesh.position.copy(shapeWorldPosition);
                    mesh.quaternion.copy(shapeWorldQuaternion);
                } //!! if()

                meshIndex++;
            } //!! for()
        } //!! for()

        for(var i = meshIndex; i < meshes.length; i++){
            var mesh = meshes[i];
            if(mesh){
                this.scene.remove(mesh);
            }
        }

        meshes.length = meshIndex;

        return this;   
    }//!! update()

    //!!_updateMesh(index, body, shape) {
    _updateMesh( index, shape ) {
        var mesh = this._meshes[index];
        if( !this._typeMatch( mesh, shape )){
            if(mesh){
                this.scene.remove( mesh );
            }
            mesh = this._meshes[index] = this._createMesh(shape);
        }
        this._scaleMesh(mesh, shape);
    }

    _typeMatch(mesh, shape) {
        if( !mesh ){
            return false;
        }
        var geo = mesh.geometry;
        return (
            (geo instanceof THREE.SphereGeometry && shape instanceof CANNON.Sphere) ||
            (geo instanceof THREE.BoxGeometry && shape instanceof CANNON.Box) ||
            (geo instanceof THREE.PlaneGeometry && shape instanceof CANNON.Plane) ||
            (geo.id === shape.geometryId && shape instanceof CANNON.ConvexPolyhedron) ||
            (geo.id === shape.geometryId && shape instanceof CANNON.Trimesh) ||
            (geo.id === shape.geometryId && shape instanceof CANNON.Heightfield)
        );
    }
    _createMesh(shape) {
        var mesh;
        var material = this._material;

        var typeName = '';

        switch(shape.type){

        case CANNON.Shape.types.SPHERE:
            mesh = new THREE.Mesh(this._sphereGeometry, material);
            typeName = 'sphere';
            break;

        case CANNON.Shape.types.BOX:
            mesh = new THREE.Mesh(this._boxGeometry, material);
            typeName = 'box';
            break;

        case CANNON.Shape.types.PLANE:
            mesh = new THREE.Mesh(this._planeGeometry, material);
            typeName = 'plane';
            break;

        case CANNON.Shape.types.CONVEXPOLYHEDRON:
            typeName = 'convexpolyhedron';
            //!! Create mesh
            var geo = new THREE.Geometry();

            //!! Add vertices
            for (var i = 0; i < shape.vertices.length; i++) {
                var v = shape.vertices[i];
                geo.vertices.push(new THREE.Vector3(v.x, v.y, v.z));
            }

            for(var i=0; i < shape.faces.length; i++){
                var face = shape.faces[i];

                //!! add triangles
                var a = face[0];
                for (var j = 1; j < face.length - 1; j++) {
                    var b = face[j];
                    var c = face[j + 1];
                    geo.faces.push(new THREE.Face3(a, b, c));
                }
            }
            geo.computeBoundingSphere();
            geo.computeFaceNormals();

            mesh = new THREE.Mesh(geo, material);
            shape.geometryId = geo.id;
            break;

        case CANNON.Shape.types.TRIMESH:
            typeName = 'trimesh';
            var geometry = new THREE.Geometry();
            var v0 = this.tmpVec0;
            var v1 = this.tmpVec1;
            var v2 = this.tmpVec2;
            for (var i = 0; i < shape.indices.length / 3; i++) {
                shape.getTriangleVertices(i, v0, v1, v2);
                geometry.vertices.push(
                    new THREE.Vector3(v0.x, v0.y, v0.z),
                    new THREE.Vector3(v1.x, v1.y, v1.z),
                    new THREE.Vector3(v2.x, v2.y, v2.z)
                );
                var j = geometry.vertices.length - 3;
                geometry.faces.push(new THREE.Face3(j, j+1, j+2));
            }
            geometry.computeBoundingSphere();
            geometry.computeFaceNormals();
            mesh = new THREE.Mesh(geometry, material);
            shape.geometryId = geometry.id;
            break;

        case CANNON.Shape.types.HEIGHTFIELD:
            typeName = 'heightfield';
            var geometry = new THREE.Geometry();

            var v0 = this.tmpVec0;
            var v1 = this.tmpVec1;
            var v2 = this.tmpVec2;
            for (var xi = 0; xi < shape.data.length - 1; xi++) {
                for (var yi = 0; yi < shape.data[xi].length - 1; yi++) {
                    for (var k = 0; k < 2; k++) {
                        shape.getConvexTrianglePillar(xi, yi, k===0);
                        v0.copy(shape.pillarConvex.vertices[0]);
                        v1.copy(shape.pillarConvex.vertices[1]);
                        v2.copy(shape.pillarConvex.vertices[2]);
                        v0.vadd(shape.pillarOffset, v0);
                        v1.vadd(shape.pillarOffset, v1);
                        v2.vadd(shape.pillarOffset, v2);
                        geometry.vertices.push(
                            new THREE.Vector3(v0.x, v0.y, v0.z),
                            new THREE.Vector3(v1.x, v1.y, v1.z),
                            new THREE.Vector3(v2.x, v2.y, v2.z)
                        );
                        var i = geometry.vertices.length - 3;
                        geometry.faces.push(new THREE.Face3(i, i+1, i+2));
                    }
                }
            }
            geometry.computeBoundingSphere();
            geometry.computeFaceNormals();
            mesh = new THREE.Mesh(geometry, material);
            shape.geometryId = geometry.id;
            break;
        }

        if(mesh){
            //console.log(mesh);
            mesh.name = this.getPrefix() + typeName + '_' + Utils.generateId();//'___mesh_debug___' +  Math.floor(Math.random()*10000000000);
            this.scene.add( mesh );
        }

        return mesh;
    }

    _scaleMesh( mesh, shape ) {

        switch( shape.type ) {

            case CANNON.Shape.types.SPHERE:
                var radius = shape.radius;
                mesh.scale.set(radius, radius, radius);
                break;

            case CANNON.Shape.types.BOX:
                mesh.scale.copy(shape.halfExtents);
                mesh.scale.multiplyScalar(2);
                break;

            case CANNON.Shape.types.CONVEXPOLYHEDRON:
                mesh.scale.set(1,1,1);
                break;

            case CANNON.Shape.types.TRIMESH:
                mesh.scale.copy(shape.scale);
                break;

            case CANNON.Shape.types.HEIGHTFIELD:
                mesh.scale.set( 1, 1, 1 );
                break;
        }//!! switch()
    }

    setVisible( visible ) {

        //console.log('>>>');
        //console.log(this.physics.options.useDebug);
        this.physics.options.useDebug = visible;
        const self = this;
        this.visibled = ( visible===true || visible===false ) ? visible : this.visibled;
        this.scene.traverse( (mesh) => {
            if( mesh instanceof THREE.Mesh ) {
                if( mesh.name.includes( this.getPrefix() )) {
                    mesh.visible = self.visibled; 
                }
            }
        });  
        return self.visibled;
    }


    hide() {
        return this.setVisible( false );   
    }

    show() {
        return this.setVisible( true );   
    }
    
    toggleVisible() {
        this.visibled = !this.visibled;
        this.setVisible(this.visibled);
        return this.visibled;
    }

    toggle() {
        return this.toggleVisible();  
    }
}

function Physics( graphics, options ) {

    this.options = options || {};

    this.graphics = graphics;

    this.world     = undefined;
    this.bodyDebug = undefined;

}

Physics.prototype.init = function() {


    this.options = Utils.opts(this.options, {});
    const defOpts = Options.physics;

    //!! Physics Options
    this.options.enabled     = Utils.opts( this.options.enabled , defOpts.enabled   );
    this.options.timeStep    = Utils.opts( this.options.timeStep, defOpts.timeStep  );


    //!! Debug Options
    this.options.debug            = Utils.opts( this.options.debug, {} );
    this.options.debug.enabled    = Utils.opts( this.options.debug.enabled   ,   defOpts.debug.enabled   );
    this.options.debug.color      = Utils.opts( this.options.debug.color     ,   defOpts.debug.color     );
    this.options.debug.offset     = Utils.opts( this.options.debug.offset    ,   defOpts.debug.offset    );

    //this.options.allowSleep       = Utils.opts(options.allowSleep,     false         ); //!! will be applied to physics.world only, not body

    
    //!! Wordl
    this.options.world              = Utils.opts( this.options.world, {} );
    this.options.world.gravity      = Utils.opts( this.options.world.gravity    , defOpts.world.gravity     );
    this.options.world.allowSleep   = Utils.opts( this.options.worldallowSleep  , defOpts.world.allowSleep  );
    this.options.world.quatNormalizeFast   = Utils.opts( this.options.worldallowSleep  , defOpts.world.quatNormalizeFast  );
    this.options.world.quatNormalizeSkip   = Utils.opts( this.options.worldallowSleep  , defOpts.world.quatNormalizeSkip  );
    
    this.world = new CANNON.World();
    this.world.allowSleep           = this.options.world.allowSleep;
    this.world.gravity              = this.options.world.gravity;
    this.world.quatNormalizeFast    = this.options.world.quatNormalizeFast;
    this.world.quatNormalizeSkip    = this.options.world.quatNormalizeSkip;

    //!! Broadphase
    this.options.world.broadphase                    = Utils.opts( this.options.world.broadphase, {} );
    this.options.world.broadphase.useBoundingBoxes   = Utils.opts( this.options.world.broadphase.useBoundingBoxes, defOpts.world.broadphase.useBoundingBoxes );
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.broadphase.useBoundingBoxes = this.options.world.broadphase.useBoundingBoxes ;
    

    //!! DDefault Contact Material 
    this.options.world.defaultContactMaterial                           = Utils.opts( this.options.world.defaultContactMaterial, {} );
    this.options.world.defaultContactMaterial.contactEquationStiffness  = Utils.opts( this.options.world.defaultContactMaterial.contactEquationStiffness    , defOpts.world.defaultContactMaterial.contactEquationStiffness );
    this.options.world.defaultContactMaterial.contactEquationRelaxation = Utils.opts( this.options.world.defaultContactMaterial.contactEquationRelaxation   , defOpts.world.defaultContactMaterial.contactEquationRelaxation );
    this.world.defaultContactMaterial.contactEquationStiffness  = this.options.world.defaultContactMaterial.contactEquationStiffness;
    this.world.defaultContactMaterial.contactEquationRelaxation = this.options.world.defaultContactMaterial.contactEquationRelaxation;



    //!! Solver Options
    this.options.solver = Utils.opts( this.options.solver, {} );
    this.options.solver.iterations = Utils.opts( this.options.solver.iterations , defOpts.solver.iterations );
    this.options.solver.tolerance  = Utils.opts( this.options.solver.tolerance  , defOpts.solver.tolerance  );
    this.options.solver.split      = Utils.opts( this.options.solver.split      , defOpts.solver.split      );

    const solver = new CANNON.GSSolver();
    if( this.options.solver.split ) {
        this.world.solver = new CANNON.SplitSolver( solver );
    }
    else {
        this.world.solver = solver;
    }

    //!! Physics Parameters, used internally
    this.enabled  = this.options.enabled;
    this.timeStep = this.options.timeStep;
    this.gravity  = this.options.world.gravity;


    //!! Body Debug
    this.bodyDebug = new BodyDebug( this.graphics, this, {color: this.options.debug.color });

    return this;
};

Physics.prototype.update = function( dt_ms ) {

    if( this.enabled === false ) return this;

    dt_ms = (dt_ms === undefined ? 1/60 : dt_ms);

    if( this.timeStep === 'dt' ) {
        var dts = dt_ms/1000;  //!! Convert to seconds
        if(dts > 1/5) { 
            Utils.printWarning( 'The dt='+dts.toFixed(3) + ' > ' + (1/5).toFixed(3) + ', changed to ' + (1/60).toFixed(3) );
            dts = 1/60;
        }
        this.world.step( dts );
    }
    else {
        this.world.step( this.timeStep );       
    }


    //!!
    var removedBodies = [];

    //!! Update meshes position, and check the meshes position 
    this.world.bodies.forEach( ( body ) => {
        if ( body.threemesh ) {
            //!! Update position and rotation of the three-mesh
            body.threemesh.position.copy( body.position );
            body.threemesh.quaternion.copy( body.quaternion );

            if( body.position.y < -100 ) {
                removedBodies.push( body );
            }
        }
    });


    //!! Update Debug
    
    if( this.options.debug.enabled ) {
        this.bodyDebug.update();
    }

    //!! Remove Objects 
    if( removedBodies.length > 0 ) {   

        //!! 1) Search the GLTF scene
        var target_scene = null;
        for( var i=0; i<this.graphics.scene.children.length; i++ ) {
            var c = this.graphics.scene.children[i];
            if( c instanceof THREE.Scene ) {
                //console.log( this.graphics.scene );
                target_scene = c;
                break;
            }  
        }

        //!! 2) If no GLTF scene is found, use the default scene
        if( !target_scene ) {
            target_scene = this.graphics.scene;
        }

        //!! 3) Remove the bodies and meshes
        removedBodies.forEach( body => {

           //!! Remove label
           var objs = [];
           for(var i=0; i<body.threemesh.children.length; i++) {
               objs.push( body.threemesh.children[i] );
           }
           objs.forEach(o => {
               body.threemesh.remove(o);   
           });
           objs = undefined;


           //!! Remove Graphics
           target_scene.remove( body.threemesh );
           body.threemes = undefined;


           Utils.printWarning('The ' + body.threemesh.name + ' is removed from the scene');

           //!! Remove Physics
           this.world.remove( body );
           body = undefined; 
       });
   }
};

Physics.prototype.start = function() {
    this.enabled = this.options.enabled = true;
};

Physics.prototype.stop = function() {
    this.enabled = this.options.enabled = false;
};

Physics.prototype.enebleProfiling = function( enabled ) {
    this.world.doProfiling = enabled;
};

Physics.prototype.getProfiling = function() {
    return this.world.profile;
};


/**********************************************************************************************************/
/*                                      PHYSICS BODIES MANIPULATION                                       */
/**********************************************************************************************************/

Physics.prototype.getBodies = function() {
    return this.world.bodies;
};

Physics.prototype.getBodiesFromWorld = function( ) {
    return this.world.bodies;
};

/**
 * Returns a body specified by mesh name
 * @param {string} name mesh name
 * @return CANNON.Body object
 */
Physics.prototype.getBodyByMeshName = function( name ) {

    var targets = [];
    var bodies = this.world.bodies;

    for ( let i = 0; i < bodies.length; i++ ) {
        const body = bodies[i];
        if ( body.threemesh.name.toLowerCase() === name.toLowerCase() ) {
            targets.push( body );
        }
    }

    if (targets.length > 1) {
        console.log('getBodyByMeshName: Found + ' + targets.length + ' bodies. Only the first body is returned');
    }

    return targets[0];  // Return only the first one
};


Physics.prototype.changeBodyToStatic = function( body ) {
    body.type = CANNON.Body.STATIC;
    body.mass = 0;
    body.updateMassProperties();
    body.aabbNeedsUpdate = true;
    return body;
};

Physics.prototype.changeBodyToDynamic = function( body, mass ) {
    body.type = CANNON.Body.DYNAMIC;
    body.mass = (mass ? mass : ((mesh.scale.x + mesh.scale.y + mesh.scale.z)/3));
    body.updateMassProperties();
    body.aabbNeedsUpdate = true;
    return body;
};



/**********************************************************************************************************/
/*                                       PHYSICS OBJECTS CREATION                                         */
/**********************************************************************************************************/

Physics.prototype.createBoxShape = function( mesh ) {
    const offset        = this.options.debug.offset;
    const halfExtents   = new CANNON.Vec3(mesh.scale.x + offset, mesh.scale.y + offset, mesh.scale.z + offset);
    const boxShape      = new CANNON.Box(halfExtents);
    return boxShape;
};

Physics.prototype.createBoxBody = function (child, mass) {
    
    const shape = this.createBoxShape( child );
    const body  = new CANNON.Body({ mass: mass });
    body.addShape(shape);
    body.quaternion.copy(child.quaternion);
    body.position.copy(child.position);
    body.threemesh = child;
    return body;
};

Physics.prototype.createPlaneShape = function( mesh ) {
    const offset        = this.options.debug.offset;
    const halfExtents   = new CANNON.Vec3( mesh.scale.x + offset, 0.05 + offset, mesh.scale.z + offset );
    const planeShape    = new CANNON.Box( halfExtents );
    return planeShape;
};

Physics.prototype.createPlaneBody = function(child, mass) {
    const shape = this.createPlaneShape( child );
    const body  = new CANNON.Body({ mass: mass });
    body.addShape(shape);
    body.quaternion.copy( child.quaternion );
    body.position.copy( child.position );
    body.threemesh = child;
    return body;
};

Physics.prototype.createSphereShape = function( mesh ) {
    const offset        = this.options.debug.offset;
    const halfExtents   = mesh.scale.x + offset*3;
    const sphereShape   = new CANNON.Sphere(halfExtents);
    return sphereShape; 
};

Physics.prototype.createSphereBody = function( child, mass ) {
    const shape = this.createSphereShape( child );
    const body  = new CANNON.Body( { mass: mass } ); 
    body.addShape( shape );
    body.quaternion.copy( child.quaternion );
    body.position.copy( child.position );
    body.threemesh = child;
    return body; 
};

Physics.prototype.createCylinderShape = function( child ) {
    const offset        = this.options.debug.offset;
    const radiusTop     = child.scale.x;
    const radiusBottom  = radiusTop;
    const height        = child.scale.y*2;
    const cylinderShape = new CANNON.Cylinder(radiusTop+offset, radiusBottom+offset, height+offset, 16);
    
    var q = new CANNON.Quaternion();
    q.setFromAxisAngle( new CANNON.Vec3(1, 0, 0), -Math.PI / 2 );
    cylinderShape.transformAllPoints( new CANNON.Vec3(), q );
  
    return cylinderShape;
};

Physics.prototype.createCylinderBody = function(child, mass) {
    const shape = this.createCylinderShape( child );
    const body  = new CANNON.Body( { mass: mass } );
    body.addShape( shape );
    body.quaternion.copy( child.quaternion );
    body.position.copy( child.position );
    body.threemesh = child;
    return body;
};

Physics.prototype.createConeShape = function( child ) {
    //!! Cylinder( radiusTop, radiusBottom, height , numSegments )
    const offset        = this.options.debug.offset;
    const radiusTop     = 0.001;
    const radiusBottom  = child.scale.x;
    const height        = child.scale.y*2;
    const coneShape = new CANNON.Cylinder(radiusTop+offset, radiusBottom+offset, height+offset, 16);
    
    //!! Make Y up to match to the THREE
    var q = new CANNON.Quaternion();
    q.setFromAxisAngle( new CANNON.Vec3( 1, 0, 0 ), -Math.PI / 2 );
    coneShape.transformAllPoints( new CANNON.Vec3(), q );
    return coneShape;
};

Physics.prototype.createConeBody = function(child, mass) {
    const shape = this.createConeShape( child );
    const body  = new CANNON.Body( { mass: mass } );
    body.addShape(shape);
    body.quaternion.copy( child.quaternion );
    body.position.copy( child.position );
    body.threemesh = child;
    return body;
};

Physics.prototype.createTorusShape = function( child ) {
    //!!Cylinder( radiusTop, radiusBottom, height , numSegments )
    const offset        = this.options.debug.offset;
    const radiusTop     = child.scale.x*1.25;
    const radiusBottom  = radiusTop;
    const height        = child.scale.y*0.5;
    const torusShape    = new CANNON.Cylinder(radiusTop+offset, radiusBottom+offset, height+offset, 16);
    
    var q = new CANNON.Quaternion();
    q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    torusShape.transformAllPoints(new CANNON.Vec3(), q);
    return torusShape;
};

Physics.prototype.createTorusBody = function(child, mass) {   
     const shape = this.createTorusShape( child );
     const body  = new CANNON.Body({ mass: mass });
     body.addShape(shape);
     body.quaternion.copy(child.quaternion);
     body.position.copy(child.position);
     body.threemesh = child;
     return body;
};

//!!
//!! CREATE SHAPE
//!!
Physics.prototype.createShapeFromMesh = function( mesh ) {

    const name = mesh.name.toLowerCase();

    if( name.includes( 'cube' ) || name.includes( 'box' ) ) {
        return this.createBoxShape( mesh );
    }
    if( name.includes( 'plane' ) ) {
        return this.createPlaneShape( mesh );
    }
    else if( name.includes( 'ball' ) || name.includes( 'sphere' ) || name.includes( 'icosphere' ) || name.includes( 'icosahedron' ) ) {
        return this.createSphereShape( mesh );
    }
    else if( name.includes('cylinder') ) {
        return this.createCylinderShape( mesh );
    }
    else if( name.includes('cone') ) {
        return this.createConeShape( mesh );
    }
    else if( name.includes('torus') ) {
        return this.createTorusShape( mesh );
    }
    else{
        //!! Lamp, Camera and others are ignored
        return undefined;
    }
};

//!!
//!! CREATE BODY
//!!
Physics.prototype.createBodyFromMesh = function( mesh ) {

    const name = mesh.name.toLowerCase();

    const mass = name.includes( 'static' ) ? 0 : ((mesh.scale.x + mesh.scale.y + mesh.scale.z)/3);
    

    if( name.includes( 'cube' ) || name.includes( 'box' ) ) {
        return this.createBoxBody( mesh, mass );
    }
    if( name.includes( 'plane' )) {
        return this.createPlaneBody( mesh, mass );
    }
    else if( name.includes( 'ball' ) || name.includes( 'sphere' ) || name.includes( 'icosphere' ) || name.includes( 'icosahedron' ) ) {
        return this.createSphereBody( mesh, mass );
    }
    else if( name.includes( 'cylinder' ) ) {
        return this.createCylinderBody( mesh, mass );
    }
    else if( name.includes( 'cone' )) {
        return this.createConeBody( mesh, mass );
    }
    else if( name.includes( 'torus' )) {
        return this.createTorusBody( mesh, mass );
    }
    else{
        //!! Lamp, Camera and others are ignored
        return undefined;
    }
};

Physics.prototype.createBodiesFromScene = function( scene ) {

    console.group('%cCreate Bodies From "' + scene.name + '"', 'color:#33AA33');

    const   self    = this;
    var     body    = undefined;
    var     created = false;
    var     cnt     = 0;

    scene.traverse( (mesh) => {

        if( mesh instanceof THREE.Group ) {
            //!! Multi-texture object
            body    = self.createBodyFromMesh( mesh );
            created = true;
        }
        else if( mesh instanceof THREE.Mesh ) {

            //!! Single-texture object
            if( mesh.parent instanceof THREE.Scene ) {
                
                body    = self.createBodyFromMesh( mesh );
                created = true;
            }
        }

        if( created ) {
            if( body ) {
                self.world.add( body ); 
                console.log('%c' + ++cnt + ') ' + 'Rigid-body of ' + mesh.type + ' "' + body.threemesh.name + '" is created', 'color:#339922');
            }
            created = false;
        }
    });
    console.groupEnd();
    return this;
};

Physics.prototype.showDebug = function() {
    this.options.debug.enabled = true;
    this.bodyDebug.show();
};

Physics.prototype.hideDebug = function() {
    this.options.debug.enabled = false;
    this.bodyDebug.hide();
};

Physics.prototype.toggleDebug = function() {
    this.options.debug.enabled = this.bodyDebug.toggle();
};

/**
 * Create ground material
 * @param {Number} friction friction coefficient
 * @param {Number} restitution restitution coefficient
 * @return CANNON.Material of ground
 */
Physics.prototype.createGroundMaterial = function(friction, restitution) {
    var groundMaterial = new CANNON.Material( Utils.PHYGROUNDMAT.PREFIX );
    var groundContactMaterial = new CANNON.ContactMaterial(
        groundMaterial,                 //!! Material #1
        groundMaterial,                 //!! Material #2
        {
            friction:    friction   != null ? friction    : 0.4,      //!! friction coefficient
            restitution: restitution!= null ? restitution : 0.0,      //!! restitution coefficient
            //contactEquationStiffness: 1e8,
            //contactEquationRelaxation: 3
        }
    );                   
    this.world.addContactMaterial(groundContactMaterial);   //!! Add the contact materials to the world
    return groundMaterial;
};

/**
 * Create object material
 * @param {Number} friction friction coefficient
 * @param {Number} restitution restitution coefficient
 * @return CANNON.Material of body/object
 */
Physics.prototype.createObjectMaterial = function(friction, restitution, groundMaterial) {
    var objectMaterial = new CANNON.Material( Utils.PHYOBJECTMAT.PREFIX );
    var objectContactMaterial = new CANNON.ContactMaterial(
        groundMaterial,                 //!! Material #1
        objectMaterial,                 //!! Material #2
        {
            friction:    friction   != null ? friction    : 0.0,      //!! friction coefficient
            restitution: restitution!= null ? restitution : 0.9,      //!! restitution coefficient
            //contactEquationStiffness: 1e8,
            //contactEquationRelaxation: 3
        }
    );                   
    this.world.addContactMaterial(objectContactMaterial);   //!! Add the contact materials to the world
    return objectMaterial;
};

Physics.prototype.clearWorld = function() {
    var bodies = [];
    for(var i=0; i<this.world.bodies.length; i++) {
        bodies.push(this.world.bodies[i]);
    }
    for(var i=0; i<bodies.length; i++) {
        this.world.remove(bodies[i]);
    }
};

/*
* Multiple Keys Event Handlerer
* Dr.Santi Nuratch
* v0.1: 30 December 2018
*/

class KeyEvent {
    constructor(key) {
        this.down     = false;
        this.key      = key;
        this.keyCode  = undefined;
        this.target   = undefined;
        this.shift    = false;
        this.ctrl     = false;
        this.alt      = false;
        this.repeat   = false;
        this.timeOld  = performance.now();//!! milliseconds
        this.timeNew  = 0; 
        this.timeDif  = 0; 
        this.timeSum  = 0; 

        
    }   
}


class Keyboard {
    constructor(callback, options) {
        this.options = options || {};

        this.downTicks = 0;

        this.callback = callback || null;
        this.event = new KeyEvent('');

        //!! Save pressed keys (their event structure, the KeyEvent)
        this.keyDownList = [];


        //!! OnKeyDown
        document.addEventListener('keydown', (event) => {
            
            //!! START Add
            var added = false;
            for(let i=0; i<this.keyDownList.length; i++) {
                if( this.keyDownList[i].key === event.key ) {
                    added = true;
                    break;
                }  
            }
            if(!added){
                var keyEvt = new KeyEvent(event.key);
                _updateParams(keyEvt, event, true);
                this.keyDownList.push(keyEvt); 
            }
            //!! END Add

            //!! Callback
            if(this.callback){
                _updateParams(this.event, event, true);
                this.callback(this.event);
            }
           
        });

        //!! OnKeyUp
        document.addEventListener('keyup', (event) => {

            this.downTicks = 0;

            var idx = -1;
            for(let i=0; i<this.keyDownList.length; i++) {
                if( this.keyDownList[i].key === event.key ) {
                    idx = i;
                    break;
                }  
            }
            if(idx >= 0){
                this.keyDownList.splice(idx, 1);
            }

            //!! Callback
            if(this.callback){
                _updateParams(this.event, event, false);
                this.callback(this.event);
            }
        });

    }// constructor

    //!! Callback
    setCallback(callback) {
        this.callback = callback;
    }

    //!!
    //!! If the "key" is hokded down, it returns true in the period of "time"
    //!!

    /**
     * Returns true if the desired key is pressed
     * @param {string} key  key character
     * @param {number} time timeout
     */
    getKeyDown( key, time ) {
        
        //!! Search in the this.keyDownList
        for( let i=0; i<this.keyDownList.length; i++ ) {
            var keyEvt = this.keyDownList[i];
            if( keyEvt.key === key ) {
                //!! Got it, 

                //!! First time
                if(this.downTicks == 0) {
                    this.downTicks++;
                    return true;
                }

                //!!  Key hold down
                if( time ) {
                    var holdDownTime = Number( performance.now() - keyEvt.timeNew );
                    if( Number(holdDownTime) > Number(time) ) {
                        keyEvt.timeNew = performance.now();
                        return true;  
                    }
                    return false;
                }
                return true;
            }   
        }

        return false;  
    }
}


//!! Helper
function _updateParams(target, event, isDown) {
    target.down     = isDown;
    target.key      = event.key;
    target.keyCode  = event.keyCode;
    target.shift    = event.shiftKey;
    target.ctrl     = event.ctrlKey;
    target.alt      = event.altKey;
    target.repeat   = event.repeat;
    target.target   = event.target;
    target.timeOld  = target.timeNew;
    target.timeNew  = performance.now(); //!! milliseconds
    target.timeDif  = (isDown) ? target.timeNew - target.timeOld : 0;
    target.timeSum  = (isDown) ? target.timeSum + target.timeDif : 0;
}


/**
//!!
//!! Example:
//!!


import Keyboard from './lib/keyboard';
const input = new Keyboard();

setInterval(() =>{
    if( input.getKeyDown( 'w' ) ) {
        
    }
    if( input.getKeyDown( 'a' ) ) {
        
    }
},20);
*/

class LabelRenderer {

    constructor( graphics ) {

        this.graphics = graphics;

        this.visibled = false;

        this.labels = [];
        this.initLabelRender();
    }

    static get NAME_PREFIX() {
        return Utils.MESHLABEL.PREFIX;
    }

    static get LABEL_CLASS() {
        return 'object_label';
    }

    initLabelRender() {
        this.renderer = new threeCss2drender.CSS2DRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.pointerEvents = 'none';
        this.renderer.domElement.style.position = 'absolute'; 
        document.body.appendChild( this.renderer.domElement  );
    }


    /**
     * Returns label CSS2DObject
     * @param {THREE.Mesh} mesh target mesh
     */
    getLabel( mesh ) {

        const NAME = LabelRenderer.NAME_PREFIX + mesh.name;

        for(var i=0; i<mesh.children.length; i++) {
            if( mesh.children[i].name === NAME ) {
                return mesh.children[i];
            }  
        }
        return undefined;
    }

    /**
     * Adds label to the provided mesh
     * @param {THREE.Mesh} mesh        target mesh
     * @param {string}     desiredName text/label
     */
    addLabel( mesh, desiredName ) {

        if( this.getLabel(mesh) ) {
            //!! already added!
            return undefined;
        }

        const NAME = LabelRenderer.NAME_PREFIX + mesh.name;
        
        //!! Create a text
        var text = document.createElement( 'div' );
        text.className   = LabelRenderer.LABEL_CLASS;
        text.textContent = desiredName ? desiredName : mesh.name;
        text.textContent = text.textContent === '' ? 'No Name' :  text.textContent;
        
        //!! Create a CSS2DObject
        var label  = new threeCss2drender.CSS2DObject( text );
        label.name = NAME;
        label.position.copy( new THREE.Vector3( 0, 0, 0 ));
        label.translateY (1);
        mesh.add( label );

        this.labels.push( label );
        return label;
    }

    /**
     * Removes label from the target mesh
     * @param {THREE.Mesh} mesh  target mesh
     */
    removeLabel( mesh ) {
        const label = this.getLabel(mesh); 
        if( !label ) {
            //!! no label
            return undefined;
        }

        mesh.remove(label);

        const NAME = LabelRenderer.NAME_PREFIX + mesh.name;
        const lbls = [];
        
        for(var i=0; i<this.labels.length; i++) {
            if(this.labels[i].name != NAME) {
                lbls.push( this.labels[i] );
            }
        }
        this.labels = lbls;
        return this.labels;
    }

    /**
     * Get all meshes in the current scene
     */
    getMeshes() {
        const self = this;
        const meshes = [];
        self.graphics.scene.traverse(function(c){
            if( c instanceof THREE.Mesh || c instanceof THREE.Group ) {
                if(c.parent instanceof THREE.Scene  ) {
                    meshes.push(c);
                }
            } 
        });
        return meshes;
    }

    /**
     * Add labels to meshes in the current scene
     */
    addLabelToObjects() {

        const meshes = this.getMeshes();

        for(var i=0; i<meshes.length; i++) {
            var s = meshes[i].name.toLowerCase();
            if( !s.includes( Utils.HELPER.PREFIX ) && !s.includes( Utils.FOGPLANE.PREFIX )  )
                this.addLabel( meshes[i] );
        }
        return meshes;
    }

    show() {
        this.addLabelToObjects();
        this.visibled = true;
        return this.visibled;
    }
    hide() {
        this.removeLabelFromObjects();
        this.visibled = false;
        return this.visibled;
    }
    toggle() {
        this.visibled = !this.visibled;
        if(this.visibled) {
            this.show();
        }
        else {
            this.hide();
        }
        
        return this.visibled;
    }

    /**
     * Removes all labels from meshes in the current scene
     */
    removeLabelFromObjects() {
        const meshes = this.getMeshes();

        for(var i=0; i<meshes.length; i++) {
            this.removeLabel( meshes[i] );
        }
        return meshes;    
    }

    
     /**
     * Updates label of the provided mesh
     * @param {THREE.Mesh} mesh  target mesh
     * @param {string}     label label/text to be displayed on the mesh
     * @return CSS2DObject label
     */
    updateLabel( mesh, text ) {
        const label = this.getLabel( mesh );
        if( ! label ) {
            this._print_label_not_found( mesh );
            return undefined;
        }
        label.element.innerHTML = text;
        return label;
    }

     /**
     * Changes css class name of the label
     * @param {THREE.Mesh} mesh  target mesh 
     * @param {string} className css class name
     * @return CSS2DObject label
     */
    setLabelClass( mesh, className ) {
        const label = this.getLabel( mesh );
        if( ! label ) {
            this._print_label_not_found( mesh );
            return undefined;
        }
        label.element.className = className;
        return label;
    }

     /**
     * Adds css class name into css classList of the label element
     * @param {HREE.Mesh} mesh   target mesh 
     * @param {string} className css class name
     * @return CSS2DObject label
     */
    addLabelClass( mesh, className ) {
        const label = this.getLabel( mesh );
        if( ! label ) {
            this._print_label_not_found( mesh );
            return undefined;
        }
        label.element.classList.add( className );
        return label;
    }

    /**
     * Sets label position relative to the target mesh
     * @param {THREE.Mesh}    mesh     target mesh
     * @param {THREE.Vector3} position label position
      * @return CSS2DObject label
     */
    setLabelPosition(mesh, position) {
        const label = this.getLabel( mesh );
        if( ! label ) {
            this._print_label_not_found( mesh );
            return undefined;
        }
        label.position.copy( position );
        return label;
    }

    _print_label_not_found( mesh ) {
        //console.log("%cCannot find the label of the \"" + mesh.name + "\"", 'color:#CC5511');   
    }
}

class RayCast {

    constructor( graphics, physics ) {

        this.graphics = graphics;
        this.physics  = physics;

        this.callback = null;

        this.meshes = [];
        this.raycaster = new THREE.Raycaster();

        this.mousePosition = new THREE.Vector2();

        window.addEventListener( 'mousemove', function(event){
            this.mousePosition.x = +( event.clientX / this.graphics.renderer.domElement.clientWidth )  * 2 - 1;
            this.mousePosition.y = -( event.clientY / this.graphics.renderer.domElement.clientHeight ) * 2 + 1;
        }.bind(this), false );
    }

    doRaycast() {

        this.updateScene();

        if(this.meshes.length < 1) {
            this.meshes = this.getMeshesFromScene();
        }

        var targets = [];

        if( this.meshes.length > 1 ) {

            this.raycaster.setFromCamera( this.mousePosition, this.graphics.camera );
            let intersects = this.raycaster.intersectObjects( this.meshes );

            //console.group('%cRaycaster', 'color:#FF8822');     //!!--------------------------------------------
            //console.dir(this.raycaster);
            for( let i=0; i<intersects.length; i++ ) {

                const obj = intersects[i].object;
                //console.dir( intersects[i] );
                if( obj.name.includes( Utils.HELPER.PREFIX  ) || obj.name.includes( Utils.BODYDEBUG.PREFIX  )) {
                    continue;
                }

                if( obj.parent instanceof THREE.Group ) {
                    targets.push( { mesh: obj.parent, intersect: intersects[i], ray: this.raycaster.ray } ); 
                    //console.dir( obj.parent );
                }
                else {
                    targets.push( { mesh:obj, intersect: intersects[i], ray: this.raycaster.ray }  );
                    //console.dir( obj );
                }
            } 
            //console.groupEnd();                     //!!--------------------------------------------
        }
        return targets;
    }

    updateScene() {
        this.meshes = this.getMeshesFromScene();   
    }

    getMeshesFromScene( scene ) {
        const _scene = scene || this.graphics.scene;
        var meshes = [];
        _scene.traverse( (c) => {
            if(c instanceof THREE.Mesh) {
                if(c.name) {
                    meshes.push(c);
                }
            }
        });
        return meshes;
    }
    
    getMeshesFromWorld(world) {

        const _world = world || this.physics.world;
        const meshes = [];//= this.meshes;

        _world.bodies.forEach(body => {
            body.threemesh.traverse( (c) => {
                if(c instanceof THREE.Mesh) {
                    if(c.name) {
                        meshes.push(c);
                    }   
                } 
            });
        }); 
        return meshes;
    }
}

/*
**************************************************************************************
* AssetLoader.js
* AssetLoader is special loader, used to download complex shape object with it colliders
*
* Dr.Santi Nuratch
* Embedded System Computing and Control Laboratory
* ECC-Lab | INC@KMUTT
*
* 03 March, 2019
***************************************************************************************
*/



class AssetLoader {

    constructor ( graphics, physics ) {
        this.graphics = graphics;
        this.physics  = physics;
    }


    /**
     * Loads asset (mesh+colliders) asynchronously
     * @param {string}   model    file name of GLTF
     * @param {function} callback callback function
     * @return Promise
     */
    load( model, callback ) {
        var self = this;
        const color = '#22aa55';
        return new Promise( (resolve, reject) => {

            console.group( "%cAssetLoader.load", 'color:'+color );

            //!! 1) Load the model
            const loader = new GLTFLoader__default();
            loader.crossOrigin = 'anonymous';
            
            loader.load( model, ( gltf ) => {

                Utils.print('The ' + model + ' is loaded', color);

                const colliders = [];
                var actor = undefined;

                var cnt = 0;
                console.group( "%cProcessing Asset Model", 'color:#5588aa' );
                //console.log( gltf.scene );

                gltf.scene.traverse( child => {

                    if( child instanceof THREE.Mesh || child instanceof THREE.Group ) {

                        if( child.parent instanceof THREE.Scene ) {

                            //!! Collider
                            if( child.name.toLowerCase().includes( 'collider' ) ) {
                                
                                colliders.push( child );
                                Utils.printSuccess( ''+(++cnt) + ') Collider.name "' + child.name + '"' );
                            }

                            //!! Actor/Character
                            else if( child.name.toLowerCase().includes( 'actor' ) || child.name.toLowerCase().includes( 'character' ) ) {
                                
                                actor = child;

                                actor.children.forEach(c => {
                                    c.castShadow = true; 
                                });
                                Utils.printInfo('Actor.name "' + child.name + '"');
                            }
                        }
                    }
                });

                //!! Apply reflection map to mesh/actor
                if( this.graphics.options.useReflection )
                    this.graphics.applyReflectionMap( actor );

                //!! Check
                if( !actor || colliders.length < 1 ) {
                    Utils.printDanger( "No actor or colliders are found in the " + model );
                }

                //!! 1) Create a body
                const body = new CANNON.Body({ mass: 2 });

                //!! 2) Assign the actor (mash) to the threemesh of the body
                body.threemesh = actor;
                body.threemesh.name = actor.name;

                //!! 3) Create shapes and add them to body
                colliders.forEach( collider => {

                    //!! These are not requird
                    collider.receiveShadow = false;
                    collider.castShadow    = false;
                    collider.material      = null;

                    //!! Create shape
                    var shape =  self.physics.createShapeFromMesh( collider );

                    //!! Positioning
                    var v1 = collider.position.clone();
                    var v2 = v1.sub( actor.position );

                    //!! Add shape to the body
                    body.addShape( shape, v2 ); 
                    
                });

                //!! Position and Rotation
                body.position.copy( actor.position );       
                body.quaternion.copy( actor.quaternion );

                //!! Add the body to graphics and physics
                self.graphics.scene.add( actor );
                self.physics.world.addBody( body );

                console.groupEnd(); 
                
                //!! Resolve and callback
                resolve({ body: body, mesh: actor, colliders: colliders });
                if( callback ) {
                    callback( { body: body, mesh: actor, colliders: colliders } );   
                }

            });// loader.load()
        });
    }
}

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
};


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
};

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
};

EngineCore.prototype.getMilliseconds = function() {
    return performance.now() || Date.now();
};

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
};

EngineCore.prototype.updatePhysics = function( dt_ms ) {

    const t0 = this.getMilliseconds();
    this.physics.update( dt_ms );
    return this.getMilliseconds(dt_ms)-t0;
};

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
};

EngineCore.prototype.start = function( callback ) {
    this.callback = callback;
    if( this.reqAnim !== undefined ) return;    //!! Started, return
    this.reqAnim = requestAnimationFrame(  this.update.bind(this) );
};

EngineCore.prototype.stop = function() {
    if( this.reqAnim === undefined ) return;    //!! Stopped, return
    cancelAnimationFrame( this.reqAnim );
    this.reqAnim = undefined;
};

exports.THREE = THREE;
exports.CANNON = CANNON;
exports.default = EngineCore;
exports.EngineCore = EngineCore;
exports.Utils = Utils;
