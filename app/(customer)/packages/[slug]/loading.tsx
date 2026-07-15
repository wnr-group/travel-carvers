import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <LoadingSkeleton variant="hero" />
    </div>
  );
}
