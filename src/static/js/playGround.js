var selectedEntries = [];
var undoMoves = [];
var redoMoves = [];
var ctrldown = false;
var duration = 0;
var startedTime = null;
var interval = null;

const root = document.querySelector(':root');
const rootStyle = getComputedStyle(root);
const SudokuSize = +(rootStyle.getPropertyValue("--n-cols"));
const BlockWidth = +(rootStyle.getPropertyValue("--block-width"));
const BlockHeight = +(rootStyle.getPropertyValue("--block-height"));
const KeyRows = +(rootStyle.getPropertyValue("--keypad-rows"));
const KeyCols = +(rootStyle.getPropertyValue("--keypad-cols"));
const KEYS = "0123456789ABCDEFO";
const HMS = document.getElementById("hms");


undoBtn = document.getElementById("undo")
redoBtn = document.getElementById("redo")
erasor = document.getElementById("erase")

function setKeypad(keypadType){
    console.log("hello")
    deactivate(document.getElementById("regular-keypad"))
    deactivate(document.getElementById("notes-keypad"))
    deactivate(document.getElementById("palette-keypad"))
    console.log(keypadType)
    activate(keypadType)

    let keypad = document.getElementById("keypad");
    if (keypad.classList.contains("keypadType-regular")){keypad.classList.remove("keypadType-regular")};
    if (keypad.classList.contains("keypadType-notes")){keypad.classList.remove("keypadType-notes")};
    if (keypad.classList.contains("keypadType-palette")){keypad.classList.remove("keypadType-palette")};
    keypad.classList.add("keypadType-" + keypadType.lastElementChild.innerHTML.toLowerCase());
}

function getProtoEntry(sudokuEntry){
    entryID = sudokuEntry.id
    entryGridID = sudokuEntry.parentElement.id

    const entryRow = +(entryID.split("-")[1]);
    const entryCol = +(entryID.split("-")[2]);
    const entryBlockRow = +(entryGridID.split("-")[1]);
    const entryBlockCol = +(entryGridID.split("-")[2]);
    const entryVal = sudokuEntry.firstElementChild.innerHTML;
    const isStatic = sudokuEntry.classList.contains("static-entry");

    return {
        entry: sudokuEntry,
        row: entryRow,
        col: entryCol,
        blockRow: entryBlockRow,
        blockCol: entryBlockCol,
        val: entryVal,
        isStstic: isStatic
    }
}

function updateSelectedEntries(sudokuEntry, cd=false, deselect=true){
    sel = selectedEntries.length;
    alreadyExists = false;
    for (i=0; i<sel; i++){
        element = selectedEntries[i];
        // console.log(element);
        if (element.entry == sudokuEntry){
            alreadyExists = true;
            existsAt = i;
        }
    }

    if (ctrldown || cd) {
        if (alreadyExists) {
            if (deselect) selectedEntries.splice(i, 1);
        }
        else selectedEntries.push(getProtoEntry(sudokuEntry));
    }
    else {
        if (alreadyExists) {
            if (deselect){
                if (selectedEntries.length > 1)
                    selectedEntries = [getProtoEntry(sudokuEntry)];
                else selectedEntries = [];
            }
        }
        else selectedEntries = [getProtoEntry(sudokuEntry)];
    }
}

function resetGridHighlights(){
    const posExcitedElements = document.getElementsByClassName("position-excited")
    const valExcitedElements = document.getElementsByClassName("value-excited")
    const highlightedElements = document.getElementsByClassName("highlighted")
    
    const peel = posExcitedElements.length
    const veel = valExcitedElements.length
    const hel = highlightedElements.length
    
    for (i=0; i<peel; i++) deactivate(posExcitedElements[0], "position-excited");
    for (i=0; i<veel; i++) deactivate(valExcitedElements[0], "value-excited");
    for (i=0; i<hel; i++) deactivate(highlightedElements[0], "highlighted");
}

