# Portfolio design system

On the published site or in `npm run dev`, open Global leaderboard, then enter `D` in the password form and submit. You can also press `D` while on the leaderboard when focus is outside a text field. The existing `G` flow is preserved.

The workbench is included as a lazy-loaded production route at `/design-system`. Direct visits without the session discovery flag redirect to the leaderboard. Entering D unlocks it in that browser session. This hidden entry point is a convenience, not server-side authentication.

## Theme configuration

`src/design-system/theme.ts` defines the published `portfolioTheme.activeTheme`, semantic palettes, paired media colors and labels. Change `activeTheme` to apply a palette to the entire published site. The current default is `grey`. Preview selection is available only after unlocking the design system and affects the current browser. It never changes the published configuration for other visitors. Visitors without an unlocked session use the published theme.

The same provider drives site chrome, cards, case studies, presentation decks, SVG token consumers and canvas token consumers. Presentation themes no longer override the global theme independently. Visitor theme controls are inert and visually hidden while preserving their occupied space in the existing layout.

Colors use `bg`, `surface`, `elevated`, `fg`, `fg-muted`, `fg-subtle`, `hud`, `border`, `cell-border` and `cell-hover`. Keep foreground/background roles paired. Fixed media roles preserve original imagery: `media-paper` + `on-media-paper`; `scrim` + `on-scrim`; `media-dark`, `media-cream`, `media-warm`, `media-highlight`. Decorative glitch colors and cursor difference blending retain fixed effect roles.

`src/index.css` contains Tailwind foundation defaults, type scale, spacing, frame geometry and motion. `src/port-foundation.css` contains responsive gutters and breakpoints. Existing component sizing, content and layout are preserved. Palette changes can be made centrally; changing layout, typography or motion across existing utility classes is a separate deliberate design change.

## Workspace navigation

The workbench opens on Overview, with a card-based dashboard on the right and a full-height explorer on the left. Search the sidebar by visible component, foundation or page name; matching branches expand automatically. Foundations, component categories, individual definitions, pages and page-source modules use nested accordions. The sidebar can collapse to an icon rail on desktop; on mobile it opens as a drawer and closes after selection. Theme preview remains in the sidebar footer.

## Visual component library

The primary library is visual. Thirty-two curated entries organize actual controls and patterns into Actions, Forms, Navigation, Surfaces, Data display, Feedback, Overlays, Media, Content patterns and Page sections. Entries show interactive rendered examples, with native fields/buttons shared with the leaderboard gate, tabs shared with the legal page, existing reusable portfolio components, and live embedded homepage sections. Sample content is labeled where used. Source records remain in collapsed Technical reference sections. Helper functions and implementation modules are no longer navigation entries.

Pages open real interactive previews, with Fit width, Desktop and Mobile views, full-page links and named section navigation. Foundations show visual color, typography, spacing, grid, border and motion examples before technical token data.

## Workbench coverage

- Overview: route and source coverage, workflow and counts.
- Foundations: palette roles, fixed media colors, type specimens, every CSS variable declaration, spacing/dimension utilities, shapes, shadows, interaction states, breakpoints and keyframes.
- Pages: all existing route patterns, reachable local modules, shared chrome, anchors, headings, component placements, props and source lines. Full-page previews use the actual pages.
- Components: all source modules, named component definitions, card/panel anatomy, data collections and variants, native controls, inline SVG/canvas/media, literal colors and dependencies. Live specimens use the real shared components.
- Media: local files plus static external media/font references, dimensions where readable, file size, type, source references and route reachability. Asset classification is folder-based; unused and generated files remain visible.
- Contrast: all semantic foreground/base-surface pairs and an on-demand rendered text scan of every route plus all seven albums.

The source inventory uses the TypeScript AST. A component placed inside `.map()` has one source placement plus its data collection, rather than a guessed number of runtime instances. Imports are traced transitively, including re-exports and dynamic imports; `import.meta.glob` asset references are expanded. Shared chrome may include conditional dialogs not rendered on every page. Static reachability is not proof that every state is currently visible.

Regenerate with `npm run design-system:audit`. Development startup regenerates it automatically. After editing source during an existing dev session, run the command again to refresh line numbers and records. The generated inventory is local editor data and never imported by production.

## Verification

Run `npm run build`, `npm run lint`, then `npm run design-system:check`. The check validates every theme's role completeness, 60 opaque text contrast pairs, fixed foreground pairs, route coverage, album-glob matching, and production exclusion.

The rendered checker accounts for text color, ancestor opacity and solid background compositing. It reports gradients and blend/filter effects as manual review. It excludes disabled, inert and aria-hidden text. It does not certify text baked into imagery, video or canvas; pseudo-elements; closed dialogs; every slide; interactive states; or dynamic leaderboard records. Its approximation of grouped opacity and sibling media cannot replace visual review. Inspect desktop/mobile, dialogs, game phases, before/after toggles, legal tabs, presentation controls and all media before publishing a new palette.

