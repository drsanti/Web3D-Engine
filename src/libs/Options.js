
/**
 * Default options 
 */

import * as THREE   from 'three';
import * as CANNON  from 'cannon';

export default {

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
}

