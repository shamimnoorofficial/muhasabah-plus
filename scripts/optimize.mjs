/* Deploy-time optimisation: minify the app's scripts and styles in place on the build
 * machine so visitors download and parse less. The repository keeps readable sources.
 * If esbuild is unavailable, the original files are deployed unchanged. */
import { readFile, writeFile, readdir } from "node:fs/promises";

let esbuild;
try { esbuild = await import("esbuild"); } catch { console.log("optimize: esbuild missing, skipping"); process.exit(0); }

const files = ["assets/app.js", "assets/app.css", "sw.js"];
for (const f of await readdir("pwa")) if (/\.(js|css)$/.test(f)) files.push("pwa/" + f);

let before = 0, after = 0;
for (const file of files) {
  try {
    const src = await readFile(file, "utf8");
    const loader = file.endsWith(".css") ? "css" : "js";
    const opts = { loader, minify: true, legalComments: "none", charset: "utf8", target: loader === "css" ? ["chrome90", "safari14"] : "es2022" };
    if (file === "assets/app.js") opts.format = "esm";
    const { code } = await esbuild.transform(src, opts);
    await writeFile(file, code);
    before += Buffer.byteLength(src); after += Buffer.byteLength(code);
  } catch (e) {
    console.log(`optimize: kept ${file} unminified (${e.message.split("\n")[0]})`);
  }
}
console.log(`optimize: ${files.length} files, ${(before / 1024) | 0} KB → ${(after / 1024) | 0} KB`);
