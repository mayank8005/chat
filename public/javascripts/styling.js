$(document).ready(function(){
$(window).scroll(function() {
    var scroll = $(window).scrollTop();

    if (scroll >200) {
        $(".header").addClass("change");
    } else {
        $(".header").removeClass("change");
    }
});
});
