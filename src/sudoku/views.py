from django.shortcuts import render, redirect
from .forms import SudokuForm
from django.http import Http404
from random import randint, random


def create_sudoku_view(request):
    if request.method == 'POST':
        form = SudokuForm(request.POST)
        if form.is_valid():
            sudoku = form.save(commit=False)
            sudoku.creator = request.user
            sudoku.save()
            return redirect('sudoku_list')  # Redirect to the list view of Sudoku puzzles
    else:
        form = SudokuForm()
    return render(request, 'sudokuapp/createSudoku.html', {'form': form})

def play_sudoku_view(request, *args, **kwargs):
    print(args, kwargs)
    size = kwargs["block_rows"] * kwargs["block_cols"]

    # Get rid of bad requests with out of bound sudoku sizes 
    if kwargs["block_cols"] < 2 or kwargs["block_rows"] < 2 or size > 16:
        raise Http404
    
    # Decide number of rows and keys in column
    if size == 16:
        key_rows = range(4)
        key_cols = range(1, 5)
    elif size == 4:
        key_rows = range(2)
        key_cols = range(1, 3)
    else:
        cols = round(size**.5)
        key_cols = range(1, cols+1)
        key_rows = range(size//cols+(not not(size%cols)))
    
    try:
        matrix = fetch_matrix(id, kwargs["block_rows"], kwargs["block_cols"])
    except NameError:
        if kwargs["block_cols"] == kwargs["block_rows"] == 3:
            matrix = [[0, 0, 7, 0, 0, 6, 0, 1, 0], 
                    [0, 4, 0, 0, 0, 0, 0, 9, 0], 
                    [8, 0, 0, 0, 5, 0, 6, 0, 4], 
                    [0, 1, 0, 0, 0, 5, 7, 0, 2], 
                    [0, 0, 0, 0, 0, 0, 0, 6, 0], 
                    [0, 0, 3, 0, 8, 0, 0, 0, 0], 
                    [0, 2, 0, 0, 0, 7, 4, 0, 5], 
                    [1, 0, 0, 2, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0, 9]]
        else: 
            matrix = [['0','C','0','8',  '0','D','5','0',  '2','0','0','0',  '0','E','9','A'],
                  ['5','0','0','0',  'F','0','4','0',  '0','1','0','6',  '3','C','0','0'],
                  ['0','6','3','0',  'O','C','E','9',  '0','0','0','0',  '0','0','0','0'],
                  ['0','D','E','0',  '3','0','2','0',  '0','B','0','4',  '7','6','0','8'],

                  ['0','0','0','3',  '0','0','0','E',  '0','6','0','0',  '5','0','1','B'],
                  ['1','0','F','0',  '0','0','0','0',  '4','0','5','0',  '0','9','0','0'],
                  ['0','B','8','O',  '0','7','0','5',  '1','0','F','E',  '6','0','4','3'],
                  ['E','0','0','0',  '0','0','8','F',  'B','9','0','0',  '0','D','0','0'],

                  ['0','0','0','9',  '7','0','0','0',  '8','A','0','0',  '0','0','0','0'],
                  ['0','F','4','0',  'E','0','0','0',  '0','0','0','2',  '0','7','0','0'],
                  ['0','0','0','0',  '4','8','9','3',  '0','C','0','0',  '0','0','6','2'],
                  ['0','0','B','0',  '0','0','0','A',  '0','0','0','0',  '0','3','C','1'],

                  ['F','0','0','0',  '0','5','0','0',  '6','0','4','C',  '0','8','0','0'],
                  ['0','0','0','2',  '0','0','C','0',  'D','7','A','0',  'F','0','0','O'],
                  ['A','0','C','0',  '0','0','0','0',  '0','O','0','0',  '0','0','7','6'],
                  ['4','0','D','0',  '9','0','O','B',  '0','0','0','0',  '0','A','0','5']]
    
    keys_map = {'0': "", 0: ""}
    for key in range(1, size+1): 
        val = hex(key)[-1].upper()
        if val == "0":
            keys_map[str(key)] = 'O'
            keys_map[key] = 'O'
        else: 
            keys_map[str(key)] = val
            keys_map[key] = val

    entry_note_font_size = pow(2.718281828459045, (6.084 - size)/11.431)
    
    color_palette = []
    while len(color_palette) < size:
        if random() < 0.5:
            bg = randint(0, 127), randint(0, 127), randint(0, 127)
            if bg[-1] != max(bg): color_palette.append((*bg, 255, 255, 255))
        else:
            bg = randint(128,255), randint(128,255), randint(128,255)
            if bg[-1] != max(bg): color_palette.append((*bg, 0, 0, 0))
    
    color_palette = [(80, 43, 58, 0, 0, 0),
                     (206, 0, 55, 0, 0, 0),
                     (255, 88, 93, 0, 0, 0),
                     (21, 71, 52, 0, 0, 0),
                     (121, 134, 60, 0, 0, 0),
                     (196, 214, 0, 0, 0, 0),
                     (185, 211, 220, 0, 0, 0),
                     (0, 176, 185, 0, 0, 0),
                     (0, 72, 81, 0, 0, 0),
                     (75, 61, 42, 0, 0, 0),
                     (153, 96, 23, 0, 0, 0),
                     (246, 234, 97, 0, 0, 0),
                     (255, 184, 28, 0, 0, 0),
                     (83, 86, 90, 0, 0, 0),
                     (216, 237, 150, 0, 0, 0),

                     (64, 255, 64, 32, 96, 32),
                     (64, 128, 255, 64, 64, 128),

                     (255, 255, 128, 96, 96, 64),
                     (255, 128, 255, 96, 64, 96),
                    #  (128, 255, 255, 64, 96, 96), 

                     (255, 255, 255, 64, 64, 64),
                     (128, 128, 128, 255, 255, 255),
                     (0, 0, 0, 192, 192, 192),

                     (255, 192, 128, 128, 64, 32),
                     (255, 128, 192, 128, 32, 64),
                     (128, 255, 192, 32, 128, 64),
                     (192, 255, 128, 64, 128, 32),
                    #  (192, 128, 255, 64, 32, 128),
                    #  (128, 192, 255, 32, 64, 128),

                     (128, 32, 32, 255, 192, 192),
                     (32, 128, 32, 192, 255, 192),
                     (32, 32, 128, 192, 192, 255),
                     ][:size-1]

    
    context = {**kwargs, 
               "size": size, 
               'matrix': matrix, 
               "key_rows": key_rows, "key_cols": key_cols, 
               "entry_note_font_size": entry_note_font_size, "keys_map": keys_map, "color_palette": color_palette}
    print(context)
    return render(request, "sudokuapp/playSudoku.html", context=context)

def fetch_matrix(id, block_rows, block_cols):
    raise NameError