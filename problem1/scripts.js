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
    const newNoteText = noteText.value;
    
    if (newNoteText.trim() !== "") {
        const newNote = document.createElement("div");
        newNote.className = "note";
        newNote.textContent = newNoteText;
        newNote.style.backgroundColor = noteColour.value;
        
        const click$ = fromEvent(newNote, 'click');
        click$.subscribe(() => {
            currentNote = newNote;
            updateButtons();
        });

        storedNotes.appendChild(newNote);
        noteText.value = "";
        updateButtons();
    }
}

function editNote() {
    if (currentNote) {
        const editedText = prompt("edit note text/colour", currentNote.textContent);
        if (editedText !== null) {
            currentNote.textContent = editedText;
            currentNote.style.backgroundColor = noteColour.value;
        }
    }
}

function deleteNote() {
    if (currentNote) {
        if (confirm("delete selected note?")) {
            storedNotes.removeChild(currentNote);
            currentNote = null;
            updateButtons();
        }
    }
}

function updateButtons() {
    if (currentNote) {
        noteEditButton.disabled = false;
        noteDeleteButton.disabled = false;
    } else {
        noteEditButton.disabled = true;
        noteDeleteButton.disabled = true;
    }
}