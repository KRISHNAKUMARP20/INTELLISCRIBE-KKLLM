import React, { useState, useMemo } from 'react';
import {
  Share2,
  Search,
  Filter,
  Info,
  Layers,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { GraphNode, KnowledgeGraphData } from '../../types';
import { ActiveTab } from '../../store/useAppStore';

interface KnowledgeGraphViewProps {
  graphData: KnowledgeGraphData;
  documentTitle: string;
  setActiveTab: (tab: ActiveTab) => void;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  graphData,
  documentTitle,
  setActiveTab,
}) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(graphData.nodes[0] || null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Position nodes in an orbital circular/force distribution for crisp visual display
  const positionedNodes = useMemo(() => {
    const width = 640;
    const height = 480;
    const centerX = width / 2;
    const centerY = height / 2;
    const total = graphData.nodes.length;

    return graphData.nodes.map((node, idx) => {
      // arrange central node in middle, others in concentric orbits
      if (idx === 0) {
        return { ...node, x: centerX, y: centerY };
      }
      const angle = ((idx - 1) / (total - 1)) * 2 * Math.PI;
      const radius = idx % 2 === 0 ? 160 : 110;
      return {
        ...node,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  }, [graphData.nodes]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, typeof positionedNodes[0]>();
    positionedNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [positionedNodes]);

  const categories = ['All', 'Core Concept', 'Theory', 'Algorithm', 'Application', 'Formula'];

  const filteredNodes = positionedNodes.filter((n) => {
    const matchesCat = filterCategory === 'All' || n.category === filterCategory;
    const matchesSearch =
      n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Core Concept':
        return '#6366F1'; // indigo
      case 'Algorithm':
        return '#06B6D4'; // cyan
      case 'Theory':
        return '#A855F7'; // purple
      case 'Application':
        return '#10B981'; // emerald
      case 'Formula':
        return '#F59E0B'; // amber
      default:
        return '#94A3B8';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
            ONTOLOGY & ENTITY MAPPING
          </span>
          <h1 className="text-2xl font-bold text-white mt-1.5">Interactive Knowledge Graph</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Entity relationships and dependency trees synthesized from "{documentTitle}".
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter nodes..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex flex-wrap items-center gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Interactive Visual Network + Concept Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Network Graph Canvas */}
        <div className="lg:col-span-2 p-4 rounded-3xl bg-slate-950 border border-slate-800 relative flex items-center justify-center min-h-[460px] overflow-hidden">
          <svg viewBox="0 0 640 480" className="w-full h-full max-h-[500px] select-none">
            {/* Edges / Links */}
            {graphData.links.map((link, idx) => {
              const src = nodeMap.get(link.source);
              const tgt = nodeMap.get(link.target);
              if (!src || !tgt) return null;

              const isHighlighted =
                selectedNode &&
                (selectedNode.id === src.id || selectedNode.id === tgt.id);

              return (
                <g key={idx}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isHighlighted ? '#818CF8' : '#334155'}
                    strokeWidth={isHighlighted ? 2.5 : 1.2}
                    strokeDasharray={link.relationship === 'depends on' ? '4,4' : undefined}
                    opacity={isHighlighted ? 1 : 0.6}
                  />
                  {/* Midpoint relation text */}
                  {isHighlighted && (
                    <text
                      x={(src.x! + tgt.x!) / 2}
                      y={(src.y! + tgt.y!) / 2 - 4}
                      fill="#94A3B8"
                      fontSize="9"
                      textAnchor="middle"
                      className="font-mono"
                    >
                      {link.relationship}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {positionedNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isMatch = filteredNodes.some((fn) => fn.id === node.id);
              const color = getCategoryColor(node.category);

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer transition-transform duration-200"
                  style={{ opacity: isMatch ? 1 : 0.25 }}
                >
                  {/* Outer aura if selected */}
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size / 2 + 10}
                      fill={color}
                      opacity={0.25}
                      className="animate-pulse"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size / 2}
                    fill={color}
                    stroke="#0F172A"
                    strokeWidth={2}
                  />

                  {/* Node Label */}
                  <text
                    x={node.x}
                    y={node.y! + node.size / 2 + 14}
                    fill="#F1F5F9"
                    fontSize="10"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textAnchor="middle"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="absolute bottom-3 left-4 text-[10px] text-slate-500 font-mono">
            Click any concept node to inspect definitions & relationships
          </div>
        </div>

        {/* Selected Concept Inspector Drawer */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span
                  className="text-xs font-mono px-2.5 py-0.5 rounded font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${getCategoryColor(selectedNode.category)}20`,
                    color: getCategoryColor(selectedNode.category),
                  }}
                >
                  {selectedNode.category}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">ID: {selectedNode.id}</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{selectedNode.label}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">
                  {selectedNode.description}
                </p>
              </div>

              {/* Related Connections */}
              <div className="pt-2 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Concept Dependencies & Links:
                </div>
                <div className="space-y-1.5">
                  {graphData.links
                    .filter(
                      (l) => l.source === selectedNode.id || l.target === selectedNode.id
                    )
                    .map((link, i) => {
                      const otherId = link.source === selectedNode.id ? link.target : link.source;
                      const otherNode = graphData.nodes.find((n) => n.id === otherId);
                      return (
                        <div
                          key={i}
                          onClick={() => otherNode && setSelectedNode(otherNode)}
                          className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer flex items-center justify-between text-xs"
                        >
                          <span className="text-slate-300 font-medium">{otherNode?.label}</span>
                          <span className="text-[10px] font-mono text-slate-500">{link.relationship}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 text-xs py-12">
              Select any node from the visual graph to inspect its properties.
            </div>
          )}

          {/* Direct Study Actions */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={() => setActiveTab('flashcards')}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Practice Concept Flashcards
            </button>
            <button
              onClick={() => setActiveTab('ai-tutor')}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-600/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ask AI Tutor About This
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
