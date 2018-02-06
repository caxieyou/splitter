function Arc(param1) {
    if (param1 == null || param1 == undefined) {
        param1 = null;
    }
    this.mFloor      = param1;
    this.mStart      = new Corner(param1);
    this.mEnd        = new Corner(param1);
    this.mAreas      = [];
    this.mCurvePoint = new Vec2();
    this.mId         = ID.assignUniqueId();
}

Arc.CONST_SPLIT = 0.3333333;
Arc.TOLERANCE   = 1.0E-6;


Arc.copy = function(param1)
{
    var _loc2_ = null;
    var _loc3_ = new Arc();
    _loc2_ = new Corner();
    _loc2_.mPosition = param1.getPointByRatio(0);
    _loc3_.updateStartCorner(_loc2_);
    _loc2_ = new Corner();
    _loc2_.mPosition = param1.getPointByRatio(1);
    _loc3_.updateEndCorner(_loc2_);
    _loc3_.mCurvePoint = param1.getPointByRatio(Arc.CONST_SPLIT);
    return _loc3_;
}

Arc.isIntersectWith = function(param1, param2, param3, param4)
{
    if (param2 == null || param2 == undefined) {
        param2 = null;
    }
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }

    var _loc5_ = null;
    var _loc6_ = null;
    var _loc7_ = null;
    var _loc8_ = null;
    if(param1 instanceof Curve)
    {
        _loc6_ = param1;
        return this.isCurveIntersectByAreaAndGetIntersectPoint(_loc6_,param2,param3,param4);
    }
    if(param1 instanceof Edge)
    {
        _loc8_ = param1;
        return this.intersectSub(_loc8_,param2,param3,param4);
    }
    return false;                   
}

Arc.prototype.getCircleCenter = function()
{
    var _loc1_ = new Edge(this.mStart.mPosition.clone(),this.mEnd.mPosition.clone());
    var _loc2_ = new Edge(this.mStart.mPosition.clone(),this.mCurvePoint.clone());
    var _loc3_ = _loc1_.interpolate(0.5);
    var _loc4_ = _loc2_.interpolate(0.5);
    var _loc5_ = _loc1_.rotate_90_degree();
    var _loc6_ = _loc2_.rotate_90_degree();
    var _loc7_ = Edge.getPointVectorEdge(_loc3_,_loc5_);
    var _loc8_ = Edge.getPointVectorEdge(_loc4_,_loc6_);
    return Edge.getIntersection(_loc7_,_loc8_,0);
}

Arc.prototype.containsPoint = function(param1)
{
    return this.getCurve().isInsideCurveAndOnCurve(param1);
}

Arc.prototype.getCurve = function()
{
    var _loc1_ = this.getCircleCenter();
    if(isNaN(_loc1_.mX) || isNaN(_loc1_.mY))
    {
        return new Curve(this.mStart.mPosition, Arc.TOLERANCE, Arc.TOLERANCE, Arc.TOLERANCE);
    }
    var _loc2_ = this.mStart.mPosition.clone().sub(_loc1_).getAngle();
    var _loc3_ = this.mEnd.mPosition.clone().sub(_loc1_).getAngle();
    var _loc4_ = _loc3_ - _loc2_;
    var _loc5_ = _loc1_.distance(this.mStart.mPosition);
    var _loc6_ = new Curve(_loc1_,_loc5_,_loc2_,_loc4_);
  
    if(!_loc6_.isInsideArcFan(this.mCurvePoint.clone()))
    {
        _loc6_.mArcAngle = -1 * MyMath.sign(_loc4_) * (Angle.CONST_2_PI - Math.abs(_loc4_));
    }
    return _loc6_;
}


Arc.prototype.setCornerStartAndEndButHasToBeSame = function(param1, param2)
{
    if(param1 == this.mStart)
    {
        this.updateStartCorner(param2);
    }
    if(param1 == this.mEnd)
    {
        this.updateEndCorner(param2);
    }
}
      
Arc.prototype.isHasAndSaveOnCurve = function(param1)
{
    var _loc2_ = ArrayHelperClass.ifHasAndSave(this.mAreas, param1);
    return _loc2_;
}

