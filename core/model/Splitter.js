function Splitter(param1, param2, param3, isSkipCheck) {
    this.mCircle = param1;
    this.mFloor = param2;
    this.mPolytree = param3;
    this.mSkip = isSkipCheck;
}

Splitter.DISTANCE_TOLERANCE = 1.0E-5;

Splitter.prototype.getLineCrossLine = function(param1)
{
    var _loc2_ = param1.mCenter;
    return new Edge(_loc2_,_loc2_.add(new Vec2(1,0)));
}

Splitter.prototype.getSplitCurvesByEdgeCircle = function(param1, param2)
{
    var _loc5_ = NaN;
    var _loc6_ = NaN;
    var _loc7_ = null;
    var _loc3_ = [];
    var _loc4_ = AuxiliaryCurve.getIntersectionCircleEdge(param1,param2);
    if(_loc4_.length != 2)
    {
        return [];
    }
    var _loc8_ = _loc4_[0];
    var _loc9_ = _loc4_[1];
    _loc5_ = param1.getCenterIntersectAngle(_loc8_);
    _loc6_ = param1.getCenterIntersectAngle(_loc9_) - _loc5_;
    _loc7_ = new Curve(param1.mCenter.clone(), param1.mRadius, _loc5_, _loc6_);
    _loc3_[0] = _loc7_;
    _loc5_ = param1.getCenterIntersectAngle(_loc8_);
    _loc6_ = _loc5_ - param1.getCenterIntersectAngle(_loc9_);
    _loc7_ = new Curve(param1.mCenter.clone(),param1.mRadius, _loc5_, _loc6_);
    _loc3_[1] = _loc7_;
    return _loc3_;
}

