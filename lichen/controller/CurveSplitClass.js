function CurveSplitClass(param1, floor) {
    this.mCurveArray = param1;
    this.mFloor = floor;
    this.mValid;
    this.mCornerArray;
    this.initialize();
}

CurveSplitClass.prototype.initialize = function()
{
    var _loc1_ = null;
    var _loc2_ = null;
    this.mValid = true;
    this.mCornerArray = [];
    for (var i = 0; i < this.mCurveArray.length; i++) {
        ArrayHelperClass.ifHaveSameTheLaterOne(this.mCornerArray,this.mCurveArray[i].toCorners());
    }
    
    this.mCurveArray = [];
    
    for (var i = 0; i < this.mCornerArray.length; i++) {
        ArrayHelperClass.ifHaveSameTheLaterOne(this.mCurveArray,this.mCornerArray[i].mCurves);
    }
}

CurveSplitClass.prototype.invalidate = function()
{
    this.mValid = false;
}
      
CurveSplitClass.prototype.execute = function()
{
    var _loc1_ = null;
    var _loc4_ = null;
    var _loc5_ = null;
    var _loc6_ = null;
    var _loc7_ = null;
    var _loc8_ = null;
    var _loc9_ = NaN;
    var _loc10_ = null;
    this.mValid = true;
    var _loc2_ = this.mFloor.mCurves;
    var _loc3_ = this.mFloor.mCorners;
    var DISTANCE_TOLERANCE = 1.01376;
    
    for (var i = 0; i < this.mCurveArray.length; i++) {
        _loc1_ = this.mCurveArray[i];
        if (_loc1_.getLength() < 1.01376) {
            this.invalidate();
            return;
        }
    }
    
    for (var i = 0; i < this.mCurveArray.length; i++) {
        _loc4_ = this.mCurveArray[i];
        for (var j = 0; j < _loc2_.length; j++) {
            _loc1_ = _loc2_[j];
            
            if(_loc1_.isIntersectWith(_loc4_))
            {
                this.invalidate();
                return;
            }
            if(_loc4_ instanceof SegmentController && _loc1_ instanceof SegmentController)
             {
                _loc6_ = _loc4_.getTheStartEndEdge();
                _loc7_ = _loc1_.getTheStartEndEdge();
                _loc8_ = new MyEdge(_loc6_.project(_loc7_.mStart),_loc6_.project(_loc7_.mEnd));
                
                if(LineRelationHelper.isOverLapping(_loc6_,_loc8_) && MyEdge.isValidAngleDiff(_loc6_,_loc7_))
                {
                   _loc9_ = _loc6_.getDistance(_loc7_.mStart);
                   if(_loc9_ < DISTANCE_TOLERANCE)
                   {
                      this.invalidate();
                      return;
                   }
                }
             }
        }
    }
    
    for (var i = 0; i < this.mCornerArray.length; i++) {
        var _loc5_ = this.mCornerArray[i];
        for (var j = 0; j < _loc2_.length; j++) {
            _loc1_ = _loc2_[j];
            if(!_loc1_.isStartOrEnd(_loc5_))
            {
                if(_loc1_.isInsideMyArea(_loc5_.mPosition,true))
                {
                    this.invalidate();
                    return;
                }
            }
        }
        
        for (var j = 0; j < _loc3_.length; j++) {
            _loc10_ = _loc3_[j];
            if(_loc10_ != _loc5_)
            {
                if(_loc10_.mPosition.equals(_loc5_.mPosition))
                {
                    this.invalidate();
                    return;
                }
            }
        }
    }
}

