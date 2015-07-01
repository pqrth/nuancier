var $overlays = [],
    $cropImage = $('#cropImage'),
    cropImageWidth = $cropImage.width(),
    cropImageHeight = $cropImage.height(),
    patt = /-(\d+)x(\d+).(\w{3,4})/g,
    res = patt.exec($('#cropImage').attr('src')),
    wallpaperWidth = res[1],
    wallpaperHeight = res[2],
    wallpaperFormat = res[3],
    imageScale = cropImageWidth / wallpaperWidth;

$(document).ready(function() {
    $('#addOverlay').click(function() {
        var xAspect = $('#xAspect').val();
        var yAspect = $('#yAspect').val();
        if(Number(xAspect) > 0 && Number(yAspect) > 0) {
            var dynamic_div = $(document.createElement('div')).css({
                width: xAspect * imageScale,
                height: yAspect * imageScale
            });
            $(dynamic_div).addClass('overlays').draggable().resizable();
            $(dynamic_div).appendTo('#cropArea');
            $(dynamic_div)
            .append('<span class="delete"></span>');
            $overlays.push($(dynamic_div));
        }
    });
    $('#enlargeOverlay').click(function() {
        for(var i = 0; i < $overlays.length; i++) {
            $overlays[i].css({
                    'width' : $overlays[i].width()  * 1.1,
                    'height': $overlays[i].height() * 1.1
            });
        }
    });
    $('#shrinkOverlay').click(function() {
        for(var i = 0; i < $overlays.length; i++) {
            $overlays[i].css({
                    'width' : $overlays[i].width()  / 1.1,
                    'height': $overlays[i].height() / 1.1
            });
        }
    });
    $('#cropArea').on('click','.delete',function () {
        $(this).parent().remove();
        $toDelete = $(this).parent();
        $overlays.splice($overlays.indexOf($toDelete), 1);
        $toDelete.remove();
        return false;
    });
    $('#downloadCrop').click(function() {
        var cropCanvas = document.createElement('canvas'),
            wallpaperImage = $("<img/>").attr("src", $cropImage.attr("src")).get(0);
        for(var i = 0; i < $overlays.length; i++) {
            var left = ($overlays[i].offset().left - $cropImage.offset().left) / imageScale,
                top =  ($overlays[i].offset().top - $cropImage.offset().top) / imageScale,
                width = $overlays[i].width() / imageScale,
                height = $overlays[i].height() / imageScale;

            cropCanvas.width = width;
            cropCanvas.height = height;

            cropCanvas.getContext('2d').drawImage(wallpaperImage, left, top, width, height, 0, 0, width, height);
            window.open(cropCanvas.toDataURL('image/'+ wallpaperFormat));
        }
    });
});
