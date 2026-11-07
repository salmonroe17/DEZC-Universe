# Component fidelity audit

Static source linkage audit. Imports establish shared implementation, not visual equivalence of every prop, state or wrapper. Components without a dedicated story remain accessible through live page previews.

## Catalog entries

| Entry | Implementation | Production consumers |
| --- | --- | --- |
| Cursor | `src/components/CustomCursor.tsx` | `src/App.tsx` |
| Cursor interactions | `src/components/CustomCursor.tsx` | `src/App.tsx` |
| Card corners & borders | `src/components/system/ChamferFrame.tsx` | `src/components/caseStudy/CaseStudyShowcaseScaffold.tsx`, `src/components/caseStudy/patterns/BeforeAfterToggle.tsx`, `src/components/caseStudy/patterns/ComparisonShowcase.tsx`, `src/components/sections/DecisionSection.tsx`, `src/components/system/PlaceholderVisual.tsx`, `src/pages/CarbonNeutralClubShowcasePage.tsx`, `src/pages/CaseStudyComponentsPage.tsx`, `src/pages/DesignSystemsShowcasePage.tsx`, `src/pages/IbmEnviziShowcasePage.tsx`, `src/pages/SuperAppShowcasePage.tsx`, `src/pages/carbon/CarbonPresentationDeck.tsx`, `src/pages/ds/DsPresentationDeck.tsx`, `src/pages/ds/dsPresentationTextSlides.tsx`, `src/pages/ibm/IbmDeckToggleChamfer.tsx`, `src/pages/ibm/IbmPresentationDeck.tsx`, `src/pages/ibm/ibmEnviziContentComponents.tsx`, `src/pages/super/SuperPresentationDeck.tsx`, `src/pages/super/SuperShowcaseChamfers.tsx` |
| Buttons | `src/components/system/PortfolioControls.tsx` | `src/components/LeaderboardGate.tsx` |
| Icon buttons | `src/components/system/PresentationIconButton.tsx` | `src/components/caseStudy/CaseStudyPresentationOverlay.tsx`, `src/components/system/PortfolioControls.tsx` |
| Links | `src/components/SiteTopBar.tsx` | `src/layouts/RootLayout.tsx` |
| Text fields | `src/components/system/PortfolioControls.tsx` | `src/components/LeaderboardGate.tsx` |
| Password field | `src/components/LeaderboardGate.tsx` | `src/pages/GlobalLeaderboardPage.tsx` |
| Search & filtering | `src/components/LeaderboardCityFilter.tsx` | `src/pages/GlobalLeaderboardPage.tsx` |
| Switches | `src/components/system/CaseStudySwitch.tsx` | `src/pages/CarbonNeutralClubShowcasePage.tsx`, `src/pages/IbmEnviziShowcasePage.tsx`, `src/pages/carbon/CarbonPresentationDeck.tsx`, `src/pages/ibm/IbmDeckToggleChamfer.tsx`, `src/pages/super/SuperShowcaseChamfers.tsx` |
| Site header | `src/components/SiteTopBar.tsx` | `src/layouts/RootLayout.tsx` |
| Section sidebar | `src/components/system/SidebarNav.tsx` | `src/components/caseStudy/CaseStudyRenderer.tsx`, `src/components/caseStudy/CaseStudyShowcaseScaffold.tsx` |
| Tabs | `src/components/system/PortfolioTabs.tsx` | `src/pages/PrivacyPolicyPage.tsx` |
| Footer | `src/components/SiteFooter.tsx` | `src/layouts/RootLayout.tsx` |
| Cards | `src/components/system/ChamferFrame.tsx` | `src/components/caseStudy/CaseStudyShowcaseScaffold.tsx`, `src/components/caseStudy/patterns/BeforeAfterToggle.tsx`, `src/components/caseStudy/patterns/ComparisonShowcase.tsx`, `src/components/sections/DecisionSection.tsx`, `src/components/system/PlaceholderVisual.tsx`, `src/pages/CarbonNeutralClubShowcasePage.tsx`, `src/pages/CaseStudyComponentsPage.tsx`, `src/pages/DesignSystemsShowcasePage.tsx`, `src/pages/IbmEnviziShowcasePage.tsx`, `src/pages/SuperAppShowcasePage.tsx`, `src/pages/carbon/CarbonPresentationDeck.tsx`, `src/pages/ds/DsPresentationDeck.tsx`, `src/pages/ds/dsPresentationTextSlides.tsx`, `src/pages/ibm/IbmDeckToggleChamfer.tsx`, `src/pages/ibm/IbmPresentationDeck.tsx`, `src/pages/ibm/ibmEnviziContentComponents.tsx`, `src/pages/super/SuperPresentationDeck.tsx`, `src/pages/super/SuperShowcaseChamfers.tsx` |
| Rows & lists | `src/components/ExperimentalCaseStudiesPanel.tsx` | `src/components/CaseStudiesCardModal.tsx`, `src/components/ExperimentalGrid.tsx`, `src/components/caseStudy/CaseStudyRenderer.tsx`, `src/pages/CarbonNeutralClubShowcasePage.tsx`, `src/pages/CaseStudyComponentsPage.tsx`, `src/pages/DesignSystemsShowcasePage.tsx`, `src/pages/IbmEnviziShowcasePage.tsx`, `src/pages/SuperAppShowcasePage.tsx` |
| Metrics | `src/components/caseStudy/patterns/KpiMetricsGrid.tsx` | `src/components/caseStudy/patterns/index.ts`, `src/components/sections/KPISection.tsx` |
| Reading progress | `src/components/caseStudy/CaseStudyScrollProgressBar.tsx` | `src/components/caseStudy/CaseStudyPresentationOverlay.tsx`, `src/components/caseStudy/CaseStudyShowcaseScaffold.tsx` |
| Loading state | `src/components/HudLoadingScreen.tsx` | `src/App.tsx` |
| Not-found state | `src/components/NotFound404Glyph.tsx` | `src/components/ErrorBoundary.tsx`, `src/pages/NotFoundPage.tsx` |
| Case-study presentation | `src/components/caseStudy/CaseStudyPresentationOverlay.tsx` | `src/components/caseStudy/CaseStudyShowcaseScaffold.tsx`, `src/pages/carbon/CarbonPresentationDeck.tsx`, `src/pages/ds/DsPresentationDeck.tsx` |
| Lightboxes & dialogs | `src/components/CaseStudiesCardModal.tsx` | `src/components/SiteTopBar.tsx`, `src/components/caseStudy/CaseStudyShowcaseScaffold.tsx`, `src/pages/SideQuestViewerPage.tsx` |
| Image frames | `src/components/system/ChamferFrame.tsx` | `src/components/caseStudy/CaseStudyShowcaseScaffold.tsx`, `src/components/caseStudy/patterns/BeforeAfterToggle.tsx`, `src/components/caseStudy/patterns/ComparisonShowcase.tsx`, `src/components/sections/DecisionSection.tsx`, `src/components/system/PlaceholderVisual.tsx`, `src/pages/CarbonNeutralClubShowcasePage.tsx`, `src/pages/CaseStudyComponentsPage.tsx`, `src/pages/DesignSystemsShowcasePage.tsx`, `src/pages/IbmEnviziShowcasePage.tsx`, `src/pages/SuperAppShowcasePage.tsx`, `src/pages/carbon/CarbonPresentationDeck.tsx`, `src/pages/ds/DsPresentationDeck.tsx`, `src/pages/ds/dsPresentationTextSlides.tsx`, `src/pages/ibm/IbmDeckToggleChamfer.tsx`, `src/pages/ibm/IbmPresentationDeck.tsx`, `src/pages/ibm/ibmEnviziContentComponents.tsx`, `src/pages/super/SuperPresentationDeck.tsx`, `src/pages/super/SuperShowcaseChamfers.tsx` |
| Video | `src/components/caseStudy/CaseStudyLazyVideo.tsx` | `src/pages/CarbonNeutralClubShowcasePage.tsx`, `src/pages/DesignSystemsShowcasePage.tsx`, `src/pages/IbmEnviziShowcasePage.tsx`, `src/pages/SuperAppShowcasePage.tsx`, `src/pages/carbon/CarbonPresentationDeck.tsx`, `src/pages/ds/dsPresentationTextSlides.tsx`, `src/pages/ibm/IbmDeckAutoplayVideo.tsx`, `src/pages/ibm/IbmPresentationDeck.tsx`, `src/pages/super/SuperDeckAutoplayVideo.tsx`, `src/pages/super/SuperPresentationDeck.tsx` |
| Timelines | `src/components/caseStudy/patterns/TimelinePillsRow.tsx` | `src/components/caseStudy/patterns/index.ts`, `src/components/sections/StepperSection.tsx` |
| Before & after | `src/components/caseStudy/patterns/ComparisonShowcase.tsx` | `src/components/caseStudy/patterns/index.ts` |
| Problem statements | `src/components/caseStudy/patterns/ProblemStatementFrame.tsx` | `src/components/caseStudy/patterns/index.ts` |
| Decision cards | `src/components/sections/DecisionSection.tsx` | `src/components/caseStudy/CaseStudyRenderer.tsx` |
| Case-study card | `src/components/ExperimentalCaseStudiesPanel.tsx` | `src/components/CaseStudiesCardModal.tsx`, `src/components/ExperimentalGrid.tsx`, `src/components/caseStudy/CaseStudyRenderer.tsx`, `src/pages/CarbonNeutralClubShowcasePage.tsx`, `src/pages/CaseStudyComponentsPage.tsx`, `src/pages/DesignSystemsShowcasePage.tsx`, `src/pages/IbmEnviziShowcasePage.tsx`, `src/pages/SuperAppShowcasePage.tsx` |
| Introduction & game | `src/components/HudShooterIntro.tsx` | `src/components/ExperimentalGrid.tsx` |
| Biography | `src/components/ExperimentalGrid.tsx` | `src/pages/Home.tsx` |
| Side-quest timeline | `src/components/ExperimentalSideQuestsPanel.tsx` | `src/components/ExperimentalGrid.tsx`, `src/components/ShowTellQuadrantModal.tsx` |

