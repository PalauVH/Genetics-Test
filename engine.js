var actionButton = document.getElementById('actionButton');
var meanSteps = document.getElementById('meanSteps');
var maxSteps = document.getElementById('maxSteps');
var EIratio = document.getElementById('EIratio');
var extravertScore = document.getElementById('extravertScore');
var introvertScore = document.getElementById('introvertScore');
var meanViewDistance = document.getElementById('meanViewDistance');
var score = document.getElementById('score');
var scoreHistory = [];
var logTable = document.getElementById('logTable');
var logTableContainer = document.getElementById('logTableContainer');

const scale = 1000;
const organismSize = 10;
const tiles = scale / organismSize;
var initialGenomes = [];
var initialOrganismAmount = 200;
var initialisedOrganisms = 0;

var stopSim = false;
var runFrames = 250; // Aantal frames die worden uitgevoerd per generatie
var framesRunned = 0;
var frameTime = 1; // in ms
var runInterval;
var isRunning = false;
var create_newGeneration = false;
var generationCount = 1;
var fillWithBest = false;

var genomeLength = 41;
var Organisms = [];
var Canvas;
var Context;
var CrossoverPoint = false;

var standardViewDistance = 2;
var maxVersionchance = 75;
var extravertCount = 0;
var introvertCount = 0;

function calc_EIscore(isExtravert) {

    var score = 0;
    let organismCount = 0;

    for (Organism of Organisms) {
        organismCount++;

        let Genome = [...Organism['genome']];
        let parts = Genome.slice(16, 22);
        if (isExtravert) {
            parts = Genome.slice(10, 16);
        }

        score += (30 * (parts[0] == 1));
        score += (25 * (parts[1] == 1));
        score += (10 * (parts[2] == 1));
        score += (5 * (parts[3] == 1));
        score += (4 * (parts[4] == 1));
        score += (1 * (parts[5] == 1));
    }

    return (score / organismCount / maxVersionchance);
}
function calc_meanViewDistance() {

    let total = 0;
    let organismCount = 0;

    for (Organism of Organisms) {
        organismCount++;

        let Genome = [...Organism['genome']];
        let parts = Genome.slice(23, 31);
        parts = parts.map(bit => {return Number(bit);});
        total += (parts.reduce((sum, a) => sum + a, 0)) + standardViewDistance;
    }

    return (total / organismCount);
}

