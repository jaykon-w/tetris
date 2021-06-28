(function runTetris(){
    const readline = require('readline');
    const keypress = require('keypress');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    keypress(rl.input);

    const clearLine = 0;
    var freespace = [];
    var grid = new Array(16).join('.').split('.').map(e => clearLine);
    const column = 8;
    const shapes = [
        [
            0b11,
            0b11
        ],[
            0b111,
            0b010,
        ],[
            0b10,
            0b10,
            0b11,
        ],[
            0b110,
            0b011,
        ],[
            0b1,
            0b1,
            0b1,
        ]
    ];
    
    const blackspace = '▆';
    const withespace = '▢';

    var last_msg = '';

    function pad(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    function getShape(){
        const sorted = JSON.parse(JSON.stringify(shapes[Math.floor(Math.random() * shapes.length)])).map(e => e << 3);

        return () => sorted;
    }

    var currentShape = getShape();

    var interval = setInterval(update, 500);

    function update(notShift) {
        var mountShape = freespace.concat(currentShape());

        print(grid.map((b, i) => b | mountShape[i]).map(e => {
            return pad(e.toString(2), column).split('').map(a => +a && blackspace || withespace).join(' ');
        }).join('\n')+'\n\n\n\n\n\n');

        if(mountShape.length === grid.length || (JSON.parse(JSON.stringify(mountShape)).reverse().reduce((a, b, i) => a + (b & grid[mountShape.length - i]), 0) ) > clearLine){
            grid = grid.map((b, i) => b | mountShape[i]);
            grid.forEach((e, i) => {
                if(e === 255){
                    grid.splice(i, 1);
                    grid.unshift(clearLine);
                }
            });
            currentShape = getShape();
            freespace = [];
        }else{
            !notShift && freespace.unshift(clearLine);
        }
        if(grid[0] > 0 && !notShift){
            print('VOCÊ PERDEU!!!!!!!'.red);
            clearInterval(interval);
        }
    }

    function print(msg) {
        readline.cursorTo(rl, 0, 0);
        readline.clearScreenDown(rl);
        last_msg = msg;

        rl.write(last_msg);
    }

    function keypressListener(ch, key) {
        var shape = JSON.parse(JSON.stringify(currentShape()));
      if (key.name === 'left'){
        var breakIterA = false;
        var hit = !!shape.filter((e, i) => breakIterA || (e & 0b10000000) || (e << 1 & grid[(i+(freespace.length-1)) | 0])).length;

        var toleft = hit ? shape : shape.map((e, i) => e << 1);
        currentShape = () => toleft;
        update(true);
      } else if (key.name === 'right'){
        var breakIterB = false;
        var hit = !!shape.filter((e, i) => breakIterB || (e & 0b1) || (e >> 1 & grid[(i+(freespace.length-1)) | 0])).length;

        var toright = hit ? shape : shape.map((e, i) => e >> 1);
        currentShape = () => toright;
        update(true);
      } else if (key.name === 'down'){
        update();
      } else if (key.name === 'up'){
        shape = shape.reverse();
        currentShape = () => shape;
        update(true);
      }
      print(last_msg);
    }

    process.stdin.on('keypress', keypressListener);

    process.stdin.setRawMode(true);
    process.stdin.resume();

})();
