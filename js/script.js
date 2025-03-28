document.addEventListener("DOMContentLoaded", async function () {
    let languageSelector = document.getElementById("language-selector");
    changeLanguage(languageSelector.value, false);

    languageSelector.addEventListener("change", function () {
        changeLanguage(this.value, true);
    });

    try {
        const response = await fetch("js/projects.json");
        const projects = await response.json();

        await createCarouselItems(projects);

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
}

async function createCarouselItems(projects) {
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
            description.classList.add("mt-2", "text-sm");
            description.textContent = project.description;
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
    const modal = document.getElementById("project-modal");
    const modalGallery = document.getElementById("modal-gallery");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");

    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalGallery.innerHTML = ''; 
    project.gallery.forEach((image) => {
        const img = document.createElement("img");
        img.src = image;
        img.classList.add("w-full", "h-auto", "object-cover");
        modalGallery.appendChild(img);
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