function highlightGrid(sudokuEntry, cd=false, deselect=true){
    updateSelectedEntries(sudokuEntry, cd=cd, deselect=deselect);

    if (selectedEntries.length == 0) resetGridHighlights();
    else if (selectedEntries.length == 1){
        resetGridHighlights();
        firstEntry = selectedEntries[0];
        
        rowElements = document.getElementsByClassName(`row-${firstEntry.row}`);
        colElements = document.getElementsByClassName(`col-${firstEntry.col}`);
        blockElements = document.getElementById(`block-${firstEntry.blockRow}-${firstEntry.blockCol}`).children;
        equivalElements = document.getElementsByClassName(`val-${firstEntry.val}`);
        // console.log(blockElements);
        
        [].forEach.call(rowElements, element => { if (element != firstEntry.entry) activate(element, "position-excited") });
        [].forEach.call(colElements, element => { if (element != firstEntry.entry) activate(element, "position-excited") });
        [].forEach.call(blockElements, element => { if (element != firstEntry.entry) activate(element, "position-excited") });
        [].forEach.call(equivalElements, element => { if (element != firstEntry) activate(element, "value-excited") });

        activate(firstEntry.entry, "highlighted");

    } 
    else if (selectedEntries.length == 2){
        resetGridHighlights();
        selectedEntries.forEach(element => {activate(element.entry, "highlighted")});
    }
    else if (deselect) toggleActivation(sudokuEntry, "highlighted");
    else activate(sudokuEntry, "highlighted");
}



function changeEntryVals(key){

}

function createEntryNotes(){

}

function toggleEntryNote(key){

}

function deleteEntryNotes(){

}

function applyEntryColor(key){

}

function updateEntries(key){
    let keypad = document.getElementById("keypad");
    if (keypad.classList.contains("keypadType-regular")){
        let newVal = key.innerHTML.replace(/\s/g, "")
        selectedEntries.forEach((protoEntry)=>{
            let entry = protoEntry.entry
            if(!(protoEntry.isStatic)){
                let entryChild = entry.firstElementChild
                if (entryChild.classList.contains("sudoku-entry-notes")){
                    deactivate(entryChild, "sudoku-entry-notes");
                    activate(entryChild, "sudoku-entry-val");
                } else {
                    let oldVal = entryChild.innerHTML.replace(/\s/g, "")
                    console.log(newVal, oldVal)
                    deactivate(entry, `val-${oldVal}`)
                }
                entryChild.innerHTML = newVal;
                activate(entry, `val-${newVal}`)
                console.log(entry.firstElementChild)
            }
        })
        if (selectedEntries.length == 1 && ! selectedEntries[0].isStatic){
            let valExcitedElements = document.getElementsByClassName("value-excited")
            let veel = valExcitedElements.length
            for (i=0; i<veel; i++) deactivate(valExcitedElements[0], "value-excited");
            let equivalElements = document.getElementsByClassName(`val-${newVal}`);
            [].forEach.call(equivalElements, element => { if (element != selectedEntries[0].entry) activate(element, "value-excited") });
        }
    }
    else if (keypad.classList.contains("keypadType-notes")){
        let newNote = key.innerHTML.replace(/\s/g, "")
        selectedEntries.forEach((protoEntry)=>{
            let entry = protoEntry.entry
            let entryChild = entry.firstElementChild
            if (entryChild.classList.contains("sudoku-entry-val")){
                val = protoEntry.entry.firstElementChild.innerHTML.replace(/\s/g, "")
                deactivate(entry, `val-${val}`)
                deactivate(entryChild, "sudoku-entry-val");
                activate(entryChild, "sudoku-entry-notes");
                let htmltxt = '';
                let keyVal = 1
                for (keyRow=0; keyRow<KeyRows; keyRow++){
                    htmltxt += `<div id="entry-${protoEntry.row}-${protoEntry.col}-row-${keyRow}" class="entry-note-row">`;
                    for (keyCol=0; keyCol<KeyCols; keyCol++){
                        htmltxt += `<div class="entry-note" id="entry-${protoEntry.row}-${protoEntry.col}-${KEYS[keyVal++]}"></div>`;
                        if (keyVal > SudokuSize) break
                    }
                    htmltxt += `</div>`;
                }
                entryChild.innerHTML = htmltxt;
            }
            targetElelement = document.getElementById(`entry-${protoEntry.row}-${protoEntry.col}-${newNote}`);
            if (targetElelement.innerHTML == newNote) targetElelement.innerHTML = '';
            else targetElelement.innerHTML = newNote;
            console.log(entry.firstElementChild)
        })
    }
    else if (keypad.classList.contains("keypadType-palette")){

    }
}

