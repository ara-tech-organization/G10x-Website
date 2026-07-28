import CountUpModule from 'react-countup'

/**
 * `react-countup` is CJS-only: its package.json declares `main: "build"` with
 * no `module` or `exports` field. Bundler interop therefore differs — under
 * Vite's dependency pre-bundling the default import arrives double-wrapped as
 * `{ default: Component }` rather than the component itself, and rendering that
 * object throws "Element type is invalid", which unmounts the whole tree.
 *
 * Normalising once here keeps the workaround in a single documented place
 * instead of every call site, and works whichever shape the bundler produces.
 */
export const CountUp = CountUpModule?.default ?? CountUpModule
