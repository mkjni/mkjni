// Firebase configuration
var firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', (event) => {
    loadNotes();
});

document.getElementById('googleSignIn').onclick = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log(result.user);
            loadNotes();
        })
        .catch((error) => {
            console.error(error);
        });
};

function format(command) {
    document.execCommand(command, false, null);
}

function saveNote() {
    const noteContent = document.getElementById('note').innerHTML;
    const user = auth.currentUser;
    if (user) {
        db.collection('notes').add({
            uid: user.uid,
            content: noteContent,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            loadNotes();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    } else {
        alert("Please sign in first.");
    }
}

function loadNotes() {
    const user = auth.currentUser;
    if (user) {
        db.collection('notes').where('uid', '==', user.uid).orderBy('timestamp', 'desc').get()
        .then((querySnapshot) => {
            const notesList = document.getElementById('notesList');
            notesList.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const note = doc.data().content;
                const noteDiv = document.createElement('div');
                noteDiv.className = 'saved-note';
                noteDiv.innerHTML = `
                    <div class="note-content">${note}</div>
                    <button onclick="deleteNote('${doc.id}')">Delete</button>
                `;
                notesList.appendChild(noteDiv);
            });
        });
    }
}

function deleteNote(id) {
    db.collection('notes').doc(id).delete().then(() => {
        loadNotes();
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        loadNotes();
    }
});
