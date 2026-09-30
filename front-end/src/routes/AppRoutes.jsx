import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import RotaPrivada from './RotaPrivada';
import RotaAdmin from './RotaAdmin';

// A home carrega junto com o site (é a porta de entrada); as demais páginas só são
// baixadas quando visitadas (lazy), o que deixa o carregamento inicial mais leve.
// O <Suspense> que mostra o "carregando" fica no Layout.

// Principal
import Home from '../pages/Principal/Home';
const Sobre = lazy(() => import('../pages/Principal/Sobre'));
const NaoEncontrada = lazy(() => import('../pages/Principal/NaoEncontrada'));

// Autenticação
const Cadastro = lazy(() => import('../pages/Autenticacao/Cadastro'));
const Login = lazy(() => import('../pages/Autenticacao/Login'));
const Perfil = lazy(() => import('../pages/Autenticacao/Perfil'));
const Usuarios = lazy(() => import('../pages/Autenticacao/Usuarios'));

// Doações
const Doacoes = lazy(() => import('../pages/Doacoes/Doacoes'));
const NovaDoacao = lazy(() => import('../pages/Doacoes/NovaDoacao'));
const DetalhesDoacao = lazy(() => import('../pages/Doacoes/DetalhesDoacao'));
const MinhasDoacoes = lazy(() => import('../pages/Doacoes/MinhasDoacoes'));
const Favoritos = lazy(() => import('../pages/Doacoes/Favoritos'));
const Solicitacao = lazy(() => import('../pages/Doacoes/Solicitacao'));
const NovaSolicitacao = lazy(() => import('../pages/Doacoes/NovaSolicitacao'));
const Dashboard = lazy(() => import('../pages/Doacoes/Dashboard'));

// Instituições
const Instituicao = lazy(() => import('../pages/Instituicoes/Instituicao'));
const InstDoa = lazy(() => import('../pages/Instituicoes/InstDoa'));
const InstSolic = lazy(() => import('../pages/Instituicoes/InstSolic'));

// Administração
const Admin = lazy(() => import('../pages/Adm/Admin'));
const GerDoa = lazy(() => import('../pages/Adm/GerDoa'));
const GerInst = lazy(() => import('../pages/Adm/GerInst'));
const GerUsuario = lazy(() => import('../pages/Adm/GerUsuario'));

function AppRoutes() {
    return (
        <Routes>
            {/* A home usa o próprio Header, com links para os trechos da página */}
            <Route element={<Layout comHeader={false} />}>
                <Route index element={<Home />} />
            </Route>

            <Route element={<Layout />}>
                <Route path="sobre" element={<Sobre />} />

                <Route path="cadastro" element={<Cadastro />} />
                <Route path="login" element={<Login />} />
                <Route path="usuarios" element={<Usuarios />} />

                <Route path="doacoes" element={<Doacoes />} />
                <Route path="detalhes/:id" element={<DetalhesDoacao />} />
                <Route path="favoritos" element={<Favoritos />} />
                <Route path="dashboard" element={<Dashboard />} />

                <Route path="instituicao" element={<Instituicao />} />
                <Route path="instituicao/doacoes" element={<InstDoa />} />
                <Route path="instituicao/solicitacoes" element={<InstSolic />} />

                {/* Só para usuários logados */}
                <Route element={<RotaPrivada />}>
                    <Route path="solicitacoes" element={<Solicitacao />} />
                    <Route path="solicitacoes/nova" element={<NovaSolicitacao />} />
                    <Route path="perfil" element={<Perfil />} />
                    <Route path="minhas-doacoes" element={<MinhasDoacoes />} />
                    <Route path="doacoes/nova" element={<NovaDoacao />} />
                </Route>

                {/* Só para administradores: protege tudo em /admin/* */}
                <Route path="admin" element={<RotaAdmin />}>
                    <Route index element={<Admin />} />
                    <Route path="doacoes" element={<GerDoa />} />
                    <Route path="instituicoes" element={<GerInst />} />
                    <Route path="usuarios" element={<GerUsuario />} />
                </Route>

                <Route path="*" element={<NaoEncontrada />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;
