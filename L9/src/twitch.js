/*
 * Projet WEB - Twitris
 * Auteurs : Annen Rayane, Breval Felix, Ducommun Hugo, Martins Alexis
 */

import { DropMessage, MoveMessage, RotateMessage } from "./messages.js";
import { gameCols, stepIntervalMs, voteDelay } from "./constants.js";
import { CONFIG } from "./config.js";

// Enumération des modes de vote
export const VoteMode = {
    Democracy: Symbol("democracy"),
    Anarchy: Symbol("anarchy"),
};

class Twitch {
    // Utilisation de propriétés de classe pour stocker les modes de vote
    static VOTES_MODES = new Map();

    constructor(teamCount, games) {
        // Initialisation du client Twitch
        this.client = new tmi.Client({
            options: { debug: true },
            identity: {
                username: CONFIG.twitchChannels,
                password: 'oauth:' + CONFIG.accessToken
            },
            channels: [CONFIG.twitchChannels],
        });

        // Connexion au canal Twitch
        this.client.connect();
        this.channel = CONFIG.twitchChannels;
        this.callbacks = [];
        this.teamCount = teamCount;
        this.voteMode = VoteMode.Democracy;
        this.users = new Map();
        this.games = games;
        this.teamId = 0;
        this.is_voting = true;
        this.votes_democracy = Array.from({ length: teamCount }, () => new Map());
        this.users_id = [];

        // Gestion des messages du tchat
        this.client.on("message", (channel, tags, message) => {
            const username = tags["display-name"];
            const userId = tags["user-id"];
            this.parse(username, userId, message);
        });
    }

    // Fonction pour analyser et traiter les messages du tchat
    parse(username, userId, message) {
        let message_clean = message.trim().toLowerCase();

        let teamId = this.users.get(username);

        // Vérifie si le message est une commande valide
        if (this.isValidCommand(message_clean)) {

            if (teamId !== undefined) {
                this.addChatMessage(teamId, username, message_clean);
            }
        }

        if (
            this.users.has(username) &&
            this.is_voting === false &&
            this.voteMode === VoteMode.Democracy
        ) {
            this.votes_democracy[this.users.get(username)].set(username, message_clean);
            return;
        }

        // Traitement des commandes du tchat
        switch (message_clean) {
            case "!r":
                this.moveRight(teamId);
                break;
            case "!l":
                this.moveLeft(teamId);
                break;
            case "!d":
                this.drop(teamId);
                break;
            case "!rl":
                this.rotateLeft(teamId);
                break;
            case "!rr":
                this.rotateRight(teamId);
                break;
            case "!anarchy":
                this.vote(username, VoteMode.Anarchy);
                break;
            case "!democracy":
                this.vote(username, VoteMode.Democracy);
                break;
            case "!join":
                this.join(username, userId);
                break;
            default:
                break;
        }
    }

