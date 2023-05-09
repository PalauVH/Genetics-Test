# Genetisch Algoritme in JavaScript
Dit project is ontstaan uit mijn nieuwsgierigheid naar genetische algoritmen. Het maakt gebruik van JavaScript om een 2D-raster te creëren waarop verschillende 'organismen' worden gegenereerd. Deze organismen bezitten een willekeurig gegenereerd genoom, bestaande uit een binaire reeks waarbij elke bit een gen vertegenwoordigt. Elk gen heeft een specifieke functie die wordt geëvalueerd in de fitnessfunctie.

De organismen die de meeste stappen zetten (van positie veranderen) binnen een generatie worden beschouwd als het meest 'fit'. Enkele mogelijke eigenschappen van de organismen zijn:
  - Het vermogen om in een specifieke richting te bewegen
  - Het vermogen om zich zowel verticaal als horizontaal te verplaatsen
  - Een verhoogde kans om te bewegen
  - Extraversie en introversie, onderverdeeld in de volgende kenmerken:
      :Extraversie:
        - Een verhoogde kans om zich te verplaatsen in de richting van het dichtstbijzijnde buurorganisme
        - Bij extreme extraversie, een verhoogde kans om zich te verplaatsen in de richting van de gemiddelde positie van de hele groep organismen
      :Introversie:
        - Een verhoogde kans om zich te verplaatsen in de tegenovergestelde richting van het dichtstbijzijnde buurorganisme
        - Bij extreme introversie, een verhoogde kans om zich te verplaatsen in de tegenovergestelde richting van de gemiddelde positie van de hele groep organismen

In elke generatie worden de meest fitte organismen geselecteerd en vervolgens gerecombineerd.


# Genetic Algorithm in JavaScript
This project was born out of my curiosity about genetic algorithms. It uses JavaScript to create a 2D grid on which different "organisms" are generated. These organisms possess a randomly generated genome, consisting of a binary sequence where each bit represents a gene. Each gene has a specific function that is evaluated in the fitness function.

The organisms that make the most steps (change position) within a generation are considered the most "fit. Some possible properties of the organisms are:
  - The ability to move in a specific direction
  - The ability to move both vertically and horizontally
  - An increased ability to move
  - Extraversion and introversion, divided into the following traits:
      :Extraversion:
        - An increased probability of moving in the direction of the nearest neighboring organism
        - In extreme extraversion, an increased probability of moving toward the average position of the entire group of organisms
      :Introversion:
        - An increased probability of moving in the opposite direction of the nearest neighbor organism
        - At extreme introversion, an increased probability of moving in the opposite direction to the average position of the whole group of organisms

In each generation, the fittest organisms are selected and then recombined.
