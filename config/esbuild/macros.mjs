import { readFile, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';
import macros from 'unplugin-parcel-macros';

build({
    allowOverwrite: true,
    entryPoints: ['build/es2019/**/*.js'],
    outdir: 'build/es2019',
    plugins: [
        {
            name: 'copy-macros',
            setup({ onEnd, onLoad, onStart }) {
                const paths = [];

                onEnd(() =>
                    Promise.all(paths.map((path) => readFile(path).then((buffer) => writeFile(`${path.slice(0, -2)}mjs`, buffer)))).then(
                        () => null
                    )
                );
                onLoad({ filter: /.js$/ }, ({ path }) => {
                    if (path.endsWith('.macro.js')) {
                        paths.push(path);
                    }

                    return readFile(path, { encoding: 'utf8' }).then((source) => ({
                        contents: source.replaceAll(".macro' with { type: 'macro' };", ".macro.mjs' with { type: 'macro' };"),
                        loader: 'js'
                    }));
                });
                onStart(() => {
                    paths.length = 0;
                });
            }
        }
    ]
}).then(() =>
    build({
        allowOverwrite: true,
        entryPoints: ['build/es2019/**/*.js'],
        outdir: 'build/es2019',
        plugins: [macros.esbuild()]
    })
);
