/**
 * Example-02: Engine callback function
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
    console.log( params );      //!! Check the params object in the console window
    engine.start( callback );   //!! Start the engine and give it the callback
 });

 //!! Engine callback function called every frame (60 fps)
 function callback( args ) {
    //!! Do something here
 }
 