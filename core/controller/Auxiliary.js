function Auxiliary() {

}

Auxiliary.getClosestCurve = function(param1, param2, param3, param4, param5)
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

Auxiliary._isHole = function(param1)
{
    var _loc2_ = null;
    var _loc3_ = null;
    var _loc4_ = null;
    if(param1.mFloor.mHoles != null)
    {
        _loc3_ = param1.generateElementDiscribeUnit().getValidGravityCenter();
        for (var i = 0; i < param1.mFloor.mHoles.length; i++)
        {
            if(param1.mFloor.mHoles[i].mPolygon.contains(_loc3_))
            {
                return true;
            }
        }
        return false;
    }

    for (var i = 0; i < param1.mElements.length; i++)
    {
        if(param1.mElements[i].type == WallCurveType.DEFAULT_LINE)
        {
            return false;
        }
    }
    return true;
}

Auxiliary.getHoleParts = function(param1) 
{
    var _loc3_ = null;
    var _loc2_ = [];
    if(param1.length >= 2)
    {
        for (var i = 0; i < param1.length; i++)
        {
            if(Auxiliary._isHole(param1[i]))
            {
                _loc2_.push(param1[i]);
            }
        }
    }
    return _loc2_;
}

Auxiliary.RIGHT = true;
Auxiliary.LEFT  = false;

Auxiliary.getPolygonFromAreaPath = function(param1)
{
    var _loc8_ = null;
    var _loc9_ = null;

    var _loc2_ = new Polygon();
    var _loc3_ = param1.mPath;
    var _loc4_ = _loc3_.mElements;
    var _loc5_ = _loc3_.mCorners;
    var _loc6_ = _loc4_.length;
    var _loc7_ = 0;
    while(_loc7_ < _loc6_)
    {
        _loc9_ = _loc4_[_loc7_];
        _loc10_ = !!_loc9_.isStart(_loc5_[_loc7_]) ? Auxiliary.RIGHT:Auxiliary.LEFT;
        
        _loc2_.addVertices(_loc9_.switchOrder(_loc9_.isEnd(_loc5_[_loc7_])));
        
        _loc7_++;
    }
    _loc2_.polygonRemoveSame();
    return _loc2_;
}

Auxiliary.getSameCorner = function(param1, param2, param3)
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

Auxiliary.getCloestPoint = function(param1, param2, param3)
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

Auxiliary.getSameCorner = function(param1, param2, param3)
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

Auxiliary.getCloestPoint = function(param1, param2, param3)
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