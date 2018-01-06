function MyFloor() {
    this.mAreas;
    this.mCurves;
    this.mCorners;
    this.mHoles;
    this.mProfile;
    this.mOutput;
    this.mAreasPolytree;
    this.mAreasControllers;
    
    this.mPickedArea;
    this.mPickedAreaControllers;
    this.mPickedDirection;
    
    this.initialize();
}

MyFloor.prototype.initialize = function() {
    this.mAreas = [];
    this.mCurves = [];
    this.mCorners = [];
    this.mHoles = [];
    this.mProfile = null;
    this.mAreasPolytree = null;
    this.mAreasControllers = [];
    this.mPickedArea = null;
    this.mPickedAreaControllers = [];
    this.mPickedDirection = false;
}

MyFloor.prototype.setProfile = function(rect) {
    this.mProfile = new MyPolytree();
    this.mProfile.mOutLines = rect;
    this.mProfile.mHoles = [];
    this.mOutput = null;

}

MyFloor.prototype.generatePolyTree = function()
{
    //var _loc4_ = null;
    //var _loc5_ = null;
    //var _loc1_ = this.getTheBiggestAreaPath();
    
    //var _loc2_ = _loc1_ != null?_loc1_.polygon : new MyPolygon();
    //var _loc3_ = []; //new Vector.<my_polygon>();
    //for (var i = 0; i < this.mHoles.length; i++)
    //{
    //    _loc3_.push(this.mHoles[i].getPolygon());
    //}
    //_loc5_ = new MyPolytree(_loc2_,_loc3_);
    //return _loc5_;
    return this.mProfile;
}


MyFloor.prototype.getTheBiggestAreaPath = function()
{
    var pathFinder = new curveCornerHelperClass(this.mCurves);
    var paths = pathFinder.getPaths_eh();
    var counterClockPaths = MyPath.getCountClockWisePath(paths);
    //从大到小排序
    counterClockPaths.sort(function(param1, param2)
    {
        return MyMath.sign(Math.abs(param2.getArea()) - Math.abs(param1.getArea()));
    });
    if(counterClockPaths.length > 0)
    {
        return counterClockPaths[0];
    }
    
    return null;
}
   
MyFloor.prototype.correctAreas = function()
{
    var _loc2_ = null;
    var _loc3_ = null;
    var _loc1_ = CurveAreaRelationshipHelper.getHoleParts(this.mAreas);
    this.mHoles = [];
    
    for (var i = 0; i < _loc1_.length; i++)
    {
        this.mHoles.push(_loc1_[i]);
        
        for (var j = 0; j < _loc1_[i].mCurves.length; j++)
        {
            _loc3_ = _loc1_[i].mCurves[j];
            _loc3_.wallDleleteSame(_loc1_[i]);
        }
    }
    ArrayHelperClass.deleteSameValues(this.mAreas,_loc1_);
}

MyFloor.prototype.addSection = function(param1)
{
    var _loc2_ = ArrayHelperClass.ifHasAndSave(this.mCurves,param1);
    if(_loc2_)
    {
        param1.mWall = this;
    }
    return _loc2_;
}

MyFloor.prototype.addCorner = function(param1)
{
    if(param1 == null)
    {
        return false;
    }
    var _loc2_ = ArrayHelperClass.ifHasAndSave(this.mCorners,param1);
    if(_loc2_)
    {
        param1.mWall = this;
    }
    return _loc2_;
}

MyFloor.prototype.removeCorner = function(param1)
{
    return ArrayHelperClass.removeItem(this.mCorners,param1);
}

MyFloor.prototype.removeSection = function(param1)
{
    return ArrayHelperClass.removeItem(this.mCurves, param1);
}

MyFloor.prototype.clearPickedArea = function() {
    this.mPickedArea = null;
}

MyFloor.prototype.getPickedArea = function(x, y) {
    if (x == undefined) {
        return this.mPickedArea;
    }
    this.mPickedArea = null;
    for (var i = 0; i < this.mAreasPolytree.length; i++) {
        if (this.mAreasPolytree[i].contains(new Vec2(x, y))) {
            this.mPickedArea = this.mOutput[i];
            this.mPickedAreaControllers = this.mAreasControllers[i];

            
            var segment = this.mPickedAreaControllers[0];
            var edge = segment.getTheStartEndEdge();
            var start = edge.mStart.clone();
            var end = edge.mEnd.clone();
            var center = edge.getCenter();

            var angle = edge.getAngle();
            angle = angle + Math.PI / 2;
            var offset = 0.01;
            var offvec = new Vec2(offset * Math.cos(angle), offset * Math.sin(angle));
            center.addBy(offvec);
            
            if (this.mAreasPolytree[i].contains(center)) {
                this.mPickedDirection = 1;
            } else {
                this.mPickedDirection = -1;
            }
            


            break;
        }
    }
    return this.mPickedArea;
}

