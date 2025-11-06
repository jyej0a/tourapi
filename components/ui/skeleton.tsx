/**
 * @file skeleton.tsx
 * @description 스켈레톤 UI 컴포넌트
 *
 * 이 컴포넌트는 데이터 로딩 중 콘텐츠의 플레이스홀더를 제공합니다.
 *
 * 주요 기능:
 * - 리스트 로딩 시 스켈레톤 카드 표시
 * - 이미지 로딩 시 플레이스홀더
 * - 다양한 크기와 형태 지원
 *
 * @dependencies
 * - lib/utils: cn 함수
 */

import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

/**
 * 관광지 카드 스켈레톤
 */
function TourCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("border rounded-lg p-4 space-y-3", className)}>
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

/**
 * 텍스트 스켈레톤 (여러 줄)
 */
function TextSkeleton({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-2/3" : "w-full"
          )}
        />
      ))}
    </div>
  )
}

export { Skeleton, TourCardSkeleton, TextSkeleton }
