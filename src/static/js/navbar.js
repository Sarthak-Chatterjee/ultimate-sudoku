notificationLog = document.getElementById('notifications')
accountMenu = document.getElementById('account-dropdown')


function toggleDarkMode(toggler){
    btn = toggler.querySelector(".toggle-btn")
    if (toggler.classList.contains("off")){
        toggler.classList.remove("off")
        toggler.classList.add("on")
        btn.innerHTML=`<i class="fa fa-moon fa-lg"></i>`
        // change colors and stuff here
    }else{
        toggler.classList.remove("on")
        toggler.classList.add("off")
        btn.innerHTML=`<i class="fa fa-sun fa-lg"></i>`
        // change colors and stuff here
    }
}


function resetMenus(){
    try {
        deactivate(notificationLog)
        deactivate(accountMenu)
    } catch (TypeError) {
    }
}

document.body.addEventListener('click', resetMenus, true);