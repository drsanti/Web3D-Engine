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


import * as THREE  from 'three';
import * as CANNON from 'cannon';
import GLTFLoader  from 'three-gltf-loader';
import Utils       from './Utils';



export default class AssetLoader {

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
            const loader = new GLTFLoader();
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
