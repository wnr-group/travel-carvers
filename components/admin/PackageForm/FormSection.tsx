export default function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-medium">
        {title}
      </h3>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}

      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}
