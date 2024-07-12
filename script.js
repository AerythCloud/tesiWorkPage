const imageDisplay = document.getElementById('imageDisplay');
    const images = [      
        "https://i.postimg.cc/x8PF9WHK/1-Eden-BG.png",
        "https://i.postimg.cc/mDC55cgp/2-Miele-BG.png",
        "https://i.postimg.cc/zvNcZJLz/3-GEOX-BG.png",
        "https://i.postimg.cc/8kdYdr3j/4-Reply-BG.png",
        "https://i.postimg.cc/fTwr8Rn5/5-Miele-BG.png",
        "https://i.postimg.cc/Qx0nwZjD/6-Frau-BG.png",
        "https://i.postimg.cc/L850MQs1/7-Stellantis-BG.png",
        "https://i.postimg.cc/q7CbNtyB/8-REPLY-BG.png",
        "https://i.postimg.cc/9QkgXP4N/9-Marelli-BG.png",
        "https://i.postimg.cc/j508Ps4H/10-Turisanda-BG.png"
    ];

     const swiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        slidesPerView: '5',
        centeredSlides: true,
        loop: true,
        loopAdditionalSlides: 10, // Ensure continuous scrolling by duplicating slides
        mousewheel: {
            releaseOnEdges: true,
        },
        on: {
            slideChangeTransitionEnd: function () {
                const activeIndex = this.realIndex;
                imageDisplay.style.opacity = 0;
                setTimeout(() => {
                    imageDisplay.src = images[activeIndex];
                    imageDisplay.style.opacity = 1;
                }, 500);
            },
            slideChange: function () {
                document.querySelectorAll('.swiper-slide').forEach(slide => {
                    slide.classList.remove('swiper-slide-active');
                });
                const activeSlide = document.querySelector('.swiper-slide.swiper-slide-active');
                if (activeSlide) {
                    activeSlide.classList.add('swiper-slide-active');
                }
            }
        }
    });

    // Handle click on slides
    document.querySelectorAll('.swiper-slide').forEach(slide => {
        slide.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            swiper.slideToLoop(parseInt(index), 500);
        });
    });

    // Allow whole page scroll
    window.addEventListener('wheel', (event) => {
        if (event.deltaY > 0) {
            swiper.slideNext();
        } else {
            swiper.slidePrev();
        }
    });

    // Initial trigger to set the active class
    document.querySelector('.swiper-slide-active').classList.add('swiper-slide-active');
