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
    "Laravel": "media/logo/laravel-logo.png"
};

let projects=[];

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
            const index = $(this).data('index');  
            openProjectModal(projects[index]);    
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
            const item = document.createElement("div");
            item.classList.add("relative", "slick-slide");
            item.setAttribute("data-index", index);

            const img = document.createElement("img");
            img.src = project.gallery[0];
            img.alt = project.title;
            img.classList.add(
                "block", 
                "w-full", 
                "h-[600px]", 
                "object-cover", 
                "cursor-pointer",           // Indica que la imagen es clicable
                "transition-transform", 
                "duration-300", 
                "hover:scale-105",           // Solo la imagen se agranda al hacer hover
                "hover:opacity-90"           // Solo la imagen reduce su opacidad al hacer hover
            );

            const content = document.createElement("div");
            content.classList.add("absolute", "bottom-0", "left-0", "w-full", "bg-black", "bg-opacity-50");
            content.style.padding = "20px";

            const textContent = document.createElement("div");
            textContent.classList.add("text-center", "text-white");

            const title = document.createElement("h5");
            title.classList.add("text-xl", "font-bold");
            title.textContent = project.title;
            textContent.appendChild(title);

            const description = document.createElement("p");
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


function openProjectModal(project) {
    let modal = document.getElementById("project-modal");
    let modalGallery = document.getElementById("modal-gallery");
    let modalTitle = document.getElementById("modal-title");
    let modalDescription = document.getElementById("modal-description");
    let modalSkills = document.getElementById("modal-skills");
    let frontendLinks = document.getElementById("frontend-links");
    let backendLinks = document.getElementById("backend-links");
    let currentLanguage = document.getElementById("language-selector").value;

    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description.long[currentLanguage];
    modalGallery.innerHTML = ''; 
    frontendLinks.innerHTML = '';
    backendLinks.innerHTML = '';
    modalSkills.innerHTML = '';

    // Renderizar galería de imágenes
    project.gallery.forEach((image) => {
        let img = document.createElement("img");
        img.src = image;
        img.classList.add("w-full", "h-full", "object-cover", "rounded-t-lg", "lg:rounded-l-lg");
        modalGallery.appendChild(img);
    });

    // Renderizar Skills
    const skillContainer = document.createElement("div");
    skillContainer.classList.add("flex", "flex-row", "gap-4");
    
    function renderSkills(category, skills) {
        const categoryDiv = document.createElement("div");
        categoryDiv.classList.add("w-full", "flex", "flex-col", "items-start", "gap-2");

        const categoryTitle = document.createElement("div");
        categoryTitle.classList.add("flex", "items-center", "gap-2", "mb-2");

        const categoryLogo = document.createElement("img");
        categoryLogo.src = `media/logo/${category}.png`;
        categoryLogo.alt = `${category} Logo`;
        categoryLogo.classList.add("w-8", "h-8");

        const categoryText = document.createElement("h4");
        categoryText.textContent = category === "frontend" ? "Frontend Technologies" : "Backend Technologies";
        categoryText.classList.add("text-white", "text-xl", "font-bold");

        categoryTitle.appendChild(categoryLogo);
        categoryTitle.appendChild(categoryText);
        categoryDiv.appendChild(categoryTitle);

        skills.forEach(skill => {
            const skillDiv = document.createElement("div");
            skillDiv.classList.add("skill-chip", "flex", "items-center", "bg-gray-800", "backdrop-blur-md", "p-2", "rounded", "w-full");

            const skillLogo = document.createElement("img");
            skillLogo.src = techLogos[skill] || ""; 
            skillLogo.alt = skill;
            skillLogo.classList.add("w-6", "h-6", "mr-2");

            const skillName = document.createElement("span");
            skillName.textContent = skill;
            skillName.classList.add("text-sm", "text-white");

            skillDiv.appendChild(skillLogo);
            skillDiv.appendChild(skillName);
            categoryDiv.appendChild(skillDiv);
        });

        skillContainer.appendChild(categoryDiv);
    }

    renderSkills("frontend", project.skills.frontend);
    renderSkills("backend", project.skills.backend);
    
    modalSkills.appendChild(skillContainer);

    // Renderizar Links (Front-end y Back-end)
    if (project.links?.frontend) {
        project.links.frontend.forEach(link => {
            const button = document.createElement("a");
            button.href = link.url;
            button.target = "_blank";
            button.textContent = `Front-end: ${link.label}`;
            button.classList.add("py-2", "px-4", "rounded", "bg-blue-500", "text-white", "hover:bg-blue-600");
            frontendLinks.appendChild(button);
        });
    }

    if (project.links?.backend) {
        project.links.backend.forEach(link => {
            const button = document.createElement("a");
            button.href = link.url;
            button.target = "_blank";
            button.textContent = `Back-end: ${link.label}`;
            button.classList.add("py-2", "px-4", "rounded", "bg-green-500", "text-white", "hover:bg-green-600");
            backendLinks.appendChild(button);
        });
    }

    if ($(modalGallery).hasClass('slick-initialized')) {
        $(modalGallery).slick('unslick');
    }

    // Inicializar Slick nuevamente
    $(modalGallery).slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        appendDots: $(modalGallery),
        prevArrow: '<button type="button" class="slick-prev absolute top-1/2 left-4 transform -translate-y-1/2 z-10 text-white p-4 rounded-full slick-arrow"><span class="sr-only">Previous</span>←</button>',
        nextArrow: '<button type="button" class="slick-next absolute top-1/2 right-4 transform -translate-y-1/2 z-10 text-white p-4 rounded-full slick-arrow"><span class="sr-only">Next</span>→</button>',
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
            closeModal(closeModalListener); 
        }
    });
}

function closeModal(closeModalListener) {
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
