// Original author: https://github.com/ije/html/blob/main/plugins/unocss.ts
import type { Preset, UserConfig } from 'https://esm.sh/@unocss/core@0.46.3';
import { UnoGenerator } from 'https://esm.sh/@unocss/core@0.46.3';
import presetWind from 'https://esm.sh/@unocss/preset-wind@0.46.3?bundle&no-check';
import { Plugin } from '$fresh/server.ts'

const unoResetCSS = `/* reset */
*,:before,:after{box-sizing:border-box;border:0 solid}html{-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;line-height:1.5}body{line-height:inherit;margin:0}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button;background-color:#0000;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{margin:0;padding:0;list-style:none}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}
`;

const defaultUnoConfig: UserConfig = {
  presets: [presetWind() as unknown as Preset],
};
const uno = new UnoGenerator(defaultUnoConfig);

// TODO: use JSXInternal.Element for the input array
export default function UnoPlugin(islands?: Array<(...args: any[]) => any>): Plugin {
  return {
    name: 'UnoCSS',
    async render(ctx) {
      const { htmlText } = ctx.render();

      // While ctx.render function works for the static content, it does not return
      // HTML for the content which is represented with islands, therefore there is
      // no ability to know, what uno classes is each island using.
      // The trick below works by converting each island into a string, which contains
      // the source code of the function. We can then pass this source code into the uno
      // generator, which can read those contents and return CSS styles for the classes
      // used in each island.
      let islandsCSS = '';
      if (Array.isArray(islands)) {
        const islandsContent = islands.map((fn) => fn.toString()).join('\n');
        islandsCSS = await uno.generate(islandsContent).then((r) => r.css);
      }

      const { css } = await uno.generate(htmlText);
      
      return {
        scripts: [],
        styles: [{
          cssText: unoResetCSS + '\n'+ islandsCSS + '\n' + css,
        }],
      };
    }
  }
}
