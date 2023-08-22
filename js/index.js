(function(){
    var leftSlide = document.getElementById("left-slide")
    var rightSlide = document.getElementById("right-slide")
    var slider = document.getElementById("trending-now-slider")

    rightSlide.onclick = function(){MoveSlider(400)}
    leftSlide.onclick = function(){MoveSlider(-400)}
    function MoveSlider(by){
        slider.scrollBy(by,0)
        var totalScroll = slider.scrollWidth - slider.clientWidth
        if(slider.scrollLeft >= totalScroll){
            rightSlide.disabled = true
        }
        else{rightSlide.disabled = false}
        if(slider.scrollLeft <= 0){
            leftSlide.disabled = true
        }
        else{leftSlide.disabled = false}
    }
}())