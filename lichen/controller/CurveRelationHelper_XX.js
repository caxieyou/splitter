function CurveRelationHelper_XX() {

}

CurveRelationHelper_XX.getTheClosestCurve_ax = function(param1, param2, param3, param4, param5)
{
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }
    if (param4 == null || param4 == undefined) {
        param4 = 0.001;
    }
    if (param5 == null || param5 == undefined) {
        param5 = 6;
    }
    var _loc8_ = null;
    var _loc9_ = NaN;
    var _loc6_ = null;
    var _loc7_ = Number.MAX_VALUE;
    for (var i = 0; i < param2.length; i++)
    {
        _loc9_ = param2[i].getTheCurveStartEndEdgeToPointDistance(param1,true);
        _loc9_ = Math.abs(_loc9_);
        if(_loc9_ < _loc7_ && _loc9_ < 0.0001)
        {
            _loc7_ = _loc9_;
            _loc6_ = param2[i];
        }
    }
    if(!param3 && _loc6_ != null && (Vec2.isEqual(param1,_loc6_.mStart.mPosition,param4) || Vec2.isEqual(param1,_loc6_.mEnd.mPosition,param4)))
    {
        return null;
    }
    return _loc6_;
}