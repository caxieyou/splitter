function ArcEdgeHelper() {

}
ArcEdgeHelper.getCurveIntersectionPoints = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 1.0E-6;
    }
    var _loc6_ = null;
    var _loc4_ = circleEdgeHelper.getCircleIntersectionPoints(param1.createCircle_canvas(),param2.createCircle_canvas());
    var _loc5_ = _loc4_.length - 1;
    while(_loc5_ >= 0)
    {
        _loc6_ = _loc4_[_loc5_];
        if(!param1.isInsideArcFan(_loc6_,param3) || !param2.isInsideArcFan(_loc6_,param3))
        {
            ArrayHelperClass.removeItemAt(_loc4_,_loc5_);
        }
        _loc5_--;
    }
    return _loc4_;
}

ArcEdgeHelper.getValidIntersectionPointBetweenArcAndEdge = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 1.0E-6;
    }
    var _loc4_ = circleEdgeHelper.getLiteIntersetionPoints(param1.createCircle_canvas(),param2,param3);
    var _loc5_ = _loc4_.length - 1;
    while(_loc5_ >= 0)
    {
        if(!param1.isInsideArcFan(_loc4_[_loc5_]))
        {
            ArrayHelperClass.removeItemAt(_loc4_,_loc5_);
        }
        _loc5_--;
    }
    return _loc4_;
}