function eraseEntries(){
    const valExcitedElements = document.getElementsByClassName("value-excited")
    const veel = valExcitedElements.length
    for (i=0; i<veel; i++) deactivate(valExcitedElements[0], "value-excited");

    selectedEntries.forEach((protoEntry)=>{
        val = protoEntry.entry.firstElementChild.innerHTML.replace(/\s/g, "")
        deactivate(protoEntry.entry, `val-${val}`)
        protoEntry.entry.firstElementChild.innerHTML = "";
    })
}

function pauseResume(btn){
    console.log(btn);
    if (btn.classList.contains("pause")){
        pauseTimer();
        btn.innerHTML = '<i class="fa fa-play"></i>';
        deactivate(btn, 'pause');
        activate(btn, 'resume');
        activate(document.getElementById("timer"));
    }
    else{
        resumeTimer();
        btn.innerHTML = '<i class="fa fa-pause"></i>';
        deactivate(btn, 'resume');
        activate(btn, 'pause');
        deactivate(document.getElementById("timer"));
    }
}

function startTimer(){
    console.log("hello");
    if (interval) return;
    resumeTimer();
}

function runTimer(){
    tt = duration + Date.now()-startedTime;

    let ss = (tt/1000 >> 0);
    let ms = tt%1000;

    let mm = (ss/60 >> 0);
    ss = ss%60;
    
    let hh = (mm/60 >> 0);
    mm = mm%60;

    if (hh < 10) hh = "0"+hh;
    if (mm < 10) mm = "0"+mm;
    if (ss < 10) ss = "0"+ss;

    HMS.innerHTML = `${hh}:${mm}:${ss}`;
}

function pauseTimer(){
    console.log("hello");
    duration += Date.now() - startedTime;
    clearInterval(interval);
}

function resumeTimer(){
    console.log("hello");
    startedTime = Date.now();
    interval = setInterval(runTimer, 500);
}



document.addEventListener('keyup', (event) =>{
    switch(event.key){
        case 'Control': 
            ctrldown = false
            break;
        case '0':
            erasor.classList.remove("pressed")
            break;
        default:
            btn = document.getElementById(`key-${event.key.toUpperCase()}`)
            try{
                // btn.click()
                btn.classList.remove("pressed")
            } catch { }
            break;
    }
    if (ctrldown){
        switch (event.key){
            case "z":
                // undoBtn.click();
                deactivate(undoBtn, "pressed");
                break;
            case "y":
                // redoBtn.click();
                deactivate(redoBtn, "pressed");
                break;
        }
    }
})

