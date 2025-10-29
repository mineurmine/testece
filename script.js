const keys = 'azertyui'.split('');
const videosContainer = document.getElementById('videos-container');
const popup = document.getElementById('winner-popup');
const questionDisplay = document.getElementById('current-question');
const answerOptionsContainer = document.getElementById('answer-options'); 
const videos = [];
let winnerDeclared = false; 

let buzzedPlayer = null; 
let isQuestionActive = true; 

// Définition des sources de vidéo
const VIDEO_UP = "animeup.mp4"; // Vidéo de progression (bonne réponse)
const VIDEO_DOWN = "animebas.mp4"; // Vidéo de perte (mauvaise réponse)

// LISTES DE PHRASES ALÉATOIRES
const goodAnswerPhrases = [
    "On touche bientôt le sommet !", "Et une marche de plus, bravo !", "La montée est sûre quand on regarde où on met les pieds !", 
    "Solide comme une rampe !", "C’est dans la bonne direction !", "Encore quelques marches avant la victoire !",
    "Excellent réflexe, la sécurité te fait grimper !", "Bravo, tu restes bien accroché à la rampe de la réussite !",
    "Un pas de plus vers les hauteurs de la prévention !", "Tu grimpes comme un pro de la prévention !",
    "Encore une marche et tu touches les nuages !", "Le sommet est en vue, garde le rythme !",
    "On ne t’arrête plus, champion de la sécurité !", "La rampe est ton amie, et la victoire aussi !",
    "C’est bon, t’as le pied sûr !", "Bravo, ta vigilance te fait prendre de la hauteur !",
    "Pas de glissade, que de la réussite !", "Excellent réflexe, la prévention te porte vers les sommets !",
    "Tu montes plus vite qu’un ascenseur certifié ISO 45001 !",
];

const wrongAnswerPhrases = [
    "Oups… direction le rez-de-chaussée !", "Aïe ! Marche manquée… tu redescends d’un cran !",
    "La précipitation te fait trébucher !", "Attention, tu perds l’équilibre !",
    "Retour au point de départ… ça glisse, hein ?", "Oh non… on dirait que la rampe t’a échappé !",
    "Un faux pas et te voilà reparti vers le bas !", "Oups, la gravité a encore gagné !",
    "Marche arrière activée… doucement cette fois !", "Pas de panique, même les meilleurs ratent une marche !",
    "Oups… la marche était plus haute que prévu !", "Et voilà, retour express au rez-de-chaussée !",
    "Attention, ça descend plus vite que prévu !", "Aïe, la gravité ne pardonne pas !",
    "Tu viens d’inventer la descente en mode toboggan !", "Oh oh… une marche ratée, ça pique un peu !",
    "Un faux pas de plus, et c’est la rambarde qui rigole !", "Et hop, tu refais connaissance avec le sol !",
    "Redescente non prévue au programme…", "Marche arrière activée ! Essaie encore sans te précipiter !",
];

function getRandomPhrase(phraseArray) {
    const index = Math.floor(Math.random() * phraseArray.length);
    return phraseArray[index];
}


// =================================================================
// TOUTES LES QUESTIONS (Mix Vrai/Faux et QCM)
// =================================================================

