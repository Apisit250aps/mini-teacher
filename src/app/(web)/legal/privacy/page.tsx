import { documentRepository } from '@/core/repositories'
import MarkdownViewer from '@/presentations/components/app/document/markdown-viewer'
import { notFound } from 'next/navigation'
import Link from 'next/link'

type SearchParams = Promise<{ lang?: string }>

export default async function PrivacyPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { lang } = await searchParams
  const language = lang?.toUpperCase() === 'EN' ? 'EN' : 'TH'

  const document = await documentRepository.getLatestByType(
    'PRIVACY_POLICY',
    language,
  )

  if (!document) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              {language === 'TH' ? 'นโยบายความเป็นส่วนตัว' : 'Privacy Policy'}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {language === 'TH' ? 'เวอร์ชัน' : 'Version'} {document.version}
              {' · '}
              {new Date(document.createdAt).toLocaleDateString(
                language === 'TH' ? 'th-TH' : 'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' },
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="?lang=th"
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                language === 'TH'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'hover:bg-muted border-border'
              }`}
            >
              TH
            </Link>
            <Link
              href="?lang=en"
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                language === 'EN'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'hover:bg-muted border-border'
              }`}
            >
              EN
            </Link>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <MarkdownViewer content={document.content} />
        </div>
      </div>
    </div>
  )
}
