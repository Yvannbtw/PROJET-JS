/*
=====================================================
LOCAL STORAGE
=====================================================
*/

const userKey = "MSG_KEY";
let messages = chargerMsg();
const users = [];

function sauvegarderMsg() {
  localStorage.setItem(userKey, JSON.stringify(messages));
}
function chargerMsg() {
  const dataUser = localStorage.getItem(userKey);
  if (dataUser) {
    return JSON.parse(dataUser);
  }
  return [];
}

/*
=====================================================
FONCTIONS UTILITAIRES
=====================================================
*/
function compteur() {
  const statCompter = (document.getElementById("statMessages").textContent =
    messages.length);
  const wallCompteur = (document.getElementById("wallCount").textContent =
    `${messages.length} messages`);
}

function formaterHeureMinute(date = new Date()) {
  const heures = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${heures} : ${minutes}`;
}

function addLike(btnTriger) {
  const btnLikeId = parseInt(btnTriger.getAttribute("id").slice(4));
  const hasSameId = messages.filter((key) => key.id === btnLikeId);
  hasSameId[0].likes === 0 ? hasSameId[0].likes++ : hasSameId[0].likes--;
  totalOfLikes();
}

function totalOfLikes() {
  const totalLikes = document.getElementById("statLikes");
  const total = messages.reduce((acc, newValue) => {
    return acc + newValue.likes;
  }, 0);

  totalLikes.textContent = total;
}

/*
=====================================================
SCRIPT INSCRIPTION
=====================================================
*/

/*
======Verification existance d'un pseudo====
*/

const verificationUsers = (newPseudo) =>
  users.some((u) => u.pseudonyme === newPseudo);

function verificationInput() {
  const app = document.getElementById("app");
  const userName = document.getElementById("pseudoDisplay");
  const pageLogin = document.getElementById("loginOverlay");
  const pseudoInput = document.getElementById("pseudoInput").value.trim();

  if (pseudoInput) {
    if (verificationUsers(pseudoInput)) {
      return console.log(`${pseudoInput} est deja pris`);
    } else {
      app.style.display = "block";
      pageLogin.style.display = "none";
      userName.textContent = pseudoInput;
      afficherMsg();
    }
  } else {
    return console.log("Acces refuser");
  }
}

document
  .getElementById("loginBtn")
  .addEventListener("click", verificationInput);

/*
=====================================================
SCRIPT CONNEXION
=====================================================
*/

/*
=====================================================
SCRIPT MESSAGE
=====================================================
*/

/*
======DELEGATION VIA L'OUTPUT DES MESSAGES=======
*/

document.getElementById("emptyState").addEventListener("click", (e) => {
  const btnLike = e.target.closest(".btn-like");
  if (btnLike) {
    addLike(btnLike);
    return;
  }

  const btnDelete = e.target.closest(".btn-delete");
  if (btnDelete) {
    supprimerMsg(btnDelete);
    return;
  }
});

/*
======AJOUT/CREATION DES MESSAGES=======
*/
function createMsg(username, msg) {
  if (msg === "") {
    console.log("Saisisez votre message avant de publier");
    return null;
  } else {
    let Msg = {
      id: Date.now(),
      pseudo: username,
      message: msg,
      likes: 0,
    };
    messages.unshift(Msg);
    const msgInput = (document.getElementById("messageInput").value = "");
    compteur();
    sauvegarderMsg();
  }
}

function afficherMsg() {
  const msgOutput = document.getElementById("emptyState");
  const msgInput = document.getElementById("messageInput").value.trim();
  const pseudoInput = document.getElementById("pseudoInput").value.trim();

  msgOutput.innerHTML = "";
  messages.forEach((keys) => {
    const templateHTML = ` 
    <div class="stat-top-user">
      <span class="stat-top-label">${keys.message}</span>
      <span class="stat-top-name">@${keys.pseudo}</span>
      <span class="stat-top-name">${formaterHeureMinute()}</span>
      <button id="btn-${keys.id}" class="btn-like">❤️</button>
      <button id="btns-${keys.id}" class="btn-delete">❌</button>
    </div>
    `;
    msgOutput.insertAdjacentHTML("beforeend", templateHTML);
  });
}

const btnSubmitMessage = document.getElementById("btn-publish");
btnSubmitMessage.addEventListener("click", () => {
  const msgInput = document.getElementById("messageInput").value.trim();
  const pseudoInput = document.getElementById("pseudoInput").value.trim();
  afficherMsg();
  createMsg(pseudoInput, msgInput);
  afficherMsg();
});

/*
======SUPPRESSION DES MESSAGES=======
*/

function supprimerMsg(btnDelete) {
  messages = messages.filter(
    (keys) => keys.id !== parseInt(btnDelete.getAttribute("id").slice(5)),
  );
  btnDelete.closest(".stat-top-user").remove();
  sauvegarderMsg();
  afficherMsg();
  compteur();
  totalOfLikes();
}

/*
======FILTRAGE DES MESSAGES=======
*/
const searchInput = document.getElementById("searchInput");

function afficherMsgFiltrer(table) {
  table.forEach((keys) => {
    const msgOutput = document.getElementById("emptyState");
    msgOutput.innerHTML = "";

    const templateHTML = ` 
    <div class="stat-top-user">
      <span class="stat-top-label">${keys.message}</span>
      <span class="stat-top-name">@${keys.pseudo}</span>
      <span class="stat-top-name">${formaterHeureMinute()}</span>
      <button id="btn-${keys.id}" class="btn-like">❤️</button>
      <button id="btns-${keys.id}" class="btn-delete">❌</button>
    </div>
    `;
    msgOutput.insertAdjacentHTML("beforeend", templateHTML);
  });
}

searchInput.addEventListener("input", (e) => {
  const msgOutput = document.getElementById("emptyState");
  const motCles = e.target.value.toLowerCase();
  const filtreMsg = messages.filter((props) => {
    return props.message.toLowerCase().includes(motCles);
  });
  if (e.target.value.trim() === "") {
    afficherMsg();
  } else {
    afficherMsgFiltrer(filtreMsg);
  }
});
