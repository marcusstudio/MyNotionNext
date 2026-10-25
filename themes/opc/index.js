import Comment from '@/components/Comment'
import ArticleLock from '@/components/ArticleLock'
import LazyImage from '@/components/LazyImage'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { themeConsoleStyle } from '@/lib/themeConsoleStyle'
import { useRouter } from 'next/router'
import { Moon, Sun } from '@/components/HeroIcons'
import CONFIG from './config'
import { useState } from 'react'

const c = key => siteConfig(key, CONFIG[key], CONFIG)

const ActionLink = ({ href, children, primary }) => (
  <SmartLink
    href={href}
    aria-label={children}
    target={href?.startsWith('http') ? '_blank' : undefined}
    rel={href?.startsWith('http') ? 'noreferrer' : undefined}
    className={`inline-flex min-h-[46px] items-center justify-center rounded-md px-5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-300 ${
      primary ? 'opc-primary-action' : 'opc-secondary-action border'
    }`}>
    {children}
  </SmartLink>
)

const OpcFooter = () => (
  <footer className='opc-footer px-5 pb-8 text-xs md:px-10'>
    <div className='mx-auto flex max-w-6xl flex-col gap-2 border-t pt-5 sm:flex-row sm:items-center sm:justify-between'>
      <div className='opc-muted'>
        <SmartLink href={c('OPC_SECONDARY_URL')}>{c('OPC_SECONDARY_TEXT')}</SmartLink> · {c('OPC_STATUS_TEXT')}
      </div>
      <div className='flex flex-wrap gap-3'>
        {process.env.NODE_ENV === 'development' && <span>Lokale OPC-Vorschau</span>}
        <SmartLink href={c('OPC_CHINESE_URL')}>{c('OPC_CHINESE_TEXT')}</SmartLink>
      </div>
    </div>
  </footer>
)

const ServiceCard = ({ name, href }) => (
  <SmartLink href={href} className='opc-portal-card block rounded-md border p-4 transition'>
    <div className='text-sm font-semibold'>{name}</div>
    <div className='opc-muted mt-2 text-xs leading-5'>
      {c('OPC_CATEGORY_LINK_TEXT')}
    </div>
  </SmartLink>
)

const getPostHref = post => post?.href || (post?.slug ? `/${post.slug}` : '#')

const SectionTitle = ({ title, description }) => (
  <div className='mb-8'>
    <div className='opc-kicker inline-flex rounded-md border px-3 py-2 text-xs font-medium'>
      {c('OPC_NAME')}
    </div>
    <h1 className='mt-5 text-3xl font-semibold sm:text-4xl'>{title}</h1>
    {description && <p className='opc-muted mt-3 max-w-2xl text-sm leading-6'>{description}</p>}
  </div>
)

const PostCard = ({ post }) => (
  <SmartLink href={getPostHref(post)} className='opc-portal-card block rounded-md border p-5 transition'>
    <div className='opc-muted text-xs'>{post?.publishDay || post?.lastEditedDay || '长期记录'}</div>
    <h2 className='mt-3 text-lg font-semibold'>{post?.title}</h2>
    {post?.summary && <p className='opc-muted mt-3 line-clamp-2 text-sm leading-6'>{post.summary}</p>}
  </SmartLink>
)

const Pager = ({ page = 1, postCount = 0, posts = [] }) => {
  const router = useRouter()
  const perPage = Number(siteConfig('POSTS_PER_PAGE')) || posts.length || postCount || 1
  const currentPage = Number(page) || 1
  const totalPage = Math.ceil(postCount / perPage)
  const basePath = router.asPath.split('?')[0].replace(/\/page\/[1-9]\d*/, '').replace(/\/$/, '')

  if (totalPage <= 1) return null

  return (
    <div className='mt-8 flex items-center justify-between text-sm'>
      <SmartLink
        href={currentPage <= 2 ? `${basePath || '/'}` : `${basePath}/page/${currentPage - 1}`}
        className={currentPage > 1 ? 'opc-secondary-action rounded-md border px-4 py-2' : 'invisible'}>
        上一页
      </SmartLink>
      <span className='opc-muted'>{currentPage} / {totalPage}</span>
      <SmartLink
        href={`${basePath}/page/${currentPage + 1}`}
        className={currentPage < totalPage ? 'opc-secondary-action rounded-md border px-4 py-2' : 'invisible'}>
        下一页
      </SmartLink>
    </div>
  )
}

