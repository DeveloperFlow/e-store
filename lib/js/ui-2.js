function autoFetch(element,cb,threshold,direction){
    /* interface for scrolling down and fetching more content
        # the "cb" is a callback to handle the fetching of contents
        or whatever you want to do, musn't necessarily be fetching contents
        as for data that might be needed, the object will be sent as the first
        parameter of the callback, if no valid function is specified as a callback
        then the callback parameter should be an object containing information
        for retrieving the more contents , the syntax should be:
        {url:["the url to fetch the contents"],
        contentIndex:["the index of the content, it increments by
            the number of children the body of the response has"],
        contentIndexKey : ["the key to use when sending the content index"],
        cb : ["a call back to call for each of the content"],
        mcb : ["a callback to call before fetching"]
        }

        # the "threshold" parameter specifies how far in percentage of the total
        available scrolling area should be scrolled before more content is fetched
        defaults to 75%
        
        # the "direction" parameter specifies the direction of the scroll
        it can only be two values "x or y" defaults to y
    */
   this.getDirection = function(direction){
    return (inarray(["x","y"],direction,true))? direction : "y"
   }
    var self = this
    this.window = element
    this.threshold = (isNumeric(threshold))? threshold : 75
    this.direction = this.getDirection(direction)
    this.directions = {x:"scrollLeft",y:"scrollTop"}
    this.totalScrolls = {x:"scrollWidth",y:"scrollHeight"}
    
    this.fetchContent = function(e){
        if(self.stopFetch || self.lockFetch){return}
        var element = e.target
        var direction = self.getDirection()
        var dimension = (direction == "y")? 
        element.clientHeight : element.clientWidth;
        var scrollPositionProperty = self.directions[direction]
        var totalScrollProperty = self.totalScrolls[direction]
        var scrollPosition = element[scrollPositionProperty]
        var totalScroll = element[totalScrollProperty] - dimension
        var scrollPercent = (scrollPosition / totalScroll) * 100
        if(scrollPercent > self.threshold){self.cb(self)}
    }

    this.useMoreButton = function(){
        /*if the element doesn't yet have a scroll bar a more button will 
        be used
        */
        if(scrollable(this.window,this.getDirection()) || this.lockFetch){
            return this.removeMoreButton()
        }
        if(!this.moreButton){
            this.moreButton = document.createElement("a")
            this.moreButton.innerHTML = "Show more"
            this.moreButton.href = "javascript:void(0)"
            this.moreButton.onclick = function(){
                self.cb(self)
            }
        }
        this.window.appendChild(this.moreButton)
    }
    this.removeMoreButton = function(){
        if(this.moreButton){remove(this.moreButton)}
    }
    this.defaultCb = function(){
        /*the default call back to be used for fetching more contents*/
        if(!this.req){
            this.req = new Req()
            this.req.url = this.fetchDetails.url
            this.req.method = "POST"
            this.req.responseType = "document"
            
            this.req.onload = function(req){
                var object = req.object
                var response = object.responseXML
                if(response instanceof Document){
                    var body = response.body
                    var children = body.children
                    var formalIndex = self.fetchDetails.contentIndex
                    self.removeError()
                    for(var i=0; i < children.length; i++){
                        if(isFunction(self.fetchDetails.cb)){
                            self.fetchDetails.cb(children[i])
                        }
                        self.window.appendChild(children[i])
                        i--
                        self.fetchDetails.contentIndex++
                    }
                    if(self.fetchDetails.contentIndex == formalIndex){ 
                        self.lockFetch = true;
                    }
                    self.useMoreButton()
                    self.stopFetch = false
                }
            }
            this.req.onerror = function(req){
                self.error()
                self.setErr()
                self.window.appendChild(self.errElement)
                self.lockFetch = true
                self.stopFetch = false
            }
            this.req.ontimeout = function(req){
                self.error()
                self.errMsgBox.innerHTML = "This request took too long"
                self.window.appendChild(this.errElement)
                self.lock = true
                self.stopFetch = false
            }
        }
        self.stopFetch = true;
        self.lockFetch = false;
        self.req.message = {}
        self.req.message[self.fetchDetails.contentIndexKey] = 
        self.fetchDetails.contentIndex
        if(isFunction(self.fetchDetails.mcb)){self.fetchDetails.mcb(self)}
        self.removeMoreButton()
        self.removeError()
        self.req.send()
    }
    this.setErr = function(){
        if(!navigator.onLine){
            this.errorMessage = "Looks like you are offline"
        }
        else{this.errorMessage = "Something went wrong"}
        this.errMsgBox.innerHTML = this.errorMessage
    }
    this.error = function(){
        if(!this.errElement){
            this.errElement = document.createElement("div")
            this.errMsgBox = document.createElement("span")
            this.errMsgBox.className = "error"
            this.tryBtn = document.createElement("button")
            this.tryBtn.innerHTML = "Try Again"; 
            this.tryBtn.onclick = function(){self.cb(self)}
            this.errElement.appendChild(this.errMsgBox)
            this.errElement.appendChild(this.tryBtn)
        }
    }
    this.removeError = function(){if(this.errElement){remove(this.errElement)}}
    this.cb = (isFunction(cb))? cb : this.defaultCb
    this.fetchDetails = (isFunction(cb))? null : cb
    this.useMoreButton()
    addEvent(element,"scroll",this.fetchContent)
}