MyFloor.prototype.checkOverlap = function()  {
    var overlapped = false;
    for (var i = 0; i < this.mCurves.length; i++) {
        for (var j = i+1; j < this.mCurves.length; j++) {
            var curve0 = this.mCurves[i];
            var curve1 = this.mCurves[j];
            if (curve0.isIntersectWith(curve1)) {
                overlapped = true;
                break;
            }
        }
    }
    return overlapped;
}

MyFloor.prototype._updateGeoStructure = function() {
    var holesList = [];
    var areas = this.mAreas;
    for (var i = 0; i < areas.length; i++) {
        var area = areas[i];
        holesList.push([]);
        for (var j = 0; j < areas.length; j++) {
            if(i == j) {
                continue;
            }
            
            if (area.isIncludedArea(areas[j])) {
                if (holesList[i].length == 0) {
                    holesList[i].push(areas[j]);
                } else {
                    var isAdd = true;
                    for (var k = 0; k < holesList[i].length; k++) {
                        if (holesList[i][k].isIncludedArea(areas[j])) {
                            isAdd = false;
                            break;
                        }
                        if (areas[j].isIncludedArea(holesList[i][k])) {
                            holesList[i][k] = areas[j];
                            isAdd = false;
                            break;
                        }
                    }
                    if (isAdd) {
                        holesList[i].push(areas[j]);
                    }
                }
            }
        }
    }

    this.mOutput = [];
    this.mAreasPolytree = [];
    this.mAreasControllers = [];
    
    var polyTree = null;
    for (var i = 0; i < areas.length; i++) {
        var res = MyArea.outputStructures(areas[i], holesList[i]);
        var res2 = MyArea.outputStructures2(areas[i], holesList[i]);
        var res3 = MyArea.outputStructures3(areas[i], holesList[i]);
        this.mOutput.push(res);
        this.mAreasPolytree.push(res2);
        this.mAreasControllers.push(res3);
    }
    console.log("GEOM INFO:");
}

MyFloor.prototype.Analysis = function() {
    var analysis = new Analysis(this);
    analysis.execute();
    this._updateGeoStructure();
}

MyFloor.prototype.updatePosition = function(sub, newPos, oldPos)
{
    if (sub instanceof Array) {
        for (var i = 0; i < sub.length; i++) {
            sub[i].updatePosition(newPos[i].mX, newPos[i].mY);
        }
    } else {
        sub.updatePosition(newPos.mX, newPos.mY);
    }
    

    this.Analysis();

    var overlapped = this.checkOverlap();
    
    if (overlapped) {
        
        if (sub instanceof Array) {
            for (var i = 0; i < sub.length; i++) {
                sub[i].updatePosition(oldPos[i].mX, oldPos[i].mY);
            }
        } else {
            sub.updatePosition(oldPos.mX, oldPos.mY);
        }
        this.Analysis();
    } 
    
    if (this.mPickedArea) {

        var segment = this.mPickedAreaControllers[0];
        
        var edge = segment.getTheStartEndEdge();
        var start = edge.mStart.clone();
        var end = edge.mEnd.clone();
        var center = edge.getCenter();
        var area = segment.mAreas[segment.mAreas.length - 1];
        var angle = edge.getAngle();
        angle = angle + Math.PI / 2;
        var offset = 0.01;
        var offvec = new Vec2(offset * Math.cos(angle), offset * Math.sin(angle));
        if (this.mPickedDirection) {
            center.addBy(offvec);
        } else {
            center.sub(offvec);
        }
        
        this.getPickedArea(center.mX, center.mY);
    }
    //else {
    //    this.clearPickedArea();
    //}
    
    return overlapped;
}

