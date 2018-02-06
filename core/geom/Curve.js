
var ArcCurvePointSide = {
    ON_CURVE : 0,
    ON_LEFT : 1,
    ON_RIGHT: 2
    
};


function Curve(center, radius, startAngle, arcAngle) {
    this.mCenter = center;
    this.mRadius = radius;
    this.mStartAngle = startAngle;
    this.mArcAngle = arcAngle;
    
};

Curve.TOLERANCE = 1.0E-6;

Curve.createCurveByEdgeNumber = function(param1, param2)
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
    return new Curve(_loc12_,_loc13_,_loc14_,_loc15_);
}

Curve.isSameCurve = function (curve0, curve1) {
    if (MyNumber.isEqual(curve0.mRadius, curve1.mRadius)         &&
        MyNumber.isEqual(curve0.mStartAngle, curve1.mStartAngle) &&
        MyNumber.isEqual(curve0.mArcAngle, curve1.mArcAngle) &&
        Vec2.isEqual(curve0.mCenter, curve1.mCenter)
    ) {
        return true;
    } else {
        return false;
    }
}

Curve.createCurveByEdgeNumber2 = function(param1, param2)
{
    var _loc3_ = param1.mStart.clone();
    var _loc4_ = param1.mEnd.clone();
    var _loc5_ = param1.getLength();
    
    var _loc6_ = MyMath.sign(param2);
    var _loc7_ = Math.abs(param2);
    var _loc8_ = param1.getCenter();
    //var _loc9_ = Math.atan(_loc7_) * 4;
    var _loc10_ = _loc5_ / 2 / Math.tan(_loc7_ / 2);
    var _loc11_ = param1.getVecEndMinusStart().rotate(_loc6_ * Angle.HALF_PI).normalize();
    var _loc12_ = _loc8_.add(_loc11_.mul(_loc10_));
    var _loc13_ = _loc12_.distance(_loc3_);
    var _loc14_ = _loc3_.sub(_loc12_).getAngle();
    var _loc15_ = param2;
    return new Curve(_loc12_,_loc13_,_loc14_,_loc15_);
}

Curve.prototype.diagnose = function()
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

Curve.prototype.clone = function()
{
    return new Curve(this.mCenter.clone(),this.mRadius,this.mStartAngle,this.mArcAngle);
}

Curve.prototype.scale = function(s, oX, oY)
{
    var ret = this.clone();
    ret.mCenter = ret.mCenter.mul(s).add(new Vec2(oX, oY));
    ret.mRadius = ret.mRadius * s;
    
    return ret;
}


Curve.prototype.removePointsNotInsideCurve = function(param1, param2)
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

Curve.prototype.isInsideArcFan = function(param1, param2)
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

Curve.prototype.isInsideCurveAndNotOnCurve = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = null;
    }
    
    this.diagnose();

    return this.isInsideArcFan(param1,param2) && !this.isPointOnCurve(param1,param2);
}

Curve.prototype.isInsideCurveAndOnCurve = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = null;
    }
    
    this.diagnose();

    return this.isInsideArcFan(param1,param2);
}

Curve.prototype.isPointOnCurve = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6;
    }
    
    return this.getPointByRatio(0).isClose(param1,param2) || this.getPointByRatio(1).isClose(param1,param2);
}


Curve.prototype.isBetweenArcAngleRange = function(param1)
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

Curve.prototype.isClockWise = function()
{
    return this.mArcAngle < 0;
}

Curve.prototype.getVectorByRatio = function(param1)
{
    var _loc2_ = this.getPointByRatio(param1).sub(this.mCenter).normalize();
    if(this.isClockWise())
    {
        _loc2_.negtive();
    }
    return _loc2_;
}

Curve.prototype.getIntersectionPointByPoint = function(param1)
{
    var _loc3_ = null;
    var _loc4_ = null;
    var _loc5_ = NaN;
    var _loc6_ = NaN;
    this.diagnose();
    var _loc2_ = param1.clone().sub(this.mCenter).getAngle();
    if(!this.isBetweenArcAngleRange(_loc2_))
    {
        _loc3_ = this.getPointByRatio(0);
        _loc4_ = this.getPointByRatio(1);
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

Curve.prototype.decideSide = function(param1)
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

Curve.prototype.getDistance = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = true;
    }

    //param2 = param2 || true;
    return Math.abs(this.distancePointToCurve(param1,param2));
}

Curve.prototype.distancePointToCurve = function(param1, param2)
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

Curve.prototype.curvePosByRatio = function(param1)
{
    this.diagnose();
    var tmp = new Vec2(this.mRadius * Math.cos(param1),this.mRadius * Math.sin(param1));
    var res = Vec2.add(this.mCenter, tmp);
    return res;
}

Curve.prototype.curveAngleByRatio = function(param1)
{
    this.diagnose();
    return this.mStartAngle + param1 * this.mArcAngle;
}

Curve.prototype.getPointByRatio = function(param1)
{
    this.diagnose();
    return this.curvePosByRatio(this.curveAngleByRatio(param1));
}

