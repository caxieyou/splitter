
var ArcCurvePointSide = {
    ON_CURVE : 0,
    ON_LEFT : 1,
    ON_RIGHT: 2
    
};


function MyCurve(center, radius, startAngle, arcAngle) {
    this.mCenter = center;
    this.mRadius = radius;
    this.mStartAngle = startAngle;
    this.mArcAngle = arcAngle;
    
};

MyCurve.TOLERANCE = 1.0E-6;

MyCurve.createCurveByEdgeNumber = function(param1, param2)
{
    var _loc3_ = param1.mStart.clone();
    var _loc4_ = param1.mEnd.clone();
    var _loc5_ = param1.getLength();
    
    var _loc6_ = MyMath.sign(param2);
    var _loc7_ = Math.abs(param2);
    var _loc8_ = param1.getCenter();
    var _loc9_ = Math.atan(_loc7_) * 4;
    var _loc10_ = _loc5_ / 2 / Math.tan(_loc9_ / 2);
    var _loc11_ = param1.getVecEndMinusStart().rotate(_loc6_ * Angle.HALF_PI).normalize();
    var _loc12_ = _loc8_.add(_loc11_.mul(_loc10_));
    var _loc13_ = _loc12_.distance(_loc3_);
    var _loc14_ = _loc3_.sub(_loc12_).getAngle();
    var _loc15_ = _loc6_ * _loc9_;
    return new MyCurve(_loc12_,_loc13_,_loc14_,_loc15_);
}

MyCurve.prototype.diagnose = function()
{
    if(isNaN(this.mStartAngle))
    {
        console.warn("Start angle cannot be NaN");
    }
    if(isNaN(this.mArcAngle))
    {
        console.warn("Arc angle cannot be NaN");
    }
    if(isNaN(this.mRadius))
    {
        console.warn("Radius cannot be NaN");
    }
    if(this.mCenter == null)
    {
        console.warn("Center cannot be null");
    }
}

MyCurve.prototype.clone = function()
{
    return new MyCurve(this.mCenter.clone(),this.mRadius,this.mStartAngle,this.mArcAngle);
}

MyCurve.prototype.removePointsNotInsideCurve = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = null;
    }
    
    var _loc3_ = null;
    var _loc4_ = param1.length - 1;
    var ret = false;
    while(!ret) {
        ret = true;
        for(var i = 0; i < param1.length; i++) {
            if (!this.isInsideCurveAndNotOnCurve(param1[i],param2)) {
                param1.splice(i, 1);
                ret = false;
                break;
            }
        }
    }
}

MyCurve.prototype.isInsideArcFan = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6;
    }
    
    this.diagnose();
    if(!this.createCircle_canvas().isInsideCircle(param1,param2))
    {
        return false;
    }
    var _loc3_ = param1.clone().sub(this.mCenter).getAngle();
    return this.isBetweenArcAngleRange(_loc3_);
}

MyCurve.prototype.isInsideCurveAndNotOnCurve = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = null;
    }
    
    this.diagnose();

    return this.isInsideArcFan(param1,param2) && !this.isPointOnCurve(param1,param2);
}

MyCurve.prototype.isPointOnCurve = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6;
    }
    
    return this.getSplitPosByRatio(0).isClose(param1,param2) || this.getSplitPosByRatio(1).isClose(param1,param2);
}


MyCurve.prototype.isBetweenArcAngleRange = function(param1)
{
    this.diagnose();
    var _loc2_ = Angle.normalize(param1);
    var _loc3_ = Angle.normalize(this.mStartAngle);
    var _loc4_ = Angle.normalize(this.mStartAngle + this.mArcAngle);
    var _loc5_ = Math.min(_loc3_,_loc4_);
    var _loc6_ = Math.max(_loc3_,_loc4_);
    var _loc7_ = this.mArcAngle > 0;
    var _loc8_ = _loc3_ < _loc4_;
    if(_loc7_ && _loc8_ || !_loc7_ && !_loc8_)
    {
        return _loc2_ >= _loc5_ && _loc2_ <= _loc6_;
    }
    return _loc2_ <= _loc5_ || _loc2_ >= _loc6_;
}

MyCurve.prototype.isClockWise = function()
{
    return this.mArcAngle < 0;
}

MyCurve.prototype.getVectorByRatio = function(param1)
{
    var _loc2_ = this.getSplitPosByRatio(param1).sub(this.mCenter).normalize();
    if(this.isClockWise())
    {
        _loc2_.negtive();
    }
    return _loc2_;
}

MyCurve.prototype.getIntersectionPointByPoint = function(param1)
{
    var _loc3_ = null;
    var _loc4_ = null;
    var _loc5_ = NaN;
    var _loc6_ = NaN;
    this.diagnose();
    var _loc2_ = param1.clone().sub(this.mCenter).getAngle();
    if(!this.isBetweenArcAngleRange(_loc2_))
    {
        _loc3_ = this.getSplitPosByRatio(0);
        _loc4_ = this.getSplitPosByRatio(1);
        _loc5_ = param1.distance(_loc3_);
        _loc6_ = param1.distance(_loc4_);
        if(_loc5_ < _loc6_)
        {
            return _loc3_;
        }
        return _loc4_;
    }
    return this.curvePosByRatio(_loc2_);
}

MyCurve.prototype.decideSide = function(param1)
{
    this.diagnose();
    var _loc2_ = -1;
    var _loc3_ = Vec2.distance(param1,this.mCenter);
    if(MyNumber.isEqual(_loc3_,this.mRadius))
    {
    _loc2_ = 0;
    }
    else if(_loc3_ < this.mRadius)
    {
    _loc2_ = 1;
    }
    _loc2_ = _loc2_ * MyMath.sign(this.mArcAngle);
    if(_loc2_ == 0)
    {
        return ArcCurvePointSide.ON_CURVE;
    }
    if(_loc2_ > 0)
    {
        return ArcCurvePointSide.ON_LEFT;
    }
    return ArcCurvePointSide.ON_RIGHT;
}

