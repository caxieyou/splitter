function AuxiliaryCurve() {
    
}

AuxiliaryCurve.getIntersectionCircleEdge = function(param1, param2)
{
    var _loc7_ = NaN;
    var _loc8_ = null;
    var _loc9_ = NaN;
    var _loc3_ = [];
    if(MyNumber.isZero(param2.length))
    {
        return _loc3_;
    }
    var _loc4_ = param1.mCenter;
    var _loc5_ = param1.mRadius;
    var _loc6_ = param2.getDistance(_loc4_,false);
    if(_loc6_ > _loc5_)
    {
        return _loc3_;
    }
    if(_loc6_ == _loc5_)
    {
        _loc3_.push(param2.project(_loc4_));
    }
    else
    {
        _loc7_ = param2.getAngle();
        _loc8_ = param2.project(_loc4_,false);
        _loc9_ = Math.sqrt(_loc5_ * _loc5_ - _loc6_ * _loc6_);

        if (_loc8_ == null) {
            return _loc3_;
        }
        _loc3_.push(_loc8_.addBySplitAngle(_loc9_,_loc7_));

        _loc3_.push(_loc8_.addBySplitAngle(-_loc9_,_loc7_));
    }
    return _loc3_;
}

AuxiliaryCurve.getIntersectionCurveCurve = function(param1, param2)
{
    var _loc10_ = null;
    var _loc11_ = NaN;
    var _loc12_ = NaN;
    var _loc13_ = null;
    var _loc14_ = NaN;
    var _loc3_ = [];
    var _loc4_ = param1.mCenter;
    var _loc5_ = param2.mCenter;
    var _loc6_ = param1.mRadius;
    var _loc7_ = param2.mRadius;
    var _loc8_ = _loc4_.distance(_loc5_);
    var _loc9_ = new Edge(_loc4_,_loc5_);
    if(_loc8_ > _loc6_ + _loc7_)
    {
        return _loc3_;
    }
    if(_loc8_ == _loc6_ + _loc7_)
    {
        _loc3_.push(_loc9_.getCenter());
    }
    else
    {
        _loc10_ = new Edge(_loc4_,_loc5_).getCenter();
        _loc11_ = _loc8_ / 2 + (_loc6_ * _loc6_ - _loc7_ * _loc7_) / (2 * _loc8_);
        _loc12_ = Math.sqrt(_loc6_ * _loc6_ - _loc11_ * _loc11_);
        _loc13_ = _loc9_.getPointByDistanceOnEdge(_loc11_);
        _loc14_ = _loc9_.getAngle() + Angle.HALF_PI;
        _loc3_.push(_loc13_.addBySplitAngle(_loc12_,_loc14_));
        _loc3_.push(_loc13_.addBySplitAngle(-_loc12_,_loc14_));
    }
    return _loc3_;
}

AuxiliaryCurve.getIntersectionCurveEdge = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 1.0E-6;
    }
    var _loc4_ = AuxiliaryCurve.getIntersectionCircleEdge(param1,param2);
    var _loc5_ = _loc4_.length - 1;
    while(_loc5_ >= 0)
    {
        if(!param2.distanceSmallThan(_loc4_[_loc5_],param3))
        {
            MyArray.removeItemAt(_loc4_,_loc5_);
        }
        _loc5_--;
    }
    return _loc4_;
}