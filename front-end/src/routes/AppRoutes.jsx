import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Doacoes from '../pages/Doacoes';
import NaoEncontrada from "../pages/NaoEncontrada";
import Cadastro from '../pages/cadastro';
import DetalhesDoacao from '../pages/DetalhesDoacao';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doacoes" element={<Doacoes />} />
            <Route path="cadastro" element={<Cadastro/>}/>
            <Route path="detalhes/:id" element={<DetalhesDoacao/>}/>
            <Route path="*" element={<NaoEncontrada />} /> {/*Favor sempre deixar essa rota por último aqui na lista */}
        </Routes>
    );
}

export default AppRoutes;