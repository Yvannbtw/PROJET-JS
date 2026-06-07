/*
=====================================================
LOCAL STORAGE
=====================================================
*/

const msgKey = "MSG_KEY";
const userKey = "USER_KEY";
const likedKey = "LIKED_KEY";

let messages = chargerMsg();
const users = chargerUser();
let mesLikes = JSON.parse(localStorage.getItem(likedKey)) || [];

function sauvegarderMsg() {
  localStorage.setItem(msgKey, JSON.stringify(messages));
}
function chargerMsg() {
  const dataMsg = localStorage.getItem(msgKey);
  if (dataMsg) {
    return JSON.parse(dataMsg);
  }
  return [];
}

function sauvegarderUser() {
  localStorage.setItem(userKey, JSON.stringify(users));
}
function chargerUser() {
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
const verificationUsers = (newPseudo) =>
  users.some((u) => u.pseudonyme === newPseudo);

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

  if (hasSameId.length === 0) return;

  const isAlreadyLiked = btnTriger.getAttribute("data-liked") === "true";

  if (!isAlreadyLiked) {
    hasSameId[0].likes++;
    btnTriger.setAttribute("data-liked", "true");

    if (!mesLikes.includes(btnLikeId)) mesLikes.push(btnLikeId);
  } else {
    hasSameId[0].likes--;
    btnTriger.setAttribute("data-liked", "false");

    mesLikes = mesLikes.filter((id) => id !== btnLikeId);
  }

  localStorage.setItem(likedKey, JSON.stringify(mesLikes));

  totalOfLikes();
  sauvegarderMsg();
}

function totalOfLikes() {
  const totalLikes = document.getElementById("statLikes");
  const total = messages.reduce((acc, newValue) => {
    return acc + newValue.likes;
  }, 0);

  totalLikes.textContent = total;
}

function afficherTopPosteur() {
  const topPosteurEl = document.getElementById("topPosteur");
  if (!topPosteurEl) return;

  if (messages.length === 0) {
    topPosteurEl.textContent = "Aucun";
    return;
  }

  const compteurPseudos = {};

  messages.forEach((msg) => {
    compteurPseudos[msg.pseudo] = (compteurPseudos[msg.pseudo] || 0) + 1;
  });

  let maxMessages = 0;
  let meilleurPseudo = "";

  for (const pseudo in compteurPseudos) {
    if (compteurPseudos[pseudo] > maxMessages) {
      maxMessages = compteurPseudos[pseudo];
      meilleurPseudo = pseudo;
    }
  }

  topPosteurEl.textContent = `@${meilleurPseudo} (${maxMessages} msg)`;
}

function erreurMsg(span, msg) {
  const msgError = document.querySelector(span);
  msgError.textContent = msg;
  setTimeout(() => {
    msgError.textContent = "";
  }, 2000);
}
/*
=====================================================
SCRIPT INSCRIPTION
=====================================================
*/
const btnInscription = document.getElementById("inscriptionBtn");

btnInscription.addEventListener("click", () => {
  const loginOverlay = document.getElementById("loginOverlay");
  const inscriptionOverlay = document.getElementById("inscriptionOverlay");

  loginOverlay.style.display = "none";
  inscriptionOverlay.style.display = "flex";
});

/*
======Verification existance d'un pseudo====
*/

function verificationInputInscription() {
  const app = document.getElementById("app");
  const userName = document.getElementById("pseudoDisplay");
  const pageInscription = document.getElementById("inscriptionOverlay");
  const pseudoInput = document.getElementById("i-pseudoInput").value.trim();

  if (pseudoInput) {
    if (verificationUsers(pseudoInput)) {
      return erreurMsg(
        ".erreur-msg-i",
        `Le peudo ${pseudoInput} est déjà pris`,
      );
    } else {
      users.push({ id: Date.now(), pseudonyme: pseudoInput });
      app.style.display = "block";
      pageInscription.style.display = "none";
      userName.textContent = pseudoInput;
      sauvegarderUser();
      afficherMsg();
    }
  } else {
    return erreurMsg(".erreur-msg-i", "Entrer votre pseudo");
  }
}

document
  .getElementById("new-inscription-btn")
  .addEventListener("click", verificationInputInscription);

/*
=====================================================
SCRIPT CONNEXION
=====================================================
*/

