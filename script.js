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

// =================================================================
// NOUVEAU: LISTES DE PHRASES ALÉATOIRES
// =================================================================

const goodAnswerPhrases = [
    "On touche bientôt le sommet !",
    "Et une marche de plus, bravo !", 
    "La montée est sûre quand on regarde où on met les pieds !", 
    "Solide comme une rampe !",
    "C’est dans la bonne direction !",
    "Encore quelques marches avant la victoire !",
    "Excellent réflexe, la sécurité te fait grimper !",
    "Bravo, tu restes bien accroché à la rampe de la réussite !",
    "Un pas de plus vers les hauteurs de la prévention !",
    "Tu grimpes comme un pro de la prévention !",
    "Encore une marche et tu touches les nuages !",
    "Le sommet est en vue, garde le rythme !",
    "On ne t’arrête plus, champion de la sécurité !",
    "La rampe est ton amie, et la victoire aussi !",
    "C’est bon, t’as le pied sûr !",
    "Bravo, ta vigilance te fait prendre de la hauteur !",
    "Pas de glissade, que de la réussite !",
    "Excellent réflexe, la prévention te porte vers les sommets !",
    "Tu montes plus vite qu’un ascenseur certifié ISO 45001 !",
];

const wrongAnswerPhrases = [
    "Oups… direction le rez-de-chaussée !",
    "Aïe ! Marche manquée… tu redescends d’un cran !",
    "La précipitation te fait trébucher !",
    "Attention, tu perds l’équilibre !",
    "Retour au point de départ… ça glisse, hein ?",
    "Oh non… on dirait que la rampe t’a échappé !",
    "Un faux pas et te voilà reparti vers le bas !",
    "Oups, la gravité a encore gagné !",
    "Marche arrière activée… doucement cette fois !",
    "Pas de panique, même les meilleurs ratent une marche !",
    "Oups… la marche était plus haute que prévu !",
    "Et voilà, retour express au rez-de-chaussée !",
    "Attention, ça descend plus vite que prévu !",
    "Aïe, la gravité ne pardonne pas !",
    "Tu viens d’inventer la descente en mode toboggan !",
    "Oh oh… une marche ratée, ça pique un peu !",
    "Un faux pas de plus, et c’est la rambarde qui rigole !",
    "Et hop, tu refais connaissance avec le sol !",
    "Redescente non prévue au programme…", 
    "Marche arrière activée ! Essaie encore sans te précipiter !",
];


// NOUVEAU: Fonction pour obtenir une phrase aléatoire
function getRandomPhrase(phraseArray) {
    const index = Math.floor(Math.random() * phraseArray.length);
    return phraseArray[index];
}

// =================================================================

