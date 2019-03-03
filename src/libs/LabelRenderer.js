

import * as     THREE   from    'three';
import * as     CANNON  from    'cannon';
import          Utils   from    './Utils';
//const Options = require('./Options');
import Options          from './Options';

import { CSS2DRenderer, CSS2DObject } from 'three-css2drender';

export default class LabelRenderer {

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
        this.renderer = new CSS2DRenderer();
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
        var label  = new CSS2DObject( text );
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
