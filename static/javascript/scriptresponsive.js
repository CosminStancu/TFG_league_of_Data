$('#header').prepend('<div id="menu-icon"><span class="first"></span><span class="second"></span><span class="third"></span></div>');

$("#menu-icon").on("click", function () {
    $(".mainHeader").slideToggle();
    $(".barraLateral").toggleClass("desaparecer")
    
});

