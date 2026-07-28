'use client';

import PackageFlagSection, { SHOWCASE_LIMIT } from '@/components/customer/PackageFlagSection';
import { useGroupPackages } from '@/lib/hooks/usePackages';

export const GROUP_TOURS_SLUG = 'group-tours';

export default function GroupPackagesSection() {
  const query = useGroupPackages(GROUP_TOURS_SLUG, SHOWCASE_LIMIT);

  return (
    <PackageFlagSection
      flag="group"
      title="Travel Together, Save Together"
      description="Fixed-departure group journeys with shared costs, expert guides and ready-made company."
      className="bg-white"
      query={query}
      emptyText="No group departures right now. Browse all our packages instead."
      href={`/categories/${GROUP_TOURS_SLUG}`}
      hideWhenEmpty
    />
  );
}
