import { CaseStudyLazyVideo } from '../../components/caseStudy/CaseStudyLazyVideo'

export function SuperDeckAutoplayVideo({ src, poster }: { src: string; poster?: string }) {
  return (
    <CaseStudyLazyVideo
      src={src}
      poster={poster ?? '/case-study-media/posters/super-walkthrough.webp'}
      ariaLabel="Screen recording of the Super app walkthrough"
    />
  )
}
