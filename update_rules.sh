sed -i 's/match \/users\/{userId} {/match \/users\/{userId} {\n      allow read, write: if isOwner(userId);/' firestore.rules
