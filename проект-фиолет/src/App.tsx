import { useEffect, useState } from 'react'

/*
  Lanmei — прототип по правкам заказчика от 17.09.2026 («правки-заказчика/2026-09-17 — правки Леонида.md»).
  Порядок и тексты — из файла дословно. Визуал — из прототипа: серия предметов, кнопка-пилюля с кругом-стрелкой,
  боковая панель, карточки, веер документов, карта в подвале, Unbounded + Golos Text.
  Открытые вопросы (не выдумывать): ссылка MAX · обработчик форм · фото трёх карточек «Кому подходит» и этапа 03 · цвет.
*/

const IMG = 'img/'
const YM = 111955901
const goal = (g: string) => (window as any).ym?.(YM, 'reachGoal', g)

/* Типографика по файлу: короткие слова и числа не отрываются от следующего слова, тире не начинает строку. */
const SHORT = ['в', 'с', 'и', 'к', 'о', 'у', 'а', 'из', 'на', 'по', 'до', 'за', 'от', 'не', 'для', 'В', 'С', 'И', 'К', 'О', 'У', 'А', 'Из', 'На', 'По', 'До', 'За', 'От', 'Не', 'Для']
const nb = (s: string) => s
  .replace(new RegExp(`(^|[\\s(«])(${SHORT.join('|')}) `, 'g'), '$1$2 ')
  .replace(/(\d) (?=[а-яА-Яa-zA-Z$₽%])/g, '$1 ')
  .replace(/(\$) (\d)/g, '$1 $2')
  .replace(/ —/g, ' —')
  .replace(/(\d)–(\d)/g, '$1﻿–﻿$2')
const T = ({ children }: { children: string }) => <>{nb(children)}</>

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.1 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

const ArrIco = ({ s = 18 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>
const Lock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
const Check = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>

/* Главная CTA: пилюля с кругом-стрелкой и подписью выгоды. */
const Cta = ({ children, sub, light = false, href = '#brief', className = '', onClick }: { children: React.ReactNode; sub?: string; light?: boolean; href?: string; className?: string; onClick?: () => void }) => (
  <div className={`cta-wrap ${className}`}>
    <a href={href} onClick={onClick} className={`cta-main ${light ? 'cta-light' : ''}`}>{children}<span className="cta-arr" aria-hidden><ArrIco /></span></a>
    {sub && <span className="cta-sub"><T>{sub}</T></span>}
  </div>
)
/* Документ клиента: оригинальный скан, без поворота, в рамке бумаги, ширина ≤ половины исходника. */
const Doc = ({ src, w, cap, className = '', style }: { src: string; w: number; cap?: string; className?: string; style?: React.CSSProperties }) => (
  <figure className={`paper ${className}`} style={{ width: w, ...style }}>
    <img src={IMG + src} alt={cap || 'Документ Lanmei'} />
    {cap && <figcaption><T>{cap}</T></figcaption>}
  </figure>
)
const LockPlate = ({ text = 'Цену фиксируем в договоре — в юанях или долларах' }: { text?: string }) => (
  <div className="lock-plate"><Lock /><span><T>{text}</T></span></div>
)

/* ── Боковая панель: меню, Telegram, чат, телефон ── */
const I = {
  tg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4 3 11l6 2 2 6 3-4 5 3z" /><path d="m9 13 9-8" /></svg>,
  chat: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v11H8l-4 4z" /><path d="M8 9h8M8 12h5" /></svg>,
  phone: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>,
}
const MENU = [['#who', 'кому подходит'], ['#brief', 'расчёт'], ['#estimate', 'смета'], ['#case', 'кейсы'], ['#guarantee', 'ответственность'], ['#docs', 'документы'], ['#team', 'команда'], ['#faq', 'вопросы'], ['#contacts', 'контакты']]
const Rail = ({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) => (
  <>
    <div className="rail">
      <a href="#top"><img src={IMG + 'logo.jpg'} alt="Lanmei" className="w-10 h-10 rounded-xl" /></a>
      <button className={`burger ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-label="Меню"><i /><i /><i /></button>
      <span className="menu">меню</span>
      <a className="soc" href="https://t.me/lanmei_logistics" target="_blank" rel="noreferrer" aria-label="Telegram">{I.tg}</a>
      <a className="soc" href="https://wa.me/8613120794214" target="_blank" rel="noreferrer" aria-label="WhatsApp">{I.chat}</a>
      <a className="soc" href="tel:+8613120794214" aria-label="Позвонить">{I.phone}</a>
    </div>
    <div className={`menu-overlay ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)}>
      <nav className="max-w-[1180px] mx-auto px-6 pt-[120px]">
        {MENU.map(([h, t], i) => <a key={h} href={h} className="display display-b block text-[clamp(28px,4.4vw,56px)] leading-[1.05] menu-link" style={{ transitionDelay: `${0.06 + i * 0.04}s` }}>{t}</a>)}
        <div className="mt-10 text-white/70 text-[15px]">+86 131 2079 4214 · Шанхай</div>
      </nav>
    </div>
  </>
)

/* ── Окно «Заказать звонок» ── */
const CallModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [sent, setSent] = useState(false)
  if (!open) return null
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="card card-paper modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose} aria-label="Закрыть">×</button>
        {sent ? (<>
          <h3 className="display display-b text-[24px]">Заявка отправлена</h3>
          <p className="mt-3 text-[15px] text-ink-2"><T>В ближайшее время с вами свяжется наш менеджер.</T></p>
        </>) : (<>
          <h3 className="display display-b text-[24px]">Закажите обратный звонок</h3>
          <p className="mt-3 text-[15px] text-ink-2"><T>В ближайшее время с вами свяжется наш менеджер и обсудит вашу поставку.</T></p>
          <form className="grid gap-3 mt-5" onSubmit={(e) => { e.preventDefault(); goal('call_submit'); setSent(true) }}>
            <input name="name" className="q-opt" placeholder="Ваше имя" required />
            <input name="phone" className="q-opt" placeholder="Телефон" inputMode="tel" required />
            <button className="cta-main justify-center" type="submit">Заказать звонок<span className="cta-arr" aria-hidden><ArrIco /></span></button>
            <p className="text-[12px] text-ink-2"><T>Нажимая кнопку, вы соглашаетесь с</T> <a href="https://lanmei.ru/privacy/" target="_blank" rel="noreferrer" className="underline decoration-dotted">политикой обработки данных</a>.</p>
          </form>
        </>)}
      </div>
    </div>
  )
}

