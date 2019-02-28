/**
 * Example-04: Engine configuration options
 * 
 * Dr.Santi Nuratch
 * Embedded Computing and Control Laboratory
 *  22 February, 2019
 */

//!! Import the ECC-CGP-Engine
import Engine from '../libs/ECC-CGP-Engine';


//!! Create the engine with options
const engine = new Engine({
    graphics:{  //!! Graphics options
        
        sceneType: 'fog',       //!! Scene type, 'env', 'fog', 'basic'

        grids:{                         //!! Grids
            enabled:   true,            //!! Use grids
            colorGrid: 0x224411,        //!! Grid color
            colorCenterLine: 0x442211,  //!! Center line color
        }
    },
    physics:{                   //!! Physics options
        enabled:  true,         //!! Use physics engine
        useDebug: true,         //!! Use physics debug
        stepTime: 1/10          //!! Step time of physics solver
    }
});
//!! Initialize the engine
engine.init().then( ( params ) => {
    engine.start();             //!! Start without callback function
});