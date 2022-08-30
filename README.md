# ODS & Leaflet tests

![ODS & Leaflet](/public/repository-open-graph.png?raw=true "ODS & Leaflet tests")

-   Liste des spots proches d'un point sur la carte (fetch ODS)
-   rechagement des spots proches du click
-   recherche du plus proche
-   affichage de la route à prendre pour s'y rendre

## Datasets

Les données proviennent d'API d'[OpenDataSoft](https://data.opendatasoft.com/)

Les points (ou "spots") seront choisis en haut à droite parmis :

-   [Liste des boîtes aux lettres de rue](https://data.opendatasoft.com/explore/dataset/laposte_boiterue%40datanova/api/)
-   [Bureaux de vote - France 2017](https://data.opendatasoft.com/explore/dataset/bureaux-vote-france-2017%40public/api/)

## Loading

-   la taille du cercle correspond au rayon des données qui seront chargées chez ODS
-   le cercle bleu/vert indique le chargement de données coté ODS
-   le cercle rouge indique que la recherche de chemin est en court

## Deployment

Déployé sur [ods-tst.vercel.app](https://ods-tst.vercel.app)

## cf

-   [OpenDataSoft](https://data.opendatasoft.com/)
-   [React Leaflet](https://react-leaflet.js.org/)
-   [leaflet-routing](https://www.liedman.net/leaflet-routing-machine/)
