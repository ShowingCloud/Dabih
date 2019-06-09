/*!
 * Font Awesome Free 5.8.2 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */
let _WINDOW = {};

try {
  if (typeof window !== 'undefined') _WINDOW = window;
} catch (e) { /* empty block statement */ }

const WINDOW = _WINDOW;

const NAMESPACE_IDENTIFIER = '___FONT_AWESOME___';
const PRODUCTION = (() => (true));

function bunker(fn) {
  try {
    fn();
  } catch (e) {
    if (!PRODUCTION) {
      throw e;
    }
  }
}

function _defineProperty(o, key, value) {
  const obj = o;
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target, ...args) {
  [target, ...args].forEach((i) => {
    const source = args[i] != null ? args[i] : {};
    let ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(sym => Object.getOwnPropertyDescriptor(source, sym).enumerable));
    }

    ownKeys.forEach((key) => {
      _defineProperty(target, key, source[key]);
    });
  });

  return target;
}

const w = WINDOW || {};
if (!w[NAMESPACE_IDENTIFIER]) w[NAMESPACE_IDENTIFIER] = {};
if (!w[NAMESPACE_IDENTIFIER].styles) w[NAMESPACE_IDENTIFIER].styles = {};
if (!w[NAMESPACE_IDENTIFIER].hooks) w[NAMESPACE_IDENTIFIER].hooks = {};
if (!w[NAMESPACE_IDENTIFIER].shims) w[NAMESPACE_IDENTIFIER].shims = [];
const namespace = w[NAMESPACE_IDENTIFIER];

function defineIcons(prefix, icons, ...args) {
  const params = [prefix, icons, ...args].length > 2 && args;
  const _params$skipHooks = params.skipHooks;
  const skipHooks = _params$skipHooks === undefined ? false : _params$skipHooks;
  const normalized = Object.keys(icons).reduce((acc, iconName) => {
    const icon = icons[iconName];
    const expanded = !!icon.icon;

    if (expanded) {
      acc[icon.iconName] = icon.icon;
    } else {
      acc[iconName] = icon;
    }

    return acc;
  }, {});

  if (typeof namespace.hooks.addPack === 'function' && !skipHooks) {
    namespace.hooks.addPack(prefix, normalized);
  } else {
    namespace.styles[prefix] = _objectSpread({}, namespace.styles[prefix] || {}, normalized);
  }
  /**
   * Font Awesome 4 used the prefix of `fa` for all icons. With the introduction
   * of new styles we needed to differentiate between them. Prefix `fa` is now an alias
   * for `fas` so we'll easy the upgrade process for our users by automatically defining
   * this as well.
   */


  if (prefix === 'fas') {
    defineIcons('fa', icons);
  }
}

