const button = document.querySelector(".btn-custom");
const buttonSecond = document.querySelector(".btn-custom--second");

const checkScreenWidth = () => {
    return window.innerWidth >= 1200;
}

const  updateButtonVisibility =() => {
    if (checkScreenWidth()) {
        if (window.scrollY > 100) {
            button.style.display = "none";
            buttonSecond.style.display = "flex";
        } else {
            button.style.display = "flex";
            buttonSecond.style.display = "none";
        }
    } else {
        button.style.display = "none";
        buttonSecond.style.display = "none";
    }
}



window.addEventListener("load", updateButtonVisibility);
window.addEventListener("resize", updateButtonVisibility);
window.addEventListener("scroll", updateButtonVisibility);