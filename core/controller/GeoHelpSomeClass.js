function SideEnum() {

}

SideEnum.RIGHT = true;
SideEnum.LEFT  = false;


function GeoHelpSomeClass() {
    
}

GeoHelpSomeClass.getPolygonFromAreaPath = function(param1)
{
    var _loc8_ = null;
    var _loc9_ = null;

    var _loc2_ = new Polygon();
    var _loc3_ = param1.mPath;
    var _loc4_ = _loc3_.mCurves;
    var _loc5_ = _loc3_.mCorners;
    var _loc6_ = _loc4_.length;
    var _loc7_ = 0;
    while(_loc7_ < _loc6_)
    {
        _loc9_ = _loc4_[_loc7_];
        _loc10_ = !!_loc9_.isStart(_loc5_[_loc7_]) ? SideEnum.RIGHT:SideEnum.LEFT;
        
        _loc2_.addVertices(_loc9_.switchOrder(_loc9_.isEnd(_loc5_[_loc7_])));
        
        _loc7_++;
    }
    _loc2_.polygonRemoveSame();
    return _loc2_;
}