const allQuestions = [
    // Vrai/Faux version simple (type: vf)
    { type: "vf", question: "Tenir la rampe réduit le risque de chute.", correct: true },
    { type: "vf", question: "Descendre les escaliers en courant est plus dangereux que de les monter vite.", correct: true },
    { type: "vf", question: "Pour aller plus vite, je peux monter deux marches à la fois lorsque je tiens la rampe sans augmenter mon risque de chute.", correct: false },
    { type: "vf", question: "Les chutes dans les escaliers sont l’une des premières causes d’accident du travail.", correct: true },
    { type: "vf", question: "Porter un gros objet qui cache la vue dans les escaliers augmente le risque de chute.", correct: true },
    { type: "vf", question: "Marcher en talon dans un escalier est sans danger.", correct: false },
    { type: "vf", question: "Une rampe doit être présente dès 3 marches selon les normes courantes.", correct: true },
    { type: "vf", question: "Un escalier mal éclairé est un facteur de risque.", correct: true },
    { type: "vf", question: "Regarder son téléphone en descendant les escaliers ne présente aucun danger.", correct: false },
    { type: "vf", question: "Il est recommandé de descendre en posant uniquement la pointe des pieds.", correct: false },
    { type: "vf", question: "Emprunter un escalier qui vient d’être laver ne présente pas plus de risque que d’habitude.", correct: false },
    { type: "vf", question: "Monter un escalier en discutant avec un collègue distrait moins que le téléphone.", correct: false },
    { type: "vf", question: "Les chutes d’escaliers concernent surtout les jeunes.", correct: false },
    { type: "vf", question: "Les escaliers doivent avoir un contraste visuel clair sur la première et la dernière marche.", correct: true },
    { type: "vf", question: "Poser des objets temporaires sur un escalier (sac, boîte) est sans risque.", correct: false },
    { type: "vf", question: "Un escalier trop étroit augmente le risque de collision entre collègues.", correct: true },
    { type: "vf", question: "Les mains courantes doivent idéalement être présentes des deux côtés d’un escalier.", correct: true },
    { type: "vf", question: "Monter un escalier en tenant un parapluie ouvert ne présente pas de danger.", correct: false },
    { type: "vf", question: "Les escaliers doivent toujours être libres de tout stockage temporaire.", correct: true },
    { type: "vf", question: "Le marquage antidérapant sur le bord de marche est uniquement décoratif.", correct: false },
    { type: "vf", question: "Monter un escalier en discutant au téléphone est aussi risqué que de descendre en regardant un téléphone.", correct: true },
    { type: "vf", question: "Une rampe en métal froide en hiver peut être un facteur indirect de chute (on hésite à la tenir).", correct: true },
    { type: "vf", question: "S’appuyer uniquement sur le mur est aussi sécuritaire que d’utiliser la rampe.", correct: false },
    { type: "vf", question: "Les accidents dans les escaliers surviennent le plus souvent à la montée.", correct: false },
    { type: "vf", question: "Un escalier extérieur doit être entretenu contre la pluie, le verglas et les feuilles mortes.", correct: true },

    // Vrai/Faux version complexe (type: vf)
    { type: "vf", question: "Un escalier bien éclairé réduit les risques de chute, mais si l’on court pour rattraper un retard, l’éclairage seul ne suffit pas à garantir la sécurité.", correct: true },
    { type: "vf", question: "Il est recommandé d’utiliser la rampe uniquement quand on descend un escalier, car en montée elle ne sert pas à la sécurité.", correct: false },
    { type: "vf", question: "Un escalier muni de nez de marche contrastés est totalement sûr, même si on descend en regardant son téléphone.", correct: false },
    { type: "vf", question: "La fatigue en fin de journée augmente le risque de chute, surtout à la descente où l’on a tendance à relâcher son attention.", correct: true },
    { type: "vf", question: "Les chutes en escaliers surviennent principalement dans les escaliers extérieurs mal entretenus (pluie, verglas, feuilles).", correct: false },
    { type: "vf", question: "Porter un objet encombrant dans les escaliers est dangereux même si l’objet est léger.", correct: true },
    { type: "vf", question: "Il est toléré de poser temporairement un sac ou un carton sur une marche, à condition de rester à proximité.", correct: false },
    { type: "vf", question: "On chute plus souvent dans des escaliers que l’on connaît bien, car on baisse sa vigilance.", correct: true },
    { type: "vf", question: "En cas d’évacuation incendie, l’utilisation de l’ascenseur est interdite même si les escaliers sont encombrés.", correct: true },
    { type: "vf", question: "Une seule marche plus haute ou plus basse que les autres peut suffire à provoquer un accident.", correct: true },
    { type: "vf", question: "Descendre un escalier en tenant un café est sans danger si la tasse n’est pas pleine.", correct: false },
    { type: "vf", question: "Une rampe trop large ou trop basse peut être inefficace pour prévenir une chute.", correct: true },
    { type: "vf", question: "Les chaussures de sécurité suppriment le risque de chute dans les escaliers.", correct: false },
    { type: "vf", question: "Le risque de chute dans un escalier est le même que l’on monte ou que l’on descende.", correct: false },
    { type: "vf", question: "Un escalier propre et brillant peut être tout aussi dangereux qu’un escalier sale.", correct: true },
    { type: "vf", question: "Regarder ses pieds en permanence en descendant l’escalier est la meilleure façon d’éviter une chute.", correct: false },
    { type: "vf", question: "En portant un colis volumineux, il vaut mieux descendre de côté pour voir les marches.", correct: false },
    { type: "vf", question: "Un téléphone peut être aussi dangereux qu’une marche cassée lorsqu’il détourne l’attention en escalier.", correct: true },
    { type: "vf", question: "Lorsqu’on aménage un escalier, la largeur, la régularité des marches, l’éclairage et la présence de rampes sont des éléments déterminants pour la sécurité.", correct: true },
    { type: "vf", question: "Il est toujours préférable de descendre deux marches à la fois pour gagner du temps, à condition de bien tenir la rampe.", correct: false },

    // QCM (type: qcm) - QCM simples et complexes
    { 
        type: "qcm", 
        question: "Quelle chaussure est la plus adaptée pour utiliser les escaliers ?", 
        answers: ["Talons hauts", "Tongs", "Chaussures fermées antidérapantes", "Escarpins à plateforme"], 
        correctIndex: 2 
    },
    { 
        type: "qcm", 
        question: "Quelle est la 1ère chose à vérifier avant d’utiliser un escalier ?", 
        answers: ["Qu’il soit libre d’obstacles", "Que quelqu’un vous regarde", "Que la peinture soit sèche", "Si l'ascenseur est en panne"], 
        correctIndex: 0 
    },
    { 
        type: "qcm", 
        question: "Quelle est la meilleure façon de transporter un objet ?", 
        answers: ["Les deux mains occupées", "Une main libre pour la rampe", "Sur la tête", "En le faisant glisser sur la rampe"], 
        correctIndex: 1 
    },
    { 
        type: "qcm", 
        question: "Quelle conduite adopter si la lumière est éteinte ?", 
        answers: ["Continuer prudemment", "Allumer la lumière", "Utiliser son téléphone en marchant", "Faire demi-tour en courant"], 
        correctIndex: 1 
    },
    { 
        type: "qcm", 
        question: "Un collègue porte une grosse boîte qui cache sa vue :", 
        answers: ["Le dépasser rapidement", "Attendre ou proposer de l’aider", "Le suivre de près", "L'encourager à courir"], 
        correctIndex: 1 
    },
    { 
        type: "qcm", 
        question: "Que faire si un escalier est mouillé ?", 
        answers: ["Descendre vite pour ne pas glisser", "Ignorer et continuer", "Ralentir, signaler le danger, et chercher à nettoyer", "Se mettre à courir"], 
        correctIndex: 2 
    },
    { 
        type: "qcm", 
        question: "Quelle est la bonne posture pour la sécurité dans un escalier ?", 
        answers: ["Regarder son téléphone", "Regarder devant soi", "Regarder ses pieds en permanence", "Descendre de côté"], 
        correctIndex: 1 
    },
    { 
        type: "qcm", 
        question: "Quand est-il le plus risqué d’utiliser les escaliers ?", 
        answers: ["Fatigue / inattention", "Juste après le repas", "En matinée", "En montant, sans objet"], 
        correctIndex: 0 
    },
    { 
        type: "qcm", 
        question: "Où placer un objet lourd à stocker ?", 
        answers: ["Dans les escaliers", "Au sol dégagé", "Sur une marche", "Contre la rampe"], 
        correctIndex: 1 
    },
    { 
        type: "qcm", 
        question: "Quel élément de sécurité est indispensable dans la conception d'un escalier ?", 
        answers: ["Rampe", "Tapis décoratif", "Affiche murale de sécurité", "Nez de marche sans contraste"], 
        correctIndex: 0 
    },
    { 
        type: "qcm", 
        question: "Que faire si la rampe est cassée ?", 
        answers: ["Continuer à l’utiliser avec prudence", "Signaler immédiatement l’incident", "Attendre qu’un autre la signale", "Utiliser l'autre côté même s'il n'y a pas de rampe"], 
        correctIndex: 1 
    },
    { 
        type: "qcm", 
        question: "Quelle règle respecter quand on est plusieurs dans les escaliers ?", 
        answers: ["Courir pour doubler", "Tenir sa droite / attendre son tour", "S’asseoir sur une marche pour se reposer", "Ne regarder que ses pieds"], 
        correctIndex: 1 
    },
    { 
        type: "qcm", 
        question: "Dans quel cas faut-il éviter les escaliers (et privilégier l'ascenseur ou l'aide) ?", 
        answers: ["En portant une charge volumineuse", "En montant sans rien", "Avec un collègue", "Si on porte un sac léger"], 
        correctIndex: 0 
    },
    { 
        type: "qcm", 
        question: "Quel est le rôle d’un marquage jaune sur le bord d'une marche ?", 
        answers: ["Décoration", "Signal visuel pour éviter les chutes", "Repère d’entretien", "Indiquer la direction"], 
        correctIndex: 1 
    },
    { 
        type: "qcm", 
        question: "Pourquoi éviter les escaliers glissants (poussière, huile) ?", 
        answers: ["Pour l'esthétique", "Car cela présente un risque accru de chute", "C'est sans conséquence grave", "Car cela abîme les chaussures"], 
        correctIndex: 1 
    },
    { 
        type: "qcm", 
        question: "Tu transportes un colis encombrant et un collègue te propose de l’aider. Quelle est la MEILLEURE solution ?", 
        answers: ["Refuser, car le colis n’est pas très lourd", "Accepter pour avoir les mains libres et sécuriser ton équilibre", "Poser le colis et chercher un autre moyen (ascenseur, chariot)", "Descendre lentement et de côté"], 
        correctIndex: 2 
    },
    { 
        type: "qcm", 
        question: "Tu observes un collègue qui descend en regardant son téléphone. Que fais-tu ?", 
        answers: ["Tu le laisses faire, il est responsable", "Tu l’avertis calmement du risque", "Tu attends qu’il ait fini avant de descendre derrière lui", "Tu te dépêches de le doubler"], 
        correctIndex: 1 
    },
    // QCM complexes transformés en QCM simple (avec la meilleure réponse)
    { 
        type: "qcm", 
        question: "Vous descendez un escalier chargé d’un carton volumineux qui cache votre vue. Quelle est la meilleure conduite ?", 
        answers: ["Avancer lentement en tenant le carton des deux mains", "Tenter de descendre de côté pour voir les marches", "Repartir poser le carton et demander de l'aide ou utiliser un autre moyen", "Descendre le plus vite possible avant de trébucher"], 
        correctIndex: 2 
    },
    { 
        type: "qcm", 
        question: "Vous constatez que plusieurs marches sont légèrement glissantes après le nettoyage. Que faites-vous ?", 
        answers: ["Vous descendez quand même prudemment", "Vous descendez en utilisant les murs pour vous appuyer", "Vous prévenez vos collègues et posez un panneau 'sol glissant'", "Vous attendez que le soleil sèche les marches"], 
        correctIndex: 2 
    },
    { 
        type: "qcm", 
        question: "En montant un escalier très fréquenté, quelle est la règle la plus importante pour la fluidité et la sécurité ?", 
        answers: ["Tenir sa droite", "Utiliser la rampe", "Monter vite pour ne pas ralentir les autres", "Les deux (Tenir sa droite ET Utiliser la rampe)"], 
        correctIndex: 3 
    },
    { 
        type: "qcm", 
        question: "Lors d’une coupure de courant, vous êtes à mi-escaliers. Quelle est la meilleure réaction ?", 
        answers: ["Continuer lentement en vous tenant à la rampe", "Utiliser la lampe de votre téléphone et continuer", "Remonter calmement jusqu’au palier et attendre des consignes", "S'asseoir et attendre que le courant revienne"], 
        correctIndex: 2 
    },
    { 
        type: "qcm", 
        question: "Vous portez un café et un ordinateur portable dans l’escalier. Quelle option est la plus sécuritaire ?", 
        answers: ["Tenir le café et l'ordinateur dans une main, la rampe dans l'autre", "Mettre l’ordinateur dans un sac et garder une main libre pour la rampe", "Descendre sans la rampe pour avoir les deux mains libres", "Descendre de côté pour une meilleure vue"], 
        correctIndex: 1 
    },
    { 
        type: "qcm", 
        question: "Dans un escalier extérieur verglacé, quelle est la bonne pratique ?", 
        answers: ["Descendre prudemment en tenant la rampe", "Attendre qu’il soit traité (sel/sable) et chercher un autre chemin sûr", "Descendre le plus vite possible", "Utiliser de la neige comme antidérapant"], 
        correctIndex: 1 
    },
    { 
        type: "qcm", 
        question: "Quelle(s) raison(s) explique(nt) le mieux que les chutes surviennent plus souvent à la descente ?", 
        answers: ["La marche est moins haute à la descente", "La vitesse, l'orientation de la vue et la fatigue s'accumulent", "Les escaliers sont souvent plus sales en bas qu'en haut", "On est souvent moins pressé en montant"], 
        correctIndex: 1 
    },
    { 
        type: "qcm", 
        question: "Tu accompagnes un visiteur qui porte des chaussures glissantes. Quelle est ta meilleure action ?", 
        answers: ["Lui rappeler de tenir la rampe et d’avancer lentement", "Lui proposer un ascenseur si disponible", "Lui proposer une paire de sur-chaussures ou de l'aide", "Toutes ces actions sont de bonnes actions de prévention"], 
        correctIndex: 3 
    },
    { 
        type: "qcm", 
        question: "Quelle combinaison rend un escalier particulièrement dangereux ?", 
        answers: ["Marche régulière et bon éclairage", "Marche irrégulière, manque d’éclairage, absence de rampe et sol glissant", "Rampe en métal et absence de nez de marche", "Un escalier en bois ciré"], 
        correctIndex: 1 
    },
    { 
        type: "qcm", 
        question: "Lors d’une évacuation incendie, quel comportement est le plus sûr ?", 
        answers: ["Descendre vite pour gagner du temps", "Tenir la rampe, garder le calme et suivre le flux", "Utiliser l’ascenseur si les escaliers sont encombrés", "S'arrêter pour s'assurer que tout le monde est là"], 
        correctIndex: 1 
    },
];

