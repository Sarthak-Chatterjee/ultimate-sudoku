function toggleActivation(toggler, activationClass="active"){
    if (toggler.classList.contains(activationClass)){
        toggler.classList.remove(activationClass)
    }else{
        toggler.classList.add(activationClass)
    }
}

function activate(toggler, activationClass="active"){
    if (!(toggler.classList.contains(activationClass)))
        toggler.classList.add(activationClass)
}

function deactivate(toggler, activationClass="active"){
    if (toggler.classList.contains(activationClass))
        toggler.classList.remove(activationClass)
}
