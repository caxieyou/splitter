function SegmentController(param1, param2) {
    if (param1 == null || param1 == undefined) {
        param1 = null;
    }
    if (param2 == null || param2 == undefined) {
        param2 = false;
    }
    
    this.mStart = new MyCorner(param1);
    this.mEnd = new MyCorner(param1);
    this.mAreas = [];
    this.mWall = param1;
    this.mId = ID.assignUniqueId();
    this.isBoundry = param2;
}

SegmentController.prototype.wallDleleteSame = function(param1)
{
    return ArrayHelperClass.removeItem(this.mAreas,param1);
}
SegmentController.isWithinSameArea = function (param1, param2) {
    //var res = false;
    
    for (var i = 0; i < param1.mAreas.length; i++) {
        for (var j = 0; j < param2.mAreas.length; j++) {
            if (param1.mAreas[i].mId == param2.mAreas[j].mId) {
                return true;
            }
        }
    }
    
    return false;
    
}
SegmentController.createSegmentByMyEdge = function(param1)
{
    var _loc2_ = null;
    var _loc3_ = new SegmentController();
    _loc2_ = new MyCorner();
    _loc2_.mPosition = param1.mStart;
    _loc3_.updateStartCorner(_loc2_);
    _loc2_ = new MyCorner();
    _loc2_.mPosition = param1.mEnd;
    _loc3_.updateEndCorner(_loc2_);
    return _loc3_;
}

SegmentController.intersectSub = function(param1, param2, param3, param4, param5)
{
    if (param3 == null || param3 == undefined) {
        param3 = null;
    }
    if (param4 == null || param4 == undefined) {
        param4 = false;
    }
    if (param5 == null || param5 == undefined) {
        param5 = 1.0E-6;
    }
    var _loc5_ = param2;
    var _loc6_ = null;
    if(LineRelationHelper.isInterSect(_loc5_,param1,param4,param5))
    {
        if(param3 != null)
        {
            _loc6_ = LineRelationHelper.isInterSectAndGetPoint(_loc5_, param1);
            if(_loc6_ != null)
            {
                param3.push(_loc6_);
            }
        }
        return true;
    }
    return false;
}

SegmentController.prototype.isStart = function(param1)
{
    return this.mStart == param1;
}

SegmentController.prototype.isEnd = function(param1)
{
    return this.mEnd == param1;
}


SegmentController.prototype.getStartOrEndOrNull = function(param1)
{
    if(param1 == this.mStart)
    {
        return this.mEnd;
    }
    if(param1 == this.mEnd)
    {
        return this.mStart;
    }
    return null;
}

SegmentController.prototype.updateInfo = function(param1)
{
    var _loc2_ = new SegmentController();

    _loc2_.updateStartCorner(param1);
    _loc2_.updateEndCorner(this.mEnd);
    this.updateEndCorner(param1);

    this.mWall.addSection(_loc2_);
    return _loc2_;
}
      
SegmentController.prototype.getTheStartEndEdge = function()
{
    return new MyEdge(this.mStart.mPosition,this.mEnd.mPosition);
}

SegmentController.prototype.isStartOrEnd = function(param1)
{
    return param1 == this.mStart || param1 == this.mEnd;
}

SegmentController.prototype.toCorners = function(param1)
{
    return [this.mStart, this.mEnd];
}
      
SegmentController.prototype.setCornerStartAndEndButHasToBeSame = function(param1, param2)
{
    if(param1 == this.mStart)
    {
        this.updateStartCorner(param2);
    }
    if(param1 == this.mEnd)
    {
        this.updateEndCorner(param2);
    }
}
      
SegmentController.prototype.containsPoint = function(param1)
{
    return this.getTheStartEndEdge().pointInEdge(param1);
}

SegmentController.prototype.isValidAngleDiff = function(param1)
{
    return MyEdge.isValidAngleDiff(param1.getTheStartEndEdge(),this.getTheStartEndEdge());
}

