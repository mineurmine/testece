// script.js

// NOUVEAU : Ajout de 'o' et 'p' pour les Joueurs 9 et 10
const keys = 'azertyuiop'.split(''); 
const videosContainer = document.getElementById('videos-container');
const player9Container = document.getElementById('player-9-container'); // NOUVEAU
const player10Container = document.getElementById('player-10-container'); // NOUVEAU
const popup = document.getElementById('winner-popup');
const questionDisplay = document.getElementById('current-question');
const answerOptionsContainer = document.getElementById('answer-options'); 
const videos = [];
let winnerDeclared = false; 

let buzzedPlayer = null; 
let isQuestionActive = false; // Initialisé à FALSE pour le délai de démarrage
let isAwaitingAnswer = false; 
// NOUVEAU: Ajout pour gérer l'état du compte à rebours
let isCountingDown = false; 


// Définition des sources de vidéo
const VIDEO_UP = "animeup.mp4"; // Vidéo de progression (bonne réponse)
const VIDEO_DOWN = "animebas.mp4"; // Vidéo de perte (mauvaise réponse)

// LISTES DE PHRASES ALÉATOIRES (non modifiées pour la concision)
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
// TOUTES LES QUESTIONS (Mix Vrai/Faux et QCM) - (non modifiées)
// =================================================================
const allQuestions = [
    // Vrai/Faux version simple (type: vf)
    { type: "vf", question: "Tenir la rampe réduit le risque de chute?", correct: true },
    { type: "vf", question: "Descendre les escaliers en courant est plus dangereux que de les monter vite?", correct: true },
    { type: "vf", question: "Pour aller plus vite, je peux monter deux marches à la fois lorsque je tiens la rampe sans augmenter mon risque de chute?", correct: false },
    { type: "vf", question: "Les chutes dans les escaliers sont l’une des premières causes d’accident du travail?", correct: true },
    { type: "vf", question: "Porter un gros objet qui cache la vue dans les escaliers augmente le risque de chute?", correct: true },
    { type: "vf", question: "Marcher en talon dans un escalier est sans danger?", correct: false },
    { type: "vf", question: "Une rampe doit être présente dès 3 marches selon les normes courantes?", correct: true },
    { type: "vf", question: "Un escalier mal éclairé est un facteur de risque?", correct: true },
    { type: "vf", question: "Regarder son téléphone en descendant les escaliers ne présente aucun danger?", correct: false },
    { type: "vf", question: "Il est recommandé de descendre en posant uniquement la pointe des pieds?", correct: false },
    { type: "vf", question: "Emprunter un escalier qui vient d’être laver ne présente pas plus de risque que d’habitude?", correct: false },
    { type: "vf", question: "Monter un escalier en discutant avec un collègue distrait moins que le téléphone?", correct: false },
    { type: "vf", question: "Les chutes d’escaliers concernent surtout les jeunes?", correct: false },
    { type: "vf", question: "Les escaliers doivent avoir un contraste visuel clair sur la première et la dernière marche?", correct: true },
    { type: "vf", question: "Poser des objets temporaires sur un escalier (sac, boîte) est sans risque?", correct: false },
    { type: "vf", question: "Un escalier trop étroit augmente le risque de collision entre collègues?", correct: true },
    { type: "vf", question: "Les mains courantes doivent idéalement être présentes des deux côtés d’un escalier?", correct: true },
    { type: "vf", question: "Monter un escalier en tenant un parapluie ouvert ne présente pas de danger?", correct: false },
    { type: "vf", question: "Les escaliers doivent toujours être libres de tout stockage temporaire?", correct: true },
    { type: "vf", question: "Le marquage antidérapant sur le bord de marche est uniquement décoratif?", correct: false },
    { type: "vf", question: "Monter un escalier en discutant au téléphone est aussi risqué que de descendre en regardant un téléphone?", correct: true },
    { type: "vf", question: "Une rampe en métal froide en hiver peut être un facteur indirect de chute (on hésite à la tenir)?", correct: true },
    { type: "vf", question: "S’appuyer uniquement sur le mur est aussi sécuritaire que d’utiliser la rampe?", correct: false },
    { type: "vf", question: "Les accidents dans les escaliers surviennent le plus souvent à la montée?", correct: false },
    { type: "vf", question: "Un escalier extérieur doit être entretenu contre la pluie, le verglas et les feuilles mortes?", correct: true },

    // Vrai/Faux version complexe (type: vf)
    { type: "vf", question: "Un escalier bien éclairé réduit les risques de chute, mais si l’on court pour rattraper un retard, l’éclairage seul ne suffit pas à garantir la sécurité?", correct: true },
    { type: "vf", question: "Il est recommandé d’utiliser la rampe uniquement quand on descend un escalier, car en montée elle ne sert pas à la sécurité?", correct: false },
    { type: "vf", question: "Un escalier muni de nez de marche contrastés est totalement sûr, même si on descend en regardant son téléphone?", correct: false },
    { type: "vf", question: "La fatigue en fin de journée augmente le risque de chute, surtout à la descente où l’on a tendance à relâcher son attention?", correct: true },
    { type: "vf", question: "Les chutes en escaliers surviennent principalement dans les escaliers extérieurs mal entretenus (pluie, verglas, feuilles)?", correct: false },
    { type: "vf", question: "Porter un objet encombrant dans les escaliers est dangereux même si l’objet est léger?", correct: true },
    { type: "vf", question: "Il est toléré de poser temporairement un sac ou un carton sur une marche, à condition de rester à proximité?", correct: false },
    { type: "vf", question: "On chute plus souvent dans des escaliers que l’on connaît bien, car on baisse sa vigilance?", correct: true },
    { type: "vf", question: "En cas d’évacuation incendie, l’utilisation de l’ascenseur est interdite même si les escaliers sont encombrés?", correct: true },
    { type: "vf", question: "Une seule marche plus haute ou plus basse que les autres peut suffire à provoquer un accident?", correct: true },
    { type: "vf", question: "Descendre un escalier en tenant un café est sans danger si la tasse n’est pas pleine?", correct: false },
    { type: "vf", question: "Une rampe trop large ou trop basse peut être inefficace pour prévenir une chute?", correct: true },
    { type: "vf", question: "Les chaussures de sécurité suppriment le risque de chute dans les escaliers?", correct: false },
    { type: "vf", question: "Le risque de chute dans un escalier est le même que l’on monte ou que l’on descende?", correct: false },
    { type: "vf", question: "Un escalier propre et brillant peut être tout aussi dangereux qu’un escalier sale?", correct: true },
    { type: "vf", question: "Regarder ses pieds en permanence en descendant l’escalier est la meilleure façon d’éviter une chute?", correct: false },
    { type: "vf", question: "En portant un colis volumineux, il vaut mieux descendre de côté pour voir les marches?", correct: false },
    { type: "vf", question: "Un téléphone peut être aussi dangereux qu’une marche cassée lorsqu’il détourne l’attention en escalier?", correct: true },
    { type: "vf", question: "Lorsqu’on aménage un escalier, la largeur, la régularité des marches, l’éclairage et la présence de rampes sont des éléments déterminants pour la sécurité?", correct: true },
    { type: "vf", question: "Il est toujours préférable de descendre deux marches à la fois pour gagner du temps, à condition de bien tenir la rampe?", correct: false },

    // QCM (type: qcm) - QCM simples et complexes
    {
        type: "qcm",
        question: "Quelle chaussure est la plus adaptée pour utiliser les escaliers?",
        answers: ["Escarpins à plateforme", "Chaussures fermées antidérapantes", "Tongs", "Talons hauts"],
        correctIndex: 1
    },
    {
        type: "qcm",
        question: "Quelle est la 1ère chose à vérifier avant d’utiliser un escalier?",
        answers: ["Si l'ascenseur est en panne", "Que la peinture soit sèche", "Que quelqu’un vous regarde", "Qu’il soit libre d’obstacles"],
        correctIndex: 3
    },
    {
        type: "qcm",
        question: "Quelle est la meilleure façon de transporter un objet?",
        answers: ["En le faisant glisser sur la rampe", "Sur la tête", "Une main libre pour la rampe", "Les deux mains occupées"],
        correctIndex: 2
    },
    {
        type: "qcm",
        question: "Quelle conduite adopter si la lumière est éteinte?",
        answers: ["Faire demi-tour en courant", "Utiliser son téléphone en marchant", "Allumer la lumière", "Continuer prudemment"],
        correctIndex: 2
    },
    {
        type: "qcm",
        question: "Un collègue porte une grosse boîte qui cache sa vue?",
        answers: ["L'encourager à courir", "Le suivre de près", "Attendre ou proposer de l’aider", "Le dépasser rapidement"],
        correctIndex: 2
    },
    {
        type: "qcm",
        question: "Que faire si un escalier est mouillé?",
        answers: ["Se mettre à courir", "Ralentir, signaler le danger, et chercher à nettoyer", "Ignorer et continuer", "Descendre vite pour ne pas glisser"],
        correctIndex: 1
    },
    {
        type: "qcm",
        question: "Quelle est la bonne posture pour la sécurité dans un escalier?",
        answers: ["Descendre de côté", "Regarder ses pieds en permanence", "Regarder devant soi", "Regarder son téléphone"],
        correctIndex: 2
    },
    {
        type: "qcm",
        question: "Quand est-il le plus risqué d’utiliser les escaliers?",
        answers: ["En montant, sans objet", "En matinée", "Juste après le repas", "Fatigue / inattention"],
        correctIndex: 3
    },
    {
        type: "qcm",
        question: "Où placer un objet lourd à stocker?",
        answers: ["Contre la rampe", "Sur une marche", "Au sol dégagé", "Dans les escaliers"],
        correctIndex: 2
    },
    {
        type: "qcm",
        question: "Quel élément de sécurité est indispensable dans la conception d'un escalier?",
        answers: ["Nez de marche sans contraste", "Affiche murale de sécurité", "Tapis décoratif", "Rampe"],
        correctIndex: 3
    },
    {
        type: "qcm",
        question: "Que faire si la rampe est cassée?",
        answers: ["Utiliser l'autre côté même s'il n'y a pas de rampe", "Attendre qu’un autre la signale", "Signaler immédiatement l’incident", "Continuer à l’utiliser avec prudence"],
        correctIndex: 2
    },
    {
        type: "qcm",
        question: "Quelle règle respecter quand on est plusieurs dans les escaliers?",
        answers: ["Ne regarder que ses pieds", "S’asseoir sur une marche pour se reposer", "Tenir sa droite / attendre son tour", "Courir pour doubler"],
        correctIndex: 2
    },
    {
        type: "qcm",
        question: "Dans quel cas faut-il éviter les escaliers (et privilégier l'ascenseur ou l'aide)?",
        answers: ["Si on porte un sac léger", "Avec un collègue", "En montant sans rien", "En portant une charge volumineuse"],
        correctIndex: 3
    },
    {
        type: "qcm",
        question: "Quel est le rôle d’un marquage jaune sur le bord d'une marche?",
        answers: ["Indiquer la direction", "Repère d’entretien", "Signal visuel pour éviter les chutes", "Décoration"],
        correctIndex: 2
    },
    {
        type: "qcm",
        question: "Pourquoi éviter les escaliers glissants (poussière, huile)?",
        answers: ["Car cela abîme les chaussures", "C'est sans conséquence grave", "Car cela présente un risque accru de chute", "Pour l'esthétique"],
        correctIndex: 2
    },
    {
        type: "qcm",
        question: "Tu transportes un colis encombrant et un collègue te propose de l’aider. Quelle est la MEILLEURE solution?",
        answers: ["Descendre lentement et de côté", "Poser le colis et chercher un autre moyen (ascenseur, chariot)", "Accepter pour avoir les mains libres et sécuriser ton équilibre", "Refuser, car le colis n’est pas très lourd"],
        correctIndex: 1
    },
    {
        type: "qcm",
        question: "Tu observes un collègue qui descend en regardant son téléphone. Que fais-tu?",
        answers: ["Tu te dépêches de le doubler", "Tu attends qu’il ait fini avant de descendre derrière lui", "Tu l’avertis calmement du risque", "Tu le laisses faire, il est responsable"],
        correctIndex: 2
    },
    // QCM complexes transformés en QCM simple (avec la meilleure réponse)
    {
        type: "qcm",
        question: "Vous descendez un escalier chargé d’un carton volumineux qui cache votre vue. Quelle est la meilleure conduite?",
        answers: ["Descendre le plus vite possible avant de trébucher", "Repartir poser le carton et demander de l'aide ou utiliser un autre moyen", "Tenter de descendre de côté pour voir les marches", "Avancer lentement en tenant le carton des deux mains"],
        correctIndex: 1
    },
    {
        type: "qcm",
        question: "Vous constatez que plusieurs marches sont légèrement glissantes après le nettoyage. Que faites-vous?",
        answers: ["Vous attendez que le soleil sèche les marches", "Vous prévenez vos collègues et posez un panneau 'sol glissant'", "Vous descendez en utilisant les murs pour vous appuyer", "Vous descendez quand même prudemment"],
        correctIndex: 1
    },
    {
        type: "qcm",
        question: "En montant un escalier très fréquenté, quelle est la règle la plus importante pour la fluidité et la sécurité?",
        answers: ["Les deux (Tenir sa droite ET Utiliser la rampe)", "Monter vite pour ne pas ralentir les autres", "Utiliser la rampe", "Tenir sa droite"],
        correctIndex: 0
    },
    {
        type: "qcm",
        question: "Lors d’une coupure de courant, vous êtes à mi-escaliers. Quelle est la meilleure réaction?",
        answers: ["S'asseoir et attendre que le courant revienne", "Remonter calmement jusqu’au palier et attendre des consignes", "Utiliser la lampe de votre téléphone et continuer", "Continuer lentement en vous tenant à la rampe"],
        correctIndex: 1
    },
    {
        type: "qcm",
        question: "Vous portez un café et un ordinateur portable dans l’escalier. Quelle option est la plus sécuritaire?",
        answers: ["Descendre de côté pour une meilleure vue", "Descendre sans la rampe pour avoir les deux mains libres", "Mettre l’ordinateur dans un sac et garder une main libre pour la rampe", "Tenir le café et l'ordinateur dans une main, la rampe dans l'autre"],
        correctIndex: 2
    },
    {
        type: "qcm",
        question: "Dans un escalier extérieur verglacé, quelle est la bonne pratique?",
        answers: ["Utiliser de la neige comme antidérapant", "Descendre le plus vite possible", "Attendre qu’il soit traité (sel/sable) et chercher un autre chemin sûr", "Descendre prudemment en tenant la rampe"],
        correctIndex: 2
    },
    {
        type: "qcm",
        question: "Quelle(s) raison(s) explique(nt) le mieux que les chutes surviennent plus souvent à la descente?",
        answers: ["On est souvent moins pressé en montant", "Les escaliers sont souvent plus sales en bas qu'en haut", "La vitesse, l'orientation de la vue et la fatigue s'accumulent", "La marche est moins haute à la descente"],
        correctIndex: 2
    },
    {
        type: "qcm",
        question: "Tu accompagnes un visiteur qui porte des chaussures glissantes. Quelle est ta meilleure action?",
        answers: ["Toutes ces actions sont de bonnes actions de prévention", "Lui proposer une paire de sur-chaussures ou de l'aide", "Lui proposer un ascenseur si disponible", "Lui rappeler de tenir la rampe et d’avancer lentement"],
        correctIndex: 1
    },
    {
        type: "qcm",
        question: "Quelle combinaison rend un escalier particulièrement dangereux?",
        answers: ["Un escalier en bois ciré", "Rampe en métal et absence de nez de marche", "Marche irrégulière, manque d’éclairage, absence de rampe et sol glissant", "Marche régulière et bon éclairage"],
        correctIndex: 2
    },
    {
        type: "qcm",
        question: "Lors d’une évacuation incendie, quel comportement est le plus sûr?",
        answers: ["S'arrêter pour s'assurer que tout le monde est là", "Utiliser l’ascenseur si les escaliers sont encombrés", "Tenir la rampe, garder le calme et suivre le flux", "Descendre vite pour gagner du temps"],
        correctIndex: 2
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
    // Vérifie que le joueur qui répond est bien celui qui a buzzé ET qu'on attend une réponse
    if (buzzedPlayer === playerIndex && isAwaitingAnswer) {
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
            // ✅ BONNE RÉPONSE : Le joueur monte d'un étage
            setVideoSourceAndPlay(videoEl, VIDEO_UP);
            updateCount(playerIndex, true);
            
            const phrase = getRandomPhrase(goodAnswerPhrases);
            showWinnerPopup(`✅ Joueur ${playerIndex + 1}: ${phrase} (+1 étage)`);

            // Préparation pour passer à la question suivante (déclenché par la touche 's')
            isQuestionActive = false; // Bloque les buzz pendant le message de bonne réponse
            isAwaitingAnswer = false; // Finit l'attente de réponse
            buzzedPlayer = null; // Libère le joueur buzzé
            

} else {
            // ❌ MAUVAISE RÉPONSE : Le joueur reste où il est, les autres peuvent re-buzzer.
            setVideoSourceAndPlay(videoEl, VIDEO_DOWN); // Animation de perte
            
            const phrase = getRandomPhrase(wrongAnswerPhrases);
            showWinnerPopup(`❌ Joueur ${playerIndex + 1}: ${phrase}`);

            // Remettre la question en mode "buzz" pour les autres joueurs (y compris celui qui vient de rater)
            buzzedPlayer = null; // Libère le joueur buzzé
            isAwaitingAnswer = false; // Finit l'attente de réponse
            isQuestionActive = true; // Réactive le buzz pour la même question
            
            // Réafficher la question normalement
            displayQuestion(); 
            questionDisplay.textContent = `${questions[currentQuestionIndex].question} (BUZZ à nouveau)`;
            // point de repere pour gemini pour l'ajoute des question
            
            // 🚀 AJOUT POUR RÉAFFICHAGE DES OPTIONS APRÈS MAUVAISE RÉPONSE
            answerOptionsContainer.style.opacity = 1; // Rends les options de réponse visibles
        }
    }
}


