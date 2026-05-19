import Hero from '../components/landing/Hero'
import Problem from '../components/landing/Problem'
import HowItWorks from '../components/landing/HowItWorks'
import Workflow from '../components/landing/Workflow'
import WhyGraph from '../components/landing/WhyGraph'
import Audience from '../components/landing/Audience'
import DecisionOutcomes from '../components/landing/DecisionOutcomes'
import ProductPreview from '../components/landing/ProductPreview'
import CTA from '../components/landing/CTA'

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <Problem />
      <HowItWorks />
      <Workflow />
      <WhyGraph />
      <Audience />
      <DecisionOutcomes />
      <ProductPreview />
      <CTA />
    </main>
  )
}
