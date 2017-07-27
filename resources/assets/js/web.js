$(document).ready(function() {
    var cartBtn = $('.cart-title')
    cartBtn.on('click', function () {
        var parent = cartBtn.parent()
        if (parent.hasClass('hovered')) {
            parent.removeClass('hovered')
        } else {
            parent.addClass('hovered')
        }
    })
});