SegmentController.prototype.isInsideMyArea = function(param1, param2, param3)
{
    if (param2 == null || param2 == undefined) {
        param2 = false;
    }

    if (param3 == null || param3 == undefined) {
        param3 = 1.0E-6;
    }

    if(param2)
    {
        return this.getTheStartEndEdge().distanceSmallThan(param1,param3);
    }
    return this.getTheStartEndEdge().pointInEdgeOrOnEdge(param1,param3);
}

SegmentController.prototype.getTheCurveStartEndEdgeToPointDistance = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = true;
    }
    return this.getTheStartEndEdge().getDistance(param1,param2);
}


SegmentController.prototype.updateStartCorner = function(param1) {
    if(this.mStart != null)
    {
        this.mStart.removeSection(this);
    }
    this.mStart = param1;
    if(this.mStart != null)
    {
        this.mStart.addSection(this);
    }
};

SegmentController.prototype.updateEndCorner = function(param1) {
    if(this.mEnd != null)
    {
        this.mEnd.removeSection(this);
    }
    this.mEnd = param1;
    if(this.mEnd != null)
    {
        this.mEnd.addSection(this);
    }
};

SegmentController.prototype.isIntersectWith = function(param1, param2, param3, param4)
{
    if (param2 == null || param2 == undefined) {
        param2 = null;
    }
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }
    var _loc6_ = null;
    var _loc7_ = null;
    var _loc8_ = null;
    var _loc5_ = null;
    if(param1 instanceof SegmentController)
    {
        _loc6_ = param1;
        _loc5_ = _loc6_.getTheStartEndEdge();
        return this.intersectSub(_loc5_,param2,param3,param4);
    }
    if(param1 instanceof CurveController)
    {
        _loc7_ = param1;
        _loc8_ = _loc7_.getCurveFromController();
        return this.isCurveIntersectByAreaAndGetIntersectPoint(_loc8_,param2,param3,param4);
    }
    return false;
}

SegmentController.isIntersectWith = function(param1, param2, param3, param4, param5)
{
    if (param3 == null || param3 == undefined) {
        param3 = null;
    }
    if (param4 == null || param4 == undefined) {
        param4 = false;
    }
    if (param5 == null || param5 == undefined) {
        param5 = 1.0E-6;
    }
    var _loc6_ = null;
    var _loc7_ = null;
    var _loc8_ = null;
    var _loc5_ = null;
    if(param2 instanceof SegmentController)
    {
        _loc6_ = param2;
        _loc5_ = _loc6_.getTheStartEndEdge();
        return SegmentController.intersectSub(param1, _loc5_, param3, param4, param5);
    }
    if(param2 instanceof CurveController)
    {
        _loc7_ = param2;
        _loc8_ = _loc7_.getCurveFromController();
        return SegmentController.isCurveIntersectByAreaAndGetIntersectPoint(param1, _loc8_,param3,param4,param5);
    }
    return false;
}


SegmentController.prototype.isIntersectWithGeometry = function(param1, param2, param3, param4)
{
    if (param2 == null || param2 == undefined) {
        param2 = null;
    }
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }
    var _loc6_ = null;
    var _loc7_ = null;
    var _loc8_ = null;
    var _loc5_ = null;
    if(param1 instanceof MyEdge)
    {
        _loc5_ = param1
        return this.intersectSub(_loc5_,param2,param3,param4);
    }
    if(param1 instanceof MyCurve)
    {
        _loc8_ = _loc7_;
        return this.isCurveIntersectByAreaAndGetIntersectPoint(_loc8_,param2,param3,param4);
    }
    return false;
}

SegmentController.prototype.intersectSub = function(param1, param2, param3, param4)
{
    if (param2 == null || param2 == undefined) {
        param2 = null;
    }
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }
    var _loc5_ = this.getTheStartEndEdge();
    var _loc6_ = null;
    if(LineRelationHelper.isInterSect(_loc5_,param1,param3,param4))
    {
        if(param2 != null)
        {
            _loc6_ = LineRelationHelper.isInterSectAndGetPoint(_loc5_,param1);
            if(_loc6_ != null)
            {
                param2.push(_loc6_);
            }
        }
        return true;
    }
    return false;
}