Curve.prototype.enlarge_xx = function(param1)
{
    this.diagnose();
    var _loc2_ = Math.abs(this.mArcAngle) * param1;
    return this.mRadius * _loc2_;
}

Curve.prototype.getCenterIntersectAngle = function(param1)
{
    this.diagnose();
    var _loc2_ = this.createCircle_canvas().getCenterIntersectAngle(param1);
    var _loc3_ = this.getAngleRatio(_loc2_);
    return this.curveAngleByRatio(_loc3_);
}

Curve.prototype.getAngleRatio = function(param1)
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

Curve.prototype.tessallation_NotUnderstand = function(param1)
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
        _loc6_ = Edge.distancePointToCurve(this.getPointByRatio(_loc4_.mX),this.getPointByRatio(_loc4_.mY),this.getPointByRatio(_loc5_));
        if(Math.abs(_loc6_) < param1)
        {
            _loc2_.push(this.getPointByRatio(_loc4_.mX));
        }
        else
        {
            _loc3_.push(new Vec2(_loc5_,_loc4_.mY),new Vec2(_loc4_.mX,_loc5_));
        }
    }
    _loc2_.push(this.getPointByRatio(1));
    return _loc2_;
}


Curve.prototype.tessallation = function(param1) 
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
        _loc2_.push(this.getPointByRatio(_loc3_));
        _loc3_ = _loc3_ + param1;
    }
    if(!MyNumber.isEqual(_loc3_,1,0.5 * param1))
    {
        _loc2_.push(this.getPointByRatio(1));
    }
    return _loc2_;
}

Curve.prototype.get1_4_Of_arc = function()
{
    this.diagnose();
    return Math.tan(this.mArcAngle / 4);
}

Curve.prototype.createCircle_canvas = function()
{
    this.diagnose();
    return new Circle(this.mCenter,this.mRadius);
}

Curve.prototype.getLength = function()
{
    return this.enlarge_xx(1);
}

Curve.prototype.getValidPart = function(curve)
{
    if (!MyNumber.isEqual(this.mRadius, curve.mRadius) || !Vec2.isEqual(this.mCenter, curve.mCenter)) {
        return this;
    }
    
    var s0 = this.getPointByRatio(0);
    var e0 = this.getPointByRatio(1);
    
    var r0 = curve.isInsideArcFan(s0);
    var r1 = curve.isInsideArcFan(e0);
    
    if (r0 && r1) {
        return null;
    }
    
    var s1 = curve.getPointByRatio(0);
    var e1 = curve.getPointByRatio(1);
    
    var r2 = this.isInsideArcFan(s1);
    var r3 = this.isInsideArcFan(e1);
    
    if (!r0 && !r1 && !r2 && !r3) {
        return this;
    }
    
    
    if (r2 && r3) {
        var a1 = this.createCircle_canvas().getCenterIntersectAngle(s1);
        var ratio1 = this.getAngleRatio(a1);
        var a2 = this.createCircle_canvas().getCenterIntersectAngle(e1);
        var ratio2 = this.getAngleRatio(a2);
        
        var max = Math.max(ratio1, ratio2);
        var min = Math.min(ratio1, ratio2);
        
        if (MyNumber.isEqual(min, 0)) {
            var startAngle = this.getCenterIntersectAngle(curve.getPointByRatio(1));
            var deltaAngle = Angle.normalize(this.getCenterIntersectAngle(this.getPointByRatio(1)) - startAngle);
            return new Curve(this.mCenter.clone(), this.mRadius, startAngle, deltaAngle);
        }
        
        if (MyNumber.isEqual(max, 1)) {
            var startAngle = this.getCenterIntersectAngle(this.getPointByRatio(0));
            var deltaAngle = Angle.normalize(this.getCenterIntersectAngle(curve.getPointByRatio(0)) - startAngle);
            return new Curve(this.mCenter.clone(), this.mRadius, startAngle, deltaAngle);
        }
        
        
        var startAngle = this.getCenterIntersectAngle(this.getPointByRatio(0));
        var deltaAngle = Angle.normalize(this.getCenterIntersectAngle(curve.getPointByRatio(0)) - startAngle);
        var newCurve0 = new Curve(this.mCenter.clone(), this.mRadius, startAngle, deltaAngle);
        
        var startAngle = this.getCenterIntersectAngle(curve.getPointByRatio(1));
        var deltaAngle = Angle.normalize(this.getCenterIntersectAngle(this.getPointByRatio(1)) - startAngle);
        var newCurve1 = new Curve(this.mCenter.clone(), this.mRadius, startAngle, deltaAngle);
        
        return [newCurve0, newCurve1];
    }
    
    var start, end;
    if (r1 && r2) {
        start = s0;
        end = s1;
    }
    
    if (r1 && r3) {
        start = s0;
        end = e1;
    }
    
    if (r0 && r2) {
        start = e0;
        end = s1;
    }
    
    if (r0 && r3) {
        start = e0;
        end = e1;
    }
    var startAngle = this.getCenterIntersectAngle(start);
    var deltaAngle = Angle.normalize(this.getCenterIntersectAngle(end) - startAngle);
    return new Curve(this.mCenter.clone(), this.mRadius, startAngle, deltaAngle);
}


