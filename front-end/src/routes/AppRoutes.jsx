import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Doacoes from '../pages/Doacoes/Doacoes';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doacoes" element={<Doacoes />} />
        </Routes>
    );
}

export default AppRoutes;