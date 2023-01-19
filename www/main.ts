/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { start } from "$fresh/server.ts";
import twindPlugin from "$fresh/plugins/twind.ts";

import manifest from "./fresh.gen.ts";
import twindConfig from "./twind.config.ts";

import UnoCSS from "$fresh/plugins/unocss.ts"

// await start(manifest, { plugins: [twindPlugin(twindConfig)] });
await start(manifest, { plugins: [UnoCSS] });
