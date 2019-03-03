/*
* Multiple Keys Event Handlerer
* Dr.Santi Nuratch
* v0.1: 30 December 2018
*/

class KeyEvent {
    constructor(key) {
        this.down     = false;
        this.key      = key;
        this.keyCode  = undefined;
        this.target   = undefined;
        this.shift    = false;
        this.ctrl     = false;
        this.alt      = false;
        this.repeat   = false;
        this.timeOld  = performance.now();//!! milliseconds
        this.timeNew  = 0; 
        this.timeDif  = 0; 
        this.timeSum  = 0; 

        
    }   
}


export default class Keyboard {
    constructor(callback, options) {
        this.options = options || {};

        this.downTicks = 0;

        this.callback = callback || null;
        this.event = new KeyEvent('');

        //!! Save pressed keys (their event structure, the KeyEvent)
        this.keyDownList = [];


        //!! OnKeyDown
        document.addEventListener('keydown', (event) => {
            
            //!! START Add
            var added = false;
            for(let i=0; i<this.keyDownList.length; i++) {
                if( this.keyDownList[i].key === event.key ) {
                    added = true;
                    break;
                }  
            }
            if(!added){
                var keyEvt = new KeyEvent(event.key);
                _updateParams(keyEvt, event, true);
                this.keyDownList.push(keyEvt); 
            }
            //!! END Add

            //!! Callback
            if(this.callback){
                _updateParams(this.event, event, true);
                this.callback(this.event);
            }
           
        });

        //!! OnKeyUp
        document.addEventListener('keyup', (event) => {

            this.downTicks = 0;

            var idx = -1;
            for(let i=0; i<this.keyDownList.length; i++) {
                if( this.keyDownList[i].key === event.key ) {
                    idx = i;
                    break;
                }  
            }
            if(idx >= 0){
                this.keyDownList.splice(idx, 1);
            }

            //!! Callback
            if(this.callback){
                _updateParams(this.event, event, false);
                this.callback(this.event);
            }
        });

    }// constructor

    //!! Callback
    setCallback(callback) {
        this.callback = callback;
    }

    //!!
    //!! If the "key" is hokded down, it returns true in the period of "time"
    //!!

    /**
     * Returns true if the desired key is pressed
     * @param {string} key  key character
     * @param {number} time timeout
     */
    getKeyDown( key, time ) {
        
        //!! Search in the this.keyDownList
        for( let i=0; i<this.keyDownList.length; i++ ) {
            var keyEvt = this.keyDownList[i];
            if( keyEvt.key === key ) {
                //!! Got it, 

                //!! First time
                if(this.downTicks == 0) {
                    this.downTicks++;
                    return true;
                }

                //!!  Key hold down
                if( time ) {
                    var holdDownTime = Number( performance.now() - keyEvt.timeNew );
                    if( Number(holdDownTime) > Number(time) ) {
                        keyEvt.timeNew = performance.now();
                        return true;  
                    }
                    return false;
                }
                return true;
            }   
        }

        return false;  
    }
}


//!! Helper
function _updateParams(target, event, isDown) {
    target.down     = isDown;
    target.key      = event.key;
    target.keyCode  = event.keyCode;
    target.shift    = event.shiftKey;
    target.ctrl     = event.ctrlKey;
    target.alt      = event.altKey;
    target.repeat   = event.repeat;
    target.target   = event.target;
    target.timeOld  = target.timeNew;
    target.timeNew  = performance.now(); //!! milliseconds
    target.timeDif  = (isDown) ? target.timeNew - target.timeOld : 0;
    target.timeSum  = (isDown) ? target.timeSum + target.timeDif : 0;
}


/**
//!!
//!! Example:
//!!


import Keyboard from './lib/keyboard';
const input = new Keyboard();

setInterval(() =>{
    if( input.getKeyDown( 'w' ) ) {
        
    }
    if( input.getKeyDown( 'a' ) ) {
        
    }
},20);
*/