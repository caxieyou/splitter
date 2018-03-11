function Corner(param1) {
    if (param1 == null || param1 == undefined) {
        param1 = null;
    }
    this.mFloor = param1;
    this.mPosition = new Vec2();
    this.mElements = [];
    this.initialize();
    this.mId = ID.assignUniqueId();
}

Corner.prototype.initialize = function()
{
    this.mPosition = new Vec2();
    this.mElements = [];
    mPosition = new Vec2();
}

Corner.prototype.dispose = function()
{
    for(var i = 0; i < this.mElements.length; i++)
    {
        this.mElements[i].setCornerStartAndEndButHasToBeSame(this,null);
    }
    if(this.mFloor != null)
    {
        this.mFloor.removeCorner(this);
    }
}

Corner.prototype.clone = function()
{
    var _loc1_ = new Corner(this.mFloor);
    _loc1_.mElements = this.mElements.concat();
    _loc1_.mPosition = this.mPosition;
    return _loc1_;
}

Corner.prototype.addElement = function(param1)
{
    return MyArray.ifHasAndSave(this.mElements,param1);
}

Corner.prototype.removeElement = function(param1)
{
    return MyArray.removeItem(this.mElements,param1);
}

Corner.prototype.updatePosition = function(x, y)
{
    var arc = [];
    for (var i = 0; i < this.mElements.length; i++) {
        if (this.mElements[i] instanceof Arc) {
            arc.push(this.mElements[i].getCurve().mArcAngle);
        }
    }
    
    if (this.mFloor) {

        var curves = this.mFloor.mElements;

        for (var i = 0; i < curves.length; i++) {
            var curve = curves[i];
            var same = false;

            for (var j = 0; j < this.mElements.length; j++) {
                if (this.mElements[j].mId == curve.mId) {
                    same = true;
                    break;
                }
            }

            if (!same) {
                if (curve instanceof Segment) {
                    var edge = curve.getTheStartEndEdge();
                    if (edge.distanceSmallThan(new Vec2(x, y), 5)) {
                        return true;
                    }
                }

                if (curve instanceof Arc) {
                    var edge = curve.getCurve(); 
                    if (edge.getDistance(new Vec2(x, y)) < 5) {
                        return true;
                    }
                }
            }
        }

    }
    
    this.mPosition.set(x, y);
    var idx = 0;
    for (var i = 0; i < this.mElements.length; i++) {
        if (this.mElements[i] instanceof Arc) {
            this.mElements[i].adjustCurve(arc[idx]);
            idx++;
        }
    }
}

Corner.prototype.getLast = function(){
    return this.mPosition.clone();
}

Corner.prototype.revertUpdatePosition = function(last) {
    this.updatePosition(last.mX, last.mY);
}

Corner.prototype.isBoundryCorner = function() {
    var ret = false;
    
    for (var i = 0; i < this.mElements.length; i++) {
        if (this.mElements[i].isBoundry) {
            return true;
        }
    }
    return ret;
}

Corner.prototype.getBoundrySegments = function() {
    var ret = [];
    
    for (var i = 0; i < this.mElements.length; i++) {
        if (this.mElements[i].isBoundry) {
            ret.push(this.mElements[i].getTheStartEndEdge());
        }
    }
    return ret;
}
