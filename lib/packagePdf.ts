import { getBrandLogoDataUrl, getPdfImage } from '@/lib/pdfAssets';
import type { PackageFormInput } from '@/lib/validations/package.schema';


const PAGE = { width: 595.28, height: 841.89 }; // A4 in points
const MARGIN = 48;
const CONTENT_WIDTH = PAGE.width - MARGIN * 2;
const FOOTER_SPACE = 56;

/** Enough to show the trip without turning the brochure into a photo album. */
const MAX_GALLERY_IN_PDF = 6;

const BRAND = { r: 26, g: 60, b: 52 }; // --brand-forest
const MUTED = 110;

function rupees(value: number): string {
  return `Rs. ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)}`;
}

type Doc = import('jspdf').jsPDF;

interface Cursor {
  y: number;
}

/** A decoded photo plus the natural size the layout needs to place it. */
interface LoadedImage {
  dataUrl: string;
  width: number;
  height: number;
}

/** Reads a data URL's pixel size, which the layout needs to keep aspect ratios. */
function measure(dataUrl: string): Promise<LoadedImage | null> {
  return new Promise((resolve) => {
    if (typeof Image === 'undefined') {
      resolve(null);
      return;
    }
    const probe = new Image();
    probe.onload = () =>
      resolve({ dataUrl, width: probe.naturalWidth, height: probe.naturalHeight });
    probe.onerror = () => resolve(null);
    probe.src = dataUrl;
  });
}

/** Loads the package's photos: cover first, then the rest for the gallery. */
async function loadPhotos(pkg: PackageFormInput): Promise<{
  cover: LoadedImage | null;
  gallery: LoadedImage[];
}> {
  const images = [...(pkg.gallery_images ?? [])].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  );
  if (images.length === 0) return { cover: null, gallery: [] };

  const coverIndex = Math.max(
    0,
    images.findIndex((image) => image.is_cover)
  );
  const coverUrl = images[coverIndex]?.url;
  const rest = images.filter((_, index) => index !== coverIndex).slice(0, MAX_GALLERY_IN_PDF);

  const [cover, ...gallery] = await Promise.all([
    coverUrl ? getPdfImage(coverUrl, 1000).then((url) => (url ? measure(url) : null)) : null,
    ...rest.map((image) =>
      getPdfImage(image.url, 500).then((url) => (url ? measure(url) : null))
    ),
  ]);

  return {
    cover: cover ?? null,
    gallery: gallery.filter((image): image is LoadedImage => image !== null),
  };
}

/* -------------------------------- Primitives ------------------------------- */

function ensureSpace(doc: Doc, cursor: Cursor, needed: number) {
  if (cursor.y + needed <= PAGE.height - FOOTER_SPACE) return;
  doc.addPage();
  cursor.y = MARGIN;
}

function heading(doc: Doc, cursor: Cursor, text: string) {
  ensureSpace(doc, cursor, 46);
  cursor.y += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(BRAND.r, BRAND.g, BRAND.b);
  doc.text(text.toUpperCase(), MARGIN, cursor.y);

  cursor.y += 6;
  doc.setDrawColor(BRAND.r, BRAND.g, BRAND.b);
  doc.setLineWidth(0.8);
  doc.line(MARGIN, cursor.y, MARGIN + CONTENT_WIDTH, cursor.y);
  cursor.y += 16;
}

/** Wrapped body copy, split across pages when it runs past the footer. */
function paragraph(doc: Doc, cursor: Cursor, text: string, options?: { indent?: number }) {
  const indent = options?.indent ?? 0;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40);

  const lines: string[] = doc.splitTextToSize(text, CONTENT_WIDTH - indent);
  for (const line of lines) {
    ensureSpace(doc, cursor, 14);
    doc.text(line, MARGIN + indent, cursor.y);
    cursor.y += 14;
  }
}

function bullet(doc: Doc, cursor: Cursor, text: string) {
  ensureSpace(doc, cursor, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40);
  doc.text('•', MARGIN + 4, cursor.y);
  paragraph(doc, cursor, text, { indent: 16 });
}

function labelledLine(doc: Doc, cursor: Cursor, label: string, value: string) {
  ensureSpace(doc, cursor, 14);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(BRAND.r, BRAND.g, BRAND.b);
  doc.text(`${label}:`, MARGIN, cursor.y);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40);
  doc.text(value, MARGIN + 96, cursor.y);
  cursor.y += 15;
}

/* --------------------------------- Sections -------------------------------- */

const LOGO_SIZE = 56;

