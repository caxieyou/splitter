function Path() {
    this.mStart;
    this.mElements;
    this.mPolygon;
    this.mArea;
    this.mCorners;
    this.initialize();
}

Path.getArea_Not_0_Paths = function(param1)
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

Path.getClockWisePaths = function(param1)
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

Path.getCountClockWisePath = function(param1)
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

Path.getArea_0_Paths = function(param1)
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

Path.prototype.initialize = function()
{
    this.mPolygon = new Polygon();
    this.mElements = [];
    this.mCorners = [];
}

Path.prototype.buildCurveAndCorner = function()
{
    this.buildCorners();
    this.buildPolygon();
}

Path.prototype.buildCorners = function()
{
    var _loc1_ = this.getSize();
    var _loc2_ = this.mStart;
    this.mCorners.push(_loc2_);
    var _loc3_ = 0;
    while(_loc3_ < _loc1_)
    {
        _loc2_ = this.mElements[_loc3_].getStartOrEndOrNull(_loc2_);
        this.mCorners.push(_loc2_);
        _loc3_++;
    }
}

Path.prototype.buildPolygon = function()
{
    var _loc4_ = null;
    var _loc5_ = NaN;
    var _loc6_ = false;
    var _loc1_ = this.getSize();
    var _loc2_ = null;
    var _loc3_ = 0;
    while(_loc3_ < _loc1_)
    {
        _loc4_ = this.mElements[_loc3_];
        _loc5_ = this.mCorners.indexOf(_loc4_.mStart,_loc3_);
        _loc6_ = _loc5_ != _loc3_;
        _loc2_ = _loc4_.switchOrder(_loc6_);
        this.mPolygon.addVertices(_loc2_);
        _loc3_++;
    }
    this.mPolygon.polygonRemoveSame();
    this.mArea = this.mPolygon.getSignedArea();
}

Path.prototype.addElement = function(param1)
{
    this.mElements.push(param1);
}

Path.prototype.isClockWise = function()
{
    return this.mArea > 0;
}

Path.prototype.isCountClockWise = function()
{
    return this.mArea < 0;
}

Path.prototype.isIsolated = function()
{
    return MyNumber.isEqual(this.mArea,0);
}

Path.prototype.isCurveInPath_not_sure = function(param1)
{
    var _loc2_ = this.mElements.indexOf(param1);
    var _loc3_ = this.mElements.lastIndexOf(param1);
    if(_loc2_ != _loc3_)
    {
        return false;
    }
    var _loc4_ = this.mCorners.indexOf(param1.mStart);
    return _loc4_ == _loc2_;
}

Path.prototype.getCurveByIndex = function(param1)
{
    return this.mElements[param1];
}

Path.prototype.getCornerByIndex = function(param1)
{
    return this.mCorners[param1];
}

Path.prototype.getSize = function()
{
    return this.mElements.length;
}

Path.prototype.getPolygon = function() {
    return this.mPolygon;
}

Path.prototype.getArea = function()
{
    return this.mArea;
}