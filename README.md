# Genetisch Algoritme
Om mijn nieuwsgierigheid te stillen wilde ik kijken hoe ik een genetisch algoritme moest ontwikkelen.
Met Javascript wordt een 2D grid gemaakt waarop een aantal 'organismen' worden gegenereerd.
Al deze organismen hebben een willekeurig gegenereerde genoom. Dit genoom wordt gerepresenteerd als een binaire reeks, waarbij elk karakter
een gen voorsteld. Elk gen heeft een voorgeprogrammeerde functie die in de zogeheten fitness functie wordt nagelopen.

Organismen die het meeste stappen zetten - oftewel het meest van positie veranderen - in één gehele generatie worden gezien als het meest 'fit'.
De eigenschappen die de organismen kunnen hebben zijn bijvoorbeeld: 
  - De mogelijkheid om een bepaalde richting op te kunnen verplaatsen
  - De mogelijkheid om of verticaal en/of horizontaal te verplaatsen
  - Een vergrootte kans om te bewegen
  - Extra- en introversie die onder zijn verdeeld in de volgende eigenschappen:
      :Extraversie:
        - Een vergrootte kans om in de richting van de meest dichtsbijzijnde buurorganisme te verplaatsen
        - Bij extreme extraversie een vergrootte kans om in de richting van de gemiddelde plaats van de gehele organismengroep te verplaatsen
      :Introversie:
        - Een vergrootte kans om in de tegengestelde richting van de meest dichtsbijzijnde buurorganisme te verplaatsen
        - Bij extreme introversie een vergrootte kans om in de tegengestelde richting van de gemiddelde plaats van de gehele organismengroep te verplaatsen
        
 Bij elke generatie zullen de meeste fitte organismen geselecteerd worden en gerecombineerd worden.
 
      