/* ── 0 · Шапка + 1 · Первый экран ── */
const Hero = ({ onCall }: { onCall: () => void }) => (
  <section id="top" className="reg-blue relative overflow-visible" style={{ borderRadius: '34px 34px 0 0' }}>
    <div className="max-w-[1180px] mx-auto px-6 pt-7 relative z-10">
      <div className="hd-grid text-[13px]">
        <div className="flex items-center gap-3"><img src={IMG + 'logo.jpg'} alt="" className="w-10 h-10 rounded-lg" /><div><b className="text-[15px]">Lanmei</b><br /><span className="text-[13px] font-medium"><T>помогаем бизнесу с выкупом и доставкой товаров из Китая</T></span></div></div>
        <div className="desk-only font-medium"><T>Доставили 500+ партий товаров для клиентов из РФ</T></div>
        <div className="text-right"><a href="tel:+8613120794214" className="font-semibold text-[15px]">+86 131 2079 4214</a><br /><a href="mailto:lanmeiltd_sale2@163.com" className="text-[12px] opacity-85 underline decoration-dotted">lanmeiltd_sale2@163.com</a></div>
        <div className="flex items-center gap-2 desk-only">
          <a className="hd-ico" href="https://t.me/lanmei_logistics" target="_blank" rel="noreferrer" aria-label="Telegram">{I.tg}</a>
          <a className="hd-ico" href="tel:+8613120794214" aria-label="MAX" title="Ссылка на MAX — ждём от заказчика">{I.chat}</a>
          <button className="hd-btn" onClick={onCall}>Заказать звонок</button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2.5 mt-12 reveal">
        <span className="pill pill-hero"><i className="dot" />Офис в Шанхае</span>
        <span className="pill pill-hero"><T>Работаем уже более 3 лет</T></span>
      </div>
      <h1 className="display text-center mx-auto mt-6 text-[clamp(32px,4.6vw,66px)] max-w-[20ch] reveal">
        Выкуп и доставка<br />товаров из Китая<br /><span className="display-b">с фиксированной ценой<br />в договоре</span>
      </h1>
      <p className="text-center mx-auto mt-6 max-w-[62ch] text-[17px] reveal" style={{ transitionDelay: '.1s' }}>
        <b><T>Для компаний, которые закупают регулярно и уходят с карго на белый импорт.</T></b> <T>Считаем за 48 часов бесплатно.</T>
      </p>
      <ul className="hero-checks reveal" style={{ transitionDelay: '.16s' }}>
        {['Смета по строкам: товар, комиссия, фрахт, таможня, доставка — отдельно', '30% на запуск производства, 70% — после приёмки партии по вашему ТЗ', 'Фиксируем цену в договоре'].map((t) => <li key={t}><span className="chk"><Check /></span><span><T>{t}</T></span></li>)}
      </ul>
      <Cta light sub="Прозрачный расчёт за 48 часов. Бесплатно, без обязательств." className="items-center mt-8 reveal">Рассчитать стоимость доставки</Cta>
    </div>
    <div className="scene hero-scene mx-auto max-w-[1180px] h-[520px] mt-2 relative z-20" style={{ marginBottom: '-150px' }}>
      <img src={IMG + 'scene-hero.webp'} alt="" style={{ left: '0', bottom: '0', width: '100%' }} />
    </div>
  </section>
)

/* ── 1а · Полоса цифр ── */
const Numbers = () => (
  <section className="reg-paper after-scene pt-[190px] pb-[40px] relative z-10">
    <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {[['50+', 'постоянных клиентов'], ['500+', 'поставок в РФ'], ['Экспортная лицензия', 'официальный экспорт из Китая'], ['95%', 'клиентов становятся постоянными']].map(([n, l], i) => (
        <div key={n} className="card card-paper p-6 reveal" style={{ transitionDelay: `${i * .05}s` }}>
          <div className={`display display-b ${n.length > 5 ? 'text-[clamp(18px,1.5vw,22px)]' : 'text-[clamp(30px,3.2vw,44px)]'}`}>{n}</div>
          <div className="mt-2 text-[14px] text-ink-2"><T>{l}</T></div>
        </div>
      ))}
    </div>
  </section>
)

/* ── 2 · Кому подходит ── */
const WHO = [
  ['Производственные компании', 'Закупаете комплектующие, сырьё или оборудование регулярно и оптом.', 'Фиксируем параметры в измеримом ТЗ и проверяем партию до оплаты 70%. Большинство проблем решаем ещё в Китае.', 'o-17.webp', 'заглушка: фото производства — подберёт заказчик'],
  ['Офлайн-ритейл', 'Товары для дома, инструменты, запчасти. Нужны стабильные поставки ходовых позиций и документы для бухгалтерии.', 'Переходим на официальный белый импорт параллельно текущим поставкам, без дефицита и ущерба для бизнеса, с полным комплектом документов.', 'o-07.webp', 'заглушка: фото торгового зала — подберёт заказчик'],
  ['Селлеры маркетплейсов', 'С 1 октября 2026 года площадки проверяют сертификаты и декларации по госреестрам. С карго карточку могут не допустить.', 'Подбираем документы под вашу категорию: декларации ТР ТС, «Честный знак», требования площадок.', 'o-02.webp', 'заглушка: фото склада селлера — подберёт заказчик'],
  ['Бренды, которые выпускают свой товар', 'Запускаете свой товар или новую модель, но типовая китайская конструкция вас не устраивает — требуется другая фабрика или доработка.', 'Дорабатываем изделие с инженером до серии: образец, ТЗ, контроль производства.', 'cases/degidrator-1.webp', ''],
]
const Who = () => (
  <section id="who" className="reg-paper pt-[70px] pb-[110px]">
    <div className="max-w-[1180px] mx-auto px-6">
      <span className="label reveal">Для кого</span>
      <h2 className="display display-b text-[clamp(30px,4.4vw,62px)] mt-3 reveal">Кому подходит</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-12">
        {WHO.map(([t, who, how, ph, note], i) => (
          <a key={t} href="#brief" className="card card-paper who-card reveal" style={{ transitionDelay: `${i * .05}s` }} title={note || undefined}>
            <div className={`who-photo ${note ? 'is-stub' : ''}`}><img src={IMG + ph} alt="" />{note && <span className="stub-note">{note}</span>}</div>
            <div className="p-6">
              <h3 className="display display-b text-[19px]"><T>{t}</T></h3>
              <p className="mt-3 text-[14px] text-ink-2"><T>{who}</T></p>
              <p className="mt-3 text-[14px] font-semibold" style={{ color: 'var(--blue)' }}><T>{how}</T> →</p>
            </div>
          </a>
        ))}
      </div>
      <div className="card card-char mt-5 p-8 md:p-9 md:flex md:items-center md:gap-10 reveal">
        <h3 className="display display-b text-[clamp(22px,2.2vw,30px)] md:w-[34%]"><T>Компании со своим отделом закупок</T></h3>
        <p className="mt-3 md:mt-0 text-[15.5px] opacity-85"><T>Закрываем часть, где нужен свой человек в Китае со знанием языка: выезд на фабрику, переговоры с производителем на китайском, обсуждение лучших условий, знакомство с производством.</T></p>
      </div>
    </div>
  </section>
)

