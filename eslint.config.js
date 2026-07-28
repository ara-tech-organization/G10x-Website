import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'scripts']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    /**
     * React Three Fiber scene graph.
     *
     * `useFrame` callbacks run on the render loop's rAF tick, not during React
     * render, so imperatively mutating a memoised Object3D / camera / instance
     * matrix in there is the framework's intended API — not a purity violation.
     * The compiler-aware rules cannot distinguish the two call sites, so they
     * are scoped off here rather than suppressed file-by-file.
     *
     * `Math.random()` inside `useMemo` is likewise deliberate: it seeds a
     * particle layout exactly once and must stay stable across re-renders.
     */
    files: ['src/components/three/**/*.{js,jsx}'],
    rules: {
      'react-hooks/immutability': 'off',
      'react-hooks/purity': 'off',
    },
  },
])
