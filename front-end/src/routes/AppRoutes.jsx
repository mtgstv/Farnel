import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Doacoes from '../pages/Doacoes';
import NaoEncontrada from "../pages/NaoEncontrada";
import Cadastro from '../pages/cadastro';
import DetalhesDoacao from '../pages/DetalhesDoacao';
import Favoritos from '../pages/Favoritos';
import Layout from "./Layout";
import Login from '../pages/Login';

function AppRoutes() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/doacoes" element={<Doacoes />} />
                <Route path="cadastro" element={<Cadastro />} />
                <Route path="detalhes/:id" element={<DetalhesDoacao />} />
                <Route path="/login" element={<Login />} />
                <Route path="/favoritos" element={<Favoritos />} />
            </Route>

            <Route path="*" element={<NaoEncontrada />} />
        </Routes>
    );
}

export default AppRoutes;