const questions = [
    // ----------------------------------------------------
    // Questions sur l'ÉCLAIRAGE (DMX et Projecteurs)
    // ----------------------------------------------------
    {
        question: "Quel est le nombre maximum de canaux DMX dans un univers standard ?",
        answers: ["128", "256", "512", "1024"],
        correctIndex: 2 
    },
    {
        question: "Quel type de câble est généralement utilisé pour le signal DMX ?",
        answers: ["XLR 3 broches (Micro)", "XLR 5 broches (Spécifique)", "Ethernet Cat5", "Jack 6.35mm"],
        correctIndex: 1 
    },
    {
        question: "À quelle valeur correspond la pleine intensité (100%) d'un canal DMX ?",
        answers: ["0", "127", "255", "511"],
        correctIndex: 2 
    },
    {
        question: "Que signifie 'CMY' dans le contexte de la couleur d'un projecteur motorisé ?",
        answers: ["Cold, Medium, Yellow", "Cyan, Magenta, Yellow", "Color Mixing Yield", "Clear, Matte, Yellow"],
        correctIndex: 1 
    },
    {
        question: "Quel type de projecteur est principalement utilisé pour créer un fond coloré ou un bain de lumière sur une scène ?",
        answers: ["Spot", "Wash", "Beam", "Profile"],
        correctIndex: 1 
    },
    {
        question: "Quel terme désigne un projecteur qui peut changer de position, de couleur et de gobos ?",
        answers: ["Fresnel", "Motorisé (ou Lyre)", "PAR LED", "Projecteur asservi"],
        correctIndex: 1 
    },
    {
        question: "Quelle est la fonction d'un 'Gobo' dans un projecteur ?",
        answers: ["Changer la température de couleur", "Contrôler le zoom", "Projetter un motif ou une forme", "Déplacer la lumière"],
        correctIndex: 2 
    },
    {
        question: "Quel protocole est souvent utilisé pour distribuer plusieurs univers DMX via un câble réseau ?",
        answers: ["MIDI", "Art-Net", "OSC", "SMPTE"],
        correctIndex: 1 
    },
    {
        question: "Dans un kit de gélatines de couleurs, quelle couleur est généralement désignée par la codification CTB ?",
        answers: ["Correction du rouge (Chroma-Temp Blue)", "Correction du bleu (Color Temperature Blue)", "Teinte de bleu", "Bleu clair"],
        correctIndex: 1 
    },
    {
        question: "Quel est l'élément qui permet de projeter une image nette (focus) dans un projecteur de type 'Profile' ?",
        answers: ["Zoom", "Iris", "Lentille plan-convexe", "Volet"],
        correctIndex: 2 
    },
    
    // ----------------------------------------------------
    // Questions sur le SON (Dante et Matériel)
    // ----------------------------------------------------
    {
        question: "Quel protocole permet le transport de signaux audio numériques non compressés sur un réseau IP standard ?",
        answers: ["MIDI", "AES/EBU", "Dante", "ADAT"],
        correctIndex: 2 
    },
    {
        question: "Quelle est la désignation du connecteur réseau le plus couramment utilisé pour l'Audio sur IP (Dante, AVB) ?",
        answers: ["XLR", "Speakon", "RJ45", "USB"],
        correctIndex: 2 
    },
    {
        question: "Quelle alimentation électrique est requise pour le fonctionnement de la majorité des microphones à condensateur ?",
        answers: ["Alimentation fantôme (+48V)", "Piles AA", "Secteur 230V", "Alimentation USB"],
        correctIndex: 0 
    },
    {
        question: "Quelle est l'unité de mesure utilisée pour décrire la pression acoustique (volume sonore) ?",
        answers: ["Hertz (Hz)", "Décibel (dB)", "Ohm (Ω)", "Watt (W)"],
        correctIndex: 1 
    },
    {
        question: "Quel type de microphone est généralement le plus robuste et n'a pas besoin d'alimentation fantôme ?",
        answers: ["Micro à condensateur", "Micro dynamique", "Micro-cravate", "Micro HF"],
        correctIndex: 1 
    },
    {
        question: "Que signifie 'SPL' dans les spécifications d'un haut-parleur ou d'un microphone ?",
        answers: ["Signal Power Level", "Sound Pressure Level", "Speaker Pulse Length", "Spectrum Power Limit"],
        correctIndex: 1 
    },
    {
        question: "Quel composant d'une enceinte de sonorisation reproduit les fréquences les plus aiguës ?",
        answers: ["Woofer", "Tweeter", "Subwoofer", "Mid-range"],
        correctIndex: 1 
    },
    {
        question: "Que doit-on vérifier en priorité avant de brancher une enceinte sur un amplificateur ?",
        answers: ["Sa couleur", "Sa marque", "Son impédance (Ohm)", "Sa hauteur"],
        correctIndex: 2 
    },
    
    // ----------------------------------------------------
    // Questions sur la VIDÉO et la TECHNIQUE SCÉNIQUE
    // ----------------------------------------------------
    {
        question: "Quel type de connecteur est le plus couramment utilisé pour le transport d'un signal vidéo numérique HD non compressé sur de courtes distances ?",
        answers: ["HDMI", "VGA", "SDI", "DisplayPort"],
        correctIndex: 0 
    },
    {
        question: "Quelle fréquence d'images est la plus courante pour la vidéo en Europe ?",
        answers: ["24 fps", "25 fps", "30 fps", "60 fps"],
        correctIndex: 1 
    },
    {
        question: "Que signifie le sigle 'LED' dans le contexte d'un écran ou d'un projecteur ?",
        answers: ["Light Emitting Diode", "Luminous Energy Device", "Linear Electronic Display", "Light Emission Driver"],
        correctIndex: 0 
    },
    {
        question: "Quel terme désigne le rapport entre la largeur et la hauteur d'une image vidéo ?",
        answers: ["Résolution", "Format d'image (Aspect Ratio)", "Fréquence", "Cadence"],
        correctIndex: 1 
    },
    {
        question: "Comment appelle-t-on le grand rideau de fond noir absorbant la lumière, souvent utilisé pour masquer les coulisses ?",
        answers: ["Frise", "Jupe", "Pendrillon", "Cyclorama"],
        correctIndex: 2 
    },
    {
        question: "Quel est le rôle du 'Régisseur Général' sur une production ?",
        answers: ["Créer les lumières", "Gérer le son", "Assurer la coordination technique et la logistique", "Jouer de la musique"],
        correctIndex: 2 
    },
    {
        question: "Quelle norme de sécurité est essentielle pour tout équipement suspendu au-dessus de la scène ou du public ?",
        answers: ["Norme ISO", "Double sécurité (filins, chaînes)", "Norme CE", "Norme IP"],
        correctIndex: 1 
    },
    {
        question: "Quel est l'élément d'une structure scénique (pont, truss) dont la charge maximale est la plus importante ?",
        answers: ["Le palan (moteur)", "L'élingue (câble)", "Le point de levage (moteur)", "La structure complète"],
        correctIndex: 2 
    },
    
    // ----------------------------------------------------
    // Questions COMPLÉMENTAIRES (Sécurité et Divers)
    // ----------------------------------------------------
    {
        question: "Quelle est l'unité de mesure du flux lumineux total émis par une source lumineuse ?",
        answers: ["Candela", "Lux", "Lumen", "Kelvin"],
        correctIndex: 2 
    },
    {
        question: "Quel terme décrit l'interférence électrique audible souvent causée par une boucle de masse dans un système audio ?",
        answers: ["Distorsion", "Larsen", "Sifflement", "Ronflette (Hum)"],
        correctIndex: 3 
    },
    {
        question: "Quel est le code couleur standard pour le fil de terre (masse) dans un câble d'alimentation électrique ?",
        answers: ["Bleu", "Marron", "Vert/Jaune", "Noir"],
        correctIndex: 2 
    },
    {
        question: "Qu'est-ce qu'un 'Patch' dans une console d'éclairage ?",
        answers: ["Un programme préenregistré", "L'assignation des adresses DMX aux canaux de la console", "Un type de projecteur", "Un accessoire de lentille"],
        correctIndex: 1 
    },
    {
        question: "Quel outil utilise-t-on pour vérifier rapidement si un câble DMX ou XLR est fonctionnel ?",
        answers: ["Ohmmètre", "Testeur de câble", "Voltmètre", "Analyseur de spectre"],
        correctIndex: 1 
    },
    {
        question: "Que signifie 'HF' dans le contexte d'un microphone ?",
        answers: ["Haute Fidélité", "Haute Fréquence (sans fil)", "Haute Finesse", "Hyper Fonctionnel"],
        correctIndex: 1 
    }
];
let currentQuestionIndex = 0;
const answerPrefixes = ['A', 'B', 'C', 'D']; 

