
/*
* Raycaster wraper
* Dr.Santi Nuratch
* v0.1: 22 December 2018
*/

import * as THREE  from 'three';
import Utils from './Utils';
//const Options       = require('./Options');
import Options          from './Options';
export default class RayCast {

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


