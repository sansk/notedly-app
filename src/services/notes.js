import { collection, addDoc, getDocs, getDoc, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../js/firebase.js';
import Note from '../js/note.js';

class NotesService {
    /**
     * Fetches all notes for the current user.
     * @returns {Promise<Note[]>}
     */
    async getNotes() {
        if (!auth.currentUser) {
            console.error("No user logged in");
            return [];
        }
        const notesCol = collection(db, 'notes');
        const q = query(notesCol, where("userId", "==", auth.currentUser.uid));
        const noteSnapshot = await getDocs(q);
        const noteList = noteSnapshot.docs.map(doc => {
            const data = doc.data();
            return new Note(
                doc.id,
                data.title,
                data.content,
                data.createdAt.toDate(),
                data.updatedAt.toDate()
            );
        });
        return noteList;
    }

    /**
     * Fetches a single note by its ID.
     * @param {string} noteId - The ID of the note to fetch.
     * @returns {Promise<Note|null>}
     */
    async getNoteById(noteId) {
        const noteRef = doc(db, 'notes', noteId);
        const noteSnap = await getDoc(noteRef);

        if (noteSnap.exists()) {
            const data = noteSnap.data();
            // Basic check to ensure user owns the note
            if (auth.currentUser && data.userId === auth.currentUser.uid) {
                return new Note(
                    noteSnap.id,
                    data.title,
                    data.content,
                    data.createdAt.toDate(),
                    data.updatedAt.toDate()
                );
            }
        }
        return null;
    }

    /**
     * Adds a new note to Firestore.
     * @param {object} noteData - The note data to add.
     */
    async addNote(noteData) {
        if (!auth.currentUser) throw new Error("No user logged in");
        await addDoc(collection(db, 'notes'), {
            ...noteData,
            userId: auth.currentUser.uid,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    /**
     * Updates an existing note.
     * @param {string} noteId - The ID of the note to update.
     * @param {object} noteData - The new data for the note.
     */
    async updateNote(noteId, noteData) {
        const noteRef = doc(db, 'notes', noteId);
        await updateDoc(noteRef, {
            ...noteData,
            updatedAt: new Date()
        });
    }

    /**
     * Deletes a note.
     * @param {string} noteId - The ID of the note to delete.
     */
    async deleteNote(noteId) {
        const noteRef = doc(db, 'notes', noteId);
        await deleteDoc(noteRef);
    }
}

export default new NotesService();