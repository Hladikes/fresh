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

import ComponentGallery from "./islands/ComponentGallery.tsx";
import CopyArea from "./islands/CopyArea.tsx";
import Counter from "./islands/Counter.tsx";
import LemonDrop from "./islands/LemonDrop.tsx";
import SearchButton from "./islands/SearchButton.tsx";

// await start(manifest, { plugins: [twindPlugin(twindConfig)] });
await start(manifest, { 
  plugins: [
    UnoCSS([
      ComponentGallery,
      CopyArea,
      Counter,
      LemonDrop,
      SearchButton
    ])
  ] 
});
