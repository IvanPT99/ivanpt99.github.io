const techLogos = {
    "JavaScript": "media/logo/js-logo.png",
    "HTML": "media/logo/html-logo.png",
    "CSS": "media/logo/css-logo.png",
    "Bootstrap": "media/logo/bootstrap-logo.png",
    "Tailwind CSS": "media/logo/tailwind-logo.png",
    "AEM": "media/logo/aem-logo.png",
    "AngularJS": "media/logo/angularjs-logo.png",
    "MariaDB": "media/logo/mariadb-logo.png",
    "MySQL": "media/logo/mysql-logo.png",
    "MongoDB": "media/logo/mongodb-logo.png",
    "Node.js": "media/logo/nodejs-logo.png",
    "Java": "media/logo/java-logo.png",
    "Spring-boot": "media/logo/springboot-logo.png",
    "Hibernate": "media/logo/hibernate-logo.png",
    "Vue.js": "media/logo/vue-logo.png",
    "Vuex": "media/logo/vuex-logo.svg",
    "Vite.js": "media/logo/vitejs-logo.png",
    "Typescript": "media/logo/typescript-logo.png",
    "PHP": "media/logo/php-logo.png",
    "Laravel": "media/logo/laravel-logo.png",
    "Maven": "media/logo/maven-logo.svg",
};

let projects = [];
let projectIndex = 0;

document.addEventListener("DOMContentLoaded", async function () {
    let languageSelector = document.getElementById("language-selector");
    changeLanguage(languageSelector.value, false);

    languageSelector.addEventListener("change", function () {
        changeLanguage(this.value, true);
    });

    try {
        const response = await fetch("js/projects.json");
        projects = await response.json();

        await createCarouselItems(languageSelector.value);

        $('#projects-carousel').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            prevArrow: '<button type="button" class="slick-prev">←</button>',
            nextArrow: '<button type="button" class="slick-next">→</button>',
            dots: true,
            autoplay: true,
            autoplaySpeed: 10000,
            swipe: true,
            touchThreshold: 50,
            speed: 1000,
            draggable: true,
        });


        $('#projects-carousel').on('click', '.slick-slide', function () {
            projectIndex = $(this).data('index');
            openProjectModal(projectIndex);
        });

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

    let carouselItems = document.querySelectorAll('.slick-slide');
    carouselItems.forEach(item => {
        let index = item.getAttribute('data-index');
        let project = projects[index];
        let description = item.querySelector('.project-description');

        description.textContent = project.description.short[lang];
    });
}

async function createCarouselItems(lang) {
    let carouselItemsContainer = document.getElementById("projects-carousel");
    carouselItemsContainer.innerHTML = '';

    const promises = projects.map((project, index) => {
        return new Promise((resolve) => {
            let item = document.createElement("div");
            item.classList.add("relative", "slick-slide");
            item.setAttribute("data-index", index);

            let img = document.createElement("img");
            img.src = project.gallery[0];
            img.alt = project.title;
            img.classList.add(
                "w-full",
                "object-cover",
                "cursor-pointer",           
                "transition-transform",
                "duration-300",
                "hover:scale-105",           
                "hover:opacity-90"           
            );

            let content = document.createElement("div");
            content.classList.add("absolute", "bottom-0", "left-0", "w-full", "bg-black", "bg-opacity-50", "hidden", "md:block");
            content.style.padding = "20px"; 

            let textContent = document.createElement("div");
            textContent.classList.add("text-center", "text-white");

            let title = document.createElement("h5");
            title.classList.add("text-xl", "font-bold");
            title.textContent = project.title;
            textContent.appendChild(title);

            let description = document.createElement("p");
            description.classList.add("mt-2", "text-sm", "project-description");
            description.textContent = project.description.short[lang];
            textContent.appendChild(description);

            content.appendChild(textContent);
            item.appendChild(img);
            item.appendChild(content);

            img.onload = () => {
                carouselItemsContainer.appendChild(item);
                resolve();
            };
        });
    });

    await Promise.all(promises);
}


