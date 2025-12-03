import { useEffect, useState } from 'react';
import { useNotes } from '../context/NotesContext';
import '../styles/Home.css';
import axios from 'axios';
import { CategoriaDto } from '../dto/categoria.dto.tsx';

export function HomePage() {
    const {
        notes,
        currentNoteId,
        isEditMode,
        openNote,
        closeNote,
        setEditMode,
        createNote,
        updateCurrentNote,
        deleteCurrentNote,
        generateResumoForContent,
    } = useNotes();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // campos do modal de criação
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [noteResumo, setNoteResumo] = useState('');
    const [categorias, setCategorias] = useState<CategoriaDto[]>([]);
    const [categoriaId, setCategoriaId] = useState<number | ''>('');

    // campos do modal de edição
    const [editTitulo, setEditTitulo] = useState('');
    const [editConteudo, setEditConteudo] = useState('');
    const [editResumo, setEditResumo] = useState('');

    const currentNote = notes.find((n) => n.id_nota === currentNoteId) || null;

    useEffect(() => {
        if (currentNote) {
            setEditTitulo(currentNote.titulo || '');
            setEditConteudo(currentNote.conteudo || '');
            setEditResumo(currentNote.resumo_ia || '');
        }
    }, [currentNote]);

    async function handleOpenCreateModal() {
        try {
            const response = await axios.get<CategoriaDto[]>(
                'http://localhost:3000/categoria',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
                    },
                },
            );
            setCategorias(response.data);
            setNoteTitle('');
            setNoteContent('');
            setNoteResumo('');
            setCategoriaId('');
            setIsCreateModalOpen(true);
        } catch (e: any) {
            console.error(e);
            alert('Erro ao carregar categorias: ' + (e?.message || ''));
        }
    }

    function handleCloseCreateModal() {
        setIsCreateModalOpen(false);
    }

    async function handleCreateNote() {
        if (!categoriaId) {
            alert('Selecione uma categoria.');
            return;
        }
        if (!noteTitle.trim() && !noteContent.trim()) {
            alert('Preencha pelo menos título ou conteúdo.');
            return;
        }

        await createNote({
            id_categoria: Number(categoriaId),
            titulo: noteTitle,
            conteudo: noteContent,
            resumo_ia: noteResumo || (await generateResumoForContent(noteContent)),
        });

        setIsCreateModalOpen(false);
        alert('Nota criada com sucesso!');
    }

    async function handleGenerateResumo() {
        if (!noteContent.trim()) {
            alert('Adicione conteúdo antes de resumir.');
            return;
        }
        const resumo = await generateResumoForContent(noteContent);
        setNoteResumo(resumo);
    }

    async function handleSalvarEdicao() {
        if (!currentNote) return;

        await updateCurrentNote({
            titulo: editTitulo,
            conteudo: editConteudo,
            resumo_ia: editResumo,
        });

        setEditMode(false);
        alert('Nota atualizada com sucesso!');
    }

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Minhas notas</h1>
                <button
                    id="createNoteBtn"
                    className="btn-primary"
                    onClick={handleOpenCreateModal}
                >
                    Crie uma nota
                </button>
            </header>

            <main className="home-main">
                <section id="notesGrid" className="notes-grid">
                    {notes.length === 0 ? (
                        <p>
                            Nenhuma nota criada ainda. Clique em &quot;Crie uma nota&quot; para
                            começar!
                        </p>
                    ) : (
                        notes.map((note) => (
                            <article
                                key={note.id_nota}
                                className="note-card"
                                onClick={() => openNote(note.id_nota)}
                            >
                                <h3>{note.titulo}</h3>
                                <p>{note.conteudo}</p>
                                <p>{note.resumo_ia}</p>
                            </article>
                        ))
                    )}
                </section>
            </main>

            {/* Modal Criar Nota */}
            {isCreateModalOpen && (
                <div id="modalCreateNote" className="modal-overlay active">
                    <div className="modal">
                        <h2>Criar nota</h2>

                        <div className="form-group">
                            <label htmlFor="noteTitleInput">Título</label>
                            <input
                                id="noteTitleInput"
                                value={noteTitle}
                                onChange={(e) => setNoteTitle(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="noteContentInput">Conteúdo</label>
                            <textarea
                                id="noteContentInput"
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="noteResumoInput">Resumo</label>
                            <textarea
                                id="noteResumoInput"
                                value={noteResumo}
                                onChange={(e) => setNoteResumo(e.target.value)}
                            />
                            <button
                                type="button"
                                id="modalResumirBtn"
                                className="btn-secondary"
                                onClick={handleGenerateResumo}
                            >
                                Gerar resumo
                            </button>
                        </div>

                        <div className="form-group">
                            <label htmlFor="noteCategoriaSelect">Categoria</label>
                            <select
                                id="noteCategoriaSelect"
                                value={categoriaId}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setCategoriaId(value ? Number(value) : '');
                                }}
                            >
                                <option value="">Selecione uma categoria</option>
                                {categorias.map((cat) => (
                                    <option key={cat.id_categoria} value={cat.id_categoria}>
                                        {cat.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button
                                id="modalFecharBtn"
                                type="button"
                                className="btn-secondary"
                                onClick={handleCloseCreateModal}
                            >
                                Fechar
                            </button>
                            <button
                                id="modalCriarBtn"
                                type="button"
                                className="btn-primary"
                                onClick={handleCreateNote}
                            >
                                Criar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Visualizar/Editar Nota */}
            {currentNote && (
                <div id="modalViewNote" className="modal-overlay active">
                    <div className="modal">
                        <h2>Nota</h2>

                        <div className="form-group">
                            <label htmlFor="viewNoteTitleInput">Título</label>
                            <input
                                id="viewNoteTitleInput"
                                value={editTitulo}
                                readOnly={!isEditMode}
                                onChange={(e) => setEditTitulo(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="viewNoteContentInput">Conteúdo</label>
                            <textarea
                                id="viewNoteContentInput"
                                value={editConteudo}
                                readOnly={!isEditMode}
                                onChange={(e) => setEditConteudo(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="viewNoteResumoInput">Resumo</label>
                            <textarea
                                id="viewNoteResumoInput"
                                value={editResumo}
                                readOnly={!isEditMode}
                                onChange={(e) => setEditResumo(e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn-secondary"
                                disabled={!isEditMode}
                                onClick={async () => {
                                    if (!isEditMode) return;
                                    if (!editConteudo.trim()) {
                                        alert('Adicione conteúdo antes de gerar o resumo.');
                                        return;
                                    }
                                    const resumo = await generateResumoForContent(editConteudo);
                                    setEditResumo(resumo);
                                }}
                            >
                                Gerar resumo IA
                            </button>
                        </div>

                        <p id="viewNoteDate">
                            Criada em:{' '}
                            {new Date(currentNote.data_criacao).toLocaleString('pt-BR')}
                        </p>

                        <div className="modal-actions">
                            <button
                                id="modalDeletarBtn"
                                type="button"
                                className="btn-danger"
                                onClick={() => {
                                    if (
                                        confirm(
                                            'Tem certeza que deseja deletar esta nota? Esta ação não pode ser desfeita.',
                                        )
                                    ) {
                                        deleteCurrentNote();
                                        alert('Nota deletada com sucesso!');
                                    }
                                }}
                            >
                                Deletar
                            </button>

                            <button
                                id="modalAlterarBtn"
                                type="button"
                                className="btn-secondary"
                                onClick={() => setEditMode(!isEditMode)}
                            >
                                {isEditMode ? '❌ Cancelar' : '✏️ Alterar'}
                            </button>

                            <button
                                id="modalSalvarBtn"
                                type="button"
                                className="btn-primary"
                                style={{ display: isEditMode ? 'inline-block' : 'none' }}
                                onClick={handleSalvarEdicao}
                            >
                                Salvar
                            </button>

                            <button
                                id="modalFecharViewBtn"
                                type="button"
                                className="btn-secondary"
                                onClick={closeNote}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
