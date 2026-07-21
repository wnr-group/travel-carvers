import type { UploadBucket } from '@/lib/storage/buckets'

export interface UploadedFile {
  url: string
  path: string
  name: string
  type: string
  size: number
}

interface UploadFileOptions {
  file: File
  bucket: UploadBucket
  path?: string
  onProgress?: (percent: number) => void
}

export function uploadFile({
  file,
  bucket,
  path,
  onProgress,
}: UploadFileOptions): Promise<UploadedFile> {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', bucket)
    if (path) formData.append('path', path)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/admin/upload')

    xhr.upload.addEventListener('progress', (event) => {
      if (!event.lengthComputable) return
      onProgress?.(Math.round((event.loaded / event.total) * 100))
    })

    xhr.addEventListener('load', () => {
      const json = parseJson(xhr.responseText)
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(json?.error ?? `Upload failed (${xhr.status})`))
        return
      }

      if (!json?.data?.url) {
        reject(new Error('Malformed response from server'))
        return
      }

      resolve(json.data)
    })

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')))
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')))

    xhr.send(formData)
  })
}

interface UploadResponse {
  data?: UploadedFile
  error?: string
}

function parseJson(text: string): UploadResponse | null {
  try {
    return JSON.parse(text) as UploadResponse
  } catch {
    return null
  }
}
