import { useEffect, useState } from 'react'

/*
  Lanmei — прототип по цифрам референса #17 «Перевозка грузов из Китая» (17.09.2026, вторая сборка).
  Снято с эталона в полном разрешении и повторено здесь:
    · заголовок-гигант lowercase ПО ЦЕНТРУ, под ним сцена предметов на всю ширину, сцена пробивает границу
      в следующий блок (в #17 — 13 предметов);
    · цвет бренда — плоский холст целых секций (в #17 красный 19,5 % пикселей), тёмного 21 %, светлого 41 %;
    · предмет в карточке 45–60 % площади, цельный; форма + предмет выше формы;
    · три регистра: цвет → светлый → графит → цвет; страница в тёмной рамке, слева рейка меню.
  Предметы — серия Higgsfield 17.09 (seedream_v4_5, якорь-элемент lanmei-boxes-anchor), 14 кадров по
  СМЕТА-предметов-Higgsfield.md, имена файлов = номера кадров (scene-hero, o-02 … o-14).
*/

const IMG = 'img/'
// Заглушки → файлы серии. Пока серия не сгенерирована, слот показывает ближайшую вырезку.
const O: Record<string, string> = Object.fromEntries(['02','03','04','05','06','07','08','09','10','11','12','13','14'].map((n) => ['o-' + n, 'o-' + n + '.webp']))
const obj = (k: string) => IMG + (O[k] ?? k)

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.1 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

const Arrow = () => <span aria-hidden>↗</span>
/* Главная CTA: крупная пилюля с кругом-стрелкой, подпись выгоды под ней. Одна на экран, тянет к действию. */
const Cta = ({ children, sub, light = false, className = '' }: { children: React.ReactNode; sub?: string; light?: boolean; className?: string }) => (
  <div className={`cta-wrap ${className}`}>
    <a href="#quiz" className={`cta-main ${light ? 'cta-light' : ''}`}>{children}<span className="cta-arr" aria-hidden><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg></span></a>
    {sub && <span className="cta-sub">{sub}</span>}
  </div>
)
/* Документ клиента: оригинальный скан, без поворота и вырезки, в рамке бумаги.
   Ширина ≤ половины исходника — на ретине скан не растягивается и не «разрушается». */
const Doc = ({ src, w, cap, className = '', style }: { src: string; w: number; cap?: string; className?: string; style?: React.CSSProperties }) => (
  <figure className={`paper ${className}`} style={{ width: w, ...style }}>
    <img src={IMG + src} alt={cap || 'Документ Lanmei'} />
    {cap && <figcaption>{cap}</figcaption>}
  </figure>
)

/* ── Рейка слева, как в #17 ── */
const I = {
  tg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4 3 11l6 2 2 6 3-4 5 3z" /><path d="m9 13 9-8" /></svg>,
  chat: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v11H8l-4 4z" /><path d="M8 9h8M8 12h5" /></svg>,
  phone: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>,
}
const MENU = [['#why', 'почему не карго'], ['#estimate', 'что в смете'], ['#risk', 'гарантии'], ['#process', 'как работаем'], ['#payment', 'оплата из россии'], ['#faq', 'вопросы'], ['#quiz', 'расчёт'], ['#contacts', 'контакты']]
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
        {MENU.map(([h, t], i) => <a key={h} href={h} className="display display-b block text-[clamp(30px,5vw,64px)] leading-[1.05] menu-link" style={{ transitionDelay: `${0.06 + i * 0.05}s` }}>{t}</a>)}
        <div className="mt-10 text-white/70 text-[15px]">+86 131 2079 4214 · Шанхай</div>
      </nav>
    </div>
  </>
)

