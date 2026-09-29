import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setErro('');

    
    if (!email || !senha) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }


    const usuarioLogado = { email, tipo: 'doador' };
    localStorage.setItem('farnel_user', JSON.stringify(usuarioLogado));

    
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
        
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-800 tracking-tight">🍎 Farnel</h1>
          <p className="text-sm text-gray-600 mt-2">Conectando solidariedade e combate ao desperdício</p>
        </div>

        {erro && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {erro}
          </div>
        )}

        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 shadow-md hover:shadow-lg cursor-pointer"
          >
            Entrar
          </button>
        </form>

        
        <div className="mt-6 text-center text-sm text-gray-600">
          Ainda não tem uma conta?{' '}
          <Link to="/cadastro" className="text-emerald-600 font-medium hover:underline">
            Cadastre-se
          </Link>
        </div>

      </div>
    </div>
  );
}