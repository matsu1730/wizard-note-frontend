import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import axios from "axios";
import {RegisterResponse} from "../dto/register.dto.tsx";

export function RegisterPage() {
    const navigate = useNavigate();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    async function criarCadastro(nome: string, email: string, senha: string): Promise<{ sucesso: boolean }> {
        try {
            const response = await axios.post<RegisterResponse>(
                'http://localhost:3000/usuario',
                { nome, email, senha },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const data = response.data;
            console.log(JSON.stringify(data));
        } catch (error) {
            console.error('Erro no cadastro', error);
            return { sucesso: false };
        }
        return { sucesso: true };
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const resultado = await criarCadastro(nome, email, senha);
        if (resultado.sucesso) {
            alert('Cadastro realizado com sucesso!');
            navigate('/login');
        }
    }

    function irParaLogin() {
        navigate('/login');
    }

    return (
        <div className="auth-container">
            <div className="left-side">
                {/* Conteúdo equivalente à esquerda do Criar_conta.html */}
                <h1>WizardNote</h1>
                <p>Crie sua conta para começar a usar.</p>
            </div>

            <div className="right-side">
                <div className="auth-card">
                    <h2>Criar conta</h2>

                    <form id="cadastroForm" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nome">Nome</label>
                            <input
                                id="nome"
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                                placeholder="Seu nome"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Digite seu e-mail"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="senha">Senha</label>
                            <input
                                id="senha"
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary">
                            Criar conta
                        </button>
                    </form>

                    <div className="auth-extra">
                        <span>Já tem conta?</span>
                        <button type="button" className="btn-link" onClick={irParaLogin}>
                            Acessar conta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