function coverBlock(doc: Doc, cursor: Cursor, pkg: PackageFormInput, logo: string | null) {
  // Brand band across the top of page one.
  doc.setFillColor(BRAND.r, BRAND.g, BRAND.b);
  doc.rect(0, 0, PAGE.width, 96, 'F');

  // Title yields width to the logo only when there is actually one to draw.
  let titleWidth = CONTENT_WIDTH;

  if (logo) {
    const x = PAGE.width - MARGIN - LOGO_SIZE;
    doc.addImage(logo, 'PNG', x, 20, LOGO_SIZE, LOGO_SIZE);
    titleWidth = CONTENT_WIDTH - LOGO_SIZE - 16;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255);
  const titleLines: string[] = doc.splitTextToSize(pkg.title ?? 'Untitled package', titleWidth);
  // Two lines maximum, so the band never overruns its own height.
  doc.text(titleLines.slice(0, 2), MARGIN, 46);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(220, 235, 220);
  doc.text('Travel Carvers · Explore Your Next Adventure', MARGIN, 78);

  cursor.y = 128;
}

function summaryBlock(doc: Doc, cursor: Cursor, pkg: PackageFormInput) {
  const nights = pkg.duration_nights ?? 0;
  const days = pkg.duration_days;

  if (days) labelledLine(doc, cursor, 'Duration', `${days} days / ${nights} nights`);
  if (pkg.destination_name) labelledLine(doc, cursor, 'Destination', pkg.destination_name);

  if (pkg.group_size_min || pkg.group_size_max) {
    const min = pkg.group_size_min ?? 1;
    const max = pkg.group_size_max;
    labelledLine(doc, cursor, 'Group size', max ? `${min}–${max} travellers` : `${min}+ travellers`);
  }

  if (pkg.difficulty_level) {
    const level = pkg.difficulty_level;
    labelledLine(doc, cursor, 'Difficulty', level.charAt(0).toUpperCase() + level.slice(1));
  }

  if (pkg.age_restriction) labelledLine(doc, cursor, 'Age', pkg.age_restriction);

  // `show_price` is the customer-facing switch; the brochure honours it.
  if (pkg.show_price !== false && pkg.price_adult) {
    labelledLine(doc, cursor, 'Adult', `${rupees(pkg.price_adult)} per person`);
    if (pkg.price_child) labelledLine(doc, cursor, 'Child', rupees(pkg.price_child));
    if (pkg.price_infant) labelledLine(doc, cursor, 'Infant', rupees(pkg.price_infant));
  } else {
    labelledLine(doc, cursor, 'Pricing', 'On request');
  }
}

function itineraryBlock(doc: Doc, cursor: Cursor, pkg: PackageFormInput) {
  const days = [...(pkg.itinerary_days ?? [])].sort(
    (a, b) => (a.day_number ?? 0) - (b.day_number ?? 0)
  );
  if (days.length === 0) return;

  heading(doc, cursor, 'Itinerary');

  for (const day of days) {
    ensureSpace(doc, cursor, 40);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(BRAND.r, BRAND.g, BRAND.b);
    doc.text(`Day ${day.day_number} — ${day.title}`, MARGIN, cursor.y);
    cursor.y += 14;

    const meals = [
      day.breakfast ? 'Breakfast' : null,
      day.lunch ? 'Lunch' : null,
      day.dinner ? 'Dinner' : null,
    ].filter(Boolean);

    const meta = [day.timing, meals.length > 0 ? `Meals: ${meals.join(', ')}` : null]
      .filter(Boolean)
      .join('  ·  ');

    if (meta) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(MUTED);
      doc.text(meta, MARGIN, cursor.y);
      cursor.y += 13;
    }

    for (const entry of day.entries ?? []) {
      const time = entry.time_label ? `${entry.time_label} — ` : '';
      bullet(doc, cursor, `${time}${entry.name}`);
      if (entry.description) paragraph(doc, cursor, entry.description, { indent: 16 });
    }

    cursor.y += 8;
  }
}

/**
 * Draws an image scaled to the content width, capped in height so a tall photo
 * cannot swallow a page. Returns silently when the image could not be loaded.
 */
function imageBlock(
  doc: Doc,
  cursor: Cursor,
  image: LoadedImage,
  options?: { maxHeight?: number; width?: number }
) {
  const width = options?.width ?? CONTENT_WIDTH;
  const maxHeight = options?.maxHeight ?? 220;

  const ratio = image.height / image.width;
  const height = Math.min(width * ratio, maxHeight);
  // Keep the aspect ratio when the height cap is what binds.
  const drawWidth = height === maxHeight ? height / ratio : width;

  ensureSpace(doc, cursor, height + 12);
  doc.addImage(image.dataUrl, 'JPEG', MARGIN, cursor.y, drawWidth, height);
  cursor.y += height + 14;
}

