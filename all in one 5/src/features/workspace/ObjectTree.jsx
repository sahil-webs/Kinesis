import { useMemo, useState } from 'react';
import { Box, ChevronDown, ChevronRight, Eye, EyeOff, FolderTree, Layers3, Search } from 'lucide-react';

function countMeshes(node) {
  if (!node) return 0;
  return Number(node.isSelectable ?? node.isMesh) + (node.children || []).reduce((count, child) => count + countMeshes(child), 0);
}

function filterTree(node, query) {
  if (!node) return null;
  const children = (node.children || [])
    .map((child) => filterTree(child, query))
    .filter(Boolean);
  if (node.name.toLowerCase().includes(query) || children.length) return { ...node, children };
  return null;
}

function TreeNode({ node, depth, selectedUuid, onSelect, onToggleVisibility, collapsed, onToggleExpanded, filterActive }) {
  const children = node.children || [];
  const hasChildren = children.length > 0;
  const isSelectable = node.isSelectable ?? node.isMesh;
  const isSelected = node.uuid === selectedUuid;
  const isExpanded = filterActive || !collapsed.has(node.uuid);
  const Icon = isSelectable ? Box : Layers3;

  return (
    <div className="tree-node">
      <div
        className={`tree-row${isSelected ? ' tree-row--selected' : ''}${isSelectable ? ' tree-row--mesh' : ''}${node.visible === false ? ' tree-row--hidden' : ''}`}
        style={{ '--tree-depth': depth }}
      >
        <button
          className="tree-row__disclosure"
          type="button"
          tabIndex={hasChildren ? 0 : -1}
          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${node.name}`}
          aria-hidden={!hasChildren}
          disabled={!hasChildren || filterActive}
          onClick={() => onToggleExpanded(node.uuid)}
        >
          {hasChildren ? (isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />) : <span />}
        </button>
        <button
          className="tree-row__select"
          type="button"
          disabled={!isSelectable}
          onClick={() => isSelectable && onSelect(node.uuid)}
          title={isSelectable ? `Select ${node.name}` : node.name}
        >
          <Icon className={`tree-row__icon${isSelectable ? ' tree-row__icon--part' : ' tree-row__icon--folder'}`} size={14} />
          <span className="tree-row__label">{node.name}</span>
        </button>
        <button
          className="tree-row__visibility"
          type="button"
          onClick={() => onToggleVisibility(node.uuid, node.visible === false)}
          aria-label={`${node.visible === false ? 'Show' : 'Hide'} ${node.name}`}
          title={`${node.visible === false ? 'Show' : 'Hide'} ${node.name}`}
        >
          {node.visible === false ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      </div>
      {hasChildren && isExpanded && (
        <div className="tree-children">
          {children.map((child) => (
            <TreeNode
              key={child.uuid}
              node={child}
              depth={depth + 1}
              selectedUuid={selectedUuid}
              onSelect={onSelect}
              onToggleVisibility={onToggleVisibility}
              collapsed={collapsed}
              onToggleExpanded={onToggleExpanded}
              filterActive={filterActive}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ObjectTree({ tree, selectedUuid, onSelect, onToggleVisibility }) {
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState(() => new Set());
  const filteredTree = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized ? filterTree(tree, normalized) : tree;
  }, [tree, query]);
  const partCount = countMeshes(tree);
  const filterActive = !!query.trim();

  const toggleExpanded = (uuid) => {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(uuid)) next.delete(uuid);
      else next.add(uuid);
      return next;
    });
  };

  const setTreeExpanded = (expanded) => {
    const allCollapsed = new Set();
    if (!expanded && tree) {
      const visit = (node) => {
        if (node.children?.length) {
          allCollapsed.add(node.uuid);
          node.children.forEach(visit);
        }
      };
      visit(tree);
    }
    setCollapsed(allCollapsed);
  };

  return (
    <aside className="panel object-explorer" aria-label="Object explorer">
      <div className="panel__header object-explorer__header">
        <span><FolderTree size={15} /> Object Explorer</span>
        <span className="object-explorer__count">{partCount} {partCount === 1 ? 'PART' : 'PARTS'}</span>
      </div>
      <div className="object-explorer__tools">
        <label className="object-explorer__search">
          <Search size={14} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find an object..."
            aria-label="Search objects"
          />
          {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
        </label>
        <div className="object-explorer__actions">
          <span>{tree ? 'ASSEMBLY' : 'SCENE'}</span>
          <div>
            <button type="button" disabled={!tree} onClick={() => setTreeExpanded(true)} title="Expand all" aria-label="Expand all">
              <ChevronDown size={14} />
            </button>
            <button type="button" disabled={!tree} onClick={() => setTreeExpanded(false)} title="Collapse all" aria-label="Collapse all">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
      <div className="panel__body object-explorer__body">
        {filteredTree ? (
          <TreeNode
            node={filteredTree}
            depth={0}
            selectedUuid={selectedUuid}
            onSelect={onSelect}
            onToggleVisibility={onToggleVisibility}
            collapsed={collapsed}
            onToggleExpanded={toggleExpanded}
            filterActive={filterActive}
          />
        ) : tree ? (
          <div className="panel__empty object-explorer__empty">No objects match “{query}”.</div>
        ) : (
          <div className="panel__empty object-explorer__empty">
            <Layers3 size={24} />
            <strong>Your scene is ready</strong>
            <span>Import a 3D file or choose an assembly from the top bar to start exploring.</span>
          </div>
        )}
      </div>
      <div className="object-explorer__footer">
        <span className="object-explorer__legend-dot" /> 3D SCENE
        <span className="object-explorer__footer-meta">{partCount} items</span>
      </div>
    </aside>
  );
}
