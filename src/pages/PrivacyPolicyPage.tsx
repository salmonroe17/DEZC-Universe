import { Link } from 'react-router-dom'

const sectionClass = 'mt-8 max-w-2xl text-sm leading-relaxed text-fg-muted'
const h2Class = 'mt-10 text-xs font-semibold uppercase tracking-[0.1em] text-fg'

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 font-mono text-fg sm:px-6 md:py-14">
      <p className="m-0 text-[10px] font-normal uppercase tracking-[0.14em] text-fg-subtle md:text-[11px]">
        Legal
      </p>
      <h1 className="mt-2 text-xl font-bold tracking-tight md:text-2xl">Privacy policy</h1>
      <p className={`${sectionClass} mt-4`}>
        This page explains how this portfolio site (“the site”) handles information. It is for
        transparency only and is not legal advice. For certainty in your jurisdiction, consult a
        qualified professional.
      </p>

      <h2 className={h2Class}>Who this applies to</h2>
      <p className={sectionClass}>
        The site is a personal portfolio with an optional mini-game and a public leaderboard. There
        are no accounts, logins, or e‑commerce. If you only browse project pages and never open the
        game or submit a score, the only processing is ordinary web hosting (see Infrastructure
        below).
      </p>

      <h2 className={h2Class}>What we collect</h2>
      <ul className={`${sectionClass} list-inside list-disc space-y-2 pl-1`}>
        <li>
          <span className="text-fg/90">Leaderboard submissions.</span>           When you finish or exit a run
          and choose to post to the global leaderboard, we store: a randomly generated codename
          from the game (a display label only, not linked to an account),
          your score, a timestamp for that submission, and optionally an{' '}
          <strong className="font-medium text-fg-muted">approximate city</strong> derived from your
          connection when the site runs on Vercel (IP-derived header such as{' '}
          <code className="text-[11px] text-fg/80">x-vercel-ip-city</code>)—not GPS. The city may be
          missing (local dev, VPN, or when the host does not provide it).
        </li>
        <li>
          <span className="text-fg/90">How leaderboard rows are kept.</span> The board keeps up to
          fifty rows globally—at most one row per codename, holding that codename’s best score. A new
          submission replaces the prior row for the same codename when the score improves.
        </li>
        <li>
          <span className="text-fg/90">Anti-duplicate submits.</span> If your browser sends a
          per-run session id with the submission, the server may set a short-lived key (about ten
          minutes) in Redis so the same session cannot submit multiple scores. That id is not added
          to the public leaderboard payload.
        </li>
        <li>
          <span className="text-fg/90">Local device.</span> If the leaderboard API is unavailable,
          your browser may cache a small copy of the top three scores in{' '}
          <code className="text-[11px] text-fg/80">localStorage</code> so the in-game HUD can still
          show recent rankings.
        </li>
        <li>
          <span className="text-fg/90">Cookies and similar.</span> We do not use third-party
          advertising or analytics cookies on this site. Essential technical storage (e.g.{' '}
          <code className="text-[11px] text-fg/80">localStorage</code> as above) is limited to the
          leaderboard fallback described here.
        </li>
        <li>
          <span className="text-fg/90">Infrastructure.</span> Hosting (Vercel), the Redis provider
          (Upstash), and your browser vendor process technical data such as IP addresses, TLS
          metadata, and request logs under their own terms and privacy notices when you load pages or
          call APIs.
        </li>
      </ul>

      <h2 className={h2Class}>How we use it</h2>
      <p className={sectionClass}>
        Leaderboard data is used only to compute and display rankings on the site. We do not sell
        personal information. We do not use the leaderboard to build advertising profiles.
      </p>

      <h2 className={h2Class}>Legal bases (EEA / UK readers)</h2>
      <p className={sectionClass}>
        Where the GDPR or UK GDPR applies, we rely on our legitimate interest in operating a small
        public demo (leaderboard) and on your voluntary choice to submit a score. You can withdraw
        that choice by not submitting; contact us (footer LinkedIn) for applicable access or deletion
        requests.
      </p>

      <h2 className={h2Class}>Retention</h2>
      <p className={sectionClass}>
        Leaderboard rows persist in Redis until replaced by a better score for the same codename or
        until the dataset is cleared as part of maintenance. Session-lock keys expire automatically
        after about ten minutes. Provider logs and backups may be retained for separate periods under
        the host’s policies.
      </p>

      <h2 className={h2Class}>Children</h2>
      <p className={sectionClass}>
        The site is a professional portfolio, not directed at children. We do not knowingly collect
        personal information from anyone under 13 (or the age required in your region). If you
        believe we have such data, contact us via the LinkedIn link in the footer.
      </p>

      <h2 className={h2Class}>Your choices</h2>
      <p className={sectionClass}>
        You can avoid leaderboard processing by not playing the mini-game or by not submitting a
        score. You can clear site data in your browser to remove cached leaderboard entries. For
        rights under laws such as the GDPR or CCPA (access, deletion, correction, etc.), contact us
        using the LinkedIn link in the site footer and describe your request; we will respond as
        required by applicable law.
      </p>

      <h2 className={h2Class}>International transfers</h2>
      <p className={sectionClass}>
        Servers may be located in the United States, the European Union, or other regions depending
        on Vercel and Upstash configuration. Those providers may transfer and process data across
        borders under their standard contractual terms.
      </p>

      <h2 className={h2Class}>Changes</h2>
      <p className={sectionClass}>
        We may update this page when the site or providers change. The date below reflects the last
        substantive revision.
      </p>

      <p className="mt-8 text-[10px] text-fg-subtle md:text-[11px]">
        Last updated: 25 April 2026
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
