function MyPath() {
    this.mStart;
    this.mCurves;
    this.mPolygon;
    this.mArea;
    this.mCorners;
    this.initialize();
}

MyPath.getArea_Not_0_Paths = function(param1)
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

MyPath.getClockWisePaths = function(param1)
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

MyPath.getCountClockWisePath = function(param1)
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

MyPath.getArea_0_Paths = function(param1)
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

MyPath.prototype.initialize = function()
{
    this.mPolygon = new MyPolygon();
    this.mCurves = [];
    this.mCorners = [];
}

MyPath.prototype.buildCurveAndCorner = function()
{
    this.buildCorners();
    this.buildPolygon();
}

MyPath.prototype.buildCorners = function()
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

MyPath.prototype.buildPolygon = function()
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

MyPath.prototype.addSection = function(param1)
{
    this.mCurves.push(param1);
}

MyPath.prototype.isClockWise = function()
{
    return this.mArea > 0;
}

MyPath.prototype.isCountClockWise = function()
{
    return this.mArea < 0;
}

MyPath.prototype.isIsolated = function()
{
    return MyNumber.isEqual(this.mArea,0);
}

MyPath.prototype.isCurveInPath_not_sure = function(param1)
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

MyPath.prototype.getCurveByIndex = function(param1)
{
    return this.mCurves[param1];
}

MyPath.prototype.getCornerByIndex = function(param1)
{
    return this.mCorners[param1];
}

MyPath.prototype.getSize = function()
{
    return this.mCurves.length;
}

MyPath.prototype.getPolygon = function() {
    return this.mPolygon;
}

MyPath.prototype.getArea = function()
{
    return this.mArea;
}