let questions = []; // Contient les questions mélangées
let currentQuestionIndex = 0;
const answerPrefixes = ['Vrai', 'Faux']; 


/**
 * Mélange le tableau de questions pour qu'elles apparaissent aléatoirement.
 * @param {Array} array Le tableau à mélanger (algorithme de Fisher-Yates).
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


/**
 * Change la source de la vidéo et la démarre.
 * @param {HTMLVideoElement} videoEl L'élément vidéo.
 * @param {string} newSrc Le chemin du nouveau fichier vidéo.
 */
function setVideoSourceAndPlay(videoEl, newSrc) {
    if (videoEl.querySelector('source').getAttribute('src') !== newSrc) {
        videoEl.querySelector('source').setAttribute('src', newSrc);
        videoEl.load();
    }
    if (videoEl.ended) videoEl.currentTime = 0;
    videoEl.play().catch(() => {});
}

// FONCTION MODIFIÉE : pour valider la réponse du joueur qui a buzzé
function validateAnswer(playerIndex, answerIndex) {
    if (buzzedPlayer === playerIndex) {
        const currentData = questions[currentQuestionIndex];
        let isCorrect = false;

        if (currentData.type === 'vf') {
            // Logique VRAI/FAUX : answerIndex 0 ('1') est VRAI, 1 ('2') est FAUX
            isCorrect = (answerIndex === 0 && currentData.correct) || (answerIndex === 1 && !currentData.correct);
        } else if (currentData.type === 'qcm') {
            // Logique QCM : answerIndex (0-3) doit correspondre à correctIndex
            isCorrect = answerIndex === currentData.correctIndex;
        }

        const videoEl = videos[playerIndex].video;

        if (isCorrect) {
            // ✅ BONNE RÉPONSE
            setVideoSourceAndPlay(videoEl, VIDEO_UP);
            updateCount(playerIndex, true);
            
            const phrase = getRandomPhrase(goodAnswerPhrases);
            showWinnerPopup(`✅ Joueur ${playerIndex + 1}: ${phrase} (+1 étage)`);

        } else {
            // ❌ MAUVAISE RÉPONSE
            setVideoSourceAndPlay(videoEl, VIDEO_DOWN);
            
            const phrase = getRandomPhrase(wrongAnswerPhrases);
            showWinnerPopup(`❌ Joueur ${playerIndex + 1}: ${phrase} Question terminée.`);
        }

        // On passe à la question suivante après 2 secondes (durée de la pop-up)
        setTimeout(nextQuestion, 2000); 
    }
}


