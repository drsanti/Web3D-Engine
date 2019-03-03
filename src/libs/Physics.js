
export default Physics;

import * as THREE   from 'three';
import * as CANNON  from 'cannon';

//const  Options       = require('./Options');
import Options          from './Options';
import BodyDebug     from './BodyDebug';
import Utils from './Utils';

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
}

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
}

Physics.prototype.start = function() {
    this.enabled = this.options.enabled = true;
}

Physics.prototype.stop = function() {
    this.enabled = this.options.enabled = false;
}

Physics.prototype.enebleProfiling = function( enabled ) {
    this.world.doProfiling = enabled;
}

Physics.prototype.getProfiling = function() {
    return this.world.profile;
}


/**********************************************************************************************************/
/*                                      PHYSICS BODIES MANIPULATION                                       */
/**********************************************************************************************************/

Physics.prototype.getBodies = function() {
    return this.world.bodies;
}

Physics.prototype.getBodiesFromWorld = function( ) {
    return this.world.bodies;
}

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
}


Physics.prototype.changeBodyToStatic = function( body ) {
    body.type = CANNON.Body.STATIC;
    body.mass = 0;
    body.updateMassProperties();
    body.aabbNeedsUpdate = true;
    return body;
}

Physics.prototype.changeBodyToDynamic = function( body, mass ) {
    body.type = CANNON.Body.DYNAMIC;
    body.mass = (mass ? mass : ((mesh.scale.x + mesh.scale.y + mesh.scale.z)/3));
    body.updateMassProperties();
    body.aabbNeedsUpdate = true;
    return body;
}



/**********************************************************************************************************/
/*                                       PHYSICS OBJECTS CREATION                                         */
/**********************************************************************************************************/

Physics.prototype.createBoxShape = function( mesh ) {
    const offset        = this.options.debug.offset;
    const halfExtents   = new CANNON.Vec3(mesh.scale.x + offset, mesh.scale.y + offset, mesh.scale.z + offset);
    const boxShape      = new CANNON.Box(halfExtents);
    return boxShape;
}

Physics.prototype.createBoxBody = function (child, mass) {
    
    const shape = this.createBoxShape( child );
    const body  = new CANNON.Body({ mass: mass });
    body.addShape(shape);
    body.quaternion.copy(child.quaternion);
    body.position.copy(child.position);
    body.threemesh = child;
    return body;
}

Physics.prototype.createPlaneShape = function( mesh ) {
    const offset        = this.options.debug.offset;
    const halfExtents   = new CANNON.Vec3( mesh.scale.x + offset, 0.05 + offset, mesh.scale.z + offset );
    const planeShape    = new CANNON.Box( halfExtents );
    return planeShape;
}

Physics.prototype.createPlaneBody = function(child, mass) {
    const shape = this.createPlaneShape( child );
    const body  = new CANNON.Body({ mass: mass });
    body.addShape(shape);
    body.quaternion.copy( child.quaternion );
    body.position.copy( child.position );
    body.threemesh = child;
    return body;
}

Physics.prototype.createSphereShape = function( mesh ) {
    const offset        = this.options.debug.offset;
    const halfExtents   = mesh.scale.x + offset*3;
    const sphereShape   = new CANNON.Sphere(halfExtents);
    return sphereShape; 
}

Physics.prototype.createSphereBody = function( child, mass ) {
    const shape = this.createSphereShape( child );
    const body  = new CANNON.Body( { mass: mass } ); 
    body.addShape( shape );
    body.quaternion.copy( child.quaternion );
    body.position.copy( child.position );
    body.threemesh = child;
    return body; 
}

Physics.prototype.createCylinderShape = function( child ) {
    const offset        = this.options.debug.offset;
    const radiusTop     = child.scale.x;
    const radiusBottom  = radiusTop
    const height        = child.scale.y*2;
    const cylinderShape = new CANNON.Cylinder(radiusTop+offset, radiusBottom+offset, height+offset, 16);
    
    var q = new CANNON.Quaternion();
    q.setFromAxisAngle( new CANNON.Vec3(1, 0, 0), -Math.PI / 2 );
    cylinderShape.transformAllPoints( new CANNON.Vec3(), q );
  
    return cylinderShape;
}

Physics.prototype.createCylinderBody = function(child, mass) {
    const shape = this.createCylinderShape( child );
    const body  = new CANNON.Body( { mass: mass } );
    body.addShape( shape );
    body.quaternion.copy( child.quaternion );
    body.position.copy( child.position );
    body.threemesh = child;
    return body;
}

Physics.prototype.createConeShape = function( child ) {
    //!! Cylinder( radiusTop, radiusBottom, height , numSegments )
    const offset        = this.options.debug.offset;
    const radiusTop     = 0.001;
    const radiusBottom  = child.scale.x
    const height        = child.scale.y*2;
    const coneShape = new CANNON.Cylinder(radiusTop+offset, radiusBottom+offset, height+offset, 16);
    
    //!! Make Y up to match to the THREE
    var q = new CANNON.Quaternion();
    q.setFromAxisAngle( new CANNON.Vec3( 1, 0, 0 ), -Math.PI / 2 );
    coneShape.transformAllPoints( new CANNON.Vec3(), q );
    return coneShape;
}

Physics.prototype.createConeBody = function(child, mass) {
    const shape = this.createConeShape( child );
    const body  = new CANNON.Body( { mass: mass } );
    body.addShape(shape);
    body.quaternion.copy( child.quaternion );
    body.position.copy( child.position );
    body.threemesh = child;
    return body;
}

Physics.prototype.createTorusShape = function( child ) {
    //!!Cylinder( radiusTop, radiusBottom, height , numSegments )
    const offset        = this.options.debug.offset;
    const radiusTop     = child.scale.x*1.25;
    const radiusBottom  = radiusTop
    const height        = child.scale.y*0.5;
    const torusShape    = new CANNON.Cylinder(radiusTop+offset, radiusBottom+offset, height+offset, 16);
    
    var q = new CANNON.Quaternion();
    q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    torusShape.transformAllPoints(new CANNON.Vec3(), q);
    return torusShape;
}

Physics.prototype.createTorusBody = function(child, mass) {   
     const shape = this.createTorusShape( child );
     const body  = new CANNON.Body({ mass: mass });
     body.addShape(shape);
     body.quaternion.copy(child.quaternion);
     body.position.copy(child.position);
     body.threemesh = child;
     return body;
}

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
}

//!!
//!! CREATE BODY
//!!
Physics.prototype.createBodyFromMesh = function( mesh ) {

    const name = mesh.name.toLowerCase();

    const mass = name.includes( 'static' ) ? 0 : ((mesh.scale.x + mesh.scale.y + mesh.scale.z)/3)
    

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
}

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
}

Physics.prototype.showDebug = function() {
    this.options.debug.enabled = true;
    this.bodyDebug.show();
}

Physics.prototype.hideDebug = function() {
    this.options.debug.enabled = false;
    this.bodyDebug.hide();
}

Physics.prototype.toggleDebug = function() {
    this.options.debug.enabled = this.bodyDebug.toggle();
}

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
}

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
}

Physics.prototype.clearWorld = function() {
    var bodies = [];
    for(var i=0; i<this.world.bodies.length; i++) {
        bodies.push(this.world.bodies[i]);
    }
    for(var i=0; i<bodies.length; i++) {
        this.world.remove(bodies[i]);
    }
}
