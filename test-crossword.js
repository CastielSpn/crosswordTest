const CrosswordGenerator = require('./crossword-generator.js');

function testCrosswordGenerator() {
    console.log('=== Тестирование генератора кроссвордов ===\n');
    const generator = new CrosswordGenerator();
    generator.loadWords();
    console.log('Тест 1: Кроссворд 6x6 без черных клеток');
    console.log('-'.repeat(50));
    generator.generate(6, 6);
    generator.printCrossword();
    console.log('\n' + '='.repeat(60) + '\n');
    console.log('Тест 2: Кроссворд 6x6 с черными клетками (1,1;2,3;4,5)');
    console.log('-'.repeat(50));
    generator.generate(6, 6, "1,1;2,3;4,5");
    generator.printCrossword();
    console.log('\n' + '='.repeat(60) + '\n');
    console.log('Тест 3: Кроссворд 8x8 с черными клетками (2,2;3,4;5,6)');
    console.log('-'.repeat(50));
    generator.generate(8, 8, "2,2;3,4;5,6");
    generator.printCrossword();
    console.log('\n' + '='.repeat(60) + '\n');
    console.log('Тест 4: Кроссворд 5x5 с черными клетками (1,1;3,3)');
    console.log('-'.repeat(50));
    generator.generate(5, 5, "1,1;3,3");
    generator.printCrossword();
}

testCrosswordGenerator();
