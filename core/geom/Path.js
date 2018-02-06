function path() {
    this.mStart;
    this.mCurves;
    this.mPolygon;
    this.mArea;
    this.mCorners;
    this.initialize();
}

path.getArea_Not_0_Paths = function(param1)
{
    var _loc2_ = [];
    for(var i = 0; i < param1.length; i++)
    {
        if(param1[i].getSize() > 1 && !param1[i].isIsolated())
        {
            _loc2_.push(param1[i]);
        }
    }
    return _loc2_;
}

path.getClockWisePaths = function(param1)
{
    var _loc2_ = [];
    for(var i = 0; i < param1.length; i++)
    {
        if(param1[i].getSize() > 1 && param1[i].isClockWise() && !param1[i].isIsolated())
        {
            _loc2_.push(param1[i]);
        }
    }
    return _loc2_;
}

path.getCountClockWisePath = function(param1)
{
    var _loc3_ = null;
    var _loc2_ = [];
    for(var i = 0; i < param1.length; i++)
    {
        if(param1[i].getSize() > 1 && param1[i].isCountClockWise() && !param1[i].isIsolated())
        {
            _loc2_.push(param1[i]);
        }
    }
    return _loc2_;
}

path.getArea_0_Paths = function(param1)
{
    var _loc2_ = [];
    for(var i = 0; i < param1.length; i++)
    {
        if(param1[i].getSize() > 1 && param1[i].isIsolated())
        {
            _loc2_.push(param1[i]);
        }
    }
    return _loc2_;
}

path.prototype.initialize = function()
{
    this.mPolygon = new Polygon();
    this.mCurves = [];
    this.mCorners = [];
}

path.prototype.buildCurveAndCorner = function()
{
    this.buildCorners();
    this.buildPolygon();
}

path.prototype.buildCorners = function()
{
    var _loc1_ = this.getSize();
    var _loc2_ = this.mStart;
    this.mCorners.push(_loc2_);
    var _loc3_ = 0;
    while(_loc3_ < _loc1_)
    {
        _loc2_ = this.mCurves[_loc3_].getStartOrEndOrNull(_loc2_);
        this.mCorners.push(_loc2_);
        _loc3_++;
    }
}

path.prototype.buildPolygon = function()
{
    var _loc4_ = null;
    var _loc5_ = NaN;
    var _loc6_ = false;
    var _loc1_ = this.getSize();
    var _loc2_ = null;
    var _loc3_ = 0;
    while(_loc3_ < _loc1_)
    {
        _loc4_ = this.mCurves[_loc3_];
        _loc5_ = this.mCorners.indexOf(_loc4_.mStart,_loc3_);
        _loc6_ = _loc5_ != _loc3_;
        _loc2_ = _loc4_.switchOrder(_loc6_);
        this.mPolygon.addVertices(_loc2_);
        _loc3_++;
    }
    this.mPolygon.polygonRemoveSame();
    this.mArea = this.mPolygon.getSignedArea();
}

path.prototype.addSection = function(param1)
{
    this.mCurves.push(param1);
}

path.prototype.isClockWise = function()
{
    return this.mArea > 0;
}

path.prototype.isCountClockWise = function()
{
    return this.mArea < 0;
}

path.prototype.isIsolated = function()
{
    return MyNumber.isEqual(this.mArea,0);
}

path.prototype.isCurveInPath_not_sure = function(param1)
{
    var _loc2_ = this.mCurves.indexOf(param1);
    var _loc3_ = this.mCurves.lastIndexOf(param1);
    if(_loc2_ != _loc3_)
    {
        return false;
    }
    var _loc4_ = this.mCorners.indexOf(param1.mStart);
    return _loc4_ == _loc2_;
}

path.prototype.getCurveByIndex = function(param1)
{
    return this.mCurves[param1];
}

path.prototype.getCornerByIndex = function(param1)
{
    return this.mCorners[param1];
}

path.prototype.getSize = function()
{
    return this.mCurves.length;
}

path.prototype.getPolygon = function() {
    return this.mPolygon;
}

path.prototype.getArea = function()
{
    return this.mArea;
}