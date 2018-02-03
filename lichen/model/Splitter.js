function Splitter(param1, param2, param3) {
    this.mCircle = param1;
    this.mWall = param2;
    this.mPolytree = param3;
}

Splitter.DISTANCE_TOLERANCE = 1.0E-5;

Splitter.prototype.getLineCrossLine = function(param1)
{
    var _loc2_ = param1.mCenter;
    return new MyEdge(_loc2_,_loc2_.add(new Vec2(1,0)));
}

Splitter.prototype.getSplitCurvesByEdgeCircle = function(param1, param2)
{
    var _loc5_ = NaN;
    var _loc6_ = NaN;
    var _loc7_ = null;
    var _loc3_ = [];
    var _loc4_ = circleEdgeHelper.getEdgeCircleIntersectionPoints(param1,param2);
    if(_loc4_.length != 2)
    {
        return [];
    }
    var _loc8_ = _loc4_[0];
    var _loc9_ = _loc4_[1];
    _loc5_ = param1.getCenterIntersectAngle(_loc8_);
    _loc6_ = param1.getCenterIntersectAngle(_loc9_) - _loc5_;
    _loc7_ = new MyCurve(param1.mCenter.clone(), param1.mRadius, _loc5_, _loc6_);
    _loc3_[0] = _loc7_;
    _loc5_ = param1.getCenterIntersectAngle(_loc8_);
    _loc6_ = _loc5_ - param1.getCenterIntersectAngle(_loc9_);
    _loc7_ = new MyCurve(param1.mCenter.clone(),param1.mRadius, _loc5_, _loc6_);
    _loc3_[1] = _loc7_;
    return _loc3_;
}

Splitter.prototype.getSubSegmentsSplitByCurves = function(param1, param2)
{
    var subject = param1;

    var clippers = param2;
    
    var edges
    if (param1 instanceof MyPolygon) {
        edges = subject.getEdges();
    } else {
        edges = param1;
    }
    //var edges = subject.getEdges();
    
    var intersections = [];

    for (var i = 0; i < clippers.length; i++)
    {
        for(var j = 0; j < edges.length; j++)
        {
            clippers[i].isCurveIntersectByEdgeAndGetIntersectPoint(edges[j],intersections,true);
        }
    }
    
    edgePointHelperClass.removeDuplicatePointsInHelper(intersections);
    res = [];
    
    var record = [];
    
    for (var j = 0; j < edges.length; j++) {
        record.push([]);
        for (var i = 0; i < intersections.length; i++) {
            var edge = edges[j];
            var intersection = intersections[i];
            
            if (edge.pointInEdgeOrOnEdge(intersection)) {
                record[j].push({
                                point: intersection,
                                dis : Vec2.distance(edge.mStart, intersection)
                                });
            }
            
        }
    }
    
    for (var i = 0; i < record.length; i++) {
        if (record[i].length == 0) {

            res.push(edges[i]);
        } else if (record[i].length == 1){
            res.push(new MyEdge(edges[i].mStart, record[i][0].point));
            res.push(new MyEdge(record[i][0].point, edges[i].mEnd));
        } else {
            record[i].sort(function(param1, param2)
            {
                return MyMath.sign(param1.dis - param2.dis);
            });
            
            res.push(new MyEdge(edges[i].mStart, record[i][0].point));
            
            for (var j = 0; j < record[i].length - 1; j++) {
                res.push(new MyEdge(record[i][j].point, record[i][j+1].point));
            }
            res.push(new MyEdge(record[i][record[i].length - 1].point, edges[i].mEnd));
        }
    }
    
    if (this.mPolytree) {
        var item = null;
        var j = res.length - 1;
        while(j >= 0)
        {
            item = res[j];
            if(!this.mPolytree.contains(item.getCenter()))
            {
                ArrayHelperClass.removeItemAt(res,j);
            }
            j--;
        }
    }
    
    return res;
}

Splitter.prototype.getSubCurvesCircleSplitByCurves = function(param1, param2)
{
    var curve = null;
    var res = null;
    var intersection = null;
    var arcCurve = null;
    var cuttingLine = null;
    var startAngle = NaN;
    var deltaAngle = NaN;
    var newArc = null;
    var nextIntersection = null;
    var i = 0;

    var subject = param1;

    var clippers = param2;

    //横着切
    var lineAcrossCenter = this.getLineCrossLine(subject);

    //上下半圆
    var arcCurves = this.getSplitCurvesByEdgeCircle(subject,lineAcrossCenter);

    var intersections = [];

    for (var i = 0; i < clippers.length; i++)
    {
        for(var j = 0; j < arcCurves.length; j++)
        {
            clippers[i].isCurveIntersectByAreaAndGetIntersectPoint(arcCurves[j],intersections,true);
        }
    }
    
    edgePointHelperClass.removeDuplicatePointsInHelper(intersections);
    res = [];
    intersection = null;
    if(intersections.length == 0)
    {
        res = arcCurves;
    }
    else if(intersections.length == 1)
    {
        intersection = intersections[0];
        cuttingLine = new MyEdge(subject.mCenter,intersection);
        res = this.getSplitCurvesByEdgeCircle(subject,cuttingLine);
    }
    else if(intersections.length > 1)
    {
        intersections.sort(function(param1, param2)
        {
            var _loc3_ = subject.getCenterIntersectAngle(param1);
            var _loc4_ = subject.getCenterIntersectAngle(param2);
            return MyMath.sign(_loc3_ - _loc4_);
        });
        newArc = null;
        nextIntersection = null;
        i = 0;
        while(i < intersections.length)
        {
            intersection = intersections[i];
            nextIntersection = intersections[(i + 1) % intersections.length];
            startAngle = subject.getCenterIntersectAngle(intersection);
            deltaAngle = Angle.normalize(subject.getCenterIntersectAngle(nextIntersection) - startAngle);
            newArc = new MyCurve(subject.mCenter.clone(),subject.mRadius,startAngle,deltaAngle);
            
            for (var j = 0; j < clippers.length; j++) {
                if (clippers[j] instanceof CurveController) {
                    var c = clippers[j].getCurveFromController();
                    newArc = newArc.getValidPart(c);
                    if (!newArc) {
                        break;
                    }
                }
            }
            
            if (newArc) {
                ArrayHelperClass.addItem(res,newArc);
            }
            i++;
        }
    }
    
    if (this.mPolytree) {
        var item = null;
        var j = res.length - 1;
        while(j >= 0)
        {
            item = res[j];
            if(!this.mPolytree.contains(item.getSplitPosByRatio(0.5)))
            {
                ArrayHelperClass.removeItemAt(res,j);
            }
            j--;
        }
    }
    
    return res;
}