The original grey theme remains the published configuration. Subtle text was brightened to pass the base-surface checks; hardcoded UI whites, neutral borders, placeholder text and selected toggle colors now use semantic or paired roles.

## Recorded validation — November 6, 2026

The final source inventory contains 10 route patterns, 124 modules, 125 named component definitions, 731 JSX component placements, 284 card/panel/section blocks, 100 content collections, 59 CSS variable declarations and 297 local/external media/font entries. These are source records, not counts of unique runtime DOM nodes.

The original and light palettes were scanned at 1440 × 1000 across 16 concrete URLs (all route patterns plus seven album URLs). Each run checked 1,192 unique text/style samples, reported no unambiguous solid-background text contrast failures, and retained 40 gradient/effect findings for manual review. Reports: `docs/design-system/contrast-grey.json` and `docs/design-system/contrast-light.json`. The leaderboard scan covers the locked state; the existing G unlock was verified separately. Legal tab and interactive-state coverage limitations above still apply.

Browser checks also verified direct local-route rejection before unlock, D form entry, D keyboard entry after G unlock, G leaderboard access, media thumbnails, before/after live specimens, a 390px mobile workbench without horizontal overflow, shared theme inheritance in a presentation deck, and a legible light presentation slide. A production preview returns the existing 404 screen for `/design-system`; visitor theme controls are absent from its accessibility tree.

Production build and design-system checks passed. Lint has no errors and retains the existing `H_SCROLL_S` effect-dependency warning in `FlowingLine.tsx`.

## Specimen overview and component depth

Overview is now the specimen wall: differently sized cards use a measured twelve-track masonry layout, with wider game, interaction and media examples and smaller palette, metric and navigation specimens. It opens on real controls, original media, an embedded game, cursor states, dialog previews and live navigation, rather than a summary banner. The previous dashboard remains under System guide.

The library includes Cursor, Cursor interactions, Accordions and Card corners & borders. The cursor examples reuse the actual reticle; the live playground uses the real global cursor and falling trail. The explorer and accordion examples share the same disclosure primitive.

Every component entry has Examples, States & types, Responsive rules, and Usage & anatomy views. Hover/focus matrices are labeled as pinned visual states. Game and video state-anatomy illustrations are labeled separately from the real interactive examples. Keyboard guidance and responsive behavior are specific to each pattern. All 34 entries and their four documentation views were checked in the browser.

## Fidelity corrections

Specimen roots inherit the portfolio body font token rather than the documentation shell font. Explicit component font roles are retained. The font boundary covers overview specimens, example canvases, gallery thumbnails and state/pattern previews.

Case-study presentation is documented separately from navigation dialogs and image lightboxes. Its two launch modes load the real Super app deck and use the original presentation overlay: media only, or narrative text plus media. The documentation can open with controls visible; production keeps its existing collapsed-controls default.

The introduction/game specimen is wider and taller. The statement specimen defaults to the original glitch treatment, with the plain variant retained as an alternate. Isolated page previews no longer force descendant opacity; native ambient-line fades, idle dimming and animation opacity are preserved.

Verification of the fidelity corrections: 118 overview text samples used Space Mono with both 400 and 700 font faces loaded; the ambient SVG line layer retained its native 0.14 opacity; the statement retained both original CSS glitch animations; the overview game measured 522 × 591px at the checked desktop width. Both real presentation modes opened successfully, slide navigation worked, and the text-slide switch changed the active mode. The new presentation entry’s four documentation views were also checked.

## Shared-source fidelity audit

`npm run design-system:audit` now regenerates both the source inventory and the component-linkage audit. See `docs/component-fidelity-audit.md` for all 35 curated entries and exported application components, including missing dedicated stories. Named imports distinguish production use from editor-only controls. This is a static linkage audit, not a claim that every runtime state has been visually certified.

Component pages default to **On the site** where a real route is available; these unmodified page previews preserve native composition, styling and behavior. **Examples** contains isolated specimens with sample content. **Source & site usage** identifies the shared implementation and its production importers. Editing shared source updates both consumers; the catalog is not a visual authoring tool.

Removed reconstructed project rows, fake overview dialog anatomy, custom image dialogs and native video players in favor of the actual project panel, navigation dialogs, case-study image presentation and `CaseStudyLazyVideo`. The leaderboard gate is now a single shared component used by the page and specimen. Generic select, choice and icon-button patterns have no public consumers and are identified accordingly. Their presence does not imply migration of public controls.

