//import resolve from 'rollup-plugin-node-resolve';
export default {
    input: 'src/libs/EngineCore.js',
    output: {
        file: 'src/libs/EngineCore.all.js',
        format: 'cjs'
    },
    //plugins: [ resolve() ]
};
