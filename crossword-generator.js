const fs = require('fs');

class CrosswordGenerator {
    constructor() {
        this.words = [];
        this.width = 6;
        this.height = 6;
        this.blackCells = [];
        this.grid = [];
    }

    loadWords(filename = 'words.txt') {
        try {
            const data = fs.readFileSync(filename, 'utf8');
            this.words = data.split('\n')
                .map(word => word.trim().toLowerCase())
                .filter(word => word.length > 0);
            console.log(`Загружено ${this.words.length} слов`);
        } catch (error) {
            console.error('Ошибка загрузки слов:', error.message);
            process.exit(1);
        }
    }

    parseBlackCells(blackCellsStr) {
        if (!blackCellsStr.trim()) return [];
        const cells = [];
        const pairs = blackCellsStr.split(';');
        for (const pair of pairs) {
            const [x, y] = pair.split(',').map(num => parseInt(num.trim()));
            if (!isNaN(x) && !isNaN(y)) {
                cells.push({x, y});
            }
        }
        return cells;
    }

    initializeGrid() {
        this.grid = [];
        for (let y = 0; y < this.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                const isBlack = this.blackCells.some(cell => cell.x === x && cell.y === y);
                this.grid[y][x] = {
                    letter: '',
                    isBlack: isBlack,
                    isHorizontal: false,
                    isVertical: false
                };
            }
        }
    }

    getWordsByLength(length) {
        return this.words.filter(word => word.length === length);
    }

    canPlaceWord(word, startX, startY, direction) {
        const dx = direction === 'horizontal' ? 1 : 0;
        const dy = direction === 'vertical' ? 1 : 0;
        for (let i = 0; i < word.length; i++) {
            const x = startX + i * dx;
            const y = startY + i * dy;
            if (x >= this.width || y >= this.height) return false;
            if (this.grid[y][x].isBlack) return false;
            if (this.grid[y][x].letter && this.grid[y][x].letter !== word[i]) return false;
        }
        return true;
    }

    placeWord(word, startX, startY, direction) {
        const dx = direction === 'horizontal' ? 1 : 0;
        const dy = direction === 'vertical' ? 1 : 0;
        for (let i = 0; i < word.length; i++) {
            const x = startX + i * dx;
            const y = startY + i * dy;
            this.grid[y][x].letter = word[i];
            if (direction === 'horizontal') {
                this.grid[y][x].isHorizontal = true;
            } else {
                this.grid[y][x].isVertical = true;
            }
        }
    }

    getPossiblePositions(word, direction) {
        const positions = [];
        const maxX = direction === 'horizontal' ? this.width - word.length : this.width - 1;
        const maxY = direction === 'vertical' ? this.height - word.length : this.height - 1;
        for (let y = 0; y <= maxY; y++) {
            for (let x = 0; x <= maxX; x++) {
                if (this.canPlaceWord(word, x, y, direction)) {
                    positions.push({x, y});
                }
            }
        }
        return positions;
    }

    validateVerticalWords() {
        for (let x = 0; x < this.width; x++) {
            let word = '';
            let startY = -1;
            for (let y = 0; y < this.height; y++) {
                if (!this.grid[y][x].isBlack) {
                    if (startY === -1) startY = y;
                    word += this.grid[y][x].letter;
                } else {
                    if (word.length > 1) {
                        if (!this.words.includes(word.toLowerCase())) {
                            return false;
                        }
                    }
                    word = '';
                    startY = -1;
                }
            }
            if (word.length > 1) {
                if (!this.words.includes(word.toLowerCase())) {
                    return false;
                }
            }
        }
        return true;
    }

    generate(width, height, blackCellsStr = '') {
        this.width = width;
        this.height = height;
        this.blackCells = this.parseBlackCells(blackCellsStr);
        this.initializeGrid();
        const wordLengths = [3, 4, 5, 6];
        let attempts = 0;
        const maxAttempts = 500;
        while (attempts < maxAttempts) {
            attempts++;
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    if (!this.grid[y][x].isBlack) {
                        this.grid[y][x].letter = '';
                        this.grid[y][x].isHorizontal = false;
                        this.grid[y][x].isVertical = false;
                    }
                }
            }
            let placedWords = 0;
            const maxWords = Math.min(4, Math.floor((this.width * this.height - this.blackCells.length) / 5));
            for (let i = 0; i < maxWords && placedWords < 3; i++) {
                const length = wordLengths[Math.floor(Math.random() * wordLengths.length)];
                const availableWords = this.getWordsByLength(length);
                if (availableWords.length === 0) continue;
                const word = availableWords[Math.floor(Math.random() * availableWords.length)];
                const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
                const positions = this.getPossiblePositions(word, direction);
                if (positions.length > 0) {
                    const pos = positions[Math.floor(Math.random() * positions.length)];
                    this.placeWord(word, pos.x, pos.y, direction);
                    placedWords++;
                }
            }
            if (this.validateVerticalWords()) {
                console.log(`Кроссворд сгенерирован за ${attempts} попыток`);
                return this.grid;
            }
        }
        console.log(`Не удалось сгенерировать валидный кроссворд за ${maxAttempts} попыток`);
        return this.grid;
    }

    printCrossword() {
        console.log(`\nКроссворд ${this.width}x${this.height}:`);
        console.log('='.repeat(this.width * 2 + 1));
        for (let y = 0; y < this.height; y++) {
            let row = '|';
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x].isBlack) {
                    row += '█|';
                } else if (this.grid[y][x].letter) {
                    row += this.grid[y][x].letter.toUpperCase() + '|';
                } else {
                    row += '·|';
                }
            }
            console.log(row);
        }
        console.log('='.repeat(this.width * 2 + 1));
        console.log('\nЧерные клетки:', this.blackCells.length > 0 ? 
            this.blackCells.map(cell => `(${cell.x},${cell.y})`).join(', ') : 'нет');
        console.log('\nСлова в кроссворде:');
        for (let y = 0; y < this.height; y++) {
            let word = '';
            for (let x = 0; x < this.width; x++) {
                if (!this.grid[y][x].isBlack) {
                    word += this.grid[y][x].letter;
                } else {
                    if (word.length > 1) {
                        console.log(`Горизонтально: ${word.toUpperCase()}`);
                    }
                    word = '';
                }
            }
            if (word.length > 1) {
                console.log(`Горизонтально: ${word.toUpperCase()}`);
            }
        }
        for (let x = 0; x < this.width; x++) {
            let word = '';
            for (let y = 0; y < this.height; y++) {
                if (!this.grid[y][x].isBlack) {
                    word += this.grid[y][x].letter;
                } else {
                    if (word.length > 1) {
                        console.log(`Вертикально: ${word.toUpperCase()}`);
                    }
                    word = '';
                }
            }
            if (word.length > 1) {
                console.log(`Вертикально: ${word.toUpperCase()}`);
            }
        }
    }
}

function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log('Использование: node crossword-generator.js <ширина> <высота> [черные_клетки]');
        console.log('Пример: node crossword-generator.js 6 6 "1,1;2,3;4,5"');
        process.exit(1);
    }
    const width = parseInt(args[0]);
    const height = parseInt(args[1]);
    const blackCells = args[2] || '';
    if (width < 3 || height < 3) {
        console.error('Размеры должны быть не менее 3x3');
        process.exit(1);
    }
    const generator = new CrosswordGenerator();
    generator.loadWords();
    console.log(`Генерируем кроссворд ${width}x${height}...`);
    generator.generate(width, height, blackCells);
    generator.printCrossword();
}

if (require.main === module) {
    main();
}

module.exports = CrosswordGenerator;
