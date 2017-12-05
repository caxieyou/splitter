function wallCurveCornerHelper() {

}

wallCurveCornerHelper.getSamePositionButNotSamePointerCorner = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 0.001
    }
    
    var _loc5_ = NaN;
    for (var i = 0; i < param2.length; i++)
    {
        if(param2[i] != param1)
        {
            _loc5_ = Vec2.distance(param1.mPosition,param2[i].mPosition);
            if(_loc5_ < param3)
            {
                return param2[i];
            }
        }
    }
    return null;
}

wallCurveCornerHelper.getCornerByPos_XX = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 0.001;
    }
    var _loc4_ = null;
    var _loc5_ = NaN;
    for (var i = 0; i < param2.length; i++)
    {
        _loc5_ = Vec2.distance(param1,param2[i].mPosition);
        if(_loc5_ < param3)
        {
            return param2[i];
        }
    }
    return null;
}

