var swiper1 = new Swiper('.swiper-container',{
    effect:'coverflow',
    grabCursor:true,
    centeredSlides:true,
    slidesPerView:'auto',
    coverflowEffect:
    {
        rotate:0,
        stretch:0,
        depth:100,
        modifier:2,
        slideShadows:true
    },
    loop:true,
    autoplay:true

    // pagination:{
    //     el:'.swiper-pagination',
    // }
});

var swiper2 = new Swiper(".mySwiper", {
    slidesPerView: 3,
    grabCursor:true,
    spaceBetween: 5,
    slidesPerGroup: 3,
    loop: true,
    loopFillGroupWithBlank: true,
    
    
  });

  