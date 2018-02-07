function Analysis(param1) {
    this.mAreas;
    this.mElements;
    this.mAreasPick;
    this.mCurveCornerHelper;
    this.mFloor = param1;
}


Analysis.prototype.calculateAreaAndCurves = function()
{
    this.mAreas = this.mFloor.mAreas;
    this.mElements = this.mFloor.mElements;
}

Analysis.prototype.clearAreas = function()
{
    this.mAreas = [];
}

Analysis.prototype.prepare = function()
{
    var _loc1_ = null;
    this.mCurveCornerHelper = new curveCornerHelperClass(this.mElements);
    this.mAreaPick = this.mAreas.concat();
    
    for (var i = 0; i < this.mElements.length; i++) {
        this.mElements[i].mAreas = [];
    }
    
}

Analysis.prototype.generateWallAreasByWall = function()
{
    return new Area(this.mFloor);
}

Analysis.prototype.addNotHoleParts = function(param1, param2)
{
    var _loc3_ = null;
    for (var i = 0; i < param2.length; i++)
    {
        _loc3_ = param2[i];
        if(_loc3_.mAreas.length < 2)
        {
            _loc3_.isHasAndSaveOnCurve(param1);
            param1.addElement(_loc3_);
        }
    }
}

Analysis.prototype.seperateAreasInClip = function()
{
    var area = null;
    var item = null;
    var curves = null;
    var path = null;
    var i = 0;
    var tmpCurve = null;
    var j = 0;
    var tmpArea = null;
    var polygonWithHole = null;

    var paths = this.mCurveCornerHelper.getPaths_eh();
    var clockwisePaths = Path.getClockWisePaths(paths);
    var areas = this.mAreas;
    
    for (var j = 0; j < clockwisePaths.length; j++)
    {
        curves = clockwisePaths[j].mElements;
        area = this.generateWallAreasByWall();
        area.mPath = clockwisePaths[j];
        this.addNotHoleParts(area,curves);
        areas.push(area);
    }
    
    areas.sort(function(param1, param2)
    {
        return MyMath.sign(param1.getAbsArea() - param2.getAbsArea());
    });
    
    i = 0;
    while(i < areas.length - 1)
    {
        area = areas[i];
        j = i + 1;
        while(j < areas.length)
        {
            item = areas[j];
            j++;
        }
        i++;
    }
    
    for (var j = 0; j < this.mElements.length; j++)
    {
        if(this.mElements[j].mAreas.length == 0)
        {
            for (var k = 0; k < areas.length; k++)
            {
                polygonWithHole = areas[k].generatePolyTree();
                if(polygonWithHole.contains(this.mElements[j].getCenter()))
                {
                    this.mElements[j].isHasAndSaveOnCurve(areas[k]);
                    areas[k].addElement(this.mElements[j]);
                }
            }
        }
    }
    
}


Analysis.prototype.setBackAreaAndCurvesToWall = function()
{
    this.mFloor.mAreas = this.mAreas;
    this.mFloor.mElements = this.mElements;
}

Analysis.prototype.correctAreas = function()
{
    //this.mFloor.correctAreas();
}

Analysis.isSameCurveInClipFather = function(param1, param2)
{
    var _loc4_ = null;
    var _loc3_ = param1.mElements;
    for (var i = 0; i < _loc3_.length; i++)
    {
        _loc4_ = _loc3_[i];
        if(_loc4_.mStart.equals(param2.start) && _loc4_.mEnd.equals(param2.mEnd) || _loc4_.mStart.equals(param2.mEnd) && _loc4_.mEnd.equals(param2.mStart))
        {
            return true;
        }
    }
    return false;
}

Analysis.prototype.isSamePolygonInClipFather = function(param1, param2)
{
    if(param2.getPolygon())
    {
        if(param1.getPolygon().copySimplyPolygon().equals(param2.getPolygon().copySimplyPolygon()))
        {
            return true;
        }
    }
    return false;
}

Analysis.prototype.getSameCurveNumber = function(param1, param2)
{
    var _loc5_ = null;
    var _loc3_ = 0;
    var _loc4_ = param1.mElements;
    
    for (var i = 0; i < _loc4_.length; i++)
    {
        if(Analysis.isSameCurveInClipFather(param2,_loc4_[i]))
        {
            _loc3_++;
        }
    }
    return _loc3_;
}
      
      
Analysis.prototype.copyProperties = function()
{
    var _loc2_ = null;
    var _loc3_ = null;
    var _loc4_ = 0;
    var _loc5_ = 0;
    var _loc1_ = this.mAreas.concat();
    _loc4_ = _loc1_.length - 1;
    while(_loc4_ >= 0)
    {
        _loc5_ = this.mAreaPick.length - 1;
        while(_loc5_ >= 0)
        {
            _loc2_ = _loc1_[_loc4_];
            _loc3_ = this.mAreaPick[_loc5_];
            if(this.isSamePolygonInClipFather(_loc2_,_loc3_))
            {
                _loc2_.id = _loc3_.id;
                MyArray.removeItem(_loc1_,_loc2_);
                MyArray.removeItem(this.mAreaPick,_loc3_);
                break;
            }
            _loc5_--;
        }
        _loc4_--;
    }
    var _loc6_ = 0;
    var _loc7_ = 0;
    var _loc8_ = null;
    _loc4_ = _loc1_.length - 1;

    while(_loc4_ >= 0)
    {
    _loc6_ = 0;
        _loc8_ = null;
        _loc2_ = _loc1_[_loc4_];
        _loc5_ = this.mAreaPick.length - 1;
        while(_loc5_ >= 0)
        {
            _loc3_ = this.mAreaPick[_loc5_];
            _loc7_ = this.getSameCurveNumber(_loc2_,_loc3_);
            if(_loc7_ > _loc6_)
            {
                _loc6_ = _loc7_;
                _loc8_ = _loc3_;
            }
            _loc5_--;
        }
        if(_loc8_ != null)
        {
            _loc2_.id = _loc8_.id;
            MyArray.removeItem(_loc1_,_loc2_);
            MyArray.removeItem(this.mAreaPick,_loc8_);
        }
        _loc4_--;
    }
}


Analysis.prototype.execute = function() {
    this.calculateAreaAndCurves();
    this.prepare();
    this.clearAreas();
    this.seperateAreasInClip();
    this.setBackAreaAndCurvesToWall();
    this.correctAreas();
    this.calculateAreaAndCurves();
    this.setBackAreaAndCurvesToWall();
    
}