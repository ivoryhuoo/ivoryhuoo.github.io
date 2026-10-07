import { useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { World } from './world/World';
import { Hud } from './ui/Hud';
import { ZoomControls } from './ui/ZoomControls';
import { EnterPrompt } from './ui/EnterPrompt';
import { BuildingPanel } from './ui/BuildingPanel';
import { Minimap } from './ui/Minimap';
import { QuickView } from './ui/QuickView';
import { useWorld } from './state/useWorld';

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Keep #quick in the URL in sync, so the quick view can be shared as a link. */
function useQuickViewHash() {
  const quickView = useWorld((s) => s.quickView);
  const setQuickView = useWorld((s) => s.setQuickView);
  useEffect(() => {
    if (window.location.hash === '#quick') setQuickView(true);
  }, [setQuickView]);
  useEffect(() => {
    const url = window.location.pathname + window.location.search + (quickView ? '#quick' : '');
    window.history.replaceState(null, '', url);
  }, [quickView]);
}

export default function App() {
  const webgl = useMemo(hasWebGL, []);
  const quickView = useWorld((s) => s.quickView);
  useQuickViewHash();

  if (!webgl) return <QuickView forced />;

  return (
    <>
      <div className="world" aria-label="A brick-built town. Each building is a section of Ivory's portfolio.">
        <Canvas
          shadows
          dpr={[1, 2]}
          frameloop={quickView ? 'never' : 'always'}
          camera={{ fov: 40, near: 0.1, far: 400, position: [0, 50, 84] }}
        >
          <World />
        </Canvas>
      </div>
      <Hud />
      <ZoomControls />
      <Minimap />
      <EnterPrompt />
      <BuildingPanel />
      <QuickView />
    </>
  );
}