/**
 * Change la source de la vidéo et la démarre.
 * @param {HTMLVideoElement} videoEl L'élément vidéo.
 * @param {string} newSrc Le chemin du nouveau fichier vidéo.
 */
function setVideoSourceAndPlay(videoEl, newSrc) {
    // Vérifie si la source a changé.
    if (videoEl.querySelector('source').getAttribute('src') !== newSrc) {
        videoEl.querySelector('source').setAttribute('src', newSrc);
        videoEl.load(); // Recharge la vidéo avec la nouvelle source
    }
    
    if (videoEl.ended) videoEl.currentTime = 0;
    videoEl.play().catch(() => {});
}

// FONCTION MODIFIÉE : pour valider la réponse du joueur qui a buzzé
function validateAnswer(playerIndex, answerIndex) {
    if (buzzedPlayer === playerIndex) {
        const currentData = questions[currentQuestionIndex];
        const isCorrect = answerIndex === currentData.correctIndex;
        const videoEl = videos[playerIndex].video;

        if (isCorrect) {
            // ✅ BONNE RÉPONSE
            setVideoSourceAndPlay(videoEl, VIDEO_UP);
            updateCount(playerIndex, true);
            
            // NOUVEAU: Afficher une phrase aléatoire pour une bonne réponse
            const phrase = getRandomPhrase(goodAnswerPhrases);
            showWinnerPopup(`✅ Joueur ${playerIndex + 1}: ${phrase} (+1 étage)`);

        } else {
            // ❌ MAUVAISE RÉPONSE
            setVideoSourceAndPlay(videoEl, VIDEO_DOWN);
            
            // NOUVEAU: Afficher une phrase aléatoire pour une mauvaise réponse
            const phrase = getRandomPhrase(wrongAnswerPhrases);
            showWinnerPopup(`❌ Joueur ${playerIndex + 1}: ${phrase} Question terminée.`);
        }

        // On passe à la question suivante après un petit délai
        setTimeout(nextQuestion, 2000); 
    }
}




