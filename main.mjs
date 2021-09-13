import { rollup } from "rollup";
import babel from "@babel/core";
import webpack from "webpack";
import * as esbuild from "esbuild";
import { babel as rollupBabel } from "@rollup/plugin-babel";
import { build, createConfiguration } from "snowpack";

import path from "path";
import process from "process";
import fs from "fs/promises";

const filePath = path.join(process.cwd(), "src/rollup.js");
// const cjsFilePath = path.join(process.cwd(), "src/angular.js");

// -------------rollup---------------

async function buildRollup(fp) {
  // const outputOptions = {
  //   file: `dist/${path.basename(fp)}`,
  //   chunkFileNames: 'common/[name]-[hash].js',
  //   // format: "esm",
  // };
  console.log("> start rollup\n");
  const startTime = Date.now();
  // create a bundle
  const bundle = await rollup({
    input: fp,
    plugins: [rollupBabel()],
  });

  // generate code and a sourcemap
  // const { code, map } = await bundle.generate();

  // or write the bundle to disk

  // await bundle.write(outputOptions);
  const endTime = Date.now();
  console.log(`> buildRollup: ${endTime - startTime}ms\n`);
}
// console.log('> esm')
await buildRollup(filePath);

// -------------------webpack----
function buildWebpack() {
  console.log("> start Webpack\n");
  const startTime = Date.now();
  return new Promise((resolve, reject) => {
    webpack(
      {
        mode: "development",
        entry: filePath,
        output: {
          // library: {
          //   // do not specify a `name` here
          //   type: 'module',
          // },
        },
        // experiments: {
        //   // 支持输出模块
        //   outputModule: true,
        // }
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                // options: {
                //   presets: [
                //     ['@babel/preset-env', { targets: "defaults" }]
                //   ]
                // }
              },
            },
          ],
        },
      },
      (err, stat) => {
        if (err) {
          reject(err);
        }
        const endTime = Date.now();
        console.log(`> buildWebpack: ${endTime - startTime}ms\n`);
        resolve();
      }
    );
  });
}

await buildWebpack();
// --------------babel----------
async function buildBabel() {
  console.log("> start babel\n");
  const startTime = Date.now();
  const { code, map } = await babel.transformFileAsync(filePath);
  const endTime = Date.now();
  console.log(`> buildBabel: ${endTime - startTime}ms\n`);
}

await buildBabel();

// ---------------esbuild-------

async function buildEsbuild() {
  console.log("> start esbuild\n");
  const startTime = Date.now();
  let contents = await fs.readFile(filePath, "utf8");
  const { code, map } = await esbuild.transform(contents, {
    loader: "js",
    // jsxFactory: 'h',
    // jsxFragment: 'Fragment',
    sourcefile: filePath,
    // sourcemap: config.buildOptions.sourcemap && "inline",
    charset: "utf8",
    // sourcesContent: config.mode !== "production",
  });
  const endTime = Date.now();
  console.log(`> esbuild: ${endTime - startTime}ms`);
  // console.log(code);
}

await buildEsbuild();
// -------------snowpack

const config = createConfiguration({
  mode: "development",
  mount: {
    src: filePath,
  },
  packageOptions: {
    external: ['path', 'fs', 'util', 'crypto', 'module', 'events'],
  },
  plugins: ['@snowpack/plugin-babel']
});
const { result } = await build({ config });
