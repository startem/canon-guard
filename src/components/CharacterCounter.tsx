interface CharacterCounterProps {
  current: number;
  max: number;
  className?: string;
}

export const CharacterCounter = ({ current, max, className = "" }: CharacterCounterProps) => {
  const percentage = (current / max) * 100;
  const isNearLimit = percentage > 80;
  const isOverLimit = current > max;

  return (
    <div className={`text-xs flex items-center gap-2 ${className}`}>
      <span className={`${
        isOverLimit 
          ? "text-destructive" 
          : isNearLimit 
          ? "text-warning" 
          : "text-muted-foreground"
      }`}>
        {current}/{max}
      </span>
      <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-200 ${
            isOverLimit 
              ? "bg-destructive" 
              : isNearLimit 
              ? "bg-warning" 
              : "bg-primary"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};