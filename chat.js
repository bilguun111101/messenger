import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    getDoc,
    setDoc,
    doc,
    updateDoc,
    increment,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import {
    getDatabase,
    onValue,
    ref,
    push,
    query,
    orderByChild,
    orderByKey,
    child,
    set,
    get,
    onChildChanged,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCznDCwpfYiEOQ000FE_p2saj8MmDxJW1g",
    authDomain: "mess-43c57.firebaseapp.com",
    projectId: "mess-43c57",
    storageBucket: "mess-43c57.appspot.com",
    messagingSenderId: "525279772448",
    appId: "1:525279772448:web:e15ef6a8d020155f66e145",
    measurementId: "G-HX7KX4RTBS"
};

  
const app = initializeApp(firebaseConfig);
const auth = await getAuth(app);
const db = getFirestore(app);
const realDb = getDatabase(app);

const sendText = document.querySelector('.add-text-input');
let writeTextInput = document.querySelector('#write-text-chat')

let arrDraw = []
let id = 0;
let boomBoom = 0;


// bar fixed menus --------------------------------------------------------------------------

document.querySelector('.sign-in-btn').onclick = () => {
    document.querySelector('.bar-sign-in').classList.add('active-sign');
}

document.querySelector('.close-sign').onclick = () => {
    document.querySelector('.bar-sign-in').classList.remove('active-sign');
}

document.querySelector('.log-in-btn').onclick = () => {
    document.querySelector('.bar-log-in').classList.add('active-log');
}

document.querySelector('.close-log').onclick = () => {
    document.querySelector('.bar-log-in').classList.remove('active-log');
}

// ============================================================================================

// sign in and log in --------------------------------------------------------------------------------
function signIn() {
    let email = document.querySelector('#email-sign').value;
    let name = document.querySelector('#name-sign').value;
    let pass = document.querySelector('#pass-sign').value;
    let passAgain = document.querySelector('#pass-again').value;

    if (pass === passAgain) {
        createUserWithEmailAndPassword(auth, email, pass)
        .then(async(userCredential) => {
            const userUidFromCred = userCredential.user.uid;
            await setDoc(doc(db, "users", userUidFromCred,),{
                email,
                name,
                pass,
            });
            document.querySelector('#email-sign').value = '';
            document.querySelector('#name-sign').value = '';
            document.querySelector('#pass-sign').value = '';
            document.querySelector('#pass-again').value = '';
            console.log('amilttai burtgelee')
        }).catch(err => {
            console.log('error: ' + err);
        })
    }
    else {
        console.log('Please try again !!!');
        document.querySelector('#email-sign').value = '';
        document.querySelector('#name-sign').value = '';
        document.querySelector('#pass-sign').value = '';
        document.querySelector('#pass-again').value = '';
    }
}

function logIn() {
    let email = document.querySelector('#name-log').value;
    let pass = document.querySelector('#pass-log').value;
    getDocs(collection(db, 'users')).then(snap => {
        snap.forEach(doc => {
            if ((doc.data().email === email || doc.data().name === email) && doc.data().pass === pass) {
                document.querySelector('#name-log').value = '';
                document.querySelector('#pass-log').value = '';
                console.log('amjilttai nevterlee')
                readyAll(doc.data().name)
            }
        })
    })
}

document.querySelector('.sign-btn').addEventListener('click', signIn);
document.querySelector('.log-btn').addEventListener('click', logIn);

// ==========================================================================================================================

async function readyAll(name) {
    async function pushData() {
        id++;
        set(ref(realDb, 'chats'), {
            id,
            note: writeTextInput.value
        }).catch(err => {
            console.log('error: ', err)
        })
        writeTextInput.value = '';
    }
    
    sendText.addEventListener('click', () => {
        let chatMyDude = writeTextInput.value;
        if (!chatMyDude === false) {
            pushData();
        }
    })

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            let chatMyDude = writeTextInput.value;
            if (!chatMyDude === false) {
                pushData();
            }
        }
    })
    
    get(ref(realDb, 'chats')).then(snap => {
        let outHtml = ''
        snap.forEach(ele => {
            boomBoom++;
            outHtml += `<div class="name-text" data-id=${ele.val().id}>
                            <p>${name}</p>
                            <h1>${ele.val().note}</h1>
                        </div>`
        });
        console.log(boomBoom)
        document.querySelector('.out-text-chat').innerHTML = outHtml;
    })
}