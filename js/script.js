document.addEventListener("DOMContentLoaded", async function () {
    let languageSelector = document.getElementById("language-selector");
    changeLanguage(languageSelector.value, false);

    languageSelector.addEventListener("change", function () {
        changeLanguage(this.value, true);
    });

    try {
        const response = await fetch("js/projects.json");
        const projects = await response.json();
        createCarouselItems(projects);

        window.addEventListener("resize", () => updateIndicatorStyles());

        let prevButton = document.getElementById("carousel-prev");
        let nextButton = document.getElementById("carousel-next");
        console.log(prevButton);

        prevButton.addEventListener("click", () => changeProjectFromArrow(-1));
        nextButton.addEventListener("click", () => changeProjectFromArrow(1));
    } catch (error) {
        console.error("Error al cargar los proyectos:", error);
    }
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

let currentProjectIndex = 0;

function setupCarouselIndicators(projectCount) {
    const indicatorsContainer = document.getElementById("carousel-indicators");
    indicatorsContainer.innerHTML = '';

    for (let i = 0; i < projectCount; i++) {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.tweSlideTo = i;
        button.setAttribute("aria-label", `Slide ${i + 1}`);
        button.className = `indicator mx-[3px] cursor-pointer bg-white opacity-50 transition-opacity duration-[600ms]`;

        if (i === 0) {
            button.setAttribute("aria-current", "true");
            button.classList.add("opacity-100");
        }

        indicatorsContainer.appendChild(button);

        button.addEventListener("click", () => changeProjectTo(i));
    }
    updateIndicatorStyles();
}

function updateIndicatorStyles() {
    const indicators = document.querySelectorAll(".indicator");
    const isSmallScreen = window.innerWidth < 768;

    indicators.forEach(button => {
        if (isSmallScreen) {
            button.classList.remove("w-[30px]", "h-[3px]", "rounded-none");
            button.classList.add("w-2.5", "h-2.5", "rounded-full");
        } else {
            button.classList.remove("w-2.5", "h-2.5", "rounded-full");
            button.classList.add("w-[30px]", "h-[3px]", "rounded-none");
        }
    });
}

function changeProjectTo(index) {
    let indicators = document.querySelectorAll(".indicator");
    let carouselItems = document.querySelectorAll("#carousel-items > div");

    const direction = index > currentProjectIndex ? "right" : "left";

    carouselItems[currentProjectIndex].style.opacity = "0";
    carouselItems[currentProjectIndex].style.pointerEvents = "none"; 
    indicators[currentProjectIndex].classList.remove("opacity-100");
    indicators[currentProjectIndex].classList.add("opacity-50");

    currentProjectIndex = index;
    carouselItems[index].style.opacity = "1";
    carouselItems[index].style.pointerEvents = "auto";
    indicators[currentProjectIndex].classList.remove("opacity-50");
    indicators[currentProjectIndex].classList.add("opacity-100");

}

function changeProjectFromArrow(direction) {
    const indicators = document.querySelectorAll(".indicator");
    let newIndex = currentProjectIndex + direction;

    if (newIndex < 0) newIndex = indicators.length - 1;
    if (newIndex >= indicators.length) newIndex = 0;

    changeProjectTo(newIndex);
}

function createCarouselItems(projects) {
    let carouselItemsContainer = document.getElementById("carousel-items");
    projects.forEach((project, index) => {
        const item = document.createElement("div");
        item.classList.add("relative", "float-left", "-mr-[100%]", "w-full", "transition-transform", "duration-[600ms]", "ease-in-out", "motion-reduce:transition-none");

        if (index !== 0) {
            item.style.opacity = "0";
            item.style.pointerEvents = "none";
        }

        const img = document.createElement("img");
        img.src = project.thumbnail;
        img.alt = `Slide ${index + 1}`;
        img.classList.add("block", "w-full");
        item.appendChild(img);

        const content = document.createElement("div");
        content.classList.add("absolute", "inset-x-[15%]", "bottom-5", "hidden", "py-5", "text-center", "text-white", "md:block");
        content.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.8)"; 

        const title = document.createElement("h5");
        title.classList.add("text-xl");
        title.textContent = project.title;
        content.appendChild(title);

        const description = document.createElement("p");
        description.textContent = project.description;
        content.appendChild(description);

        item.appendChild(content);

        carouselItemsContainer.appendChild(item);

        setupCarouselIndicators(projects.length);
    });
}