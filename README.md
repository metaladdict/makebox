# :package: makeBox

Interface permettant de créer des boites, avec couvercle coulissant, à la découpeuse laser.

> :atom: fonctionnement hypothétique !

## :triangular_ruler: Principe
L'interface ne nécessite pas de serveur, uniquement HMTL/JS.  
A la sortie d'un champs après son édition, le SVG est redessinné.  
Permet de générer/télécharger le SVG à la volée.

## :scissors: Système de découpe
- [x] paramètres de base
- [x] configuration des coins/cotés
- [~] création d'un élement (reste positionnement automatique)
- [ ] création d'un ensemble d'éléments
- [ ] selecteur d'ensembles
- [ ] charger / sauvegarder
- [x] télécharger le SVG

## :bulb: A ajouter
- [x] test de découpe
- [ ] poignée sur glissière
- [ ] boite sans glissière
- [ ] découpage de l'espace en rangées/colonnes
- [ ] intercalaire amovibles

## :calendar: Historique
- `08/03` test de coupe sur 2 pièces  
   :pencil2: Prendre en compte la largeur de coupe
- `13/03` refonte du système  
   les boites pourront répondre à des modèles, plusieurs étapes sont ajoutées
- `15/03` refonte du système  
   tracé des cotés selon option, activation des décalages