// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { NotesProvider } from './context/NotesContext';

export function App() {
    return (
        <BrowserRouter>
            <NotesProvider>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </NotesProvider>
        </BrowserRouter>
    );
}