The overview Metrics tile spans eight of twelve columns (full width at the intermediate breakpoint). Its specimen canvas stacks metric columns below 520px of available width, preventing the page-wide desktop breakpoint from squeezing values inside a narrow catalog card.

## Consolidation correction

The main catalog now includes only implementations with production consumers (32 entries). Removed invented select/radio controls and the documentation-only disclosure specimen from the public-component catalog; the explorer still uses its real disclosure control internally. Replaced gallery drawings with lazily mounted real specimens. Removed simulated dialog, row, player, game and other anatomy drawings from States & types; that view uses actual specimens and shared control states. Removed documentation-only corner sizes and generic pinned-state CSS; preview states now live alongside their matching native state styles in shared implementations.

`CaseStudySwitch` is used by 24 annotation controls across Carbon, Super, IBM and presentation decks, as well as the catalog. `PresentationIconButton` is used by 16 presentation actions and re-exported to the catalog. Existing event handlers, accessibility labels, refs and contextual classes are retained. The linkage audit fails if a catalog entry lacks a production consumer, and resolves barrel exports. This checks shared implementation; it does not claim that every unrelated button in the site has the same visual variant.

Validated catalog and real Super case-study switch toggles, mixed-mode presentation opening and next-slide navigation after consolidation.

## Production availability

The production build includes the design-system route, hidden D entry and lazy-loaded inventory. `designSystemAssets.ts` is generated from the asset inventory with explicit Vite URL imports, so catalog media uses valid fingerprinted build URLs rather than development source paths. The build regenerates both inventories and the asset manifest. The checker now requires the production workbench chunk and discovery gate. Verified the production preview redirects a locked direct visit, opens Overview after entering D in the leaderboard gate, and loads the fingerprinted Super app preview image.

## Luma theme study

**Luma** is the new light, gradient-led direction, available under **Luma · theme study** in the explorer. Its prototype is scoped to its own cool-white palette even while the editor uses Original. Published `portfolioTheme.activeTheme` remains `grey`; no global theme cutover has been made. The study's preview action, or the theme selector, can opt this browser into Luma across existing site components.

Luma adds DM Sans typography, 24px shared rounded frames, cobalt focus/action roles and three reusable gradient recipes: Azure, Iris and Solar. `GradientField` supports mesh/ring surfaces, pointer response, optional ambient motion, touch fallback and reduced motion. `RefractedCard` adds perspective and SVG-displaced side reflections while keeping central text and inputs undistorted. This is an interpretation of the supplied stills; the animation is a prototype for review. New effects are exposed in the theme study, not misrepresented as existing production portfolio components in the main catalog.

Interactive specimen controls include family selection, reflection and motion toggles, a working range input and the actual shared buttons, input, switch and frame. Text on gradients uses fixed dark backing, and base semantic text colors are checked by `design-system:check`. Case-study media keeps its original colors.

### Optical rebuild

The first flat-gradient/turbulence prototype has been replaced with `OpticalField`: WebGL ray marching of signed-distance geometry, finite-difference surface normals, iridescent lighting, nonlinear UV stretching and curved reflected edges. Shapes include a softly blurred volume, sculpted blob, torus, layered wave ribbons and a split spectral beam. Rendering is capped at 30fps and 900px internal width, stops outside the viewport, and honors reduced motion. CSS recipes remain as non-WebGL fallbacks.

Luma now uses DM Sans, cool white/slate surfaces, shared glass buttons/fields/switches, and consistent 24px surfaces / 12px controls. Native cursors replace the reticle and particle trail in Luma. The actual Who I am dot-art images are rendered dark on light surfaces; existing alpha text roles resolve to opaque foreground roles in Luma. These changes are scoped to Luma; Original remains the published default.

### Frosted optical glass and diffusion

`src/design-system/luma-material.css` defines the shared frosted material: translucent fill, separate refractive rims, inset edge highlights, soft directional cast shadows and transmitted mint/coral light. The material is applied to the real site frames, overview cards, buttons, fields, legal tabs, switches and range controls in Luma. Focus outlines stay cobalt; meaningful control boundaries retain contrast against tinted surfaces.

All optical forms and reflections are diffused: 14px blur for the 3D blob, torus, ribbons and split beam, and 28px for the atmospheric volume. The central UI is frosted glass over the geometry rather than an opaque gradient card.

The final rendered Luma audit (`docs/design-system/contrast-luma.json`) checked 1,187 text samples across 16 route/album views: zero computed below-threshold results and no load errors. It flagged 398 effect/gradient cases for visual review. This is not a full WCAG certification; the checker cannot certify image/canvas text or arbitrary optical composites. Actual homepage dot-art filtering, native cursor behavior, WebGL forms, blur values and glass controls were separately inspected in the browser. Build, lint (existing FlowingLine warning only), theme checks and whitespace checks passed.