SegmentController.prototype.dispose = function()
{
    var _loc2_ = null;
    var _loc3_ = null;
    //super.dispose();
    var _loc1_ = this.toCorners();
    for (var i = 0; i < _loc1_.length; i++) {
        _loc2_ = _loc1_[i];
        if (_loc2_) {
            _loc2_.removeSection(this);
            if(_loc2_.mCurves.length == 0)
            {
                _loc2_.dispose();
            }
        }
    }
    
    for (var i = 0; i < this.mAreas.length; i++) {
        _loc3_ = this.mAreas[i];
        _loc3_.removeSection(this);
    }
         
    if(this.mWall != null)
    {
        this.mWall.removeSection(this);
    }
}

SegmentController.prototype.isCurveIntersectByEdgeAndGetIntersectPoint = function(param1, param2, param3, param4)
{
    if (param2 == null || param2 == undefined) {
        param2 = null;
    }
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }
    var _loc5_ = this.getTheStartEndEdge();
    var _loc6_ = null;
    if(LineRelationHelper.isInterSectHarsh(_loc5_,param1,param3,param4))
    {
        if(param2 != null)
        {
            _loc6_ = LineRelationHelper.isInterSectAndGetPoint(_loc5_,param1);
            if(_loc6_ != null)
            {
                param2.push(_loc6_);
            }
        }
        return true;
    }
    return false;
}

SegmentController.prototype.isCurveIntersectByAreaAndGetIntersectPoint = function(param1, param2, param3, param4)
{
    if (param2 == null || param2 == undefined) {
        param2 = null;
    }
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }
    
    var _loc5_ = ArcEdgeHelper.getValidIntersectionPointBetweenArcAndEdge(param1, this.getTheStartEndEdge());
    if(!param3)
    {
        param1.removePointsNotInsideCurve(_loc5_);
    }
    if(_loc5_.length == 0)
    {
        return false;
    }
    if(param2 != null)
    {
        ArrayHelperClass.addItems(param2,_loc5_);
    }
    return true;
}

SegmentController.isCurveIntersectByAreaAndGetIntersectPoint = function(param1, param2, param3, param4, param5)
{
    if (param3 == null || param3 == undefined) {
        param3 = null;
    }
    if (param4 == null || param3 == undefined) {
        param4 = false;
    }
    if (param5 == null || param5 == undefined) {
        param5 = 1.0E-6;
    }
    
    var _loc5_ = ArcEdgeHelper.getValidIntersectionPointBetweenArcAndEdge(param2, param1);
    if(!param4)
    {
        param2.removePointsNotInsideCurve(_loc5_);
    }
    if(_loc5_.length == 0)
    {
        return false;
    }
    if(param3 != null)
    {
        ArrayHelperClass.addItems(param3,_loc5_);
    }
    return true;
}


SegmentController.prototype.isHasAndSaveOnCurve = function(param1)
{
    var _loc2_ = ArrayHelperClass.ifHasAndSave(this.mAreas, param1);
    return _loc2_;
}

SegmentController.prototype.getClosestPoint = function(param1)
{
    if(MyNumber.isZeroOrOrigin(this.length))
    {
        return mStart.position.clone();
    }
    return this.getTheStartEndEdge().getClosestPoint(param1,true);
}

SegmentController.prototype.switchOrder = function(param1)
{
    if (param1 == null || param1 == undefined) {
        param1 = false;
    }

    //param1 = param1 || false;
    if(!param1)
    {
        return [this.mStart.mPosition.clone(),this.mEnd.mPosition.clone()];
    }
    return [this.mEnd.mPosition.clone(),this.mStart.mPosition.clone()];
}

SegmentController.prototype.decideSide = function(param1)
{
    var _loc2_ = getTheStartEndEdge().decideSide(param1);
    if(_loc2_ == Line2DPointSide.ON_RIGHT)
    {
        return DecoCurvePointSide.ON_LEFT;
    }
    if(_loc2_ == Line2DPointSide.ON_LINE)
    {
        return DecoCurvePointSide.ON_CURVE;
    }
    return DecoCurvePointSide.ON_RIGHT;
}

SegmentController.prototype.getCenter = function()
{
    return this.getTheStartEndEdge().getCenter();
}