## All exported application components

| Component | Source | Named production importers | Dedicated entries |
| --- | --- | --- | --- |
| App | `src/App.tsx` | 0 | Live pages only |
| AmbientVerticalLines | `src/components/AmbientVerticalLines.tsx` | 2 | Live pages only |
| CaseStudiesCardModal | `src/components/CaseStudiesCardModal.tsx` | 3 | lightbox |
| CaseStudyList | `src/components/CaseStudyList.tsx` | 1 | Live pages only |
| CursorReticle | `src/components/CustomCursor.tsx` | 0 | cursor, cursor-interactions |
| CustomCursor | `src/components/CustomCursor.tsx` | 1 | cursor, cursor-interactions |
| ExperimentalCaseStudiesPanel | `src/components/ExperimentalCaseStudiesPanel.tsx` | 8 | rows, case-study-card |
| ExperimentalGrid | `src/components/ExperimentalGrid.tsx` | 1 | biography |
| ExperimentalSideQuestsPanel | `src/components/ExperimentalSideQuestsPanel.tsx` | 2 | side-quests |
| Fake3DCube | `src/components/Fake3DCube.tsx` | 1 | Live pages only |
| FlowingLine | `src/components/FlowingLine.tsx` | 1 | Live pages only |
| HudDialMarks | `src/components/HudDialMarks.tsx` | 1 | Live pages only |
| HudGraphic | `src/components/HudGraphic.tsx` | 1 | Live pages only |
| HudLoadingScreen | `src/components/HudLoadingScreen.tsx` | 1 | loading |
| HudShooterIntro | `src/components/HudShooterIntro.tsx` | 1 | hero |
| LeaderboardCityFilter | `src/components/LeaderboardCityFilter.tsx` | 1 | search |
| LeaderboardGate | `src/components/LeaderboardGate.tsx` | 1 | password |
| NotFound404Glyph | `src/components/NotFound404Glyph.tsx` | 2 | not-found |
| ShowTellAmbientLines | `src/components/ShowTellAmbientLines.tsx` | 1 | Live pages only |
| ShowTellQuadrantModal | `src/components/ShowTellQuadrantModal.tsx` | 2 | Live pages only |
| ShowTellSandCanvas | `src/components/ShowTellSandCanvas.tsx` | 1 | Live pages only |
| SiteFooter | `src/components/SiteFooter.tsx` | 1 | footer |
| SiteTopBar | `src/components/SiteTopBar.tsx` | 1 | links, header |
| ThemeSwatchSelectedIndicator | `src/components/ThemeSwatches.tsx` | 1 | Live pages only |
| ThemeSwatches | `src/components/ThemeSwatches.tsx` | 3 | Live pages only |
| WhoIamOrbMarquee | `src/components/WhoIamOrbMarquee.tsx` | 1 | Live pages only |
| CaseStudyLazyVideo | `src/components/caseStudy/CaseStudyLazyVideo.tsx` | 10 | video |
| CaseStudyMobileSectionsRow | `src/components/caseStudy/CaseStudyMobileToc.tsx` | 1 | Live pages only |
| CaseStudyMobileSectionsModal | `src/components/caseStudy/CaseStudyMobileToc.tsx` | 1 | Live pages only |
| CaseStudyPortaledHeader | `src/components/caseStudy/CaseStudyPortaledHeader.tsx` | 0 | Live pages only |
| CaseStudyPresentationOverlay | `src/components/caseStudy/CaseStudyPresentationOverlay.tsx` | 1 | presentation |
| CaseStudyRailShell | `src/components/caseStudy/CaseStudyRailShell.tsx` | 2 | Live pages only |
| CaseStudyRenderer | `src/components/caseStudy/CaseStudyRenderer.tsx` | 0 | Live pages only |
| CaseStudyScrollProgressBar | `src/components/caseStudy/CaseStudyScrollProgressBar.tsx` | 2 | progress |
| CaseStudyShowcaseScaffold | `src/components/caseStudy/CaseStudyShowcaseScaffold.tsx` | 5 | Live pages only |
| IbmChamferMediaPlaceholder | `src/components/caseStudy/IbmChamferMediaPlaceholder.tsx` | 0 | Live pages only |
| IbmToggleAspectSpacer | `src/components/caseStudy/IbmChamferMediaPlaceholder.tsx` | 3 | Live pages only |
| DsCaseStudyChamferCollage | `src/components/caseStudy/dsCaseStudy/DsCaseStudyHeroMedia.tsx` | 2 | Live pages only |
| DsCaseStudyChamferDs2 | `src/components/caseStudy/dsCaseStudy/DsCaseStudyHeroMedia.tsx` | 2 | Live pages only |
| DsCaseStudyChamferDs3 | `src/components/caseStudy/dsCaseStudy/DsCaseStudyHeroMedia.tsx` | 2 | Live pages only |
| DsCaseStudyChamferDs4 | `src/components/caseStudy/dsCaseStudy/DsCaseStudyHeroMedia.tsx` | 2 | Live pages only |
| DsCaseStudyChamferDs5 | `src/components/caseStudy/dsCaseStudy/DsCaseStudyHeroMedia.tsx` | 2 | Live pages only |
| DsCaseStudyChamferDs6 | `src/components/caseStudy/dsCaseStudy/DsCaseStudyHeroMedia.tsx` | 2 | Live pages only |
| DsCaseStudyChamferDs7 | `src/components/caseStudy/dsCaseStudy/DsCaseStudyHeroMedia.tsx` | 2 | Live pages only |
| DsCaseStudyChamferDs8 | `src/components/caseStudy/dsCaseStudy/DsCaseStudyHeroMedia.tsx` | 2 | Live pages only |
| DsCaseStudyChamferDs9 | `src/components/caseStudy/dsCaseStudy/DsCaseStudyHeroMedia.tsx` | 2 | Live pages only |
| DsCaseStudyChamferDs10 | `src/components/caseStudy/dsCaseStudy/DsCaseStudyHeroMedia.tsx` | 2 | Live pages only |
| DsCaseStudyChamferDs11 | `src/components/caseStudy/dsCaseStudy/DsCaseStudyHeroMedia.tsx` | 2 | Live pages only |
| DsCaseStudyChamferDs12 | `src/components/caseStudy/dsCaseStudy/DsCaseStudyHeroMedia.tsx` | 2 | Live pages only |
| BeforeAfterToggle | `src/components/caseStudy/patterns/BeforeAfterToggle.tsx` | 2 | Live pages only |
| ComparisonShowcase | `src/components/caseStudy/patterns/ComparisonShowcase.tsx` | 1 | comparison |
| KpiAnimatedValue | `src/components/caseStudy/patterns/KpiMetricsGrid.tsx` | 1 | metrics |
| KpiMetricsGrid | `src/components/caseStudy/patterns/KpiMetricsGrid.tsx` | 2 | metrics |
| ProblemStatementGlitchFramedBlock | `src/components/caseStudy/patterns/ProblemStatementFrame.tsx` | 1 | statement |
| ProblemStatementGlitchedCopy | `src/components/caseStudy/patterns/ProblemStatementFrame.tsx` | 1 | statement |
| ProblemStatementFrame | `src/components/caseStudy/patterns/ProblemStatementFrame.tsx` | 1 | statement |
| TimelinePillsRow | `src/components/caseStudy/patterns/TimelinePillsRow.tsx` | 2 | timeline |
| GradientField | `src/components/gradients/GradientField.tsx` | 1 | Live pages only |
| RefractedCard | `src/components/gradients/RefractedCard.tsx` | 0 | Live pages only |
| ComparisonSection | `src/components/sections/ComparisonSection.tsx` | 1 | Live pages only |
| DecisionSection | `src/components/sections/DecisionSection.tsx` | 1 | decisions |
| KPISection | `src/components/sections/KPISection.tsx` | 2 | Live pages only |
| SplitSection | `src/components/sections/SplitSection.tsx` | 1 | Live pages only |
| StatementSection | `src/components/sections/StatementSection.tsx` | 1 | Live pages only |
| StepperSection | `src/components/sections/StepperSection.tsx` | 2 | Live pages only |
| TextSection | `src/components/sections/TextSection.tsx` | 1 | Live pages only |
| SideQuestFlowingLineRail | `src/components/sideQuest/SideQuestFlowingLineRail.tsx` | 1 | Live pages only |
| SideQuestSandBackground | `src/components/sideQuest/SideQuestSandBackground.tsx` | 1 | Live pages only |
| CaseStudySwitch | `src/components/system/CaseStudySwitch.tsx` | 5 | switch |
| ChamferFrame | `src/components/system/ChamferFrame.tsx` | 18 | card-corners, card, image |
| FigmaFrame | `src/components/system/FigmaGrid.tsx` | 2 | Live pages only |
| FigmaGrid12 | `src/components/system/FigmaGrid.tsx` | 12 | Live pages only |
| FigmaRailGrid | `src/components/system/FigmaGrid.tsx` | 1 | Live pages only |
| PlaceholderVisual | `src/components/system/PlaceholderVisual.tsx` | 1 | Live pages only |
| PortfolioAccordion | `src/components/system/PortfolioAccordion.tsx` | 0 | Live pages only |
| PortfolioButton | `src/components/system/PortfolioControls.tsx` | 1 | buttons, text-fields |
| PortfolioTextField | `src/components/system/PortfolioControls.tsx` | 1 | buttons, text-fields |
| PortfolioSelect | `src/components/system/PortfolioControls.tsx` | 0 | buttons, text-fields |
| PortfolioChoice | `src/components/system/PortfolioControls.tsx` | 0 | buttons, text-fields |
| PortfolioTab | `src/components/system/PortfolioTabs.tsx` | 1 | tabs |
| PresentationIconButton | `src/components/system/PresentationIconButton.tsx` | 2 | icon-buttons |
| RotatingGradientCircle | `src/components/system/RotatingGradientCircle.tsx` | 9 | Live pages only |
| RotatingGradientCircleDotPlaceholder | `src/components/system/RotatingGradientCircle.tsx` | 1 | Live pages only |
| SectionWrapper | `src/components/system/SectionWrapper.tsx` | 1 | Live pages only |
| SidebarNav | `src/components/system/SidebarNav.tsx` | 2 | sidebar |
| SystemContainer | `src/components/system/SystemContainer.tsx` | 1 | Live pages only |
| HudShooterProvider | `src/contexts/HudShooterProvider.tsx` | 1 | Live pages only |
| SiteThemeProvider | `src/contexts/SiteThemeProvider.tsx` | 1 | Live pages only |
| RootLayout | `src/layouts/RootLayout.tsx` | 1 | Live pages only |
| CarbonNeutralClubShowcasePage | `src/pages/CarbonNeutralClubShowcasePage.tsx` | 0 | Live pages only |
| CaseStudyComponentsPage | `src/pages/CaseStudyComponentsPage.tsx` | 0 | Live pages only |
| DesignSystemsShowcasePage | `src/pages/DesignSystemsShowcasePage.tsx` | 0 | Live pages only |
| GlobalLeaderboardPage | `src/pages/GlobalLeaderboardPage.tsx` | 0 | Live pages only |
| Home | `src/pages/Home.tsx` | 0 | Live pages only |
| IbmEnviziShowcasePage | `src/pages/IbmEnviziShowcasePage.tsx` | 0 | Live pages only |
| NotFoundPage | `src/pages/NotFoundPage.tsx` | 0 | Live pages only |
| PrivacyPolicyPage | `src/pages/PrivacyPolicyPage.tsx` | 0 | Live pages only |
| SideQuestViewerPage | `src/pages/SideQuestViewerPage.tsx` | 0 | Live pages only |
| SuperAppShowcasePage | `src/pages/SuperAppShowcasePage.tsx` | 0 | Live pages only |
| CarbonDeckCrossfadeChamfer | `src/pages/carbon/CarbonPresentationDeck.tsx` | 0 | Live pages only |
| CarbonDeckPlanB2B2CChamfer | `src/pages/carbon/CarbonPresentationDeck.tsx` | 0 | Live pages only |
| DsBulletGrid | `src/pages/ds/dsShowcaseBulletGrid.tsx` | 2 | Live pages only |
| IbmDeckAutoplayVideo | `src/pages/ibm/IbmDeckAutoplayVideo.tsx` | 1 | Live pages only |
| IbmDeckToggleChamfer | `src/pages/ibm/IbmDeckToggleChamfer.tsx` | 1 | Live pages only |
| IbmCoreFlowStepBlock | `src/pages/ibm/ibmEnviziContentComponents.tsx` | 1 | Live pages only |
| IbmActionLayerStep1Chamfer | `src/pages/ibm/ibmEnviziContentComponents.tsx` | 1 | Live pages only |
| SuperDeckAutoplayVideo | `src/pages/super/SuperDeckAutoplayVideo.tsx` | 1 | Live pages only |
| SuperToggleImageChamfer | `src/pages/super/SuperShowcaseChamfers.tsx` | 2 | Live pages only |
| SuperSuperCashRelocatedComparison | `src/pages/super/SuperShowcaseChamfers.tsx` | 2 | Live pages only |
| SuperTrueHomeComparison | `src/pages/super/SuperShowcaseChamfers.tsx` | 2 | Live pages only |
| SuperProblemOldScreensChamfer | `src/pages/super/SuperShowcaseChamfers.tsx` | 2 | Live pages only |

This inventory intentionally reports gaps. A direct source import does not prove that documentation-only samples match every real composition. Proposed controls and pinned-state illustrations are labeled in the catalog.
