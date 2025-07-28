// /src/components/NotesGrid.js
import Note from '../js/note.js';

const NoteCard = (note) => {
    return `
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 class="font-bold text-lg mb-2 dark:text-white">${note.title}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Created: ${note.createdAt.toLocaleDateString()}
            </p>
            <div class="flex justify-end space-x-2">
                <button data-id="${note.id}" class="edit-note-btn text-blue-500 hover:text-blue-700">Edit</button>
                <button data-id="${note.id}" class="delete-note-btn text-red-500 hover:text-red-700">Delete</button>
            </div>
        </div>
    `;
};

const NotesGrid = {
    render: (notes) => {
        if (!notes || notes.length === 0) {
            return `<p>No notes found. Create one!</p>`;
        }
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${notes.map(note => NoteCard(note)).join('')}
            </div>
        `;
    }
};

export default NotesGrid;