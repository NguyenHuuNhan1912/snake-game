// Những thuộc tính chung của snake
const imgSnakeHead = new Image();
const imgSnakeBody = new Image();
const imgSnakeFood = new Image();
imgSnakeHead.src = './assets/snake-head.png';
imgSnakeBody.src = './assets/snake-body.png';
imgSnakeFood.src = './assets/snake-food.png'
var backgroundMain = '#2d333b';
var fontFamily = "'Times New Roman', Times, serif";


var snakeSize = 28; // Độ lớn không gian trò chơi và mỗi ô có width và height là 25px
var rows = 20; // 20 hàng
var cols = 20; // 20 cột
var snakeCanvas; // Biến nhận thẻ canvas từ HTML
var ctx; // Biến thao tác trên thẻ canvas nhận được từ HTML

// Tọa đồ phần đầu của rắn
// Con rắn sẽ xuất hiện ở tọa độ snakeSize*[7:3]
var snakeHeadX = snakeSize * 7; // x = 7
var snakeHeadY = snakeSize * 3; // y = 3

// Biến nhận sự chuyển hướng(đường đi) của rắn
// Ban đầu rắn đứng im nên roadX và roadY đều bằng 0
var roadX = 0;
var roadY = 0;

// Mảng lưu tọa độ thân rắn
var snakeBody = [];

// Tọa độ thức ăn của rắn
var foodX;
var foodY;

// Biến xác định người chơi thua cuộc
var isGameOver = false;

// Object snake chứa các function xử lý chức năng của trò chơi
var snake = {
    setSnake(width, height) {
        snakeCanvas.width = width;
        snakeCanvas.height = height;
        ctx = snakeCanvas.getContext("2d");
    },
    randomFood() {
        // Random các số từ 0 đến 19( vì 0-19 thuộc toạ độ của trò chơi)
        foodX = Math.floor(Math.random() * cols) * snakeSize;
        foodY = Math.floor(Math.random() * rows) * snakeSize;
    },
    drawSnake(color, borderColor, x, y, width, height, img) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = borderColor;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
        if(img !== undefined) {
            ctx.drawImage(img, x, y, width, height);
        }
    },
    snakeEatFood() {
        if (snakeHeadX == foodX && snakeHeadY == foodY) {
            snakeBody.push([foodX, foodY]);
            this.updateScore(snakeBody.length);
            this.randomFood();
        }
    },
    updateScore(score) {
        // score
        var scoreNode = document.querySelector('.snake-score');
        scoreNode.textContent = `ĐIỂM CỦA BẠN: ${score}`;
    },
    snakeConnect() {
        for (let i = snakeBody.length - 1; i > 0; i--) {
            snakeBody[i] = snakeBody[i - 1];
        }
        if (snakeBody.length) {
            snakeBody[0] = [snakeHeadX, snakeHeadY];
        }
    },
    drawBodySnake() {
        for (let i = 0; i < snakeBody.length; i++) {
            snake.drawSnake(backgroundMain, backgroundMain, snakeBody[i][0], snakeBody[i][1], snakeSize, snakeSize, imgSnakeBody);
        }
    },
    changeRoad(roadX, roadY) {
        snakeHeadX += roadX * snakeSize;
        snakeHeadY += roadY * snakeSize;
    },
    changeDirection(e) {
        if ((e.code === "ArrowUp" || e.code === "KeyW") && roadY !== 1) {
            roadX = 0;
            roadY = -1;
        }
        else if ((e.code == "ArrowDown" || e.code === "KeyS") && roadY != -1) {
            roadX = 0;
            roadY = 1;
        }
        else if ((e.code == "ArrowLeft" || e.code === "KeyA") && roadX != 1) {
            roadX = -1;
            roadY = 0;
        }
        else if ((e.code == "ArrowRight" || e.code === "KeyD") && roadX != -1) {
            roadX = 1;
            roadY = 0;
        }
        else if (e.code === "KeyP") {
            alert("Rắn săn mồi cho biết bạn đã tạm dừng trò chơi ! Nhấn ENTER hoặc bấm OK để tiếp tục chơi");
        }
    },
    drawMessage(color, font, text, x, y) {
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.fillText(text, x, y);
    },
    gameOver() {
        this.drawMessage("white", `40px ${fontFamily}`, "THUA ROÀI !", (snakeSize * 10) / 2, (snakeSize * 18) / 2);
        this.drawMessage("white", `35px ${fontFamily}`, "Nhấn phím C để chơi lại !", (snakeSize * 6) / 2, (snakeSize * 22) / 2);
        document.addEventListener("keyup", (e) => {
            if (e.code === "KeyC") {
                location.reload();
            }
        });
    },
    
}

window.onload = function () {

    // Nhận thể canvas từ HTML
    snakeCanvas = document.getElementById("snake-canvas");

    // Tạo tạo độ trò chơi
    snake.setSnake(rows * snakeSize, cols * snakeSize);

    // Thức ăn được xuất hiện ngẫu nhiên trên tọa độ
    snake.randomFood();

    // Sự kiện keyup và hàm changeDirection xử lý phần di chuyển của rắn
    document.addEventListener("keyup", snake.changeDirection);

    // Sau 150 milli giây thì hàm update sẽ được gọi để cập nhật
    setInterval(update, 150); //150 milliseconds
}


function update() {

    // Xử lý khi người chơi thua cuộc
    if (isGameOver) {
        return;
    }

    // Tạo không gian trò chơi
    snake.drawSnake(backgroundMain, backgroundMain, 0, 0, snakeCanvas.width, snakeCanvas.height);

    // Tạo thức ăn
    snake.drawSnake(backgroundMain, backgroundMain, foodX, foodY, snakeSize, snakeSize, imgSnakeFood);

    // Xử lý khi rắn săn được mồi
    snake.snakeEatFood();

    // Xử lý nối thân rắn và đầu rắn để di chuyển cùng nhau
    snake.snakeConnect();

    // Cập nhật hướng(lên xuống trái phải) khi rắn di chuyển
    snake.changeRoad(roadX, roadY);

    // Tạo đầu rắn sau khi được cập nhật
    snake.drawSnake(backgroundMain, backgroundMain, snakeHeadX, snakeHeadY, snakeSize, snakeSize, imgSnakeHead);

    // Tạo thân rắn 
    snake.drawBodySnake();

    // Khi đầu gắn chạm tường -> Trò chơi kết thúc
    if (snakeHeadX < 0 || snakeHeadX > cols * snakeSize || snakeHeadY < 0 || snakeHeadY > rows * snakeSize) {
        isGameOver = true;
        snake.gameOver();

    }

    // Khi đầu rắn chạm vào thân rắn ->  Trò chơi kết thúc
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeHeadX == snakeBody[i][0] && snakeHeadY == snakeBody[i][1]) {
            isGameOver = true;
            snake.gameOver();
        }
    }
}
