import { motion } from 'framer-motion';

interface CodePanelProps {
  code: string;
  highlightedLines: number[];
}

export function CodePanel({ code, highlightedLines }: CodePanelProps) {
  const lines = code.split('\n');

  const getTokenColor = (token: string): string => {
    if (/^(int|char|float|double|void|for|while|if|else|return|include|struct|long|short|unsigned|do|break|continue|switch|case|default|sizeof)$/.test(token)) {
      return 'text-orange-200';
    }
    if (/^[0-9]+\.?[0-9]*[fL]?$/.test(token)) {
      return 'text-orange-200';
    }
    if (/^["<].*[>"]$/.test(token) || /^".*"$/.test(token)) {
      return 'text-lime-300';
    }
    if (/^(printf|scanf|main|[a-z_]+[a-zA-Z0-9_]*)\s*\(/.test(token)) {
      return 'text-cyan-400';
    }
    return 'text-slate-200';
  };

  const renderLine = (line: string, lineNum: number) => {
    const isHighlighted = highlightedLines.includes(lineNum);
    const tokens = line.split(/(\s+|[();{},]|&lt;|&gt;|%[a-zA-Z])/);
    return (
      <motion.div
        key={lineNum}
        animate={{
          backgroundColor: isHighlighted ? 'rgba(34,211,238,0.15)' : 'rgba(0,0,0,0)',
        }}
        transition={{ duration: 0.3 }}
        className={`flex px-3 ${isHighlighted ? 'border-l-2 border-cyan-400' : 'border-l-2 border-transparent'}`}
      >
        <span className="mr-4 w-8 select-none text-right font-mono text-xs text-slate-600">
          {lineNum}
        </span>
        <span className="font-mono text-sm">
          {tokens.map((token, i) => (
            <span key={i} className={getTokenColor(token)}>
              {token}
            </span>
          )).reduce((acc: React.ReactNode[], el, i) => {
            if (i > 0) return [...acc, el];
            return [el];
          }, [])}
        </span>
      </motion.div>
    );
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950/90 backdrop-blur">
      <div className="flex items-center gap-2 border-b border-slate-700/50 bg-slate-900/80 px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-amber-500/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
        </div>
        <span className="ml-2 font-mono text-xs text-slate-400">main.c</span>
      </div>
      <div className="flex-1 overflow-auto py-2">
        {lines.map((line, idx) => renderLine(line, idx + 1))}
      </div>
    </div>
  );
}
