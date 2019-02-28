
import { Engine, Keyboard, Options, THREE } from './libs/ecc-cgp-engine';

var EquirectangularToCubemap = require( 'three.equirectangular-to-cubemap' );

Options.graphics.sceneType = 'env';
Options.physics.enabled = false;

const input  = new Keyboard();
const engine = new Engine();

const options = {
    envPath:    './images/Bridge2',
    //modelFiles: ['./models/scene.gltf', './models/cube.gltf', './models/cube_flower.gltf'],
    modelFiles: ['./models/cube.gltf'],
}

engine.init(options).then( ( args ) => {
    userInit( args );
    engine.start( callback );
});



function userInit(args) {

    var loader = new THREE.TextureLoader();

    loader.load('./images/pano.jpg', function (res) {

        // once it's loaded, create the helper and use it

        var equiToCube = new EquirectangularToCubemap(engine.graphics.renderer);

        // convert the image, in this case it's been used as environment map

        var cubeTexture = equiToCube.convert(res, 1024);
        const sphere = new THREE.Mesh(
            new THREE.IcosahedronGeometry( 200, 5 ),
            new THREE.MeshBasicMaterial( { map: res, side: THREE.BackSide, depthWrite: false } )
        );
        engine.graphics.scene.add( sphere );

        // const mesh = new THREE.Mesh(
        //     new THREE.TorusKnotGeometry(3, 5, 100, 32),
        //     new THREE.MeshBasicMaterial({ envMap: equiToCube.convert(res, 1024) })
        // );
        // mesh.position.y = 4;
        // engine.graphics.scene.add(mesh);

    });
}

function callback() {

    if( input.getKeyDown('x') ) {
        console.clear();
        console.log(engine.graphics.scene);
    }
}

