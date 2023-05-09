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
