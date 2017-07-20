let size = 2;
let intervalId;
let tempCells = {};
let cells = {};
cells['0x0'] = false;
cells['0x1'] = false;
cells['0x2'] = false;
cells['0x3'] = false;

function attachEvents() {
    $('.board').on('click', '.cell', function () {
        if ($('#board').attr('running') == 'false') {
            let id = $(this).attr('id');
            if ($(this).attr('alive') == 'true') {
                $(this).attr('alive', 'false');
                cells[id] = false;
            } else {
                $(this).attr('alive', 'true');
                cells[id] = true;
            }
        }
    });

    $('.error').click(function () {
        $(this).css('display', 'none');
    });

    $('#enter').on('click', function () {
        let inputSize = $('#size').val();
        if (inputSize > 100 || inputSize < 2) {
            $('.error').css('display', 'block');
            return;
        }

        size = inputSize;
        let boardSize = 600;
        let cellSize = boardSize / inputSize;

        $('.board tr').remove();
        for (let i = 0; i < inputSize; i++) {
            let currRow = $('<tr class="row"></tr>');
            for (let j = 0; j < inputSize; j++) {
                cells[i + 'x' + j] = false;
                currRow.append($('<td class="cell"></td>')
                    .attr('alive', 'false')
                    .attr('id', i + 'x' + j)
                    .css('width', cellSize + 'px')
                    .css('height', cellSize + 'px'));
            }

            $('.board').append(currRow);
        }
    });

    $('#start').on('click', function () {
        $('#size').css('display', 'none');
        $('#enter').css('display', 'none');
        $('#start').css('display', 'none');
        $('#pause').css('display', 'block');
        $('#board').attr('running', 'true');

        intervalId = setInterval(function () {
            tempCells = JSON.parse(JSON.stringify(cells));
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    let id = i + 'x' + j;
                    let livingNeighbours = getNumberOfLivingNeighbours(i, j);
                    if (cells[id]) {
                        if (livingNeighbours < 2 || livingNeighbours > 3) {
                            tempCells[id] = false;
                            $('#' + id).attr('alive', 'false');
                        }
                    } else if (livingNeighbours == 3) {
                        tempCells[id] = true;
                        $('#' + id).attr('alive', 'true');
                    }
                }
            }

            cells = JSON.parse(JSON.stringify(tempCells));
        }, Math.max(100, size * 5));
    });

    $('#pause').on('click', function () {
        clearInterval(intervalId);
        $('#size').css('display', 'inline-block');
        $('#enter').css('display', 'inline-block');
        $('#start').css('display', 'block');
        $('#pause').css('display', 'none');
        $('#board').attr('running', 'false');
    });

    function getNumberOfLivingNeighbours(row, col) {
        let count = 0;
        for (let i = row - 1; i <= row + 1; i++) {
            if (i >= 0 && i < size) {
                for (let j = col - 1; j <= col + 1; j++) {
                    if (j >= 0 &&
                        j < size &&
                        !(i == row && j == col)) {
                        let id = i + 'x' + j;
                        if (cells[id]) {
                            count++;
                        }
                    }
                }
            }
        }

        return count;
    }
}