const icons = {
  dingtalk: [56, 56, [], 'ff04', 'm14 0c-7.7 0-14 6.3-14 14v28c0 7.7 6.3 14 14 14h28c7.7 0 14-6.3 14-14v-28c0-7.7-6.3-14-14-14h-28zm-2.0059 7.1816c0.062695-0.011719 0.13008-0.0074219 0.20508 0.017578 2.3 0.9 5.2016 2.3016 10.602 4.6016 7 3 14.198 5.1992 17.898 6.6992 3.2 1.3 4.4012 3.1992 3.7012 4.6992-0.8 1.8-3.1004 5.9016-6.9004 12.102h5.4004l-10.4 13.6 2.3008-9.2012h-4.2012c0.7-3 1.2-4.9996 1.5-6.0996-3.2 0.8-4.6992 1.5004-5.6992 1.4004-1.3-0.1-3.4012-1.2004-5.2012-2.9004-1.6-1.5-1.8996-2.6-1.0996-3 0.6-0.3 4.0008-0.79961 10.301-1.5996h-10.201c-3.4 0-5.5996-5.0004-6.0996-6.4004-0.6-1.7-3.9e-4 -1.8988 0.59961-1.7988 0.7 0.1 5.8012 1.1988 15.201 3.2988-7-2-12.2-3.9-15.6-5.5-0.6-0.3-2.4008-4.1996-2.8008-8.5996-0.0875-0.35 0.055273-1.2363 0.49414-1.3184z'],
  eleme: [300, 300, [], 'ff03', 'm195.9 207.04c-1.9204 1.5363-3.8408 2.6885-5.7611 4.2248-33.799 21.892-79.504 12.29-101.4-21.508-21.892-33.799-12.29-79.12 21.508-101.01 33.799-21.892 79.504-12.29 101.4 21.508 1.1522 1.9204 2.3045 3.8408 3.4567 5.7611 0.76815 1.9204 0.38408 4.2248-1.5363 4.993l-68.365 44.553c-1.9204 1.1522-4.2248 0.76815-5.7611-1.1522l-3.4567-5.3771c-3.0726-4.993-1.9204-11.522 3.0726-14.595l43.785-28.422c1.9204-1.1522 2.3045-3.8408 1.1522-5.7611-0.38408-0.38408-0.38408-0.76815-0.76815-0.76815-17.283-13.827-41.864-16.131-61.452-3.4567-24.197 15.747-31.11 48.009-15.363 71.822 15.747 24.197 48.009 31.11 72.206 15.363 4.993-3.0726 11.522-1.5363 14.595 3.0726l3.4567 5.3771c1.1522 1.9204 0.76815 4.2248-0.76815 5.3771zm22.323-35.289-6.9134 4.6089c-1.9204 1.1522-4.2248 0.76815-5.7611-1.1522l-8.8337-13.827c-1.1522-1.9204-0.76815-4.2248 1.1522-5.7611l13.827-8.8337c1.9204-1.1522 4.2248-0.76815 5.7611 1.1522l4.6089 6.9134c3.4567 5.7611 1.5363 13.443-3.8408 16.899z'],
  // "meituan": [100, 100, [], "ff01", "m31.652 52.068c-0.0053 0.49342-0.0756 1.1507-0.23633 1.8809h-12.92v3.2539h11.611c-0.88827 1.4202-2.243 2.7324-4.2812 3.4668-4.454 1.596-7.1218 1.5718-7.5918 1.5898v3.502c1.152 0 5.8642-0.56892 9.7852-2.2949 2.7809-1.2294 4.5187-2.9524 5.6152-4.7266 1.1533 1.5312 2.8582 3.3327 5.4707 4.7246 4.637 2.473 9.9082 2.2871 9.9082 2.2871v-3.418s-2.6602 0.30948-7.8262-1.6035c-1.9653-0.7283-3.4049-2.1623-4.4238-3.5273h11.979v-3.2539h-13.434c0.09741-0.72638 0.14258-1.3873 0.14258-1.8809zm-7.3438-17.643 0.6875 1.1289 1.5254 2.5234h-7.4863v3.1211h12.773v2.0352h-11.148v3.1191h11.148v2.0352h-13.312v3.1191h30.246v-3.1191h-13.314v-2.0352h11.145v-3.1191h-11.145v-2.0352h12.771v-3.1211h-7.4395l1.5293-2.5234 0.68359-1.1289h-2.5371c-0.715 0-1.3457 0.35534-1.7207 0.90234l-1.6621 2.75h-6.8242l-1.6602-2.75c-0.38-0.547-1.0038-0.90234-1.7188-0.90234zm28.922 0.56055v30.777h25.447c1.685 0 3.0449-1.362 3.0449-3.041v-27.736zm3.4336 3.7051h21.621v22.359c0 0.556-0.44695 1.0039-1.002 1.0039h-20.619zm13.424 1.123v3.6719h-12.303v3.2539h10.873l-9.1855 8.0137v4.4688l10.615-9.2617v7.3067c-6e-3 0.274-0.22691 0.49414-0.50391 0.49414h-4.2832v3.1738h5.9766v-2e-3c1.137-0.025 2.0445-0.93245 2.0625-2.0645h0.0039v-12.129h3.8457v-3.2539h-3.8457v-3.6719zm-19.75-38.143c-9.488 0.00325-18.976 0.017203-28.467 0.033203-3.673 2e-3 -7.147 0.9597-10.25 2.9707-6.115 3.973-9.2077 9.6706-9.2637 16.932-0.063 7.847-0.031766 15.688-0.00977 23.529-0.023 10.866-0.029297 21.728-0.029297 32.611 0 1.041 0.063703 2.0969 0.2207 3.1309 1.493 9.649 9.5686 16.732 19.309 16.764 18.974 0.056 37.955 0.03691 56.932 0.0039 3.679-4e-3 7.149-0.96056 10.248-2.9766 6.11-3.968 9.2123-9.6689 9.2773-16.922 0.057-7.849 0.02386-15.694 0.0059-23.529 0.019-10.875 0.02148-21.74 0.02148-32.611 0-1.044-0.0557-2.1038-0.2207-3.1328-1.493-9.649-9.5616-16.74-19.309-16.77-9.488-0.029-18.977-0.036453-28.465-0.033203zm-0.01172 8.084a39.92 39.92 0 0 1 39.92 39.92 39.92 39.92 0 0 1-39.92 39.92 39.92 39.92 0 0 1-39.92-39.92 39.92 39.92 0 0 1 39.92-39.92z"],
  meituan: [100, 100, [], 'ff01', 'm50.34 1.3496c-9.5505 0.0035-19.101 0.018656-28.656 0.035156-3.699 0-7.1954 0.96419-10.318 2.9922-6.156 3.997-9.2731 9.735-9.3301 17.043l-0.035156 56.514c0 1.05 0.064656 2.1143 0.22266 3.1543 1.502 9.714 9.6305 16.846 19.439 16.877 19.101 0.058 38.204 0.035953 57.307 0.001953 3.703-2e-3 7.1964-0.96614 10.318-2.9941 6.155-3.993 9.274-9.7351 9.334-17.039 0.061-7.901 0.026859-15.798 0.005859-23.688 0.021-10.947 0.023438-21.884 0.023438-32.826 0-1.051-0.056657-2.1182-0.22266-3.1582-1.503-9.711-9.6225-16.847-19.436-16.877-9.5515-0.0305-19.102-0.038656-28.652-0.035156zm-7.0723 10.469c0.41268-0.005757 0.83 0.010125 1.25 0.046875 6.72 0.588 11.693 6.5134 11.104 13.234-0.588 6.722-6.5114 11.693-13.232 11.105-6.72-0.588-11.693-6.5134-11.104-13.234 0.55125-6.3019 5.7922-11.066 11.982-11.152zm28.012 6.2344c0.582 2.713 0.77548 5.5568 0.52148 8.4648-0.677 7.74-4.3922 14.483-9.8652 19.16 12.641 1.754 22.619 10.902 25.916 22.635l0.03125-0.007812 0.83398 2.9805-10.693 2.8223-0.75195-2.7578-0.007812 0.001953c-2.991-10.79-14.123-17.175-24.959-14.27-10.816 2.898-17.261 13.961-14.494 24.783l0.78906 2.998-10.693 2.8223-0.79492-3.0957 0.017578-0.003906c-0.853-3.342-1.1696-6.8817-0.85156-10.514 0.792-9.052 5.3473-16.869 11.986-22.049-10.48-1.931-18.761-9.515-21.904-19.252l10.422-2.793c2.254 6.313 8.011 11.066 15.125 11.689 9.735 0.852 18.317-6.3528 19.168-16.09 0.142-1.62 0.056343-3.2045-0.22266-4.7305l10.428-2.7949z'],
  showingcloud: [512, 512, [], 'ff00', 'm219.32 381.66c-58.246-4.8164-90.602-10.641-127.38-22.93-14.293-4.7734-25.395-9.2734-36.125-14.637-14.125-7.0625-22.73-12.828-30.781-20.621-12.191-11.805-17.5-23.395-17.496-38.203 0.007813-18.5 6.8672-32.34 24.629-49.688 10.367-10.125 18.531-15.359 35.164-22.535 30.785-14.887 29.793-15.371 30.27-41.719 0.17969-10.262 0.53906-20.395 0.79688-22.516 1.1719-9.6367 3.8164-19.469 7.207-26.777 12.297-26.52 47.609-50.824 82.473-56.766 26.02-2.0469 52.816-3.8398 78.227 4.293 15.109 4.9844 32.609 14.223 44.699 23.602 6.3242 4.9023 15.77 15.031 24.062 25.801 14.59 18.945 22.305 27.672 31.488 35.625 10.988 9.5117 13.594 10.324 49.73 15.52 23.145 3.3242 27.633 4.3555 35.375 8.125 12.262 5.9688 25.277 19.352 32.191 33.098 10.727 21.32 8.9453 44.188-5.7188 73.492-10.262 20.512-22.461 33.848-37.332 40.82-4.2734 2.0039-8.4805 3.5273-17.934 6.5-9.4609 2.9766-12.871 5.2773-12.867 8.6836 0.003907 2.9766 1.707 5.0859 5.8789 7.2578 4.9961 2.6016 10.609 4.1836 38.543 10.887 15.797 5.1367 33.02 7.3555 47.875 14.941-22.711 5.5586-46.289 9.7188-69.578 11.996-47.176 2.6328-72.762 2.2344-117.86 2.1758-31.848-2.0625-67.32-4.1016-95.543-6.4258zm197.86-15.621c0.27734-0.83984-6.7305-3.832-21.875-9.332-16.426-5.9688-25.305-10.59-31.836-16.566-12.477-14.047 2.6289-17.754 12.914-21.797 11.73-4.6094 19.758-13.113 27.73-29.359 4-8.1484 6.2031-14.027 7.7539-20.691 2.0156-9.5977 1.3906-19.812-1.8906-28.117-14.008-26.227-26.328-29.898-50.078-33.348-20.133-2.8984-24.305-3.9531-29.617-7.5039-12.305-9.4648-19.898-19.02-28.824-30.223-16.922-21.242-36.059-32.492-62.258-36.59-15.828-1.1367-30.688-2.3125-46.199 0.95312-10.594 2.2539-23.703 8.4531-32.914 15.559-11.453 8.8359-19.387 19.23-23.52 30.824-2.2305 6.25-2.4414 8.2578-2.8281 26.859-0.23047 20.137-3.5859 23.27-20.637 30.117-10.371 4.1211-18.758 9.4688-26.367 16.812-15.09 14.57-20.324 30.82-15.047 46.707 7.0078 21.078 33.594 35 87.184 45.648 40.609 8.0703 127.59 16.395 199.4 19.086 41.645 1.5586 58.613 1.8359 58.906 0.96094zm-244.46-48.746c-11.625-8.168-19.188-21.996-18.637-36.324-0.20313-7.7383 1.7344-15.711 6.4258-21.953 5.9414-2.2383 13.211 4.832 16.543 9.5977 0.76953 6.3086-4.8477 12.594-1.3281 18.895 3.1289 9.9922 13.273 18.062 24.039 15.973 7.2305-1.0195 13.18-6.1328 15.922-12.785 4.5234-7.8984 2.5195-18.102-3.9297-24.305-6.5156-5.7148-12.41-12.484-15.102-20.891-5.3594-15.008-3.2539-33.355 8.2695-45.008 13.973-15.934 40.152-17.859 56.809-5.0234 15.691 11.559 21.637 34.312 13.598 52.066-2.8438 6.418-6.7461 6.4375-12.527 2.1016-7.7656-6.3164-6.4297-10.121-5.0078-18.77 0.96875-6.6445-2.3086-12.938-7.4375-16.977-6.4805-6.3594-16.734-7.1797-24.523-2.8438-9.3828 4.4805-14.891 16.824-9.5859 26.332 5.4961 12.848 20.285 20.531 21.91 35.195 2.9453 15.328-1.4492 32.797-14.258 42.543-8.2773 6.3164-18.93 9.4414-29.266 9.6172-7.8359-0.28906-15.359-3.2656-21.914-7.4414zm105.75 1.625c-20.805-4.5312-35.094-23.102-33.859-44 0.36719-6.1953 2.2734-13.434 4.9062-18.602 4.5703-7.3516 5.3164-6.582 11.766-0.84375 5.6133 4.8125 8.8633 3.8203 6.1133 12.535-1.8125 8.5625-1.8008 18.887 4.7695 24.98 8.1641 7.3398 21.828 7.1992 29.766-0.30859 4.5156-4.2656 6.7578-9.4648 6.793-15.734 0.027343-4.9492-0.94922-8.1562-4.1367-13.621-3.2617-4.3125-1.6367-5.0273 1.4844-8.9258 12.012-15.543 15.02-8.1914 21.891 8.2422 2.0312 5.0508 2.6484 8.4648 2.6211 14.508-0.027344 6.7227-1.1836 11.469-4.3438 17.852-2.6289 5.3086-5.1328 8.7109-9.4219 12.805-8.0742 7.7031-17.43 11.648-28.328 11.945-3.6172 0.26953-6.7734-0.13281-10.02-0.83203z'],
  teambition: [300, 300, [], 'ff02', 'm116 86.031v86.631c0 6.4431 0.62776 12.326 1.8135 17.648s3.348 9.8047 6.4171 13.586c3.069 3.7118 7.1843 6.6532 12.276 8.7542 5.0918 2.101 11.579 3.1515 19.391 3.1515 6.138 0 11.3-0.49024 15.554-1.5407 4.185-0.98046 9.4163-2.4512 12.904-3.8518l-5.859-21.71c-2.7203 0.98047-5.2313 1.6808-8.5096 2.2411s-6.4171 0.8404-9.4861 0.8404c-6.4171 0-10.672-1.7508-12.764-5.3225-2.0925-3.5717-3.1388-8.2639-3.1388-14.217v-33.966h35.712v-24.862h-35.782v-29.414zm150 64.469a115.5 115.5 0 0 1-115.5 115.5 115.5 115.5 0 0 1-115.5-115.5 115.5 115.5 0 0 1 115.5-115.5 115.5 115.5 0 0 1 115.5 115.5z'],
};

bunker(() => {
  defineIcons('fab', icons);
});
