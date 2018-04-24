function Segment(param1, param2) {
    if (param1 == null || param1 == undefined) {
        param1 = null;
    }
    if (param2 == null || param2 == undefined) {
        param2 = false;
    }
    
    this.mStart = new Corner(param1);
    this.mEnd = new Corner(param1);
    this.mAreas = [];
    this.mFloor = param1;
    this.mId = ID.assignUniqueId();
    this.isBoundry = param2;
}

Segment.prototype.wallDleleteSame = function(param1)
{
    return MyArray.removeItem(this.mAreas,param1);
}

Segment.createSegmentByMyEdge = function(param1)
{
    var _loc2_ = null;
    var _loc3_ = new Segment();
    _loc2_ = new Corner();
    _loc2_.mPosition = param1.mStart;
    _loc3_.updateStartCorner(_loc2_);
    _loc2_ = new Corner();
    _loc2_.mPosition = param1.mEnd;
    _loc3_.updateEndCorner(_loc2_);
    return _loc3_;
}

Segment.intersectSub = function(param1, param2, param3, param4, param5)
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
    if(EdgeCollision.isInterSect(_loc5_,param1,param4,param5))
    {
        if(param3 != null)
        {
            _loc6_ = EdgeCollision.isInterSectAndGetPoint(_loc5_, param1);
            if(_loc6_ != null)
            {
                param3.push(_loc6_);
            }
        }
        return true;
    }
    return false;
}

Segment.prototype.isStart = function(param1)
{
    return this.mStart == param1;
}

Segment.prototype.isEnd = function(param1)
{
    return this.mEnd == param1;
}


Segment.prototype.getStartOrEndOrNull = function(param1)
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

Segment.prototype.updateInfo = function(param1)
{
    var _loc2_ = new Segment();

    _loc2_.updateStartCorner(param1);
    _loc2_.updateEndCorner(this.mEnd);
    this.updateEndCorner(param1);

    this.mFloor.addElement(_loc2_);
    return _loc2_;
}
      
Segment.prototype.getTheStartEndEdge = function()
{
    return new Edge(this.mStart.mPosition,this.mEnd.mPosition);
}

Segment.prototype.getGeom = function()
{
    return new Edge(this.mStart.mPosition.clone(),this.mEnd.mPosition.clone());
}

Segment.prototype.isStartOrEnd = function(param1)
{
    return param1 == this.mStart || param1 == this.mEnd;
}

Segment.prototype.toCorners = function(param1)
{
    return [this.mStart, this.mEnd];
}
      
Segment.prototype.setCornerStartAndEndButHasToBeSame = function(param1, param2)
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
      
Segment.prototype.containsPoint = function(param1)
{
    return this.getTheStartEndEdge().pointInEdge(param1);
}

Segment.prototype.isValidAngleDiff = function(param1)
{
    return Edge.isValidAngleDiff(param1.getTheStartEndEdge(),this.getTheStartEndEdge());
}

Segment.prototype.isInsideMyArea = function(param1, param2, param3)
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

Segment.prototype.getTheCurveStartEndEdgeToPointDistance = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = true;
    }
    return this.getTheStartEndEdge().getDistance(param1,param2);
}


Segment.prototype.updateStartCorner = function(param1) {
    if(this.mStart != null)
    {
        this.mStart.removeElement(this);
    }
    this.mStart = param1;
    if(this.mStart != null)
    {
        this.mStart.addElement(this);
    }
};

Segment.prototype.updateEndCorner = function(param1) {
    if(this.mEnd != null)
    {
        this.mEnd.removeElement(this);
    }
    this.mEnd = param1;
    if(this.mEnd != null)
    {
        this.mEnd.addElement(this);
    }
};

Segment.prototype.isIntersectWith = function(param1, param2, param3, param4)
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
    if(param1 instanceof Segment)
    {
        _loc6_ = param1;
        _loc5_ = _loc6_.getTheStartEndEdge();
        return this.intersectSub(_loc5_,param2,param3,param4);
    }
    if(param1 instanceof Arc)
    {
        _loc7_ = param1;
        _loc8_ = _loc7_.getCurve();
        return this.isCurveIntersectByAreaAndGetIntersectPoint(_loc8_,param2,param3,param4);
    }
    return false;
}

