
// dynamic border change on resize
function adjustBorderRadius() {
    const borderElements = document.querySelectorAll('.dynamic-border');
    for (const el of borderElements) {
        const borderRadius = el.dataset.borders.trim().split(',');
        const valueBig = el.dataset.valueBig || "";
        const valueSmall = el.dataset.valueSmall || "";

        console.log(el.dataset)
        const v = window.innerWidth > 1750 ? valueBig : valueSmall;
        for (const borderAttribute of borderRadius) {
            el.style[borderAttribute] = v
        }
    }
}
adjustBorderRadius();
window.addEventListener('resize', adjustBorderRadius);

    // const imgContainer = document.querySelector('.img-container');
    // const heroImage = document.querySelector('.hero1 img');
    // const col35Image = document.querySelector('.col-35 img');
    // const Hero6img = document.querySelector('.hero6 img');

    

    // adjustBorderRadius(imgContainer, ['borderBottomRightRadius'], "", "0");
    // adjustBorderRadius(heroImage, ['borderTopLeftRadius', "borderBottomLeftRadius"], "30px", "");
    // adjustBorderRadius(col35Image, ['borderTopRightRadius'], "20px", "");
    // adjustBorderRadius(Hero6img, ['borderBottomRightRadius', "borderTopRightRadius"], "20px", "");

    // window.addEventListener('resize', () => {
    //     adjustBorderRadius(imgContainer, ['borderBottomRightRadius'], "", "0");
    //     adjustBorderRadius(heroImage, ['borderTopLeftRadius', "borderBottomLeftRadius"], "30px", "");
    //     adjustBorderRadius(col35Image, ['borderTopRightRadius'], "20px", "");
    //     adjustBorderRadius(Hero6img, ['borderBottomRightRadius', "borderTopRightRadius"], "20px", "");
    // });


const entryAnimations = document.querySelectorAll('.fade-in, .text-reveal');



const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    // Verifica se l'elemento è entrato nella visualizzazione
    if (entry.isIntersecting) {
    entry.target.classList.add("visible")
      
      // Smette di osservare l'elemento dopo che è stato reso visibile
      observer.unobserve(entry.target);
    }
  });
});

// osservatore a ciascun elemento con la classe ".fade-in"
entryAnimations.forEach(entryAnimation => {
  observer.observe(entryAnimation);
});



// ScrollTrigger.batch(".fade-up",{
//   start: "top 80%",
//   onEnter: (elements, triggers) => {
//     gsap.to(elements, { opacity: 1, stagger: 0.3, y:0, duration: 1.5,  ease: Power2.easeOut });
//     console.log(elements.length, "elements entered");
//   }
// });

// gsap.to( ".text-reveal" , { clipPath:"polygon(0 0, 100% 0, 100% 100%, 0 100%)",  y:0, duration:1, stagger: 0.3});


