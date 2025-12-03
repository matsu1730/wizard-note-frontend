// src/services/notesService.ts
import axios from 'axios';

export type Note = {
    id_nota: number;
    id_usuario: number;
    id_categoria: number;
    titulo: string;
    conteudo: string;
    resumo_ia: string;
    palavras_chave: string;
    data_criacao: string;
    data_atualizacao: string;
};

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

// interceptor simples pra token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
        config.headers = {
            ...(config.headers || {}),
            Authorization: `Bearer ${token}`,
        } as typeof config.headers;
    }

    return config;
});

/**
 * Lista notas do backend.
 * Ajuste a URL conforme seu controller (/nota, /notas, etc.).
 */
export async function fetchNotes(): Promise<Note[]> {
    const response = await api.get<Note[]>('/nota/by-user');
    return response.data;
}

export async function autoGenerateResumo(content: string): Promise<string> {
    if (!content) return '';
    const response = await api.post<{ summary: string }>(
        '/nota/summarization',
        { prompt: content },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data.summary;
}

export async function createNote(input: {
    id_categoria: number;
    titulo?: string;
    conteudo: string;
    resumo_ia?: string;
}): Promise<Note> {
    const titulo = input.titulo?.trim() || 'Sem título';
    const conteudo = input.conteudo.trim();
    const resumo_ia =
        input.resumo_ia?.trim() || (await autoGenerateResumo(conteudo));

    const response = await api.post<Note>('/nota', {
        id_categoria: input.id_categoria,
        titulo,
        conteudo,
        resumo_ia,
    });

    return response.data;
}

export async function updateNote(
    noteId: number,
    updates: Partial<Pick<Note, 'titulo' | 'conteudo' | 'resumo_ia' | 'id_categoria'>>,
): Promise<Note> {
    const payload: any = { ...updates };

    if (payload.titulo) {
        payload.titulo = payload.titulo.trim() || 'Sem título';
    }
    const response = await api.put<Note>(`/nota/${noteId}`, payload);
    console.log(response.data);
    return response.data;
}

export async function deleteNote(noteId: number): Promise<void> {
    await api.delete(`/nota/${noteId}`);
}