SegmentController.prototype.getLength = function()
{
    return this.getTheStartEndEdge().getLength();
}

SegmentController.prototype.getAngle = function()
{
    return this.getTheStartEndEdge().getAngle();
}

SegmentController.prototype.updatePosition = function(x, y) {
    //1 找到2个corner
    var coners = this.toCorners();
    var angle = this.getAngle();
    /*
    //2 找到所有线段
    var startCurves;
    var endCurves;
    var angle = this.getAngle();
    
    // 得到差别最大的两个线段
    var minS = 0;
    var minE = 0;
    for (var i = 0; i < coners[0].mCurves.length; i++) {
        if (coners[0].mCurves[i].mId !== this.mId) {
            coners[0].mCurves[i].getAngle();
            var diff = Math.abs(angle - coners[0].mCurves[i].getAngle());
            while(diff >= Math.PI) {
                diff = diff - Math.PI;
            }
            if (diff > Math.PI / 2) {
                diff = Math.PI - diff;
            }
            if (diff >= minS) {
                minS = diff;
                startCurves = coners[0].mCurves[i];
            }
        }
    }
    for (var i = 0; i < coners[1].mCurves.length; i++) {
        if (coners[1].mCurves[i].mId !== this.mId) {
            coners[1].mCurves[i].getAngle();
            var diff = Math.abs(angle - coners[1].mCurves[i].getAngle());
            while(diff >= Math.PI) {
                diff = diff - Math.PI;
            }
            if (diff > Math.PI / 2) {
                diff = Math.PI - diff;
            }
            if (diff >= minE) {
                minE = diff;
                endCurves = coners[1].mCurves[i];
            }
        }
    }
    
    
    var newEdge;
    if (MyNumber.isEqual(angle, Math.PI / 2)) {
        newEdge = new MyEdge(new Vec2(x, y), new Vec2(x, y + 1));
    } else {
        newEdge = new MyEdge(new Vec2(x, y), new Vec2(x + 1, y + Math.tan(angle)));
    }
    
    var s = MyEdge.getIntersection(newEdge, startCurves.getTheStartEndEdge());
    var e = MyEdge.getIntersection(newEdge, endCurves.getTheStartEndEdge());
    */
    //if (!s || !e) {
    var dis = this.getTheStartEndEdge().getDistance(new Vec2(x, y));
    
    var pos0 = coners[0].mPosition.clone();
    var pos1 = coners[1].mPosition.clone();
    
    var s = new Vec2(pos0.mX + dis * Math.cos(angle + Math.PI / 2), pos0.mY + dis * Math.sin(angle + Math.PI / 2));
    var e = new Vec2(pos1.mX + dis * Math.cos(angle + Math.PI / 2), pos1.mY + dis * Math.sin(angle + Math.PI / 2));
    
    
    var tmp = new MyEdge(s, e);
    
    if (tmp.getDistance(new Vec2(x, y)) > 1.0E-6) {
        s = new Vec2(pos0.mX - dis * Math.cos(angle + Math.PI / 2), pos0.mY - dis * Math.sin(angle + Math.PI / 2));
        e = new Vec2(pos1.mX - dis * Math.cos(angle + Math.PI / 2), pos1.mY - dis * Math.sin(angle + Math.PI / 2));
    }
    
    
    
    var c = [];
    for (var i = 0; i < coners[0].mCurves.length; i++) {
        c = c.concat(coners[0].mCurves[i].toCorners());
    }
    
    for (var i = 0; i < coners[1].mCurves.length; i++) {
        c = c.concat(coners[1].mCurves[i].toCorners());
    }
    var illegal = false;
    for (var i = 0; i < c.length; i++) {
        if (c[i].mId == coners[0].mId || c[i].mId == coners[1].mId) {
            continue;
        }
        if (c[i].mPosition.equals(s) || c[i].mPosition.equals(e)) {
            illegal = true;
            break;
        }
    }
    if (illegal) {
        return true;
    }
    MyCorner.updatePosition(coners[0], s.mX, s.mY);
    MyCorner.updatePosition(coners[1], e.mX, e.mY);
    
}
