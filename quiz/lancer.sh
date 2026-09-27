#!/bin/sh
# Ouvre le quiz dans le navigateur par défaut. Aucun serveur n'est nécessaire.
DIR="$(cd "$(dirname "$0")" && pwd)"
case "$(uname -s)" in
  Darwin) open "$DIR/index.html" ;;
  MINGW*|MSYS*|CYGWIN*) start "" "$DIR/index.html" ;;
  *) xdg-open "$DIR/index.html" ;;
esac