const PageShell = ({ title, description, children }) => (
  <main className='min-h-screen px-5 py-10 md:px-10'>
    <div className='mx-auto max-w-4xl'>
      <SectionTitle title={title} description={description} />
      {children}
    </div>
  </main>
)

const SiteCover = ({ src, title }) => {
  if (!src) return null

  return (
    <div className='opc-cover my-5 overflow-hidden rounded-md border'>
      <LazyImage
        priority
        src={src}
        fallbackSrc='/bg_image.jpg'
        alt={`${title} 封面`}
        className='h-full w-full object-cover'
      />
    </div>
  )
}

const NowPanel = ({ categoryOptions = [], menus = [] }) => (
  <section className='opc-topics opc-panel mx-auto max-w-6xl rounded-lg border p-5 md:p-6'>
    <div>
      <h2 className='mt-1 text-xl font-semibold'>{c('OPC_NOW_TITLE')}</h2>
    </div>
    <p className='opc-muted mt-4 text-sm leading-6'>{c('OPC_NOW_DESCRIPTION')}</p>
    <div className='mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {categoryOptions.map(category => (
        <ServiceCard key={category.name} name={menus.flatMap(item => item.subMenus || []).find(item => [`/category/${encodeURIComponent(category.name)}`, `/category/${encodeURI(category.name)}`, `/category/${category.name}`].includes(item.href))?.title || category.name} href={`/category/${encodeURIComponent(category.name)}`} />
      ))}
    </div>
  </section>
)

const OpcDarkModeButton = () => {
  const { isDarkMode, toggleDarkMode } = useGlobal()

  return (
    <button
      type='button'
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? 'Helle Ansicht einschalten' : 'Dunkle Ansicht einschalten'}
      title={isDarkMode ? 'Light mode' : 'Dark mode'}
      className='opc-dark-mode-button fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-md border transition focus:outline-none focus:ring-2 focus:ring-offset-2 md:bottom-8 md:right-8'>
      <span className='h-5 w-5'>{isDarkMode ? <Sun /> : <Moon />}</span>
    </button>
  )
}

