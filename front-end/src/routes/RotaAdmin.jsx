import RotaPrivada from "./RotaPrivada";

// Versão da RotaPrivada para a área administrativa (/admin/*).
function RotaAdmin() {
    return <RotaPrivada tiposPermitidos={["admin"]} />;
}

export default RotaAdmin;
