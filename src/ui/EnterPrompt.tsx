import { getBuilding } from '../data/buildings';
import { useWorld } from '../state/useWorld';

export function EnterPrompt() {
  const nearby = useWorld((s) => s.nearby);
  const open = useWorld((s) => s.open);
  const openBuilding = useWorld((s) => s.openBuilding);
  const riding = useWorld((s) => s.riding);
  const show = !!nearby && !open && !riding;

  return (
    <button
      className={`enter${show ? ' show' : ''}`}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      onClick={() => nearby && openBuilding(nearby)}
    >
      {nearby ? getBuilding(nearby).prompt : ''}
      <kbd>E</kbd>
    </button>
  );
}