Segment.isIntersectWith = function(param1, param2, param3, param4, param5)
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
    if(param2 instanceof Segment)
    {
        _loc6_ = param2;
        _loc5_ = _loc6_.getTheStartEndEdge();
        return Segment.intersectSub(param1, _loc5_, param3, param4, param5);
    }
    if(param2 instanceof Arc)
    {
        _loc7_ = param2;
        _loc8_ = _loc7_.getCurve();
        return Segment.isCurveIntersectByAreaAndGetIntersectPoint(param1, _loc8_,param3,param4,param5);
    }
    return false;
}


Segment.prototype.isIntersectWithGeometry = function(param1, param2, param3, param4)
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
    if(param1 instanceof Edge)
    {
        _loc5_ = param1
        return this.intersectSub(_loc5_,param2,param3,param4);
    }
    if(param1 instanceof Curve)
    {
        _loc8_ = _loc7_;
        return this.isCurveIntersectByAreaAndGetIntersectPoint(_loc8_,param2,param3,param4);
    }
    return false;
}

Segment.prototype.intersectSub = function(param1, param2, param3, param4)
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
    if(EdgeCollision.isInterSect(_loc5_,param1,param3,param4))
    {
        if(param2 != null)
        {
            _loc6_ = EdgeCollision.isInterSectAndGetPoint(_loc5_,param1);
            if(_loc6_ != null)
            {
                param2.push(_loc6_);
            }
        }
        return true;
    }
    return false;
}

Segment.prototype.dispose = function()
{
    var _loc2_ = null;
    var _loc3_ = null;
    //super.dispose();
    var _loc1_ = this.toCorners();
    for (var i = 0; i < _loc1_.length; i++) {
        _loc2_ = _loc1_[i];
        if (_loc2_) {
            _loc2_.removeElement(this);
            if(_loc2_.mElements.length == 0)
            {
                _loc2_.dispose();
            }
        }
    }
    
    for (var i = 0; i < this.mAreas.length; i++) {
        _loc3_ = this.mAreas[i];
        _loc3_.removeElement(this);
    }
         
    if(this.mFloor != null)
    {
        this.mFloor.removeElement(this);
    }
}

Segment.prototype.isCurveIntersectByEdgeAndGetIntersectPoint = function(param1, param2, param3, param4)
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
    if(EdgeCollision.isInterSectHarsh(_loc5_,param1,param3,param4))
    {
        if(param2 != null)
        {
            _loc6_ = EdgeCollision.isInterSectAndGetPoint(_loc5_,param1);
            if(_loc6_ != null)
            {
                param2.push(_loc6_);
            }
        }
        return true;
    }
    return false;
}

Segment.prototype.isCurveIntersectByAreaAndGetIntersectPoint = function(param1, param2, param3, param4)
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
    
    var _loc5_ = Auxiliary.getIntersectionForCurveAndEdge(param1, this.getTheStartEndEdge());
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
        MyArray.addItems(param2,_loc5_);
    }
    return true;
}

Segment.isCurveIntersectByAreaAndGetIntersectPoint = function(param1, param2, param3, param4, param5)
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
    
    var _loc5_ = Auxiliary.getIntersectionForCurveAndEdge(param2, param1);
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
        MyArray.addItems(param3,_loc5_);
    }
    return true;
}


Segment.prototype.isHasAndSaveOnCurve = function(param1)
{
    var _loc2_ = MyArray.ifHasAndSave(this.mAreas, param1);
    return _loc2_;
}

Segment.prototype.getClosestPoint = function(param1)
{
    if(MyNumber.isZero(this.length))
    {
        return mStart.position.clone();
    }
    return this.getTheStartEndEdge().getClosestPoint(param1,true);
}

