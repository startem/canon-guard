import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

// Generic Loading Spinner
export const LoadingSpinner = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
    </div>
  );
};

// Page Loading
export const PageLoading = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <LoadingSpinner size="xl" />
    <p className="text-muted-foreground">{message}</p>
  </div>
);

// Card Loading Skeleton
export const CardLoadingSkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Table Loading Skeleton
export const TableLoadingSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="space-y-4">
    {/* Header */}
    <div className="flex gap-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-10 flex-1" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-12 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

// List Loading Skeleton
export const ListLoadingSkeleton = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    ))}
  </div>
);

// Chart Loading Skeleton
export const ChartLoadingSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Form Loading Skeleton
export const FormLoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-24 w-full" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-20" />
    </div>
  </div>
);

// Dashboard Loading
export const DashboardLoadingSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-16 mb-2" />
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    
    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartLoadingSkeleton />
      <CardLoadingSkeleton count={1} />
    </div>
  </div>
);

// Data Loading with Error Retry
interface DataLoadingProps {
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export const DataLoading = ({ 
  isLoading, 
  error, 
  onRetry, 
  children, 
  loadingComponent 
}: DataLoadingProps) => {
  if (isLoading) {
    return loadingComponent || <PageLoading />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-destructive">{error}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
};