    addChatMessage(teamId, username, message) {
        // Récupérer l'élément de chat correspondant à l'équipe
        const chatBox = document.querySelector(`div[data-chat-id="${teamId}"]`);
        const div = document.createElement("div");
        div.classList.add("chat-message");

        const usernameElem = document.createElement("span");
        usernameElem.classList.add("chat-username");
        usernameElem.innerText = username + " : ";

        const messageElem = document.createElement("span");
        messageElem.classList.add("chat-text");
        messageElem.innerText = message;

        div.appendChild(usernameElem);
        div.appendChild(messageElem);
        chatBox.appendChild(div);

        // Limiter le nombre de messages dans le chat
        while (chatBox.children.length > 10) {
            chatBox.removeChild(chatBox.firstChild);
        }

        // Faire défiler vers le bas pour afficher les derniers messages
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Méthode pour annoncer qu'un utilisateur a rejoint l'équipe
    announceJoin(teamId, username) {
        const chatBox = document.querySelector(`div[data-chat-id="${teamId}"]`);

        const div = document.createElement("div");
        div.classList.add("chat-message");

        div.innerText = `${username} a rejoint`;

        chatBox.appendChild(div);

        // Limiter le nombre de messages dans le chat
        while (chatBox.children.length > 10) {
            chatBox.removeChild(chatBox.firstChild);
        }

        // Faire défiler vers le bas pour afficher les derniers messages
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Vérifie si une commande est valide
    isValidCommand(command) {
        return [
            "!r",
            "!l",
            "!d",
            "!rl",
            "!rr",
            "!anarchy",
            "!democracy",
            "!join",
        ].includes(command);
    }

    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }

    async join(username, userId) {

        await this.addModerators(username, userId)

        if (!this.users.has(username)) {
            this.users.set(username, this.teamId);
            this.announceJoin(this.teamId, username);
            this.teamId = (this.teamId + 1) % this.teamCount;
        } else {
            console.log("user has already joined the game", username);
        }
    }


    // Méthode pour déplacer vers la droite
    moveRight(teamId) {
        let newPos = this.clamp(
            this.games[teamId].getShape(1).col + 1,
            0,
            gameCols
        );
        this.games[teamId].onMessage(1, new MoveMessage(newPos));
    }

    // Méthode pour déplacer vers la gauche
    moveLeft(teamId) {
        let newPos = this.clamp(
            this.games[teamId].getShape(1).col - 1,
            0,
            gameCols
        );
        this.games[teamId].onMessage(1, new MoveMessage(newPos));
    }

    // Méthode pour faire tomber
    drop(teamId) {
        this.games[teamId].onMessage(1, new DropMessage());
    }

    // Méthode pour tourner à droite
    rotateRight(teamId) {
        this.games[teamId].onMessage(1, new RotateMessage("right"));
    }

    // Méthode pour tourner à gauche
    rotateLeft(teamId) {
        this.games[teamId].onMessage(1, new RotateMessage("left"));
    }

    // Méthode pour enregistrer le vote d'un utilisateur
    vote(username, mode) {
        if (this.is_voting === true) {
            Twitch.VOTES_MODES.set(username, mode);
            this.updateVoteCounts();
        }
    }

    // Méthode pour mettre à jour les comptes de votes
    updateVoteCounts() {
        const anarchyVotes = Array.from(Twitch.VOTES_MODES.values()).filter(vote => vote === VoteMode.Anarchy).length;
        const democracyVotes = Array.from(Twitch.VOTES_MODES.values()).filter(vote => vote === VoteMode.Democracy).length;

        document.getElementById('anarchy-count').innerText = anarchyVotes;
        document.getElementById('democracy-count').innerText = democracyVotes;
    }

    // Méthode pour lancer le vote
    launch_vote() {
        this.is_voting = true;
        console.log("Vote started");
        this.openPopup();
        setTimeout(() => {
            this.close_vote();
        }, voteDelay);
    }

    // Méthode pour clore le vote
    close_vote() {
        this.is_voting = false;
        this.closePopup();
        const modeCount = new Map();
        modeCount.set(VoteMode.Anarchy.toString(), 0);
        modeCount.set(VoteMode.Democracy.toString(), 0);

        Twitch.VOTES_MODES.forEach((mode) => {
            const modeKey = mode.toString();
            modeCount.set(modeKey, (modeCount.get(modeKey) || 0) + 1);
        });

        this.voteMode =
            modeCount.size > 0 &&
            modeCount.get(VoteMode.Anarchy.toString()) >
            modeCount.get(VoteMode.Democracy.toString())
                ? VoteMode.Anarchy
                : VoteMode.Democracy;

        Twitch.VOTES_MODES.clear();

        if (this.voteMode === VoteMode.Democracy) {
            let intervalId = setInterval(() => {
                this.democracy();
            }, stepIntervalMs);
            this.callbacks.push(intervalId);
        }

        let intervalId = setInterval(() => this.checkGamesOver(), stepIntervalMs);
        this.callbacks.push(intervalId);

        console.log("Vote ended");
    }

    // Méthode pour gérer le mode "Démocratie" et effectuer les mouvements
    democracy() {
        this.votes_democracy.forEach((votes, teamId) => {
            const voteCount = new Map();
            votes.forEach((vote) => {
                voteCount.set(vote, (voteCount.get(vote) || 0) + 1);
            });

            if (voteCount.size === 0) {
                return;
            }

            let movement = Array.from(voteCount.entries()).reduce(
                (a, b) => (a[1] > b[1] ? a : b)
            )[0];

            // Appliquer le mouvement en fonction du vote majoritaire
            switch (movement) {
                case "!r":
                    this.moveRight(teamId);
                    break;
                case "!l":
                    this.moveLeft(teamId);
                    break;
                case "!d":
                    this.drop(teamId);
                    break;
                case "!rr":
                    this.rotateRight(teamId);
                    break;
                case "!rl":
                    this.rotateLeft(teamId);
                    break;
                default:
                    break;
            }
        });
        // Réinitialiser les votes après utilisation
        this.votes_democracy = Array.from({ length: this.teamCount }, () => new Map());
    }

    // Méthode pour afficher une popup
    openPopup() {
        document.getElementById("popup").style.display = "flex";
    }

    // Méthode pour fermer une popup
    closePopup() {
        document.getElementById("popup").style.display = "none";
    }

    // Méthode pour vérifier si tous les jeux sont terminés
    checkGamesOver() {
        const allOver = this.games.every((game) => game.isGameOver);
        if (allOver) {
            for (const callback of this.callbacks) {
                clearInterval(callback);
            }
            this.endAllGames();
        }
    }

    // Méthode pour mettre fin à tous les jeux et annoncer le gagnant
    async endAllGames() {
        // Supprimer les modérateurs après la fin des jeux
        await this.removeModerators();

        // Calculer les scores des équipes
        let teamScores = new Array(this.teamCount).fill(0);
        this.games.forEach((game) => {
            const scores = game.getTotalScores();
            teamScores[game.gameId] = scores.get(1);
        });

        // Trouver l'équipe gagnante ou annoncer une égalité
        const highestScore = Math.max(...teamScores);
        const winningTeamIndices = teamScores.reduce((indices, score, index) => {
            if (score === highestScore) indices.push(index);
            return indices;
        }, []);

        if (winningTeamIndices.length === 1) {
            const winningTeamIndex = winningTeamIndices[0];
            this.displayWinningPopup(winningTeamIndex);
        } else {
            this.displayTiePopup(winningTeamIndices);
        }
    }

    // Méthode pour afficher la popup du gagnant
    displayWinningPopup(winningTeamIndex) {
        const message = `L'équipe ${winningTeamIndex + 1} gagne !`;
        this.showPopup(message);
    }

    // Méthode pour afficher la popup d'égalité
    displayTiePopup(winningTeamIndices) {
        const teams = winningTeamIndices.map((i) => i + 1).join(", ");
        const message = `Égalité entre les équipes ${teams} !`;
        this.showPopup(message);
    }

    // Méthode pour afficher une popup avec un message donné
    showPopup(message) {
        const popup = document.getElementById("winner-popup");
        const popupContent = popup.querySelector(".popup-content");
        popupContent.innerHTML = `<h2>${message}</h2>`;
        popup.style.display = "flex";
    }

    // Méthode pour ajouter le statut de modérateur à un utilisateur
    async addModerators(username, userId) {
        const broadcasterId = CONFIG.broadcasterId;
        const accessToken = CONFIG.accessToken;
        const clientId = CONFIG.clientId;

        try {
            const response = await fetch(`https://api.twitch.tv/helix/moderation/moderators?broadcaster_id=${broadcasterId}&user_id=${userId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Client-Id': clientId
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            this.client.say(this.channel, `${username} a rejoint l'équipe ${this.teamId + 1} !`);
            this.users_id.push(userId);
            console.log(`Le statut de modérateur a été ajouté pour l'utilisateur ${userId}`);
        } catch (error) {
            console.error('Erreur lors de l\'ajout du statut de modérateur:', error);
        }
    }

    // Méthode pour retirer le statut de modérateur des utilisateurs
    async removeModerators() {
        const broadcasterId = CONFIG.broadcasterId;
        const accessToken = CONFIG.accessToken;
        const clientId = CONFIG.clientId;
        console.log(this.users_id)

        for (const userId of this.users_id) {
            try {
                const response = await fetch(`https://api.twitch.tv/helix/moderation/moderators?broadcaster_id=${broadcasterId}&user_id=${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Client-Id': clientId
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                console.log(`Le statut de modérateur a été retiré pour l'utilisateur ${userId}`);
            } catch (error) {
                console.error('Erreur lors du retrait du statut de modérateur:', error);
            }
        }
    }
}

export default Twitch;
