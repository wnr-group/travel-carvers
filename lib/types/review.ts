export interface Review {
  id: string;
  package_id: string;
  reviewer_name: string;
  reviewer_email: string;
  rating: number;
  review_text: string;
  is_approved: boolean | null; // null = pending, true = approved, false = rejected
  created_at: string;
  packages?: {
    title: string;
  } | null;
}
