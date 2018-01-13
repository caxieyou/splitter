function AreaHeightRecord() {
    this.corners = [];//二维数组
    this.height = 0; //一维数组
    this.name = "";
    this.sign = 0;
}

function MyFloor() {
    this.mAreas;
    this.mCurves;
    this.mCorners;
    this.mHoles;
    this.mProfile;
    this.mOutput;
    this.mAreasPolytree;
    this.mAreasControllers;
    this.mLastHeightRecord;
    this.mAreaHeightRecord;

    this.mPickedIndex;
    this.mPickedDirection;
    
    this.mKeyPoints;
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
    this.mPickedIndex = -1;
    this.mPickedDirection = false;
    this.mLastHeightRecord = null;
    this.mAreaHeightRecord = [];
    this.mKeyPoints = [];
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
    this.mPickedIndex = -1;
}

MyFloor.prototype.getPickedArea = function(x, y) {
    if (x == undefined) {
        return this.mPickedIndex != -1;
    }
    this.mPickedIndex = -1;
    //this.mPickedArea = null;
    for (var i = 0; i < this.mAreasPolytree.length; i++) {
        if (this.mAreasPolytree[i].contains(new Vec2(x, y))) {
            this.mPickedIndex = i;
            //this.mPickedArea = this.mOutput[i];
            //this.mPickedAreaControllers = this.mAreasControllers[i];

            var segment = this.mAreasControllers[i][0];
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
    return this.mPickedIndex != -1;
}
MyFloor.prototype.setAreaHeight = function(sign, val) {
    if (this.mPickedIndex == -1) {
        return;
    }
    this.mAreaHeightRecord[this.mPickedIndex].sign = sign;
    this.mAreaHeightRecord[this.mPickedIndex].height = val;
}

MyFloor.prototype.setAreaName = function(name) {
    if (this.mPickedIndex == -1) {
        return;
    }
    this.mAreaHeightRecord[this.mPickedIndex].name = name;
}

MyFloor.prototype.getAreaHeight = function() {
    return this.mAreaHeightRecord[this.mPickedIndex].sign * this.mAreaHeightRecord[this.mPickedIndex].height;
}

MyFloor.prototype.getAreaName = function() {
    return this.mAreaHeightRecord[this.mPickedIndex].name;
}

MyFloor.prototype.checkOverlap = function()  {
    var overlapped = false;
    for (var i = 0; i < this.mCurves.length; i++) {
        for (var j = i+1; j < this.mCurves.length; j++) {
            var curve0 = this.mCurves[i];
            var curve1 = this.mCurves[j];
            
            if (curve0 instanceof SegmentController && curve1 instanceof SegmentController) {
                if ((curve0.mStart.mPosition.equals(curve1.mStart.mPosition) && 
                     curve0.mEnd.mPosition.equals(curve1.mEnd.mPosition)) ||
                    (curve0.mStart.mPosition.equals(curve1.mEnd.mPosition) && 
                     curve0.mEnd.mPosition.equals(curve1.mStart.mPosition))) {
                        
                    overlapped = true;
                    break;
                }
            }
            
            
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
        //output structure
        var res = MyArea.outputStructures(areas[i], holesList[i]);
        //inner geom structure
        var res2 = MyArea.outputStructures2(areas[i], holesList[i]);
        //inner controllers' info
        var res3 = MyArea.outputStructures3(areas[i], holesList[i]);
        
        res3.sort(function(a, b) {return a.mId - b.mId});
        
        //remove duplicated seg
        
        
        var tmp = {};
        for (var j = 0; j < res3.length; j++) {
            if (!tmp[res3[j].mId]) {
                tmp[res3[j].mId] = {};
                tmp[res3[j].mId].count = 0;
                tmp[res3[j].mId].seg  = res3[j];
            }
            tmp[res3[j].mId].count++;
        }
        res3 = [];
        for (var id in tmp) {
            if (tmp[id].count == 1) {
                res3.push(tmp[id].seg);
            }
        }
        
        this.mOutput.push(res);
        this.mAreasPolytree.push(res2);
        this.mAreasControllers.push(res3);
        
    }
    this.mKeyPoints = [];
    for (var i = 0; i < this.mAreasPolytree.length; i++) {
        var point =  this.mAreasPolytree[i].getValidGravityCenter();
        if (this.mAreasPolytree[i].contains(point)) {
            this.mKeyPoints.push(point);
        }
    }

    for (var i = 0; i < this.mCurves.length; i++) {
        if (!this.mCurves[i].isBoundry) {
            this.mKeyPoints.push(this.mCurves[i].getCenter());
        }
    }
    
    var getCorners = function(controllers, areaHeightRecord) {
        for (var i = 0; i < controllers.length; i++) {
            var segments = controllers[i];
            var record = new AreaHeightRecord();
            
            for (var j = 0; j < segments.length; j++) {
                var corners = segments[j].toCorners();
                
                var isRepeat = false;
                for (var m = 0; m < record.corners.length; m++) {
                    if (record.corners[m] == corners[0].mId) {
                        isRepeat = true;
                        break;
                    }
                }
                if (!isRepeat) {
                    record.corners.push(corners[0].mId);
                }
                
                var isRepeat = false;
                for (var m = 0; m < record.corners.length; m++) {
                    if (record.corners[m] == corners[1].mId) {
                        isRepeat = true;
                        break;
                    }
                }
                if (!isRepeat) {
                    record.corners.push(corners[1].mId);
                }
            }
            record.corners.sort(function(a,b){return a - b});
            areaHeightRecord.push(record);
        }
    }
    this.mAreaHeightRecord = [];
    getCorners(this.mAreasControllers, this.mAreaHeightRecord);
    
    if (this.mLastHeightRecord) {
        //TODO: DO the Analysis
        var compare = [];
        
        //compare from new to old
        for (var i = 0; i < this.mLastHeightRecord.length; i++) {
            var a = this.mLastHeightRecord[i].corners;
            var subCompare = [];
            
            for (var j = 0; j < this.mAreaHeightRecord.length; j++) {
                var b = this.mAreaHeightRecord[j].corners;
                var nSame = 0;
                for (var m = 0; m < a.length; m++) {
                    for (var n = 0; n < b.length; n++) {
                        if (a[m] == b[n]) {
                            nSame++;
                        }
                    }
                }
                subCompare.push(nSame / b.length);
            }
            compare.push(subCompare);
        }
        
        for (var i = 0; i < compare.length; i++) {
            var copyIdx = -1;
            var ratio = 0;
            for (var j = 0; j < compare[i].length; j++) {
                if (compare[i][j] >= 0.5) {
                    ratio = compare[i][j];
                    copyIdx = j;
                }
            }
            if (copyIdx != -1) {
                this.mAreaHeightRecord[copyIdx].name = this.mLastHeightRecord[i].name;
                this.mAreaHeightRecord[copyIdx].sign = this.mLastHeightRecord[i].sign;
                this.mAreaHeightRecord[copyIdx].height = this.mLastHeightRecord[i].height;
            }
            
        }
    }
    this.mLastHeightRecord = this.mAreaHeightRecord;
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
    
    if (this.mPickedIndex != -1) {
        var segment = this.mAreasControllers[this.mPickedIndex][0];
        
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
    var pickedArea = this.mOutput[this.mPickedIndex];// this.mPickedArea;
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
    if (this.mPickedIndex == -1/*!this.mPickedArea*/) {
        return;
    }
    var height = this.mAreaHeightRecord[this.mPickedIndex].height;
    if (height == 0) {
        height = undefined;
    } else {
        height = Math.max(Math.min(1, height), 10);
    }
    
    renderer.drawArea(this.mOutput[this.mPickedIndex], height);
    this.renderOutput(renderer);
    renderer.drawAreaDots(this.mOutput[this.mPickedIndex]);
}

MyFloor.prototype.renderOutput = function(renderer) {
    if (this.mOutput == null) {
        return;
    }
    var res = this.mOutput;
    for (var i = 0; i < res.length; i++) {
        renderer.drawOutput(res[i]);
    }
    renderer.drawOutput(this.mOutput[this.mPickedIndex], true);
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

//画内部标注线
MyFloor.prototype._renderCurveHeight = function(curves, validCurveIndex, canvas, renderer) {
    for (var i = 0; i < curves.length; i++) {
        var pt0 = curves[i].getCenter();
        var pt1 = curves[i].getTheStartEndEdge().getCenter();
        
        if (validCurveIndex.indexOf(i) > -1) {
            renderer.drawDimensions({x: pt0.mX,y: pt0.mY}, {x: pt1.mX,y: pt1.mY}, null, true, 
            Utility.DrawCurveHeightCallback, canvas, curves[i]);
        }
    }
}

MyFloor.prototype._renderRelativeDistance = function(segments, validIndex, canvas, renderer) {
    for (var i = 0; i < segments.length; i++) {
        var segmentObj = segments[i];
        var edgeObj = segmentObj.getTheStartEndEdge();
        var angleObj = edgeObj.getAngle();
        
        var isHorizontalObj = Angle.isHorizontal(angleObj);
        var isVerticalObj = Angle.isVertical(angleObj);
        
        for (var j = i+1; j < segments.length; j++) {
            var segmentSbj = segments[j];
            var edgeSbj = segmentSbj.getTheStartEndEdge();
            var angleSbj = edgeSbj.getAngle();
            
            var isHorizontalSbj = Angle.isHorizontal(angleSbj);
            var isVerticalObSbj = Angle.isVertical(angleSbj);
            
            var maxDis = -Number.MAX_VALUE;
            var sign = 0;
            var center;
            var markLine = new MyEdge(new Vec2(), new Vec2());
            if (!SegmentController.isWithinSameArea(segmentObj,segmentSbj)) {
                var direction = -1;
                
                if (isHorizontalObj && isHorizontalSbj && MyEdge.getValidHorizontalSection(edgeObj, edgeSbj, markLine)) {
                    direction = 0;
                }
                
                if (isVerticalObj && isVerticalObSbj && MyEdge.getValidVerticalSection(edgeObj, edgeSbj, markLine)) {
                    direction = 1;
                }
                
                if (direction > -1) {
                    var valid = true;
                    
                    for (var m = 0; m < this.mCurves.length; m++) {
                        if (this.mCurves[m] instanceof CurveController) {
                            continue;
                        }
                        var intersects = [];
                        if (SegmentController.isIntersectWith(markLine, this.mCurves[m], intersects)) {
                            if (intersects.length > 0 && !Vec2.isEqual(intersects[0], markLine.mEnd))
                            {
                                valid = false;
                                continue;
                            }
                        }
                    }
                    if(valid) {
                        var distance;
                        if (direction == 0) {
                            distance = segments[i].mStart.mPosition.mY - segments[j].mStart.mPosition.mY;
                        } else {
                            distance = segments[i].mStart.mPosition.mX - segments[j].mStart.mPosition.mX;
                        }
                        sign = Math.sign(distance);
                        distance = Math.abs(distance);
                        center = markLine.mStart.clone();
                            
                        if (validIndex.indexOf(i) > -1) {
                            var arcValid_i = true;
                            
                            var corners = segments[i].toCorners();
                            for (var n = 0; n < corners.length; n++) {
                                var corner = corners[n];
                                for (var p = 0; p < corner.mCurves.length; p++) {
                                    if (corner.mCurves[p] instanceof CurveController) {
                                        arcValid_i = false;
                                        break;
                                    }
                                }
                            }
                            
                            if (arcValid_i) {
                                renderer.drawDimensions({x: center.mX,y: center.mY}, {x: center.mX - direction * sign * distance,y: center.mY  - (1 -  direction) * sign * distance}, null, true,
                                Utility.DrawDimensionCallback, canvas, segments[i], null, sign * distance, direction);
                            }
                        }
                    }
                }
            }
        }
    }
}

MyFloor.prototype._renderAbosoluteDistance = function(segments, validIndex, boundries , canvas, renderer) {
    for (var i = 0; i < segments.length; i++) {
        var segmentObj = segments[i];
        var edgeObj = segmentObj.getTheStartEndEdge();
        var angleObj = edgeObj.getAngle();
        
        var isHorizontalObj = Angle.isHorizontal(angleObj);
        var isVerticalObj = Angle.isVertical(angleObj);
        
        for (var j = 0; j < boundries.length; j++) {
            var segmentSbj = boundries[j];
            var edgeSbj = segmentSbj.getTheStartEndEdge();
            var angleSbj = edgeSbj.getAngle();
            
            var isHorizontalSbj = Angle.isHorizontal(angleSbj);
            var isVerticalObSbj = Angle.isVertical(angleSbj);
            
            var maxDis = -Number.MAX_VALUE;
            var sign = 0;
            var center;
            var markLine = new MyEdge(new Vec2(), new Vec2());
            if (!SegmentController.isWithinSameArea(segmentObj,segmentSbj)) {
                var direction = -1;
                
                if (isHorizontalObj && isHorizontalSbj && MyEdge.getValidHorizontalSection(edgeObj, edgeSbj, markLine)) {
                    direction = 0;
                }
                
                if (isVerticalObj && isVerticalObSbj && MyEdge.getValidVerticalSection(edgeObj, edgeSbj, markLine)) {
                    direction = 1;
                }
                
                if (direction > -1) {
                    if (direction == 0) {
                        markLine.mEnd.mY = boundries[j].mStart.mPosition.mY;
                    } else {
                        markLine.mEnd.mX = boundries[j].mStart.mPosition.mX;
                    }
                    var valid = true;
                    for (var m = 0; m < this.mCurves.length; m++) {
                        if (this.mCurves[m] instanceof CurveController) {
                            continue;
                        }
                        var intersects = [];
                        if (SegmentController.isIntersectWith(markLine, this.mCurves[m], intersects)) {
                            if (intersects.length > 0 && !Vec2.isEqual(intersects[0], markLine.mEnd) && SegmentController.isWithinSameArea(segments[i],this.mCurves[m]))
                            {
                                valid = false;
                                continue;
                            }
                        }
                    }
                    if(valid) {
                        var distance
                        if (direction == 0) {
                            distance = segments[i].mStart.mPosition.mY - boundries[j].mStart.mPosition.mY;
                        } else {
                            distance = segments[i].mStart.mPosition.mX - boundries[j].mStart.mPosition.mX;
                        }
                        if (maxDis < Math.abs(distance)) {
                            sign = Math.sign(distance);
                            maxDis = Math.abs(distance);
                            center = markLine.mStart.clone();
                        }
                    }
                    
                    
                    
                    if (maxDis > -Number.MAX_VALUE && validIndex.indexOf(i) > -1) {
                        var arcValid = true;
                        for (var k = 0; k < segments[i].mAreas.length; k++) {
                            var area = segments[i].mAreas[k];
                            for (var m = 0; m < area.mCurves.length; m++) {
                                var curve = area.mCurves[m];
                                var corners = curve.toCorners();
                                for (var n = 0; n < corners.length; n++) {
                                    var corner = corners[n];
                                    for (var p = 0; p < corner.mCurves.length; p++) {
                                        if (corner.mCurves[p] instanceof CurveController) {
                                            arcValid = false;
                                            break;
                                        }
                                    }
                                }
                                
                            }
                        }
                        if (arcValid) {
                            renderer.drawDimensions({x: center.mX,y: center.mY}, {x: center.mX - direction * sign * maxDis, y: center.mY - (1- direction) * sign * maxDis}, null, true,
                            Utility.DrawDimensionCallback, canvas, segments[i], null, sign * maxDis, direction);
                        }
                    }
                }
            }
        }
    }
}

MyFloor.prototype.renderMarkerLines = function(flags, renderer, canvas)  {
    //1. seperate the lines
    var curves, segments, boundries, validSegmentIndex, validCurveIndex;
    [curves, segments, boundries, validSegmentIndex, validCurveIndex] = this._seperateType();
    
    //2. renderZoneSize
    if (flags.isZoneSizeEnabled) {
        this._renderZoneSize(segments, validSegmentIndex, renderer);
    }
    
    //3. renderCurveHeight and the callback
    if (flags.isCrownHeightEnabled) {
        this._renderCurveHeight(curves, validCurveIndex, canvas, renderer);
    }
    
    //4. render the segments's length and its callback
    if (flags.isRelativeDistanceEnabled) {
        this._renderRelativeDistance(segments, validSegmentIndex, canvas, renderer);
    } else if (flags.isAbosoluteMarginEnabled) {
        this._renderAbosoluteDistance(segments, validSegmentIndex, boundries, canvas, renderer);
    }
    
}

MyFloor.prototype.getIntersectPoints = function(edges) {
    var intersects = [];
    for (var i = 0; i < edges.length; i++) {
        for (var j = 0; j < this.mCurves.length; j++) {
            if(!this.mCurves[j].isBoundry) {
                if (this.mCurves[j] instanceof SegmentController) {
                    var edge = this.mCurves[j].getTheStartEndEdge();
                    
                    if (this.mCurves[j].containsPoint(edges[i].mStart)) {
                        intersects.push(edges[i].mStart.clone());
                    }
                    if (this.mCurves[j].containsPoint(edges[i].mEnd)) {
                        intersects.push(edges[i].mEnd.clone());
                    }
                    
                    if (edges[i].pointInEdge(edge.mStart)) {
                        intersects.push(edge.mStart.clone());
                    }
                    if (edges[i].pointInEdge(edge.mEnd)) {
                        intersects.push(edge.mEnd.clone());
                    }
                }
                
                SegmentController.isIntersectWith(edges[i], this.mCurves[j], intersects);
            }
        }
    }
    
    var valid = [];
    
    for (var i = 0; i < intersects.length; i++) {
        var isSame = false;
        for (var j = 0; j < valid.length; j++) {
            if (intersects[i].equals(valid[j])) {
                isSame = true;
                break;
            }
        }
        if (!isSame) {
            valid.push(intersects[i]);
        }
        
    }
    
    
    return valid;
}





















