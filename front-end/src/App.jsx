import AppRoutes from "./routes/AppRoutes";
import AvisoArmazenamento from "./components/Layout/AvisoArmazenamento";
import LimiteDeErro from "./components/Layout/LimiteDeErro";

export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <LimiteDeErro>
        <AppRoutes />
        <AvisoArmazenamento />
      </LimiteDeErro>
    </div>
  );
}
