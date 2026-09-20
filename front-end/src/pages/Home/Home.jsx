import Header from "../../components/Header";
import Hero from "../../components/Hero";
import StatsBanner from "../../components/StatsBanner";
import HowItWorks from "../../components/HowItWorks";
import Partners from "../../components/Partners";
import Testimonials from "../../components/Testimonials";
import Coverage from "../../components/Coverage";
import TrustFeatures from "../../components/TrustFeatures";
import CtaBanner from "../../components/CtaBanner";
import Footer from "../../components/Footer";

function Home(){
    return(
        
        <div className="min-h-screen bg-cream">
            <Header />

            <main>
                <Hero />
                <StatsBanner />
                <HowItWorks />
                <Partners />
                <Testimonials />
                <Coverage />
                <TrustFeatures />
                <CtaBanner />
            </main>

            <Footer />
        </div>
    );
}

export default Home;