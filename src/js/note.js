/**
 * Represents a single note.
 */
class Note {
    constructor(id, title, content, createdAt, updatedAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default Note;