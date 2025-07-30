document.addEventListener("DOMContentLoaded", () => {
    console.log("SCRIPT.JS TERBACA DAN DOM CONTENT LOADED!");

    const slider = document.getElementById("projectSlider");
    const slides = slider.querySelectorAll(".slide");
    const prevBtn = document.querySelector(".slider-nav.prev");
    const nextBtn = document.querySelector(".slider-nav.next");

    // Debugging: Cek apakah elemen-elemen ditemukan
    console.log("Slider element found:", !!slider); // Output true jika ditemukan
    console.log("Number of slides found:", slides.length); // Output jumlah slide

    const setActiveSlide = () => {
        const sliderRect = slider.getBoundingClientRect();
        const sliderCenterRelativeToViewport = sliderRect.left + (sliderRect.width / 2);

        slides.forEach((slide) => {
            const slideRect = slide.getBoundingClientRect();
            const slideCenterRelativeToViewport = slideRect.left + (slideRect.width / 2);

            const distance = Math.abs(
                slideCenterRelativeToViewport - sliderCenterRelativeToViewport
            );
            
            const threshold = slideRect.width * 0.4; 

            if (distance < threshold) {
                slide.classList.add("active");
            } else {
                slide.classList.remove("active");
            }
        });
    };

    let currentSlideIndex = 0;

    const goToSlide = (index) => {
        if (!slider || slides.length === 0) {
            console.log("ERROR: Slider atau slide tidak ditemukan saat goToSlide dipanggil.");
            return; // Penting: Hentikan fungsi jika elemen tidak ada
        }

        if (index < 0) {
            index = 0;
        }
        if (index >= slides.length) {
            index = slides.length - 1;
        }

        currentSlideIndex = index;
        const targetSlide = slides[currentSlideIndex];

        if (targetSlide) {
            const scrollLeftTarget = targetSlide.offsetLeft - (slider.offsetWidth / 2) + (targetSlide.offsetWidth / 2);
            
            console.log("--- GO TO SLIDE DEBUG ---");
            console.log("Target Slide Index:", currentSlideIndex);
            console.log("Target Slide offsetLeft:", targetSlide.offsetLeft);
            console.log("Slider offsetWidth:", slider.offsetWidth);
            console.log("Target Slide offsetWidth:", targetSlide.offsetWidth);
            console.log("Calculated scrollLeftTarget:", scrollLeftTarget);
            console.log("-------------------------");

            // Pastikan scrollLeftTarget adalah angka valid
            if (isNaN(scrollLeftTarget) || !isFinite(scrollLeftTarget)) {
                console.error("Calculated scrollLeftTarget is not a valid number:", scrollLeftTarget);
                return; // Hentikan jika nilai tidak valid
            }

            slider.scrollTo({
                left: scrollLeftTarget,
                behavior: 'smooth'
            });
        } else {
            console.log("Target slide tidak ditemukan untuk index:", currentSlideIndex);
        }
        updateNavButtons();
    };

    const updateNavButtons = () => {
        prevBtn.disabled = currentSlideIndex === 0;
        nextBtn.disabled = currentSlideIndex === slides.length - 1;
    };

    slider.addEventListener("scroll", () => {
        setActiveSlide();
        let closestSlideIndex = 0;
        let minDistance = Infinity;

        const sliderScrollCenter = slider.scrollLeft + (slider.clientWidth / 2);

        slides.forEach((slide, index) => {
            const slideCenterRelativeToScroll = slide.offsetLeft + (slide.offsetWidth / 2);
            const distance = Math.abs(slideCenterRelativeToScroll - sliderScrollCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestSlideIndex = index;
            }
        });
        currentSlideIndex = closestSlideIndex;
        updateNavButtons();
    });

    prevBtn.addEventListener("click", () => {
        goToSlide(currentSlideIndex - 1);
    });

    nextBtn.addEventListener("click", () => {
        goToSlide(currentSlideIndex + 1);
    });

    setTimeout(() => {
        console.log("Initial goToSlide(0) call after timeout. Ready to scroll.");
        goToSlide(0); 
    }, 500); 

});