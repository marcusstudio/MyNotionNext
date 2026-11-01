export default function Newsletter({ formUrl }) {
  // 未配置正式表单时不展示，避免上线无法提交的订阅入口。
  if (!/^https:\/\/preview\.mailerlite\.io\/forms\/\d+\/\d+\/share$/.test(String(formUrl || ''))) {
    return null
  }

  return (
    <section id='newsletter' className='opc-newsletter mx-auto mt-6 max-w-6xl rounded-lg border p-5 md:p-10' aria-labelledby='newsletter-title'>
      <div>
        <div className='opc-section-label opc-muted'>Post von Klarraum</div>
        <h2 id='newsletter-title' className='mt-3 whitespace-pre-line text-3xl font-semibold leading-tight'>
          {'Ein neuer Gedanke.\nAb und zu in deinem Postfach.'}
        </h2>
        <p className='opc-muted mt-4 text-sm leading-7'>
          Ausgewählte Beiträge und persönliche Impulse zu Psychologie im Alltag.
          Von mir für dich, wenn es etwas Teilenswertes gibt.
        </p>
        <p className='opc-muted mt-4 text-xs leading-6'>
          Kostenlos · In unregelmäßigen Abständen · Jederzeit abmeldbar
        </p>
      </div>
      <div className='min-w-0'>
        <iframe
          title='Klarraum Newsletter – E-Mail-Anmeldung'
          src={formUrl}
          loading='lazy'
          referrerPolicy='strict-origin-when-cross-origin'
          className='h-[260px] w-full border-0'
        />
      </div>
      <style jsx>{`
        .opc-newsletter {
          display: grid;
          align-items: center;
          gap: 28px;
          border-color: var(--opc-console-border);
          background: color-mix(in srgb, var(--opc-console-primary) 6%, var(--opc-console-bg));
        }
        @media (min-width: 768px) {
          .opc-newsletter { grid-template-columns: 1fr 1fr; gap: 48px; }
        }
      `}</style>
    </section>
  )
}
