const CAPABILITIES = [
  {
    label: 'Debug & Refactor',
    description: 'Analyse your current file for bugs or performance optimisations.',
  },
  {
    label: 'Explain Concepts',
    description: 'Deep dive into complex logic, libraries, or unfamiliar patterns.',
  },
  {
    label: 'Generate Logic',
    description: 'Draft boilerplate, algorithms, or unit tests instantly.',
  },
];

export function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center select-none">
      <h1 className="text-base font-semibold text-foreground mb-1">Daemon</h1>
      <p className="text-xs text-muted-foreground leading-relaxed mb-6 max-w-55">
        Start a conversation or select a session from history.
      </p>

      <div className="grid gap-2 w-full text-left">
        {CAPABILITIES.map((cap) => (
          <div
            key={cap.label}
            className="p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors"
          >
            <div className="text-xs font-medium text-foreground mb-0.5">{cap.label}</div>
            <div className="text-[11px] text-muted-foreground leading-relaxed">
              {cap.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