// NOUVELLE FONCTION: Met à jour l'affichage du compte à rebours
function updateCountdownDisplay(count) {
    if (count > 0) {
        questionDisplay.textContent = `⏳ Préparez-vous ! La question arrive dans : ${count}...`;
    } else {
        // Le compte à rebours est terminé, affiche la question
        displayQuestion(); 
    }
}


// NOUVELLE FONCTION: Démarre le compte à rebours
function startQuestionCountdown() {
    if (winnerDeclared || isCountingDown) return; 

    isCountingDown = true;
    questionDisplay.style.opacity = 1;
    answerOptionsContainer.style.opacity = 0;
    
    let count = 5;
    updateCountdownDisplay(count);
    
    const countdownInterval = setInterval(() => {
        count--;
        updateCountdownDisplay(count);
        
        if (count === 0) {
            clearInterval(countdownInterval);
            isCountingDown = false; // Le compte à rebours est terminé
            isQuestionActive = true; // Permet de buzzer
            answerOptionsContainer.style.opacity = 1; // Affiche les options de réponse
        }
    }, 1000);
}


// FONCTION MODIFIÉE : La fonction "displayQuestion" est maintenant le point d'arrivée
// Affiche VRAI/FAUX ou QCM dynamiquement SANS les numéros de touche
function displayQuestion() {
    answerOptionsContainer.innerHTML = ''; 
    buzzedPlayer = null; 
    isAwaitingAnswer = false; 
    isQuestionActive = true; // Le buzz est maintenant activé ICI (après le compte à rebours)

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
            // Ajout du numéro de touche pour plus de clarté
            answerEl.textContent = `${index + 1} - ${answer}`; 
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


// FONCTION MODIFIÉE : Passe à la question suivante en utilisant le compte à rebours
function nextQuestion() {
    isQuestionActive = false; 
    isAwaitingAnswer = false; 

    if (currentQuestionIndex < questions.length) { 
        currentQuestionIndex++;
        // Si on a encore des questions, démarrer le compte à rebours
        if (currentQuestionIndex < questions.length) {
            startQuestionCountdown(); 
        } else {
            // Fin du jeu
            questionDisplay.textContent = "FIN : Plus de questions disponibles !";
            answerOptionsContainer.style.opacity = 0; 
        }
    }
}

function startscrren() {
    questionDisplay.textContent = `À vos buzzers, la partie va débuter ! `;

}
// Afficher le popup central
function showWinnerPopup(text) {
    popup.textContent = text;
    popup.classList.add('show');
    // Le délai est réduit à 2 secondes (ou ce que vous voulez) car le défilement n'est plus automatique
    setTimeout(() => popup.classList.remove('show'), 6000); 
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
        isAwaitingAnswer = false; // Arrête tout
    }
}

