import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from '../pages/Principal/Home';
import Sobre from '../pages/Principal/Sobre';
import Cadastro from '../pages/Autenticacao/Cadastro';
import Login from '../pages/Autenticacao/Login';
import Doacoes from '../pages/Doacoes/Doacoes';
import DetalhesDoacao from '../pages/Doacoes/DetalhesDoacao';
import Favoritos from '../pages/Doacoes/Favoritos';
import NaoEncontrada from '../pages/Principal/NaoEncontrada';

function AppRoutes() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="sobre" element={<Sobre />} />
                <Route path="cadastro" element={<Cadastro />} />
                <Route path="login" element={<Login />} />
                <Route path="doacoes" element={<Doacoes />} />
                <Route path="detalhes/:id" element={<DetalhesDoacao />} />
                <Route path="favoritos" element={<Favoritos />} />
            </Route>

            <Route path="*" element={<NaoEncontrada />} />
        </Routes>
    );
}

export default AppRoutes;