// FONCTION MODIFIÉE : pour afficher VRAI/FAUX ou QCM dynamiquement SANS les numéros de touche
function displayQuestion() {
    answerOptionsContainer.innerHTML = ''; 
    buzzedPlayer = null; 
    isQuestionActive = true; 

    if (currentQuestionIndex < questions.length) {
        const currentData = questions[currentQuestionIndex];
        
        questionDisplay.textContent = currentData.question;
        
        const options = currentData.type === 'vf' ? 
            ['Vrai', 'Faux'] : 
            currentData.answers;

        // Affichage des options (VRAI/FAUX ou QCM)
        options.forEach((answer, index) => {
            const answerEl = document.createElement('div');
            answerEl.className = 'answer-option';
            answerEl.id = `answer-option-${index}`;
            // Affiche uniquement le texte de l'option (sans l'instruction de touche)
            answerEl.textContent = `${answer}`; 
            answerOptionsContainer.appendChild(answerEl);
        });
        
        // Ajuster la grille CSS pour la mise en page
        answerOptionsContainer.style.gridTemplateColumns = currentData.type === 'vf' ? '1fr 1fr' : '1fr 1fr'; 

    } else {
        questionDisplay.textContent = "FIN : Plus de questions disponibles !";
        isQuestionActive = false; 
        answerOptionsContainer.style.opacity = 0; 
    }
}

