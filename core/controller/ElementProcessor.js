
function ElementProcessor(param1) {
    this.mFloor = param1;
}

ElementProcessor.prototype.onSplitCurve = function(param1)
{
    var _loc1_ = new Corner();
    _loc1_.mPosition = param1.getCenter();
    this.mFloor.addCorner(_loc1_);
    param1.updateInfo(_loc1_);
    this.mFloor.Analysis();
    this.mFloor.clearPickedArea();
}

ElementProcessor.prototype.onToLine = function(param1)
{
    
    var _loc6_ = null;
    var _loc7_ = param1.mStart;
    var _loc8_ = param1.mEnd

    _loc6_ = new Segment();
    _loc6_.mStart = _loc7_;
    _loc6_.mEnd = _loc8_;
    
    for (var i = 0; i < this.mFloor.mElements.length; i++) {
        var curve = this.mFloor.mElements[i];
        if (_loc6_.isIntersectWith(curve)) {
            console.warn("WARNING: INTERSECTED!!!");
            return false;
        }
    }
    
    
    for (var i = 0; i < _loc6_.mStart.mElements.length; i++) {
        if (_loc6_.mStart.mElements[i].mId == param1.mId) {
            _loc6_.mStart.mElements[i] = _loc6_;
        }
    }
    
    for (var i = 0; i < _loc6_.mEnd.mElements.length; i++) {
        if (_loc6_.mEnd.mElements[i].mId == param1.mId) {
            _loc6_.mEnd.mElements[i] = _loc6_;
        }
    }
    
    
    _loc7_.removeElement(param1);
    _loc8_.removeElement(param1);
    
    this.mFloor.addElement(_loc6_);
    this.mFloor.removeElement(param1);
    this.mFloor.Analysis();
    this.mFloor.clearPickedArea();
}

ElementProcessor.prototype.onToArc = function(param1)
{
    var _loc7_ = new Arc();
    _loc7_.mStart = param1.mStart;
    _loc7_.mEnd = param1.mEnd;
    
    var _loc4_ = 0.1;
    _loc7_.resetCurve(_loc4_);
    var valid = true;
    for (var i = 0; i < this.mFloor.mElements.length; i++) {
        var curve = this.mFloor.mElements[i];
        if (_loc7_.isIntersectWith(curve)) {
            console.warn("WARNING: TOO NARROW!!!");
            valid = false;
            break;
        }
    }
    
    if (!valid) {
        _loc4_ = -0.1;
        _loc7_.resetCurve(_loc4_);
        for (var i = 0; i < this.mFloor.mElements.length; i++) {
            var curve = this.mFloor.mElements[i];
            if (_loc7_.isIntersectWith(curve)) {
                console.warn("WARNING: TOO NARROW!!!");
                return false;
            }
        }
    }
    
    for (var i = 0; i < _loc7_.mStart.mElements.length; i++) {
        if (_loc7_.mStart.mElements[i].mId == param1.mId) {
            _loc7_.mStart.mElements[i] = _loc7_;
        }
    }
    
    for (var i = 0; i < _loc7_.mEnd.mElements.length; i++) {
        if (_loc7_.mEnd.mElements[i].mId == param1.mId) {
            _loc7_.mEnd.mElements[i] = _loc7_;
        }
    }
    
    this.mFloor.addElement(_loc7_);
    this.mFloor.removeElement(param1);
    
    this.mFloor.Analysis();
    this.mFloor.clearPickedArea();
    return true;
}


ElementProcessor.prototype.onDelete = function(param1) {
    var adjacentAreas = param1.mAreas;
    
    param1.dispose();
    var _loc0_ = param1.toCorners();
    
    for (var i = 0; i < _loc0_.length; i++) {
        
        var top = _loc0_[i];
        
        var _loc2_ = null;
        var _loc3_ = null;
        var _loc4_ = null;
        var _loc5_ = null;
        var _loc1_ = _loc0_[i].mElements;
        
        for (var j = 0; j < _loc1_.length; j++) {
            if(_loc1_.length == 2)
            {
               _loc2_ = _loc1_[0];
               _loc3_ = _loc1_[1];
               if(_loc2_ instanceof Segment && _loc3_ instanceof Segment)
               {
                  _loc4_ = _loc2_;
                  _loc5_ = _loc3_;
                  if(_loc4_.isValidAngleDiff(_loc5_))
                  {
                     _loc4_.setCornerStartAndEndButHasToBeSame(top,_loc5_.getStartOrEndOrNull(top));
                     _loc5_.dispose();
                  }
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
            if(_loc6_.mElements.length == 1)
            {
               return _loc6_.mElements[0];
            }
        }
        return null;
    };
    
    while((_loc1_ =  selectfunc(this.mFloor))!= null) {
        _loc1_.dispose();
    }
    this.mFloor.Analysis();
    this.mFloor.clearPickedArea();
}
