import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import axios from 'axios';
import {LoginResponse} from "../dto/login.dto.tsx";

export function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [lembrarMe, setLembrarMe] = useState(false);

    async function validarLogin(email: string, senha: string): Promise<boolean> {
        try {
            const response = await axios.post<LoginResponse>(
                'http://localhost:3000/auth/login',
                { email, senha },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // se precisar enviar cookies / CORS com credenciais, colocar:
                    // withCredentials: true,
                },
            );

            const data = response.data;
            localStorage.setItem('access_token', data.access_token);

            return true;
        } catch (error) {
            console.error('Erro no login', error);
            return false;
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const ok = await validarLogin(email, senha);
        if (ok) {
            alert('Login realizado com sucesso!');
            navigate('/home');
        } else {
            alert('E-mail ou senha incorretos!');
        }
    }

    function irParaCadastro() {
        navigate('/register');
    }

    return (
        <div className="auth-container">
            <div className="left-side">
                {/* aqui você coloca o conteúdo da coluna esquerda do Login/Acessar_conta.html */}
                <h1>WizardNote</h1>
                <p>Suas notas organizadas com magia.</p>
            </div>

            <div className="right-side">
                <div className="auth-card">
                    <h2>Acessar conta</h2>

                    <form id="loginForm" onSubmit={handleSubmit}>
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
                                placeholder="Digite sua senha"
                            />
                        </div>

                        <div className="form-footer">
                            <label className="checkbox">
                                <input
                                    id="lembrarMe"
                                    type="checkbox"
                                    checked={lembrarMe}
                                    onChange={(e) => setLembrarMe(e.target.checked)}
                                />
                                <span>Lembrar-me</span>
                            </label>
                            {/* Aqui poderia ter "Esqueci minha senha" se existir no HTML */}
                        </div>

                        <button type="submit" className="btn-primary">
                            Entrar
                        </button>
                    </form>

                    <div className="auth-extra">
                        <span>Não tem conta?</span>
                        <button type="button" className="btn-link" onClick={irParaCadastro}>
                            Criar conta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