// Fonction pour passer à la question suivante
function nextQuestion() {
    isQuestionActive = false; 

    if (currentQuestionIndex < questions.length) { 
        questionDisplay.style.opacity = 0;
        answerOptionsContainer.style.opacity = 0; 
        
        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
            questionDisplay.style.opacity = 1;
            answerOptionsContainer.style.opacity = 1; 
        }, 300);
    }
}

// Afficher le popup central
function showWinnerPopup(text) {
    popup.textContent = text;
    popup.classList.add('show');
    // Le délai est de 2000 ms (2 secondes).
    setTimeout(() => popup.classList.remove('show'), 2000); 
}

// Fonction de mise à jour du compteur
function updateCount(playerIndex, isQuizWin = false) {
    const videoData = videos[playerIndex];
    
    if (isQuizWin) { 
        videoData.clickCount += 1;
    } 

    videoData.countEl.textContent = videoData.clickCount;
    
    if (videoData.clickCount >= 10 && !winnerDeclared) {
        winnerDeclared = true;
        showWinnerPopup(`🏆 Joueur ${playerIndex + 1} est arrivé premier !`);
        isQuestionActive = false; 
    }
}

// Création des 8 vidéos
keys.forEach((key, index) => {
    const section = document.createElement('div');
    section.className = 'video-card';
    section.innerHTML = `
        <div class="label">Joueur ${index + 1}</div>
        <video id="video${index}" preload="metadata" playsinline webkit-playsinline>
            <source src="${VIDEO_UP}" type="video/mp4">
        </video>
        <div class="counter">Étage = <span id="count${index}">0</span></div>
    `;
    videosContainer.appendChild(section);

    const videoEl = section.querySelector('video');
    const countEl = section.querySelector(`#count${index}`);
    let clickCount = 0;

    videoEl.addEventListener('click', () => {
        if (!isQuestionActive) {
            if (videoEl.paused || videoEl.ended) {
                videoEl.play().catch(() => {});
            } else {
                videoEl.pause();
            }
        }
    });

    videos.push({ key, video: videoEl, clickCount, countEl, playerIndex: index });
});

