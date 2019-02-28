/**
 * Example-05: Engine initialization options
 * 
 * Dr.Santi Nuratch
 * Embedded Computing and Control Laboratory
 *  22 February, 2019
 */

//!! Import the ECC-CGP-Engine
import Engine from '../libs/ECC-CGP-Engine';

//!! Create the engine
const engine = new Engine();

//!! Engine initialization options
const initOpts = {  //!! 
    envPath: 'images/Bridge2',  //!! Environment texture (CubeMapTexture)
    models: [                   //!! GLTF models
        'models/prebuilds/grounds/ground1.gltf',
        'models/prebuilds/boxes/box1.gltf',
        'models/prebuilds/boxes/box2.gltf',
        'models/prebuilds/boxes/box3.gltf',
    ]
};

//!! Initialise the engine with the given options, the initOpts object
engine.init( initOpts ).then( ( params ) => {
    engine.start();             //!! Start without callback function
});