// Fonction pour afficher la question ET les réponses
function displayQuestion() {
    answerOptionsContainer.innerHTML = ''; 
    buzzedPlayer = null; 
    isQuestionActive = true; 

    if (currentQuestionIndex < questions.length) {
        const currentData = questions[currentQuestionIndex];
        
        questionDisplay.textContent = currentData.question;
        
        currentData.answers.forEach((answer, index) => {
            const answerEl = document.createElement('div');
            answerEl.className = 'answer-option';
            answerEl.id = `answer-option-${index}`;
            answerEl.textContent = `${answerPrefixes[index]}. ${answer}`; 
            answerOptionsContainer.appendChild(answerEl);
        });

    } else {
        questionDisplay.textContent = "FIN : Plus de questions disponibles !";
        isQuestionActive = false; 
    }
}

// Fonction pour passer à la question suivante
function nextQuestion() {
    // Désactiver le buzz pour la transition
    isQuestionActive = false; 

    if (currentQuestionIndex < questions.length) { 
        // Appliquer une animation de fondu
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
    setTimeout(() => popup.classList.remove('show'), 5000); 
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
    // NOTE: La balise <video> contient une balise <source> pour faciliter le changement de source par JS
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

    // Le clic sur la vidéo ne sert qu'à PAUSER/JOUER manuellement
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
            // NOUVEAU: Message pour le passage de question
            showWinnerPopup(`⏳ Question suivante. Joueur ${buzzedPlayer + 1} n'a pas répondu à temps.`);
        }
        nextQuestion();
        return;
    }
    
    // 2. Boutons de Réponse (1, 2, 3, 4) 
    const answerKeys = ['1', '2', '3', '4'];
    const answerIndex = answerKeys.indexOf(pressedKey);
    
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
        
        // Afficher la pop-up
        showWinnerPopup(`🚨 Joueur ${buzzedPlayer + 1} a buzzé ! C'est à lui de répondre !`);

        // Afficher l'instruction de réponse dans la section question
        questionDisplay.textContent = `${questions[currentQuestionIndex].question} (Joueur ${buzzedPlayer + 1} répond)`;
        
    } 
});

// Initialisation
window.onload = displayQuestion;