Segment.prototype.switchOrder = function(param1)
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

Segment.prototype.decideSide = function(param1)
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

Segment.prototype.getCenter = function()
{
    return this.getTheStartEndEdge().getCenter();
}

Segment.prototype.getLength = function()
{
    return this.getTheStartEndEdge().getLength();
}

Segment.prototype.getAngle = function()
{
    return this.getTheStartEndEdge().getAngle();
}

Segment.prototype.updatePosition = function(x, y) {
    
    var angle = this.getAngle();

    //水平或者竖直的吸附
    for (var i = 0; i < this.mFloor.mElements.length; i++) {
        var seg = this.mFloor.mElements[i];
        if (seg instanceof Segment && this.mId != seg.mId) {
            if (MyNumber.isEqual(seg.mStart.mPosition.mX, seg.mEnd.mPosition.mX)          &&
                MyNumber.isEqual(this.mStart.mPosition.mX, this.mEnd.mPosition.mX)        &&
                MyNumber.isEqual(x, seg.mStart.mPosition.mX, Globals.SNAPPING_THRESHOLD)  &&
                MyNumber.isEqual(x, seg.mEnd.mPosition.mX, Globals.SNAPPING_THRESHOLD) ) {
                    x = seg.mStart.mPosition.mX;
                    break;
            }
            if (MyNumber.isEqual(seg.mStart.mPosition.mY, seg.mEnd.mPosition.mY)          &&
                MyNumber.isEqual(this.mStart.mPosition.mY, this.mEnd.mPosition.mY)        &&
                MyNumber.isEqual(y, seg.mStart.mPosition.mY, Globals.SNAPPING_THRESHOLD)  &&
                MyNumber.isEqual(y, seg.mEnd.mPosition.mY, Globals.SNAPPING_THRESHOLD) ) {
                    y = seg.mStart.mPosition.mY;
                    break;
            }
        }
    }
    
////////////////////////////////////////////////////////////////////////////////////////////////////

    var verticalTrend = false;//边本身更倾向于垂直还是水平
    if (Math.abs(angle) > Math.PI / 4  && Math.abs(angle) < Math.PI * 3 / 4) {
        verticalTrend = true;
    }

    var s = null, e = null; //start Edge, end Edge
    
    //求出start点对应的目标边
    for (var i = 0; i < this.mStart.mElements.length; i++) {
        if (this.mId != this.mStart.mElements[i].mId) {
            if (verticalTrend) {
                if (MyNumber.isEqual(this.mStart.mElements[i].mStart.mPosition.mY, this.mStart.mElements[i].mEnd.mPosition.mY)) {
                    s = this.mStart.mElements[i];
                    break;
                }
            } else {
                if (MyNumber.isEqual(this.mStart.mElements[i].mStart.mPosition.mX, this.mStart.mElements[i].mEnd.mPosition.mX)) {
                    s = this.mStart.mElements[i];
                    break;
                }
            }
        }
    }
    
    //求出end点对应的目标边
    for (var i = 0; i < this.mEnd.mElements.length; i++) {
        if (this.mId != this.mEnd.mElements[i].mId) {
            if (verticalTrend) {
                if (MyNumber.isEqual(this.mEnd.mElements[i].mStart.mPosition.mY, this.mEnd.mElements[i].mEnd.mPosition.mY)) {
                    e = this.mEnd.mElements[i];
                    break;
                }
            } else {
                if (MyNumber.isEqual(this.mEnd.mElements[i].mStart.mPosition.mX, this.mEnd.mElements[i].mEnd.mPosition.mX)) {
                    e = this.mEnd.mElements[i];
                    break;
                }
            }
        }
    }
    
    //求出夹角最小的边
    if (s == null) {
        var _min = 2 * Math.PI;
        var tSIndex = 0; //taget Start Index
        for (var i = 0; i < this.mStart.mElements.length; i++) {
            if (this.mId != this.mStart.mElements[i].mId) {
                var corners = this.mStart.mElements[i].toCorners();
                
                var index = corners[0].mId == this.mStart.mId ? 1: 0;
                
                
                var diffAngle = Vec2.IncludedAngleValue(Vec2.sub(this.mStart.mPosition, corners[index].mPosition), Vec2.sub(this.mStart.mPosition, this.mEnd.mPosition));
                if(_min > diffAngle) {
                    _min = diffAngle;
                    tSIndex = i;
                }
            }
        }
        
        s = this.mStart.mElements[tSIndex];
    }

    if (e == null) {
        var _min = 2 * Math.PI;
        var tEIndex = 0; //taget End Index
        for (var i = 0; i < this.mEnd.mElements.length; i++) {
            if (this.mId != this.mEnd.mElements[i].mId) {
                var corners = this.mEnd.mElements[i].toCorners();
                
                var index = corners[0].mId == this.mEnd.mId ? 1: 0;
                
                var diffAngle = Vec2.IncludedAngleValue(Vec2.sub(this.mEnd.mPosition, corners[index].mPosition), Vec2.sub(this.mStart.mPosition, this.mEnd.mPosition));
                if(_min > diffAngle) {
                    _min = diffAngle;
                    tEIndex = i;
                }
            }
        }
        
        e = this.mEnd.mElements[tEIndex];
    }
    
    var dis = this.getTheStartEndEdge().getDistance(new Vec2(x, y));

    var coners = this.toCorners();
    
    var pos0 = coners[0].mPosition.clone();
    var pos1 = coners[1].mPosition.clone();
    
    var ptS, ptE;
    ptS = new Vec2(pos0.mX - dis * Math.cos(angle + Math.PI / 2), pos0.mY - dis * Math.sin(angle + Math.PI / 2));
    ptE = new Vec2(pos1.mX - dis * Math.cos(angle + Math.PI / 2), pos1.mY - dis * Math.sin(angle + Math.PI / 2));
    
    var tmp = new Edge(ptS, ptE);
    
    if (tmp.getDistance(new Vec2(x, y)) > 1.0E-6) {
        ptS = new Vec2(pos0.mX + dis * Math.cos(angle + Math.PI / 2), pos0.mY + dis * Math.sin(angle + Math.PI / 2));
        ptE = new Vec2(pos1.mX + dis * Math.cos(angle + Math.PI / 2), pos1.mY + dis * Math.sin(angle + Math.PI / 2));
    
    }
    var ptS2 = Edge.getIntersection(s.getTheStartEndEdge(),  new Edge(ptS.clone(), ptE.clone()));
    var ptE2 = Edge.getIntersection(e.getTheStartEndEdge(),  new Edge(ptS.clone(), ptE.clone()));
    
    
/////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    
    if (Vec2.distance(ptS, ptE) < 5) {
        return true;
    }
    
    var c = [];
    for (var i = 0; i < coners[0].mElements.length; i++) {
        c = c.concat(coners[0].mElements[i].toCorners());
    }
    
    for (var i = 0; i < coners[1].mElements.length; i++) {
        c = c.concat(coners[1].mElements[i].toCorners());
    }
    var illegal = false;
    for (var i = 0; i < c.length; i++) {
        if (c[i].mId == coners[0].mId || c[i].mId == coners[1].mId) {
            continue;
        }
        if (c[i].mPosition.equals(ptS) || c[i].mPosition.equals(ptE)) {
            illegal = true;
            break;
        }
    }
    if (illegal) {
        return true;
    } else {
        coners[0].updatePosition(ptS.mX, ptS.mY);
        coners[1].updatePosition(ptE.mX, ptE.mY);
    }
}


Segment.prototype.getLast = function(){
    var coners = this.toCorners();
    return [coners[0].mPosition.clone(), coners[1].mPosition.clone()];
}

Segment.prototype.revertUpdatePosition = function(last) {
    var coners = this.toCorners();
    coners[0].updatePosition(last[0].mX, last[0].mY);
    coners[1].updatePosition(last[1].mX, last[1].mY);
}