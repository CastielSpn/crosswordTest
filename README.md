# Генератор мини-кроссворда

Генератор кроссвордов с настраиваемыми размерами и черными клетками.
![screenshot1]https://github.com/CastielSpn/crosswordTest/blob/main/image.png

## Файлы

- `crossword-generator.js` - основной генератор (Node.js)
- `crossword.html` - веб-интерфейс
- `server.js` - HTTP сервер для веб-интерфейса
- `test-crossword.js` - тесты генератора
- `words.txt` - словарь (9578 слов)

## Использование

### Консольная версия

```bash
node crossword-generator.js <ширина> <высота> [черные_клетки]
```

Примеры:
```bash
node crossword-generator.js 6 6
node crossword-generator.js 6 6 "1,1;2,3;4,5"
node crossword-generator.js 8 8 "2,2;3,4;5,6"
```

### Веб-интерфейс

1. Запустите сервер:
```bash
node server.js
```

2. Откройте http://localhost:3000 в браузере

3. Укажите размеры и черные клетки

4. Нажмите "Сгенерировать кроссворд"

## Формат черных клеток

Координаты в формате "x,y;x,y":
- `1,1;2,3;4,5` - три черные клетки
- Пустая строка - без черных клеток

## Тестирование

```bash
node test-crossword.js
```

## Требования

- Node.js
- Файл words.txt в той же директории