function galleryBlock(doc: Doc, cursor: Cursor, images: LoadedImage[]) {
  if (images.length === 0) return;

  heading(doc, cursor, 'Gallery');

  const gap = 10;
  const perRow = 3;
  const cellWidth = (CONTENT_WIDTH - gap * (perRow - 1)) / perRow;
  const cellHeight = cellWidth * 0.68;

  images.forEach((image, index) => {
    const column = index % perRow;
    if (column === 0) ensureSpace(doc, cursor, cellHeight + gap);

    const x = MARGIN + column * (cellWidth + gap);
    doc.addImage(image.dataUrl, 'JPEG', x, cursor.y, cellWidth, cellHeight);

    // Advance only once the row is filled, or at the final image.
    if (column === perRow - 1 || index === images.length - 1) {
      cursor.y += cellHeight + gap;
    }
  });
}

function listBlock(doc: Doc, cursor: Cursor, title: string, items: string[]) {
  if (items.length === 0) return;
  heading(doc, cursor, title);
  for (const item of items) bullet(doc, cursor, item);
}

function staysBlock(doc: Doc, cursor: Cursor, pkg: PackageFormInput) {
  const stays = pkg.stay_details ?? [];
  if (stays.length === 0) return;

  heading(doc, cursor, 'Stays');
  for (const stay of stays) {
    const parts = [
      stay.hotel_name,
      stay.rating ? `${stay.rating}-star` : null,
      stay.room_type,
      stay.location,
    ].filter(Boolean);
    bullet(doc, cursor, parts.join(' · '));
  }
}

function cancellationBlock(doc: Doc, cursor: Cursor, pkg: PackageFormInput) {
  const rules = pkg.cancellation_policy ?? [];
  if (rules.length === 0) return;

  heading(doc, cursor, 'Cancellation policy');
  for (const rule of rules) bullet(doc, cursor, `${rule.window_label}: ${rule.refund_text}`);
}

/** Page numbers, added last so the total is known. */
function footers(doc: Doc, generatedAt: string) {
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(MUTED);
    doc.text(`Generated ${generatedAt}`, MARGIN, PAGE.height - 28);
    doc.text(`Page ${page} of ${pages}`, PAGE.width - MARGIN, PAGE.height - 28, {
      align: 'right',
    });
  }
}

/* ---------------------------------- Entry ---------------------------------- */

/** Slug-safe file name, falling back to the title when the slug is empty. */
function fileName(pkg: PackageFormInput): string {
  const base = (pkg.slug || pkg.title || 'package')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${base || 'package'}-${new Date().toISOString().split('T')[0]}.pdf`;
}

/** Builds the document. Split from the download so it can be exercised headlessly. */
export async function buildPackagePdf(pkg: PackageFormInput): Promise<Doc> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const cursor: Cursor = { y: MARGIN };

  // All cached between downloads, and null when unreadable — the brochure is
  // still worth producing without them.
  const [logo, photos] = await Promise.all([getBrandLogoDataUrl(), loadPhotos(pkg)]);

  coverBlock(doc, cursor, pkg, logo);

  if (photos.cover) imageBlock(doc, cursor, photos.cover, { maxHeight: 230 });

  if (pkg.short_description) {
    paragraph(doc, cursor, pkg.short_description);
    cursor.y += 6;
  }

  heading(doc, cursor, 'At a glance');
  summaryBlock(doc, cursor, pkg);

  if (pkg.full_description) {
    heading(doc, cursor, 'About this trip');
    paragraph(doc, cursor, pkg.full_description);
  }

  listBlock(
    doc,
    cursor,
    'Highlights',
    (pkg.highlights ?? []).map((row) => row.highlight)
  );

  itineraryBlock(doc, cursor, pkg);
  galleryBlock(doc, cursor, photos.gallery);
  staysBlock(doc, cursor, pkg);

  listBlock(
    doc,
    cursor,
    'What is included',
    (pkg.inclusions ?? []).map((row) => row.text)
  );
  listBlock(
    doc,
    cursor,
    'What is not included',
    (pkg.exclusions ?? []).map((row) => row.text)
  );
  listBlock(
    doc,
    cursor,
    'Travel tips',
    (pkg.travel_tips ?? []).map((row) => row.tip)
  );
  listBlock(
    doc,
    cursor,
    'Documents to carry',
    (pkg.required_documents ?? []).map((row) => row.document_text)
  );

  cancellationBlock(doc, cursor, pkg);

  footers(doc, new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' }));
  return doc;
}

export async function downloadPackagePdf(pkg: PackageFormInput): Promise<void> {
  const doc = await buildPackagePdf(pkg);
  doc.save(fileName(pkg));
}