MyFloor.prototype._seperateType = function() {
    var curves = [];
    var segments = [];
    var boundries = [];
    var validSegmentIndex = [];
    var validCurveIndex = [];
    var pickedArea = this.mPickedArea;
    for (var i = 0; i < this.mCurves.length; i++) {
        if (this.mCurves[i].isBoundry) {
            boundries.push(this.mCurves[i]);
        } else if (this.mCurves[i] instanceof SegmentController) {
            var seg = this.mCurves[i];
            segments.push(seg);
            
            if (pickedArea) {
                for (var j = 0; j < pickedArea.mOutline.edges.length; j++) {
                    var edge = pickedArea.mOutline.edges[j];
                    if (edge instanceof MyEdge && edge.isSameAsEdgeStartOrEnd(seg.mStart.mPosition) && edge.isSameAsEdgeStartOrEnd(seg.mEnd.mPosition)) {
                        validSegmentIndex.push(segments.length - 1);
                    }
                }
                for (var k = 0; k < pickedArea.mHoles.length; k++) {
                    var poly = pickedArea.mHoles[k];
                    for (var j = 0; j < poly.edges.length; j++) {
                        var edge = poly.edges[j];
                        if (edge instanceof MyEdge  && edge.isSameAsEdgeStartOrEnd(seg.mStart.mPosition) && edge.isSameAsEdgeStartOrEnd(seg.mEnd.mPosition)) {
                            validSegmentIndex.push(segments.length - 1);
                        }
                    }
                }
            }
        } else if (this.mCurves[i] instanceof CurveController) {
            curves.push(this.mCurves[i]);
            if (pickedArea) {
                var cur = this.mCurves[i].getCurveFromController();
                for (var j = 0; j < pickedArea.mOutline.edges.length; j++) {
                    var edge = pickedArea.mOutline.edges[j];
                    if (edge instanceof MyCurve && MyCurve.isSameCurve(cur, edge)) {
                        validCurveIndex.push(curves.length - 1);
                    }
                }
                
                
                for (var k = 0; k < pickedArea.mHoles.length; k++) {
                    var poly = pickedArea.mHoles[k];
                    for (var j = 0; j < poly.edges.length; j++) {
                        var edge = poly.edges[j];
                        if (edge instanceof MyCurve && MyCurve.isSameCurve(cur, edge)) {
                            validCurveIndex.push(curves.length - 1);
                        }
                    }
                }
            }
        }
    }
    return [curves, segments, boundries, validSegmentIndex, validCurveIndex];
}
MyFloor.prototype.renderPickedArea = function(renderer) {
    if (!this.mPickedArea) {
        return;
    }
    renderer.drawArea(this.mPickedArea);
    this.renderOutput(renderer);
    renderer.drawAreaDots(this.mPickedArea);
}

MyFloor.prototype.renderOutput = function(renderer) {
    if (this.mOutput == null) {
        return;
    }
    var res = this.mOutput;
    for (var i = 0; i < res.length; i++) {
        renderer.drawOutput(res[i]);
    }
    renderer.drawOutput(this.mPickedArea, true);
}

//画内部标注线
MyFloor.prototype._renderZoneSize = function(segments, validIndex, renderer) {
    for (var i = 0; i < segments.length; i++) {
        var segment = segments[i];
        var edge = segment.getTheStartEndEdge();
        var start = edge.mStart.clone();
        var end = edge.mEnd.clone();
        var center = edge.getCenter();
        var area = segment.mAreas[segment.mAreas.length - 1];
        var angle = edge.getAngle();
        angle = angle + Math.PI / 2;
        var offset = 10;
        var offvec = new Vec2(offset * Math.cos(angle), offset * Math.sin(angle));
        center.addBy(offvec);
        
        if (area.containsPoint(center)) {
            start.sub(offvec);
            end.sub(offvec);
            
        } else {
            start.addBy(offvec);
            end.addBy(offvec);
        }
        if (validIndex.indexOf(i) > -1) {
            renderer.drawDimensions({x: start.mX,y: start.mY}, {x: end.mX,y: end.mY});
        }
    }
}

MyFloor.prototype._renderCurveHeight = function(curves, validCurveIndex, renderer) {
}

MyFloor.prototype.renderMarkerLines = function(flags, renderer)  {
    //1. seperate the lines
    var curves, segments, boundries, validSegmentIndex, validCurveIndex;
    [curves, segments, boundries, validSegmentIndex, validCurveIndex] = this._seperateType();
    
    //2. renderZoneSize
    if (flags.isZoneSizeEnabled) {
        this._renderZoneSize(segments, validSegmentIndex, renderer);
    }
    
    //3. renderCurveHeight
    if (flags.isCrownHeightEnabled) {
        this._renderCurveHeight(curves, validCurveIndex, renderer);
    }
    
}
