function openProjectModal(index) {
    let project = projects[index];
    let modal = document.getElementById("project-modal");
    let modalGallery = document.getElementById("modal-gallery");
    let modalTitle = document.getElementById("modal-title");
    let modalDescription = document.getElementById("modal-description");
    let modalSkills = document.getElementById("modal-skills");
    let linksContainer = document.getElementById("modal-links");
    let currentLanguage = document.getElementById("language-selector").value;
    linksContainer.innerHTML = '';
    modalGallery.innerHTML = '';
    modalSkills.innerHTML = '';

    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description.long[currentLanguage];

    project.gallery.forEach((image) => {
        let img = document.createElement("img");
        img.src = image;
        img.classList.add("object-cover", "rounded-t-lg", "lg:rounded-l-lg");
        modalGallery.appendChild(img);
    });

    Object.entries(project.skills).forEach(([category, skills]) => {
        let categoryDiv = document.createElement("div");
        categoryDiv.id = category + "-skills";
        categoryDiv.classList.add("flex", "flex-col", "space-y-1");

        let categoryTitle = document.createElement("h4");
        categoryTitle.id = category + "-skills-title";
        categoryTitle.classList.add("text-sm", "font-semibold", "flex", "text-left");
        categoryTitle.textContent = translations[currentLanguage][category + "-skills-title"] || category;

        let categoryIcon = document.createElement("img");
        categoryIcon.src = `media/logo/${category}.png`;
        categoryIcon.alt = `${category} icon`;
        categoryIcon.classList.add("w-6", "h-6", "mr-2", "self-center");

        categoryTitle.prepend(categoryIcon);
        categoryDiv.appendChild(categoryTitle);

        skills.forEach(skill => {
            let skillDiv = document.createElement("div");
            skillDiv.classList.add("skill-chip", "flex", "items-center", "bg-gray-800", "backdrop-blur-md", "p-2", "rounded");

            let skillLogo = document.createElement("img");
            skillLogo.src = techLogos[skill] || "";
            skillLogo.alt = skill;
            skillLogo.classList.add("w-5", "h-5", "mr-2");

            let skillName = document.createElement("span");
            skillName.textContent = skill;
            skillName.classList.add("text-xs", "text-white");

            skillDiv.appendChild(skillLogo);
            skillDiv.appendChild(skillName);
            categoryDiv.appendChild(skillDiv);
        });
        modalSkills.appendChild(categoryDiv);
    });

    if (project.links) {    
        let hasFrontend = null;
        let hasBackend = null;
        let hasWebsite = null;
    
        project.links.forEach(link => {
            if (link["front-end"]) {
                hasFrontend = link["front-end"];
            }
            if (link["back-end"]) {
                hasBackend = link["back-end"];
            }
            if (link["website"]) {
                hasWebsite = link["website"];
            }
        });
    
        if (hasFrontend || hasBackend || hasWebsite) {
            
            linksContainer.classList.remove("hidden"); 
            
            if (hasFrontend || hasBackend) {
                let buttonWrapper = document.createElement("div");
                buttonWrapper.classList.add("flex", "w-full", "gap-4", "mb-1");
    
                if (hasFrontend) {
                    let frontendButton = document.createElement("a");
                    frontendButton.href = hasFrontend;
                    frontendButton.target = "_blank";
                    frontendButton.textContent = "Front-end";
                    frontendButton.classList.add("py-2", "px-4", "rounded", "bg-blue-500", "text-white", "hover:bg-blue-600", "flex-1");
                    buttonWrapper.appendChild(frontendButton);
                }
    
                if (hasBackend) {
                    let backendButton = document.createElement("a");
                    backendButton.href = hasBackend;
                    backendButton.target = "_blank";
                    backendButton.textContent = "Back-end";
                    backendButton.classList.add("py-2", "px-4", "rounded", "bg-green-500", "text-white", "hover:bg-green-600", "flex-1");
                    buttonWrapper.appendChild(backendButton);
                }
                linksContainer.appendChild(buttonWrapper);
            }
    
            if (hasWebsite) {
                let websiteContainer = document.createElement("div");
                websiteContainer.classList.add("flex", "w-full", "gap-4");
                let websiteButton = document.createElement("a");
                websiteButton.href = hasWebsite;
                websiteButton.target = "_blank";
                websiteButton.textContent = "Website on Live";
                websiteButton.classList.add("py-2", "px-4", "rounded", "bg-gray-500", "text-white", "hover:bg-gray-600", "w-full");
                websiteContainer.appendChild(websiteButton);
                linksContainer.appendChild(websiteContainer);
            }
        } else {
            linksContainer.classList.add("hidden");
        }
    }
    
    if ($(modalGallery).hasClass('slick-initialized')) {
        $(modalGallery).slick('unslick');
    }
    
    $(modalGallery).slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        appendDots: $(modalGallery),
        prevArrow: '<button type="button" class="slick-prev absolute top-1/2 left-4 transform -translate-y-1/2 z-10 text-white p-4 rounded-full slick-arrow bg-gray-800 bg-opacity-60 hover:bg-gray-700 flex items-center justify-center"><span class="sr-only">Previous</span>←</button>',
        nextArrow: '<button type="button" class="slick-next absolute top-1/2 right-4 transform -translate-y-1/2 z-10 text-white p-4 rounded-full slick-arrow bg-gray-800 bg-opacity-60 hover:bg-gray-700 flex items-center justify-center"><span class="sr-only">Next</span>→</button>',        
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    modal.classList.remove("hidden");
    modal.classList.add('flex', 'opacity-0');

    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.classList.add("opacity-100");
    }, 10);

    modal.addEventListener("click", function closeModalListener(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function handleProject(direction) {
    let modalGallery = document.getElementById("modal-gallery");
    if ($(modalGallery).hasClass('slick-initialized')) {
        $(modalGallery).slick('unslick');
    }

    if (direction === "next") {
        projectIndex = (projectIndex + 1) % projects.length;
    } else if (direction === "prev") {
        projectIndex = (projectIndex - 1 + projects.length) % projects.length
    }
    openProjectModal(projectIndex);
}

function closeModalListener(e) {
    let modal = document.getElementById("project-modal");
    if (e.target === modal) {
        closeModal();
    }
}

function closeModal() {
    let modal = document.getElementById("project-modal");
    let modalGallery = document.getElementById("modal-gallery");
    modal.classList.remove('opacity-100');
    modal.classList.add("opacity-0");

    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add("hidden");
    }, 300);

    if ($(modalGallery).hasClass('slick-initialized')) {
        $(modalGallery).slick('unslick');
    }
    modal.removeEventListener("click", closeModalListener);
}
