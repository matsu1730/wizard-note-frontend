// src/context/NotesContext.tsx
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import {
    autoGenerateResumo,
    createNote as createNoteService,
    fetchNotes,
    Note,
    updateNote as updateNoteService,
    deleteNote as deleteNoteService,
} from '../services/notesService';

type NotesContextType = {
    notes: Note[];
    loading: boolean;
    currentNoteId: number | null;
    isEditMode: boolean;
    openNote: (id: number) => void;
    closeNote: () => void;
    setEditMode: (edit: boolean) => void;
    reloadNotes: () => Promise<void>;
    createNote: (data: {
        id_categoria: number;
        titulo?: string;
        conteudo: string;
        resumo_ia?: string;
    }) => Promise<void>;
    updateCurrentNote: (data: {
        titulo?: string;
        conteudo?: string;
        resumo_ia?: string;
        id_categoria?: number;
    }) => Promise<void>;
    deleteCurrentNote: () => Promise<void>;
    generateResumoForContent: (content: string) => Promise<string>;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

type NotesProviderProps = {
    children: ReactNode;
};

export function NotesProvider({ children }: NotesProviderProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentNoteId, setCurrentNoteId] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // Carregar notas do backend na montagem
    useEffect(() => {
        reloadNotes();
    }, []);

    const reloadNotes = async () => {
        try {
            if (localStorage.getItem('access_token') === null || localStorage.getItem('user_id') === null) {
                return;
            }
            setLoading(true);
            const list = await fetchNotes();
            setNotes(list);
        } catch (error: any) {
            console.error('Erro ao carregar notas', error);
            alert('Erro ao carregar notas: ' + (error?.message || ''));
        } finally {
            setLoading(false);
        }
    };

    const openNote = (id: number) => {
        setCurrentNoteId(id);
        setIsEditMode(false);
    };

    const closeNote = () => {
        setCurrentNoteId(null);
        setIsEditMode(false);
    };

    const setEditMode = (edit: boolean) => {
        setIsEditMode(edit);
    };

    const createNote = async (data: {
        id_categoria: number;
        titulo?: string;
        conteudo: string;
        resumo_ia?: string;
    }) => {
        try {
            setLoading(true);
            const created = await createNoteService(data);
            setNotes((prev) => [created, ...prev]);
        } catch (error: any) {
            console.error('Erro ao criar nota', error);
            alert('Erro ao criar nota: ' + (error?.message || ''));
        } finally {
            setLoading(false);
        }
    };

    const updateCurrentNote = async (data: {
        titulo?: string;
        conteudo?: string;
        resumo_ia?: string;
        id_categoria?: number;
    }) => {
        if (currentNoteId === null) return;

        try {
            setLoading(true);
            const updated = await updateNoteService(currentNoteId, data);

            const normalized = {
                ...updated,
                titulo: updated.titulo || '',
                conteudo: updated.conteudo || '',
                resumo_ia: updated.resumo_ia || '',
            };

            setNotes((prev) =>
                prev.map((n) => (n.id_nota === currentNoteId ? normalized : n)),
            );
        } catch (error: any) {
            console.error('Erro ao atualizar nota', error);
            alert('Erro ao atualizar nota: ' + (error?.message || ''));
        } finally {
            setLoading(false);
        }
    };

    const deleteCurrentNote = async () => {
        if (currentNoteId === null) return;

        try {
            setLoading(true);
            await deleteNoteService(currentNoteId);
            setNotes((prev) => prev.filter((n) => n.id_nota !== currentNoteId));
            closeNote();
        } catch (error: any) {
            console.error('Erro ao deletar nota', error);
            alert('Erro ao deletar nota: ' + (error?.message || ''));
        } finally {
            setLoading(false);
        }
    };

    const generateResumoForContent = async (content: string) => {
        try {
            return await autoGenerateResumo(content);
        } catch (error: any) {
            console.error('Erro ao gerar resumo', error);
            alert('Erro ao gerar resumo: ' + (error?.message || ''));
            return '';
        }
    };

    const value: NotesContextType = {
        notes,
        loading,
        currentNoteId,
        isEditMode,
        openNote,
        closeNote,
        setEditMode,
        reloadNotes,
        createNote,
        updateCurrentNote,
        deleteCurrentNote,
        generateResumoForContent,
    };

    return (
        <NotesContext.Provider value={value}>
            {children}
        </NotesContext.Provider>
    );
}

export function useNotes(): NotesContextType {
    const ctx = useContext(NotesContext);
    if (!ctx) {
        throw new Error('useNotes deve ser usado dentro de NotesProvider');
    }
    return ctx;
}
