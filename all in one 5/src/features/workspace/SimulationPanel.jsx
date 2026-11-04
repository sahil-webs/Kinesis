import { Activity, RefreshCw, Waves } from 'lucide-react';

export default function SimulationPanel({ simulation, heatmap, onToggleHeatmap, onRefresh }) {
  const stressIndex = Number(simulation?.stressIndex);
  const stressProgress = Number.isFinite(stressIndex) ? Math.min(100, Math.max(0, stressIndex)) : 0;
  const safetyClass = simulation?.safety || 'none';

  return (
    <aside className="simulation-panel">
      <div className="simulation-panel__header">
        <div>
          <div className="simulation-panel__title"><Activity size={15} /> Live Simulation</div>
          <div className="simulation-panel__sub">Phase 4 · instant engineering feedback</div>
        </div>
        <span className={`sim-status ${simulation?.hasModel ? 'sim-status--live' : ''}`}><span />{simulation?.hasModel ? 'LIVE' : 'IDLE'}</span>
      </div>
      <div className="sim-metrics">
        <div className="sim-metric"><span>Estimated Mass</span><strong>{simulation?.massKg ?? '—'} <small>kg</small></strong></div>
        <div className="sim-metric sim-metric--stress">
          <div className="sim-metric__label"><span>Stress Index</span><Waves size={13} /></div>
          <strong>{simulation?.stressIndex ?? '—'} <small>/100</small></strong>
          <div className={`stress-meter stress-meter--${safetyClass}`} role="progressbar" aria-label="Stress index" aria-valuenow={stressProgress} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: `${stressProgress}%` }} />
          </div>
        </div>
        <div className="sim-metric"><span>Max Stress</span><strong>{simulation?.maxStress ?? '—'} <small>MPa*</small></strong></div>
        <div className="sim-metric"><span>Safety</span><strong className={`safety safety--${simulation?.safety || 'none'}`}>{simulation?.safetyLabel || 'No model'}</strong></div>
      </div>
      <div className="sim-controls">
        <button className={`btn btn--tool${heatmap ? ' btn--tool-active' : ''}`} disabled={!simulation?.hasModel} onClick={() => onToggleHeatmap(!heatmap)}>
          {heatmap ? 'Hide Stress Heatmap' : 'Show Stress Heatmap'}
        </button>
        <button className="btn btn--ghost" disabled={!simulation?.hasModel} onClick={onRefresh}><RefreshCw size={13} /> Recalculate</button>
      </div>
      <div className="sim-legend"><span className="legend-low" /> Low stress <span className="legend-mid" /> Medium <span className="legend-high" /> High</div>
      <div className="sim-note">*Simplified proxy calculation for project/demo feedback, not a certified FEA result. Assumes 1 model unit = 1 mm.</div>
    </aside>
  );
}
