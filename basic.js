$(document).ready(function() {
    var $flipbook = $('.flipbook');

    function loadApp() {
        $flipbook.turn({
            width: 922,
            height: 600,
            elevation: 50,
            gradients: true,
            autoCenter: true
        });
    }

    yepnope({
        test: Modernizr.csstransforms,
        yep: ['../../lib/turn.js'],
        nope: ['../../lib/turn.html4.min.js'],
        both: ['css/basic.css'],
        complete: loadApp
    });

    $('#zoom-slider').on('input change', function() {
        var zoomLevel = $(this).val() / 100;
        $flipbook.css('transform', 'scale(' + zoomLevel + ')');
    });

    var isPanning = false, startPoint = { x: 0, y: 0 }, startTransform = { x: 0, y: 0 };

    $('.flipbook-viewport').on('mousedown touchstart', function(e) {
        e.preventDefault();
        isPanning = true;
        startPoint = {
            x: e.pageX || e.originalEvent.touches[0].pageX,
            y: e.pageY || e.originalEvent.touches[0].pageY
        };
        var transform = parseTransform($flipbook.css('transform'));
        startTransform = transform || { x: 0, y: 0 };
    });

    $(window).on('mousemove touchmove', function(e) {
        if (isPanning) {
            e.preventDefault();
            var currentPoint = {
                x: e.pageX || e.originalEvent.touches[0].pageX,
                y: e.pageY || e.originalEvent.touches[0].pageY
            };
            var deltaX = currentPoint.x - startPoint.x,
                deltaY = currentPoint.y - startPoint.y;

            $flipbook.css('transform', 'translate(' + (startTransform.x + deltaX) + 'px, ' + (startTransform.y + deltaY) + 'px) scale(' + ($('#zoom-slider').val() / 100) + ')');
        }
    });

    $(window).on('mouseup touchend', function() {
        isPanning = false;
    });

    function parseTransform(transformString) {
        var matrix = transformString.match(/matrix\(([^)]+)\)/);
        if (matrix && matrix[1]) {
            var values = matrix[1].split(', ');
            return {
                x: parseFloat(values[4]),
                y: parseFloat(values[5])
            };
        }
        return { x: 0, y: 0 }; // Default to no translation
    }

    $('.flipbook img').on('mousedown', function(e) {
        e.preventDefault(); // Prevent image dragging
    });
});