// Création des 10 vidéos (non modifiée)
keys.forEach((key, index) => {
    const section = document.createElement('div');
    const playerNumber = index + 1;
    
    // Détermination du conteneur et de la classe CSS
    if (playerNumber <= 8) {
        // Joueurs 1-8 vont dans le conteneur principal (4x2)
        section.className = 'video-card';
        videosContainer.appendChild(section);
    } else {
        // Joueurs 9 et 10 vont dans les conteneurs latéraux
        section.className = 'side-player-card'; 
        if (playerNumber === 9) {
            player9Container.appendChild(section);
        } else if (playerNumber === 10) {
            player10Container.appendChild(section);
        }
    }

    section.innerHTML = `
        <div class="label">Joueur ${playerNumber}</div> 
        <video id="video${index}" preload="metadata" playsinline webkit-playsinline>
            <source src="${VIDEO_UP}" type="video/mp4">
        </video>
        <div class="counter">Étage = <span id="count${index}">0</span></div>
    `;

    const videoEl = section.querySelector('video');
    const countEl = section.querySelector(`#count${index}`);
    let clickCount = 0;

    videoEl.addEventListener('click', () => {
        if (!isQuestionActive && !isAwaitingAnswer && !isCountingDown) { 
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
    
    // 1. Bouton "Suivant" (S) - NOUVELLE RÈGLE
    if (pressedKey === 's') {
        e.preventDefault();
        // Permet de passer à la question suivante uniquement si personne n'a buzzé ET qu'on n'est pas déjà en compte à rebours
        if (buzzedPlayer === null && !isCountingDown) {
             showWinnerPopup(`⏩ Question suivante!`);
             nextQuestion();
        } else {
            // Si un joueur a buzzé/répondu ou si on est en décompte
            showWinnerPopup(`⚠️ Veuillez attendre la réponse, le buzz, ou la fin du décompte !`);
        }
        return;
    }
    
    // 2. Boutons de Réponse (1, 2, 3, 4) 
    const answerKeys = ['1', '2', '3', '4']; 
    const answerIndex = answerKeys.indexOf(pressedKey); // 0, 1, 2, or 3
    
    if (answerIndex !== -1 && buzzedPlayer !== null && isAwaitingAnswer) {
        e.preventDefault();
        validateAnswer(buzzedPlayer, answerIndex);
        return;
    }

    // 3. Boutons de Buzz (a, z, e, r, t, y, u, i, o, p)
    if (videoObj && isQuestionActive && buzzedPlayer === null && !isCountingDown) {
        e.preventDefault();
        
        // C'est le BUZZ !
        buzzedPlayer = videoObj.playerIndex;
        isQuestionActive = false; // Bloque les autres buzz
        isAwaitingAnswer = true; // Le jeu attend une réponse (1, 2, 3 ou 4)
        
        const currentQ = questions[currentQuestionIndex];
        const answerHelp = currentQ.type === 'vf' ? '(1 = Vrai, 2 = Faux)' : '(1, 2, 3 ou 4)';
        
        showWinnerPopup(`🚨 Joueur ${buzzedPlayer + 1} a buzzé ! Répondez avec ${answerHelp}`);
        
        // Afficher la question avec l'instruction de réponse (sans les options)
        questionDisplay.textContent = `${currentQ.question} (Joueur ${buzzedPlayer + 1} répond)`;
        
        // Cacher les options de réponse pour le moment (le joueur doit répondre via 1, 2, 3 ou 4)
        answerOptionsContainer.style.opacity = 1; 
    } 
});

// Initialisation : Mélange les questions au démarrage et démarre le compte à rebours de la première question.
window.onload = () => {
    questions = [...allQuestions]; // Copie toutes les questions
    shuffleArray(questions);       // Mélange la copie
    
    // Démarrer le jeu avec le compte à rebours pour la première question
    startscrren();

};  

