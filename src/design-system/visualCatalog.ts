import { CARBON_CASE_STUDY_SHOWCASE_NAV, SUPER_CASE_STUDY_SHOWCASE_NAV, IBM_ENVIZI_CASE_STUDY_SHOWCASE_NAV, DS_CASE_STUDY_SHOWCASE_NAV, CASE_STUDY_SHOWCASE_NAV } from '../data/caseStudyShowcaseNav'

export type VisualStory = { id: string; name: string; group: string; description: string; source: string; usedIn: string[] }
const story = (id: string, name: string, group: string, description: string, source: string, usedIn: string[]): VisualStory => ({ id, name, group, description, source, usedIn })
export const visualStories: VisualStory[] = [
  story('cursor','Cursor','Interaction','The portfolio’s actual reticle: normal, expanded, text-field and coarse-pointer behavior.','src/components/CustomCursor.tsx',['Entire portfolio']),
  story('cursor-interactions','Cursor interactions','Interaction','Explore hover targeting, the particle trail, text entry and disabled targets in a live playground.','src/components/CustomCursor.tsx',['Entire portfolio']),
  story('card-corners','Card corners & borders','Surfaces','Inspect the actual clipped corners, border inset, hover highlight and animated outline.','src/components/system/ChamferFrame.tsx',['Home','Case studies']),
  story('buttons','Buttons','Actions','Actions in their default, selected, focus and disabled states. Try the controls in each example.','src/components/system/PortfolioControls.tsx',['Global leaderboard','Case studies']),
  story('icon-buttons','Icon buttons','Actions','Compact actions for closing, moving between items and changing presentation settings.','src/components/system/PresentationIconButton.tsx',['Case-study presentation toolbar']),
  story('links','Links','Actions','Navigation links with the underline and focus treatment used throughout the portfolio.','src/components/SiteTopBar.tsx',['Site header','Footer','Case studies']),
  story('text-fields','Text fields','Forms','Editable text fields with labels, help text, errors and disabled states.','src/components/system/PortfolioControls.tsx',['Leaderboard gate']),
  story('password','Password field','Forms','The actual password field and unlock button used by the leaderboard. This example does not submit credentials.','src/components/LeaderboardGate.tsx',['Leaderboard gate']),
  story('search','Search & filtering','Forms','Search a real collection and use the portfolio’s city filter. Changes stay inside this example.','src/components/LeaderboardCityFilter.tsx',['Global leaderboard']),
  story('switch','Switches','Forms','A live two-state switch using the case-study annotation control styles.','src/components/system/CaseStudySwitch.tsx',['Case studies','Presentations']),
  story('header','Site header','Navigation','The real portfolio header. Open Case studies or Side quests to try its dialogs.','src/components/SiteTopBar.tsx',['Home','Leaderboard','Legal']),
  story('sidebar','Section sidebar','Navigation','The actual case-study sidebar. Select a section to change its active state.','src/components/system/SidebarNav.tsx',['All case studies']),
  story('tabs','Tabs','Navigation','The actual Privacy, Terms and Cookies tab buttons, with live selection and keyboard navigation.','src/components/system/PortfolioTabs.tsx',['Legal']),
  story('footer','Footer','Navigation','The real site footer with legal, home and social links.','src/components/SiteFooter.tsx',['Portfolio pages']),
  story('card','Cards','Surfaces','The shared chamfered card with text, media, and an animated outline.','src/components/system/ChamferFrame.tsx',['Home','All case studies']),
  story('rows','Rows & lists','Data display','The actual project rows inside the shared case-study panel.','src/components/ExperimentalCaseStudiesPanel.tsx',['Home','Case-study footers']),
  story('metrics','Metrics','Data display','The real animated metric grid, including values, labels and supporting descriptions.','src/components/caseStudy/patterns/KpiMetricsGrid.tsx',['Case studies']),
  story('progress','Reading progress','Data display','The actual animated progress bar. Drag the slider to change its value.','src/components/caseStudy/CaseStudyScrollProgressBar.tsx',['Case studies','Presentations']),
  story('loading','Loading state','Feedback','The real loading indicator used while a portfolio page is opening.','src/components/HudLoadingScreen.tsx',['All routes']),
  story('not-found','Not-found state','Feedback','The real animated 404 treatment, including reduced-motion support.','src/components/NotFound404Glyph.tsx',['404 page']),
  story('presentation','Case-study presentation','Overlays','The full-screen photo and presentation overlay used when a case-study image is clicked. Try media-only and media-plus-text modes.','src/components/caseStudy/CaseStudyPresentationOverlay.tsx',['All case studies']),
  story('lightbox','Lightboxes & dialogs','Overlays','Open the actual case-study and side-quest dialogs. Close with the button, backdrop or Escape.','src/components/CaseStudiesCardModal.tsx',['Site navigation']),
  story('image','Image frames','Media','Original portfolio imagery inside the actual shared media frame. Open an image for a larger view.','src/components/system/ChamferFrame.tsx',['Case studies','Side quests']),
  story('video','Video','Media','The actual muted, looping, lazy-loaded case-study video. The media keeps its original colors.','src/components/caseStudy/CaseStudyLazyVideo.tsx',['Case studies']),
  story('timeline','Timelines','Content patterns','The real horizontal timeline with connectors, single-line labels and multiline labels.','src/components/caseStudy/patterns/TimelinePillsRow.tsx',['Case studies']),
  story('comparison','Before & after','Content patterns','The actual comparison component. Switch between two visuals to inspect its selected state.','src/components/caseStudy/patterns/ComparisonShowcase.tsx',['Case studies']),
  story('statement','Problem statements','Content patterns','The real bracketed problem statement, alongside the quote and narrative treatment.','src/components/caseStudy/patterns/ProblemStatementFrame.tsx',['Case studies']),
  story('decisions','Decision cards','Content patterns','The actual insight, decision and outcome card used in case studies.','src/components/sections/DecisionSection.tsx',['Case studies']),
  story('case-study-card','Case-study card','Page sections','The portfolio’s real case-study panel, including its cube and project list.','src/components/ExperimentalCaseStudiesPanel.tsx',['Home','Case-study footers']),
  story('hero','Introduction & game','Page sections','The actual introduction and mini-game, shown in its homepage context.','src/components/HudShooterIntro.tsx',['Home']),
  story('biography','Biography','Page sections','The real biography and dot-art section from the homepage.','src/components/ExperimentalGrid.tsx',['Home']),
  story('side-quests','Side-quest timeline','Page sections','The actual animated timeline with original artwork and album navigation.','src/components/ExperimentalSideQuestsPanel.tsx',['Home','Side-quest dialog']),
]
export const visualStoryGroups = [...new Set(visualStories.map((s) => s.group))].map((name) => ({ name, stories: visualStories.filter((s) => s.group === name) }))
export const pageSections: Record<string, { id: string; label: string }[]> = {
  '/': [{id:'[data-design-section="hero"]',label:'Introduction & game'},{id:'[data-design-section="case-studies"]',label:'Case studies'},{id:'[data-design-section="biography"]',label:'Biography'},{id:'[data-show-tell-quadrant]',label:'Side-quest timeline'}],
  '/case-study/carbon-neutral-club': CARBON_CASE_STUDY_SHOWCASE_NAV,
  '/case-study/super-app': SUPER_CASE_STUDY_SHOWCASE_NAV,
  '/case-study/ibm-envizi': IBM_ENVIZI_CASE_STUDY_SHOWCASE_NAV,
  '/case-study/design-systems': DS_CASE_STUDY_SHOWCASE_NAV,
  '/case-study/components': CASE_STUDY_SHOWCASE_NAV,
  '/privacy': [{id:'privacy',label:'Privacy policy'},{id:'terms',label:'Terms & conditions'},{id:'cookies',label:'Cookie policy'}],
}
