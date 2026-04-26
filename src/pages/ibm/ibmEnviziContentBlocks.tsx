/**
 * Long-form copy shared by {@link IbmEnviziShowcasePage} and {@link IbmPresentationDeck}
 * so presentation mode text slides stay aligned with the page.
 */

export const ACTION_LAYER_STEP_1 = {
  step: 1,
  title: 'Select a template',
  kicker: 'Core flow - Step 1',
  middleColumn: (
    <>
      One of the first problems users faced was not knowing where to begin.
      <br />
      <br />
      I designed a template system that converted technical sustainability goals into clear starting points.
    </>
  ),
  rightIntro: 'Users start from a predefined path such as:',
  listItems: [
    'Improve calculation method',
    'Collect supplier emissions data',
    'Increase coverage',
    'Strengthen supplier-specific reporting',
  ] as const,
}

export const CRITERIA_SELECTION_STEP_2 = {
  step: 2,
  title: 'Criteria selection',
  kicker: 'Core flow - Step 2',
  centerColumn: (
    <>
      Not every supplier creates equal impact.
      <br />
      <br />
      This shifted teams from broad manual outreach to focused, high-value engagement.
    </>
  ),
  rightIntro: 'Choose which suppliers or products to target based on:',
  listItems: ['Missing data', 'Weak methods', 'Category priority', 'Strategic suppliers'] as const,
}

export const DEFINE_MEASURABLE_SUCCESS_STEP_3 = {
  step: 3,
  title: 'Define measurable success',
  kicker: 'Core flow - Step 3',
  centerColumn: (
    <>
      Without a clear outcome, supplier engagement becomes endless activity.
      <br />
      <br />
      This gave teams a reason to act and a way to measure progress.
    </>
  ),
  rightIntro: 'Define what success looks like:',
  listItems: [
    'Stronger methods adopted',
    'Suppliers engaged',
    'Coverage improved',
    'More accurate data',
    'Reduced emissions',
  ] as const,
}

export const EXECUTE_ACTIONS_STEP_4 = {
  step: 4,
  title: 'Execute actions',
  kicker: 'Core flow - Step 4',
  centerColumn: (
    <>
      Instead of expecting users to invent their own process, I designed guided actions tied to each
      calculation method and workflow state.
      <br />
      <br />
      Because each emissions method required different actions, this involved significant branching logic
      and edge-case design.
    </>
  ),
  rightIntro: 'The system guides next steps:',
  listItems: [
    'Request documents',
    'Request PCF data',
    'Send reminders',
    'Review submissions',
    'Approve evidence',
  ] as const,
}

export const TRACK_PROGRESS_STEP_5 = {
  step: 5,
  title: 'Track progress',
  kicker: 'Core flow - Step 5',
  centerColumn:
    'Once plans were live, users needed to know whether anything was actually improving. This transformed emissions improvement from guesswork into a visible operating process.',
  rightIntro: 'I designed tracking states that allowed teams to monitor:',
  listItems: [
    'Supplier responses',
    'Completion rates',
    'Workflow status',
    'Stronger method adoption',
    'Progress toward goals',
  ] as const,
}

export const MAKING_EMISSIONS_CHANGES = {
  title: 'Making emissions changes understandable',
  lede: 'The most difficult screen was the comparison + recalculation experience.',
  usersNeedIntro: 'Users needed to understand:',
  usersNeed: [
    'What changed',
    'Why it changed',
    'Whether it improved quality',
    'How the number was calculated',
  ] as const,
  introducedTitle: 'What I introduced',
  introducedIntro: 'A comparison system showing:',
  introduced: [
    'Current emissions total',
    'Updated total',
    'Difference between them',
    'Calculation logic / equations',
  ] as const,
  whyTitle: 'Why it mattered',
  whyTrust: 'It made a complex system feel trustworthy.',
  connectIntro: 'Users could finally connect:',
  connectChain: 'Supplier action → cleaner data → updated emissions',
}

export const OTHER_HALF_OF_SYSTEM = {
  title: 'The Other Half of the System',
  context:
    'Action Plans only work if suppliers can actually respond. Internal teams could launch plans and send requests. But suppliers still needed a clear way to complete them. That required a second product experience.',
  whatHeading: 'What I designed',
  whatIntro: 'I built the supplier-facing portal where external partners could:',
  whatList: [
    'Receive emissions requests',
    'Understand what was being asked',
    'Upload files and evidence',
    'Update submissions',
    'View statuses and deadlines',
    'Respond across multiple request types',
  ] as const,
  whyHeading: 'Why this mattered',
  fragmentedIntro: 'Before this, responses were fragmented across:',
  fragmentedList: [
    'Email threads',
    'Spreadsheets',
    'Missing attachments',
    'Unclear ownership',
    'Inconsistent formats',
  ] as const,
  closing: 'The portal converted scattered communication into structured data collection.',
}

export const FOUR_METHODS_ONE_EXPERIENCE = {
  title: '4 methods. 4 branching systems. 1 usable experience.',
  body: 'Each calculation method had different inputs, different actions, different supplier asks, and different outcomes. I designed them as parallel flows inside one coherent system.',
  cards: [
    {
      n: 1,
      title: 'Spend-Based',
      body:
        'The default path: use financial spend and category factors when detailed activity data is not available.',
      tags: ['Most common', 'Lowest accuracy'] as const,
    },
    {
      n: 2,
      title: 'Average-data',
      body: 'Fills gaps with industry-average emission factors when spend or category data is the best available signal.',
      tags: ['Industry factors', 'Mid accuracy'] as const,
    },
    {
      n: 3,
      title: 'Hybrid',
      body: 'Combines different calculation stages and data sources in one footprint when no single method covers the whole product.',
      tags: ['Mixed methods', 'Highest complexity'] as const,
    },
    {
      n: 4,
      title: 'Supplier-specific',
      body: 'Uses supplier-reported, product-level or facility-level data when partners can submit and maintain primary evidence.',
      tags: ['Direct data', 'Gold standard'] as const,
    },
  ] as const,
}

export const BEFORE_VS_AFTER = {
  kicker: 'Before vs After',
  title: 'From fragmented coordination to one operating system',
  beforeLabel: 'Before',
  beforeList: [
    'Identify issue in dashboard',
    'Export data',
    'Email suppliers manually',
    'Track replies in Excel',
    'Validate inconsistently',
    'Repeat every cycle',
  ] as const,
  afterLabel: 'After',
  afterList: [
    'Identify issue',
    'Launch Action Plan',
    'Target suppliers',
    'Send requests in-product',
    'Review responses',
    'Track progress centrally',
  ] as const,
  whatChangedLabel: 'What changed',
  whatChanged:
    'Not just convenience. The workflow became scalable, repeatable, and easier to trust.',
} as const

export const IBM_IMPACT_OUTCOMES = {
  kicker: 'Impact:',
  title: 'What my work unlocked',
  columns: [
    {
      heading: 'For users',
      items: [
        'Clearer next steps',
        'Less manual coordination',
        'Better visibility into progress',
        'Easier supplier engagement',
        'Stronger confidence in data quality',
      ] as const,
    },
    {
      heading: 'For the product',
      items: [
        'Moved beyond passive dashboards',
        'Introduced a reusable workflow engine',
        'Created foundation for future sustainability actions',
      ] as const,
    },
    {
      heading: 'Internally',
      items: [
        'PM relied heavily on my product translation skills',
        'Engineers depended on my specs',
        'I carried full sprint design output when bandwidth was low',
        'I became the speed + clarity driver on the project',
      ] as const,
    },
  ] as const,
} as const
