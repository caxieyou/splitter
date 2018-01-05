
function WallCurveOperation(param1) {
    this.mFloor = param1;
}

WallCurveOperation.prototype.onSplitCurve = function(param1)
{
    var _loc1_ = new MyCorner();
    _loc1_.mPosition = param1.getCenter();
    this.mFloor.addCorner(_loc1_);
    param1.updateInfo(_loc1_);
    var analysis = new Analysis(this.mFloor);
    analysis.execute();
    this.mFloor._updateGeoStructure();
}

WallCurveOperation.prototype.onToLine = function(param1)
{
    
    var _loc6_ = null;
    var _loc7_ = param1.mStart;
    var _loc8_ = param1.mEnd

    _loc6_ = new SegmentController();
    _loc6_.mStart = _loc7_;
    _loc6_.mEnd = _loc8_;
    
    for (var i = 0; i < this.mFloor.mCurves.length; i++) {
        var curve = this.mFloor.mCurves[i];
        if (_loc6_.isIntersectWith(curve)) {
            console.warn("WARNING: INTERSECTED!!!");
            return false;
        }
    }
    
    
    for (var i = 0; i < _loc6_.mStart.mCurves.length; i++) {
        if (_loc6_.mStart.mCurves[i].mId == param1.mId) {
            _loc6_.mStart.mCurves[i] = _loc6_;
        }
    }
    
    for (var i = 0; i < _loc6_.mEnd.mCurves.length; i++) {
        if (_loc6_.mEnd.mCurves[i].mId == param1.mId) {
            _loc6_.mEnd.mCurves[i] = _loc6_;
        }
    }
    
    
    _loc7_.removeSection(param1);
    _loc8_.removeSection(param1);
    
    this.mFloor.addSection(_loc6_);
    this.mFloor.removeSection(param1);
    
    var analysis = new Analysis(this.mFloor);
    analysis.execute();
}

WallCurveOperation.prototype.onToArc = function(param1)
{
    var _loc7_ = new CurveController();
    _loc7_.mStart = param1.mStart;
    _loc7_.mEnd = param1.mEnd;
    
    var _loc4_ = 0.1;
    _loc7_.resetCurve(_loc4_);
    
    for (var i = 0; i < this.mFloor.mCurves.length; i++) {
        var curve = this.mFloor.mCurves[i];
        if (_loc7_.isIntersectWith(curve)) {
            console.warn("WARNING: TOO NARROW!!!");
            return false;
        }
    }
    
    for (var i = 0; i < _loc7_.mStart.mCurves.length; i++) {
        if (_loc7_.mStart.mCurves[i].mId == param1.mId) {
            _loc7_.mStart.mCurves[i] = _loc7_;
        }
    }
    
    for (var i = 0; i < _loc7_.mEnd.mCurves.length; i++) {
        if (_loc7_.mEnd.mCurves[i].mId == param1.mId) {
            _loc7_.mEnd.mCurves[i] = _loc7_;
        }
    }
    
    this.mFloor.addSection(_loc7_);
    this.mFloor.removeSection(param1);
    
    var analysis = new Analysis(this.mFloor);
    analysis.execute();
    return true;
}


WallCurveOperation.prototype.onDelete = function(param1) {
    var adjacentAreas = param1.mAreas;
    
    param1.dispose();
    var _loc0_ = param1.toCorners();
    
    for (var i = 0; i < _loc0_.length; i++) {
        var _loc2_ = null;
        var _loc3_ = null;
        var _loc4_ = null;
        var _loc5_ = null;
        var _loc1_ = _loc0_[i].mCurves;
        if(_loc1_.length == 2)
        {
           _loc2_ = _loc1_[0];
           _loc3_ = _loc1_[1];
           if(_loc2_ instanceof SegmentController && _loc3_ instanceof SegmentController)
           {
              _loc4_ = _loc2_;
              _loc5_ = _loc3_;
              if(_loc4_.isValidAngleDiff(_loc5_))
              {
                 _loc4_.setCornerStartAndEndButHasToBeSame(param1,_loc5_.getStartOrEndOrNull(param1));
                 _loc5_.dispose();
              }
           }
        }
    }
    
    var _loc1_ = null;
    var selectfunc = function (wall) {
        var _loc6_ = null;
        var _loc5_ = wall.mCorners;
        for(var i = 0; i < _loc5_.length; i++)
        {
            _loc6_ = _loc5_[i];
            if(_loc6_.mCurves.length == 1)
            {
               return _loc6_.mCurves[0];
            }
        }
        return null;
    };
    
    while((_loc1_ =  selectfunc(this.mFloor))!= null) {
        _loc1_.dispose();
    }
    
    var analysis = new Analysis(this.mFloor);
    analysis.execute();
        
}