Arc.prototype.updateInfo = function(param1)
{
    var _loc2_ = this.getCurve();
    var _loc3_ = param1.mPosition.clone().sub(this.getCircleCenter()).getAngle();
    var _loc4_ = _loc2_.getAngleRatio(_loc3_);
    var _loc5_ = _loc2_.getPointByRatio(_loc4_ * Arc.CONST_SPLIT);
    var _loc6_ = _loc2_.getPointByRatio(_loc4_ + (1 - _loc4_) * Arc.CONST_SPLIT);
    var _loc7_ = wallCurveCornerHelper.getCornerByPos_XX(_loc2_.getPointByRatio(1),[this.mStart, this.mEnd]);
    var _loc8_ = new Arc();
    
    _loc8_.updateStartCorner(param1);
    
    _loc8_.updateEndCorner(_loc7_);
    _loc8_.mCurvePoint = _loc6_;
    if(_loc7_ == this.mEnd)
    {
        this.updateEndCorner(param1);
    }
    else
    {
        this.updateStartCorner(param1);
    }
    this.mCurvePoint = _loc5_;
    this.mFloor.addElement(_loc8_);
    return _loc8_;
}

Arc.prototype.getStartOrEndOrNull = function(param1)
{
    if(param1 == this.mStart)
    {
        return this.mEnd;
    }
    if(param1 == this.mEnd)
    {
        return this.mStart;
    }
    return null;
}

Arc.prototype.wallDleleteSame = function(param1)
{
    return ArrayHelperClass.removeItem(this.mAreas,param1);
}

Arc.prototype.updateStartCorner = function(param1) {
    if(this.mStart != null)
    {
        this.mStart.removeElement(this);
    }
    this.mStart = param1;
    if(this.mStart != null)
    {
        this.mStart.addElement(this);
    }
};

Arc.prototype.updateEndCorner = function(param1) {
    if(this.mEnd != null)
    {
        this.mEnd.removeElement(this);
    }
    this.mEnd = param1;
    if(this.mEnd != null)
    {
        this.mEnd.addElement(this);
    }
};

Arc.prototype.isStart = function(param1)
{
    return this.mStart == param1;
}

Arc.prototype.isEnd = function(param1)
{
    return this.mEnd == param1;
}

Arc.prototype.getTheStartEndEdge = function()
{
    return new Edge(this.mStart.mPosition,this.mEnd.mPosition);
}

Arc.prototype.resetCurve = function(param1)
{
    if(this.mStart == null || this.mEnd == null || isNaN(param1))
    {
        return;
    }
    var _loc2_ = Curve.createCurveByEdgeNumber(this.getTheStartEndEdge(),param1);
    
    this.mCurvePoint.copy(_loc2_.getPointByRatio(Arc.CONST_SPLIT));
}

Arc.prototype.adjustCurve = function(param1)
{
    if(this.mStart == null || this.mEnd == null || isNaN(param1))
    {
        return;
    }
    var _loc2_ = Curve.createCurveByEdgeNumber2(this.getTheStartEndEdge(),param1);
    this.mCurvePoint.copy(_loc2_.getPointByRatio(Arc.CONST_SPLIT));
}

Arc.prototype.isStartOrEnd = function(param1)
{
    return param1 == this.mStart || param1 == this.mEnd;
}

Arc.prototype.toCorners = function(param1)
{
    return [this.mStart, this.mEnd];
}

Arc.prototype.isIntersectWith = function(param1, param2, param3, param4)
{
    if (param2 == null || param2 == undefined) {
        param2 = null;
    }
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }

    var _loc5_ = null;
    var _loc6_ = null;
    var _loc7_ = null;
    var _loc8_ = null;
    if(param1 instanceof Arc)
    {
        _loc5_ = param1
        _loc6_ = _loc5_.getCurve();
        return this.isCurveIntersectByAreaAndGetIntersectPoint(_loc6_,param2,param3,param4);
    }
    if(param1 instanceof Segment)
    {
        _loc7_ = param1;
        _loc8_ = _loc7_.getTheStartEndEdge();
        return this.intersectSub(_loc8_,param2,param3,param4);
    }
    return false;                   
}

Arc.prototype.isIntersectWithGeometry = function(param1, param2, param3, param4)
{
    if (param2 == null || param2 == undefined) {
        param2 = null;
    }
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }

    var _loc5_ = null;
    var _loc6_ = null;
    var _loc7_ = null;
    var _loc8_ = null;
    if(param1 instanceof Curve)
    {
        _loc6_ = param1;
        return this.isCurveIntersectByAreaAndGetIntersectPoint(_loc6_,param2,param3,param4);
    }
    if(param1 instanceof Edge)
    {
        _loc8_ = param1;
        return this.intersectSub(_loc8_,param2,param3,param4);
    }
    return false;                   
}

