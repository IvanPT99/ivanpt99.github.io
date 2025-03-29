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
    let currentLanguage = document.getElementById("language-selector").value;

    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description.long[currentLanguage];
    modalGallery.innerHTML = ''; 
    project.gallery.forEach((image) => {
        let img = document.createElement("img");
        img.src = image;
        img.classList.add("w-full", "h-auto", "object-cover");
        modalGallery.appendChild(img);
    });

    modalSkills.innerHTML = '';
    project.skills.forEach(skill => {
        const skillDiv = document.createElement("div");
        skillDiv.classList.add("skill-chip", "flex", "items-center", "bg-gray-200", "p-2", "rounded-full", "m-1");

        const skillLogo = document.createElement("img");
        skillLogo.src = techLogos[skill];
        skillLogo.alt = skill;
        skillLogo.classList.add("w-6", "h-6", "mr-2");

        const skillName = document.createElement("span");
        skillName.textContent = skill;
        skillName.classList.add("text-sm");

        skillDiv.appendChild(skillLogo);
        skillDiv.appendChild(skillName);
        modalSkills.appendChild(skillDiv);
    });


    if ($(modalGallery).hasClass('slick-initialized')) {
        $(modalGallery).slick('unslick'); 
    }

    $(modalGallery).slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: '<button type="button" class="slick-prev">←</button>',
        nextArrow: '<button type="button" class="slick-next">→</button>',
    });

    modal.classList.remove("hidden");
    modal.classList.add('flex');


    modal.addEventListener("click", function closeModalListener(e) {
        if (e.target === modal) {
            closeModal(closeModalListener); 
        }
    });
}


function closeModal(closeModalListener) {
    const modal = document.getElementById("project-modal");
    modal.classList.remove('flex');
    modal.classList.add("hidden"); 
    modal.removeEventListener("click", closeModalListener);
}