import { MAX_GALLERY_IMAGES, type PackageFormInput } from '@/lib/validations/package.schema'

export { MAX_GALLERY_IMAGES }

export type GalleryImage = NonNullable<PackageFormInput['gallery_images']>[number]

export function normalize(images: GalleryImage[]): GalleryImage[] {
  if (images.length === 0) return []

  const coverIndex = images.findIndex((image) => image.is_cover)
  const cover = coverIndex === -1 ? 0 : coverIndex

  return images.map((image, index) => ({
    ...image,
    display_order: index,
    is_cover: index === cover,
  }))
}

export function mergeUploadedUrls(urls: string[], existing: GalleryImage[]): GalleryImage[] {
  const byUrl = new Map(existing.map((image) => [image.url, image]))

  return normalize(
    urls.map((url) => byUrl.get(url) ?? { url, is_cover: false, display_order: 0 })
  )
}
