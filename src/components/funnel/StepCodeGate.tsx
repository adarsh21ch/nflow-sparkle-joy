// Stub — full access-code verification UI to be ported once nFlow source is reachable.
import { Lock } from "lucide-react";

interface StepCodeGateProps {
  funnelId: string;
  stepId: string;
  stepTitle?: string;
  message?: string;
  sessionId: string;
  isDark?: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const StepCodeGate = ({ stepTitle, message, onSuccess }: StepCodeGateProps) => {
  return (
    <div className="p-8 text-center rounded-xl border border-border/40 bg-muted/20">
      <Lock size={32} className="mx-auto mb-3 text-muted-foreground" />
      {stepTitle && <p className="text-sm font-medium mb-1">{stepTitle}</p>}
      <p className="text-sm text-muted-foreground mb-4">
        {message ?? "This step requires an access code."}
      </p>
      <button className="text-xs underline text-muted-foreground" onClick={onSuccess}>
        Skip for now (stub)
      </button>
    </div>
  );
};