/* ── 1 · Герой. Шапка в строку, заголовок по центру, сцена под ним ── */
const Hero = () => (
  <section id="top" className="reg-blue relative overflow-visible" style={{ borderRadius: '34px 34px 0 0' }}>
    <div className="max-w-[1180px] mx-auto px-6 pt-8 pb-0 relative z-10">
      <div className="flex flex-wrap items-center justify-between gap-4 text-[13px]">
        <div className="flex items-center gap-3"><img src={IMG + 'logo.jpg'} alt="" className="w-9 h-9 rounded-lg" /><div><b>Lanmei</b> — белый импорт<br />из Китая, Шанхай</div></div>
        <div className="desk-only">юрлицо в Китае<br /><span className="opacity-80">счёт в китайском банке</span></div>
        <div className="desk-only">пишите нам:<br /><a href="https://t.me/lanmei_logistics" target="_blank" rel="noreferrer" className="underline decoration-dotted">в Telegram</a> или <a href="https://wa.me/8613120794214" target="_blank" rel="noreferrer" className="underline decoration-dotted">WhatsApp</a></div>
        <a href="tel:+8613120794214" className="font-semibold text-[15px]">+86 131 2079 4214</a>
      </div>

      <h1 className="display text-center mx-auto mt-14 text-[clamp(34px,5.4vw,80px)] max-w-[18ch] reveal">
        полная стоимость поставки из китая —<br /><span className="display-b">до первого платежа</span>
      </h1>
      <p className="text-center mx-auto mt-6 max-w-[62ch] text-[17px] reveal" style={{ transitionDelay: '.1s' }}>
        <b>Для селлеров и оптовиков, которые закупают регулярно и уходят с карго на белый импорт.</b> Смета по строкам
        до вашего склада за 48 часов: товар, комиссия, фрахт, таможня, доставка. Оплата 30 % на запуск, 70 % после приёмки по вашему ТЗ.
      </p>
      <Cta light sub="Бесплатно · смета по строкам за 48 часов · без обязательств" className="items-center mt-8 reveal">Рассчитать мою поставку</Cta>
    </div>

    {/* Сцена: как в #17 — предметы одной семьи под заголовком, край уходит в светлый блок. Кадр №1 серии. */}
    <div className="scene hero-scene mx-auto max-w-[1180px] h-[560px] mt-4 relative z-20" style={{ marginBottom: "-150px" }}>
      <img src={IMG + 'scene-hero.webp'} alt="" style={{ left: '0', bottom: '0', width: '100%' }} />
    </div>
  </section>
)