Splitter.prototype.addCorner = function(param1)
{
    var _loc5_ = null;
    var _loc2_ = null;
    var _loc3_ = wallCurveCornerHelper.getSamePositionButNotSamePointerCorner(param1, this.mWall.mCorners, Splitter.DISTANCE_TOLERANCE);
    if(_loc3_ != null)
    {
        _loc2_ = _loc3_.mCurves.concat();
        
        for (var i = 0; i < _loc2_.length; i++)
        {
            _loc2_[i].setCornerStartAndEndButHasToBeSame(_loc3_,param1);
        }
        _loc3_.dispose();
    }

    var _loc4_ = CurveRelationHelper.getTheClosestCurve_ax(param1.mPosition.clone(), this.mWall.mCurves, false, Splitter.DISTANCE_TOLERANCE);
    if(_loc4_ != null)
    {
        _loc4_.updateInfo(param1);
    }
    this.mWall.addCorner(param1);
}
      
Splitter.prototype.splitCurvesIntoOneThirdCurves = function(param1)
{
    var _loc2_ = [];
    var _loc3_ = null;
    for (var i = 0; i < param1.length; i++)
    {
        _loc3_ = CurveController.getSplitOneThirdCurve(param1[i]);
        _loc2_.push(_loc3_);
    }
    return _loc2_;
}

Splitter.prototype.splitMyEdgeIntoSegment = function(param1)
{
    var _loc3_ = null;
    var _loc2_ = [];
    /*
    var edges;
    if (this.mPolytree) {
        edges = this.mPolytree.mOutLines.getEdges();
    }
    */
    for (var i = 0; i < param1.length; i++)
    {
        _loc3_ = SegmentController.createSegmentByMyEdge(param1[i]);
        /*
        if (!this.mPolytree) {
            _loc3_.isBoundry = true;
        } else {
            for (var j = 0; j < edges.length; j++) {
                if (edges[j].contains(param1[i])){
                    _loc3_.isBoundry = true;
                    break
                }
            }
        }
        */
        
        _loc2_.push(_loc3_);
    }
    return _loc2_;
}

Splitter.prototype.execute = function() {
    var _loc3_ = null;
    if(this.mCircle == null || this.mWall == null)
    {
        return;
    }
    
    
    if(this.mCircle instanceof MyCircle && MyNumber.isZeroOrOrigin(this.mCircle.mRadius))
    {
        return;
    }
    
    var _loc1_, _loc2_ = [];
    
    if (this.mCircle instanceof MyCircle) {
        _loc1_ = this.getSubCurvesCircleSplitByCurves(this.mCircle,this.mWall.mCurves);
    } else if (this.mCircle instanceof MyPolygon || this.mCircle instanceof Array) {
        _loc1_ = this.getSubSegmentsSplitByCurves(this.mCircle,this.mWall.mCurves);
    } //else if (this.mCircle instanceof Array) {
    //    _loc1_ = this.getSubSegmentsSplitByCurves(this.mCircle,this.mWall.mCurves);
    //}
    
    if (_loc1_[0] instanceof MyCurve) {
        _loc2_ = this.splitCurvesIntoOneThirdCurves(_loc1_);
    } else if (_loc1_[0] instanceof MyEdge) {
        _loc2_ = this.splitMyEdgeIntoSegment(_loc1_);
    }

    for (var i = 0; i < _loc2_.length; i++)
    {
        this.addCorner(_loc2_[i].mStart);
        this.addCorner(_loc2_[i].mEnd);

        this.mWall.addSection(_loc2_[i]);
    }
    
    var edges;
    if (this.mPolytree) {
        edges = this.mPolytree.mOutLines.getEdges();
    }
    
    for (var i = 0; i < this.mWall.mCurves.length; i++) {
        var seg = this.mWall.mCurves[i];
        if (seg instanceof SegmentController) {
            if (!this.mPolytree) {
                seg.isBoundry = true;
            } else {
                var e = seg.getTheStartEndEdge();
                for (var j = 0; j < edges.length; j++) {
                    if (edges[j].contains(e)){
                        seg.isBoundry = true;
                        break
                    }
                }
            }
        }
        
    }
    
        
}
