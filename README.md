# SignLanguageFrontend

Dieses webbasierte Frontend dient als grafische Oberfläche für das SignLanguageBackend.
Das Frontend erlaubt es über die Webcam Handzeichen des Fingeralphabets über das Backend zu klassifizieren.
Dazu werden die Bilder in einem Intervall an das Backend gesendet und das Ergebnis dem Benutzer angezeigt.
Die möglichen Handzeichen sind dargestellt und mit einem Klick auf das Handzeichen auf der Übersichtsseite können die Originale angesehen werden. 

## Installation

Das Frontend wurde unter Debian 10, Linux Mint 19 und Windows 10 getestet sowie entwickelt.
Um möglichen Inkompatibilitäten aus dem Weg zu gehen, werden diese als Betriebssystem
empohlen.

1. Installation von Node.js um den Paketmanager npm zu erhalten
2. Installation von essentiellen Paketen mit: npm install
3. Ändern der Backend URL falls gewüscntht in der signs.service.ts Datei
4. Erstellen des Projekts mit ng build --prod
5. Den Inhalt des dist Ordners in ein Webserver-Verzeichnis schieben (Apache/NGINX/IIS um die gängigsten zu nennen)

Ohne Änderung der URL schickt das Frontend die Anfragen automatisch an das gehostete Backend unter https://jupiter.fh-swf.de/sign-language/