/* ── 3 · Квиз ── */
type Step = { q: string; kind: 'tiles' | 'input'; a?: string[]; name: string; ph?: string; hint?: string; warn?: string; skip?: boolean }
const STEPS: Step[] = [
  { q: 'Какую категорию товара вы планируете привезти из Китая?', kind: 'tiles', name: 'sku', a: ['Хозтовары и товары для дома', 'Электроника и техника', 'Оборудование и станки', 'Продукты питания', 'Другая категория / нужен поиск'] },
  { q: 'Есть ссылка на товар, который хотите привезти?', kind: 'input', name: 'link', ph: 'Ссылка на товар (1688, Alibaba, Wildberries и т.д.)', hint: 'Нет под рукой — не страшно, можно пропустить и описать на созвоне.', skip: true },
  { q: 'Какой ориентировочный бюджет вы закладываете на закупку партии?', kind: 'tiles', name: 'budget', a: ['до $3 000', '$3 000 – $10 000', '$10 000 – $50 000', 'более $50 000'] },
  { q: 'Сколько товара планируете заказать?', kind: 'input', name: 'qty', ph: 'Количество в штуках или килограммах', warn: 'Берём заказы от 300 кг или от 250 000 ₽' },
  { q: 'В какой город доставить товар?', kind: 'input', name: 'city', ph: 'Город и склад доставки' },
]
const Quiz = () => {
  const [i, setI] = useState(0)
  const [data, setData] = useState<Record<string, string>>({})
  const [val, setVal] = useState('')
  const [sent, setSent] = useState(false)
  const [agree, setAgree] = useState(false)
  const done = i >= STEPS.length
  const next = (v: string) => { const s = STEPS[i]; setData({ ...data, [s.name]: v }); goal('quiz_step_' + (i + 1)); setI(i + 1); setVal('') }
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); if (!agree) return
    const f = new FormData(e.target as HTMLFormElement)
    const payload = { ...data, name: String(f.get('name') || ''), phone: String(f.get('phone') || '') }
    // Обработчик (Telegram, почта, Google-таблица) — адрес ждём от заказчика. Поля: sku, link, budget, qty, city, name, phone.
    ;(window as any).__lanmeiBrief = payload; goal('quiz_submit'); setSent(true)
    setTimeout(() => { window.location.href = 'thanks/' }, 1200)
  }
  return (
    <section id="brief" className="reg-paper pb-[110px]">
      <div className="slab reg-blue relative overflow-hidden py-[80px]">
        <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-6">
            <h2 className="display text-[clamp(28px,3.6vw,50px)] reveal"><T>Ответьте на 5 вопросов — и получите расчёт от 2–5 фабрик</T></h2>
            <p className="mt-5 text-[16px] reveal"><T>После прохождения с вами свяжется менеджер, чтобы уточнить детали. Пришлём расчёт в Telegram или WhatsApp в течение 48 часов. Бесплатно и без обязательств.</T></p>
            <ol className="steps3 mt-7 reveal">
              {[['1', 'Тест — 2 минуты'], ['2', 'Звонок менеджера'], ['3', 'Прозрачный расчёт за 48 ч']].map(([n, t]) => <li key={n}><b>{n}</b><span><T>{t}</T></span></li>)}
            </ol>
            <div className="mt-7 reveal"><LockPlate /></div>
            <div className="mt-7 reveal">
              <div className="text-[13px] opacity-85 mb-3"><T>Так выглядят документы поставки — инвойс, упаковочный лист, экспортная декларация</T></div>
              <div className="flex gap-3 items-end flex-wrap">
                <Doc src="doc-invoice.jpg" w={120} /><Doc src="doc-packing.jpg" w={150} /><Doc src="doc-declaration.jpg" w={150} />
              </div>
            </div>
          </div>
          <div className="md:col-span-6 card card-paper p-7 reveal" style={{ transitionDelay: '.08s' }}>
            <div className="flex justify-between text-[13px] text-ink-2"><span><T>Короткий тест — всего 2 минуты</T></span><span>{Math.min(i + 1, STEPS.length)}/{STEPS.length}</span></div>
            <div className="h-1.5 rounded-full bg-ink/10 overflow-hidden mt-2"><div className="h-full rounded-full" style={{ width: (Math.min(i + 1, STEPS.length) / STEPS.length) * 100 + '%', background: 'var(--blue)', transition: 'width .6s var(--ease)' }} /></div>
            {!done ? (() => { const s = STEPS[i]; return (<>
              <h3 className="display display-b text-[clamp(19px,1.9vw,24px)] mt-6"><T>{s.q}</T></h3>
              {s.kind === 'tiles' ? (
                <div className="grid gap-2.5 mt-5">{s.a!.map((a) => <button key={a} className="q-opt" onClick={() => next(a)}>{a}</button>)}</div>
              ) : (<>
                {s.warn && <p className="warn-line mt-5"><T>{s.warn}</T></p>}
                <input name={s.name} className="q-opt w-full mt-3" placeholder={s.ph} value={val} onChange={(e) => setVal(e.target.value)} />
                {s.hint && <p className="mt-2 text-[12.5px] text-ink-2"><T>{s.hint}</T></p>}
                <div className="flex gap-3 mt-4 flex-wrap">
                  <button className="cta-main cta-sm" type="button" onClick={() => next(val)} disabled={!val && !s.skip}>Дальше<span className="cta-arr" aria-hidden><ArrIco s={16} /></span></button>
                  {s.skip && <button className="btn-ghost" type="button" onClick={() => next('')}>Пропустить</button>}
                </div>
              </>)}
            </>) })() : sent ? (<>
              <h3 className="display display-b text-[clamp(19px,1.9vw,24px)] mt-6">Бриф отправлен</h3>
              <p className="mt-3 text-[15px] text-ink-2"><T>В ближайшее время с вами свяжется наш менеджер.</T></p>
            </>) : (
              <form onSubmit={submit}>
                <h3 className="display display-b text-[clamp(19px,1.9vw,24px)] mt-6"><T>Оставьте имя и телефон, чтобы получить коммерческое предложение</T></h3>
                <input name="name" className="q-opt w-full mt-5" placeholder="Ваше имя" required />
                <input name="phone" className="q-opt w-full mt-3" placeholder="Телефон или Telegram" required />
                <label className="flex gap-2 items-start mt-3 text-[12.5px] text-ink-2"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5" /><span><T>Соглашаюсь с</T> <a href="https://lanmei.ru/privacy/" target="_blank" rel="noreferrer" className="underline decoration-dotted">политикой обработки данных</a></span></label>
                <button className="cta-main w-full mt-4 justify-center" type="submit" disabled={!agree}>Получить расчёт стоимости<span className="cta-arr" aria-hidden><ArrIco /></span></button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 4 · Хотите закупать в Китае, но боитесь… ── */
const Fear = () => (
  <section className="reg-paper pb-[110px]">
    <div className="slab reg-blue relative overflow-hidden py-[90px]">
      <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-6 relative h-[420px] desk-only scene"><img src={IMG + 'o-06.webp'} alt="" style={{ left: '-2%', top: '0', width: '104%' }} /></div>
        <div className="md:col-span-6">
          <h2 className="display text-[clamp(30px,4vw,56px)] reveal">хотите закупать в китае,<br />но боитесь, что смета<br /><span className="display-b">вырастет после оплаты?</span></h2>
          <p className="mt-6 text-[16.5px] max-w-[52ch] reveal"><b><T>Мы фиксируем смету на срок её действия</T></b> <T>и заранее называем строки, которые зависят не от нас. Всё остальное не двигается. Если меняется что-то из списка — новый расчёт вы видите до платежа, а не после.</T></p>
          <ul className="mt-6 grid gap-2 text-[15px] reveal">{['Курс валюты на дату платежа', 'Тариф фрахта, если партия уезжает позже согласованной даты', 'Хранение в порту, если выгрузка задержана не по нашей вине', 'Объём партии, если вы меняете количество после расчёта'].map((c) => <li key={c} className="flex gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-white shrink-0" /><T>{c}</T></li>)}</ul>
          <Cta light sub="Прозрачный расчёт за 48 часов в Telegram или WhatsApp" className="mt-8 reveal">Получить расчёт</Cta>
        </div>
      </div>
    </div>
  </section>
)

/* ── 5 · Смета ── */
const ROWS = ['Товар', 'Комиссия 5% / 10%', 'Фрахт', 'Экспортное оформление', 'Пошлина', 'НДС', 'Сертификация', 'Маркировка', 'Доставка до склада']
const Estimate = () => (
  <section id="estimate" className="reg-char py-[110px]">
    <div className="max-w-[1180px] mx-auto px-6">
      <span className="label label-light reveal">Прозрачный расчёт</span>
      <h2 className="display display-b text-[clamp(30px,4.4vw,62px)] mt-3 reveal"><T>Расчёт, в котором видно все расходы</T></h2>
      <p className="mt-4 text-[16.5px] opacity-80 max-w-[60ch] reveal"><T>За 48 часов даём расчёт, в котором видно стоимость услуг и нашей комиссии.</T></p>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-12">
        <div className="md:col-span-7">
          <div className="card card-paper p-7 md:p-8 reveal">
            <ol className="est-rows">{ROWS.map((r, i) => <li key={r}><span className="num">{String(i + 1).padStart(2, '0')}</span><span><T>{r}</T></span></li>)}</ol>
            <img className="obj desk-only" src={IMG + 'o-08.webp'} alt="" style={{ right: '-2%', bottom: '-4%', width: '36%' }} />
          </div>
          <div className="card card-paper p-7 mt-5 reveal" style={{ transitionDelay: '.06s' }}>
            <div className="flex items-center gap-3 font-semibold" style={{ color: 'var(--blue)' }}><Lock /><span><T>Фиксируем цену в договоре — в юанях или долларах.</T></span></div>
            <p className="mt-2 text-[14.5px] text-ink-2"><T>Закупка идёт в иностранной валюте, поэтому сумма в рублях может измениться вместе с курсом юаня или доллара.</T></p>
          </div>
          <div className="flex flex-wrap items-center gap-6 mt-7 reveal">
            <Cta>Получить смету на мой товар</Cta>
            <div className="text-[14px] opacity-80"><T>5% — стандартный цикл</T><br /><T>10% — товар с доработками</T></div>
          </div>
        </div>
        <div className="md:col-span-5 flex justify-center items-start reveal" style={{ transitionDelay: '.1s' }}>
          <Doc src="doc-estimate.jpg" w={320} cap="Пример реального расчёта — позиции и цифры считаем под ваш товар и маршрут" />
        </div>
      </div>
    </div>
  </section>
)

/* ── 6 · Кейсы — все пять ── */
type Case = { tab: string; big: string; cat: string; sit: string; sol: string; res: string; nums: [string, string][]; sign: string; photos: string[] }
const CASES: Case[] = [
  { tab: 'Сантехника', big: '≈ $52 000 экономии на одном контейнере', cat: 'Латунные и цинковые смесители, сантехника для ритейла', sit: 'Уйти от агента: медленная связь, высокий процент, брак, невыгодные условия по фабрике', sol: 'Вышли на 5 фабрик, сократили цикл производства с 60 до 40 дней, добились отсрочки платежа, ужесточили инспекцию при приёмке', res: 'Себестоимость −7% (≈ $52 000 на контейнере), поставки без срывов сроков', nums: [['≈ $52K', 'экономия на контейнере'], ['−7%', 'снижение себестоимости'], ['60→40 дней', 'цикл производства']], sign: 'Отвечали за поиск фабрик, переговоры, приём и инспекцию товара, организацию экспорта. Работаем вместе полтора года.', photos: ['santehnika-1', 'santehnika-2', 'santehnika-3', 'santehnika-4', 'santehnika-5'] },
  { tab: 'Товары для дома', big: 'Топ-1 продаж и 27 артикулов в категории', cat: 'Товары для дома, бренд Roomlogic', sit: 'Уйти с карго на белый импорт, снизить цену новых SKU, расширить ассортимент', sol: 'Ввели сенсорные мусорные баки вместо обычных пластиковых вёдер, довели категорию до 27 артикулов, добились эксклюзивных условий фабрики', res: 'Отсрочка 3 месяца с момента погрузки, Топ-1 продаж по категории, полный переход на белый импорт', nums: [['27', 'артикулов в категории'], ['3 мес', 'отсрочка платежа'], ['Топ-1', 'продаж по категории']], sign: 'Инженер участвует в оптимизации характеристик товара, сопровождаем клиента в поездках на фабрики. Работаем вместе больше двух лет.', photos: ['roomlogic-1', 'roomlogic-2', 'roomlogic-3', 'roomlogic-4', 'roomlogic-5', 'roomlogic-6', 'roomlogic-7'] },
  { tab: 'Продукты питания', big: '64 контейнера сухофруктов и орехов в год', cat: 'Сухофрукты и орехи из Узбекистана, Турции и Ирана', sit: 'Ежегодный импорт продукции для собственного ритейла и участия в выставках', sol: '10 лет в продуктовой сфере, отобрали поставщиков в трёх странах, выстроили стабильный цикл поставок', res: '64 контейнера в год, собственная розница, участие в отраслевых выставках', nums: [['64', 'контейнера в год'], ['10 лет', 'опыта в продуктах'], ['3', 'страны-поставщика']], sign: 'В перспективе — импорт рыбы в Китай.', photos: ['suhofrukty-1', 'suhofrukty-2', 'suhofrukty-3', 'suhofrukty-4', 'suhofrukty-5', 'suhofrukty-6'] },
  { tab: 'Тяжёлая техника', big: '24 единицы техники в три страны', cat: 'Сельхозтехника для вспахивания', sit: 'Экспорт техники под личное пользование и для ритейла', sol: 'Организовали экспорт 24 единиц техники в Узбекистан, Турцию и Россию', res: '24 единицы техники доставлены в три страны без потерь', nums: [['24', 'единицы техники'], ['3', 'страны экспорта'], ['после отгрузки', 'сопровождаем при браке']], sign: 'После отгрузки продолжаем сопровождать товар при браке или несоответствии.', photos: ['tehnika-1', 'tehnika-2', 'tehnika-3'] },
  { tab: 'Инженерный кейс', big: '10 инженерных доработок за 1,5 месяца до серийного запуска', cat: 'Бытовые дегидраторы, 2 модели', sit: 'Довести китайский дегидратор с типовой «дешёвой» конструкцией до безопасного, коммерчески готового продукта перед запуском продаж', sol: 'Усилили ТЭН до 700 Вт, вынесли плату управления из камеры сушки, добавили термопредохранители, русифицировали прошивку и добавили озонирование, укрепили дверцу и корпус, откалибровали температурный режим', res: 'Оба дегидратора доведены до серийного производства — устранены конструктивные риски, повышены безопасность, надёжность и качество сборки', nums: [['10', 'инженерных доработок'], ['700 Вт', 'мощность ТЭНа после доработки'], ['1,5 мес', 'до готовности к серии']], sign: 'Инженер вёл доработку от технического аудита до финального образца, готового к серии.', photos: ['degidrator-1', 'degidrator-2', 'degidrator-3', 'degidrator-4', 'degidrator-5'] },
]
const Cases = () => {
  const [c, setC] = useState(0)
  const [p, setP] = useState(0)
  const k = CASES[c]
  const pick = (n: number) => { setC(n); setP(0) }
  return (
    <section id="case" className="reg-paper py-[110px]">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div><span className="label reveal">Кейсы</span><h2 className="display display-b text-[clamp(30px,4.4vw,62px)] mt-3 reveal">Примеры поставок</h2></div>
          <div className="display text-[clamp(20px,2vw,28px)] text-ink-2">{String(c + 1).padStart(2, '0')} / 05</div>
        </div>
        <div className="flex gap-2 flex-wrap mt-8 reveal">{CASES.map((x, n) => <button key={x.tab} className={`tab ${n === c ? 'is-on' : ''}`} onClick={() => pick(n)}>{x.tab}</button>)}</div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-8">
          <div className="md:col-span-6">
            <div className="card gallery"><img src={IMG + 'cases/' + k.photos[p] + '.webp'} alt={k.cat} /></div>
            <div className="flex gap-2 mt-3 flex-wrap">{k.photos.map((ph, n) => <button key={ph} className={`thumb ${n === p ? 'is-on' : ''}`} onClick={() => setP(n)}><img src={IMG + 'cases/' + ph + '.webp'} alt="" /></button>)}</div>
          </div>
          <div className="md:col-span-6">
            <div className="display display-b text-[clamp(24px,2.6vw,36px)]"><T>{k.big}</T></div>
            <div className="mt-2 text-[14px] text-ink-2"><T>{k.cat}</T></div>
            <dl className="case-rows mt-6">
              <dt>Ситуация</dt><dd><T>{k.sit}</T></dd>
              <dt>Решение</dt><dd><T>{k.sol}</T></dd>
              <dt>Результат</dt><dd><T>{k.res}</T></dd>
            </dl>
            <div className="grid grid-cols-3 gap-3 mt-6">{k.nums.map(([n, l]) => <div key={l} className="card card-paper p-4"><div className="display display-b text-[clamp(18px,1.8vw,26px)]">{n}</div><div className="text-[12.5px] text-ink-2 mt-1"><T>{l}</T></div></div>)}</div>
            <p className="mt-5 text-[13.5px] text-ink-2"><T>{k.sign}</T></p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 7 · Оплата и ответственность ── */
const Guarantee = () => (
  <section id="guarantee" className="reg-char py-[110px]">
    <div className="max-w-[1180px] mx-auto px-6">
      <span className="label label-light reveal">Ответственность</span>
      <h2 className="display display-b text-[clamp(30px,4.4vw,62px)] mt-3 max-w-[18ch] reveal"><T>Отвечаем за результат — вот как это устроено</T></h2>
      <div className="chain mt-12">
        {[['30%', 'Запуск производства', 'аванс запускает партию по договору', false], ['Проверка', 'Отчёт о качестве партии', '«соответствует / не соответствует» — до второго платежа', false], ['70%', 'Только после вашего согласия', 'отклонения фабрика исправляет до оплаты остатка', true]].map(([big, t, d, hl], i) => (
          <div key={t as string} className={`card ${hl ? 'card-blue' : 'card-paper'} p-7 reveal`} style={{ transitionDelay: `${i * .06}s` }}>
            <div className="display display-b text-[clamp(30px,3.4vw,48px)]">{big as string}</div>
            <div className="mt-3 font-semibold text-[17px]"><T>{t as string}</T></div>
            <div className={`mt-1 text-[14.5px] ${hl ? 'opacity-90' : 'text-ink-2'}`}><T>{d as string}</T></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-5">
        {[['Цена в договоре', 'фиксируем в юанях или долларах до запуска производства', true], ['90 дней', 'на претензии к качеству и количеству', false], ['Договор с фабрикой', 'юридическая опора для претензий', false], ['Спор ведём мы', 'на китайском, а не ваша переписка в мессенджере', false], ['Комиссия 5–10%', 'известна заранее, фрахт — отдельной строкой', false]].map(([t, d, hl], i) => (
          <div key={t as string} className="card p-5 reveal" style={{ background: hl ? 'var(--blue)' : 'var(--char-2)', color: '#fff', transitionDelay: `${i * .05}s` }}>
            <div className="display display-b text-[17px]"><T>{t as string}</T></div>
            <div className="mt-2 text-[13.5px] opacity-80"><T>{d as string}</T></div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ── 8 · Как проходит поставка — 6 этапов ── */
const STAGES = [['01', 'Поиск и аудит 2–5 фабрик', 'юридическая история и реальные мощности', 'o-15.webp'], ['02', 'Образец и измеримое ТЗ', 'габариты, материал, вес, упаковка, количество', 'o-16.webp'], ['03', 'Договор и аванс 30%', 'запуск производства по заранее утверждённому образцу', 'o-12.webp'], ['04', 'Производство и инспекция', 'фото и видео критичных узлов, протокол отклонений', 'o-17.webp'], ['05', 'Приёмка и 70%', 'остаток — только после вашего согласия', 'o-02.webp'], ['06', 'Экспорт, таможня, доставка', 'документы и доставка до склада в России. Сроки таможни и доставки по России зависят от товара', 'o-18.webp']]
const Process = () => (
  <section id="process" className="reg-paper py-[110px]">
    <div className="max-w-[1180px] mx-auto px-6">
      <span className="label reveal">Полный цикл</span>
      <h2 className="display display-b text-[clamp(30px,4.4vw,62px)] mt-3 reveal"><T>От поиска фабрики до вашего склада</T></h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-12">
        {STAGES.map(([n, t, d, ph], i) => (
          <div key={n} className={`card ${i % 2 ? 'card-paper' : 'card-char'} reveal`} style={{ transitionDelay: `${i * .05}s` }}>
            <div className="stage-photo"><img src={IMG + ph} alt="" /></div>
            <div className="p-6"><span className="num">этап {n}</span><h3 className="display display-b text-[19px] mt-3"><T>{t}</T></h3><p className="mt-2 text-[14px] opacity-75"><T>{d}</T></p></div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ── 9 · Документы ── */
const DOCS = [['Экспортная лицензия фабрики', 'Подтверждаем право производителя на экспорт до запуска партии.'], ['Инвойс и упаковочный лист', 'Состав партии, вес, объём и стоимость по позициям.'], ['Схема таможенного оформления', 'Коды ТН ВЭД, расчёт пошлины и НДС, порядок выпуска.'], ['Сертификация и маркировка', 'Декларации ТР ТС, «Честный знак» и требования площадок.'], ['Договор с приложением по ТЗ', 'Измеримые параметры, сроки, порядок претензий и гарантия от фабрики.'], ['Результат', 'Полный комплект документов с постоянным сопровождением.']]
const Docs = () => (
  <section id="docs" className="reg-paper pb-[110px]">
    <div className="max-w-[1180px] mx-auto px-6">
      <span className="label reveal">Полный комплект документов</span>
      <h2 className="display display-b text-[clamp(30px,4.4vw,62px)] mt-3 max-w-[18ch] reveal"><T>Поставки в белую — это уверенность и спокойствие</T></h2>
      <p className="mt-4 text-[16.5px] text-ink-2 max-w-[60ch] reveal"><T>Подбираем перечень документов под вашу категорию товара, с гарантией на случай брака.</T></p>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-12 items-start">
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DOCS.map(([t, d], i) => <div key={t} className={`card ${i === 5 ? 'card-blue' : 'card-paper'} p-6 reveal`} style={{ transitionDelay: `${i * .04}s` }}><div className="display display-b text-[17px]"><T>{t}</T></div><p className={`mt-2 text-[14px] ${i === 5 ? 'opacity-90' : 'text-ink-2'}`}><T>{d}</T></p></div>)}
        </div>
        <div className="md:col-span-5 relative min-h-[520px] desk-only doc-fan reveal">
          <Doc src="doc-invoice.jpg" w={240} cap="инвойс" style={{ position: 'absolute', left: 0, top: 0 }} />
          <Doc src="doc-packing.jpg" w={260} cap="упаковочный лист" style={{ position: 'absolute', right: 0, top: 40 }} />
          <Doc src="doc-declaration.jpg" w={280} cap="экспортная декларация" style={{ position: 'absolute', left: 60, bottom: 0 }} />
        </div>
      </div>
    </div>
  </section>
)

/* ── 10 · Команда ── */
const TEAM = [['osnovatel.jpg', 'Юлия Бурматова', 'Основатель', 'Ведёт переговоры с фабрикой и лично инспектирует партии'], ['operationist.jpg', 'Норал', 'Операционист', 'Отвечает за документы, таможню и сроки — в курсе всего по контракту'], ['manager-poisk.jpg', 'Cassie', 'Менеджер закупа', 'Опыт более 5 лет — находит самую подходящую фабрику под задачу'], ['manager-sales.jpg', 'Анфиса', 'Менеджер по продажам', 'Ведёт клиента от заявки до расчёта себестоимости, всегда на связи'], ['engineer.jpg', 'Игорь Кузьмин', 'Инженер', 'Ведёт товары из категории техники и электроники']]
const Team = () => (
  <section id="team" className="reg-paper pb-[110px]">
    <div className="max-w-[1180px] mx-auto px-6">
      <span className="label reveal">Экспертиза</span>
      <h2 className="display display-b text-[clamp(30px,4.4vw,62px)] mt-3 reveal">Команда</h2>
      <p className="mt-4 text-[16.5px] text-ink-2 max-w-[64ch] reveal"><T>Команда экспертов закрывает все вопросы и сопровождает контракт от поиска фабрики до получения товара в надлежащем состоянии в полном соответствии с ТЗ.</T></p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-12">
        {TEAM.map(([ph, name, role, d], i) => (
          <div key={name} className="reveal" style={{ transitionDelay: `${i * .05}s` }}>
            <img src={IMG + 'team/' + ph} alt={name} className="card w-full aspect-[4/5] object-cover" />
            <div className="mt-3 font-semibold text-[16px]">{name}</div><div className="text-[13px]" style={{ color: 'var(--blue)' }}>{role}</div>
            <div className="text-ink-2 text-[13.5px] mt-1"><T>{d}</T></div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ── 11 · Вопросы — 12 ── */
const FAQ: [string, string][] = [
  ['Будут ли доплаты после оплаты?', 'Смета приходит по строкам: товар, комиссия, фрахт, экспортное оформление, пошлина, НДС, сертификация, маркировка и доставка. Комиссия — 5% за стандартный цикл и 10% за товар с доработками. Цену фиксируем в договоре в юанях или долларах, поэтому сумма в рублях может измениться вместе с курсом.'],
  ['Карго всё равно дешевле?', 'По видимой ставке — да. Но в ней нет документов, пошлины и НДС, и нет ответственности за брак. Мы считаем обе схемы в одинаковых статьях и показываем разницу в себестоимости единицы на вашем складе. Если после честного сравнения карго выигрывает — так и скажем.'],
  ['Как узнать стоимость заранее?', 'Ответьте на 5 вопросов на сайте — менеджер уточнит детали, и в течение 48 часов пришлём расчёт в Telegram или WhatsApp. Бесплатно и без обязательств.'],
  ['Можно ли оплатить в рублях и с НДС?', 'Да, оплатить можно в рублях и с НДС. Порядок оплаты и документы для бухгалтерии согласуем при расчёте.'],
  ['Какие документы я получу?', 'Инвойс и упаковочный лист, экспортную декларацию, схему таможенного оформления с кодами ТН ВЭД и расчётом пошлины и НДС, декларации ТР ТС и маркировку «Честный знак», если они нужны вашей категории, и договор с приложением по ТЗ.'],
  ['Подойдут ли документы для маркетплейсов?', 'С 1 октября 2026 года площадки проверяют сертификаты и декларации по госреестрам. Подбираем перечень документов под вашу категорию: декларации ТР ТС, «Честный знак», требования площадок.'],
  ['Как вы проверяете фабрику?', 'Проверяем юридическую историю и реальные производственные мощности, сравниваем 2–5 фабрик и показываем картину по каждой. Затем утверждаем образец, фиксируем параметры в ТЗ и проверяем партию до того, как уйдут 70% оплаты.'],
  ['Можно ли работать с нашим поставщиком?', 'Да, можем работать с вашим поставщиком. Укажите его при расчёте — в квизе есть поле для ссылки на товар.'],
  ['Кто вернёт деньги за брак?', 'Определение брака, порядок доказательств, сроки ответа и лимиты компенсации закреплены в договоре. На претензии — 90 дней. Претензию с фабрикой ведём мы, на китайском. Серия проверяется до оплаты остатка, поэтому большинство проблем решается ещё в Китае.'],
  ['Почему аванс 30%?', 'Это стандартная схема запуска производства в Китае: 30% фабрика получает на закупку сырья, 70% — после приёмки серии. После оплаты вы получаете календарь поставки с контрольными точками.'],
  ['Сколько идёт поставка?', 'Срок производства и доставки называем в смете по датам. Сроки таможни и доставки по России зависят от товара.'],
  ['Можно ли отследить партию в пути?', 'Да. Менеджер отслеживает ваш груз и сообщает о его перемещении.'],
]
const Faq = () => {
  const [open, setOpen] = useState<number | null>(0)
  useEffect(() => {
    const s = document.createElement('script'); s.type = 'application/ld+json'
    s.text = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) })
    document.head.appendChild(s); return () => { document.head.removeChild(s) }
  }, [])
  return (
    <section id="faq" className="reg-paper pb-[110px]">
      <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <span className="label reveal">Вопросы</span>
          <h2 className="display display-b text-[clamp(28px,2.9vw,40px)] mt-3 reveal"><T>Ответы на частые вопросы</T></h2>
          <div className="mt-6 reveal"><Cta href="#contacts">Задать свой вопрос</Cta></div>
        </div>
        <div className="md:col-span-8 grid gap-3">
          {FAQ.map(([q, a], i) => (
            <div key={q} className={`card card-paper reveal faq-item ${open === i ? 'is-open' : ''}`} style={{ transitionDelay: `${i * .03}s` }}>
              <button className="w-full text-left flex items-center justify-between gap-6 p-6" onClick={() => setOpen(open === i ? null : i)}><span className="display display-b text-[18px]"><T>{q}</T></span><span className="faq-plus" aria-hidden /></button>
              <div className="faq-body"><div><p className="px-6 pb-6 text-[15px] text-ink-2 max-w-[68ch]"><T>{a}</T></p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 12 · Подвал с формой «Остались вопросы?» ── */
const Footer = () => {
  const [sent, setSent] = useState(false)
  return (
    <footer id="contacts" className="reg-char pt-[80px] pb-10" style={{ borderRadius: '0 0 34px 34px' }}>
      <div className="max-w-[1180px] mx-auto px-6 mb-12"><img src={IMG + 'o-14.webp'} alt="Маршрут Шанхай — Москва" className="card w-full h-[380px] object-cover" /></div>
      <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-6">
          <div className="flex items-center gap-3"><img src={IMG + 'logo.jpg'} alt="" className="w-10 h-10 rounded-lg" /><b className="text-[18px]">Lanmei</b></div>
          <p className="mt-4 text-[15px] opacity-80 max-w-[46ch]"><T>Помогаем бизнесу организовать надёжные поставки из Китая, от проверенных поставщиков с полным комплектом документов.</T></p>
          <a href="tel:+8613120794214" className="display display-b block text-[clamp(26px,3.2vw,44px)] mt-6">+86 131 2079 4214</a>
          <div className="mt-3 text-[15px] grid gap-1.5 opacity-90">
            <a href="mailto:lanmeiltd_sale2@163.com" className="underline decoration-dotted">lanmeiltd_sale2@163.com</a>
            <div><a href="https://t.me/lanmei_logistics" target="_blank" rel="noreferrer" className="underline decoration-dotted">Telegram</a> · <a href="https://wa.me/8613120794214" target="_blank" rel="noreferrer" className="underline decoration-dotted">WhatsApp</a> · <span>WeChat: тот же номер</span></div>
            <div className="opacity-75"><T>Шанхай, район Пудун, ул. Шанчэнлу, башня «Лэкай», офис 2408</T></div>
          </div>
        </div>
        <div className="md:col-span-6 card card-paper p-7">
          {sent ? (<><h3 className="display display-b text-[22px]">Заявка отправлена</h3><p className="mt-3 text-[15px] text-ink-2"><T>В ближайшее время с вами свяжется наш менеджер.</T></p></>) : (
            <form onSubmit={(e) => { e.preventDefault(); goal('contact_submit'); setSent(true) }}>
              <h3 className="display display-b text-[22px]">Остались вопросы?</h3>
              <p className="mt-2 text-[14.5px] text-ink-2"><T>Оставьте номер — в ближайшее время с вами свяжется наш менеджер.</T></p>
              <div className="mt-4"><LockPlate /></div>
              <div className="grid gap-3 mt-4">
                <input name="name" className="q-opt" placeholder="Ваше имя" required />
                <input name="email" className="q-opt" placeholder="Email (необязательно)" type="email" />
                <input name="phone" className="q-opt" placeholder="Телефон" inputMode="tel" required />
                <button className="cta-main justify-center" type="submit">Получить консультацию<span className="cta-arr" aria-hidden><ArrIco /></span></button>
              </div>
              <p className="mt-3 text-[12px] text-ink-2"><T>Нажимая кнопку, вы соглашаетесь с</T> <a href="https://lanmei.ru/privacy/" target="_blank" rel="noreferrer" className="underline decoration-dotted">политикой обработки данных</a>.</p>
            </form>
          )}
        </div>
      </div>
      <div className="max-w-[1180px] mx-auto px-6 mt-12 flex flex-wrap justify-between gap-4 text-[12.5px] opacity-70">
        <span>© 2026 Lanmei. Белые поставки из Китая.</span><a href="https://lanmei.ru/privacy/" target="_blank" rel="noreferrer" className="underline decoration-dotted">Политика конфиденциальности</a>
      </div>
    </footer>
  )
}

const FloatCta = () => {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const hero = document.getElementById('top'); const quiz = document.getElementById('brief')
    if (!hero || !quiz) return
    let pastHero = false, atQuiz = false
    const io = new IntersectionObserver((es) => { es.forEach((e) => { if (e.target === hero) pastHero = !e.isIntersecting; if (e.target === quiz) atQuiz = e.isIntersecting }); setShow(pastHero && !atQuiz) }, { threshold: 0.05 })
    io.observe(hero); io.observe(quiz); return () => io.disconnect()
  }, [])
  return <a href="#brief" className={`float-cta cta-main ${show ? 'is-on' : ''}`}>Рассчитать доставку<span className="cta-arr" aria-hidden><ArrIco s={16} /></span></a>
}
const Cookie = () => {
  const [ok, setOk] = useState(() => { try { return localStorage.getItem('lm-cookie') === '1' } catch { return false } })
  if (ok) return null
  return <div className="cookie"><span><T>Мы используем cookie, чтобы сайт работал корректно.</T></span><button onClick={() => { try { localStorage.setItem('lm-cookie', '1') } catch {} setOk(true) }}>Хорошо</button></div>
}

export default function App() {
  useReveal()
  const [open, setOpen] = useState(false)
  const [call, setCall] = useState(false)
  useEffect(() => { document.body.style.overflow = open || call ? 'hidden' : '' }, [open, call])
  return (
    <>
      <Rail open={open} setOpen={setOpen} />
      <FloatCta />
      <CallModal open={call} onClose={() => setCall(false)} />
      <Cookie />
      <div className="page">
        <Hero onCall={() => setCall(true)} /><Numbers /><Who /><Quiz /><Fear /><Estimate /><Cases /><Guarantee /><Process /><Docs /><Team /><Faq /><Footer />
      </div>
    </>
  )
}
