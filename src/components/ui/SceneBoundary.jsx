import { Component } from 'react'

/**
 * Error boundary for the lazily-loaded 3D scene.
 *
 * Without this, a failed dynamic import — a chunk 404 after a deploy, a stale
 * service worker, a blocked request, or a WebGL context that refuses to create
 * — throws during render and React unmounts the entire tree. The whole site
 * goes blank because of a decorative background.
 *
 * The hero already paints a complete CSS backdrop underneath, so the correct
 * failure mode is simply to render nothing here and let that stand.
 */
export class SceneBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    // Surface it for debugging without breaking the page.
    if (import.meta.env.DEV) {
      console.warn('[G10X] 3D hero scene disabled after an error:', error)
    }
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}
