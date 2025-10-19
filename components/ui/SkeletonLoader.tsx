interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-300 rounded ${className}`}></div>
  );
}

export function CandidateCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start space-x-3">
        <Skeleton className="w-16 h-16 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <Skeleton className="w-full h-48 rounded-lg mb-4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center space-x-2 mt-3">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function SidebarBlogSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <Skeleton className="w-full h-32 rounded-lg mb-3" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
