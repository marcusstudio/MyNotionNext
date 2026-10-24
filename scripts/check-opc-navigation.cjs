// Run: node scripts/check-opc-navigation.cjs (after installing project dependencies).
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')

const source = fs.readFileSync(path.join(__dirname, '../themes/opc/index.js'), 'utf8')
const compiled = ts.transpileModule(source, {
  fileName: 'opc.jsx',
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS }
}).outputText
const testModule = { exports: {} }
const anchor = ({ href, children, ...props }) => React.createElement('a', { href, ...props }, children)
const config = { OPC_NAME: 'Klarraum', OPC_NOW_TITLE: 'Themen' }
let currentPath = '/about'
let navigatedTo
vm.runInNewContext(compiled, {
  module: testModule,
  exports: testModule.exports,
  FormData: class { get() { return '关系 & stress' } },
  require: name => {
    if (name === 'react/jsx-runtime') return require(name)
    if (name === './config') return { default: config }
    if (name === 'next/router') return { useRouter: () => ({ asPath: currentPath, push: href => { navigatedTo = href } }) }
    if (name === '@/lib/config') return { siteConfig: (key, fallback) => fallback }
    if (name === '@/lib/global') return { useGlobal: () => ({ isDarkMode: false, toggleDarkMode() {} }) }
    if (name === '@/lib/themeConsoleStyle') return { themeConsoleStyle: () => '' }
    if (name === '@/components/SmartLink') return { default: anchor }
    if (name === '@/components/HeroIcons') return { Moon: () => null, Sun: () => null }
    if (name.startsWith('@/components/')) return { default: () => null }
    throw new Error(`Unexpected import: ${name}`)
  }
})
const { LayoutBase, LayoutIndex, LayoutSlug, LayoutSearch, LayoutPostList } = testModule.exports
const render = (component, props) => renderToStaticMarkup(React.createElement(component, props))
const menu = [
  { title: 'About', href: '/about' },
  { title: 'Categories', href: '/#', subMenus: [{ title: 'Psychology', href: '/category/Psychology%20Insights' }] },
  { title: 'Hidden', href: '/hidden', show: false },
  { title: 'Empty group', href: '/#' }
]
const navigation = render(LayoutBase, { customMenu: menu })
for (const href of ['/', '/archive', '/category', '/tag', '/search', '/about', '/category/Psychology%20Insights']) {
  assert(navigation.includes(`href="${href}"`), `Missing navigation: ${href}`)
}
assert(navigation.includes('aria-current="page"'))
assert(!navigation.includes('href="/#"'))
assert(!navigation.includes('/hidden'))
assert(render(LayoutBase, { customNav: [{ name: 'Tests', href: '/tests' }] }).includes('href="/tests"'))
assert.doesNotThrow(() => render(LayoutBase, {}))
const post = { id: 'post', title: 'Article', href: '/article/example' }
const homepage = render(LayoutIndex, { categoryOptions: [{ name: 'Blogs & Vlogs' }], posts: [post] })
assert(homepage.includes('href="/category/Blogs%20%26%20Vlogs"'))
assert(homepage.includes('href="/article/example"'))
assert(render(LayoutPostList, { category: 'Psychology Insights', posts: [] }).includes('Psychology Insights</h1>'))
assert(render(LayoutPostList, { tag: 'Nature', posts: [] }).includes('Nature</h1>'))
const article = render(LayoutSlug, { post, prev: { title: 'Previous', href: '/article/previous' }, next: { title: 'Next', href: '/article/next' } })
assert(article.includes('href="/article/previous"') && article.includes('href="/article/next"'))
const search = LayoutSearch({ posts: [] })
const searchForm = search.props.children.find(child => child?.type === 'form')
searchForm.props.onSubmit({ preventDefault() {}, currentTarget: {} })
assert.equal(navigatedTo, '/search/%E5%85%B3%E7%B3%BB%20%26%20stress')
console.log('OPC navigation checks passed: menus, nested links, fallback, categories, posts, article navigation, search.')