function verificationInputConnexion() {
  const app = document.getElementById("app");
  const userName = document.getElementById("pseudoDisplay");
  const pageLogin = document.getElementById("loginOverlay");
  const pseudoInput = document.getElementById("pseudoInput").value.trim();

  if (pseudoInput) {
    if (verificationUsers(pseudoInput)) {
      app.style.display = "block";
      pageLogin.style.display = "none";
      userName.textContent = pseudoInput;
      afficherMsg();
    } else {
      return erreurMsg(
        ".erreur-msg-c",
        "Acces refuser, utilisateur inexistant",
      );
    }
  } else {
    erreurMsg(".erreur-msg-c", "Veillez saisir votre pseudo");
  }
}

document
  .getElementById("loginBtn")
  .addEventListener("click", verificationInputConnexion);

/*
=====================================================
SCRIPT MESSAGE
=====================================================
*/

/*
======DELEGATION VIA L'OUTPUT DES MESSAGES=======
*/

document.getElementById("messagesList").addEventListener("click", (e) => {
  const btnLike = e.target.closest(".btn-like");
  if (btnLike) {
    addLike(btnLike);

    if (btnLike.getAttribute("data-liked") === "true") {
      btnLike.classList.add("liked");
    } else {
      btnLike.classList.remove("liked");
    }
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

// Template HTML d'une carte message — utilisé par l'affichage normal ET le filtrage
function creerCarteMessage(keys, utilisateurConnecte) {
  const dejaLike = mesLikes.includes(keys.id);
  const dataLikedAttr = dejaLike ? "true" : "false";
  const classLiked = dejaLike ? "liked" : "";

  const estMonMessage = keys.pseudo === utilisateurConnecte;
  const classeProprietaire = estMonMessage ? "mon-message" : "";

  const boutonSupprimerHTML = estMonMessage
    ? `<button id="btns-${keys.id}" class="btn-delete">Supprimer</button>`
    : "";

  const initiale = keys.pseudo.charAt(0).toUpperCase();
  const heure = formaterHeureMinute(new Date(keys.id));

  return `
    <article class="message-card ${classeProprietaire}">
      <div class="card-header">
        <div class="card-avatar">${initiale}</div>
        <div class="card-meta">
          <span class="card-pseudo">@${keys.pseudo}</span>
          <span class="card-date">${heure}</span>
        </div>
      </div>
      <p class="card-text">${keys.message}</p>
      <div class="card-footer">
        <button id="btn-${keys.id}" data-liked="${dataLikedAttr}" class="btn-like ${classLiked}">
          <span class="like-heart">❤️</span>
          <span>${keys.likes}</span>
        </button>
        ${boutonSupprimerHTML}
      </div>
    </article>
  `;
}

function afficherMsg() {
  const messagesList = document.getElementById("messagesList");

  const utilisateurConnecte = document
    .getElementById("pseudoDisplay")
    .textContent.trim();

  if (messages.length === 0) {
    messagesList.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">◌</span>
        <p>Le mur est encore vide.<br />Soyez le premier à écrire !</p>
      </div>
    `;
  } else {
    messagesList.innerHTML = messages
      .map((keys) => creerCarteMessage(keys, utilisateurConnecte))
      .join("");
  }

  compteur();
  totalOfLikes();
  afficherTopPosteur();
}

const btnSubmitMessage = document.getElementById("btn-publish");
btnSubmitMessage.addEventListener("click", () => {
  const msgInput = document.getElementById("messageInput").value.trim();
  const userName = document.getElementById("pseudoDisplay");

  afficherMsg();
  createMsg(userName.textContent, msgInput);
  afficherMsg();
});

/*
======SUPPRESSION DES MESSAGES=======
*/

function supprimerMsg(btnDelete) {
  messages = messages.filter(
    (keys) => keys.id !== parseInt(btnDelete.getAttribute("id").slice(5)),
  );
  btnDelete.closest(".message-card").remove();
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
  const messagesList = document.getElementById("messagesList");

  const utilisateurConnecte = document
    .getElementById("pseudoDisplay")
    .textContent.trim();

  if (table.length === 0) {
    messagesList.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">◌</span>
        <p>Aucun message ne correspond à votre recherche.</p>
      </div>
    `;
    return;
  }

  messagesList.innerHTML = table
    .map((keys) => creerCarteMessage(keys, utilisateurConnecte))
    .join("");
}
searchInput.addEventListener("input", (e) => {
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