function getColor(value) {
    //value from 0 to 1
    var hue = (value * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
}
function stopSimulation() {
    stopSim = true;
}
function runSimulations() {
    stopSim = false;

    if (runFrames === false) {
        simulateGeneration();
        return;
    }

    if (create_newGeneration) {
        actionButton.innerHTML = "Simuleer generatie";
        create_newGeneration = false;
        generateOffspring();

        framesRunned = 0;
        return;
    }

    // Interval runnen
    if (isRunning === false) {
        actionButton.innerHTML = "Generatie aan het simuleren...";
        runInterval = setInterval(simulateGeneration, frameTime);
        isRunning = true;
        return;
    }

    runSimulations();
}

window.onload = (e) => {
    Canvas = document.getElementById("Canvas");
    Canvas.width = scale;
    Canvas.height = scale;
    maxSteps.innerHTML = runFrames;

    if (initialOrganismAmount > scale * scale) {
        initialOrganismAmount = scale / 2;
    }

    if (Canvas.getContext) {
        Context = Canvas.getContext('2d');
        createOrganisms();
        createGridLines();
    }
}

function simulateGeneration() {
    // Één generatie uitvoeren
    
    if (framesRunned >= runFrames && runFrames !== false) {
        console.log('Done processing frames. ' + framesRunned + ' frames runned');
        clearInterval(runInterval);
        isRunning = false; 
        
        create_newGeneration = true;
        actionButton.innerHTML = "Produceer nakomelingen";
        
        // Gemiddelde aantal stappen berekenen
        let allSteps = Organisms.map(Organism => Organism.steps).filter(function(steps){return steps > 0;}).reduce((sum, step) => sum + step, 0);
        meanSteps.innerHTML = (allSteps / Organisms.length).toFixed(2);
        score.innerHTML = (allSteps / Organisms.length / runFrames * 100).toFixed(2) + "%";

        // De verhouding tussen extraverten en introverten berekenen
        EIratio.innerHTML = "(" + (extravertCount/(extravertCount + introvertCount)).toFixed(2) + " : " + (introvertCount/(extravertCount + introvertCount)).toFixed(2) + ")";
        extravertScore.innerHTML = (calc_EIscore(true) * 100).toFixed(1) + " %";
        introvertScore.innerHTML = (calc_EIscore(false) * 100).toFixed(1) + " %";
        extravertCount = 0;
        introvertCount = 0;

        // De gemiddelde viewDistance berekenen
        meanViewDistance.innerHTML = calc_meanViewDistance().toFixed(3);
        
        // De score geschiedenis updaten
        let newRow = logTable.insertRow(-1);
        newRow.insertCell(0).innerHTML = "Generatie " + generationCount + ":";
        newRow.insertCell(1).innerHTML = EIratio.innerHTML;
        newRow.insertCell(2).innerHTML = extravertScore.innerHTML;
        newRow.cells[2].style.color = extravertScore.style.color;
        newRow.insertCell(3).innerHTML = introvertScore.innerHTML;
        newRow.cells[3].style.color = introvertScore.style.color;
        newRow.insertCell(4).innerHTML = score.innerHTML;
        let colorCell = newRow.insertCell(5);
        colorCell.width = '20px;';
        colorCell.style.backgroundColor = getColor(allSteps / Organisms.length / runFrames);

        // Scrollbar naar beneden scrollen
        logTableContainer.scrollTop = logTableContainer.scrollHeight;

        if (create_newGeneration) {
            actionButton.innerHTML = "Simuleer generatie";
            create_newGeneration = false;
            generateOffspring();
    
            framesRunned = 0;

            // Gelijk nieuwe simulatie starten
            if (stopSim === false) {
                runSimulations();
            }

            return;
        }
    }
    // console.log('Processing frame #' + (framesRunned + 1));
    
    // Content van scherm verwijderen
    Context.clearRect(0, 0, scale, scale);
    organismCoordinates = [];
    createGridLines();
    
    // Voor elke frame bepalen wat elk organisme moet gaan doen
    for (i = 0; i < initialisedOrganisms; i++) {
        // Verkrijgen van het organisme
        let Organism = Organisms[i];

        // Kijken welke actie er uitgevoerd moet worden
        let Action = organismAction(Organism);
        if (Action !== false) {

            // De nieuwe positie van het organisme bepalen
            Organism = moveOrganism(Organism, Action);

            // Het organisme bijwerken
            Organisms[i] = Organism;
        }
        drawOrganism(Organism);
    }

    framesRunned++;
}

function createGridLines() {
    // Functie om de lijnen te tekenen
    Context.strokeStyle = 'lightgrey';
    Context.lineWidth = 1
    for (i = 1; i < tiles; i++) {
        // Alle verticale lijnen tekenen
        let xLine = i * organismSize;

        Context.beginPath();
        Context.moveTo(xLine, 0);
        Context.lineTo(xLine, scale);
        Context.stroke();
        Context.closePath();
    }
    for (i = 1; i < tiles; i++) {
        // Alle verticale lijnen tekenen
        let yLine = i * organismSize;

        Context.beginPath();
        Context.moveTo(0, yLine);
        Context.lineTo(scale, yLine);
        Context.stroke();
        Context.closePath();
    }
}

function createOrganisms(Offspring = false) {
    
    // Aanmaken van alle organismen op een willekeurige plek op het canvas
    // -----

    let OrganismsToCreate = initialOrganismAmount;
    if (Offspring !== false) {
        initialGenomes = Offspring;
        initialisedOrganisms = Offspring.length;
        usedCoordinates = [];

        // De gegenereerde nakomelingen vastleggen als organismen,
        //  en de overgebleven hoeveelheid van de populatiegenereren
        for (i = 0; i < initialisedOrganisms; i++) {

            // Coordinaten genereren
            let initialCoords = false;
            while (initialCoords === false) {
                initialCoords = generateUniqueCoordinate();
            }

            let Organism = {
                'genome' : Offspring[i],
                'raw_coordinates' : initialCoords
            };
            Organisms[i] = Organism;

            drawOrganism(Organism);
        }
        OrganismsToCreate -= initialisedOrganisms;
    }

    for (o = 0; o < OrganismsToCreate; o++) {
        
        // Initiele coordinaten genereren
        let initialCoords = false;
        while (initialCoords === false) {
            initialCoords = generateUniqueCoordinate();
        }

        // De eigenschappen van dit organisme vastleggen
        let Genome = false;
        while (Genome === false) {
            Genome = generateUniqueGenome();
        }
        initialGenomes.push(Genome);

        let Organism = {
            "genome" : Genome,
            "raw_coordinates" : initialCoords
        };
        Organisms[initialisedOrganisms] = Organism;

        // Het organisme tekenen op het beeldscherm
        drawOrganism(Organism);

        initialisedOrganisms++;
    }

    if (Offspring !== false) {
        console.log("Nakomelingen succesvol gegenereerd");
    }
}

var organismCoordinates = [];
function isOverlapping(translatedCoordinates) {
    
    // De coordinates omzetten naar een string
    translatedCoordinates = translatedCoordinates.x.toString() + translatedCoordinates.y.toString();

    if (!organismCoordinates.includes(translatedCoordinates)) {
        // Coordinaten van dit organisme aan de array toevoegen
        organismCoordinates.push(translatedCoordinates);
        return false;
    }
    
    let overlappingOrganisms = 1;
    for (transCoordinates of organismCoordinates) {
        overlappingOrganisms += (organismCoordinates == translatedCoordinates);
    }
    
    // Coordinaten van dit organisme aan de array toevoegen
    organismCoordinates.push(translatedCoordinates);
    
    // Kleur genereren aan de hand van aantal overlappende organismen
    return "hsl(135, "+ (35 + overlappingOrganisms * 10).toString() +"%, 50%)";
}

function drawOrganism(Organism) {
    let translatedCoords = translateCoordinates(Organism['raw_coordinates']);
    // Het organisme tekenen op het canvas
    Context.beginPath();
    Context.rect(
        translatedCoords.x,
        translatedCoords.y,
        organismSize,
        organismSize
    );

    // Kijken of dit organisme overlapt met een ander organisme
    Context.fillStyle = 'hsl(225, 35%, 50%)';
    let Overlap = isOverlapping(translatedCoords);
    if (Overlap !== false) {
        Context.fillStyle = Overlap;
    }

    Context.fill();
}

var usedCoordinates = [];
function generateUniqueCoordinate() {
    let x = Math.floor(Math.random() * tiles);
    let y = Math.floor(Math.random() * tiles);
    let coordString = x.toString() + "," + y.toString();
    if (usedCoordinates.includes(coordString)) {
        return false;
    }
    
    return {
        x: x,
        y: y
    };
}

function translateCoordinates(Coordinates) {
    return {
        x: Coordinates.x * organismSize,
        y: Coordinates.y * organismSize
    };
}

function generateUniqueGenome() {
    var binString = Math.floor(Math.random() * (2**genomeLength - 1)).toString(2).padEnd(genomeLength, '0');
    if (initialGenomes.includes(binString)) {
        return false;
    }
    return binString;
}

function generateOffspring() {
    // Genereert een nieuwe generatie aan de hand van de beste 50% van de vorige generatie
    Context.clearRect(0, 0, scale, scale);
    createGridLines();

    console.log("Nakomelingen produceren");
    
    // De beste zijn in dit geval de organismen die het meeste aantal stappen hebben gezet
    Organisms = Organisms.filter(
        function(Organism) {
            return Organism.steps > 0;
        }
    );
    Organisms = Organisms.sort(
        function(a, b) {
            return b.steps - a.steps;
        }
    );

    let Offspring = [];
    
    // Nu willekeurig de nakomeling produceren
    let nCrossovers = Math.floor(Organisms.length / 2);
    for (i = 0; i < nCrossovers; i++) {
        let first = Math.floor(Math.random() * Organisms.length)
        let second = Math.floor(Math.random() * Organisms.length);
        while (second === first) {
            second = Math.floor(Math.random() * Organisms.length);
        }

        // Vekrijgen van de genomen
        first = Organisms[first]['genome'];
        second = Organisms[second]['genome'];
        
        // Genomen knippen
        let local_CrossoverPoint = CrossoverPoint;
        if (local_CrossoverPoint === false) {
            local_CrossoverPoint = Math.floor(Math.random() * (genomeLength - 2));
        }
        let first_First = [...first].splice(0, local_CrossoverPoint);
        let first_Second = [...first].splice(local_CrossoverPoint);
        let second_First = [...second].splice(0, local_CrossoverPoint);
        let second_Second = [...second].splice(local_CrossoverPoint);

        // Hercombineren
        first = first_First.concat(second_Second).join('');
        second = first_Second.concat(second_First).join('');
        Offspring.push(first);
        Offspring.push(second);
    }

    // De rest van de Offspring array vullen met de originele fitste van de selectie (voor extra convergentie)
    if (fillWithBest) {
        Offspring = Offspring.concat(Organisms.map(Organism => Organism.genome));
        Offspring = Offspring.slice(0, initialOrganismAmount);
    }

    // Alle nakomelingen als organismen vastleggen (en extra organismen maken om aan de populatie te voldoen)
    generationCount++;
    createOrganisms(Offspring);
}

function moveOrganism(Organism, Action) {
    
    // De coordinaten vooraf bijwerken
    currentCoordinates = Organism['raw_coordinates'];
    Organism['raw_coordinates'] = {
        x: currentCoordinates.x + ((Action == 'R') * 1) + ((Action == 'L') * -1),
        y: currentCoordinates.y + ((Action == 'U') * 1) + ((Action == 'D') * -1)
    };

    // Stappen bijwerken
    if (typeof Organism['steps'] == 'undefined') {
        Organism['steps'] = 0;
    }

    let nSteps = 1;
    let translatedCoordinates = translateCoordinates(Organism['raw_coordinates']);
    // Kijken of het organisme out of bounds is
    if (translatedCoordinates.x >= scale || translatedCoordinates.x < 0 || translatedCoordinates.y >= scale || translatedCoordinates.y < 0) {
        Organism['raw_coordinates'] = currentCoordinates;
        nSteps = 0;
    }

    Organism['steps'] += nSteps;
    return Organism;
}

function organismAction(Organism) {
    // Aan de hand van het genoom bepalen welke actie er uitgevoerd moet worden

    // De genoom is een binaire string die is opgebouwd uit een aantal blokken
    // Blok 1:
    // 0    => Move Up     ↑   +
    // 1    => Move Down   ↓   -
    // 2    => Move Right  →   + 
    // 3    => Move Left   ←   -
    // Blok 2:
    // 4    => Possibility to move vertically 
    // 5    => Possibility to move horizontally
    // Blok 3: (Het organisme heeft normaal gesproken 10% kans om te bewegen)
    // 6    => +20% chance to move
    // 7    => +20% chance to move
    // 8    => +20% change to move
    // 9    => +20% change to move
    // Blok 4: (Extraversie: dit bepaalt de kans dat het organisme naar zijn buur gaat) (grondkans == 0%) (maximale kans == 75%)
    // 10   => +30% chance to move to neighbour
    // 11   => +25% chance to move to neighbour
    // 12   => +10% chance to move to neighbour
    // 13   => +5% chance to move to neighbour
    // 14   => +4% chance to move to neighbour
    // 15   => +1% chance to move to neighbour
    // Blok 5: (Introversie: dit bepaalt de kans dat het organisme weg van zijn buur gaat) (grondkans == 0%) (maximale kans == 75%)
    // 16   => +30% chance to move from neighbour
    // 17   => +25% chance to move from neighbour
    // 18   => +10% chance to move from neighbour
    // 19   => +5% chance to move from neighbour
    // 20   => +4% chance to move from neighbour
    // 21   => +1% chance to move from neighbour
    // Blok 5: (Intro- of extraversie expressie gen)
    // 22   => 0 == Extravert, 1 == Introvert
    // Blok 6: (View Distance genen: deze bepalen tot hoever een organism een gem. groep of ander organisme ziet)\
    // 23   => +1 afstand
    // 24   => +1 afstand
    // 25   => +1 afstand
    // 26   => +1 afstand
    // 27   => +1 afstand
    // 28   => +1 afstand
    // 29   => +1 afstand
    // 30   => +1 afstand
    // 31   => +1 afstand
    // 32   => +1 afstand
    // 33   => +1 afstand
    // 34   => +1 afstand
    // 35   => +1 afstand
    // 36   => +1 afstand
    // 37   => +1 afstand
    // 38   => +1 afstand
    // 39   => +1 afstand
    // 40   => +1 afstand

    // De blokken uitlezen
    Genome = Organism['genome'];
    let parts = [...Genome];
    let b1 = parts.slice(0, 4);
    let b2 = parts.slice(4, 6);
    let b3 = parts.slice(6, 10);
    let b4 = parts.slice(10, 16); // Extraversie genen
    let b5 = parts.slice(16, 22); // Introversie genen
    let b6 = parts.slice(22, 23); // Intro-/Extraversie expressie gen
    let b7 = parts.slice(23, 41); // View distance genen
    
    let isExtravert = (b6[0] == 0);
    extravertCount += (isExtravert);
    introvertCount += (isExtravert === false);

    // Kijken of er uberhaupt beweging plaats mag vinden
    b3 = b3.map(bit => {return Number(bit);});
    let Chance = (b3.reduce((sum, a) => sum + a, 0) * 0.2) + 0.1;
    if (Math.random() >= Chance) {
        // Er mag geen beweging plaatsvinden
        // Dus wordt er voor de rest niks gedaan met dit organisme
        return false;
    }

    // Bepalen of beweging in een richting mogelijk is
    let verticalMove = (b2[0] == 1);
    let horizontalMove = (b2[1] == 1);
    if (verticalMove === false && horizontalMove === false) {
        return false;
    }

    b7 = b7.map(bit => {return Number(bit);});
    let viewDistance = (b7.reduce((sum, a) => sum + a, 0));
    if (viewDistance === b7.length) {
        viewDistance = false;
    }
    viewDistance += standardViewDistance;

    // Kijken of het organisme een introverte of een extraverte expressie heeft
    let EIversionChance = 0;
    if (isExtravert) {
        EIversionChance += (30 * (b4[0] == 1));
        EIversionChance += (25 * (b4[1] == 1));
        EIversionChance += (10 * (b4[2] == 1));
        EIversionChance += (5 * (b4[3] == 1));
        EIversionChance += (4 * (b4[4] == 1));
        EIversionChance += (1 * (b4[5] == 1));
    } else {
        EIversionChance += (30 * (b5[0] == 1));
        EIversionChance += (25 * (b5[1] == 1));
        EIversionChance += (10 * (b5[2] == 1));
        EIversionChance += (5 * (b5[3] == 1));
        EIversionChance += (4 * (b5[4] == 1));
        EIversionChance += (1 * (b5[5] == 1));
    }
    EIversionChance /= 100;

    if (Math.random() < EIversionChance) {
        let ei_versionMove = EIversionMove(Organism, (isExtravert === false), (EIversionChance == 0.75), viewDistance);
        if (ei_versionMove !== false) {
            if ((ei_versionMove == 'U' || ei_versionMove == 'D') && verticalMove) {
                return ei_versionMove;
            }
            if ((ei_versionMove == 'R' || ei_versionMove == 'L') && horizontalMove) {
                return ei_versionMove;
            }
        }
    }
    
    //      Verticale beweging bekijken
    if (verticalMove) {
        // Eerste gedeelte van de eerste blok uitlezen
        let moveUp = b1[0] * 1;
        let moveDown = b1[1] * 2;
        let movementCalc = moveUp - moveDown;
        if (movementCalc === -2) {
            verticalMove = -1;
        } else if (movementCalc === 1) {
            verticalMove = 1;
        } else if (movementCalc === -1) {
            verticalMove = -1;
            if (Math.random() < 0.5) {
                verticalMove = 1;
            }
        }
    }

    //      Horizontale beweging bekijken
    if (horizontalMove) {
        // Eerste gedeelte van de eerste blok uitlezen
        let moveRight = b1[2] * 1;
        let moveLeft = b1[3] * 2;
        let movementCalc = moveRight - moveLeft;
        if (movementCalc === -2) {
            horizontalMove = -1;
        } else if (movementCalc === 1) {
            horizontalMove = 1;
        } else if (movementCalc === -1) {
            horizontalMove = -1;
            if (Math.random() < 0.5) {
                horizontalMove = 1;
            }
        }
    }

    let movementCalc = Math.abs(verticalMove) * 1 - Math.abs(horizontalMove) * 2;
    if (movementCalc === 0) {
        return false;
    }
    if (movementCalc === -2) {
        // Dan wordt er horizontaal bewogen
        return ("R".repeat((verticalMove === 1) + 0) + "L".repeat((verticalMove === -1) + 0)).toString();
    }
    if (movementCalc === 1) {
        // Dan wordt er verticaal bewogen
        return ("U".repeat((verticalMove === 1) + 0) + "D".repeat((verticalMove === -1) + 0)).toString();
    }
    if (movementCalc === -1) {
        // Dan moet er gekeken worden welke richting gekozen moet worden
        if (Math.random() < 0.5) {
            return ("U".repeat((verticalMove === 1) + 0) + "D".repeat((verticalMove === -1) + 0)).toString();
        }
        return ("R".repeat((verticalMove === 1) + 0) + "L".repeat((verticalMove === -1) + 0)).toString();
    }
}

function EIversionMove(Organism, Introversion, ExtremeAction = false, viewDistance) {
    // Van dit organisme de meest dichtsbijzijnde buur vinden
    if (viewDistance === false) {
        viewDistance = scale * 2;
    }

    // Coordinaten van het organisme vastleggen
    let xO = Organism['raw_coordinates'].x;
    let yO = Organism['raw_coordinates'].y;

    let smallestDistance = scale * 2;
    let xN;
    let yN;
    
    let xMean = 0;
    let yMean = 0;
    
    for (Neighbour of Organisms) {
        // Afstand bepalen tussen Organism en Neighbour
        xN = Neighbour['raw_coordinates'].x;
        yN = Neighbour['raw_coordinates'].y;

        if (ExtremeAction) {
            // De gemiddelde locatie van alle organismen bepalen
            xMean += xN;
            yMean += yN;
            continue;
        }

        // Pythagoras
        let d = Math.sqrt((xO - xN)**2 + (yO - xN)**2);
        if (d > smallestDistance || d > viewDistance) {
            continue;
        }
        smallestDistance = d;
    }

    if (ExtremeAction) {
        // Gemiddelde vastleggen
        xN = Math.floor(xMean / initialisedOrganisms);
        yN = Math.floor(yMean / initialisedOrganisms);
        let d = Math.sqrt((xO - xN)**2 + (yO - xN)**2);
        if (d > viewDistance) {
            // Dan is de gemiddelde positie van alle organismen verder dan dat de viewDistance van het organisme toelaat
            return false;
        }
    } else {
        if (smallestDistance == scale * 2) {
            // Dan kan het organisme zijn buur niet zien i.v.m. met de viewDistance
            return false;
        }
    }
    
    // Horizontale beweging
    if (Math.abs(xO - xN) < Math.abs(yO - yN)) {
        if (xO - xN == 0) {
            if (Introversion) {
                if (Math.random() < 0.5) {
                    return "R";
                }
                return "L";
            }
            return false;
        }
        if (xO - xN < 0) {
            if (Introversion) {
                return "L";
            }
            return "R";
        }
        if (Introversion) {
            return "R";
        }
        return "L";
    }
    // Verticale beweging
    if (Math.abs(xO - xN) > Math.abs(yO - yN)) {
        if (yO - yN == 0) {
            if (Introversion) {
                if (Math.random() < 0.5) {
                    return "U";
                }
                return "D";
            }
            return false;
        }
        if (yO - yN < 0) {
            if (Introversion) {
                return "D";
            }
            return "U";
        }
        if (Introversion) {
            return "U";
        } 
        return "D";
    }

    // Geen beweging
    if (Math.abs(xO - xN) == Math.abs(yO - yN)) {
        return false;
    }
}


