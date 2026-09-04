import { CaseStudyLazyVideo } from '../../components/caseStudy/CaseStudyLazyVideo'

export function IbmDeckAutoplayVideo({ src, poster }: { src: string; poster?: string }) {
  return (
    <CaseStudyLazyVideo
      src={src}
      poster={poster ?? '/case-study-media/posters/ibm-action-plans.webp'}
      ariaLabel="Screen recording: IBM Envizi action plans prototype"
    />
  )
}