/* ── 2 · Бенто «почему это не карго.» — сетка #17: 7+5 / 5+7 / широкая цветная ── */
const bento = [
  { span: 'md:col-span-7', t: 'посчитано.', s: <><b>Комиссия 5 %</b> за стандартный цикл, 10 % — за товар с доработкой. Каждая строка сметы отдельно, до договора, а не «по факту».</>, o: 'o-02', os: { right: '5%', bottom: '4%', width: '32%' } },
  { span: 'md:col-span-5', t: 'после приёмки.', s: <><b>70 % уходят</b>, когда партия принята по вашему ТЗ и вы увидели фото- и видеоотчёт.</>, o: 'o-03', os: { right: '3%', bottom: '6%', width: '50%' } },
  { span: 'md:col-span-5', t: 'спор — наш.', s: <><b>При браке возвращаем</b> стоимость бракованной продукции с учётом логистики. С фабрикой спорим мы, а не вы.</>, o: 'o-04', os: { right: '2%', bottom: '2%', width: '26%' } },
  { span: 'md:col-span-7', t: 'с документами.', s: <><b>Инвойс, упаковочный лист, экспортная декларация</b> — на каждую партию. С 1 октября 2026 площадки проверяют карточки по реестрам, у карго документов нет.</>, doc: { src: 'doc-declaration.jpg', w: 250, cap: 'экспортная декларация, печать таможни КНР' } },
  { span: 'md:col-span-12', blue: true, t: 'мы в шанхае.', s: <><b>Офис в Шанхае, юрлицо в Китае, счёт в банке.</b> Основатель ведёт переговоры с фабриками на китайском и лично — команда ниже, с именами и ролями.</>, o: 'o-05', os: { right: '8%', bottom: '2%', width: '24%' } },
]
const Bento = () => (
  <section id="why" className="reg-paper after-scene pt-[200px] pb-[110px] relative z-10">
    <div className="max-w-[1180px] mx-auto px-6">
      <h2 className="display display-b text-[clamp(30px,4.4vw,62px)] reveal">почему это не карго.</h2>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-12">
        {bento.map((b, i) => (
          <div key={i} className={`card ${b.blue ? 'card-blue' : 'card-char'} ${b.span} ${b.doc ? 'md:pr-[300px]' : ''} reveal p-8 md:p-9 min-h-[340px] flex flex-col justify-end`} style={{ transitionDelay: `${i * .06}s` }}>
            <span className="num absolute top-7 left-8">0{i + 1}</span>
            <h3 className={`display display-b ${b.doc ? 'text-[clamp(24px,2.4vw,34px)]' : 'text-[clamp(26px,3vw,42px)]'} relative z-10`}>{b.t}</h3>
            <p className="mt-3 text-[15.5px] max-w-[30ch] relative z-10 opacity-90">{b.s}</p>
            {b.o && <img className="obj" src={obj(b.o)} alt="" style={b.os as React.CSSProperties} />}
            {b.doc && <Doc src={b.doc.src} w={b.doc.w} cap={b.doc.cap} className="doc-in-card desk-only" style={{ right: 28, top: '50%', transform: 'translateY(-50%)' }} />}
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ── 3 · Синяя плита «что может измениться» — как «хотите заказать партию, но сомневаетесь» в #17:
      сцена слева, текст справа ступенькой, круглая кнопка ── */
const changes = ['Курс валюты на дату платежа', 'Тариф фрахта, если партия уезжает позже согласованной даты', 'Хранение в порту, если выгрузка задержана не по нашей вине', 'Объём партии, если вы меняете количество после расчёта']
const Changes = () => (
  <section className="reg-paper pb-[110px]">
    <div className="slab reg-blue relative overflow-hidden py-[90px]">
      <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-6 relative h-[420px] desk-only scene">
          <img src={obj('o-06')} alt="" style={{ left: '-2%', top: '0', width: '104%' }} />
        </div>
        <div className="md:col-span-6">
          <h2 className="display text-[clamp(30px,4vw,56px)] reveal">хотите закупать в китае,<br />но боитесь, что смета<br /><span className="display-b">вырастет после оплаты?</span></h2>
          <p className="mt-6 text-[16.5px] max-w-[52ch] reveal"><b>Мы фиксируем смету на срок её действия</b> и заранее называем строки, которые зависят не от нас. Всё остальное не двигается. Если меняется что-то из списка — новый расчёт вы видите до платежа, а не после.</p>
          <ul className="mt-6 grid gap-2 text-[15px] reveal">{changes.map((c) => <li key={c} className="flex gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-white shrink-0" />{c}</li>)}</ul>
          <p className="mt-5 text-[12.5px] opacity-75 italic">*Точный список строк и срок действия сметы подтверждает владелец.</p>
          <Cta light sub="Ответ за 48 часов в Telegram или WhatsApp" className="mt-8 reveal">Получить смету по строкам</Cta>
        </div>
      </div>
    </div>
  </section>
)

/* ── 4 · Графит «что входит в смету» — четыре карточки #17 «виды доставки»: чередование, пилюли, предмет 55–60 % ── */
const est = [
  { t: 'Товар на фабрике', s: 'по счёту фабрики, в юанях', tags: ['цена в контракте', 'CNY'], o: 'o-07', os: { right: '5%', bottom: '4%', width: '30%' } },
  { t: 'Наша комиссия', s: 'известна до договора, отдельной строкой', tags: ['5 % стандарт', '10 % с доработкой'], o: 'o-08', os: { right: '2%', bottom: '3%', width: '42%' }, paper: true },
  { t: 'Фрахт и экспорт', s: 'море, консолидация, экспортное оформление', tags: ['40–60 дней', 'по тарифу'], o: 'o-09', os: { right: '-2%', bottom: '4%', width: '60%' } },
  { t: 'Таможня и доставка', s: 'платежи по ТН ВЭД, маркировка, до склада', tags: ['по коду ТН ВЭД', 'до вашего склада'], o: 'o-10', os: { right: '-2%', bottom: '4%', width: '60%' } },
]
const Estimate = () => (
  <section id="estimate" className="reg-char py-[110px]">
    <div className="max-w-[1180px] mx-auto px-6">
      <h2 className="display display-b text-[clamp(30px,4.4vw,62px)] reveal">что входит в смету,<br />цены и сроки.</h2>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-12">
        {est.map((c, i) => (
          <div key={c.t} className={`card ${c.paper ? 'card-paper' : 'card-char'} ${i % 3 === 0 ? 'md:col-span-7' : 'md:col-span-5'} reveal p-8 md:p-9 min-h-[320px] flex flex-col`} style={{ transitionDelay: `${i * .06}s` }}>
            <h3 className="display display-b text-[clamp(22px,2.2vw,30px)] relative z-10">{c.t}</h3>
            <p className="mt-2 text-[15px] opacity-75 relative z-10">{c.s}</p>
            <div className="flex gap-2 flex-wrap mt-5 relative z-10">{c.tags.map((t) => <span key={t} className="pill">{t}</span>)}</div>
            <a href="#quiz" className="cta-main cta-sm mt-auto self-start relative z-10">Рассчитать смету<span className="cta-arr" aria-hidden><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg></span></a>
            {c.photo
              ? <img src={obj(c.o)} alt="" className="absolute right-0 top-0 h-full w-[55%] object-cover desk-only" style={{ maskImage: 'linear-gradient(to right, transparent, #000 35%)', WebkitMaskImage: 'linear-gradient(to right, transparent, #000 35%)' }} />
              : <img className="obj" src={obj(c.o)} alt="" style={c.os as React.CSSProperties} />}
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ── 5 · Светлый «вы ничем не рискуете.» — фото-карточка + три белых, как в #17 ── */
const Risk = () => (
  <section id="risk" className="reg-paper py-[110px]">
    <div className="max-w-[1180px] mx-auto px-6">
      <h2 className="display display-b text-[clamp(30px,4.4vw,62px)] reveal">вы ничем не рискуете.</h2>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-12">
        <div className="card md:col-span-7 min-h-[380px] reveal">
          <img src={IMG + 'proverka.jpg'} alt="Приёмка партии металлических дверей на фабрике" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute left-7 bottom-7 right-7 text-white">
            <div className="display display-b text-[clamp(22px,2.4vw,32px)]" style={{ textShadow: '0 4px 24px rgba(0,0,0,.5)' }}>приёмка партии металлических дверей на фабрике</div>
            <p className="mt-3 text-[14px] opacity-90">Фото клиента. Инвойс и экспортная декларация ниже — по этой же поставке, код ТН ВЭД 7308 30.</p>
            <div className="flex flex-wrap gap-8 mt-5 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,.25)' }}>{[['−7 %', 'себестоимость'], ['$52 000', 'на контейнере'], ['60 → 40', 'дней производство']].map(([n, l]) => <div key={l}><div className="display display-b text-[clamp(20px,2.2vw,28px)]">{n}</div><div className="text-[12.5px] opacity-90">{l}</div></div>)}</div>
            <p className="mt-2 text-[12.5px] opacity-80">Другой кейс: латунные смесители, пять фабрик, партия принята. Цифры со слов клиента, фото по нему нет.</p>
          </div>
        </div>
        <div className="card card-paper md:col-span-5 p-9 reveal" style={{ transitionDelay: '.06s' }}>
          <span className="num">01</span>
          <h3 className="display display-b text-[26px] mt-10 relative z-10">30 % на запуск,<br />70 % после приёмки</h3>
          <p className="mt-4 text-[15px] text-ink-2 max-w-[28ch] relative z-10">Остаток уходит после того, как партия принята по вашему ТЗ и вы увидели фото- и видеоотчёт.</p>
          <img className="obj" src={obj('o-12')} alt="" style={{ right: '5%', bottom: '4%', width: '34%' }} />
        </div>
        <div className="card card-paper md:col-span-6 p-9 reveal" style={{ transitionDelay: '.12s' }}>
          <span className="num">02</span>
          <h3 className="display display-b text-[26px] mt-10 relative z-10">90 дней на претензии</h3>
          <p className="mt-4 text-[15px] text-ink-2 max-w-[30ch] relative z-10">По качеству и количеству с даты прибытия. При браке возвращаем стоимость бракованной продукции с учётом логистики.</p>
          <img className="obj" src={obj('o-11')} alt="" style={{ right: '5%', bottom: '4%', width: '34%' }} />
        </div>
        <div className="card card-paper md:col-span-6 p-9 reveal" style={{ transitionDelay: '.18s' }}>
          <span className="num">03</span>
          <h3 className="display display-b text-[26px] mt-10 relative z-10 max-w-[13ch]">Документы на каждую партию</h3>
          <p className="mt-4 text-[15px] text-ink-2 max-w-[26ch] relative z-10">Инвойс, упаковочный лист, экспортная декларация с печатью таможни — тот пакет, без которого карточку не допустят.</p>
          <Doc src="doc-invoice.jpg" w={210} cap="форма инвойса Lanmei с печатью компании; заполняется под каждую партию" className="doc-in-card desk-only" style={{ right: 28, top: 28 }} />
        </div>
      </div>
    </div>
  </section>
)

/* ── 6 · Процесс — четыре кадра серии предметов (макеты, не фото); люди — настоящие кадры клиента ── */
const steps = [
  ['Поиск фабрики', 'Отбираем поставщиков, проверяем историю и реальные мощности.', 'o-15.webp'],
  ['Образец и ТЗ', 'Фиксируем измеримые параметры, чтобы приёмка шла по документу.', 'o-16.webp'],
  ['Контроль серии', 'Инспекция на месте, фото- и видеоотчёт до оплаты остатка.', 'o-17.webp'],
  ['Экспорт и таможня', 'Документы, таможня, доставка до вашего склада.', 'o-18.webp'],
]
const team = [['osnovatel.jpg', 'Основатель', 'переговоры с фабриками лично'], ['manager-poisk.jpg', 'Поиск поставщиков', 'отбор и проверка фабрик'], ['engineer.jpg', 'Инженер', 'ТЗ и контроль качества'], ['operationist.jpg', 'Операционист', 'документы, экспорт, таможня'], ['manager-sales.jpg', 'Ваш менеджер', 'смета и связь по сделке']]
const Process = () => (
  <section id="process" className="reg-paper pb-[110px]">
    <div className="max-w-[1180px] mx-auto px-6">
      <h2 className="display display-b text-[clamp(30px,4.4vw,62px)] reveal">от поиска фабрики<br />до вашего склада.</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-12">
        {steps.map(([t, s, ph], i) => (
          <div key={t} className={`card ${i % 2 ? 'card-paper' : 'card-char'} reveal`} style={{ transitionDelay: `${i * .06}s` }}>
            <img src={IMG + ph} alt="" className="w-full aspect-[4/3] object-cover" />
            <div className="p-6"><span className="num">этап 0{i + 1}</span><h3 className="display display-b text-[19px] mt-3">{t}</h3><p className="mt-2 text-[14px] opacity-75">{s}</p></div>
          </div>
        ))}
      </div>
      <h2 id="team" className="display display-b text-[clamp(30px,4.4vw,62px)] mt-[110px] reveal">мы в китае физически.</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-12">
        {team.map(([ph, r, s], i) => (
          <div key={r} className="reveal" style={{ transitionDelay: `${i * .05}s` }}>
            <img src={IMG + 'team/' + ph} alt={r} className="card w-full aspect-[4/5] object-cover" />
            <div className="mt-3 font-semibold text-[16px]">{r}</div><div className="text-ink-2 text-[14px]">{s}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ── 6а · Как проходит оплата из России — вопрос, который в 2026 стоит первым (аудит lanmei.ru 15.09:
      у 5 из 7 конкурентов способ оплаты описан текстом, у Lanmei — 0 вхождений). Факт — из брифа владельца. ── */
const Payment = () => (
  <section id="payment" className="reg-paper pb-[110px]">
    <div className="max-w-[1180px] mx-auto px-6">
      <h2 className="display display-b text-[clamp(30px,4.4vw,62px)] reveal">как проходит оплата<br />из россии.</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
        {[
          ['01', 'Кому', 'Договор и счёт — от китайского юрлица SHANGHAI LANMEI INTERNATIONAL (TRADE) CO., LTD. Реквизиты в подвале и в каждой смете.'],
          ['02', 'Как', 'Прямой платёж из России без платёжного агента и его комиссии. Валюту платежа и банк называем в смете под вашу партию.*'],
          ['03', 'Когда', '30 % после подписания — на запуск производства. 70 % — после того, как партия принята по вашему ТЗ и вы увидели фото- и видеоотчёт.'],
        ].map(([n, t, d], i) => (
          <div key={n} className="card card-paper p-8 reveal" style={{ transitionDelay: `${i * .06}s` }}>
            <span className="num">{n}</span>
            <h3 className="display display-b text-[24px] mt-8">{t}</h3>
            <p className="mt-3 text-[15px] text-ink-2">{d}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-[12.5px] text-ink-2 italic">*Строка «прямые платежи из России без комиссии агента» — из брифа владельца; валюта и банк на страницу не выносятся до его подтверждения.</p>
    </div>
  </section>
)

/* ── 6б · Вопросы — шесть возражений с механизмом ответа. Текст — с живого lanmei.ru (страница клиента),
      аудит 15.09 назвал этот блок сильной стороной: «ответы на настоящие возражения с механизмом». ── */
const FAQ_ITEMS: [string, string][] = [
  ["Карго всё равно дешевле", "По видимой ставке — да. Но в ней нет документов, пошлины и НДС, и нет ответственности за брак. Мы считаем обе схемы в одинаковых статьях и показываем разницу в себестоимости единицы на вашем складе. Если после честного сравнения карго выигрывает — мы так и скажем."],
  ["Кто вернёт деньги за брак?", "Определение брака, порядок доказательств, сроки ответа и лимиты компенсации закреплены в договоре. Претензию с фабрикой ведём мы, на китайском — от заявки до решения. Именно поэтому серия проверяется до оплаты остатка — большинство проблем решается ещё в Китае."],
  ["Будут ли скрытые платежи?", "Смета приходит по строкам: товар, комиссия, фрахт, экспортное оформление, пошлина, НДС, сертификация, маркировка и доставка. Допущения расчёта указываются явно. Если по ходу поставки статья меняется — вы видите это до того, как расход возникнет."],
  ["Почему аванс 30%?", "Это стандартная схема запуска производства в Китае: 30% фабрика получает на закупку сырья, 70% — после приёмки серии. Аванс уходит фабрике, а не нам, и подтверждается документами. После оплаты вы получаете календарь поставки с контрольными точками."],
  ["Успеем ли пополнить остатки?", "Переход делается параллельно текущим поставкам: начинаем с одной тестовой партии, пока карго продолжает возить. Так вы проверяете схему без риска дефицита ходового SKU и переносите остальной ассортимент уже по факту."],
  ["У нас свой отдел закупок", "Тогда мы закрываем ту часть, где нужен человек в Китае: выезд на фабрику, переговоры на китайском, инспекция серии и претензии. Многие клиенты используют нас как внешнюю китайскую руку своего отдела ВЭД, а не как замену ему."]
]
const Faq = () => {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="reg-paper pb-[110px]">
      <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <h2 className="display display-b text-[clamp(28px,2.9vw,40px)] reveal">что спрашивают перед первой партией.</h2>
          <p className="mt-5 text-[15.5px] text-ink-2 max-w-[30ch] reveal">Шесть возражений, которые звучат почти в каждом разговоре. Отвечаем механизмом, а не обещанием.</p>
        </div>
        <div className="md:col-span-8 grid gap-3">
          {FAQ_ITEMS.map(([q, a], i) => (
            <div key={q} className={`card card-paper reveal faq-item ${open === i ? 'is-open' : ''}`} style={{ transitionDelay: `${i * .04}s` }}>
              <button className="w-full text-left flex items-center justify-between gap-6 p-6" onClick={() => setOpen(open === i ? null : i)}>
                <span className="display display-b text-[19px]">«{q}»</span>
                <span className="faq-plus" aria-hidden />
              </button>
              <div className="faq-body"><div><p className="px-6 pb-6 text-[15px] text-ink-2 max-w-[68ch]">{a}</p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 7 · Синяя плита формы — белый квиз слева, предмет выше формы справа, как «получить расчёт стоимости» ── */
const Q: { q: string; a: string[]; note?: string }[] = [
  { q: 'Как часто вы закупаете?', a: ['Разово', 'Раз в квартал', 'Ежемесячно и чаще'] },
  { q: 'Какой бюджет закладываете на партию?', a: ['до $3 000', '$3 000 – $10 000', '$10 000 – $50 000', 'больше $50 000'], note: 'До $3 000 белая схема обычно не окупается — скажем честно в расчёте.' },
  { q: 'Какой товар возите чаще всего?', a: ['Электроника и техника', 'Товары для дома', 'Оборудование и запчасти', 'Другое'] },
  { q: 'Как возите сейчас?', a: ['Через карго', 'Свой агент', 'Напрямую с фабрикой', 'Ещё не возил'] },
  { q: 'Кто-то требует у вас документы на товар?', a: ['Площадка', 'Банк', 'Бухгалтерия', 'Пока нет'] },
  { q: 'Нужен подрядчик на весь цикл или на часть?', a: ['Весь цикл', 'Только логистика и документы'] },
]
const Quiz = () => {
  const [i, setI] = useState(0)
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')
  const done = i >= Q.length
  const submit = () => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10) { setErr('Введите номер целиком'); return }
    setErr(''); (window as any).ym?.(111955901, 'reachGoal', 'quiz_lead')
    // Отправка в Cloudflare Worker клиента подключается при внедрении; в прототипе — только экран «принято».
    setSent(true)
  }
  const pct = Math.round((Math.min(i + 1, Q.length) / Q.length) * 100)
  return (
    <section id="quiz" className="reg-paper pb-[110px]">
      <div className="slab reg-blue relative overflow-hidden py-[90px]">
        <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-6">
            <h2 className="display text-[clamp(30px,4.4vw,60px)] reveal">получить расчёт<br /><span className="display-b">стоимости.</span></h2>
            <p className="mt-4 text-[16px] reveal">• • • Шесть вопросов — и смета по строкам <b>за 48 часов</b>, бесплатно.</p>
            <div className="card card-paper mt-8 p-7 reveal" style={{ transitionDelay: '.08s' }}>
              <div className="h-1.5 rounded-full bg-ink/10 overflow-hidden"><div className="h-full rounded-full" style={{ width: pct + '%', background: 'var(--blue)', transition: 'width .6s var(--ease)' }} /></div>
              <div className="flex justify-between text-[13px] text-ink-2 mt-3"><span>{done ? 'Готово' : `Вопрос ${i + 1} из ${Q.length}`}</span><span>{pct} %</span></div>
              {!done ? (<>
                <h3 className="display display-b text-[clamp(20px,2vw,26px)] mt-5">{Q[i].q}</h3>
                <div className="grid gap-2.5 mt-5">{Q[i].a.map((a) => <button key={a} className="q-opt" onClick={() => { (window as any).ym?.(111955901, 'reachGoal', 'quiz_step_' + (i + 1)); setI(i + 1) }}>{a}</button>)}</div>
                {Q[i].note && <p className="mt-3 text-[12.5px] text-ink-2">{Q[i].note}</p>}
              </>) : (<>
                {sent ? (<>
                  <h3 className="display display-b text-[clamp(20px,2vw,26px)] mt-5">Заявка принята.</h3>
                  <p className="mt-3 text-[15px] text-ink-2">Смета по строкам придёт в Telegram или WhatsApp в течение 48 часов в рабочее время.</p>
                </>) : (<>
                <h3 className="display display-b text-[clamp(20px,2vw,26px)] mt-5">Куда прислать расчёт?</h3>
                <input placeholder="+7 ___ ___-__-__" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="q-opt w-full mt-5" aria-label="Телефон" />
                {err && <p className="mt-2 text-[13px]" style={{ color: '#c0392b' }}>{err}</p>}
                <button className="cta-main w-full mt-3 justify-center" type="button" onClick={submit}>Получить смету за 48 часов<span className="cta-arr" aria-hidden><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg></span></button>
                <p className="mt-3 text-[12px] text-ink-2">Нажимая кнопку, вы соглашаетесь с <a href="https://lanmei.ru/privacy/" target="_blank" rel="noreferrer" className="underline decoration-dotted">политикой обработки данных</a>.</p>
                </>)}
              </>)}
              <div className="flex items-center gap-3 mt-6 text-[13px] text-ink-2"><img src={IMG + 'team/osnovatel.jpg'} alt="" className="w-9 h-9 rounded-full object-cover" />Считает основатель. Ответ в Telegram или WhatsApp.</div>
            </div>
          </div>
          {/* Царь блока — предмет выше формы, в #17 это фура анфас (кадр №13 сметы). */}
          <div className="md:col-span-6 relative min-h-[560px] desk-only scene">
            <img src={obj('o-13')} alt="" style={{ right: '4%', top: '0', width: '72%' }} />
            <Doc src="doc-estimate.jpg" w={250} cap="смета клиенту по строкам, дата на документе 11.08.26" style={{ position: 'absolute', left: '2%', bottom: '2%' }} />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 8 · Подвал графит: крупные контакты с пунктиром, реквизиты ── */
const Footer = () => (
  <footer id="contacts" className="reg-char pt-[80px] pb-12" style={{ borderRadius: '0 0 34px 34px' }}>
    <div className="max-w-[1180px] mx-auto px-6 mb-14"><img src={IMG + 'o-14.webp'} alt="Маршрут Шанхай — Москва" className="card w-full h-[460px] object-cover" /></div>
    <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-4 text-[13px] muted"><div>01 — звоните нам,<br />мы на связи</div><div className="mt-10">02 — по вопросам<br />и сотрудничеству</div></div>
      <div className="md:col-span-8">
        <a href="tel:+8613120794214" className="display display-b block text-[clamp(26px,3.6vw,48px)] pb-3" style={{ borderBottom: '1px dashed rgba(255,255,255,.35)' }}>+86 131 2079 4214 →</a>
        <div className="display block text-[clamp(22px,2.6vw,36px)] mt-8 pb-3" style={{ borderBottom: '1px dashed rgba(255,255,255,.35)' }}><a href="https://t.me/lanmei_logistics" target="_blank" rel="noreferrer">Telegram</a> · <a href="https://wa.me/8613120794214" target="_blank" rel="noreferrer">WhatsApp</a> →</div>
      </div>
    </div>
    <div className="max-w-[1180px] mx-auto px-6 mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 text-[12.5px] muted">
      <div>SHANGHAI LANMEI INTERNATIONAL (TRADE) CO., LTD<br />上海蓝媒国际贸易有限公司 · 91310115MA7KFQ8B1U</div>
      <div>Шанхай, район Пудун, ул. Шанчэнлу, башня «Лэкай», офис 2408<br /><a href="mailto:lanmeiltd_sale2@163.com" className="underline decoration-dotted">lanmeiltd_sale2@163.com</a> · договор с китайской компанией</div>
      <div>Смета — за 48 часов. Отвечаем в рабочее время.<br /><a href="https://lanmei.ru/privacy/" target="_blank" rel="noreferrer" className="underline decoration-dotted opacity-80">Политика обработки данных</a></div>
    </div>
  </footer>
)

const FloatCta = () => {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const hero = document.getElementById('top'); const quiz = document.getElementById('quiz')
    if (!hero || !quiz) return
    let pastHero = false, atQuiz = false
    const io = new IntersectionObserver((es) => { es.forEach((e) => { if (e.target === hero) pastHero = !e.isIntersecting; if (e.target === quiz) atQuiz = e.isIntersecting }); setShow(pastHero && !atQuiz) }, { threshold: 0.05 })
    io.observe(hero); io.observe(quiz); return () => io.disconnect()
  }, [])
  return <a href="#quiz" className={`float-cta cta-main ${show ? 'is-on' : ''}`}>Рассчитать смету<span className="cta-arr" aria-hidden><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg></span></a>
}

export default function App() {
  useReveal()
  const [open, setOpen] = useState(false)
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])
  return (
    <>
      <Rail open={open} setOpen={setOpen} />
      <FloatCta />
      <div className="page">
        <Hero /><Bento /><Changes /><Estimate /><Risk /><Process /><Payment /><Faq /><Quiz /><Footer />
      </div>
    </>
  )
}
