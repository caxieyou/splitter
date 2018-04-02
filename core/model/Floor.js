function HeightRecord() {
    this.parts = [];//二维数组
    this.corners = [];
    this.height = 0; //一维数组
}

function Floor() {
    this.mAreas;
    this.mOutput;
    this.mAreasPolytree;
    this.mAreasControllers;

    this.mElements;
    this.mCorners;
    this.mHoles;
    this.mProfile;
    
    this.mHeightRecord;

    this.mPickedIndex;
    this.mPickedDirection;
    
    this.mKeyPoints;

    this.initialize();
}

Floor.ANALYSIS_INIT   = 0; //初始化
Floor.ANALYSIS_CREATE = 1; //创建
Floor.ANALYSIS_SPLIT  = 2; //分割
Floor.ANALYSIS_CHANGE = 3; //改变性质
Floor.ANALYSIS_DELETE = 4; //删除
Floor.ANALYSIS_UPDATE = 5; //移动更新

Floor.prototype.initialize = function() {
    this.mAreas = [];
    this.mElements = [];
    this.mCorners = [];
    this.mHoles = [];
    this.mProfile = null;
    this.mAreasPolytree = null;
    this.mAreasControllers = [];
    this.mPickedIndex = -1;
    this.mPickedDirection = false;
    this.mHeightRecord = [];
    this.mKeyPoints = [];
}

Floor.prototype.setProfile = function(rect) {
    this.mProfile = new Polytree();
    this.mProfile.mOutLines = rect;
    this.mProfile.mHoles = [];
    this.mOutput = null;
}

Floor.prototype.generatePolyTree = function()
{
    return this.mProfile;
}


