export function whenScrollDown(cb,min=0){
    var didScroll;
    var lastScrollTop = 0;
    const delta = 5;

    window.onscroll = function() {
        didScroll = true;
    };
    window.setInterval && window.setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        var st = window.pageYOffset;

        // Make sure they scroll more than delta
        if(Math.abs(lastScrollTop - st) <= delta)
            return;

        // If they scrolled down and are past the navbar, add class .nav-up.
        // This is necessary so you never see what is "behind" the navbar.
        if (st > lastScrollTop && st > min){
            // Scroll Down
            cb(true);
        } else {
            // Scroll Up
            if(st) {
                cb(false);
            }
        }

        lastScrollTop = st;
    }
}