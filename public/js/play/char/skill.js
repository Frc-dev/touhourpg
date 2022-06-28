export function oneTimeSkills(skillId, arrayData) {
    // skills that are triggered only when the character joins
    switch (skillId) {
        case 5:
            // Judge of the Darkness, raise accuracy of hand of death for every over-level
            // one-time based
            // check whether this is the user or not to check the overlevel
            if (arrayData.data.owner === user) {
                var overLevel =
                    trainerData[0].data.level - rivalData[0].data.level;
                if (overLevel > 0) {
                    // check if character has the move
                    for (let i = 0; i < trainerData[0].moves.length; i++) {
                        if (trainerData[0].moves[i].id === 9) {
                            // hand of death
                            trainerData[0].moves[i].accuracy +=
                                5 * overLevel;
                        }
                    }
                }
            } else if (arrayData.data.owner !== user) {
                var overLevel =
                    rivalData[0].data.level - trainerData[0].data.level;
                if (overLevel > 0) {
                    // check if character has the move
                    for (let i = 0; i < rivalData[0].moves.length; i++) {
                        if (rival.moves[i].id === 9) {
                            // hand of death
                            rival.moves[i].accuracy += 5 * overLevel;
                        }
                    }
                }
            }
            break;
            
        default: break;
    }
}

export function actionBasedSkills(skillId, arrayData) {
    // skills that require an special event to happen
    switch (skillId) {
        case 3:
            // Necromancy, recover 50% hp when killed
            arrayData.data.healthPoints = arrayData.data.healthMax / 2;
            return " has risen from the dead once more.";
        case 4:
            // extracurricular class, get 50% more net exp gain TODO
            break;
        case 7:
            // Traveller of the Storms, get 1x modifier against Electric
            // action based
            if (arrayData.data.owner === user) {
                if (rivalData[0].data.type === "Electric") {
                    modifierAtk = 1;
                }
            } else if (arrayData.data.owner !== user) {
                break;
            }
            break;
        default:
            break;
    }
}

export function turnBasedSkills(skillId, arrayData) {
    switch (skillId) {
        case 1:
            // Salvo, +2 SPE
            // turn-based
            arrayData.data.speed += 2;
            return `${arrayData.data.char_name  }'s speed raised by 2`;
        case 2:
            // Seal of Fantasy, +1 ATK
            // turn-based
            arrayData.data.atk += 1;
            return `${arrayData.data.char_name  }'s attack raised by 1`;

        case 6:
            // Calmed, recover 5% hp each turn
            // turn-based
            if (arrayData.data.healthPoints < arrayData.data.maxHealth) {
                arrayData.data.healthPoints +=
                    (arrayData.data.healthPoints * 5) / 100;
                return `${arrayData.data.char_name  } recovered health!`;
            }

            break;
        
        default: break;
    }
}