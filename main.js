const gameBoard = () => {
    const $pturn = $('.player-turn');
    const $square = $('.square');
    let plays = [];
    let turn = 'p1';

    $pturn.show();

    const drawBoard = () => {
        plays.forEach(play => {
            const col = play.position[0];
            const row = play.position[1];
            const marker = play.move;

            if (marker == 'X') {
                $(`.square.col-${col}.row-${row}`).text(marker).css('color', '#394a51');
            } else {
                $(`.square.col-${col}.row-${row}`).text(marker).css('color', '#fdc57b');
            };
        });
    };

    const displayTurn = () => {
        if (turn == 'p1') {
            $pturn.find('span').text(playerSetup[0].name);
        } else {
            $pturn.find('span').text(playerSetup[1].name);
        };
        if (turn == 'comp' && $('.player-turn').is(':visible')) {
            setTimeout(compMove, 1000);
        };
    };

    displayTurn();

    const playerMove = (e) => {
        const $target = $(e.target);

        if ($target.text() == '') {
            const col = ((($target.attr('class')).split(' '))[1]).substr(-1);
            const row = ((($target.attr('class')).split(' '))[2]).substr(-1);

            if (turn == 'p1') {
                plays.push({ position: [col, row], move: 'X' });
                if (playerSetup[1].playerType == 'computer') {
                    turn = 'comp';
                } else {
                    turn = 'p2';
                };
            } else if (turn == 'p2') {
                plays.push({ position: [col, row], move: 'O' });
                turn = 'p1';
            };
        };
        drawBoard();
        checkWin(plays);
        displayTurn();
    };

    const compMove = () => {
        //random
        let empty = [];
        $square.each(function () {
            if ($(this).text() == '') {
                empty.push($(this).index() + 1);
            };
        });
        console.log(empty)
        const random = Math.floor(Math.random() * empty.length);
        const randomPos = empty[random];
        const col = ($(`.square:nth-child(${randomPos})`).attr('class').split(' '))[1].substr(-1);
        const row = ($(`.square:nth-child(${randomPos})`).attr('class').split(' '))[2].substr(-1);

        plays.push({ position: [col, row], move: 'O' });
        turn = 'p1';

        drawBoard();
        checkWin(plays);
        displayTurn();
    };

    $square.on('click', playerMove);
};

const Player = function (playerType, name) {
    this.playerType = playerType;
    this.name = name;
};

const playerSetup = (() => {
    const $pChoice = $('.p-choose');
    const $p1 = $('.p1-input');
    const $p2 = $('.p2-input');
    let playType = 'comp';
    let players = [];

    const createPlayer = (playerType, name) => {
        const newPlayer = new Player(playerType, name);
        players.push(newPlayer);
    };

    $('#1play').on('click', function () {
        $pChoice.removeClass('show-popup');
        $p1.addClass('show-popup');
    });

    $('#2play').on('click', function () {
        playType = 'player';
        $pChoice.removeClass('show-popup');
        $p1.addClass('show-popup');
    });

    $p1.find('button').on('click', function () {
        if ($p1.find('input').val() != '') {
            createPlayer('player', $p1.find('input').val());
            $p1.removeClass('show-popup');
            if (playType == 'player') {
                $p2.addClass('show-popup');
            } else {
                createPlayer('computer', 'computer');
                $('.popup-container').hide();
                gameBoard();
            };
        };
    });
    $p2.find('button').on('click', function () {
        if ($p2.find('input').val() != '') {
            createPlayer('player', $p2.find('input').val());
            $('.popup-container').hide();
            gameBoard();
        };
    });

    return players;
})();

