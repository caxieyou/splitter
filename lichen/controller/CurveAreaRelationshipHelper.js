function CurveAreaRelationshipHelper() {
    
}

CurveAreaRelationshipHelper.isHole = function(param1)
{
    var _loc2_ = null;
    var _loc3_ = null;
    var _loc4_ = null;
    if(param1.mWall.mHoles != null)
    {
        _loc3_ = param1.generateElementDiscribeUnit().getValidGravityCenter();
        for (var i = 0; i < param1.mWall.mHoles.length; i++)
        {
            if(param1.mWall.mHoles[i].mPolygon.contains(_loc3_))
            {
                return true;
            }
        }
        return false;
    }

    for (var i = 0; i < param1.mCurves.length; i++)
    {
        if(param1.mCurves[i].type == WallCurveType.DEFAULT_LINE)
        {
            return false;
        }
    }
    return true;
}

CurveAreaRelationshipHelper.getHoleParts = function(param1) 
{
    var _loc3_ = null;
    var _loc2_ = [];
    if(param1.length >= 2)
    {
        for (var i = 0; i < param1.length; i++)
        {
            if(CurveAreaRelationshipHelper.isHole(param1[i]))
            {
                _loc2_.push(param1[i]);
            }
        }
    }
    return _loc2_;
}