Arc.prototype.intersectSub = function(param1, param2, param3, param4)
{
    if (param2 == null || param2 == undefined) {
        param2 = null;
    }
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }
    var _loc5_ = this.getCurve();
    var _loc6_ = ArcEdgeHelper.getValidIntersectionPointBetweenArcAndEdge(_loc5_,param1);
    if(!param3)
    {
        param1.removePointsNotInside(_loc6_);
        _loc5_.removePointsNotInsideCurve(_loc6_);
    }
    if(_loc6_.length == 0)
    {
        return false;
    }
    if(param2 != null)
    {
        ArrayHelperClass.addItems(param2,_loc6_);
    }
    return true;
}

Arc.prototype.dispose = function()
{
    var _loc2_ = null;
    var _loc3_ = null;
    var _loc1_ = this.toCorners();
    for (var i = 0; i < _loc1_.length; i++) {
        _loc2_ = _loc1_[i];
        if (_loc2_) {
            _loc2_.removeElement(this);
            if(_loc2_.mElements.length == 0)
            {
                _loc2_.dispose();
            }
        }
    }
    
    for (var i = 0; i < this.mAreas.length; i++) {
        _loc3_ = this.mAreas[i];
        _loc3_.removeElement(this);
    }
    
    if(this.mFloor != null)
    {
        this.mFloor.removeElement(this);
    }
}
Arc.prototype.isInsideMyArea = function(param1, param2, param3)
{
    if (param2 == null || param2 == undefined) {
        param2 = false;
    }
    if (param3 == null || param3 == undefined) {
        param3 = 1.0E-6;
    }

    return !!param2 ? this.getCurve().isInsideArcFan(param1,param3) : this.getCurve().isInsideCurveAndNotOnCurve(param1,param3);
}

Arc.prototype.getTheCurveStartEndEdgeToPointDistance = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = true;
    }

    return this.getCurve().getDistance(param1,param2);
}
Arc.prototype.isCurveIntersectByEdgeAndGetIntersectPoint = function(param1, param2, param3, param4)
{
    if (param2 == null || param2 == undefined) {
        param2 = null;
    }
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }
    
    var _loc5_ = this.getCurve();
    var _loc6_ = ArcEdgeHelper.getValidIntersectionPointBetweenArcAndEdge(_loc5_,param1);
    if(!param3)
    {
        param1.removePointsNotInsideCurve(_loc6_);
        _loc5_.removePointsNotInsideCurve(_loc6_);
    }
    if(_loc6_.length == 0)
    {
        return false;
    }
    if(param2 != null)
    {
        ArrayHelperClass.addItems(param2,_loc6_);
    }
    return true;
}

Arc.prototype.isCurveIntersectByAreaAndGetIntersectPoint = function(param1, param2, param3, param4)
{
    if (param2 == null || param2 == undefined) {
        param2 = null;
    }
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }

    var _loc5_ = this.getCurve();
    var _loc6_= ArcEdgeHelper.getCurveIntersectionPoints(_loc5_,param1,param4);
    if(!param3)
    {
        param1.removePointsNotInsideCurve(_loc6_);
        _loc5_.removePointsNotInsideCurve(_loc6_);
    }
    if(_loc6_.length == 0)
    {
        return false;
    }
    if(param2 != null)
    {
        ArrayHelperClass.addItems(param2,_loc6_);
    }
    return true;
}

Arc.prototype.getCenter = function()
{
    return this.getCurve().getPointByRatio(0.5);
}

Arc.prototype.getClosestPoint = function(param1)
{
    return this.getCurve().getClosestPoint(param1);
}

Arc.prototype.switchOrder = function(param1)
{
    if (param1 == null || param1 == undefined) {
        param1 = false;
    }

    if(!param1)
    {
        return this.getCurve().tessallation_NotUnderstand();
    }
    return this.getCurve().tessallation_NotUnderstand().reverse();
}

Arc.prototype.decideSide = function(param1)
{
    var _loc2_ = this.getCurve().decideSide(param1);
    if(_loc2_ == ArcCurvePointSide.ON_RIGHT)
    {
        return DecoCurvePointSide.ON_LEFT;
    }
    if(_loc2_ == ArcCurvePointSide.ON_CURVE)
    {
        return DecoCurvePointSide.ON_CURVE;
    }
    return DecoCurvePointSide.ON_RIGHT;
}


Arc.prototype.getLength = function()
{
    return this.getCurve().getLength();
}

Arc.prototype.getAngle = function()
{
    var _loc1_ = new Edge(this.mStart.mPosition.clone(),this.mEnd.mPosition.clone());
    return _loc1_.getAngle();
}

Arc.prototype.updatePosition = function(x, y) {
    this.mCurvePoint.set(x, y);
}

Arc.prototype.getLast = function(){
    return this.mCurvePoint.clone();
}

Arc.prototype.revertUpdatePosition = function(last) {
    this.updatePosition(last.mX, last.mY);
}

