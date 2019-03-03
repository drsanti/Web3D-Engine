/**
 * Example-01: Getting Started
 * 
 * Dr.Santi Nuratch
 * Embedded Computing and Control Laboratory
 * 22 February, 2019
 */

//!! Import the ECC-CGP-Engine
import Engine from '../libs/ECC-CGP-Engine';    //!! Local
// import Engine from 'ECC-CGP-Engine';         //!! NPM


 //!! Create the engine
 const engine = new Engine();
 
 //!! Initialize the engine
 engine.init().then( ( params ) => {
    console.log( params );  //!! Check the params object in the console window
    engine.start();         //!! Start the engine
    engine.printInfo( "Engine started. Please wait..." );
    setTimeout( () => {
        engine.stop();      //!! Stop the engine
        engine.printInfo( "Engine stopped. Refresh the browser to try again" );
    }, 5000);
 });
 