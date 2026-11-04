import { Box, CarFront, Glasses, Hand, Sparkles, Upload } from 'lucide-react';

const GESTURE_STATUS_LABEL = {
  idle: 'Gesture: off',
  connecting: 'Gesture: connecting…',
  connected: 'Gesture: connected',
  disconnected: 'Gesture: relay offline',
};

export default function Toolbar({
  onLoadFile,
  onLoadSample,
  onLoadCar,
  modelName,
  gestureStatus,
  activeGesture,
  gestureEnabled,
  onToggleGesture,
  onEnterVR,
  onToggleAR,
  arActive,
  hasModel,
}) {
  return (
    <div className="toolbar">
      <div className="toolbar__identity">
        <div className="toolbar__brand"><span className="toolbar__brand-mark"><Box size={17} /></span>KINESIS</div>
        <div className="toolbar__breadcrumb">
          <span>Workspace</span>
          <span className="toolbar__breadcrumb-divider">/</span>
          <strong title={modelName || 'Untitled workspace'}>{modelName || 'Untitled workspace'}</strong>
        </div>
      </div>
      <div className="toolbar__actions">
        {gestureEnabled ? (
          <button
            className={`gesture-pill gesture-pill--${gestureStatus}`}
            onClick={onToggleGesture}
            title="Click to turn off gesture control"
          >
            <Hand size={14} />
            {GESTURE_STATUS_LABEL[gestureStatus] || gestureStatus}
            {gestureStatus === 'connected' && activeGesture && activeGesture !== 'NONE' && (
              <em>{activeGesture}</em>
            )}
          </button>
        ) : (
          <button className="btn btn--ghost" onClick={onToggleGesture} title="Connect hand gesture controls">
            <Hand size={14} />
            Enable Gestures
          </button>
        )}
        <button className="btn btn--ghost" onClick={onEnterVR} title="Enter VR on Quest 3S">
          <Glasses size={15} /> Quest 3S
        </button>
        <button
          className="btn btn--ghost"
          onClick={onToggleAR}
          disabled={!hasModel && !arActive}
          title={!hasModel && !arActive ? 'Load a model first' : 'Start an AR session on this phone'}
        >
          <Sparkles size={14} /> {arActive ? 'Exit AR' : 'AR'}
        </button>
        <div className="toolbar__load-group" aria-label="Load example models">
          <button className="btn btn--ghost" onClick={onLoadSample} title="Load the sample assembly">
            <Box size={14} /> Sample
          </button>
          <button className="btn btn--ghost" onClick={onLoadCar} title="Load the car assembly">
            <CarFront size={15} /> Car
          </button>
        </div>
        <label className="btn btn--accent toolbar__import" title="Import an OBJ, STL, DXF or DWG file">
          <Upload size={15} />
          Import Model
          <input
            type="file"
            accept=".obj,.stl,.dxf,.dwg"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onLoadFile(file);
              e.target.value = '';
            }}
          />
        </label>
      </div>
    </div>
  );
}
