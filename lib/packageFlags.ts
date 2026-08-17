export type PackageFlagKey =
  | 'featured'
  | 'trending'
  | 'new'
  | 'seasonal'
  | 'best-seller'
  | 'group';

export type PackageFlagColumn =
  | 'is_featured'
  | 'is_trending'
  | 'is_new'
  | 'is_seasonal'
  | 'is_best_seller'
  | 'is_group_package';

export interface PackageFlagDefinition {
  key: PackageFlagKey;
  column: PackageFlagColumn;
  label: string;
  plural: string;
  badge: string;
}

export const PACKAGE_FLAGS: readonly PackageFlagDefinition[] = [
  {
    key: 'featured',
    column: 'is_featured',
    label: 'Featured',
    plural: 'Featured Packages',
    badge: 'FEATURED',
  },
  {
    key: 'trending',
    column: 'is_trending',
    label: 'Trending',
    plural: 'Trending Packages',
    badge: 'TRENDING',
  },
  {
    key: 'new',
    column: 'is_new',
    label: 'New',
    plural: 'New Packages',
    badge: 'NEW',
  },
  {
    key: 'seasonal',
    column: 'is_seasonal',
    label: 'Seasonal Best',
    plural: 'Seasonal Packages',
    badge: 'IN SEASON',
  },
  {
    key: 'best-seller',
    column: 'is_best_seller',
    label: 'Best Seller',
    plural: 'Best Sellers',
    badge: 'BEST SELLER',
  },
  {
    key: 'group',
    column: 'is_group_package',
    label: 'Group Tour',
    plural: 'Group Tours',
    badge: 'GROUP TOUR',
  },
] as const;

const FLAGS_BY_KEY = new Map(PACKAGE_FLAGS.map((flag) => [flag.key, flag]));

export function getPackageFlag(key: PackageFlagKey): PackageFlagDefinition {
  const flag = FLAGS_BY_KEY.get(key);
  if (!flag) throw new Error(`Unknown package flag: ${key}`);
  return flag;
}

export function isPackageFlagKey(value: string): value is PackageFlagKey {
  return FLAGS_BY_KEY.has(value as PackageFlagKey);
}

export function packagesHrefForFlag(key: PackageFlagKey): string {
  return `/packages?flag=${encodeURIComponent(key)}`;
}

export type PackageFlagRow = Partial<Record<PackageFlagColumn, boolean | null>>;

export function packageFlagsOf(row: PackageFlagRow): PackageFlagKey[] {
  return PACKAGE_FLAGS.filter((flag) => row[flag.column] === true).map((flag) => flag.key);
}
