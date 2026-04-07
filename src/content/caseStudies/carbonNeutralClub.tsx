import { PlaceholderVisual } from '../../components/system/PlaceholderVisual'
import type { CaseStudy } from '../../types/caseStudy'

export const carbonNeutralClubCaseStudy: CaseStudy = {
  slug: 'carbon-neutral-club',
  title: 'Carbon Neutral Club',
  subtitle:
    'Redesigning the carbon footprint to checkout flow that shifted the product from direct-to-consumer to company-funded memberships.',
  sections: [
    {
      id: 'overview',
      navLabel: 'Overview',
      type: 'statement',
      props: {
        statement:
          'A guided flow turned an abstract climate goal into a clear path — and the checkout itself became the lab for how the product was sold.',
        subtext:
          'End-to-end experience: calculator → personalized results → plan choice → transparent checkout.',
      },
    },
    {
      id: 'problem',
      navLabel: 'Problem',
      type: 'text',
      props: {
        title: 'The problem',
        description:
          'Millions want to take climate action but don’t know how to start. Offsetting sounds simple until users hit unclear steps, skeptical numbers, or mid-flow drop-off.',
        bullets: [
          'Unclear what to do next',
          'Hard to trust the footprint number',
          'Easy to abandon before checkout',
        ],
      },
    },
    {
      id: 'flow',
      navLabel: 'Flow',
      type: 'stepper',
      props: {
        title: 'Core user flow',
        steps: [
          {
            title: 'Calculator',
            description: 'Eight progressive steps with controlled inputs and low cognitive load.',
          },
          {
            title: 'Results',
            description: 'Personal CO₂ score with comparison to average so the number lands.',
          },
          {
            title: 'Plan',
            description: 'Choose offset depth — 50%, 100%, or 200% — tied to commitment.',
          },
          {
            title: 'Checkout',
            description: 'Cost breakdown and where money goes to protect trust at pay.',
          },
        ],
      },
    },
    {
      id: 'system',
      navLabel: 'System',
      type: 'split',
      props: {
        title: 'The system',
        description:
          'A step-by-step journey that reduces uncertainty and earns trust before asking for payment.',
        bullets: [
          'Expectations set up front',
          'Structured clarity instead of information dumps',
          'Transparency at the decision points',
        ],
        visual: (
          <PlaceholderVisual label="Flow diagram: calculator → results → plan → checkout (replace with final mock)" />
        ),
        reverse: false,
      },
    },
    {
      id: 'insight',
      navLabel: 'Insight',
      type: 'statement',
      props: {
        statement:
          'Users weren’t confused by climate action. They were confused by what their number meant and whether it was worth paying for.',
      },
    },
    {
      id: 'calculator',
      navLabel: 'Calculator',
      type: 'split',
      props: {
        title: 'Calculator',
        description: 'An eight-step flow that turns scattered inputs into one credible footprint.',
        bullets: ['Progressive steps', 'Controlled inputs', 'Minimal cognitive load'],
        visual: <PlaceholderVisual label="Multi-step calculator UI sequence" />,
        reverse: true,
      },
    },
    {
      id: 'results-plan',
      navLabel: 'Results & plan',
      type: 'split',
      props: {
        title: 'Results & plan selection',
        description:
          'Users get a personalized score with context, then choose how much to offset.',
        bullets: ['Footprint + comparison to average', 'Tiers: 50% · 100% · 200%'],
        visual: (
          <PlaceholderVisual label="Results screen + plan selection with offset tiers" />
        ),
        reverse: false,
      },
    },
    {
      id: 'checkout',
      navLabel: 'Checkout',
      type: 'split',
      props: {
        title: 'Checkout',
        description: 'Pricing and allocation spelled out so the last step feels fair, not vague.',
        bullets: ['Where money goes', 'Clear pricing structure'],
        visual: <PlaceholderVisual label="Checkout UI with breakdown and trust cues" />,
        reverse: true,
      },
    },
    {
      id: 'research',
      navLabel: 'Research',
      type: 'text',
      props: {
        title: 'What we learned from users',
        description:
          'People engaged deeply with understanding their footprint but hesitated at pay.',
        bullets: [
          'Unclear value of the number',
          'Hesitation at checkout',
          'Need for pricing transparency',
        ],
      },
    },
    {
      id: 'pivot',
      navLabel: 'Pivot',
      type: 'decision',
      props: {
        title: 'From individual pay to employer-backed',
        items: [
          {
            insight:
              'Companies wanted to offer offsets as a benefit — not as something employees paid for alone.',
            decision:
              'Pilot employer-funded checkout: same calculator, $0 employee contribution.',
            outcome:
              'Validated demand for B2B2C; checkout became the experiment surface for pricing.',
          },
          {
            insight: 'Trust and clarity mattered more than shortening the flow.',
            decision: 'Kept explicit steps and explanations instead of collapsing the journey.',
            outcome: 'Higher confidence at checkout and fewer “what am I buying?” moments.',
          },
        ],
      },
    },
    {
      id: 'model',
      navLabel: 'Model',
      type: 'comparison',
      props: {
        title: 'Business model shift',
        bullets: [
          'Individual checkout → company-funded membership',
          'New pricing and onboarding paths',
          'Product value reframed around workforce benefit',
        ],
        before: (
          <PlaceholderVisual
            className="min-h-[200px] md:min-h-[220px]"
            label="B2C: user calculates, selects plan, pays individually"
          />
        ),
        after: (
          <PlaceholderVisual
            className="min-h-[200px] md:min-h-[220px]"
            label="B2B2C: employer covers cost; employees still complete core flow"
          />
        ),
      },
    },
    {
      id: 'impact',
      navLabel: 'Impact',
      type: 'kpi',
      props: {
        title: 'Impact',
        metrics: [
          { value: 'High', label: 'Calculator engagement', description: 'Majority entered the flow' },
          {
            value: '↓',
            label: 'Structured drop-off',
            description: 'Clearer funnel after iteration',
          },
          {
            value: '1000+',
            label: 'Members (year one)',
            description: 'Including company-funded paths',
          },
          {
            value: 'B2B2C',
            label: 'Model expansion',
            description: 'Checkout informed pricing strategy',
          },
        ],
      },
    },
    {
      id: 'retrospective',
      navLabel: 'Retrospective',
      type: 'text',
      props: {
        title: 'Retrospective',
        bullets: [
          'More steps → improved clarity',
          'Slower flow → stronger trust',
          'More explanation → better decisions',
          'Clarity beats faux simplicity in complex domains',
          'Long flows work when each step is legible',
          'Product flows can steer business strategy — not only UX',
        ],
      },
    },
  ],
}
