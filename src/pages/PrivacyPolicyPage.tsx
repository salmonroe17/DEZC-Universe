import { type KeyboardEvent, type ReactNode, useLayoutEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const sectionClass = 'mt-8 max-w-2xl text-sm leading-relaxed text-fg-muted'
const h2Class = 'mt-10 text-xs font-semibold uppercase tracking-[0.1em] text-fg'
const bulletListClass = `${sectionClass} list-inside list-disc space-y-2 pl-1`

type LegalTabId = 'privacy' | 'terms' | 'cookies'

const TAB_ORDER: LegalTabId[] = ['privacy', 'terms', 'cookies']

const TAB_ID: Record<LegalTabId, string> = {
  privacy: 'privacy-tab',
  terms: 'terms-tab',
  cookies: 'cookies-tab',
}

function tabFromHash(hash: string): LegalTabId {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash
  if (raw === 'terms' || raw === 'cookies') return raw
  return 'privacy'
}

const LEGAL_UPDATED_LABEL = '8 May 2026'

export default function PrivacyPolicyPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const activeTab = useMemo(
    () => tabFromHash(location.hash ?? ''),
    [location.hash],
  )

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [activeTab])

  function selectTab(next: LegalTabId) {
    const path =
      next === 'privacy'
        ? { pathname: '/privacy' as const, hash: undefined }
        : { pathname: '/privacy' as const, hash: next }
    navigate(path, { replace: true })
  }

  function onTabStripKeyDown(ev: KeyboardEvent<HTMLDivElement>) {
    const i = TAB_ORDER.indexOf(activeTab)
    if (i < 0) return
    let j = i
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') {
      ev.preventDefault()
      j = (i + 1) % TAB_ORDER.length
    } else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') {
      ev.preventDefault()
      j = (i - 1 + TAB_ORDER.length) % TAB_ORDER.length
    } else if (ev.key === 'Home') {
      ev.preventDefault()
      j = 0
    } else if (ev.key === 'End') {
      ev.preventDefault()
      j = TAB_ORDER.length - 1
    } else {
      return
    }
    const next = TAB_ORDER[j]
    selectTab(next)
    queueMicrotask(() => {
      document.getElementById(TAB_ID[next])?.focus({ preventScroll: true })
    })
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 font-mono text-fg sm:px-6 md:py-14">
      <p className="m-0 text-[10px] font-normal uppercase tracking-[0.14em] text-fg-subtle md:text-[11px]">
        Legal
      </p>
      <h1 className="mt-2 text-xl font-bold tracking-tight md:text-2xl">
        Privacy, terms &amp; cookies
      </h1>
      <p className={`${sectionClass} mt-4`}>
        Three short documents in one place. Use the switches below to jump between{' '}
        <strong className="font-medium text-fg-muted">privacy policy</strong>,{' '}
        <strong className="font-medium text-fg-muted">terms &amp; conditions</strong>, and{' '}
        <strong className="font-medium text-fg-muted">cookie policy</strong>. This material is for
        transparency only and is not legal advice—consult a qualified professional where needed.
      </p>

      <div
        className="mt-8 rounded border border-cell-border/80 bg-elevated/20 p-1"
        role="tablist"
        aria-label="Legal sections"
        onKeyDown={onTabStripKeyDown}
      >
        <div className="flex flex-wrap gap-1">
          <TabButton
            id="privacy-tab"
            controls="privacy-panel"
            selected={activeTab === 'privacy'}
            onSelect={() => selectTab('privacy')}
          >
            Privacy policy
          </TabButton>
          <TabButton
            id="terms-tab"
            controls="terms-panel"
            selected={activeTab === 'terms'}
            onSelect={() => selectTab('terms')}
          >
            Terms &amp; conditions
          </TabButton>
          <TabButton
            id="cookies-tab"
            controls="cookies-panel"
            selected={activeTab === 'cookies'}
            onSelect={() => selectTab('cookies')}
          >
            Cookie policy
          </TabButton>
        </div>
      </div>

      <p className="mt-6 text-[10px] leading-relaxed text-fg-subtle md:text-[11px]">
        Tip: bookmarks and shared links preserve your section—for example{' '}
        <code className="text-[10px] text-fg/80">
          …/privacy#terms
        </code>
        .
      </p>

      {activeTab === 'privacy' ? (
        <section
          id="privacy-panel"
          role="tabpanel"
          aria-labelledby="privacy-tab"
          className="mt-2 pb-4"
          tabIndex={-1}
        >
          <h2 className={`${h2Class} mt-12`}>Who this applies to</h2>
          <p className={sectionClass}>
            The site is a personal portfolio with optional case studies, a mini-game, and a public
            leaderboard. There are no accounts or e‑commerce. If you only browse static pages and
            never load the interactive game or call leaderboard APIs beyond ordinary page loads,
            processing is largely ordinary web hosting (see Infrastructure below).
          </p>

          <h2 className={h2Class}>What we collect</h2>
          <ul className={bulletListClass}>
            <li>
              <span className="text-fg/90">Leaderboard submissions.</span> When you finish or exit a
              run and choose to post to the global leaderboard, we store: a randomly generated
              codename from the game (a display label only, not linked to an account),
              your score, a timestamp for that submission, and optionally an{' '}
              <strong className="font-medium text-fg-muted">approximate city</strong> derived from
              your connection when the site runs on Vercel (IP-derived header such as{' '}
              <code className="text-[11px] text-fg/80">x-vercel-ip-city</code>)—not GPS. The city may
              be missing (local dev, VPNs, privacy settings, or when the host does not provide it).
            </li>
            <li>
              <span className="text-fg/90">Leaderboard viewer gate.</span> The full leaderboard page is
              access-controlled from your browser using a passphrase you type locally—we do{' '}
              <strong className="font-medium text-fg-muted">not</strong> transmit that passphrase to
              our servers as login credentials. To remember access for your tab, we may store unlock
              flags and timestamps in <code className="text-[11px] text-fg/80">sessionStorage</code>.
              The site may request a lightweight “session city” from the edge (same approximate city
              source as submissions) solely to decide how long viewer access persists in{' '}
              <code className="text-[11px] text-fg/80">sessionStorage</code>; that viewer check does{' '}
              <strong className="font-medium text-fg-muted">not</strong> appear on the public board unless
              you separately submit a score.
            </li>
            <li>
              <span className="text-fg/90">How leaderboard rows are kept.</span> The board keeps up to
              fifty rows globally—at most one row per codename, holding that codename’s best score.
              A new submission replaces the prior row for the same codename when the score improves.
            </li>
            <li>
              <span className="text-fg/90">Anti-duplicate submits.</span> If your browser sends a per-run
              session id with the submission, the server may set a short-lived key (about ten minutes)
              in Redis so the same session cannot submit multiple scores. That id is not shown on the
              public leaderboard payload.
            </li>
            <li>
              <span className="text-fg/90">Local device storage.</span> Your browser may keep small
              first-party artefacts to improve UX: leaderboard top-three fallback in{' '}
              <code className="text-[11px] text-fg/80">localStorage</code>; optional hide-list for city
              labels on the full board page; colour theme preference; a minimal gameplay tally for the
              mini-game; and a transient session marker used if a lazy-loaded bundle fails once and
              must retry—see{' '}
              <Link
                to="/privacy#cookies"
                className="text-fg underline decoration-cell-border/80 underline-offset-[3px] transition-colors hover:decoration-hud"
              >
                cookie policy
              </Link>{' '}
              for a concise grouping.
            </li>
            <li>
              <span className="text-fg/90">Cookies and similar technologies.</span> We do not use
              third-party advertising or analytics cookies on this site. Our own pages rely on{' '}
              <code className="text-[11px] text-fg/80">localStorage</code>{' '}
              <code className="text-[11px] text-fg/80">sessionStorage</code> rather than bespoke HTTP
              cookies set by application code—the detailed breakdown is under{' '}
              <Link
                to="/privacy#cookies"
                className="text-fg underline decoration-cell-border/80 underline-offset-[3px] transition-colors hover:decoration-hud"
              >
                Cookie policy
              </Link>
              .
            </li>
            <li>
              <span className="text-fg/90">Infrastructure.</span> Hosting (Vercel), the Redis provider
              (Upstash), CDN edges, and your browser vendor process technical data such as IP
              addresses, TLS metadata, diagnostics, or request logs under their own{' '}
              <Link
                to="/privacy#terms"
                className="text-fg underline decoration-cell-border/80 underline-offset-[3px] transition-colors hover:decoration-hud"
              >
                terms &amp; policies
              </Link>{' '}
              when you load pages or call APIs.
            </li>
          </ul>

          <h2 className={h2Class}>How we use it</h2>
          <p className={sectionClass}>
            Leaderboard and viewer-gate mechanics are used only to operate this demo on the site. We do
            not sell personal information. We do not use the leaderboard or viewer checks to build
            advertising profiles.
          </p>

          <h2 className={h2Class}>Legal bases (EEA / UK readers)</h2>
          <p className={sectionClass}>
            Where the GDPR or UK GDPR applies, we rely on our legitimate interest in operating this
            small public portfolio—including the optional leaderboard—and on your voluntary choice to
            submit a score or open gated pages with local controls. You can withdraw involvement by not
            submitting or by clearing browser storage for this origin; contact us (footer LinkedIn) for
            applicable access or deletion requests where they concern data we intentionally store.
          </p>

          <h2 className={h2Class}>Retention</h2>
          <p className={sectionClass}>
            Leaderboard rows persist in Redis until replaced by a better score for the same codename
            or until the dataset is cleared as part of maintenance. Session-lock keys expire
            automatically after about ten minutes. Browser-held tokens expire when you close the tab or
            clear site data unless otherwise noted on the leaderboard page for your region detection.
            Provider logs and backups may be retained separately under those vendors’ schedules.
          </p>

          <h2 className={h2Class}>Children</h2>
          <p className={sectionClass}>
            The site is a professional portfolio, not directed at children. We do not knowingly collect
            personal information from anyone under 13 (or the age required in your region). If you
            believe we have such data, contact us via the LinkedIn link in the footer.
          </p>

          <h2 className={h2Class}>Your choices</h2>
          <p className={sectionClass}>
            Avoid leaderboard-related processing by not playing the mini-game or not submitting scores.
            You can clear site data in your browser to remove cached leaderboard lines, viewer unlock
            state, preferences, or filter lists stored locally. Rights such as GDPR or CCPA access,
            deletion, or correction can be exercised by contacting us through the footer LinkedIn link
            with a concise description—we will reply as applicable law requires.
          </p>

          <h2 className={h2Class}>International transfers</h2>
          <p className={sectionClass}>
            Servers may be located in North America, the European Union, or other regions depending on
            Vercel or Upstash configuration. Those suppliers may transfer and process data globally
            under their contractual terms or standard safeguards.
          </p>

          <h2 className={h2Class}>Third-party destinations</h2>
          <p className={sectionClass}>
            Outbound references (for example LinkedIn or Instagram icons) leave this site—those
            services apply their own policies when you interact with them.
          </p>

          <h2 className={h2Class}>Changes</h2>
          <p className={sectionClass}>
            Any of these three sections may be updated when behaviour, providers, or law changes.
            Sections share the same substantive revision note below unless an update clearly states it
            only touches one heading.
          </p>
        </section>
      ) : null}

      {activeTab === 'terms' ? (
        <section
          id="terms-panel"
          role="tabpanel"
          aria-labelledby="terms-tab"
          className="mt-2 pb-4"
          tabIndex={-1}
        >
          <h2 className={`${h2Class} mt-12`}>Agreement</h2>
          <p className={sectionClass}>
            By accessing or using this portfolio site (the “site”), you agree to these terms. If you
            disagree, please stop using the site.
          </p>

          <h2 className={h2Class}>What the site is</h2>
          <p className={sectionClass}>
            The site showcases design and product work, optional deep-dive case studies, and a
            non-commercial mini-game with a public leaderboard. Nothing here is a binding offer of
            employment, services, or deliverables unless we separately sign a contract.
          </p>

          <h2 className={h2Class}>Acceptable use</h2>
          <p className={sectionClass}>
            Do not attempt to disrupt the site, probe it for vulnerabilities without permission, scrape
            it in a way that impairs performance, or misuse any API (including automated submission of
            leaderboard scores). Respect that case-study materials may represent past employers or
            clients—do not treat them as current product roadmaps for those organisations.
          </p>

          <h2 className={h2Class}>Leaderboard</h2>
          <p className={sectionClass}>
            Participating is voluntary. Displayed codenames are generated for fun and carry no verified
            identity. Rankings and timestamps are informational only—we do not promise accuracy or
            permanence—and can be wiped or moderated as part of normal operations described in our{' '}
            <button
              type="button"
              className="inline cursor-pointer border-0 bg-transparent p-0 text-fg underline decoration-cell-border/80 underline-offset-[3px] hover:decoration-hud"
              onClick={() => selectTab('privacy')}
            >
              privacy policy
            </button>
            .
          </p>

          <h2 className={h2Class}>Intellectual property</h2>
          <p className={sectionClass}>
            Unless stated otherwise next to downloadable assets or third-party badges, textual copy,
            layout, graphics, animations, fonts as used, trademarks of others used descriptively, and code
            that powers the site belong to Dez Chang or licensors. You receive a limited, revocable licence
            to view the site through an ordinary consumer browser—you may not copy, redistribute, reverse
            engineer, frame, mirror, mine for embeddings, or build a derivative database of the hosted
            work without explicit written consent.
          </p>

          <h2 className={h2Class}>Third-party links &amp; embeds</h2>
          <p className={sectionClass}>
            Links to LinkedIn, Instagram, or referenced tools open third-party destinations subject to{' '}
            their terms. Inclusion does not imply endorsement beyond describing past work contexts.
          </p>

          <h2 className={h2Class}>Disclaimers</h2>
          <p className={sectionClass}>
            Materials are provided “AS IS”. Case studies summarise professional experience for a design
            or product narrative—they are{' '}
            <strong className="font-medium text-fg-muted">not</strong> financial, legal, medical, or safety
            advice. To the fullest extent permitted by applicable law, we disclaim all warranties,
            expressed or implied, including merchantability, fitness for purpose, accuracy, availability,
            and non‑infringement.
          </p>

          <h2 className={h2Class}>Limitation of liability</h2>
          <p className={sectionClass}>
            Except where statute forbids exclusions, Dez Chang’s aggregate liability arising from these
            terms or site use shall not exceed the greater of CAD $100 or amounts you reasonably paid
            to access the leaderboard or game (normally zero because it is unpaid). Dez Chang shall not be
            liable for indirect, incidental, special, consequential, or punitive damages—even if warned of
            the possibility—including loss of data, profits, business, or goodwill.
          </p>

          <h2 className={h2Class}>Indemnity</h2>
          <p className={sectionClass}>
            You agree to defend and indemnify Dez Chang against third-party claims resulting from your
            misuse of the site, violation of these terms, or infringement you cause while posting or
            interacting with forms on the site (if any are added later).
          </p>

          <h2 className={h2Class}>Governing law</h2>
          <p className={sectionClass}>
            These terms are governed by the laws of the Province of Ontario and the federal laws of
            Canada applicable therein, without regard to conflict-of-law rules. Courts in Toronto,
            Ontario, have non-exclusive subject-matter jurisdiction unless mandatory consumer rules in your
            country say otherwise.
          </p>

          <h2 className={h2Class}>Severability &amp; updates</h2>
          <p className={sectionClass}>
            If a provision is unenforceable, the remainder stays in effect. We may revise these terms;
            continued use after the updated “last updated” date constitutes acceptance of the changes.
          </p>
        </section>
      ) : null}

      {activeTab === 'cookies' ? (
        <section
          id="cookies-panel"
          role="tabpanel"
          aria-labelledby="cookies-tab"
          className="mt-2 pb-4"
          tabIndex={-1}
        >
          <h2 className={`${h2Class} mt-12`}>Summary</h2>
          <p className={sectionClass}>
            This site does not load third-party advertising pixels or analytics SDKs that set marketing
            cookies on your behalf. Application code on this origin uses browser{' '}
            <code className="text-[11px] text-fg/80">localStorage</code> and{' '}
            <code className="text-[11px] text-fg/80">sessionStorage</code> for practical, first-party
            functions—grouped below. Platform-level HTTP cookies that Vercel, CDNs, or TLS terminators
            might issue for security or routing are outside our direct control; see their documentation.
          </p>

          <h2 className={h2Class}>First-party storage we rely on</h2>
          <ul className={bulletListClass}>
            <li>
              <span className="text-fg/90">Theme preference.</span> Remembers your selected colour theme
              so the next visit matches your choice.
            </li>
            <li>
              <span className="text-fg/90">Leaderboard HUD cache.</span> Stores a tiny copy of the top
              three scores when the live API is unavailable so the home HUD still shows something.
            </li>
            <li>
              <span className="text-fg/90">Leaderboard city hide list.</span> Remembers which city labels
              you asked to filter out on the full board view.
            </li>
            <li>
              <span className="text-fg/90">Viewer unlock state.</span> Remembers (per tab) that you
              entered the shared viewer passphrase and when, so the experience matches the policy
              described on the leaderboard page.
            </li>
            <li>
              <span className="text-fg/90">Mini-game helper values.</span> Keeps a lightweight numeric
              hint about recent interactive play so the intro can stay coherent between visits.
            </li>
            <li>
              <span className="text-fg/90">Bundle retry marker.</span> Short-lived{' '}
              <code className="text-[11px] text-fg/80">sessionStorage</code> flag that prevents infinite
              reload loops if a code-split chunk fails once.
            </li>
          </ul>

          <h2 className={h2Class}>Your controls</h2>
          <p className={sectionClass}>
            Every major browser lets you delete site data, block storage, or run in private windows.
            Doing so clears the items above until you interact with the site again. For rights or
            questions about data we store on servers (not just in your browser), see the{' '}
            <button
              type="button"
              className="inline cursor-pointer border-0 bg-transparent p-0 text-fg underline decoration-cell-border/80 underline-offset-[3px] hover:decoration-hud"
              onClick={() => selectTab('privacy')}
            >
              privacy policy
            </button>
            .
          </p>

          <h2 className={h2Class}>Changes</h2>
          <p className={sectionClass}>
            If we introduce new storage keys or partner technologies, we will adjust this section and
            the shared revision date.
          </p>
        </section>
      ) : null}

      <p className="mt-10 text-[10px] text-fg-subtle md:text-[11px]">
        Last updated (all sections): {LEGAL_UPDATED_LABEL}
      </p>

      <p className="mt-8 flex flex-wrap gap-x-4 gap-y-2">
        <Link
          to="/leaderboard"
          className="cursor-default text-[10px] text-fg-muted/55 no-underline hover:text-fg-muted/55"
        >
          ← Global leaderboard
        </Link>
        <Link
          to="/"
          className="text-xs text-fg underline decoration-cell-border underline-offset-[3px] transition-colors hover:decoration-hud"
        >
          Home
        </Link>
      </p>
    </main>
  )
}

function TabButton({
  id,
  controls,
  selected,
  children,
  onSelect,
}: {
  id: string
  controls: string
  selected: boolean
  children: ReactNode
  onSelect: () => void
}) {
  return (
    <button
      id={id}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={controls}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      className={
        selected
          ? 'flex-1 min-w-[10rem] rounded border border-cell-border bg-bg px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-fg shadow-[0_1px_0_rgba(0,0,0,0.04)] md:min-w-0 md:flex-none md:px-4'
          : 'flex-1 min-w-[10rem] rounded border border-transparent bg-transparent px-3 py-2.5 text-left text-[11px] font-normal uppercase tracking-[0.08em] text-fg-muted transition-colors hover:border-cell-border/50 hover:bg-elevated/40 hover:text-fg md:min-w-0 md:flex-none md:px-4'
      }
    >
      {children}
    </button>
  )
}