document.addEventListener('keydown', (event) => {
    var name = event.key;
    var code = event.code;

    if (name === "Control") ctrldown = true
    else if (event.altKey) {
        switch (name){
            case "1":
                event.preventDefault();
                document.getElementById("notes-keypad").click();
                break;
                
            case "2":
                event.preventDefault();
                document.getElementById("regular-keypad").click();
                break;
                
            case "3":
                event.preventDefault();
                document.getElementById("palette-keypad").click();
                break;
        }
    }
    else if (selectedEntries.length){
        if (ctrldown){
            switch (name){
                case "A":
                case "a":
                    event.preventDefault();
                    selectedEntries = [];
                    for (row=0; row<SudokuSize; row++){
                        for (col=0; col<SudokuSize; col++){
                            entry = document.getElementById(`entry-${row}-${col}`);
                            setTimeout(highlightGrid, (500*(row*SudokuSize+col))/(SudokuSize*SudokuSize), entry, true);
                        }
                    }
                    break;

                case "R":
                    event.preventDefault();
                    selectedEntries.forEach(
                        (protoEntry)=>{
                            col = protoEntry.col;
                            row = protoEntry.row;
                            maxiters = col;
                            if (maxiters < (SudokuSize - col - 1)) maxiters = (SudokuSize - col - 1)
                            for(d=1;d<=maxiters;d++){
                                left = col-d;
                                if (left>=0){
                                    entry = document.getElementById(`entry-${row}-${left}`);
                                    setTimeout(highlightGrid, 300*d/maxiters, entry, true, false);
                                }
                                right = col+d;
                                if (right<SudokuSize){
                                    entry = document.getElementById(`entry-${row}-${right}`);
                                    setTimeout(highlightGrid, 300*d/maxiters, entry, true, false);
                                }
                                
                                console.log(col, d, left, right);
                            }
                        }
                    )
                    break;

                case "C":
                    event.preventDefault();
                    selectedEntries.forEach(
                        (protoEntry)=>{
                            row = protoEntry.row;
                            col = protoEntry.col;
                            maxiters = row;
                            if (maxiters < (SudokuSize - row - 1)) maxiters = (SudokuSize - row - 1)
                            for(d=1;d<=maxiters;d++){
                                up = row-d;
                                if (up>=0){
                                    entry = document.getElementById(`entry-${up}-${col}`);
                                    setTimeout(highlightGrid, 300*d/maxiters, entry, true, false);
                                }
                                down = row+d;
                                if (down<SudokuSize){
                                    entry = document.getElementById(`entry-${down}-${col}`);
                                    setTimeout(highlightGrid, 300*d/maxiters, entry, true, false);
                                }
                                
                                console.log(row, d, up, down);
                            }
                        }
                    )
                    break;
                    
                case "?": // for hint
                    event.preventDefault();
                    document.getElementById(`Validate`).click();
                    activate(redoBtn, "pressed");
                    break;

                case "i": // for showing particular options' state
                    event.preventDefault();
                    redoBtn.click();
                    activate(redoBtn, "pressed");
                    break;

                case ">": // for skipping the puzzle
                    event.preventDefault();
                    redoBtn.click();
                    activate(redoBtn, "pressed");
                    break;

                case "c":
                    event.preventDefault();
                    
                    navigator.clipboard.writeText()
                    break;

                case "x":
                    event.preventDefault();

                    break;

                case "v":
                    event.preventDefault();

                    break;

                case "z":
                    event.preventDefault();
                    undoBtn.click();
                    activate(undoBtn, "pressed");
                    break;

                case "y":
                    event.preventDefault();
                    redoBtn.click();
                    activate(redoBtn, "pressed");
                    break;
            }
        }
        else {
            switch(name){
                case "esc":
                case "Escape":
                    selectedEntries = []
                    resetGridHighlights()
                    break;
                case "Up":
                case "ArrowUp":
                    protoEntry = selectedEntries[0]
                    newRow = ((protoEntry.row - 1 + SudokuSize) % SudokuSize)
                    newCol = protoEntry.col
                    newEntry = document.getElementById(`entry-${newRow}-${newCol}`)
                    highlightGrid(newEntry)
                    break
                case "Down":
                case "ArrowDown":
                    protoEntry = selectedEntries[0]
                    newRow = ((protoEntry.row + 1) % SudokuSize)
                    newCol = protoEntry.col
                    newEntry = document.getElementById(`entry-${newRow}-${newCol}`)
                    highlightGrid(newEntry)
                    break
                case "Left":
                case "ArrowLeft":
                    protoEntry = selectedEntries[0]
                    newRow = protoEntry.row
                    newCol = ((protoEntry.col - 1 + SudokuSize) % SudokuSize)
                    newEntry = document.getElementById(`entry-${newRow}-${newCol}`)
                    highlightGrid(newEntry)
                    break
                case "Right":
                case "ArrowRight":
                    protoEntry = selectedEntries[0]
                    newRow = protoEntry.row
                    newCol = ((protoEntry.col + 1) % SudokuSize)
                    newEntry = document.getElementById(`entry-${newRow}-${newCol}`)
                    highlightGrid(newEntry)
                    break
                case "0":
                    erasor.click();
                    erasor.classList.add("pressed");
                    break;
                default:
                    btn = document.getElementById(`key-${name.toUpperCase()}`)
                    try{
                        btn.click();
                        btn.classList.add("pressed");
                    } catch { }
                    break;
            }
        }
    }
    else{
        switch(name){
            case "0":
                erasor.classList.add("pressed")
            default:
                btn = document.getElementById(`key-${name.toUpperCase()}`)
                try{btn.classList.add("pressed")} catch { }
                break;
        }
    }
})