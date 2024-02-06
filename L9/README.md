[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/ASCN06le)
# Twitris

Membre(s) du groupe :
- Alexis Martins (AlexisMts)
- Rayane Annen (azzen)
- Felix Breval (BoluxByte)
- Hugo Ducommun (hugoducom)

# Comment utiliser le projet

Le projet est fonctionnel tel quel à l'exception de deux fichiers manquants sur le repository pour des raisons de place et de sécurité.
Le premier fichier c'est le fichier contenant le fonctionnement de `tmi.js`. 
Etant donné que notre application fonctionne côté client, nous ne pouvions pas utiliser `npm` pour installer la librairie.
Nous avons donc dû télécharger le fichier `tmi.js` et le placer dans le dossier `/public/scripts/tmi.js`.

Le second fichier qui n'est pas présent sur ce repository est le fichier `config.js` qui contient les informations de connexion à l'API Twitch/tmi.js.
Ce fichier va contenir le nom de la chaîne diffusant le jeu, le broadcasterId qui est simplement le userId de la chaîne, un access token qui est utilisé pour l'accès à l'API Twitch et finalement le clientId qui est l'id que nous avons donné à notre application sur l'API Twitch.
Le fichier ressemble donc au contenu ci-dessous et est stocké `/src/config.js` :

```javascript
export const CONFIG = {
    twitchChannels: 'twitrisweb',
    broadcasterId: '1020014865',
    accessToken: 'sensitive_token',
    clientId: 'sensitive_client_id'
};
```

Le `broadcasterId` peut être récupéré via des sites tiers ou directement via l'API Twitch en faisant des requêtes aux bons endpoints.
Nous avons utilisé la première option pour des raisons de simplicité.

Pour les deux informations sensibles, il faut se rendre sur le [Twitch Developer Console](https://dev.twitch.tv/) et créer une application.
Lors de la création d'une application, un `clientId` est généré et c'est celui-ci qu'on récupère pour le fichier `config.js`.

Pour avoir l'access token, il faut se rendre sur l'URL suivante en remplaçant avec vos informations.
Il faut simplement remplacer les valeurs du clientId que vous avez récupéré précédemment et l'URL de redirection qui est l'URL de votre application (saisie lors du processus de création de l'application)

```
https://id.twitch.tv/oauth2/authorize?client_id=<your_client_id>&redirect_uri=<your_url_defined_in_app>&response_type=token&scope=channel:moderate+chat:edit+chat:read+channel:manage:moderators
```

Une fois que vous avez récupéré toutes ces informations et que celles-ci sont saisies dans le fichier `config.js`, vous pouvez lancer le projet en faisant :

```
npm i
npm start
```

# Comment le projet fonctionne-t-il ?

## Librairie TMI

Le projet utilise [tmi](https://tmijs.com/), une librairie d'interaction avec le chat de [Twitch](twitch.tv).
C'est un wrapper de l'API Twitch. Il est important de noté que début 2023 beaucoup de fonctionnalités présentes dans la librairie ont été supprimées ce qui explique que nous avons tout de même dû utiliser l'API de Twitch directement pour certaines opérations.

L'implémentation de cette interaction est fait sur le fichier [twitch.js](/src/twitch.js). Ce dernier gère la connexion au compte qui stream
et la communication entre le chat Twitch et les games. 

En effet, on récupère les messages du chat Twitch puis nous les interprétons de sorte à envoyer des messages aux jeux.
On utilise les messages implémentés lors des laboratoires précédents afin de communiquer avec les jeux.

Par exemple, lorsqu'un utilisateur envoie le message `!d`, quelle fonction doit être appelée, le traitement à faire
lorsqu'une commande n'est pas reconnue etc.

## app.js

Un autre fichier qui a été fortement modifié est le fichier [app.js](src/app.js). Afin de pouvoir lancer `n` jeux en même temps, un niveau 
d'absraction a été rajouté et est géré dans ce fichier. 
Son but principal est vraiment la création de l'ensemble des jeux et de les placer dans l'interface.
Il passera tous ces jeux au fichier `twitch.js` afin que celui-ci puisse gérer l'interaction avec le chat Twitch.

## Anti-spam et API Twitch

Twitch impose un anti-spam du même message des viewers qui **n'est pas désactivable**.

Afin d'évite cela, nous n'avons pas trouvé d'autres moyens que de passer tous les viewers modérateurs durant la partie  et de leur enlever le rôle à la fin. 
Cette fonctionnalité n'était pas présente sur `tmi.js` comme expliqué précédemment, nous avons donc dû utiliser l'API Twitch directement pour cela.
La documentation afin d'avoir accès aux endpoints de l'API Twitch est disponible [ici](https://dev.twitch.tv/docs/api/moderation/).