// Contrôle via clavier
window.addEventListener('keydown', (e) => {
    const pressedKey = e.key.toLowerCase();
    const videoObj = videos.find(v => v.key === pressedKey);
    
    // 1. Bouton "Suivant" (N)
    if (pressedKey === 'n') {
        e.preventDefault();
        if (buzzedPlayer !== null) {
            showWinnerPopup(`⏳ Question suivante. Joueur ${buzzedPlayer + 1} n'a pas répondu à temps.`);
        }
        nextQuestion();
        return;
    }
    
    // 2. Boutons de Réponse (1, 2, 3, 4) 
    const answerKeys = ['1', '2', '3', '4']; 
    const answerIndex = answerKeys.indexOf(pressedKey); // 0, 1, 2, or 3
    
    if (answerIndex !== -1 && buzzedPlayer !== null) {
        e.preventDefault();
        validateAnswer(buzzedPlayer, answerIndex);
        return;
    }

    // 3. Boutons de Buzz (a, z, e, r, t, y, u, i)
    if (videoObj && isQuestionActive && buzzedPlayer === null) {
        e.preventDefault();
        
        // C'est le BUZZ !
        buzzedPlayer = videoObj.playerIndex;
        isQuestionActive = false; 
        
        // La question affiche maintenant les options pour V/F ou QCM
        showWinnerPopup(`🚨 Joueur ${buzzedPlayer + 1} a buzzé ! C'est à lui de répondre !`);

        const currentQ = questions[currentQuestionIndex];
        // On conserve l'instruction de touche DANS le popup pour que les joueurs sachent quelle touche utiliser.
        const answerHelp = currentQ.type === 'vf' ? '(1 = Vrai, 2 = Faux)' : '(1, 2, 3 ou 4)';
        questionDisplay.textContent = `${currentQ.question} (Joueur ${buzzedPlayer + 1} répond ${answerHelp})`;
    } 
});

// Initialisation : Mélange les questions au démarrage
window.onload = () => {
    questions = [...allQuestions]; // Copie toutes les questions
    shuffleArray(questions);       // Mélange la copie
    displayQuestion();
};