(function(){
    var leftSlide = document.getElementById("left-slide")
    var rightSlide = document.getElementById("right-slide")
    var slider = document.getElementById("trending-now-slider")

    rightSlide.onclick = function(){MoveSlider(true)}
    leftSlide.onclick = function(){MoveSlider(false)}
    slider.onscroll = checkSlideEnd
    function MoveSlider(dir){
        by = slider.children[0].clientWidth * Math.floor(slider.clientWidth / slider.children[0].clientWidth)
        if(!dir){by *= -1}
        var leftScroll = slider.scrollLeft
        slider.scroll({top:0,left:leftScroll + by,behavior:"smooth"})
    }
    function checkSlideEnd(){
        var leftScroll = slider.scrollLeft
        var totalScroll = slider.scrollWidth - slider.clientWidth
        if(leftScroll >= totalScroll){
            rightSlide.disabled = true
        }
        else{rightSlide.disabled = false}
        if(leftScroll <= 0){
            leftSlide.disabled = true
        }
        else{leftSlide.disabled = false}
    }
}())