Splitter.prototype.getSubSegmentsSplitByCurves = function(param1, param2)
{
    var subject = param1;

    var clippers = param2;
    
    var edges
    if (param1 instanceof Polygon) {
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
    
    AuxiliaryPoint.removeDuplicate(intersections);
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
            res.push(new Edge(edges[i].mStart, record[i][0].point));
            res.push(new Edge(record[i][0].point, edges[i].mEnd));
        } else {
            record[i].sort(function(param1, param2)
            {
                return MyMath.sign(param1.dis - param2.dis);
            });
            
            res.push(new Edge(edges[i].mStart, record[i][0].point));
            
            for (var j = 0; j < record[i].length - 1; j++) {
                res.push(new Edge(record[i][j].point, record[i][j+1].point));
            }
            res.push(new Edge(record[i][record[i].length - 1].point, edges[i].mEnd));
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
                MyArray.removeItemAt(res,j);
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
    
    AuxiliaryPoint.removeDuplicate(intersections);
    res = [];
    intersection = null;
    if(intersections.length == 0)
    {
        res = arcCurves;
    }
    else if(intersections.length == 1)
    {
        intersection = intersections[0];
        cuttingLine = new Edge(subject.mCenter,intersection);
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
        newArc = [];
        nextIntersection = null;
        i = 0;
        while(i < intersections.length)
        {
            intersection = intersections[i];
            nextIntersection = intersections[(i + 1) % intersections.length];
            startAngle = subject.getCenterIntersectAngle(intersection);
            deltaAngle = Angle.normalize(subject.getCenterIntersectAngle(nextIntersection) - startAngle);
            newArc.push(new Curve(subject.mCenter.clone(),subject.mRadius,startAngle,deltaAngle));
            
            i++;
        }
        
        for (var i = 0; i < newArc.length; i++ ) {
            for (var j = 0; j < clippers.length; j++) {
                if (clippers[j] instanceof Arc) {
                    var c = clippers[j].getCurve();
                    
                    if (newArc[i] instanceof Array) {
                        var total = [];
                        for (var m = 0; m < newArc[i].length; m++) {
                            var result = newArc[i][m].getValidPart(c);
                            if (result == null) {
                                // do nothing
                            } else if (result instanceof Array) {
                                total.push(result[0]);
                                total.push(result[1]);
                            } else {
                                total.push(result);
                            }
                        }
                        newArc[i] = total;
                    } else if (newArc[i] != null){
                        newArc[i] = newArc[i].getValidPart(c);
                    }
                }
            }
        }
        
        for (var i = 0; i < newArc.length; i++) {
            if (newArc[i] == null) {
            } else if (newArc[i] instanceof Array && newArc[i].length > 0) {
                for (var j = 0; j < newArc[i].length; j++) {
                    MyArray.addItem(res,newArc[i][ja]);
                }
            } else {
                MyArray.addItem(res,newArc[i]);
            }
        }
    }
    
    if (this.mPolytree) {
        var item = null;
        var j = res.length - 1;
        while(j >= 0)
        {
            item = res[j];
            if(!this.mPolytree.contains(item.getPointByRatio(0.5)))
            {
                MyArray.removeItemAt(res,j);
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
    var _loc3_ = Auxiliary.getSameCorner(param1, this.mFloor.mCorners, Splitter.DISTANCE_TOLERANCE);
    if(_loc3_ != null)
    {
        _loc2_ = _loc3_.mElements.concat();
        
        for (var i = 0; i < _loc2_.length; i++)
        {
            _loc2_[i].setCornerStartAndEndButHasToBeSame(_loc3_,param1);
        }
        _loc3_.dispose();
    }

    var _loc4_ = Auxiliary.getClosestCurve(param1.mPosition.clone(), this.mFloor.mElements, false, Splitter.DISTANCE_TOLERANCE);
    if(_loc4_ != null)
    {
        _loc4_.updateInfo(param1);
    }
    this.mFloor.addCorner(param1);
}
      
Splitter.prototype.splitCurvesIntoOneThirdCurves = function(param1)
{
    var _loc2_ = [];
    var _loc3_ = null;
    for (var i = 0; i < param1.length; i++)
    {
        _loc3_ = Arc.copy(param1[i]);
        _loc2_.push(_loc3_);
    }
    return _loc2_;
}

Splitter.prototype.splitMyEdgeIntoSegment = function(param1)
{
    var _loc3_ = null;
    var _loc2_ = [];

    for (var i = 0; i < param1.length; i++)
    {
        _loc3_ = Segment.createSegmentByMyEdge(param1[i]);

        _loc2_.push(_loc3_);
    }
    return _loc2_;
}

Splitter.prototype.execute = function() {
    var _loc3_ = null;
    if(this.mCircle == null || this.mFloor == null)
    {
        return;
    }
    
    
    if(this.mCircle instanceof Circle && MyNumber.isZero(this.mCircle.mRadius))
    {
        return;
    }
    
    var _loc1_, _loc2_ = [];
    if (this.mSkip) {
        _loc1_ = this.mCircle;
    } else if (this.mCircle instanceof Circle) {
        _loc1_ = this.getSubCurvesCircleSplitByCurves(this.mCircle,this.mFloor.mElements);
    } else if (this.mCircle instanceof Polygon || this.mCircle instanceof Array) {
        _loc1_ = this.getSubSegmentsSplitByCurves(this.mCircle,this.mFloor.mElements);
    } 
    
    var _loc4_ = null;
    for (var i = 0; i < _loc1_.length; i++) {
        if (_loc1_[i] instanceof Edge) {
            _loc4_ = Segment.createSegmentByMyEdge(_loc1_[i]);
            _loc2_.push(_loc4_);
        } else {
            _loc4_ = Arc.copy(_loc1_[i]);
            _loc2_.push(_loc4_);
        }
    }
    /*
    if (_loc1_[0] instanceof Curve) {
        _loc2_ = this.splitCurvesIntoOneThirdCurves(_loc1_);
    } else if (_loc1_[0] instanceof Edge) {
        _loc2_ = this.splitMyEdgeIntoSegment(_loc1_);
    }
    */
    
    for (var i = 0; i < _loc2_.length; i++)
    {
        this.addCorner(_loc2_[i].mStart);
        this.addCorner(_loc2_[i].mEnd);

        this.mFloor.addElement(_loc2_[i]);
    }
    
    var edges;
    if (this.mPolytree) {
        edges = this.mPolytree.mOutLines.getEdges();
    }
    
    for (var i = 0; i < this.mFloor.mElements.length; i++) {
        var seg = this.mFloor.mElements[i];
        if (seg instanceof Segment) {
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
