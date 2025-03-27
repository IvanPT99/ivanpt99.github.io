const translations = {
    es: {
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

document.getElementById("language-selector").addEventListener("change", function() {
    let lang = this.value;
    for (let key in translations[lang]) {
        document.getElementById(key).innerHTML = translations[lang][key];
    }
});

