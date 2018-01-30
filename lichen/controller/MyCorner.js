function MyCorner(param1) {
    if (param1 == null || param1 == undefined) {
        param1 = null;
    }
    this.mWall = param1;
    this.mPosition = new Vec2();
    this.mCurves = [];
    this.initialize();
    this.mId = ID.assignUniqueId();
}

MyCorner.prototype.initialize = function()
{
    this.mPosition = new Vec2();
    this.mCurves = [];
    mPosition = new Vec2();
}

MyCorner.prototype.dispose = function()
{
    for(var i = 0; i < this.mCurves.length; i++)
    {
        this.mCurves[i].setCornerStartAndEndButHasToBeSame(this,null);
    }
    if(this.mWall != null)
    {
        this.mWall.removeCorner(this);
    }
}

MyCorner.prototype.clone = function()
{
    var _loc1_ = new MyCorner(this.mWall);
    _loc1_.mCurves = this.mCurves.concat();
    _loc1_.mPosition = this.mPosition;
    return _loc1_;
}
MyCorner.prototype.addSection = function(param1)
{
    return ArrayHelperClass.ifHasAndSave(this.mCurves,param1);
}

MyCorner.prototype.removeSection = function(param1)
{
    return ArrayHelperClass.removeItem(this.mCurves,param1);
}

MyCorner.prototype.updatePosition = function(x, y)
{
    var arc = [];
    for (var i = 0; i < this.mCurves.length; i++) {
        if (this.mCurves[i] instanceof CurveController) {
            arc.push(this.mCurves[i].getCurveFromController().mArcAngle);
        }
    }
    
    if (this.mWall) {

        var curves = this.mWall.mCurves;

        for (var i = 0; i < curves.length; i++) {
            var curve = curves[i];
            var same = false;

            for (var j = 0; j < this.mCurves.length; j++) {
                if (this.mCurves[j].mId == curve.mId) {
                    same = true;
                    break;
                }
            }

            if (!same) {
                if (curve instanceof SegmentController) {
                    var edge = curve.getTheStartEndEdge();
                    if (edge.distanceSmallThan(new Vec2(x, y), 5)) {
                        return true;
                    }
                }

                if (curve instanceof CurveController) {
                    var edge = curve.getCurveFromController(); 
                    if (edge.getDistance(new Vec2(x, y) < 5)) {
                        return true;
                    }
                }
            }
        }

    }
    
    this.mPosition.set(x, y);
    var idx = 0;
    for (var i = 0; i < this.mCurves.length; i++) {
        if (this.mCurves[i] instanceof CurveController) {
            this.mCurves[i].adjustCurve(arc[idx]);
            idx++;
        }
    }
}

MyCorner.prototype.getLast = function(){
    return this.mPosition.clone();
}

MyCorner.prototype.revertUpdatePosition = function(last) {
    this.updatePosition(last.mX, last.mY);
}

MyCorner.prototype.isBoundryCorner = function() {
    var ret = false;
    
    for (var i = 0; i < this.mCurves.length; i++) {
        if (this.mCurves[i].isBoundry) {
            return true;
        }
    }
    return ret;
}

MyCorner.prototype.getBoundrySegments = function() {
    var ret = [];
    
    for (var i = 0; i < this.mCurves.length; i++) {
        if (this.mCurves[i].isBoundry) {
            ret.push(this.mCurves[i].getTheStartEndEdge());
        }
    }
    return ret;
}