const Style = () => (
  <style jsx global>{`
    ${themeConsoleStyle('opc', CONFIG)}

    #theme-opc {
      background: var(--opc-console-bg);
      color: var(--opc-console-text);
    }

    #theme-opc .opc-muted {
      color: var(--opc-console-text-secondary);
    }

    #theme-opc .opc-kicker,
    #theme-opc .opc-secondary-action,
    #theme-opc .opc-method,
    #theme-opc .opc-portal-card {
      border-color: color-mix(in srgb, var(--opc-console-border) 88%, transparent);
      background-color: color-mix(in srgb, var(--opc-console-card) 82%, transparent);
      color: var(--opc-console-text);
    }

    #theme-opc .opc-kicker {
      color: var(--opc-console-primary);
    }

    #theme-opc .opc-primary-action {
      background-color: var(--opc-console-primary);
      color: var(--opc-console-bg);
      box-shadow: 0 18px 46px color-mix(in srgb, var(--opc-console-primary) 20%, transparent);
    }

    #theme-opc .opc-primary-action:hover {
      background-color: color-mix(in srgb, var(--opc-console-primary) 86%, var(--opc-console-text));
    }

    #theme-opc .opc-secondary-action:hover,
    #theme-opc .opc-portal-card:hover {
      border-color: var(--opc-console-primary);
      background-color: color-mix(in srgb, var(--opc-console-primary) 7%, var(--opc-console-card));
    }

    #theme-opc .opc-panel {
      border-color: color-mix(in srgb, var(--opc-console-border) 92%, transparent);
      background-color: color-mix(in srgb, var(--opc-console-card) 92%, transparent);
      box-shadow: 0 24px 70px color-mix(in srgb, var(--opc-console-text) 9%, transparent);
    }

    #theme-opc .opc-divider {
      border-color: color-mix(in srgb, var(--opc-console-border) 90%, transparent);
    }

    #theme-opc .opc-footer > div {
      border-color: color-mix(in srgb, var(--opc-console-border) 90%, transparent);
    }

    #theme-opc .opc-footer a {
      color: var(--opc-console-primary);
    }

    #theme-opc .opc-footer a:hover {
      text-decoration: underline;
      text-underline-offset: 4px;
    }

    #theme-opc .opc-cover {
      aspect-ratio: 16 / 9;
      border-color: color-mix(in srgb, var(--opc-console-border) 90%, transparent);
      background-color: color-mix(in srgb, var(--opc-console-border) 24%, transparent);
    }

    #theme-opc .opc-status {
      background-color: color-mix(in srgb, var(--opc-console-primary) 12%, transparent);
      color: var(--opc-console-primary);
    }

    #theme-opc .opc-dark-mode-button {
      border-color: color-mix(in srgb, var(--opc-console-border) 88%, transparent);
      background-color: color-mix(in srgb, var(--opc-console-card) 92%, transparent);
      color: var(--opc-console-text);
      box-shadow: 0 14px 40px color-mix(in srgb, var(--opc-console-text) 12%, transparent);
    }

    #theme-opc .opc-dark-mode-button:hover {
      border-color: var(--opc-console-primary);
      color: var(--opc-console-primary);
      transform: translateY(-1px);
    }

    #theme-opc .notion {
      color: #111827;
    }

    .dark #theme-opc {
      background: var(--opc-console-bg);
    }

    .dark #theme-opc .opc-panel {
      background-color: color-mix(in srgb, var(--opc-console-card) 90%, transparent);
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.34);
    }

    .dark #theme-opc .opc-kicker,
    .dark #theme-opc .opc-secondary-action,
    .dark #theme-opc .opc-method,
    .dark #theme-opc .opc-portal-card {
      background-color: color-mix(in srgb, var(--opc-console-card) 72%, transparent);
    }

    .dark #theme-opc .opc-primary-action {
      color: #020617;
    }

    .dark #theme-opc .notion {
      color: var(--opc-console-text);
    }

    #theme-opc { font-family: 'Segoe UI', Arial, sans-serif; font-weight: 400; }
    #theme-opc .opc-panel { box-shadow: none; }
    #theme-opc .opc-primary-action { box-shadow: none; }
    #theme-opc .opc-brand { font-size: 25px; letter-spacing: -.6px; }
    #theme-opc .opc-brand-caption { display: block; margin-top: 4px; font-size: 10px; font-weight: 400; letter-spacing: .1em; text-transform: uppercase; color: var(--opc-console-text-secondary); }
    #theme-opc .opc-header-top { min-height: 54px; }
    #theme-opc .opc-header { padding-bottom: 20px; border-bottom: 1px solid var(--opc-console-border); }
    #theme-opc .opc-menu-toggle { display: none; border: 1px solid var(--opc-console-border); border-radius: 6px; padding: 7px 13px; background: var(--opc-console-card); font-size: 13px; }
    #theme-opc .opc-home { padding-top: 0; }
    #theme-opc .opc-hero { align-content: center; padding-top: 44px; padding-bottom: 48px; gap: 64px; }
    #theme-opc .opc-hero-label { margin-bottom: 20px; font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--opc-console-primary); }
    #theme-opc .opc-hero h1 { font-size: clamp(42px, 4.8vw, 66px); line-height: 1.08; letter-spacing: -2px; max-width: 650px; }
    #theme-opc .opc-hero-subtitle { max-width: 490px; font-size: 21px; line-height: 1.5; font-weight: 500; }
    #theme-opc .opc-hero-description { max-width: 485px; line-height: 1.85; }
    #theme-opc .opc-hero-note { margin-top: 24px; font-size: 11px; letter-spacing: .04em; }
    #theme-opc .opc-hero-card { padding: 24px; border-radius: 10px; }
    #theme-opc .opc-hero-card .opc-cover { margin: 20px 0; aspect-ratio: 16 / 9; border: 0; }
    #theme-opc .opc-home .opc-section-label { margin-bottom: 8px; font-size: 10px; font-weight: 600; letter-spacing: .13em; text-transform: uppercase; }
    #theme-opc .opc-topics { padding: 29px; background: transparent; border: 0; border-top: 1px solid var(--opc-console-border); border-radius: 0; }
    #theme-opc .opc-topics .opc-portal-card { padding: 25px 22px; min-height: 112px; }
    #theme-opc .opc-about { margin: 10px auto 32px; padding: 30px; border-radius: 9px; background: color-mix(in srgb, var(--opc-console-primary) 6%, var(--opc-console-bg)); }
    #theme-opc .opc-about p { max-width: 740px; line-height: 1.9; }
    #theme-opc .opc-posts { background: transparent; border: 0; padding: 10px 0 24px; }
    #theme-opc .opc-posts .opc-portal-card { box-shadow: none; }
    @media (max-width: 767px) {
      #theme-opc .opc-menu-toggle { display: block; }
      #theme-opc .opc-main-nav { display: none; }
      #theme-opc .opc-main-nav.is-open { display: flex; }
      #theme-opc .opc-main-nav > a, #theme-opc .opc-main-nav > details { flex-basis: 42%; }
      #theme-opc .opc-header .opc-status { display: none; }
      #theme-opc .opc-brand-caption { max-width: 220px; font-size: 9px; letter-spacing: .06em; }
      #theme-opc .opc-header { padding-top: 14px; padding-bottom: 14px; }
      #theme-opc .opc-hero { min-height: 0; padding-top: 36px; padding-bottom: 32px; gap: 30px; }
      #theme-opc .opc-hero h1 { font-size: 43px; letter-spacing: -1.4px; }
      #theme-opc .opc-hero-subtitle { font-size: 18px; }
      #theme-opc .opc-hero-description { font-size: 15px; }
      #theme-opc .opc-hero-card { padding: 20px; }
      #theme-opc .opc-topics { padding: 25px 0; }
      #theme-opc .opc-about { padding: 23px; }
      #theme-opc .opc-posts > div:first-child { align-items: start; flex-direction: column; }
    }
  `}</style>
)

