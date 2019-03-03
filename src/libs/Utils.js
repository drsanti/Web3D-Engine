
/*
**************************************************************************************
* Utils.js
* Utility functions and statics variables
*
* Dr.Santi Nuratch
* Embedded System Computing and Control Laboratory
* ECC-Lab | INC@KMUTT
*
* 03 March, 2019
***************************************************************************************
*/

import * as THREE   from 'three';

/**
 * Utility functions
 */
export default function Utils() {}


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
Utils.GRIDS.PREFIX              = '_grids_'

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
}

/**
 * Print message to console window
 * @param {string} message message to be printed
 * @param {number} color   hex color
 * @param {string} sender  prefix message
 */
Utils.print = function( message, color, prefix ) {
    console.log('%c' +(prefix?prefix+': ':'') + message, 'color:' + Utils.hexToCss(color));
}

/**
 * Print information message
 * @param {string} message information message
 */
Utils.printInfo = function( message ) {
    Utils.print( message, Utils.COLOR.INFO );
}

/**
 * Print warning message
 * @param {string} message warning message
 */
Utils.printWarning = function( message ) {
    Utils.print( message, Utils.COLOR.WARNING );
}

/**
 * Print danger message
 * @param {string} message danger message
 */
Utils.printDanger = function( message ) {
    Utils.print( message, Utils.COLOR.DANGER);
}

/**
 * Print success message
 * @param {string} message success message
 */
Utils.printSuccess = function( message ) {
    Utils.print( message, Utils.COLOR.SUCCESS );
}

/**
 * Print primary message
 * @param {string} message primary message
 */
Utils.printPrimary = function( message ) {
    Utils.print( message, Utils.COLOR.PRIMARY );
}

/**
 * Print secondary message
 * @param {string} message secondary message
 */
Utils.printSecondary = function( message ) {
    Utils.print( message, Utils.COLOR.SECONDARY );
}

/**
 * Generate id. prefix_numbers or numders
 * @param {string} prefix prefix string
 * @return string
 */
Utils.generateId = function( prefix ) {
    return (prefix? prefix + '_' : '') + Math.floor(Math.random()*1000000) + '';
}

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
}

/**
 * Parse options
 * @param {object} opt options
 * @param {object} def default options
 * @return options
 */
Utils.opts = function( opt, def ) {
    return (opt === null || opt === undefined) ? def : opt;
}

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
}

/**
 * Returns true if the object is body-debug
 * @param {object} obj object
 * @return boolean
 */
Utils.isDebugger = function( obj ) {
    return Utils.getName(obj).includes( Utils.BODYDEBUG.PREFIX );
}

/**
 * Returns true if the object is helper
 * @param {object} obj object
 * @return boolean
 */
Utils.isHelper = function( obj ) {
    return Utils.getName(obj).includes( Utils.HELPER.PREFIX );
}

/**
 * Returns true if the object is fog-plane
 * @param {object} obj object
 * @return boolean
 */
Utils.isFogPlane = function( obj ) {
    return Utils.getName(obj).includes( Utils.FOGPLANE.PREFIX );
}

/**
 * Returns true if the object is collider
 * @param {object} obj object
 * @return boolean
 */
Utils.isCollider = function( obj ) {
    return Utils.getName(obj).includes( Utils.COLLIDER.PREFIX );
}

/**
 * Returns true if the object is static
 * @param {object} obj object
 * @return boolean
 */
Utils.isStatic = function( obj ) {
    return Utils.getName(obj).includes( Utils.STATIC.PREFIX );
}

/**
 * Returns true if the object is light
 * @param {object} obj object
 * @return boolean
 */
Utils.isLight = function( obj ) {
    return Utils.getName(obj).includes( Utils.LIGHT.PREFIX );
}

/**
 * Returns true if the object is mesh
 * @param {object} obj object
 * @return boolean
 */
Utils.isMesh = function( obj ) {
    return ( obj instanceof THREE.Mesh );
}

/**
 * Returns true if the object is group
 * @param {object} obj object
 * @return boolean
 */
Utils.isGroup = function( obj ) {
    return ( obj instanceof THREE.Group );
}

/**
 * Returns true if the object is scene
 * @param {object} obj object
 * @return boolean
 */
Utils.isScene = function( obj ) {
    return ( obj instanceof THREE.Scene );
}

/**
 * Returns true if the object is face
 * @param {object} obj object
 * @return boolean
 */
Utils.isFace = function( obj ) {
    return ( Utils.isMesh(obj) & !Utils.isHelper(obj) & !Utils.isFogPlane(obj) & !Utils.isCollider(obj) & !Utils.isLight(obj) );
}

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
}

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
}
