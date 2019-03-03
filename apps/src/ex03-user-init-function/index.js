/**
 * Example-03: User initialization function
 * 
 * Dr.Santi Nuratch
 * Embedded Computing and Control Laboratory
 * 22 February, 2019
 */

 //!! Import the ECC-CGP-Engine
 import Engine from '../libs/ECC-CGP-Engine';


//!! Create the engine
const engine = new Engine();

//!! Initialize the engine
engine.init().then( ( params ) => {
    userInit( params );             //!! User initialization function
    engine.start();                 //!! Start the engine
});

//!! User initialize function
function userInit( params ) {
    engine.printInfo("Put your initialized code here");
}
 