const Navigation = ({ customMenu = [], customNav = [] }) => {
  const { asPath } = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const currentPath = asPath.split(/[?#]/)[0]
  const menus = siteConfig('CUSTOM_MENU', true) && customMenu.length > 0
    ? customMenu
    : customNav
  const linkClass = 'opc-secondary-action rounded-md border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-300'
  const renderLink = item => (
    <SmartLink
      key={item.href}
      href={item.href}
      target={item.target}
      aria-current={currentPath === item.href ? 'page' : undefined}
      className={linkClass}>
      {item.name || item.title}
    </SmartLink>
  )

  return (
    <header className='opc-header mx-auto max-w-[1232px] px-5 pt-6 md:px-10'>
      <div className='opc-header-top flex flex-wrap items-center justify-between gap-4'>
        <SmartLink href='/' className='opc-brand font-semibold'>
          {c('OPC_NAME')}
          <span className='opc-brand-caption'>{c('OPC_BRAND_CAPTION')}</span>
        </SmartLink>
        <span className='opc-status rounded-md px-2.5 py-1 text-xs font-medium'>{c('OPC_STATUS_TEXT')}</span>
        <button type='button' className='opc-menu-toggle' aria-expanded={menuOpen} aria-controls='opc-main-nav' onClick={() => setMenuOpen(!menuOpen)}>{c('OPC_MENU_TEXT')}</button>
      </div>
      <nav id='opc-main-nav' aria-label='Hauptnavigation' onClick={event => { if (event.target.closest('a')) setMenuOpen(false) }} className={`opc-main-nav ${menuOpen ? 'is-open' : ''} mt-4 flex flex-wrap items-start gap-2 [&>a]:flex-1 [&>a]:text-center [&>a]:whitespace-nowrap [&>details]:flex-1 [&>details]:text-center`}>
        {menus.filter(item => item.show !== false).map(item => {
          const children = item.subMenus?.filter(child => child.show !== false && child.href && !['#', '/#'].includes(child.href)) || []
          if (children.length > 0) {
            return (
              <details key={item.id || item.name || item.title} className='opc-panel relative rounded-md border p-2'>
                <summary className='cursor-pointer px-1 text-sm'>{item.name || item.title}</summary>
                <div className='opc-panel absolute right-0 top-full z-50 mt-2 flex w-64 flex-col gap-2 rounded-md border p-3 shadow-xl'>
                  {item.href && !['#', '/#'].includes(item.href) && renderLink(item)}
                  {children.map(renderLink)}
                </div>
              </details>
            )
          }
          return item.href && !['#', '/#'].includes(item.href) ? renderLink(item) : null
        })}
      </nav>
    </header>
  )
}

const LayoutBase = ({ children, ...props }) => (
  <div id='theme-opc' className={`${siteConfig('FONT_STYLE')} min-h-screen`}>
    <Style />
    <OpcDarkModeButton />
    <Navigation {...props} />
    {children}
    <OpcFooter />
  </div>
)

const LayoutIndex = props => {
  const homeTitle = c('OPC_TITLE')
  const homeDescription = c('OPC_DESCRIPTION')
  const siteCover = props?.siteInfo?.pageCover || siteConfig('HOME_BANNER_IMAGE', '', props?.NOTION_CONFIG)

  return (
    <main className='opc-home min-h-screen px-5 py-6 md:px-10'>
      <section className='opc-hero mx-auto mb-6 grid min-h-[calc(100svh-160px)] max-w-6xl content-start items-center gap-6 py-4 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:py-6'>
        <div>
          <div className='opc-hero-label'>{c('OPC_HERO_LABEL')}</div>
          <h1 className='max-w-3xl whitespace-pre-line text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl'>
            {homeTitle}
          </h1>
          <div className='opc-hero-subtitle mt-5 whitespace-pre-line text-xl font-semibold sm:text-2xl'>{c('OPC_SUBTITLE')}</div>
          <p className='opc-hero-description opc-muted mt-4 max-w-2xl whitespace-pre-line text-base leading-7'>
            {homeDescription}
          </p>
          <div className='mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row'>
            <ActionLink href={c('OPC_PRIMARY_URL')} primary>
              {c('OPC_PRIMARY_TEXT')}
            </ActionLink>
            <ActionLink href={c('OPC_SECONDARY_URL')}>{c('OPC_SECONDARY_TEXT')}</ActionLink>
          </div>
          <p className='opc-hero-note opc-muted'>{c('OPC_HERO_NOTE')}</p>
        </div>

        <aside className='opc-hero-card opc-panel rounded-lg border p-5 backdrop-blur'>
          <div className='opc-divider flex items-center gap-4 border-b pb-5'>
            <div>
              <div className='opc-section-label opc-muted'>{c('OPC_STATUS_TEXT')}</div>
              <div className='mt-1 text-xl font-semibold'>{c('OPC_CARD_TITLE')}</div>
            </div>
          </div>

          <SiteCover src={siteCover} title={c('OPC_TITLE')} />

          <div className='opc-divider border-t pt-5'>
            <p className='opc-muted text-sm leading-6'>{c('OPC_CARD_DESCRIPTION')}</p>
          </div>
        </aside>
      </section>
      {props?.homePage?.blockMap && (
        <section className='opc-panel mx-auto mb-6 max-w-6xl rounded-lg border p-5 md:p-8'>
          <div className='opc-muted mb-4 text-xs font-semibold uppercase tracking-[0.12em]'>Notion · Startseite / 首页</div>
          <NotionPage post={props.homePage} />
        </section>
      )}
      <div className='pb-10 md:pb-14'>
        <NowPanel categoryOptions={props.categoryOptions} menus={siteConfig('CUSTOM_MENU', true) ? (props.customMenu || []) : (props.customNav || [])} />
        <section className='opc-about mx-auto max-w-6xl'>
          <div className='opc-section-label opc-muted'>{c('OPC_ABOUT_LABEL')}</div>
          <h2 className='text-xl font-semibold'>{c('OPC_ABOUT_TITLE')}</h2>
          <p className='opc-muted mt-3 text-sm'>{c('OPC_ABOUT_DESCRIPTION')}</p>
          <SmartLink href={c('OPC_SECONDARY_URL')} className='mt-4 inline-block text-sm font-semibold underline underline-offset-4'>{c('OPC_ABOUT_LINK_TEXT')}</SmartLink>
        </section>
        <section className='opc-posts opc-panel mx-auto mt-6 max-w-6xl rounded-lg border p-5 md:p-6'>
          <div className='mb-5 flex flex-wrap items-center justify-between gap-3'>
            <h2 className='text-xl font-semibold'>{c('OPC_POSTS_TITLE')}</h2>
            <SmartLink href='/archive' className='text-sm underline underline-offset-4'>{c('OPC_POSTS_LINK_TEXT')}</SmartLink>
          </div>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {(props.posts || []).slice(0, 3).map(post => <PostCard key={post.id || post.slug} post={post} />)}
          </div>
        </section>
        <p className='opc-muted mx-auto mt-6 max-w-6xl text-xs leading-6'>{c('OPC_CONTENT_NOTICE')}</p>
      </div>
    </main>
  )
}

const LayoutSlug = props => (
  <main className='min-h-screen px-5 py-10 md:px-10'>
    <article id='article-wrapper' className='opc-panel mx-auto max-w-3xl rounded-lg border p-6 md:p-10'>
      {props.lock ? (
        <ArticleLock {...props} />
      ) : props.post ? (
        <>
          <NotionPage {...props} />
          <nav aria-label='Beitragsnavigation' className='mt-8 flex flex-wrap justify-between gap-4 border-t pt-5 text-sm'>
            {props.prev && <SmartLink href={getPostHref(props.prev)}>← {props.prev.title}</SmartLink>}
            <SmartLink href='/archive'>Alle Beiträge</SmartLink>
            {props.next && <SmartLink href={getPostHref(props.next)}>{props.next.title} →</SmartLink>}
          </nav>
          <ShareBar post={props.post} />
          <Comment frontMatter={props.post} />
        </>
      ) : (
        <EmptyState title='Derzeit kein Inhalt gefunden.' />
      )}
    </article>
  </main>
)

const EmptyPage = () => <LayoutIndex />
const EmptyState = ({ title = 'Derzeit kein Inhalt' }) => <div className='opc-muted rounded-md border border-dashed p-8 text-center text-sm'>{title}</div>

const LayoutPostList = props => {
  const posts = props.posts || []

  return (
    <PageShell title={props.category || props.tag || 'Beiträge'} description='Klarer sehen, Besser leben.'>
      <div id='posts-wrapper' className='grid gap-4'>
        {posts.length > 0 ? posts.map(post => <PostCard key={post.id || post.slug || post.title} post={post} />) : <EmptyState />}
      </div>
      <Pager {...props} posts={posts} />
    </PageShell>
  )
}

const LayoutSearch = props => {
  const router = useRouter()
  return (
  <PageShell title='Search Results' description={props.keyword ? `关键词：${props.keyword}` : 'Site Search Results.'}>
    <form className='mb-6 flex gap-2' onSubmit={event => {
      event.preventDefault()
      const keyword = String(new FormData(event.currentTarget).get('keyword') || '').trim()
      if (keyword) router.push(`/search/${encodeURIComponent(keyword)}`)
    }}>
      <input key={props.keyword} type='search' name='keyword' aria-label='Suchbegriff · 搜索关键词' defaultValue={props.keyword || ''} required className='opc-secondary-action min-w-0 flex-1 rounded-md border px-3 py-2' />
      <button type='submit' className='opc-primary-action rounded-md px-4 py-2'>Suche</button>
    </form>
    <div id='posts-wrapper' className='grid gap-4'>
      {(props.posts || []).length > 0
        ? props.posts.map(post => <PostCard key={post.id || post.slug || post.title} post={post} />)
        : <EmptyState title='No matching content found' />}
    </div>
  </PageShell>
  )
}

const LayoutArchive = props => (
  <PageShell title='Articles' description='Chronological Long-Term Records.'>
    <div className='grid gap-6'>
      {Object.keys(props.archivePosts || {}).length > 0
        ? Object.keys(props.archivePosts).map(year => (
          <section key={year}>
            <h2 className='mb-3 text-xl font-semibold'>{year}</h2>
            <div className='grid gap-3'>
              {(props.archivePosts[year] || []).map(post => <PostCard key={post.id || post.slug || post.title} post={post} />)}
            </div>
          </section>
        ))
        : <EmptyState />}
    </div>
  </PageShell>
)

const LayoutCategoryIndex = props => (
  <PageShell title='Categories' description='Browse Articles by Topic.'>
    <div className='flex flex-wrap gap-3'>
      {(props.categoryOptions || []).map(category => (
        <SmartLink key={category.name} href={`/category/${category.name}`} className='opc-secondary-action rounded-md border px-4 py-2 text-sm'>
          {category.name}{category.count ? ` (${category.count})` : ''}
        </SmartLink>
      ))}
    </div>
  </PageShell>
)

const LayoutTagIndex = props => (
  <PageShell title='Tags' description='Browse Articles by Tag.'>
    <div className='flex flex-wrap gap-3'>
      {(props.tagOptions || []).map(tag => (
        <SmartLink key={tag.name} href={`/tag/${encodeURIComponent(tag.name)}`} className='opc-secondary-action rounded-md border px-4 py-2 text-sm'>
          {tag.name}{tag.count ? ` (${tag.count})` : ''}
        </SmartLink>
      ))}
    </div>
  </PageShell>
)

const Layout404 = () => (
  <PageShell title='Page Not Found' description='No content was found for this URL.'>
    <ActionLink href='/' primary>返回首页</ActionLink>
  </PageShell>
)

export {
  Layout404,
  LayoutBase,
  LayoutArchive,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