MyCurve.prototype.getDistance = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = true;
    }

    //param2 = param2 || true;
    return Math.abs(this.distancePointToCurve(param1,param2));
}

MyCurve.prototype.distancePointToCurve = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = true;
    }
    //param2 = param2 || true;
    var _loc6_ = NaN;
    var _loc7_ = null;
    this.diagnose();
    var _loc3_ = null;
    if(param2)
    {
        _loc3_ = this.getIntersectionPointByPoint(param1);
    }
    else
    {
        _loc6_ = this.getCenterIntersectAngle(param1);
        _loc7_ = this.createCircle_canvas();
        _loc3_ = _loc7_.curvePosByRatio(_loc6_);
    }
    var _loc4_ = param1.distance(_loc3_);
    var _loc5_ = this.decideSide(param1);
    if(_loc5_ == ArcCurvePointSide.ON_LEFT)
    {
        return -_loc4_;
    }
    return _loc4_;
}

MyCurve.prototype.curvePosByRatio = function(param1)
{
    this.diagnose();
    var tmp = new Vec2(this.mRadius * Math.cos(param1),this.mRadius * Math.sin(param1));
    var res = Vec2.add(this.mCenter, tmp);
    return res;
}

MyCurve.prototype.curveAngleByRatio = function(param1)
{
    this.diagnose();
    return this.mStartAngle + param1 * this.mArcAngle;
}

MyCurve.prototype.getSplitPosByRatio = function(param1)
{
    this.diagnose();
    return this.curvePosByRatio(this.curveAngleByRatio(param1));
}

MyCurve.prototype.enlarge_xx = function(param1)
{
    this.diagnose();
    var _loc2_ = Math.abs(this.mArcAngle) * param1;
    return this.mRadius * _loc2_;
}

MyCurve.prototype.getCenterIntersectAngle = function(param1)
{
    this.diagnose();
    var _loc2_ = this.createCircle_canvas().getCenterIntersectAngle(param1);
    var _loc3_ = this.getAngleRatio(_loc2_);
    return this.curveAngleByRatio(_loc3_);
}

MyCurve.prototype.getAngleRatio = function(param1)
{
    var _loc7_;
    this.diagnose();
    var _loc2_ = Angle.normalize(param1);
    var _loc3_ = Angle.normalize(this.mStartAngle);
    var _loc4_ = Angle.normalize(this.mStartAngle + this.mArcAngle);
    var _loc5_ = this.mArcAngle > 0;
    var _loc6_ = _loc3_ > _loc4_;
    if(_loc6_ && _loc5_ || !_loc6_ && !_loc5_)
    {
        _loc7_ = Angle.normalize(_loc2_ - _loc3_);
        if(_loc7_ > Math.abs(this.mArcAngle))
        {
            _loc7_ = Angle.CONST_2_PI - _loc7_;
        }
        return _loc7_ / Math.abs(this.mArcAngle);
    }
    return (_loc2_ - _loc3_) / this.mArcAngle;
}

MyCurve.prototype.tessallation_NotUnderstand = function(param1)
{
    if (param1 == null || param1 == undefined) {
        param1 = 0.3;
    }

    var _loc4_ = null;
    var _loc5_ = NaN;
    var _loc6_ = NaN;
    this.diagnose();
    var _loc2_ = [];//:Vector.<Vec2> = new Vector.<Vec2>();
    var _loc3_ = [];//Array = [new Vec2(0,1)];
    _loc3_.push(new Vec2(0,1));
    while(_loc3_.length != 0)
    {
        _loc4_ = _loc3_.pop();
        _loc5_ = (_loc4_.mX + _loc4_.mY) * 0.5;
        _loc6_ = MyEdge.distancePointToCurve(this.getSplitPosByRatio(_loc4_.mX),this.getSplitPosByRatio(_loc4_.mY),this.getSplitPosByRatio(_loc5_));
        if(Math.abs(_loc6_) < param1)
        {
            _loc2_.push(this.getSplitPosByRatio(_loc4_.mX));
        }
        else
        {
            _loc3_.push(new Vec2(_loc5_,_loc4_.mY),new Vec2(_loc4_.mX,_loc5_));
        }
    }
    _loc2_.push(this.getSplitPosByRatio(1));
    return _loc2_;
}


MyCurve.prototype.tessallation = function(param1) 
{
    this.diagnose();
    if(param1 <= 0)
    {
        console.warn("Increment must be greater than zero: " + param1);
    }
    var _loc2_ = [];//:Vector.<Vec2> = new Vector.<Vec2>();
    var _loc3_ = 0;
    while(_loc3_ <= 1)
    {
        _loc2_.push(this.getSplitPosByRatio(_loc3_));
        _loc3_ = _loc3_ + param1;
    }
    if(!MyNumber.isEqual(_loc3_,1,0.5 * param1))
    {
        _loc2_.push(this.getSplitPosByRatio(1));
    }
    return _loc2_;
}

MyCurve.prototype.get1_4_Of_arc = function()
{
    this.diagnose();
    return Math.tan(this.mArcAngle / 4);
}

MyCurve.prototype.createCircle_canvas = function()
{
    this.diagnose();
    return new MyCircle(this.mCenter,this.mRadius);
}

MyCurve.prototype.getLength = function()
{
    return this.enlarge_xx(1);
}