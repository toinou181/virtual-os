# Virtual OS

Un système d'exploitation virtuel complet développé en HTML, CSS et JavaScript offrant une expérience desktop moderne dans le navigateur.

## 🚀 Fonctionnalités

### Interface Graphique
- **Bureau virtuel** avec fond d'écran interactif
- **Gestion des fenêtres** avec redimensionnement, minimisation et maximisation
- **Barre des tâches** avec heure système et indicateurs
- **Menus contextuels** avec clic droit sur le bureau
- **Interface responsive** adaptée aux mobiles et tablettes

### Gestion des Fichiers
- **Gestionnaire de fichiers** avec arborescence et vue en grille
- **Import de fichiers** depuis votre ordinateur
- **Création de dossiers et fichiers** 
- **Système de fichiers virtuel** avec structure hiérarchique
- **Aperçu et édition** des fichiers texte

### Applications Intégrées
- **📝 Bloc-notes** - Éditeur de texte avec sauvegarde
- **🧮 Calculatrice** - Calculatrice scientifique fonctionnelle
- **🎮 Jeu Snake** - Jeu classique avec score
- **💬 Chat Discord-like** - Système de chat avec salons textuels et vocaux
- **📁 Gestionnaire de fichiers** - Navigation complète du système

### Gestion des Utilisateurs
- **Système d'authentification** avec création de comptes
- **Sessions utilisateur** individualisées
- **Profils personnalisés** avec paramètres
- **Gestion des permissions** et des droits d'accès

### Dashboard Administrateur Ultra-Sécurisé
- **Accès protégé par clé unique** (voir admin_key.txt)
- **Gestion des utilisateurs** - Création, modification, suppression
- **Configuration système** - Paramètres globaux
- **Outils d'urgence** - Réparation et réinitialisation
- **Journaux système** - Surveillance et diagnostic
- **Sécurité avancée** - Gestion des clés et politiques

### Chat en Ligne
- **Interface similaire à Discord**
- **Salons textuels** avec historique des messages
- **Salons vocaux** (interface préparée)
- **Commandes système** (/help, /clear, /time, etc.)
- **Emojis et réactions** intégrés

## 🛠️ Installation et Utilisation

1. **Cloner le repository**
```bash
git clone https://github.com/toinou181/virtual-os.git
cd virtual-os
```

2. **Lancer un serveur web local**
```bash
# Avec Python
python3 -m http.server 8000

# Ou avec Node.js
npx serve .

# Ou avec PHP
php -S localhost:8000
```

3. **Ouvrir dans le navigateur**
```
http://localhost:8000
```

## 👤 Première Utilisation

1. **Créer un compte** depuis l'écran de connexion
2. **Explorer le bureau** en cliquant sur les icônes
3. **Clic droit sur le bureau** pour accéder aux options
4. **Importer des fichiers** via le menu contextuel
5. **Ouvrir les applications** depuis le menu démarrer

## 🔐 Accès Administrateur

La clé d'accès administrateur est stockée dans le fichier `admin_key.txt`.

**Clé actuelle:** `admin_key_7x9z2k4m8j1n5q3w`

Pour accéder au dashboard :
1. Cliquer sur l'icône ⚙️ dans la barre des tâches
2. Entrer la clé de sécurité
3. Gérer le système depuis le dashboard

## 📁 Structure du Projet

```
virtual-os/
├── index.html          # Page principale
├── admin_key.txt       # Clé d'accès administrateur
├── css/
│   ├── desktop.css     # Styles du bureau
│   ├── windows.css     # Styles des fenêtres
│   └── apps.css        # Styles des applications
├── js/
│   ├── core.js         # Fonctions principales
│   ├── auth.js         # Système d'authentification
│   ├── desktop.js      # Gestion du bureau
│   ├── windows.js      # Gestion des fenêtres
│   ├── filemanager.js  # Gestionnaire de fichiers
│   ├── chat.js         # Système de chat
│   ├── apps.js         # Applications (calc, notepad, game)
│   └── admin.js        # Dashboard administrateur
└── data/               # Dossier pour les données (vide)
```

## 🎮 Applications Disponibles

### Gestionnaire de Fichiers
- Navigation par arborescence
- Import de fichiers externes
- Création de dossiers/fichiers
- Édition de fichiers texte
- Gestion des permissions

### Chat Discord-like
- Salons textuels multiples
- Interface moderne
- Commandes système
- Support des emojis
- Historique des messages

### Calculatrice
- Opérations de base (+, -, *, /)
- Interface tactile
- Historique des calculs
- Design moderne

### Bloc-notes
- Édition de texte riche
- Sauvegarde automatique
- Ouverture de fichiers
- Interface simple et efficace

### Jeu Snake
- Contrôles clavier
- Système de score
- Interface graphique
- Niveaux de difficulté

## 🔧 Fonctionnalités Techniques

- **100% Frontend** - Pas de serveur requis
- **LocalStorage** - Persistance des données
- **Responsive Design** - Compatible mobile
- **Gestion d'état** - Architecture modulaire
- **Sécurité** - Chiffrement des clés d'accès
- **Performance** - Optimisé pour la fluidité

## 🚀 Améliorations Futures

- [ ] Support des thèmes personnalisés
- [ ] Chat vocal fonctionnel
- [ ] Plus d'applications intégrées
- [ ] Synchronisation cloud
- [ ] API REST pour le backend
- [ ] Support multilingue complet
- [ ] Gestion avancée des permissions
- [ ] Système de plugins

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer des améliorations
- Ajouter de nouvelles fonctionnalités
- Améliorer la documentation

## 📞 Support

Pour toute question ou problème, n'hésitez pas à ouvrir une issue sur GitHub.