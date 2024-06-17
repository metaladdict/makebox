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
- [x] création d'un élement (reste positionnement automatique)
- [ ] création d'un ensemble d'éléments
- [ ] selecteur d'ensembles
- [ ] charger / sauvegarder
- [x] télécharger le SVG
- [ ] ajouter un SVG interne
- [ ] choix de la couleur de tracé

## :bulb: A ajouter
- [x] test de découpe
- [ ] poignée sur glissière
- [ ] boite sans glissière
- [ ] découpage de l'espace en rangées/colonnes
- [ ] intercalaire amovibles

## :cricket: A corriger
- bug de positionnement du point 0 de la découpe, selon type de coté à corriger  

## :calendar: Historique
- `17/06/24` correction d'affrichage sur Chrome   
   correction de la duplication qui éditait l'objet parent   
- `21/03/23` activation de l'auto positionnement  
   calcul de la prochaine position de bloc  
- `19/03/23` tracés internes  
   placement du tracé dans un groupe  
   ajout du décalage intérieur et des courbures  
- `15/03/23` tracés externe  
   tracé des cotés selon option, activation des décalages
- `13/03/23` refonte du système  
   les boites pourront répondre à des modèles, plusieurs étapes sont ajoutées
- `08/03/23` test de coupe sur 2 pièces  
   :pencil2: Prendre en compte la largeur de coupe
   