import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Bot, CheckCircle2, FileCheck2, FileText, LoaderCircle, MessageSquareText, Play, RotateCcw, ScanSearch, Sparkles, TicketCheck, TrendingUp } from 'lucide-react'
import { ObserverSlidePage } from '../components/ObserverSlidePage'
import { useLanguage } from '../contexts/LanguageContext'
import { usePageSeo } from '../hooks/usePageSeo'

interface DemoStep {
  label: string
  title: string
  text: string
}

interface DemoAction {
  label: string
  title: string
  result: string
  icon: 'scan' | 'message' | 'ticket'
}

export function AiDemoPage() {
  usePageSeo('ai-demo')
  const { t } = useTranslation('translation')
  const { language } = useLanguage()
  const steps = t('aiDemo.steps', { returnObjects: true }) as DemoStep[]
  const actions = t('aiDemo.actions', { returnObjects: true }) as DemoAction[]
  const documentSteps = t('aiDemo.documentCase.steps', { returnObjects: true }) as string[]
  const documentOutputs = t('aiDemo.documentCase.outputs', { returnObjects: true }) as string[]
  const salesSteps = t('aiDemo.salesCase.steps', { returnObjects: true }) as string[]
  const salesOutputs = t('aiDemo.salesCase.outputs', { returnObjects: true }) as string[]
  const actionIcons = { scan: ScanSearch, message: MessageSquareText, ticket: TicketCheck }
  const [activeStep, setActiveStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [activeAction, setActiveAction] = useState<number | null>(null)
  const documentSectionRef = useRef<HTMLElement>(null)
  const [isDocumentVisible, setIsDocumentVisible] = useState(false)
  const [isDocumentWorking, setIsDocumentWorking] = useState(false)
  const salesSectionRef = useRef<HTMLElement>(null)
  const [isSalesVisible, setIsSalesVisible] = useState(false)
  const [isSalesWorking, setIsSalesWorking] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    const timer = window.setTimeout(() => {
      if (activeStep >= steps.length - 1) {
        setIsRunning(false)
        return
      }
      setActiveStep((currentStep) => {
        const nextStep = currentStep + 1
        setActiveAction(nextStep)
        return nextStep
      })
    }, 1100)

    return () => window.clearTimeout(timer)
  }, [activeStep, isRunning, steps.length])

  useEffect(() => {
    const section = documentSectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setIsDocumentVisible(true)
      setIsDocumentWorking(true)
      window.setTimeout(() => setIsDocumentWorking(false), 8000)
      observer.disconnect()
    }, { threshold: 0.1 })

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = salesSectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setIsSalesVisible(true)
      setIsSalesWorking(true)
      window.setTimeout(() => setIsSalesWorking(false), 5000)
      observer.disconnect()
    }, { threshold: 0.1 })

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  function runDemo() {
    setActiveStep(0)
    setActiveAction(0)
    setIsRunning(true)
  }

  function runAction(index: number) {
    setActiveAction(index)
    setActiveStep(index)
    setIsRunning(false)
  }

  return (
    <ObserverSlidePage>
      <section className="box-border flex min-h-[calc(100svh-4rem)] w-full items-center border-b-2 border-[#ebdcc9] bg-[#fdf4e8] px-4 py-12 sm:px-6 sm:py-16" data-slide>
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#d66d28]">{t('aiDemo.eyebrow')}</p>
            <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-6xl">{t('aiDemo.title')}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#50575d] sm:text-xl">{t('aiDemo.intro')}</p>
            <Link
              to={`/${language}?topic=ai-business-workflows`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#d66d28] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#c05e20]"
            >
              {t('aiDemo.cta')}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="w-full max-w-md justify-self-end rounded-3xl border border-[#ebdcc9] bg-white p-4 shadow-xl sm:p-5">
            <div className="mb-3 flex items-center gap-3 border-b border-[#ebdcc9] pb-3">
              <div className="ai-bot-mark flex size-10 items-center justify-center rounded-2xl"><Bot className="size-5" /></div>
              <div>
                <p className="font-semibold">{t('aiDemo.preview.title')}</p>
                <p className="text-sm text-[#6b7379]">{t('aiDemo.preview.subtitle')}</p>
              </div>
              <span className="ml-auto size-2.5 rounded-full bg-emerald-500" aria-label={t('aiDemo.preview.status')} />
            </div>
            <p className="mb-3 rounded-lg bg-[#fdf4e8] px-3 py-2 text-xs font-medium text-[#6b7379]">{t('aiDemo.preview.demoNotice')}</p>
            <div className="space-y-2">
              <div className="ml-6 rounded-2xl rounded-tr-sm bg-[#fdf4e8] p-3 text-sm leading-relaxed text-[#50575d]">{t('aiDemo.preview.request')}</div>
              <div className="rounded-2xl rounded-tl-sm border border-[#ebdcc9] bg-[#fffaf4] p-3 text-sm leading-relaxed text-[#50575d]">
                <p className="mb-2 flex items-center gap-2 font-semibold text-[#1f2327]"><Sparkles className="size-4 text-[#d66d28]" />{t('aiDemo.preview.replyLabel')}</p>
                {t('aiDemo.preview.reply')}
              </div>
            </div>
            <div className="mt-4 border-t border-[#ebdcc9] pt-3" aria-live="polite">
              <div className="flex items-center gap-3 rounded-xl bg-[#fdf4e8] p-3 text-sm">
                {isRunning ? <LoaderCircle className="size-4 animate-spin text-[#d66d28]" /> : <CheckCircle2 className="size-4 text-emerald-600" />}
                <span className="font-semibold leading-tight text-[#1f2327]">{steps[activeStep].title}</span>
                <span className="ml-auto text-xs text-[#6b7379]">{isRunning ? t('aiDemo.preview.processing') : t('aiDemo.preview.ready')}</span>
              </div>
              <button
                type="button"
                onClick={runDemo}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#d66d28] px-4 py-2.5 text-sm font-semibold text-[#d66d28] transition hover:bg-[#d66d28] hover:text-white"
              >
                {isRunning ? <LoaderCircle className="size-4 animate-spin" /> : activeStep === steps.length - 1 ? <RotateCcw className="size-4" /> : <Play className="size-4" />}
                {isRunning ? t('aiDemo.preview.processing') : activeStep === steps.length - 1 ? t('aiDemo.preview.replay') : t('aiDemo.preview.run')}
              </button>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {actions.map((action, index) => {
                  const Icon = actionIcons[action.icon]
                  const isActive = activeAction === index
                  return (
                    <button
                      key={action.title}
                      type="button"
                      onClick={() => runAction(index)}
                      className={`flex min-h-20 flex-col items-start justify-between rounded-xl border p-2.5 text-left transition hover:-translate-y-0.5 ${isActive ? 'border-[#d66d28] bg-[#fff1e4] text-[#1f2327] shadow-sm' : 'border-[#ebdcc9] bg-white text-[#50575d] hover:border-[#d66d28]'}`}
                    >
                      <Icon className={`size-5 ${isActive ? 'text-[#d66d28]' : 'text-[#6b7379]'}`} />
                      <span className="text-xs font-bold leading-snug">{action.label}</span>
                    </button>
                  )
                })}
              </div>
              {activeAction !== null && (
                <div className="mt-3 flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900" aria-live="polite">
                  <FileCheck2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  <p><span className="font-bold">{actions[activeAction].title}:</span> {actions[activeAction].result}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section ref={documentSectionRef} className={`document-section box-border flex min-h-[calc(100svh-4rem)] w-full items-center border-b-2 border-[#ebdcc9] bg-white px-4 py-12 sm:px-6 sm:py-16 ${isDocumentVisible ? 'is-visible' : ''}`} data-slide>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="order-2 lg:order-2">
              <FileText className="size-10 text-[#d66d28]" />
              <p className="mt-6 text-xs font-bold uppercase tracking-widest text-[#d66d28]">{t('aiDemo.documentCase.eyebrow')}</p>
              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-5xl">{t('aiDemo.documentCase.title')}</h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#50575d]">{t('aiDemo.documentCase.text')}</p>
              <Link to={`/${language}?topic=ai-business-workflows`} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#d66d28] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#c05e20]">
                {t('aiDemo.documentCase.cta')} <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="order-1 rounded-3xl border border-[#ebdcc9] bg-[#fdf4e8] p-5 shadow-xl sm:p-8 lg:order-1">
              <div className="flex items-center justify-between border-b border-[#ebdcc9] pb-5">
                <div className="flex items-center gap-3"><div className={`ai-bot-mark ai-worker-icon flex size-9 items-center justify-center rounded-xl ${isDocumentWorking ? 'is-active' : ''}`}><Bot className="size-5" /></div><div><span className="block font-semibold">{t('aiDemo.documentCase.panelTitle')}</span><span className="text-xs text-[#6b7379]">{isDocumentWorking ? t('aiDemo.documentCase.workerActive') : isDocumentVisible ? t('aiDemo.documentCase.workerDone') : t('aiDemo.documentCase.workerIdle')}</span></div></div>
                <span className="text-right text-xs font-bold uppercase tracking-widest text-emerald-600"><span className="block">{t('aiDemo.documentCase.panelStatus')}</span><span className="mt-1 block font-medium text-[#6b7379]">{t('aiDemo.documentCase.panelTiming')}</span></span>
              </div>
              <div className="document-preview relative mt-6 overflow-hidden rounded-xl border border-dashed border-[#d66d28] bg-white p-4">
                <div className={`document-scan-line ${isDocumentVisible ? 'is-active' : ''}`} aria-hidden="true" />
                <p className="text-xs font-bold uppercase tracking-widest text-[#6b7379]">{t('aiDemo.documentCase.inputLabel')}</p>
                <div className="mt-3 flex items-center gap-3">
                  <FileText className="size-8 text-[#d66d28]" />
                  <p className="font-semibold">{t('aiDemo.documentCase.input')}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3">
                {documentSteps.map((step, index) => (
                  <div key={step} className="document-workflow-item relative grid gap-2 border-t-2 border-transparent pt-3 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="document-step"><span className="text-xs font-bold text-[#d66d28]">0{index + 1}</span><p className="mt-2 text-sm font-semibold leading-relaxed">{step}</p></div>
                    <div className="document-output flex items-center gap-2 rounded-lg bg-white p-3 text-sm font-semibold"><CheckCircle2 className="size-4 shrink-0 text-emerald-600" />{documentOutputs[index]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={salesSectionRef} className={`sales-section box-border flex min-h-[calc(100svh-4rem)] w-full items-center border-y-2 border-[#ebdcc9] bg-[#fdf4e8] px-4 py-12 text-[#1f2327] sm:px-6 sm:py-16 ${isSalesVisible ? 'is-visible' : ''}`} data-slide>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <TrendingUp className="size-10 text-[#f2a56d]" />
              <p className="mt-6 text-xs font-bold uppercase tracking-widest text-[#f2a56d]">{t('aiDemo.salesCase.eyebrow')}</p>
              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-5xl">{t('aiDemo.salesCase.title')}</h2>
              <p className="mt-5 leading-relaxed text-[#50575d]">{t('aiDemo.salesCase.text')}</p>
              <Link to={`/${language}?topic=ai-business-workflows`} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#d66d28] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#c05e20]">
                {t('aiDemo.salesCase.cta')} <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="rounded-3xl border border-[#ebdcc9] bg-white p-5 shadow-xl sm:p-8">
              <div className="flex items-center justify-between border-b border-[#ebdcc9] pb-5"><div className="flex items-center gap-3"><div className={`ai-bot-mark ai-worker-icon flex size-9 items-center justify-center rounded-xl ${isSalesWorking ? 'is-active' : ''}`}><Bot className="size-5" /></div><div><span className="block font-semibold">{t('aiDemo.salesCase.panelTitle')}</span><span className="text-xs text-[#6b7379]">{isSalesWorking ? t('aiDemo.salesCase.workerActive') : isSalesVisible ? t('aiDemo.salesCase.workerDone') : t('aiDemo.salesCase.workerIdle')}</span></div></div><span className="text-xs font-bold uppercase tracking-widest text-emerald-600">{t('aiDemo.salesCase.panelStatus')}</span></div>
              <div className="sales-chart mt-6 flex h-28 items-end gap-3 border-b border-[#ebdcc9] px-3">
                {[42, 58, 48, 76, 92, 68].map((height, index) => <div key={height} className="sales-bar flex-1 rounded-t-md bg-[#d66d28]" style={{ height: `${height}%`, animationDelay: `${index * 120}ms` }} />)}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {salesSteps.map((step, index) => <div key={step} className="border border-[#ebdcc9] bg-[#fdf4e8] p-4"><span className="text-xs font-bold text-[#d66d28]">0{index + 1}</span><p className="mt-3 text-sm font-semibold leading-relaxed">{step}</p></div>)}
              </div>
              <div className="mt-6 grid gap-2 sm:grid-cols-3">
                {salesOutputs.map((output) => <div key={output} className="flex items-center gap-2 bg-[#fffaf4] p-3 text-sm font-semibold"><CheckCircle2 className="size-4 shrink-0 text-emerald-600" />{output}</div>)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </ObserverSlidePage>
  )
}
