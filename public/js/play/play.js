import * as ajax from "../shared/ajax";
import * as battle from "./battle/battle";
import * as map from "./map/map";

// warning: this code is very WET, not very SOLID and thus it SMELLS REALLY BAD (get it?), proceed with caution and keep in mind I wrote this in 2 weeks fresh out of school 
// it will eventually be good though, consider this a legacy code in progress of being refactored and reworked.

$(document).ready(() => {
    // in this case, because of how javascript works, global variables are a necessary evil to keep certain
    // events initialised in between functions.
    // TODO is it really
    // TODO2 consider using sessions or cookies for that - you from the future
    let controlEnvironment = "field"; // default control environment
    let conversationArray = []; // array that holds all conversation lines
    let convArrayIndex = 0; // current position in the array
    let userData;
    const user = $("#user").attr("value");
    let moveIdle = true; // movement sprite value
    let moveDirection; // direction in which the sprite is moving before another direction input
    let inEventRange; // checks if sprite is currently in event range
    let eventType; // type of the event in range
    let conversationId; // id of the conversation we're going to process
    let canMove = true; // whether the user can move or not
    let eventCode;
    let inPc; // whether user is in pc or not
    let values;

    // global battle values
    let trainerData; let rivalData;
    let combatType;
    let fainted = false; // to know if changing character spends a turn or not
    let captured;

    // playfield
    const canvas = document.getElementById("eventSprite");
    let context = canvas.getContext("2d");
    let img = new Image();
    img.onload = () => {
        context.drawImage(img, 0, 0);
    };

    values = {
        user,
    };

    function startConversation(values) {
        $("#npcSpritePosition").removeAttr("hidden");
        $("#textBox").removeAttr("hidden");
        ajax.getDetails("/play/getConversation", values).done((response) => {
            if (response.success !== undefined) {
                conversationArray = response.success;
                convArrayIndex = 0;
                // load first panel of the scene
                $("#textBox").html(
                    conversationArray[convArrayIndex].lineContent
                );
                // load first sprite
                $("#npcSpritePosition").empty();
                if (conversationArray[convArrayIndex].animation !== null) {
                    $("#npcSpritePosition").append(
                        `<img src='animations/${ 
                            conversationArray[convArrayIndex].character 
                            }/${ 
                            conversationArray[convArrayIndex].animation 
                            }.png'>`
                    );
                } else {
                    $("#npcSpritePosition").append(
                        `<img src='animations/${ 
                            conversationArray[convArrayIndex].character 
                            }/1.png'>`
                    );
                }

                // process event
                if (conversationArray[convArrayIndex].eventTrigger !== null) {
                    processEvent(
                        conversationArray[convArrayIndex].eventTrigger
                    );
                }
                controlEnvironment = "conversation";
            }
        });
    }

    function processEvent(eventId) {
        eventId = parseInt(eventId, 10);
        // TODO too many switches in the app
        switch (eventId) {
            case 1:
                // add picture to playfield
                // TODO magic string
                let img = "/sprites/characters/Marisa/sprite.png";
                $("#playField").append(
                    `<img id='event1Img' src='${  img  }'>`
                );
                break;
            case 2:
                // remove picture
                $("#event1Img").remove();
                break;
            case 3:
                // add 2 sprite options
                const src1 = "/sprites/player/card/M.png";
                const src2 = "/sprites/player/card/F.png";
                const button1 =
                    `<input type='image' src='${ 
                    src1 
                    }' class='btTxt genderButton tutorialSprite' id='maleSprite'>`;
                const button2 =
                    `<input type='image' src='${ 
                    src2 
                    }' class='btTxt genderButton tutorialSprite' id='femaleSprite'>`;

                $("#playField").append(button1);
                $("#playField").append(button2);

                break;
            case 4:
                // load map 1
                values = {
                    map: 1,
                    user,
                    prevMap: 0,
                };

                ajax.getDetails("/play/getMap", values).done((response) => {
                    if (response.success !== undefined) {
                        const main = response.success.mainSprite;
                        const event = response.success.eventSprite;
                        const {id} = response.success;
                        // append map to playfield
                        $("#mainSprite").append(
                            `<img src=${  mapsUrl  }/${  id  }/${  main  }>`
                        );
                        $("#eventSprite").append(
                            `<img src=${  mapsUrl  }/${  id  }/${  event  }>`
                        );
                        window.location.reload();
                    }
                });
                break;
            // numbers are missing because the events inbetween are regular conversation/event triggers which have been automatized
            case 19:
                // pc opening
                inPc = true;
                $("#PCModal").modal("show");
                inEventRange = false;
                break;
            case 21:
                // shop line after closing modal
                // first, end the previous one
                conversationArray = [];
                convArrayIndex = 0;

                $("#npcSpritePosition").attr("hidden", "true");
                $("#textBox").empty().attr("hidden", "true");

                values = {
                    user,
                    conversationId: 15,
                };
                startConversation(values);
                break;

            case 32:
                // healing team
                // use the user to heal all members of the team that are in positions 1/6
                values = {
                    user,
                };

                ajax.getDetails("/play/healTeam", values).done((response) => {
                    if (response.error !== undefined) {
                        // TODO what do we do here
                    }
                });
                break;
            case 33:
                // open shop
                $("#shopModal").modal("show");
                $("#shopModal")
                    .children()
                    .children()
                    .children()
                    .first()
                    .attr("data-id", "#store_town1");
                break;
            case 34:
                // receive first character
                values = {
                    user,
                    instance: 1,
                };

                ajax.getDetails("/play/getCharacter", values).done((response) => {
                    if (response.success !== undefined) {
                        // character saved, proceed with event
                        // load conversation
                        values = {
                            user,
                            conversationId: 4,
                        };
                        startConversation(values);
                    } else {
                        // TODO what do we do here
                    }
                });
                break;
            case 35:
                // triggered after receiving reimu, closes way out of the lab, activates marisa callable, disabled reimu dialogue
                toggleCall(user, 25);
                toggleCall(user, 26);
                toggleCall(user, 28);
                break;
            case 36:
                // activate Marisa's battle
                // dialogue has already been said, set up battle
                controlEnvironment = "battle";
                // get battle data
                // few notations: JS handles all the events, PHP the CALCULATIONS AND DATA GETTING ONLY
                // case 36 signals the specific battle we're doing, so we know which combat data to get
                // 2 functions needed ->
                // getBattleData()-> receives data to get specific data from trainers, so it must receive the trainers id
                // startBattle() -> this one sets up all the non-dynamic elements that are non-specific to a battle and receives the battle data (arrays) which have already been sent
                trainerId = userData.nick;
                rivalId = "#rival_1";
                combatType = "trainer";
                getBattleData(trainerId, rivalId);

                break;
            case 37:
                // toggle events 28, 33, 30, 7, 27
                toggleCall(user, 28);
                toggleCall(user, 33);
                toggleCall(user, 30);
                toggleCall(user, 7);
                toggleCall(user, 27);
                break;
            case 38:
                // route 1 trainers battle
                controlEnvironment = "battle";
                trainerId = userData.nick;
                rivalId = "#route1_trainer1";
                combatType = "trainer";
                getBattleData(trainerId, rivalId);

                break;
            case 39:
                // gym leader Aya's battle
                controlEnvironment = "battle";
                trainerId = userData.nick;
                rivalId = "#gymleader_1";
                combatType = "trainer";
                getBattleData(trainerId, rivalId);

                break;
            case 40:
                // trigger conversation 22 and receive first badge
                userData.progress += 1;
                values = {
                    user,
                    conversationId: 22,
                };
                startConversation(values);
                break;
            case 41:
                // trigger conversation 23
                toggleCall(user, 22);
                values = {
                    user,
                    conversationId: 23,
                };
                startConversation(values);
                break;
            default:
                break;
        }
    }

    function mapZero(data) {
        // this function is triggered when the user is new to the game and he is nowhere in the ingame map
        // it is meant to trigger the tutorial scenes
        // we will load the tutorial scene
        values = {
            user: data.nick,
            conversationId: 1,
        };

        ajax.getDetails("/play/getConversation", values).done((response) => {
            if (response.success !== undefined) {
                conversationArray = response.success;
                // load first panel of the scene
                $("#textBox").html(conversationArray[0].lineContent);
                controlEnvironment = "conversation";
                const mapValues = {
                    conversation: conversationArray[convArrayIndex],
                    user,
                };

                // TODO check what the standard is for ajax responses, since eslint complains at response
                ajax.getDetails("/play/processConversation", mapValues).done((response1) => {
                    if (response1.success !== undefined) {
                        $("#textBox").html(
                            conversationArray[convArrayIndex].lineContent
                        );

                        $("#npcSpritePosition").empty();

                        if (
                            conversationArray[convArrayIndex].animation !== null
                        ) {
                            $("#npcSpritePosition").append(
                                `<img src='animations/${ 
                                    conversationArray[convArrayIndex]
                                        .character 
                                    }/${ 
                                    conversationArray[convArrayIndex]
                                        .animation 
                                    }.png'>`
                            );
                        } else {
                            $("#npcSpritePosition").append(
                                `<img src='animations/${ 
                                    conversationArray[convArrayIndex]
                                        .character 
                                    }/1.png'>`
                            );
                        }

                        // process event
                        if (
                            conversationArray[convArrayIndex].eventTrigger !==
                            null
                        ) {
                            processEvent(
                                conversationArray[convArrayIndex].eventTrigger
                            );
                        }
                    }
                });
            }
        });
    }

    ajax.getDetails("/play/getData", values).done((response) => {
        if (response.success !== undefined) {
            userData = response.success;

            if (userData.position === 0) {
                mapZero(userData);
            } else {
                const values = {
                    map: userData.position,
                    user,
                    prevMap: userData.prevPosition,
                };
                ajax.getDetails("/play/getMap", values).done((response) => {
                    if (response.success !== undefined) {
                        const main = response.success.mainSprite;
                        const event = response.success.eventSprite;
                        const {id} = response.success;

                        // append map to playfield

                        $("#npcSpritePosition").attr("hidden", "true");
                        $("#textBox").attr("hidden", "true");

                        $("#mainSprite").append(
                            `<img src=${  mapsUrl  }/${  id  }/${  main  }>`
                        );
                        img.src = `${mapsUrl  }/${  id  }/${  event}`;

                        // load sprite
                        $("#userSprite").append(
                            `<img src=${ 
                                playerSpritesUrl 
                                }/${ 
                                userData.sprite 
                                }/${ 
                                response.position.direction 
                                }-idle.png>`
                        );
                        moveDirection = "up";
                        if (response.position !== undefined) {
                            $("#userSprite")
                                .children()
                                .css({
                                    top: `${response.position.charY  }px`,
                                    left: `${response.position.charX  }px`,
                                });
                        }
                    }
                });
            }
        } else {
            // TODO what do we do here
        }
    });

    function checkEvent(x, y) {
        // get color below div

        const p = context.getImageData(x, y, 1, 1).data;

        if (p[0] === 0 && p[1] === 0 && p[2] === 0 && p[3] === 0) {
            // check if its nothing
            inEventRange = false;
            canMove = true;
        } else if (p[0] === 0 && p[1] === 255 && p[2] === 248 && p[3] === 255) {
            // check if its hitbox

            canMove = false;
        } else if (p[0] === 0 && p[1] === 255 && p[2] === 53 && p[3] === 255) {
            // check if its grass
            // does some related to doll battling
            canMove = true;
            // each time we step on green, chance of summoning a wild character of 10%
            const chance = Math.floor(Math.random() * 100);
            if (chance > 90) {
                // get map data
                values = {
                    user,
                    mapId: userData.position,
                };

                ajax.getDetails("/play/getMapData", values).done((
                    response
                ) => {
                    if (response.success !== undefined) {
                        // we have map data
                        const mapLevel = response.success.levelRange.split("-");
                        const charLevel =
                            mapLevel[
                                Math.floor(Math.random() * mapLevel.length)
                            ];

                        const mapChars = response.success.mapChars.split(",");
                        const charId =
                            mapChars[
                                Math.floor(Math.random() * mapChars.length)
                            ];
                        values = {
                            charLevel,
                            charId,
                            user,
                        };
                        ajax.getDetails("/play/createWildCharacter", values).done(
                            (response1) => {
                                if (response1.success !== undefined) {
                                    // true
                                    const trainerId = userData.nick;
                                    const rivalId = `temp_${  userData.nick}`;
                                    combatType = "wild";
                                    getBattleData(trainerId, rivalId);
                                } else {
                                    // TODO what do we do here
                                }
                            }
                        );
                    }
                });
            }
        } else {
            // its a non-defined event
            // get current full p value, compare to rgb, convert the value to hex, compare the hex value to list of known events
            // get full p values
            const color = [p[0], p[1], p[2]];
            values = {
                color,
                user: userData.nick,
            };
            ajax.getDetails("/play/getEventCode", values).done((response) => {
                if (response.success !== undefined) {
                    if (response.success.eventType === "change") {
                        // change map
                        if (processMap(userData.position, response.success.mapChange) === true) {
                            // TODO why is this empty
                        }
                    } else if (response.success.eventType === "conversation") {
                        // check if callable
                        if (response.userevent !== undefined) {
                            if (response.userevent.callable === "true") {
                                // can be called
                                canMove = false;
                                inEventRange = true;
                                eventType = "conversation";
                                conversationId =
                                    response.success.conversationTrigger;
                            } else {
                                canMove = true;
                            }
                        }
                    } else if (response.success.eventType === "special") {
                        eventCode = response.success.id;
                        inEventRange = true;
                        canMove = true;
                        eventType = "";
                    } else {
                        // TODO what do we do here
                    }
                }
            });
        }
    }

    $(document).on("keydown", (event) => {
        switch (controlEnvironment) {
            case "conversation":
                switch (event.keyCode) {
                    case 65:
                        // A button, advance conversation
                        // get conversation array and process it
                        convArrayIndex += 1;
                        if (convArrayIndex >= conversationArray.length) {
                            // conversation is finished
                            controlEnvironment = "field";
                            conversationArray = [];
                            convArrayIndex = 0;
                            eventType = "";
                            canMove = true;

                            $("#npcSpritePosition").attr("hidden", "true");
                            $("#textBox").empty().attr("hidden", "true");
                            break;
                        } else {
                            const values = {
                                conversation: conversationArray[convArrayIndex],
                                user,
                            };

                            ajax.getDetails(
                                "/play/processConversation",
                                values
                            ).done((response) => {
                                if (response.success !== undefined) {
                                    $("#textBox").html(
                                        conversationArray[convArrayIndex]
                                            .lineContent
                                    );

                                    $("#npcSpritePosition").empty();

                                    if (
                                        conversationArray[convArrayIndex]
                                            .animation !== null
                                    ) {
                                        $("#npcSpritePosition").append(
                                            `<img src='animations/${ 
                                                conversationArray[
                                                    convArrayIndex
                                                ].character 
                                                }/${ 
                                                conversationArray[
                                                    convArrayIndex
                                                ].animation 
                                                }.png'>`
                                        );
                                    } else {
                                        $("#npcSpritePosition").append(
                                            `<img src='animations/${ 
                                                conversationArray[
                                                    convArrayIndex
                                                ].character 
                                                }/1.png'>`
                                        );
                                    }

                                    // process event
                                    if (
                                        conversationArray[convArrayIndex]
                                            .eventTrigger !== null
                                    ) {
                                        processEvent(
                                            conversationArray[convArrayIndex]
                                                .eventTrigger
                                        );
                                    }
                                }
                            });
                        }
                        break;
                    default: break;
                }
                break;
            case "field":
                let movement = 10;
                let top = parseInt(
                    $("#userSprite").children().first().css("top"),
                    10
                );
                let left = parseInt(
                    $("#userSprite").children().first().css("left"),
                    10
                );
                var x; var y;
                switch (event.keyCode) {
                    case 38:
                        // up arrow
                        x = left;
                        y = top - movement;

                        checkEvent(x, y);
                        if (!canMove) {
                            // reset values
                            x = left;
                            y = top + movement;
                        } else {
                            // change animation
                            if (moveDirection === "up") {
                                if (moveIdle === true) {
                                    // change animation to moving
                                    $("#userSprite")
                                        .html("")
                                        .append(
                                            `<img src=${ 
                                                playerSpritesUrl 
                                                }/${ 
                                                userData.sprite 
                                                }/up-move.png>`
                                        );
                                    moveIdle = false;
                                } else {
                                    // change animation to idling
                                    $("#userSprite")
                                        .html("")
                                        .append(
                                            `<img src=${ 
                                                playerSpritesUrl 
                                                }/${ 
                                                userData.sprite 
                                                }/up-idle.png>`
                                        );
                                    moveIdle = true;
                                }
                            } else {
                                // always idling to the new direction
                                $("#userSprite")
                                    .html("")
                                    .append(
                                        `<img src=${ 
                                            playerSpritesUrl 
                                            }/${ 
                                            userData.sprite 
                                            }/up-idle.png>`
                                    );
                                moveDirection = "up";
                                moveIdle = true;
                            }
                            $("#userSprite")
                                .children()
                                .css({ top: `${y  }px`, left: x });
                        }

                        break;
                    case 37:
                        // left arrow
                        x = left - movement;
                        y = top;

                        checkEvent(x, y);
                        if (!canMove) {
                            // reset values
                            x = left + movement;
                            y = top;
                        } else {
                            // change animation
                            if (moveDirection === "left") {
                                if (moveIdle === true) {
                                    // change animation to moving
                                    $("#userSprite")
                                        .html("")
                                        .append(
                                            `<img src=${ 
                                                playerSpritesUrl 
                                                }/${ 
                                                userData.sprite 
                                                }/left-move.png>`
                                        );
                                    moveIdle = false;
                                } else {
                                    // change animation to idling
                                    $("#userSprite")
                                        .html("")
                                        .append(
                                            `<img src=${ 
                                                playerSpritesUrl 
                                                }/${ 
                                                userData.sprite 
                                                }/left-idle.png>`
                                        );
                                    moveIdle = true;
                                }
                            } else {
                                // always idling to the new direction
                                $("#userSprite")
                                    .html("")
                                    .append(
                                        `<img src=${ 
                                            playerSpritesUrl 
                                            }/${ 
                                            userData.sprite 
                                            }/left-idle.png>`
                                    );
                                moveDirection = "left";
                                moveIdle = true;
                            }
                            $("#userSprite")
                                .children()
                                .css({ top: y, left: `${x  }px` });
                        }
                        break;
                    case 39:
                        // right arrow
                        x = left + movement;
                        y = top;

                        checkEvent(x, y);
                        if (!canMove) {
                            // reset values
                            x = left - movement;
                            y = top;
                        } else {
                            // change animation
                            if (moveDirection === "right") {
                                if (moveIdle === true) {
                                    // change animation to moving
                                    $("#userSprite")
                                        .html("")
                                        .append(
                                            `<img src=${ 
                                                playerSpritesUrl 
                                                }/${ 
                                                userData.sprite 
                                                }/right-move.png>`
                                        );
                                    moveIdle = false;
                                } else {
                                    // change animation to idling
                                    $("#userSprite")
                                        .html("")
                                        .append(
                                            `<img src=${ 
                                                playerSpritesUrl 
                                                }/${ 
                                                userData.sprite 
                                                }/right-idle.png>`
                                        );
                                    moveIdle = true;
                                }
                            } else {
                                // always idling to the new direction
                                $("#userSprite")
                                    .html("")
                                    .append(
                                        `<img src=${ 
                                            playerSpritesUrl 
                                            }/${ 
                                            userData.sprite 
                                            }/right-idle.png>`
                                    );
                                moveDirection = "right";
                                moveIdle = true;
                            }
                            $("#userSprite")
                                .children()
                                .css({ top: y, left: `${x  }px` });
                        }
                        break;
                    case 40:
                        // down arrow
                        x = left;
                        y = top + movement;

                        checkEvent(x, y);
                        if (!canMove) {
                            // reset values
                            x = left;
                            y = top - movement;
                        } else {
                            // change animation
                            if (moveDirection === "down") {
                                if (moveIdle === true) {
                                    // change animation to moving
                                    $("#userSprite")
                                        .html("")
                                        .append(
                                            `<img src=${ 
                                                playerSpritesUrl 
                                                }/${ 
                                                userData.sprite 
                                                }/down-move.png>`
                                        );
                                    moveIdle = false;
                                } else {
                                    // change animation to idling
                                    $("#userSprite")
                                        .html("")
                                        .append(
                                            `<img src=${ 
                                                playerSpritesUrl 
                                                }/${ 
                                                userData.sprite 
                                                }/down-idle.png>`
                                        );
                                    moveIdle = true;
                                }
                            } else {
                                // always idling to the new direction
                                $("#userSprite")
                                    .html("")
                                    .append(
                                        `<img src=${ 
                                            playerSpritesUrl 
                                            }/${ 
                                            userData.sprite 
                                            }/down-idle.png>`
                                    );
                                moveDirection = "down";
                                moveIdle = true;
                            }
                            $("#userSprite")
                                .children()
                                .css({ top: `${y  }px`, left: x });
                        }
                        break;
                    case 65:
                        // A button
                        if (inEventRange === true) {
                            if (eventType === "conversation") {
                                // trigger conversation
                                values = {
                                    user,
                                    conversationId,
                                };
                                startConversation(values);
                            } else {
                                // special event
                                processEvent(eventCode);
                            }
                        }
                        break;

                    case 13:
                        // Enter button
                        // open menu
                        inPc = false;
                        $("#inventoryModal").removeAttr("hidden").modal("show");
                        break;

                    default: break;
                }
                break;

                default: break;
        }
    });

    function getUserData(user) {
        // get values of user when its changed so we can use it in javascript functions
        const values = {
            user,
        };
        ajax.getDetails("/play/getData", values).done((response) => {
            if (response.success !== undefined) {
                userData = response.success;
            }
        });
    }


    function processMap(currentMap, nextMap) {
        const values = {
            map: nextMap,
            user,
            prevMap: currentMap,
        };
        ajax.getDetails("/play/getMap", values).done((response) => {
            if (response.success !== undefined) {
                const main = response.success.mainSprite;
                const event = response.success.eventSprite;
                const {id} = response.success;

                // get new user data
                getUserData(user);

                // append map to playfield

                $("#mainSprite").html("");
                $("#userSprite").html("");

                $("#mainSprite").append(
                    `<img src=${  mapsUrl  }/${  id  }/${  main  }>`
                );

                context = canvas.getContext("2d");
                img = new Image();
                img.onload = function () {
                    context.drawImage(img, 0, 0);
                };
                img.src = `${ mapsUrl }/${  id  }/${  event}`;

                // load sprite
                $("#userSprite").append(
                    `<img src=${ 
                        playerSpritesUrl 
                        }/${ 
                        userData.sprite 
                        }/${ 
                        response.position.direction 
                        }-idle.png>`
                );
                moveDirection = "up";
                if (response.position !== undefined) {
                    $("#userSprite")
                        .children()
                        .css({
                            top: `${response.position.charY  }px`,
                            left: `${response.position.charX  }px`,
                        });
                }

                window.location.reload();
            } else {
                // TODO what do we do here
            }
        });
    }

    $(".characterButton").on("click", () => {
        $("#characterModal").modal("show");
        // load characters from DB and show them in format

        values = {
            user,
        };
        if (inPc === true) {
            values.pc = true;
        }
        ajax.getDetails("/play/getCharacterRoster", values).done((
            response
        ) => {
            if (response.success !== undefined) {
                const charData = response.success;
                if (response.moveList !== undefined) {
                    const {moveList} = response;
                }
                // clear div
                $("#characterList").html("");
                // append data to div
                $.each(charData, (i) => {
                    // get sprite id
                    const img =
                        `/sprites/characters/${ 
                        charData[i].char_name 
                        }/sprite.png`;
                    const exp = charData[i].exp - (charData[i].exp / 1000) * 1000;
                    const lvl = charData[i].level;
                    const atk = (charData[i].atkMax / 100) * lvl;
                    const def = (charData[i].defMax / 100) * lvl;
                    const spe = (charData[i].speedMax / 100) * lvl;

                    // check moves
                    let moveDiv = "";
                    $.each(moveList[i], (j) => {
                        moveDiv +=
                            `<tr><td>${ 
                            moveList[i][j].type 
                            }</td><td>${ 
                            moveList[i][j].name 
                            }</td><td>${ 
                            moveList[i][j].description 
                            }</td><td>${ 
                            moveList[i][j].power 
                            }</td><td>${ 
                            moveList[i][j].accuracy 
                            }</td><td>${ 
                            moveList[i][j].cost 
                            }</td>`;
                    });

                    $("#characterList").append(
                        `<div class='buttonPos' id='${ 
                            charData[i].position 
                            }'><button value='${ 
                            charData[i].position 
                            }' class='float-right btn btn-default btn-success'>Sort</button></div>`
                    );
                    $("#characterList").append(
                        `${"<div class=cont><div class='leftrow'>" +
                            "<img class='spriteImg' src='"}${ 
                            img 
                            }'>` +
                            `<div class='toprow'><div class='charName'>${ 
                            charData[i].char_name 
                            }<div class='charLevel'>Lv.${ 
                            lvl 
                            }<div class='exp'>Exp:${ 
                            exp 
                            }/1000</div>` +
                            `</div></div></div>` +
                            `<div class='middlerow'><div class='health'>HP:${ 
                            charData[i].healthPointsCurrent 
                            }/${ 
                            charData[i].healthpoints 
                            }</div>` +
                            `<div class='stamina'>ST:${ 
                            charData[i].staminaPointsCurrent 
                            }/${ 
                            charData[i].staminapoints 
                            }</div>` +
                            `</div>` +
                            `<div class='thirdrow'><div>${ 
                            charData[i].type 
                            }</div></div>` +
                            `<div class='fourthrow'><div>${ 
                            charData[i].skill_name 
                            }: ${ 
                            charData[i].skill_desc 
                            }</div></div>` +
                            `<div class='rightrow'><table class='table-bordered'>` +
                            `<tr><td class='firstTD'>ATK:</td><td>${ 
                            atk 
                            }</td></tr>` +
                            `<tr><td class='firstTD'>DEF:</td><td>${ 
                            def 
                            }</td></tr>` +
                            `<tr><td class='firstTD'>SPE:</td><td>${ 
                            spe 
                            }</td></tr>` +
                            `</table></div></div>` +
                            `<div class='moverow'><table class='table-bordered'><th>Type</th><th>Name</th><th>Description</th><th>Power</th><th>Accuracy</th><th>Cost</th>${ 
                            moveDiv 
                            }</table></div></div>`
                    );
                });
                $("#characterList").children().slice(12).css({
                    "background-color": "black",
                    color: "white",
                });
            } else {
                // TODO proper error logging
            }
        });
    });

    $(".itemsButton").on("click", () => {
        $("#itemsModal").modal("show");
        // load items from DB
        values = {
            user,
        };

        ajax.getDetails("/play/getItems", values).done((response) => {
            if (response.success !== undefined) {
                const itemList = response.success;
                let itemDiv = "";
                $("#itemsDiv").empty();
                $.each(itemList, (i) => {
                    const img =
                        `/sprites/items/${  itemList[i].name  }/sprite.png`;
                    const useButton =
                        itemList[i].category !== "battle_item"
                            ? `<button id='${ 
                              itemList[i].id 
                              }'class='btn-success btn btn-default itemUse'>Use</button>`
                            : "";

                    itemDiv +=
                        `<tbody><tr class='itemFrame'><td><img class='itemImg' src='${ 
                        img 
                        }'></td>` +
                        `<td>${ 
                        itemList[i].name 
                        }</td>` +
                        `<td>${ 
                        itemList[i].desc 
                        }</td>` +
                        `<td>${ 
                        itemList[i].stock 
                        }</td>` +
                        `<td>${ 
                        useButton 
                        }</td></tr>`;
                });

                $("#itemsDiv").append(
                    `${"<table class='table-bordered'>" +
                        "<th></th>" +
                        "<th>Name</th>" +
                        "<th>Desc</th>" +
                        "<th>Stock</th>" +
                        "<tbody>"}${ 
                        itemDiv 
                        }</tbody></table>`
                );
            }
        });
    });

    $(".dataButton").on("click", () => {
        $("#dataModal").modal("show");
        // open and build trainer card
        // get current info from user we will be using in the card
        values = {
            user,
        };

        ajax.getDetails("play/getDataCard", values).done((response) => {
            if (response.success !== undefined) {
                $("#cardDiv").empty();
                const data = response.success;
                const img = `/sprites/player/card/${  data.sprite  }.png`;

                const cardDiv =
                    `${"<div id='cardCont'>" +
                    "<div id='cardSpriteDiv'><img id='cardSprite' src='"}${ 
                    img 
                    }'></div>` +
                    `<div id='cardName'>${ 
                    data.nick 
                    }</div>` +
                    `<div id='cardBalance'>Balance: ${ 
                    data.balance 
                    }</div>` +
                    `<div id='cardBadges'>Badges: ${ 
                    data.progress 
                    }</div>` +
                    `</div>`;

                $("#cardDiv").append(cardDiv);
            } else {
                // TODO proper error logging
            }
        });
    });

    let positionArray = [];
    // TODO what is this doing here ^
    $(document).on("click", ".buttonPos", function () {
        positionArray.push($(this).children().first().val());

        $(this)
            .children()
            .first()
            .removeClass("btn-success")
            .addClass("btn-danger")
            .html("Sorting...");
        if (positionArray.length === 2) {
            let canSort = true;
            for (let i = 0; i < positionArray.length; i+=1) {
                if (i === 0) {
                    const num = positionArray[i];
                } else if (positionArray[i] === num) {
                        // clicked the same button twice
                        $(".buttonPos")
                            .children()
                            .removeClass("btn-danger")
                            .addClass("btn-success")
                            .html("Sort");
                        positionArray = [];
                        canSort = false;
                    }
            }
            if (canSort === true) {
                // change positions
                const values = {
                    pos1: positionArray[0],
                    pos2: positionArray[1],
                    user,
                };
                if (inPc === true) {
                    values.pc = true;
                }

                ajax.getDetails("/play/sortCharacters", values).done((
                    response
                ) => {
                    if (response.success !== undefined) {
                        const charData = response.success;
                        if (response.moveList !== undefined) {
                            const moveList = response.moveList;
                        }
                        // clear div
                        $("#characterList").html("");
                        // append data to div
                        $.each(charData, (i) => {
                            // get sprite id
                            const img =
                                `/sprites/characters/${ 
                                charData[i].char_name 
                                }/sprite.png`;
                            const exp =
                                charData[i].exp -
                                (charData[i].exp / 1000) * 1000;
                            const lvl = charData[i].level;
                            const atk = (charData[i].atkMax / 100) * lvl;
                            const def = (charData[i].defMax / 100) * lvl;
                            const spe = (charData[i].speedMax / 100) * lvl;

                            // check moves
                            let moveDiv = "";
                            $.each(moveList[i], (j) => {
                                moveDiv +=
                                    `<tr><td>${ 
                                    moveList[i][j].type 
                                    }</td><td>${ 
                                    moveList[i][j].name 
                                    }</td><td>${ 
                                    moveList[i][j].description 
                                    }</td><td>${ 
                                    moveList[i][j].power 
                                    }</td><td>${ 
                                    moveList[i][j].accuracy 
                                    }</td><td>${ 
                                    moveList[i][j].cost 
                                    }</td>`;
                            });

                            $("#characterList").append(
                                `<div class='buttonPos' id='${ 
                                    charData[i].position 
                                    }'><button value='${ 
                                    charData[i].position 
                                    }' class='float-right btn btn-default btn-success'>Sort</button></div>`
                            );
                            $("#characterList").append(
                                `${"<div class=cont><div class='leftrow'>" +
                                    "<img class='spriteImg' src='"}${ 
                                    img 
                                    }'>` +
                                    `<div class='toprow'><div class='charName'>${ 
                                    charData[i].char_name 
                                    }<div class='charLevel'>Lv.${ 
                                    lvl 
                                    }<div class='exp'>Exp:${ 
                                    exp 
                                    }/1000</div>` +
                                    `</div></div></div>` +
                                    `<div class='middlerow'><div class='health'>HP:${ 
                                    charData[i].healthPointsCurrent 
                                    }/${ 
                                    charData[i].healthpoints 
                                    }</div>` +
                                    `<div class='stamina'>ST:${ 
                                    charData[i].staminaPointsCurrent 
                                    }/${ 
                                    charData[i].staminapoints 
                                    }</div>` +
                                    `</div>` +
                                    `<div class='thirdrow'><div>${ 
                                    charData[i].type 
                                    }</div></div>` +
                                    `<div class='fourthrow'><div>${ 
                                    charData[i].skill_name 
                                    }: ${ 
                                    charData[i].skill_desc 
                                    }</div></div>` +
                                    `<div class='rightrow'><table class='table-bordered'>` +
                                    `<tr><td class='firstTD'>ATK:</td><td>${ 
                                    atk 
                                    }</td></tr>` +
                                    `<tr><td class='firstTD'>DEF:</td><td>${ 
                                    def 
                                    }</td></tr>` +
                                    `<tr><td class='firstTD'>SPE:</td><td>${ 
                                    spe 
                                    }</td></tr>` +
                                    `</table></div></div>` +
                                    `<div class='moverow'><table class='table-bordered'><th>Type</th><th>Name</th><th>Description</th><th>Power</th><th>Accuracy</th><th>Cost</th>${ 
                                    moveDiv 
                                    }</table></div></div>`
                            );
                        });

                        $("#characterList").children().slice(12).css({
                            "background-color": "black",
                            color: "white",
                        });
                        // reset sort
                        $(".buttonPos")
                            .children()
                            .removeClass("btn-danger")
                            .addClass("btn-success")
                            .html("Sort");
                        positionArray = [];
                    } else {
                        // TODO proper error logging
                    }
                });
            }
        } else if (positionArray.length > 2) {
            $(".buttonPos")
                .children()
                .removeClass("btn-danger")
                .addClass("btn-success")
                .html("Sort");
            positionArray = [];
        }
    });

    $(".buyButton").on("click", () => {
        $("#buyModal").modal("show");
        const shopId = $("#shopModal")
            .children()
            .children()
            .children()
            .first()
            .attr("data-id");
        // show buy modal with data
        values = {
            shopId,
            user,
        };

        ajax.getDetails("/play/getBuyData", values).done((response) => {
            if (response.success !== undefined) {
                const itemList = response.success;
                let shopDiv = "";
                $("#shopBuyList").empty();
                $.each(itemList, (i) => {
                    const img =
                        `/sprites/items/${  itemList[i].name  }/sprite.png`;

                    shopDiv +=
                        `<tbody><tr class='itemFrame'><td><img class='itemImg' src='${ 
                        img 
                        }'></td>` +
                        `<td>${ 
                        itemList[i].name 
                        }</td>` +
                        `<td>${ 
                        itemList[i].description 
                        }</td>` +
                        `<td>${ 
                        itemList[i].buyPrice 
                        }</td>` +
                        `<td><input type='number' class='itemBuyNum'><button id='${ 
                        itemList[i].id 
                        }'class='btn-success btn btn-default buyItemButton'>Buy</button></td></tr>`;
                });

                $("#shopBuyList").append(
                    `Balance: ${ 
                        response.balance.balance 
                        }<table class='table-bordered'>` +
                        `<th></th>` +
                        `<th>Name</th>` +
                        `<th>Description</th>` +
                        `<th>Buy price</th>` +
                        `<tbody>${ 
                        shopDiv 
                        }</tbody></table>`
                );
            }
        });
    });

    $(".sellButton").on("click", () => {
        $("#sellModal").modal("show");
        const shopId = $("#shopModal")
            .children()
            .children()
            .children()
            .first()
            .attr("data-id");
        // use user inventory to sell items and get money
        values = {
            user,
        };

        ajax.getDetails("/play/getSellData", values).done((response) => {
            if (response.success !== undefined) {
                const itemList = response.success;
                let shopDiv = "";
                $("#shopSellList").empty();
                $.each(itemList, (i) => {
                    const img =
                        `/sprites/items/${  itemList[i].name  }/sprite.png`;

                    shopDiv +=
                        `<tbody><tr class='itemFrame'><td><img class='itemImg' src='${ 
                        img 
                        }'></td>` +
                        `<td>${ 
                        itemList[i].name 
                        }</td>` +
                        `<td>${ 
                        itemList[i].description 
                        }</td>` +
                        `<td>${ 
                        itemList[i].stock 
                        }</td>` +
                        `<td>${ 
                        itemList[i].sellPrice 
                        }</td>` +
                        `<td><input type='number' max='${ 
                        itemList[i].stock 
                        }' class='itemBuyNum'><button id='${ 
                        itemList[i].name 
                        }'class='btn-success btn btn-default sellItemButton'>Sell</button></td></tr>`;
                });

                $("#shopSellList").append(
                    `Balance: ${ 
                        response.balance.balance 
                        }<table class='table-bordered'>` +
                        `<th></th>` +
                        `<th>Name</th>` +
                        `<th>Desc</th>` +
                        `<th>Stock</th>` +
                        `<th>Sell price</th>` +
                        `<tbody>${ 
                        shopDiv 
                        }</tbody></table>`
                );
            }
        });
    });

    $(document).on("click", ".buyItemButton", () => {
        const numberOfItems = this.previousElementSibling.value;
        if (numberOfItems !== "") {
            // buy item
            values = {
                user,
                stock: numberOfItems,
                item: this.id,
            };

            ajax.getDetails("/play/buyItem", values).done((response) => {
                if (response.success !== undefined) {
                    // reset shop so balance is updated
                    const shopId = $("#shopModal")
                        .children()
                        .children()
                        .children()
                        .first()
                        .attr("data-id");
                    values = {
                        user,
                        shopId,
                    };
                    ajax.getDetails("/play/getBuyData", values).done((
                        response
                    ) => {
                        if (response.success !== undefined) {
                            const itemList = response.success;
                            let shopDiv = "";
                            $("#shopBuyList").empty();
                            $.each(itemList, (i) => {
                                const img =
                                    `/sprites/items/${ 
                                    itemList[i].name 
                                    }/sprite.png`;

                                shopDiv +=
                                    `<tbody><tr class='itemFrame'><td><img class='itemImg' src='${ 
                                    img 
                                    }'></td>` +
                                    `<td>${ 
                                    itemList[i].name 
                                    }</td>` +
                                    `<td>${ 
                                    itemList[i].description 
                                    }</td>` +
                                    `<td>${ 
                                    itemList[i].buyPrice 
                                    }</td>` +
                                    `<td><input type='number' class='itemBuyNum'><button id='${ 
                                    itemList[i].id 
                                    }'class='btn-success btn btn-default buyItemButton'>Buy</button></td></tr>`;
                            });

                            $("#shopBuyList").append(
                                `Balance: ${ 
                                    response.balance.balance 
                                    }<table class='table-bordered'>` +
                                    `<th></th>` +
                                    `<th>Name</th>` +
                                    `<th>Description</th>` +
                                    `<th>Buy price</th>` +
                                    `<tbody>${ 
                                    shopDiv 
                                    }</tbody></table>`
                            );
                        }
                    });
                } else {
                    // TODO proper error logging
                }
            });
        }
    });

    $(document).on("click", ".sellItemButton", () => {
        const numberOfItems = this.previousElementSibling.value;
        if (numberOfItems !== "") {
            // buy item
            values = {
                user,
                stock: numberOfItems,
                item: this.id,
            };

            ajax.getDetails("/play/sellItem", values).done((response) => {
                if (response.success !== undefined) {
                    // reset inventory so balance is updated
                    const shopId = $("#shopModal")
                        .children()
                        .children()
                        .children()
                        .first()
                        .attr("data-id");
                    values = {
                        user,
                        shopId,
                    };

                    ajax.getDetails("/play/getSellData", values).done((
                        response
                    ) => {
                        if (response.success !== undefined) {
                            const itemList = response.success;
                            let shopDiv = "";
                            $("#shopSellList").empty();
                            $.each(itemList, (i) => {
                                const img =
                                    `/sprites/items/${ 
                                    itemList[i].name 
                                    }/sprite.png`;

                                shopDiv +=
                                    `<tbody><tr class='itemFrame'><td><img class='itemImg' src='${ 
                                    img 
                                    }'></td>` +
                                    `<td>${ 
                                    itemList[i].name 
                                    }</td>` +
                                    `<td>${ 
                                    itemList[i].description 
                                    }</td>` +
                                    `<td>${ 
                                    itemList[i].stock 
                                    }</td>` +
                                    `<td>${ 
                                    itemList[i].sellPrice 
                                    }</td>` +
                                    `<td><input type='number' class='itemBuyNum'><button id='${ 
                                    itemList[i].name 
                                    }'class='btn-success btn btn-default sellItemButton'>Sell</button></td></tr>`;
                            });

                            $("#shopSellList").append(
                                `Balance: ${ 
                                    response.balance.balance 
                                    }<table class='table-bordered'>` +
                                    `<th></th>` +
                                    `<th>Name</th>` +
                                    `<th>Desc</th>` +
                                    `<th>Stock</th>` +
                                    `<th>Sell price</th>` +
                                    `<tbody>${ 
                                    shopDiv 
                                    }</tbody></table>`
                            );
                        }
                    });
                } else {
                    // TODO proper error logging
                }
            });
        }
    });

    $(document).on("click", ".itemUse", () => {
        // open modal similar to characters and give option to use item on them
        $("#itemUseModal").modal("show");
        values = {
            user,
        };
        const {id} = this;

        ajax.getDetails("/play/getCharacterRoster", values).done((
            response
        ) => {
            if (response.success !== undefined) {
                const charData = response.success;
                // clear div
                $("#itemUseList").html("");
                // append data to div
                $.each(charData, (i) => {
                    // get sprite id
                    const img =
                        `/sprites/characters/${ 
                        charData[i].char_name 
                        }/sprite.png`;
                    const exp = charData[i].exp - (charData[i].exp / 1000) * 1000;
                    const lvl = charData[i].exp / 1000;

                    $("#itemUseList").append(
                        `<div class='itemPos' id='${ 
                            charData[i].position 
                            }'><button value='${ 
                            charData[i].position 
                            }' id='${ 
                            id 
                            }' class='float-right btn btn-default btn-success useItemButton'>Use</button></div>`
                    );

                    $("#itemUseList").append(
                        `${"<div class=cont><div class='leftrow'>" +
                            "<img class='spriteImg' src='"}${ 
                            img 
                            }'>` +
                            `<div class='toprow'><div class='charName'>${ 
                            charData[i].char_name 
                            }<div class='charLevel'>Lv.${ 
                            lvl 
                            }<div class='exp'>Exp:${ 
                            exp 
                            }/1000</div>` +
                            `</div></div></div>` +
                            `<div class='middlerow'><div class='health'>HP:${ 
                            charData[i].healthPointsCurrent 
                            }/${ 
                            charData[i].healthpoints 
                            }</div>` +
                            `<div class='stamina'>ST:${ 
                            charData[i].staminaPointsCurrent 
                            }/${ 
                            charData[i].staminapoints 
                            }</div>` +
                            `</div>` +
                            `<div class='thirdrow'><div>${ 
                            charData[i].type 
                            }</div></div>` +
                            `<div class='fourthrow'><div>${ 
                            charData[i].skill_name 
                            }: ${ 
                            charData[i].skill_desc 
                            }</div></div>`
                    );
                });
            } else {
                // TODO proper error logging
            }
        });
    });

    $(document).on("click", ".useItemButton", function () {
        // use item on specific character, check if the item usage benefits them, and if so, delete the item from the inventory stock
        values = {
            user,
            itemId: this.id,
            position: this.parentElement.id,
        };
        const {id} = this;

        ajax.getDetails("/play/useItem", values).done((response) => {
            if (response.success !== undefined) {
                // reload character modal with updated values
                values = {
                    user,
                };
                ajax.getDetails("/play/getCharacterRoster", values).done((
                    response
                ) => {
                    if (response.success !== undefined) {
                        const charData = response.success;
                        // clear div
                        $("#itemUseList").empty();
                        // append data to div
                        $.each(charData, (i) => {
                            // get sprite id
                            const img =
                                `/sprites/characters/${ 
                                charData[i].char_name 
                                }/sprite.png`;
                            const exp =
                                charData[i].exp -
                                (charData[i].exp / 1000) * 1000;
                            const lvl = charData[i].exp / 1000;

                            $("#itemUseList").append(
                                `<div class='itemPos' id='${ 
                                    charData[i].position 
                                    }'><button value='${ 
                                    charData[i].position 
                                    }' id='${ 
                                    id 
                                    }' class='float-right btn btn-default btn-success useItemButton'>Use</button></div>`
                            );
                            $("#itemUseList").append(
                                `${"<div class=cont><div class='leftrow'>" +
                                    "<img class='spriteImg' src='"}${ 
                                    img 
                                    }'>` +
                                    `<div class='toprow'><div class='charName'>${ 
                                    charData[i].char_name 
                                    }<div class='charLevel'>Lv.${ 
                                    lvl 
                                    }<div class='exp'>Exp:${ 
                                    exp 
                                    }/1000</div>` +
                                    `</div></div></div>` +
                                    `<div class='middlerow'><div class='health'>HP:${ 
                                    charData[i].healthPointsCurrent 
                                    }/${ 
                                    charData[i].healthpoints 
                                    }</div>` +
                                    `<div class='stamina'>ST:${ 
                                    charData[i].staminaPointsCurrent 
                                    }/${ 
                                    charData[i].staminapoints 
                                    }</div>` +
                                    `</div>` +
                                    `<div class='thirdrow'><div>${ 
                                    charData[i].type 
                                    }</div></div>` +
                                    `<div class='fourthrow'><div>${ 
                                    charData[i].skill_name 
                                    }: ${ 
                                    charData[i].skill_desc 
                                    }</div></div>`
                            );
                        });
                    } else {
                        // TODO proper error logging
                    }
                });
            } else {
                // TODO proper error logging
            }
        });
    });

    $("#itemUseModal").on("hide.bs.modal", () => {
        // reload items modal so item quantity updates
        values = {
            user,
        };
        ajax.getDetails("/play/getItems", values).done((response) => {
            if (response.success !== undefined) {
                const itemList = response.success;
                let itemDiv = "";
                $("#itemsDiv").empty();
                $.each(itemList, (i) => {
                    const img =
                        `/sprites/items/${  itemList[i].name  }/sprite.png`;
                    const useButton =
                        itemList[i].category !== "battle_item"
                            ? `<button id='${ 
                              itemList[i].id 
                              }'class='btn-success btn btn-default itemUse'>Use</button>`
                            : "";

                    itemDiv +=
                        `<tbody><tr class='itemFrame'><td><img class='itemImg' src='${ 
                        img 
                        }'></td>` +
                        `<td>${ 
                        itemList[i].name 
                        }</td>` +
                        `<td>${ 
                        itemList[i].desc 
                        }</td>` +
                        `<td>${ 
                        itemList[i].stock 
                        }</td>` +
                        `<td>${ 
                        useButton 
                        }</td></tr>`;
                });

                $("#itemsDiv").append(
                    `${"<table class='table-bordered'>" +
                        "<th></th>" +
                        "<th>Name</th>" +
                        "<th>Desc</th>" +
                        "<th>Stock</th>" +
                        "<tbody>"}${ 
                        itemDiv 
                        }</tbody></table>`
                );
            }
        });
    });

    $("#shopModal").on("hide.bs.modal", () => {
        processEvent(21);
    });

    $(document).on("click", ".genderButton", function () {
        if (this.id === "femaleSprite") {
            values.sprite = "F";
        } else {
            values.sprite = "M";
        }
        values.user = user;

        ajax.getDetails("/play/chooseSprite", values).done((response) => {
            if (response.success !== undefined) {
                $(".genderButton").remove();
            }
        });
    });

    function getBattleData(trainerId, rivalId) {
        // receive battlers id, return two arrays with all the data
        values = {
            trainer: trainerId,
            rival: rivalId,
        };
        ajax.getDetails("/play/getBattleData", values).done((response) => {
            if (response.success !== undefined) {
                trainerData = response.success[0];
                rivalData = response.success[1];

                startBattle();
            } else {
                // TODO proper error logging
            }
        });
    }

    function startBattle() {
        // create all the non-dynamic elements
        $("#playField").attr("hidden", "true");
        $("#battlePlayfield").removeAttr("hidden");
        $("#buttonBar").attr("hidden", "true");
        // append non-specific sprites, trainer char position, rival char position, UI with the battle info for each
        // append playfield buttons which we'll be toggling each turn and which open modals
        // this is the function for the first turn of the battle
        // show start battle text

        switch (rivalData[0].data.owner) {
            case "#rival_1":
                $("#battleText")
                    .html("Marisa has challenged you to a battle!")
                    .fadeToggle(2000, () => {
                        $("#battleText")
                            .empty()
                            .html(
                                turnBasedSkills(
                                    trainerData[0].data.skill_id,
                                    trainerData[0]
                                )
                            )
                            .fadeToggle(2000, () => {
                                $("#battleText")
                                    .empty()
                                    .html(
                                        turnBasedSkills(
                                            rivalData[0].data.skill_id,
                                            rivalData[0]
                                        )
                                    )
                                    .fadeToggle(2000, () => {
                                        $("#buttonBar").removeAttr("hidden");
                                        // ready for turn 1
                                    });
                            });
                    });
                // start battle
                // append
                // check skills that are turn-based or one-time
                // because they all are triggered at the same time, we call them on a function
                reloadBattleData();

                break;
            case "#route1_trainer1":
                $("#battleText")
                    .html("Ace Trainer Mauricio challenges you!")
                    .fadeToggle(2000, () => {
                        $("#battleText")
                            .empty()
                            .html(
                                turnBasedSkills(
                                    trainerData[0].data.skill_id,
                                    trainerData[0]
                                )
                            )
                            .fadeToggle(2000, () => {
                                $("#battleText")
                                    .empty()
                                    .html(
                                        turnBasedSkills(
                                            rivalData[0].data.skill_id,
                                            rivalData[0]
                                        )
                                    )
                                    .fadeToggle(2000, () => {
                                        $("#buttonBar").removeAttr("hidden");
                                        // ready for turn 1
                                    });
                            });
                    });

                reloadBattleData();

                break;
            case "#gymleader_1":
                $("#battleText")
                    .html("Gym Leader Aya challenges you!")
                    .fadeToggle(2000, () => {
                        $("#battleText")
                            .empty()
                            .html(
                                turnBasedSkills(
                                    trainerData[0].data.skill_id,
                                    trainerData[0]
                                )
                            )
                            .fadeToggle(2000, () => {
                                $("#battleText")
                                    .empty()
                                    .html(
                                        turnBasedSkills(
                                            rivalData[0].data.skill_id,
                                            rivalData[0]
                                        )
                                    )
                                    .fadeToggle(2000, () => {
                                        $("#buttonBar").removeAttr("hidden");
                                        // ready for turn 1
                                    });
                            });
                    });

                reloadBattleData();

                break;
            default:
                $("#battleText")
                    .html(`Wild ${  rivalData[0].data.char_name  } appears!`)
                    .fadeToggle(2000, () => {
                        $("#battleText")
                            .empty()
                            .html(
                                turnBasedSkills(
                                    trainerData[0].data.skill_id,
                                    trainerData[0]
                                )
                            )
                            .fadeToggle(2000, () => {
                                $("#battleText")
                                    .empty()
                                    .html(
                                        turnBasedSkills(
                                            rivalData[0].data.skill_id,
                                            rivalData[0]
                                        )
                                    )
                                    .fadeToggle(2000, () => {
                                        $("#buttonBar").removeAttr("hidden");
                                        // ready for turn 1
                                    });
                            });
                    });
                reloadBattleData();
                break;
        }
    }

    $("#atkBtn").on("click", () => {
        // open attack list modal
        $("#atkBattleModal").modal("show");
        $(".atkCommand").remove();

        // fill atk modal
        const j = 1;
        for (let i = 0; i <= 4; i += 1) {
            if (trainerData[0].moves[i] !== undefined) {
                // assign to button
                $(`#atkBtn${  j}`).append(
                    `<button class='atkCommand btn btn-default btn-lg' data-position='${ 
                        i 
                        }' id='${ 
                        trainerData[0].moves[i].id 
                        }'>${ 
                        trainerData[0].moves[i].name 
                        }<br>${ 
                        trainerData[0].moves[i].type 
                        }<br> Cost:${ 
                        trainerData[0].moves[i].cost 
                        }    </button>`
                );
            }
        }
    });

    $("#itemBtn").on("click", () => {
        // open items list modal
        $("#itemsModal").modal("show"); // reusage of modal :(
        // fill items modal with battle items
        values = {
            user,
        };

        ajax.getDetails("/play/getItems", values).done((response) => {
            if (response.success !== undefined) {
                const itemList = response.success;
                let itemDiv = "";
                $("#itemsDiv").empty();
                $.each(itemList, (i) => {
                    const img =
                        `/sprites/items/${  itemList[i].name  }/sprite.png`;
                    if (combatType !== "trainer" && itemList[i].id === 1) {
                        // allow usage of capture device only if its not a trainer battle
                        useButton =
                            `<button id='${ 
                            itemList[i].id 
                            }' class='btn-success btn btn-default itemBattleUse'>Use</button>`;
                    } else if (itemList[i].id !== 1) {
                            useButton =
                                `<button id='${ 
                                itemList[i].id 
                                }' class='btn-success btn btn-default itemBattleUse'>Use</button>`;
                        } else {
                            useButton = "";
                        }

                    itemDiv +=
                        `<tbody><tr class='itemFrame'><td><img class='itemImg' src='${ 
                        img 
                        }'></td>` +
                        `<td>${ 
                        itemList[i].name 
                        }</td>` +
                        `<td>${ 
                        itemList[i].desc 
                        }</td>` +
                        `<td>${ 
                        itemList[i].stock 
                        }</td>` +
                        `<td>${ 
                        useButton 
                        }</td></tr>`;
                });

                $("#itemsDiv").append(
                    `${"<table class='table-bordered'>" +
                        "<th></th>" +
                        "<th>Name</th>" +
                        "<th>Desc</th>" +
                        "<th>Stock</th>" +
                        "<tbody>"}${ 
                        itemDiv 
                        }</tbody></table>`
                );
            }
        });
    });

    $("#charBtn").on("click", () => {
        // open character list modal
        $("#charBattleModal").modal("show");
        $("#charList").html("");
        // append data to div
        $.each(trainerData, (i) => {
            // get sprite id
            const img =
                `/sprites/characters/${ 
                trainerData[i].data.char_name 
                }/sprite.png`;
            const lvl = trainerData[i].data.level;

            let moveDiv = "";
            $.each(trainerData[i].moves, (j) => {
                moveDiv +=
                    `<tr><td>${ 
                    trainerData[i].moves[j].type 
                    }</td><td>${ 
                    trainerData[i].moves[j].name 
                    }</td><td>${ 
                    trainerData[i].moves[j].description 
                    }</td><td>${ 
                    trainerData[i].moves[j].power 
                    }</td><td>${ 
                    trainerData[i].moves[j].accuracy 
                    }</td><td>${ 
                    trainerData[i].moves[j].cost 
                    }</td>`;
            });

            $("#charList").append(
                `<div class='charCommand' id='${ 
                    trainerData[i].data.position 
                    }'><button value='${ 
                    trainerData[i].data.position 
                    }' class='float-right btn btn-default btn-success'>Change</button></div>`
            );
            $("#charList").append(
                `${"<div class=cont><div class='leftrow'>" +
                    "<img class='spriteImg' src='"}${ 
                    img 
                    }'>` +
                    `<div class='toprow'><div class='charName'>${ 
                    trainerData[i].data.char_name 
                    }<div class='charLevel'>Lv.${ 
                    lvl 
                    }</div></div></div>` +
                    `<div class='middlerow'><div class='health'>HP:${ 
                    trainerData[i].data.healthPoints 
                    }/${ 
                    trainerData[i].data.maxHealth 
                    }</div>` +
                    `<div class='stamina'>ST:${ 
                    trainerData[i].data.staminaPoints 
                    }/${ 
                    trainerData[i].data.maxStamina 
                    }</div>` +
                    `</div>` +
                    `<div class='thirdrow'><div>${ 
                    trainerData[i].data.type 
                    }</div></div>` +
                    `<div class='fourthrow'><div>${ 
                    trainerData[i].data.skill_name 
                    }: ${ 
                    trainerData[i].data.skill_desc 
                    }</div></div>` +
                    `<div class='moverow'><table class='table-bordered'><th>Type</th><th>Name</th><th>Description</th><th>Power</th><th>Accuracy</th><th>Cost</th>${ 
                    moveDiv 
                    }</table></div></div>`
            );
        });
    });

    $("#escBtn").on("click", () => {
        if (combatType !== "trainer") {
            finishBattle(trainerData, "null");
        } else {
            // show in textbox that you cant escape from a trainer battle
            $("#buttonBar")
                .attr("hidden", "true")
                .fadeToggle(100, () => {
                    $("#battleText")
                        .html("You can't escape a trainer battle!")
                        .fadeToggle(2000, () => {
                            $("#battleText").html("");
                            $("#buttonBar").removeAttr("hidden");
                        });
                });
        }
    });

    $(document).on("click", ".atkCommand", function () {
        userAction = "attack";
        idAction = [this.id, this.dataset.position];
        $("#atkBattleModal").modal("hide");
        processBattleTurn(userAction, idAction);
        // using an attack command spends the turn, calling process turn, processing the command
    });

    $(document).on("click", ".itemBattleUse", function () {
        // open characters modal from array
        // fill with array
        const {id} = this;
        // check if its capturing device
        if (this.id == 1) {
            $("#itemsModal").modal("hide");
            $("#itemUseList").html("");
            $("#buttonBar").attr("hidden", "true");

            // calculations for capture
            const chance = Math.floor(Math.random() * 100);
            if (chance > 0) {
                // captured
                $("#battleText")
                    .html("Captured successfully!")
                    .fadeToggle(2000, () => {
                        values = {
                            user,
                            rivalId: rivalData[0].data.owner,
                        };
                        ajax.getDetails("/play/getCapturedChar", values).done(
                            (response) => {
                                if (response.success !== undefined) {
                                    captured = true;
                                    finishBattle();
                                }
                            }
                        );
                    });
            } else {
                // proceed with turn
                $("#battleText")
                    .html("Failed to capture!")
                    .fadeToggle(2000, () => {
                        processBattleTurn("item", "");
                    });
            }
        } else {
            $("#itemUseModal").modal("show");
            $("#itemUseList").html("");
            // append data to div
            $.each(trainerData, (i) => {
                // get sprite id
                const img =
                    `/sprites/characters/${ 
                    trainerData[i].data.char_name 
                    }/sprite.png`;
                const lvl = trainerData[i].data.level;

                $("#itemUseList").append(
                    `<div class='itemPos' id='${ 
                        trainerData[i].data.position 
                        }'><button value='${ 
                        trainerData[i].data.position 
                        }' id='${ 
                        id 
                        }' class='float-right btn btn-default btn-success itemCommand'>Use</button></div>`
                );
                $("#itemUseList").append(
                    `${"<div class=cont><div class='leftrow'>" +
                        "<img class='spriteImg' src='"}${ 
                        img 
                        }'>` +
                        `<div class='toprow'><div class='charName'>${ 
                        trainerData[i].data.char_name 
                        }<div class='charLevel'>Lv.${ 
                        lvl 
                        }</div></div></div>` +
                        `<div class='middlerow'><div class='health'>HP:${ 
                        trainerData[i].data.healthPoints 
                        }/${ 
                        trainerData[i].data.maxHealth 
                        }</div>` +
                        `<div class='stamina'>ST:${ 
                        trainerData[i].data.staminaPoints 
                        }/${ 
                        trainerData[i].data.maxStamina 
                        }</div>` +
                        `</div>` +
                        `<div class='thirdrow'><div>${ 
                        trainerData[i].data.type 
                        }</div></div>` +
                        `<div class='fourthrow'><div>${ 
                        trainerData[i].data.skill_name 
                        }: ${ 
                        trainerData[i].data.skill_desc 
                        }</div></div>`
                );
            });
        }
    });

    $(document).on("click", ".itemCommand", function () {
        // use item, spend command
        const itemId = parseInt(this.id);
        const position = parseInt(this.parentElement.id);
        // there are several types of items, so we'll leave open other kinds of checking
        switch (itemId) {
            case 2:
                // heal 20 hp
                // check hp
                if (
                    trainerData[position].data.healthPoints !==
                    trainerData[position].data.maxHealth
                ) {
                    var leftToMax =
                        trainerData[position].data.maxHealth -
                        trainerData[position].data.healthPoints;
                    var heal = 20;
                    if (leftToMax < heal) {
                        heal -= leftToMax;
                    }
                    // give hp
                    trainerData[position].data.healthPoints += heal;
                    // process turn
                    $("#itemUseModal").modal("hide").empty();
                    $("#itemsModal").modal("hide").empty();
                    userAction = "item";
                    idAction = "Potion";
                    reloadBattleData();
                    processBattleTurn(userAction, idAction);
                }
                break;
            case 3:
                // heal 50 hp
                // check hp, it is repeated code, but consider if we had 20 types of items, each with their own special effects, making an automated function for what seems to be 4 items at most is not so important
                if (
                    trainerData[position].data.healthPoints !==
                    trainerData[position].data.maxHealth
                ) {
                    var leftToMax =
                        trainerData[position].data.maxHealth -
                        trainerData[position].data.healthPoints;
                    var heal = 20;
                    if (leftToMax < heal) {
                        heal -= leftToMax;
                    }
                    // give hp
                    trainerData[position].data.healthPoints += heal;
                    // process turn
                    $("#itemUseModal").modal("hide").empty();
                    $("#itemsModal").modal("hide").empty();
                    userAction = "item";
                    idAction = "Super Potion";
                    reloadBattleData();
                    processBattleTurn(userAction, idAction);
                    // notice that we only process this line if the item can actually be used on the character
                }
                break;
            default: break;
        }
    });

    $(document).on("click", ".charCommand", function () {
        $("#charBattleModal").modal("hide");
        const newChar = this.id;
        $("#battleText").html(
            `Great job, ${  trainerData[0].data.char_name  }!`
        );
        trainerData.swap(newChar, 0);
        $("#buttonBar").attr("hidden", "true");
        $("#battleText").fadeToggle(2000, () => {
            $("#battleText")
                .empty()
                .html(`Let's do this, ${  trainerData[0].data.char_name  }!`)
                .fadeToggle(2000, () => {
                    reloadBattleData();
                    if (fainted === false) {
                        userAction = "change";
                        idAction = "";
                        processBattleTurn(userAction, idAction);
                    } else {
                        $("#buttonBar").show(); // turn ended
                    }
                });
            // reload data
        });
    });

    function typeWeakness(typeAtk, typeDef) {
        switch (typeAtk) {
            case "Normal":
                switch (typeDef) {
                    case "Dark":
                        return 0.75;
                    default:
                        return 1;
                }

            case "Poison":
                switch (typeDef) {
                    case "Dark":
                        return 1.25;
                    default:
                        return 1;
                }

            case "Dark":
                switch (typeDef) {
                    case "Normal":
                        return 1.25;
                    case "Poison":
                        return 0.75;
                    default:
                        return 1;
                }

            case "Flying":
                switch (typeDef) {
                    case "Electric":
                        return 0.75;
                    default:
                        return 1;
                }

            case "Electric":
                switch (typeDef) {
                    case "Flying":
                        return 0.75;
                    default:
                        return 1;
                }
            
            default: break;
        }
    }

    function switchFaintedChar() {
        $("#charBattleModal").modal("show");
        $("#charList").html("");
        fainted = true;
        // append data to div
        $.each(trainerData, (i) => {
            // get sprite id
            const img =
                `/sprites/characters/${ 
                trainerData[i].data.char_name 
                }/sprite.png`;
            const lvl = trainerData[i].data.level;

            let moveDiv = "";
            $.each(trainerData[i].moves, (j) => {
                moveDiv +=
                    `<tr><td>${ 
                    trainerData[i].moves[j].type 
                    }</td><td>${ 
                    trainerData[i].moves[j].name 
                    }</td><td>${ 
                    trainerData[i].moves[j].description 
                    }</td><td>${ 
                    trainerData[i].moves[j].power 
                    }</td><td>${ 
                    trainerData[i].moves[j].accuracy 
                    }</td><td>${ 
                    trainerData[i].moves[j].cost 
                    }</td>`;
            });

            $("#charList").append(
                `<div class='charCommand' id='${ 
                    trainerData[i].data.position 
                    }'><button value='${ 
                    trainerData[i].data.position 
                    }' class='float-right btn btn-default btn-success'>Change</button></div>`
            );
            $("#charList").append(
                `${"<div class=cont><div class='leftrow'>" +
                    "<img class='spriteImg' src='"}${ 
                    img 
                    }'>` +
                    `<div class='toprow'><div class='charName'>${ 
                    trainerData[i].data.char_name 
                    }<div class='charLevel'>Lv.${ 
                    lvl 
                    }</div></div></div>` +
                    `<div class='middlerow'><div class='health'>HP:${ 
                    trainerData[i].data.healthPoints 
                    }/${ 
                    trainerData[i].data.maxHealth 
                    }</div>` +
                    `<div class='stamina'>ST:${ 
                    trainerData[i].data.staminaPoints 
                    }/${ 
                    trainerData[i].data.maxStamina 
                    }</div>` +
                    `</div>` +
                    `<div class='thirdrow'><div>${ 
                    trainerData[i].data.type 
                    }</div></div>` +
                    `<div class='fourthrow'><div>${ 
                    trainerData[i].data.skill_name 
                    }: ${ 
                    trainerData[i].data.skill_desc 
                    }</div></div>` +
                    `<div class='moverow'><table class='table-bordered'><th>Type</th><th>Name</th><th>Description</th><th>Power</th><th>Accuracy</th><th>Cost</th>${ 
                    moveDiv 
                    }</table></div></div>`
            );
        });
    }

    function checkSupportAttack(moveId, attackerId) {
        // check id of support attacks and act accordingly
        switch (moveId) {
            case 2:
                // raise self defense by 1
                attackerId === "user"
                    ? (trainerData[0].data.def += 1)
                    : rivalData[0].data.def;
                return "'s defense raised by 1.";
            case 4:
                // speed +1
                attackerId === "user"
                    ? (trainerData[0].data.speed += 1)
                    : rivalData[0].data.speed;
                return "'s speed raised by 1.";
            case 8:
                // reduces enemy speed by 1
                attackerId === "user"
                    ? (rivalData[0].data.speed -= 1)
                    : (trainerData[0].data.speed -= 1);
                return "'s defense raised by 1.";
            case 11:
                // raise all stats by 1
                if (attackerId === "user") {
                    trainerData[0].data.atk += 1;
                    trainerData[0].data.def += 1;
                    trainerData[0].data.speed += 1;
                } else {
                    rivalData[0].data.atk += 1;
                    rivalData[0].data.def += 1;
                    rivalData[0].data.speed += 1;
                }
                return "'s stats raised";
            case 13:
                // restore 50% health
                attackerId === "user"
                    ? (trainerData[0].data.healthPoints +=
                          (trainerData[0].data.healthPoints * 50) / 100)
                    : (rivalData[0].data.healthPoints +=
                          (rivalData[0].data.healthPoints * 50) / 100);
                return "'s health restored.";
            default: break;
        }
    }

    function finishBattle(trainerData, result) {
        // check finish of the battle and result
        if (result === "lose") {
            // uh oh u lost
            $("#battleText")
                .html("You lost!")
                .fadeToggle(2000, () => {
                    if (rivalData[0].data.owner === "#rival_1") {
                        // only battle where losing is allowed
                        // trigger conversation
                        $("#playField").attr("hidden", "true");
                        $("#battlePlayfield").removeAttr("hidden");
                        $("#buttonBar").attr("hidden", "true");
                        values = {
                            user,
                            conversationId: 7,
                        };
                        startConversation(values);
                    } else {
                        window.location.reload();
                    }
                });
        } else if (result === "win") {
            // you win epic
            // update new stats
            values = {
                user,
                data: trainerData,
            };
            ajax.getDetails("/play/updateData", values).done((response) => {
                if (response.success !== undefined) {
                    $("#battleText")
                        .html("You win!")
                        .fadeToggle(2000, () => {
                            $("#battlePlayfield").attr("hidden", "true");
                            $("#playField").removeAttr("hidden");
                            $("#buttonBar").attr("hidden", "true");
                            switch (rivalData[0].data.owner) {
                                case "#rival_1":
                                    // trigger conversation
                                    values = {
                                        user,
                                        conversationId: 8,
                                    };
                                    startConversation(values);
                                    break;
                                case "#route1_trainer1":
                                    // trigger conversation
                                    values = {
                                        user,
                                        conversationId: 12,
                                    };
                                    startConversation(values);
                                    break;
                                case "#gymleader_1":
                                    // trigger conversation
                                    values = {
                                        user,
                                        conversationId: 21,
                                    };
                                    startConversation(values);
                                    break;
                                default:
                                    // TODO what
                                    break;
                            }
                        });
                } else {
                    // TODO what
                }
            });
        } else {
            // wild battle
            if (captured === false) {
                // delete temporary character
                values = {
                    tempUser: rivalData[0].data.owner,
                };
                ajax.getDetails("/play/deleteTempChar", values).done(() => {});
            }
            $("#battlePlayfield").attr("hidden", "true");
            $("#playField").removeAttr("hidden");
            $("#buttonBar").attr("hidden", "true");
            controlEnvironment = "field";
        }
    }

    function attackProcess(attackerId, positionId) {
        if (attackerId === "user") {
            // our turn
            // atk formula: userAttack+atkPow*(100/(100+rivalDefense))
            // check if its a power-based attack
            if (trainerData[0].moves[positionId].power > 0) {
                var attackFormula =
                    trainerData[0].data.atk +
                    trainerData[0].moves[positionId].power *
                        (100 / (100 + rivalData[0].data.def));
                // check STAB and type
                if (
                    trainerData[0].data.type ===
                    trainerData[0].moves[positionId].type
                ) {
                    attackFormula *= 1.25;
                }
                // type weakness chart
                attackFormula *= typeWeakness(
                    trainerData[0].moves[positionId].type,
                    rivalData[0].data.type
                ); // returns type multiplier
                attackFormula = Math.floor(attackFormula / 2);
                // formula finished, now we check acc
                var {accuracy} = trainerData[0].moves[positionId];
                // get random number, if its higher than accuracy, move fails, easy
                var hits = Math.floor(Math.random() * 100);
                if (hits > accuracy) {
                    $("#battleText")
                        .html("Attack failed!")
                        .fadeToggle(2000, () => {
                            $("#battleText").html("");
                        });
                    return true;
                } 
                    // hit
                    trainerData[0].data.staminaPoints -=
                        trainerData[0].moves[positionId].cost;
                    // check if its THAT skill
                    if (trainerData[0].moves[positionId].id === 9) {
                        rivalData[0].data.healthPoints = 0;
                        $("#battleText").html(
                            "The judgment has been cast. Sentence is death."
                        );
                    } else if (
                        rivalData[0].data.healthPoints - attackFormula <
                        0
                    ) {
                        rivalData[0].data.healthPoints = 0;
                    } else {
                        rivalData[0].data.healthPoints -= attackFormula;
                    }
                    // check if rival's dead
                    if (rivalData[0].data.healthPoints <= 0) {
                        // give exp
                        if (combatType === "trainer") {
                            // 500exp
                            trainerData[0].data.exp += 500;
                        } else {
                            trainerData[0].data.exp += 100;
                        }

                        if (rivalData[1] === undefined) {
                            // no one else left, finish battle
                            // call finish battle function TODO
                            reloadBattleData();
                            finishBattle(trainerData, "win");
                        } else {
                            // release next character
                            rivalData.shift();
                            reloadBattleData();
                            return false;
                        }
                    } else {
                        reloadBattleData();
                        return true;
                    }
                
            } else {
                var {accuracy} = trainerData[0].moves[positionId];
                // get random number, if its higher than accuracy, move fails, easy
                var hits = Math.floor(Math.random() * 100);
                if (hits > accuracy) {
                    $("#battleText").html("Attack failed!");
                    return true;
                } 
                    const html = checkSupportAttack(
                        trainerData[0].moves[positionId].id,
                        attackerId
                    );
                    $("#battleText").html(trainerData[0].data.char_name + html);
                    reloadBattleData();
                    return true;
                
            }
        } else {
            // when its the enemy turn, he just chooses a random attack
            const attack =
                rivalData[0].moves[
                    Math.floor(Math.random() * rivalData[0].moves.length)
                ];
            if (attack.power > 0) {
                // attack is the random attack
                var attackFormula =
                    rivalData[0].data.atk +
                    attack.power * (100 / (100 + trainerData[0].data.def));
                // check STAB and type
                if (rivalData[0].data.type === attack.type) {
                    attackFormula *= 1.25;
                }
                // type weakness chart
                attackFormula *= typeWeakness(
                    attack.type,
                    trainerData[0].data.type
                ); // returns type multiplier
                attackFormula = Math.floor(attackFormula / 2);
                // formula finished, now we hit
                var {accuracy} = attack;
                // get random number, if its higher than accuracy, move fails, easy
                var hits = Math.floor(Math.random() * 100);
                if (hits > accuracy) {
                    $("#battleText")
                        .html("Attack failed!")
                        .fadeToggle(2000, () => {
                            $("#battleText").html("");
                        });
                    return true;
                } 
                    // hit
                    rivalData[0].data.staminaPoints -= attack.cost;
                    // check if its THAT skill
                    if (attack.id === 9) {
                        trainerData[0].data.healthPoints = 0;
                        $("#battleText").html(
                            "The judgment has been casted. Sentence is death."
                        );
                    } else if (
                        trainerData[0].data.healthPoints - attackFormula <
                        0
                    ) {
                        trainerData[0].data.healthPoints = 0;
                    } else {
                        trainerData[0].data.healthPoints -= attackFormula;
                        $("#battleText")
                            .html(
                                `${rivalData[0].data.char_name 
                                    } uses ${ 
                                    attack.name}`
                            )
                            .fadeToggle(2000, () => {
                                $("#battleText").html("");
                            });
                    }
                    // check if youre dead
                    if (trainerData[0].data.healthPoints <= 0) {
                        if (trainerData[1] === undefined) {
                            // no one else left, you lose lmao TODO
                            const result = "lose";
                            finishBattle(trainerData, result);
                        } else {
                            // release next character
                            switchFaintedChar();
                            reloadBattleData();
                            return false;
                        }
                    } else {
                        reloadBattleData();
                        return true;
                    }
                
            } else {
                var {accuracy} = attack;
                // get random number, if its higher than accuracy, move fails, easy
                var hits = Math.floor(Math.random() * 100);
                if (hits > accuracy) {
                    $("#battleText").html("Attack failed!");
                    return true;
                } 
                    const html = checkSupportAttack(attack.id, attackerId);
                    $("#battleText").html(rivalData[0].data.char_name + html);
                    reloadBattleData();
                    return true;
                
            }
        }
    }

    function processBattleTurn(userAction, idAction) {
        // here is whats going to happen EVERY TURN
        // remove and re-add all elements so they get updated every turn with minimal weight (no 40000 ajax calls)
        // show the commands box
        // check whether a skill has been triggered
        $("#buttonBar").attr("hidden", "true");
        // check id event and action
        switch (userAction) {
            case "attack":
                // attack command, id is the attack that has been used
                // check speeds
                if (trainerData[0].data.speed > rivalData[0].data.speed) {
                    $("#battleText")
                        .html(
                            `${trainerData[0].data.char_name 
                                } uses ${ 
                                trainerData[0].moves[idAction[1]].name}`
                        )
                        .fadeToggle(2000, () => {
                            let canAttack = attackProcess("user", idAction[1]);
                            $("#battleText").fadeToggle(2000, () => {
                                // enemy turn
                                if (canAttack) {
                                    canAttack = attackProcess("rival", "");
                                    $("#battleText").fadeToggle(
                                        2000,
                                        () => {
                                            if (!canAttack) {
                                                // dead
                                                switchFaintedChar();
                                            } else {
                                                // turn over
                                                turnBasedSkills(
                                                    trainerData[0].data
                                                        .skill_id,
                                                    trainerData[0]
                                                );
                                                turnBasedSkills(
                                                    trainerData[0].data
                                                        .skill_id,
                                                    rivalData[0]
                                                );
                                                $("#buttonBar").removeAttr(
                                                    "hidden"
                                                );
                                            }
                                        }
                                    );
                                } else {
                                    // turn over
                                    turnBasedSkills(
                                        trainerData[0].data.skill_id,
                                        trainerData[0]
                                    );
                                    turnBasedSkills(
                                        trainerData[0].data.skill_id,
                                        rivalData[0]
                                    );
                                    $("#buttonBar").removeAttr("hidden");
                                }
                            });
                        });
                } else {
                    // they attack first
                    const canAttack = attackProcess("rival", "");
                    $("#battleText").fadeToggle(2000, () => {
                        // our turn
                        if (!canAttack) {
                            // dead
                            switchFaintedChar();
                        } else {
                            attackProcess("user", idAction);
                            $("#battleText").fadeToggle(2000, () => {
                                // turn over
                                $("#buttonBar").removeAttr("hidden");
                            });
                        }
                    });
                }

                break;

            case "item":
                // item has already been used, just show text with item name
                $("#battleText")
                    .html(`Used ${  idAction}`)
                    .fadeToggle(2000, () => {
                        // enemy turn
                        const canAttack = attackProcess("rival", "");
                        $("#battleText").fadeToggle(2000, () => {
                            // our turn
                            if (!canAttack) {
                                // ur dead lol
                                switchFaintedChar();
                            } else {
                                // turn over
                                $("#buttonBar").removeAttr("hidden");
                            }
                        });
                    });
                break;

            case "change":
                // no attack
                // they attack
                const canAttack = attackProcess("rival", "");
                $("#battleText").fadeToggle(2000, () => {
                    // our turn
                    if (!canAttack) {
                        // ur dead lol
                        switchFaintedChar();
                    } else {
                        // turn over
                        $("#buttonBar").removeAttr("hidden");
                    }
                });
            break;

            default: break;
        }
    }

    // what is this for?
    function toggleCall(user, eventId) {
        values = {
            user,
            eventId,
        };

        ajax.getDetails("/play/toggleCallable", values).done(() => {});
    }
});
