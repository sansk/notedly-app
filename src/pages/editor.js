// /src/pages/editor.js
import { marked } from 'marked';
import NotesService from '../services/notes.js';
import { router } from '../js/app.js';

const Editor = {
    render: async (queryParams) => {
        let note = { title: '', content: '' };
        if (queryParams && queryParams.id) {
            const fetchedNote = await NotesService.getNoteById(queryParams.id);
            if (fetchedNote) {
                note = fetchedNote;
            }
        }

        return `
            <div class="h-screen flex flex-col" data-note-id="${note.id || ''}">
                <header class="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
                    <div>
                         <input type="text" id="note-title" placeholder="Note Title..." class="text-lg font-bold p-2 bg-transparent focus:outline-none dark:text-white" value="${note.title}">
                    </div>
                    <div class="flex items-center">
                        <select id="editor-type" class="bg-gray-200 p-2 rounded mr-4">
                            <option value="markdown">Markdown</option>
                            <option value="richtext" disabled>Rich Text</option>
                            <option value="block" disabled>Block Editor</option>
                        </select>
                        <button id="preview-toggle" class="mr-4">Hide Preview</button>
                        <button id="save-note" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
                        <button id="cancel-edit" class="ml-2">Cancel</button>
                    </div>
                </header>
                <div class="flex-grow flex overflow-hidden">
                    <div id="editor-pane" class="w-1/2 p-4">
                        <textarea id="markdown-editor" class="w-full h-full p-2 border rounded dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:outline-none">${note.content}</textarea>
                    </div>
                    <div id="preview-pane" class="w-1/2 p-4 border-l bg-gray-50 dark:bg-gray-800 dark:border-gray-700 prose dark:prose-invert max-w-none">
                        <!-- Preview content goes here -->
                    </div>
                </div>
            </div>
        `;
    },
    after_render: async (queryParams) => {
        let noteId = queryParams ? queryParams.id : null;

        const editor = document.getElementById('markdown-editor');
        const preview = document.getElementById('preview-pane');
        const titleInput = document.getElementById('note-title');

        const renderPreview = () => {
            preview.innerHTML = marked(editor.value);
        };

        editor.addEventListener('input', renderPreview);
        renderPreview(); // Initial render

        // --- Button Controls ---
        const previewToggle = document.getElementById('preview-toggle');
        previewToggle.addEventListener('click', () => {
            const editorPane = document.getElementById('editor-pane');
            const isHidden = preview.style.display === 'none';
            preview.style.display = isHidden ? 'block' : 'none';
            editorPane.style.width = isHidden ? '50%' : '100%';
            previewToggle.textContent = isHidden ? 'Hide Preview' : 'Show Preview';
        });

        const saveButton = document.getElementById('save-note');
        saveButton.addEventListener('click', async () => {
            const title = titleInput.value;
            const content = editor.value;
            if (!title) {
                alert('Please enter a title for your note.');
                return;
            }
            try {
                if (noteId) {
                    await NotesService.updateNote(noteId, { title, content });
                } else {
                    await NotesService.addNote({ title, content });
                }
                router.navigateTo('/dashboard');
            } catch (error) {
                console.error("Failed to save note:", error);
                alert("Could not save the note. See console for details.");
            }
        });

        const cancelButton = document.getElementById('cancel-edit');
        cancelButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                router.navigateTo('/dashboard');
            }
        });
    }
};

export default Editor;