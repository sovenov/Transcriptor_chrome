// Build extension into dist/: bundle JS and copy static assets.
import * as esbuild from "esbuild";
import { cp, mkdir, rm } from "node:fs/promises";

const OUT = "dist";
const watch = process.argv.includes("--watch");

async function clean() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });
}

async function copyStatic() {
  await cp("public", OUT, { recursive: true });
  await cp("dino_Transcriptor.png", `${OUT}/dino_Transcriptor.png`);
}

const buildOptions = {
  entryPoints: ["src/background.js", "src/sidepanel.js", "src/mic-permission.js"],
  outdir: OUT,
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "chrome120",
  logLevel: "info",
  legalComments: "none",
};

async function run() {
  await clean();
  await copyStatic();

  if (watch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log("esbuild: watching...");
  } else {
    await esbuild.build(buildOptions);
    console.log("Build completed -> dist/ (load as unpacked extension)");
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
