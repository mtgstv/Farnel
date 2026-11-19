import Header from "../../components/Layout/Header";
import HeaderNavegacao from "../../components/Layout/HeaderNavegacao";
import Hero from "../../components/Home/Hero";
import StatsBanner from "../../components/Home/StatsBanner";
import HowItWorks from "../../components/Home/HowItWorks";
import Partners from "../../components/Home/Partners";
import Testimonials from "../../components/Home/Testimonials";
import Coverage from "../../components/Home/Coverage";
import TrustFeatures from "../../components/Home/TrustFeatures";
import CtaBanner from "../../components/Home/CtaBanner";
import HomeLogado from "./HomeLogado";
import { Carregando } from "../../components/Comuns/EstadoRequisicao";
import { useAuth } from "../../hooks/useAuth";

/*
 * Visitantes veem a home de apresentação (com o Header de trechos da página).
 * Quem está logado vê a HomeLogado, com o mesmo header das páginas internas.
 */
function Home() {
  const { usuario, verificando } = useAuth();

  // Enquanto descobre se há um login salvo, não mostra nenhuma das duas versões (evita a tela trocar)
  if (verificando) {
    return (
      <div className="min-h-screen bg-cream">
        <Carregando />
      </div>
    );
  }

  if (usuario) {
    return (
      <div className="min-h-screen bg-cream">
        <HeaderNavegacao />
        <HomeLogado usuario={usuario} />
      </div>
    );
  }

  return (
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
    </div>
  );
}

export default Home;
