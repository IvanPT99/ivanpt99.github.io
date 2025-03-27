const translations = {
    es: {
        "cv-button": "Descargar CV",
        "nav-about": "Sobre mí",
        "nav-projects": "Proyectos",
        "nav-contact": "Contacto",
        "about-title": "Sobre mí",
        "about-text": "Soy un desarrollador Full-Stack con experiencia en Java, AEM y Vue.js.",
        "projects-title": "Proyectos",
        "project-1": "Soulsdle - Un minijuego basado en la saga Souls",
        "project-2": "Gestor de facturación con Java y Spring Boot",
        "contact-title": "Contacto",
        "contact-text": "📫 <a href='mailto:tuemail@example.com'>Contáctame</a>",
    },
    en: {
        "cv-button": "Download CV",
        "nav-about": "About Me",
        "nav-projects": "Projects",
        "nav-contact": "Contact",
        "about-title": "About Me",
        "about-text": "I'm a Full-Stack developer with experience in Java, AEM, and Vue.js.",
        "projects-title": "Projects",
        "project-1": "Soulsdle - A minigame based on the Souls saga",
        "project-2": "Invoice manager with Java and Spring Boot",
        "contact-title": "Contact",
        "contact-text": "📫 <a href='mailto:tuemail@example.com'>Contact me</a>",
    }
};

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("language-selector").addEventListener("change", function () {
        let lang = this.value;
        for (let key in translations[lang]) {
            let element = document.getElementById(key);
            if (element) {
                element.classList.remove("opacity-100");
                element.classList.add("opacity-0", "transition-opacity", "duration-300");
                setTimeout(() => {
                    element.innerHTML = translations[lang][key];
                    element.classList.remove("opacity-0");
                    element.classList.add("opacity-100");
                }, 300);
            }
        }
    });
});