const checkWin = (plays) => {
    const $win = $('.winner');
    const $pturn = $('.player-turn');
    const xSpots = plays.filter(play => play.move == 'X').map(play => play.position);
    const oSpots = plays.filter(play => play.move == 'O').map(play => play.position);
    const xCols = [];
    const xRows = [];
    const oCols = [];
    const oRows = [];

    const drawLine = () => {
        let a = p1.x - p2.x;
        let b = p1.y - p2.y;
        let length = Math.sqrt(a * a + b * b);

        let angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

        let pointWidth = $('.square').width() * .5;
        let pointHeight = $('.square').height() * .5;

        $('.line').css({ 'width': `${length}px`, 'left': `${p1.x + pointWidth}px`, 'top': `${p1.y + pointHeight}px`, 'transform': `rotate(${angleDeg}deg)` });
    };


    xSpots.forEach(spot => {
        xCols[spot[0]] = xCols[spot[0]] ? xCols[spot[0]] + 1 : 1;
        xRows[spot[1]] = xRows[spot[1]] ? xRows[spot[1]] + 1 : 1;
    });

    oSpots.forEach(spot => {
        oCols[spot[0]] = oCols[spot[0]] ? oCols[spot[0]] + 1 : 1;
        oRows[spot[1]] = oRows[spot[1]] ? oRows[spot[1]] + 1 : 1;
    });

    let win;
    let p1 = {};
    let p2 = {};

    if (xCols.some(x => x == 3)) {
        win = `.col-${xCols.indexOf(3)}`;
        p1 = { x: $(win).eq(0).offset().left, y: $(win).eq(0).offset().top };
        p2 = { x: $(win).eq(2).offset().left, y: $(win).eq(2).offset().top };

        console.log(p1, p2)

        drawLine();
        $win.text(`${playerSetup[0].name.toUpperCase()} won!`);
        $pturn.hide();
        return;
    };
    if (xRows.some(x => x == 3)) {
        win = `.row-${xRows.indexOf(3)}`;
        p1 = { x: $(win).eq(0).offset().left, y: $(win).eq(0).offset().top };
        p2 = { x: $(win).eq(2).offset().left, y: $(win).eq(2).offset().top };

        drawLine();
        $win.text(`${playerSetup[0].name.toUpperCase()} won!`);
        $pturn.hide();
        return;
    };
    if (xSpots.some(x => x[0] == 2 && x[1] == 2)) {
        if (xSpots.some(x => x[0] == 1 && x[1] == 3) && xSpots.some(x => x[0] == 3 && x[1] == 1)) {
            p1 = { x: $('.square').eq(2).offset().left, y: $('.square').eq(2).offset().top };
            p2 = { x: $('.square').eq(6).offset().left, y: $('.square').eq(6).offset().top };

            drawLine();
            $win.text(`${playerSetup[0].name.toUpperCase()} won!`);
            $pturn.hide();
            return;
        };
        if (xSpots.some(x => x[0] == 1 && x[1] == 1) && xSpots.some(x => x[0] == 3 && x[1] == 3)) {
            p1 = { x: $('.square').eq(0).offset().left, y: $('.square').eq(0).offset().top };
            p2 = { x: $('.square').eq(8).offset().left, y: $('.square').eq(8).offset().top };

            drawLine();
            $win.text(`${playerSetup[0].name.toUpperCase()} won!`);
            $pturn.hide();
            return;
        };
    };
    if (oCols.some(x => x == 3)) {
        win = `.col-${oCols.indexOf(3)}`;
        p1 = { x: $(win).eq(0).offset().left, y: $(win).eq(0).offset().top };
        p2 = { x: $(win).eq(2).offset().left, y: $(win).eq(2).offset().top };

        drawLine();
        $win.text(`${playerSetup[1].name.toUpperCase()} won!`);
        $pturn.hide();
        return;
    };
    if (oRows.some(x => x == 3)) {
        win = `.row-${oCols.indexOf(3)}`;
        p1 = { x: $(win).eq(0).offset().left, y: $(win).eq(0).offset().top };
        p2 = { x: $(win).eq(2).offset().left, y: $(win).eq(2).offset().top };

        drawLine();
        $win.text(`${playerSetup[1].name.toUpperCase()} won!`);
        $pturn.hide();
        return;
    };
    if (oSpots.some(x => x[0] == 2 && x[1] == 2)) {
        if (oSpots.some(x => x[0] == 1 && x[1] == 3) && oSpots.some(x => x[0] == 3 && x[1] == 1)) {
            p1 = { x: $('.square').eq(2).offset().left, y: $('.square').eq(2).offset().top };
            p2 = { x: $('.square').eq(6).offset().left, y: $('.square').eq(6).offset().top };

            drawLine();
            $win.text(`${playerSetup[1].name.toUpperCase()} won!`);
            $pturn.hide();
            return;
        };
        if (oSpots.some(x => x[0] == 1 && x[1] == 1) && oSpots.some(x => x[0] == 3 && x[1] == 3)) {
            p1 = { x: $('.square').eq(0).offset().left, y: $('.square').eq(0).offset().top };
            p2 = { x: $('.square').eq(8).offset().left, y: $('.square').eq(8).offset().top };

            drawLine();
            $win.text(`${playerSetup[1].name.toUpperCase()} won!`);
            $pturn.hide();
            return;
        };
    };
    if (plays.length == 9) {
        $win.text(`It's a tie!`);
        $pturn.hide();
        return;
    };
};


const compCheck = () => {
    //check  if player abt to win
    // check if comp can win
    // else random
    
}