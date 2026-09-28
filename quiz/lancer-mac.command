#!/bin/sh
# macOS : double-cliquer sur ce fichier ouvre le quiz dans le navigateur par défaut.
# Aucun serveur n'est nécessaire.
open "$(cd "$(dirname "$0")" && pwd)/index.html"
