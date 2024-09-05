const caseX = 500; 
const caseY = 500; 
const generationInterval = 20; 


function initialiserTableau(x, y) {
    const tableau = [];
    for (let i = 0; i < y; i++) {
        const ligne = [];
        for (let j = 0; j < x; j++) {
            
            const estVivant = Math.random() > 0.5;
            ligne.push(estVivant);
        }
        tableau.push(ligne);
    }
    return tableau;
}

function compterVoisinsVivants(tableau, x, y) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    let count = 0;
    
    for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;

        if (nx >= 0 && nx < tableau[0].length && ny >= 0 && ny < tableau.length) {
            count += tableau[ny][nx] ? 1 : 0;
        }
    }
    
    return count;
}

function appliquerRegles(tableau) {
    const tableauTemporaire = [];

    for (let y = 0; y < tableau.length; y++) {
        tableauTemporaire.push([]);
        for (let x = 0; x < tableau[y].length; x++) {
            tableauTemporaire[y].push(false); 
        }
    }

    for (let y = 0; y < tableau.length; y++) {
        for (let x = 0; x < tableau[y].length; x++) {
            const estVivant = tableau[y][x];
            const voisinsVivants = compterVoisinsVivants(tableau, x, y);

            if (estVivant) {
                if (voisinsVivants < 2 || voisinsVivants > 3) {
                    tableauTemporaire[y][x] = false; 
                } else {
                    tableauTemporaire[y][x] = true; // Continue de vivre
                }
            } else {
                // Cellule morte
                if (voisinsVivants === 3) {
                    tableauTemporaire[y][x] = true; // Naît
                }
            }
        }
    }

    // Remplacer le tableau original par le tableau temporaire mis à jour
    for (let y = 0; y < tableau.length; y++) {
        for (let x = 0; x < tableau[y].length; x++) {
            tableau[y][x] = tableauTemporaire[y][x];
        }
    }
}

// Mettre à jour le style des cellules en fonction des valeurs du tableau
function mettreAJourAffichage(tableau) {
    const gridContainer = document.getElementById('grid-container');
    const cellules = gridContainer.querySelectorAll('.cell');

    // Parcourir le tableau et mettre à jour les classes des cellules
    let index = 0;
    for (let y = 0; y < tableau.length; y++) {
        for (let x = 0; x < tableau[y].length; x++) {
            const estVivant = tableau[y][x];
            const cell = cellules[index++];

            // Modifier la classe CSS selon que la cellule est vivante ou morte
            if (estVivant) {
                cell.classList.add('alive');
                cell.classList.remove('dead');
            } else {
                cell.classList.add('dead');
                cell.classList.remove('alive');
            }
        }
    }
}

// Fonction pour générer les cellules HTML de la grille
function genererTableau() {
    const gridContainer = document.getElementById('grid-container');

    // Effacer le tableau précédent
    gridContainer.innerHTML = '';

    // Définir la grille CSS
    gridContainer.style.gridTemplateColumns = `repeat(${caseX}, 30px)`;
    gridContainer.style.gridTemplateRows = `repeat(${caseY}, 30px)`;
    gridContainer.classList.add('grid');

    // Générer les cellules HTML sans les styles
    for (let i = 0; i < caseX * caseY; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        gridContainer.appendChild(cell);
    }
}

// Fonction pour mettre à jour la génération et l'affichage
function miseAJourGeneration() {
    appliquerRegles(tableauJeu); // Appliquer les règles au tableau actuel
    mettreAJourAffichage(tableauJeu); // Mettre à jour l'affichage basé sur le tableau mis à jour
}

// Initialiser le tableau des états des cellules
let tableauJeu = initialiserTableau(caseX, caseY);

// Générer une première fois le tableau HTML
genererTableau();

// Fonction d'intervalle pour mettre à jour périodiquement les valeurs du tableau et l'affichage
setInterval(() => {
    miseAJourGeneration(); // Mettre à jour la génération des cellules
}, generationInterval);