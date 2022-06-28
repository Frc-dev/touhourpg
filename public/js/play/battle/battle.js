function reloadBattleData(trainerData, rivalData) {
    // this function allows us to do minimal tinkering whenever we change characters or anything, just having to change
    // the array values, then letting it reload itself
    $("#trainerSprite").empty();
    $("#rivalSprite").empty();
    $("#trainerBar").empty();
    $("#rivalBar").empty();

    const trainerImg =
        `/sprites/characters/${ 
        trainerData[0].data.char_name 
        }/sprite.png`;
    const rivalImg =
        `/sprites/characters/${ 
        rivalData[0].data.char_name 
        }/sprite.png`;
    $("#trainerSprite").attr("src", trainerImg).removeAttr("hidden");
    $("#rivalSprite").attr("src", rivalImg).removeAttr("hidden");
    const tName = trainerData[0].data.char_name;
    const tLevel = trainerData[0].data.level;
    const tHpBar = trainerData[0].data.healthPoints;
    const tStBar = trainerData[0].data.staminaPoints;
    $("#trainerBar").append(
        `<div id='tName'>${ 
            tName 
            }</div>` +
            `<div id='tLevel'>Lv.${ 
            tLevel 
            }</div>` +
            `<div id='tHpBar'>HP: ${ 
            tHpBar 
            }</div>` +
            `<div id='tStBar'>ST: ${ 
            tStBar 
            }</div>`
    );

    const rName = rivalData[0].data.char_name;
    const rLevel = rivalData[0].data.level;
    const rHpBar = rivalData[0].data.healthPoints;
    const rStBar = rivalData[0].data.staminaPoints;
    $("#rivalBar").append(
        `<div id='rName'>${ 
            rName 
            }</div>` +
            `<div id='rLevel'>Lv.${ 
            rLevel 
            }</div>` +
            `<div id='rHpBar'>HP: ${ 
            rHpBar 
            }</div>` +
            `<div id='rStBar'>ST: ${ 
            rStBar 
            }</div>`
    );
    // first turn, get stats
    trainerData[0].data.atk =
        (trainerData[0].data.atkMax / 100) * trainerData[0].data.level;
    trainerData[0].data.def =
        (trainerData[0].data.defMax / 100) * trainerData[0].data.level;
    trainerData[0].data.speed =
        (trainerData[0].data.speedMax / 100) * trainerData[0].data.level;

    rivalData[0].data.atk =
        (rivalData[0].data.atkMax / 100) * rivalData[0].data.level;
    rivalData[0].data.def =
        (rivalData[0].data.defMax / 100) * rivalData[0].data.level;
    rivalData[0].data.speed =
        (rivalData[0].data.speedMax / 100) * rivalData[0].data.level;
}

