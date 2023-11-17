const { fromEvent } = rxjs;

// dom elements
const noteAddButton = document.getElementById("note-add");
const noteEditButton = document.getElementById("note-edit");
const noteDeleteButton = document.getElementById("note-delete");
const noteColour = document.getElementById("notes-colour-select");
const noteText = document.getElementById("notes-textarea")
const storedNotes = document.getElementById('notes-stored');

let currentNote = null;

// create streams from button clicks
const addClick$ = fromEvent(noteAddButton, 'click');
const editClick$ = fromEvent(noteEditButton, 'click');
const deleteClick$ = fromEvent(noteDeleteButton, 'click');

// subscribe to the streams
addClick$.subscribe(() => addNote());
editClick$.subscribe(() => editNote());
deleteClick$.subscribe(() => deleteNote());

// functions
function addNote() {
    const newNote = new Note(noteText.value, noteColour.value, currentNote);
    
    if (noteText.value.trim() !== "") {
        // call note.create etc
        storedNotes.appendChild(newNote.element);
        noteText.value = "";
        updateButtons();
    }
}

function editNote() {
    if (currentNote) {
        const editedText = prompt("edit note text/colour", currentNote.textContent);
        if (editedText !== null && editedText.trim() !== "") {
            currentNote.edit(editedText, noteColour.value);
        }
    }
}

function deleteNote() {
    if (currentNote) {
        if (confirm("delete selected note (and its children?)")) {
            currentNote.delete();
            currentNote = null;
            updateButtons();
        }
    }
}

function updateButtons() {
    if (currentNote) {
        noteEditButton.disabled = !currentNote;
        noteDeleteButton.disabled = !currentNote;
    }
}

class Note {
    constructor(text, colour, parent = null) {
        this.text = text;
        this.colour = colour;
        this.parent = parent;
        this.children = [];
        this.element = this.createNewNote();

        // add this child note to parent if exists
        if (parent) {
            parent.children.push(this);
        }
    }

    createNewNote() {
        // create HTML element
        const newNote = document.createElement("div");
        newNote.className = "note";
        newNote.textContent = this.text;
        newNote.style.backgroundColor = this.colour;
        
        // create observable from click event on newNote
        const click$ = fromEvent(newNote, 'click');
        click$.subscribe(() => {
            currentNote = this;
            updateButtons();
        });

        return newNote;
    }

    delete() {
        // delete all child nodes
        for (let child of this.children) {
            child.delete()
        }

        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index !== -1) {
                this.parent.children.splice(index, 1);
            }
        }

        storedNotes.removeChild(this.element);
    }

    edit(editedText, editedColour) {
        this.text = editedText;
        this.element.innerHTML = this.text;
        this.element.style.backgroundColor = editedColour;;
    }
}