Floor.prototype.getTheBiggestAreaPath = function()
{
    var pathFinder = new AuxiliarySort(this.mElements);
    var paths = pathFinder.getPaths();
    var counterClockPaths = Path.getCountClockWisePath(paths);
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
   
Floor.prototype.correctAreas = function()
{
    var _loc2_ = null;
    var _loc3_ = null;
    var _loc1_ = Auxiliary.getHoleParts(this.mAreas);
    this.mHoles = [];
    
    for (var i = 0; i < _loc1_.length; i++)
    {
        this.mHoles.push(_loc1_[i]);
        
        for (var j = 0; j < _loc1_[i].mElements.length; j++)
        {
            _loc3_ = _loc1_[i].mElements[j];
            _loc3_.wallDleleteSame(_loc1_[i]);
        }
    }
    MyArray.deleteSameValues(this.mAreas,_loc1_);
}

Floor.prototype.addElement = function(param1)
{
    var _loc2_ = MyArray.ifHasAndSave(this.mElements,param1);
    if(_loc2_)
    {
        param1.mFloor = this;
    }
    return _loc2_;
}

Floor.prototype.addCorner = function(param1)
{
    if(param1 == null)
    {
        return false;
    }
    var _loc2_ = MyArray.ifHasAndSave(this.mCorners,param1);
    if(_loc2_)
    {
        param1.mFloor = this;
    }
    return _loc2_;
}

Floor.prototype.removeCorner = function(param1)
{
    return MyArray.removeItem(this.mCorners,param1);
}

Floor.prototype.removeElement = function(param1)
{
    return MyArray.removeItem(this.mElements, param1);
}

Floor.prototype.clearPickedArea = function() {
    this.mPickedIndex = -1;
}

Floor.prototype.getPickedArea = function(x, y) {
    if (x == undefined) {
        return this.mPickedIndex != -1;
    }
    this.mPickedIndex = -1;
    //this.mPickedArea = null;
    for (var i = 0; i < this.mAreasPolytree.length; i++) {
        if (this.mAreasPolytree[i].contains(new Vec2(x, y))) {
            this.mPickedIndex = i;
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
Floor.prototype.setAreaHeight = function(sign, val) {
    if (this.mPickedIndex == -1) {
        return;
    }
    
    this.mHeightRecord[this.mPickedIndex].height = sign * val;
    this.Analysis(Floor.ANALYSIS_UPDATE);
}

Floor.prototype.setAreaName = function(name) {
    if (this.mPickedIndex == -1) {
        return;
    }
}

Floor.prototype.getAreaHeight = function() {
    return this.mHeightRecord[this.mPickedIndex].height;
}

Floor.prototype.getAreaName = function() {
    return "";
}

Floor.prototype.checkOverlap = function()  {
    var overlapped = false;
    for (var i = 0; i < this.mElements.length; i++) {
        for (var j = i+1; j < this.mElements.length; j++) {
            var curve0 = this.mElements[i];
            var curve1 = this.mElements[j];
            
            if (curve0.isIntersectWith(curve1)) {
                overlapped = true;
                break;
            }
            var e = null;
            var c = null;
            if (curve0 instanceof Segment && curve1 instanceof Arc) {
                e = curve0.getTheStartEndEdge();
                c = curve1.getCurve();
            }
            
            if (curve0 instanceof Arc && curve1 instanceof Segment) {
                e = curve1.getTheStartEndEdge();
                c = curve0.getCurve();
            }
            
            if (e && c) {
                var p0 = c.getPointByRatio(0);
                var p1 = c.getPointByRatio(1);
                
                if (e.pointInEdgeOrOnEdge(p0) || e.pointInEdgeOrOnEdge(p1)) {
                    overlapped = true;
                    break;
                }
            }
            
        }
    }
    return overlapped;
}

Floor.prototype._updateGeoStructure = function() {
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
                holesList[i].push(areas[j]);
            }
        }
    }

    for (var i = 0; i < holesList.length; i++) {
        var holes = holesList[i];
        
        if (holes.length > 1) {
            holes.sort(function(a, b){
                return a.getAbsArea() - b.getAbsArea();
            });
            
            var tmp = [];
            
            for (var m = 0; m < holes.length; m++) {
                var skip = false;
                for (var n = m+1; n < holes.length;n++) {
                    if (holes[n].isIncludedArea(holes[m])) {
                        skip = true;
                        break;
                    }
                }
                if (!skip) {
                    tmp.push(holes[m]);
                }
            }
            
            holesList[i] = tmp;
        }
    }
    
    this.mOutput = [];
    this.mAreasPolytree = [];
    this.mAreasControllers = [];
    
    var polyTree = null;
    for (var i = 0; i < areas.length; i++) {
        var res = Area.outputStructures(areas[i], holesList[i]);
        //inner geom structure
        var res2 = Area.outputStructures2(areas[i], holesList[i]);
        //inner controllers' info
        var res3 = Area.outputStructures3(areas[i], holesList[i]);
        
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
    
    for (var i = 0; i < this.mOutput.length; i++) {
        var output = this.mOutput[i].mOutline.edges;
        
        output = this._removeInvalid(output);
        var valid = [];
        for (var j =  0; j < output.length; j++) {
            valid.push(true);
        }
        var summary = [];
        
        while(true) {
            var r = this._reconnect(output, valid);
            if (r == null) {
                break;
            }else {
                summary.push(r);
            }
        }
        
        if (summary.length > 0) {
            this.mOutput[i].mOutline.edges = summary[0];
        }
        
        for (var m = 1; m < summary.length; m++) {
            this.mOutput[i].mHoles.push({edges : summary[m]});
        }
    }
    
    this.mKeyPoints = [];
    for (var i = 0; i < this.mAreasPolytree.length; i++) {
        var point =  this.mAreasPolytree[i].getValidGravityCenter();
        if (this.mAreasPolytree[i].contains(point)) {
            this.mKeyPoints.push(point);
        }
    }

    for (var i = 0; i < this.mElements.length; i++) {
        if (!this.mElements[i].isBoundry) {
            this.mKeyPoints.push(this.mElements[i].getCenter());
        }
    }
    
    for (var i = 0; i < this.mOutput.length; i++) {
        this.mOutput[i].mHeight = this.mHeightRecord[i].height;
    }
};

Floor.prototype.dump = function() {
    
    var res = {
        areas : new Array(this.mOutput.length),
        profile: [],
        geoms : []
    }
    
    for (var i = 0; i < this.mOutput.length; i++) {
        res.areas[i] = this.mOutput[i].clone();
    }
    
    for(var i = 0; i < this.mProfile.mOutLines.mVertices.length; i++) {
        res.profile.push(this.mProfile.mOutLines.mVertices[i].clone());
    }
    
    for(var i = 0; i < this.mElements.length; i++) {
        if (!this.mElements[i].isBoundry) {
            res.geoms.push(this.mElements[i].getGeom());
        }
    }
    
    return res;
};

Floor.prototype.transferJsonToGeom = function(data) {
    var res = {
        geoms   : [],
        profile : [],
        points  : [],
        heights : []
    };
    
    for (var i = 0; i < data.areas.length; i++) {
        var edges = data.areas[i].mOutline.edges;
        
        var points = [];
        for (var j = 0; j < edges.length; j++) {
            var isRepeat = false;
            for (var m = 0; m < points.length; m++) {
                if (MyNumber.isEqual(points[m].mX, edges[j].mStart.mX) && MyNumber.isEqual(points[m].mY, edges[j].mStart.mY)) {
                    isRepeat = true;
                    break;
                }
            }
            
            if (!isRepeat) {
                points.push(new Vec2(edges[j].mStart.mX, edges[j].mStart.mY));
            }
            
            isRepeat = false;
            for (var m = 0; m < points.length; m++) {
                if (MyNumber.isEqual(points[m].mX, edges[j].mEnd.mX) && MyNumber.isEqual(points[m].mY, edges[j].mEnd.mY)) {
                    isRepeat = true;
                    break;
                }
            }
            
            if (!isRepeat) {
                points.push(new Vec2(edges[j].mEnd.mX, edges[j].mEnd.mY));
            }
        }
        res.heights.push(data.areas[i].mHeight);
        res.points.push(points);
    }
    
    
    for (var i = 0; i < data.geoms.length; i++) {
        var geom = data.geoms[i];
        
        if (geom.mStart) {
            res.geoms.push(new Edge(new Vec2(geom.mStart.mX, geom.mStart.mY), new Vec2(geom.mEnd.mX, geom.mEnd.mY)));
        } else {
            res.geoms.push(new Curve(new Vec2(geom.mCenter.mX, geom.mCenter.mY), geom.mRadius, geom.mStartAngle, geom.mArcAngle));
        }
        
    }
    
    for (var i = 0; i < data.profile.length; i++) {
        res.profile.push(new Vec2(data.profile[i].mX, data.profile[i].mY));
    }
    
    return res;
};

Floor.prototype._removeInvalid = function(output, pass) {
    var sameCountStart = new Array(output.length);
    var sameCountEnd = new Array(output.length);
        
    for (var j = 0; j < output.length; j++) {
        var cur = output[j];
        var curStart  = cur.mStart ? cur.mStart : cur.getPointByRatio(0);
        var curEnd    = cur.mEnd ? cur.mEnd : cur.getPointByRatio(1);
        sameCountStart[j] = 1;
        sameCountEnd[j] = 1;
        for (var m = 0; m < output.length; m++) {
            if (j == m) {
                continue;
            }
            var com = output[m];
            var comStart  = com.mStart ? com.mStart : com.getPointByRatio(0);
            var comEnd    = com.mEnd ? com.mEnd : com.getPointByRatio(1);
        
            if (curStart.equals(comStart) || curStart.equals(comEnd)) {
                sameCountStart[j]++;
            } 
            
            if (curEnd.equals(comStart) || curEnd.equals(comEnd)) {
                sameCountEnd[j]++;
            }
        }
    }
    var validArray = [];
    valid = true;
    for (var i = 0; i < output.length; i++) {
        if (sameCountStart[i] == 1 || sameCountEnd[i] == 1) {
            valid = false;
        } else if (!pass && sameCountStart[i] == 3 || sameCountEnd[i] == 3) {
            valid = false;
            validArray.push(output[i]);
            for (var j = i + 2; j < output.length; j++) {
                validArray.push(output[j]);
            }
            return this._removeInvalid(validArray, true); 
        } else {
            validArray.push(output[i]);
        }
    }
    if (valid) {
        return validArray;
    } else {
        return this._removeInvalid(validArray, pass);
    }
};

Floor.prototype._reconnect = function(output, valid) {
    
    var ret  = [];
    
    var index = -1;
    for (var i = 0; i < output.length; i++) {
        if (valid[i]) {
            index = i;
            break;
        }
    }
    if (index == -1) {
        return null;
    }
    
    var curStart  = output[index].mStart ? output[index].mStart : output[index].getPointByRatio(0);
    var curEnd    = output[index].mEnd ? output[index].mEnd : output[index].getPointByRatio(1);
    valid[index] = false;
    ret.push(output[index]);
    
    index = (index + 1) % output.length;
    while(true) {
        var edge = output[index];
        var edgeStart  = edge.mStart ? edge.mStart : edge.getPointByRatio(0);
        var edgeEnd    = edge.mEnd ? edge.mEnd : edge.getPointByRatio(1);
        if (curEnd.equals(edgeStart)) {
            curEnd = edgeEnd;
            valid[index] = false;
            ret.push(edge);
            if (curStart.equals(edgeEnd)) {
                break;
            }
        } else if (curEnd.equals(edgeEnd)) {
            curEnd = edgeStart;
            valid[index] = false;
            ret.push(edge);
            if (curStart.equals(edgeStart)) {
                break;
            }
        }
        index++;
        if (index == output.length) {
            index = 0;
        }
    }
    return ret;
};

Floor.prototype.Analysis = function(mode) {
    
    for (var i = 0; i < this.mCorners.length; i++) {
        
        var top = this.mCorners[i];
        
        if (!top.isBoundryCorner()) {
            continue;
        }
        
        var _loc2_ = null;
        var _loc3_ = null;
        var _loc4_ = null;
        var _loc5_ = null;
        var _loc1_ = this.mCorners[i].mElements;
        
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

    var analysis = new Analysis(this);
    analysis.execute();
/////////////////////////////////////////////////////////////////////////
    //current data: 
    var currentRecord = [];
    
    var getCorners = function(segments) {
        var c = [];
        for (var j = 0; j < segments.length; j++) {
            var corners = segments[j].toCorners();
            
            var isRepeat = false;
            
            for (var m = 0; m < c.length; m++) {
                if (c[m].mId == corners[0].mId) {
                    isRepeat = true;
                    break;
                }
            }
            if (!isRepeat) {
                c.push(corners[0]);
            }
            
            isRepeat = false;
            for (var m = 0; m < c.length; m++) {
                if (c[m].mId == corners[1].mId) {
                    isRepeat = true;
                    break;
                }
            }
            if (!isRepeat) {
                c.push(corners[1]);
            }
        }
        return c;
    }
    for (var i = 0; i < this.mAreas.length; i++) {
        var r = new HeightRecord();
        r.parts = this.mAreas[i].mElements;
        r.corners = getCorners(r.parts);
        currentRecord.push(r);
    }

    switch (mode) {
        case Floor.ANALYSIS_INIT: 
            this.mHeightRecord = currentRecord;
        break;

        case Floor.ANALYSIS_CREATE: 
        case Floor.ANALYSIS_SPLIT: 
        case Floor.ANALYSIS_CHANGE:
        case Floor.ANALYSIS_DELETE: 
        case Floor.ANALYSIS_UPDATE: 
            this._heightCreate(currentRecord);
        break;
/*
        case Floor.ANALYSIS_SPLIT: 
            
        break;
        case Floor.ANALYSIS_CHANGE: 
            
        break;

        case Floor.ANALYSIS_DELETE: 
            
        break;

        case Floor.ANALYSIS_UPDATE: 
            
        break;
*/
    }
////////////////////////////////////////////////////////////////

    this._updateGeoStructure();



    
}

Floor.prototype._heightCreate = function(record) {

    for (var i = 0; i < this.mHeightRecord.length; i++) {
        var corners0 = this.mHeightRecord[i].corners;

        var _max = -1;
        var _idx = -1;
        for (var j = 0; j < record.length; j++) {
            var corners1 = record[j].corners;

            var s = 0;
            for (var m = 0; m < corners0.length; m++) {
                for (var n = 0; n < corners1.length; n++) {
                    if (corners0[m].mId == corners1[n].mId) {
                        s++;
                        break;
                    }
                }
            }

            if (s > _max) {
                _max = s;
                _idx = j;
            }

        }
        record[_idx].height = this.mHeightRecord[i].height;
    }
    this.mHeightRecord = record;
}

Floor.prototype.matchHeight = function(points, heights) {
    for (var i = 0; i < this.mHeightRecord.length; i++) {
        var corners0 = this.mHeightRecord[i].corners;

        var _max = -1;
        var _idx = -1;
        for (var j = 0; j < points.length; j++) {
            var corners1 = points[j];

            var s = 0;
            for (var m = 0; m < corners0.length; m++) {
                for (var n = 0; n < corners1.length; n++) {
                    if (Vec2.isEqual(corners0[m].mPosition, corners1[n])) {
                        s++;
                        break;
                    }
                }
            }

            if (s > _max) {
                _max = s;
                _idx = j;
            }

        }
        this.mHeightRecord[i].height = heights[_idx];
    }
}



Floor.prototype.updatePosition = function(sub, newPos) {
    var lastRecord = null;
    if (sub instanceof Array) {
        lastRecord = [];
        for (var i = 0; i < sub.length; i++) {
            lastRecord.push(sub[i].getLast());
        }
        
        for (var i = 0; i < sub.length; i++) {
            illegal = sub[i].updatePosition(newPos[i].mX, newPos[i].mY);
            if (illegal) {
                break;
            }
        }
    } else {
        lastRecord = sub.getLast();
        illegal = sub.updatePosition(newPos.mX, newPos.mY);
    }

    this.Analysis(Floor.ANALYSIS_UPDATE);

    var overlapped = illegal || this.checkOverlap();
    
    if (overlapped) {
        if (sub instanceof Array) {
            for (var i = 0; i < sub.length; i++) {
                sub[i].revertUpdatePosition(lastRecord[i]);
            }
        } else {
            sub.revertUpdatePosition(lastRecord);
        }
        this.Analysis(Floor.ANALYSIS_UPDATE);
    }

    this.clearPickedArea();
    
    return overlapped;
}

Floor.prototype._seperateType = function() {
    var curves = [];
    var segments = [];
    var boundries = [];
    var validSegmentIndex = [];
    var validCurveIndex = [];
    var pickedArea = this.mOutput[this.mPickedIndex];// this.mPickedArea;
    for (var i = 0; i < this.mElements.length; i++) {
        if (this.mElements[i].isBoundry) {
            boundries.push(this.mElements[i]);
        } else if (this.mElements[i] instanceof Segment) {
            var seg = this.mElements[i];
            segments.push(seg);
            
            if (pickedArea) {
                for (var j = 0; j < pickedArea.mOutline.edges.length; j++) {
                    var edge = pickedArea.mOutline.edges[j];
                    if (edge instanceof Edge && edge.isSameAsEdgeStartOrEnd(seg.mStart.mPosition) && edge.isSameAsEdgeStartOrEnd(seg.mEnd.mPosition)) {
                        validSegmentIndex.push(segments.length - 1);
                    }
                }
                for (var k = 0; k < pickedArea.mHoles.length; k++) {
                    var poly = pickedArea.mHoles[k];
                    for (var j = 0; j < poly.edges.length; j++) {
                        var edge = poly.edges[j];
                        if (edge instanceof Edge  && edge.isSameAsEdgeStartOrEnd(seg.mStart.mPosition) && edge.isSameAsEdgeStartOrEnd(seg.mEnd.mPosition)) {
                            validSegmentIndex.push(segments.length - 1);
                        }
                    }
                }
            }
        } else if (this.mElements[i] instanceof Arc) {
            curves.push(this.mElements[i]);
            if (pickedArea) {
                var cur = this.mElements[i].getCurve();
                for (var j = 0; j < pickedArea.mOutline.edges.length; j++) {
                    var edge = pickedArea.mOutline.edges[j];
                    if (edge instanceof Curve && Curve.isSameCurve(cur, edge)) {
                        validCurveIndex.push(curves.length - 1);
                    }
                }
                
                
                for (var k = 0; k < pickedArea.mHoles.length; k++) {
                    var poly = pickedArea.mHoles[k];
                    for (var j = 0; j < poly.edges.length; j++) {
                        var edge = poly.edges[j];
                        if (edge instanceof Curve && Curve.isSameCurve(cur, edge)) {
                            validCurveIndex.push(curves.length - 1);
                        }
                    }
                }
            }
        }
    }
    return [curves, segments, boundries, validSegmentIndex, validCurveIndex];
}
Floor.prototype.renderPickedArea = function(renderer) {
    if (this.mPickedIndex == -1/*!this.mPickedArea*/) {
        return;
    }
    
    renderer.drawArea(this.mOutput[this.mPickedIndex]);
    this.renderOutput(renderer);
    renderer.drawAreaDots(this.mAreasControllers[this.mPickedIndex]);
}

Floor.prototype.renderAlignment = function(renderer, segment) {
    if (!segment || segment instanceof Corner) {
        return;
    }
    for (var i = 0; i < this.mElements.length; i++) {
        var seg = this.mElements[i];
        if (seg instanceof Segment && segment.mId != seg.mId) {
            if (MyNumber.isEqual(seg.mStart.mPosition.mX, seg.mEnd.mPosition.mX)          &&
                MyNumber.isEqual(segment.mStart.mPosition.mX, segment.mEnd.mPosition.mX)  &&
                MyNumber.isEqual(segment.mStart.mPosition.mX, seg.mStart.mPosition.mX)){
                    renderer.drawLine(seg.getTheStartEndEdge(), false, null, true);
            }
            if (MyNumber.isEqual(seg.mStart.mPosition.mY, seg.mEnd.mPosition.mY)          &&
                MyNumber.isEqual(segment.mStart.mPosition.mY, segment.mEnd.mPosition.mY)  &&
                MyNumber.isEqual(segment.mStart.mPosition.mY, seg.mStart.mPosition.mY)) {
                    renderer.drawLine(seg.getTheStartEndEdge(), false, null, true);
            }
        }
    }
}

Floor.prototype.renderOutput = function(renderer) {
    if (this.mOutput == null) {
        return;
    }
    
    for (var i = 0; i < this.mAreasControllers.length; i++) {
        var height = this.mHeightRecord[i].height;
        if (height == 0) {
            renderer.drawOutput(this.mAreasControllers[i]);
        } else {
            height = Math.max(Math.min(1, height), 10);
            renderer.enterShadow(height);
            renderer.drawOutput(this.mAreasControllers[i]);
            renderer.exitShadow();
        }
    }

    if (this.mPickedIndex != -1) {
        renderer.drawOutput(this.mAreasControllers[this.mPickedIndex], true);
    }
}

//画内部标注线
Floor.prototype._renderZoneSize = function(segments, validIndex, renderer) {
    for (var i = 0; i < segments.length; i++) {
        var segment = segments[i];
        var edge = segment.getTheStartEndEdge();
        var start = edge.mStart.clone();
        var end = edge.mEnd.clone();
        var center = edge.getCenter();
        var area = segment.mAreas[segment.mAreas.length - 1];
        var angle = edge.getAngle();
        angle = angle + Math.PI / 2;
        var offset = 10 / Globals.Scale;
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
Floor.prototype._renderCurveHeight = function(curves, validCurveIndex, canvas, renderer) {
    for (var i = 0; i < curves.length; i++) {
        var pt0 = curves[i].getCenter();
        var pt1 = curves[i].getTheStartEndEdge().getCenter();
        
        if (validCurveIndex.indexOf(i) > -1) {
            renderer.drawDimensions({x: pt0.mX,y: pt0.mY}, {x: pt1.mX,y: pt1.mY}, null, true, 
            Utility.DrawCurveHeightCallback, canvas, curves[i]);
        }
    }
}
Floor.prototype._isWithinSameArea = function(seg0, seg1) {
    var segments = this.mAreasControllers[this.mPickedIndex];
    var s0 = false;
    var s1 = false;
    for (var i = 0; i < segments.length; i++) {
        if(seg0.mId == segments[i].mId) {
            s0 = true;
        }
        if(seg1.mId == segments[i].mId) {
            s1 = true;
        }
    }

    if (s0 && s1) {
        return true;
    } else {
        return false;
    }
}

Floor.prototype._renderRelativeDistance = function(segments, validIndex, canvas, renderer) {
    
    for (var k = 0; k < validIndex.length; k++) {
        var i = validIndex[k];
        var segmentObj = segments[i];
        var edgeObj = segmentObj.getTheStartEndEdge();
        var angleObj = edgeObj.getAngle();
        
        var isHorizontalObj = Angle.isHorizontal(angleObj);
        var isVerticalObj = Angle.isVertical(angleObj);
        
        for (var j = 0; j < segments.length; j++) {
            
            var segmentSbj = segments[j];
            if (segmentSbj.mId == segmentObj.mId) {
                continue;
            }
            
            var edgeSbj = segmentSbj.getTheStartEndEdge();
            var angleSbj = edgeSbj.getAngle();
            
            var isHorizontalSbj = Angle.isHorizontal(angleSbj);
            var isVerticalObSbj = Angle.isVertical(angleSbj);
            
            var maxDis = -Number.MAX_VALUE;
            var sign = 0;
            var center;
            var markLine = new Edge(new Vec2(), new Vec2());
            if (!this._isWithinSameArea(segmentObj,segmentSbj)) {
                var direction = -1;
                
                if (isHorizontalObj && isHorizontalSbj && Edge.getValidHorizontalSection(edgeObj, edgeSbj, markLine)) {
                    direction = 0;
                }
                
                if (isVerticalObj && isVerticalObSbj && Edge.getValidVerticalSection(edgeObj, edgeSbj, markLine)) {
                    direction = 1;
                }
                
                if (direction > -1) {
                    var valid = true;
                    
                    for (var m = 0; m < this.mElements.length; m++) {
                        if (this.mElements[m] instanceof Arc) {
                            continue;
                        }
                        var intersects = [];
                        if (Segment.isIntersectWith(markLine, this.mElements[m], intersects)) {
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
                            
                        if (validIndex.indexOf(i) > -1 && validIndex.indexOf(j) == -1) {
                            var arcValid_i = true;
                            
                            var corners = segments[i].toCorners();
                            for (var n = 0; n < corners.length; n++) {
                                var corner = corners[n];
                                for (var p = 0; p < corner.mElements.length; p++) {
                                    if (corner.mElements[p] instanceof Arc) {
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

Floor.prototype._renderAbosoluteDistance = function(segments, validIndex, boundries , canvas, renderer) {
    for (var q = 0; q < validIndex.length; q++) {
        var i = validIndex[q];
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
            var markLine = new Edge(new Vec2(), new Vec2());
            if (!this._isWithinSameArea(segmentObj,segmentSbj)) {
                var direction = -1;
                
                if (isHorizontalObj && isHorizontalSbj && Edge.getValidHorizontalSection(edgeObj, edgeSbj, markLine)) {
                    direction = 0;
                }
                
                if (isVerticalObj && isVerticalObSbj && Edge.getValidVerticalSection(edgeObj, edgeSbj, markLine)) {
                    direction = 1;
                }
                
                if (direction > -1) {
                    if (direction == 0) {
                        markLine.mEnd.mY = boundries[j].mStart.mPosition.mY;
                    } else {
                        markLine.mEnd.mX = boundries[j].mStart.mPosition.mX;
                    }
                    var valid = true;
                    for (var m = 0; m < this.mElements.length; m++) {
                        if (this.mElements[m] instanceof Arc) {
                            continue;
                        }
                        var intersects = [];
                        if (Segment.isIntersectWith(markLine, this.mElements[m], intersects)) {
                            if (intersects.length > 0 && !Vec2.isEqual(intersects[0], markLine.mEnd) && this._isWithinSameArea(segments[i],this.mElements[m]))
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
                    
                    if (maxDis > -Number.MAX_VALUE) {
                        renderer.drawDimensions({x: center.mX,y: center.mY}, {x: center.mX - direction * sign * maxDis, y: center.mY - (1- direction) * sign * maxDis}, null, true,
                        Utility.DrawDimensionCallback, canvas, segments[i], null, sign * maxDis, direction);
                    }
                }
            }
        }
    }
}


Floor.prototype._renderBoundryLines = function(segments, renderer) {
    for (var i = 0; i < segments.length; i++) {
        var segment = segments[i];
        var edge = segment.getTheStartEndEdge();
        var start = edge.mStart.clone();
        var end = edge.mEnd.clone();
        var center = edge.getCenter();
        var area = segment.mAreas[segment.mAreas.length - 1];
        var angle = edge.getAngle();
        angle = angle + Math.PI / 2;
        var offset = 15 / Globals.Scale;
        var offvec = new Vec2(offset * Math.cos(angle), offset * Math.sin(angle));
        center.addBy(offvec);
        
        if (area.containsPoint(center)) {
            start.sub(offvec);
            end.sub(offvec);
            
        } else {
            start.addBy(offvec);
            end.addBy(offvec);
        }
        renderer.drawDimensions({x: start.mX,y: start.mY}, {x: end.mX,y: end.mY});
    }
}

Floor.prototype.renderMarkerLines = function(flags, renderer, canvas)  {
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
    
    this._renderBoundryLines(boundries, renderer);
}


Floor.prototype.getIntersectPoints = function(edges) {
    var intersects = [];
    for (var i = 0; i < edges.length; i++) {
        for (var j = 0; j < this.mElements.length; j++) {
            if(!this.mElements[j].isBoundry) {
                if (this.mElements[j] instanceof Segment) {
                    var edge = this.mElements[j].getTheStartEndEdge();
                    
                    if (this.mElements[j].containsPoint(edges[i].mStart)) {
                        intersects.push(edges[i].mStart.clone());
                    }
                    if (this.mElements[j].containsPoint(edges[i].mEnd)) {
                        intersects.push(edges[i].mEnd.clone());
                    }
                    
                    if (edges[i].pointInEdge(edge.mStart)) {
                        intersects.push(edge.mStart.clone());
                    }
                    if (edges[i].pointInEdge(edge.mEnd)) {
                        intersects.push(edge.mEnd.clone());
                    }
                }
                
                Segment.isIntersectWith(edges[i], this.mElements[j], intersects);
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





















