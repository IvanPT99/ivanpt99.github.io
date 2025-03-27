document.addEventListener("DOMContentLoaded", function () {
    let languageSelector=document.getElementById("language-selector");
    changeLanguage(languageSelector.value, false);

    languageSelector.addEventListener("change", function () {
        changeLanguage(this.value, true);
    });
});

function changeLanguage(lang, animation) {
    if (!translations[lang]) {
        console.error(`Language not found: ${lang}`);
        return;
    }

    for (let key in translations[lang]) {
        let element = document.getElementById(key);
        if (element) {
            if (!animation) {
                element.innerHTML = translations[lang][key];
                continue;
            }
            element.classList.remove("opacity-100");
            element.classList.add("opacity-0", "transition-opacity", "duration-300");

            requestAnimationFrame(() => {
                setTimeout(() => {
                    element.innerHTML = translations[lang][key];
                    element.classList.remove("opacity-0");
                    element.classList.add("opacity-100");
                }, 300);
            });
        }
    }
}

