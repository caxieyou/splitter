var STATUS = {
    NOT_STARTED   : -1,
    SET_START     :  0,
    DRAWING       :  1,
    LINE_START    :  2,
    LINE_DRAWING  :  3
}

function Canvas(name) {
    this._mFloor = new MyFloor();
    this._mWallCurveOperation = new WallCurveOperation(this._mFloor);
    this._renderer = new Renderer();
    this._canvas = document.getElementById(name);
    this._renderer.init(this._canvas);
    this._outputResult = null;
    this._innerResult = null;
    this._currentStatus = STATUS.NOT_STARTED;
    this._type = null;
    this._mEdge = new MyEdge(new Vec2(), new Vec2());
    this._focus = null;
    this._updateElment = null;
    this._operationCurve = null; 
    this._hintPoints = [];
    this._flags = {
       isRelativeDistanceEnabled : false,
       isAbosoluteMarginEnabled : true,
       isZoneSizeEnabled : true,
       isCrownHeightEnabled : false
    };
    this._mouseDown = new Vec2();
    this._mouseUp = new Vec2();
    this._linePoints = [];
    this._lineEdges = [];
    this._linePoint = new Vec2();
    this._curentLine0 = null;
    this._curentLine1 = null;
    this._lineIntersect = {
        isStartIntersect : [],
        isSelfIntersect: [],
        isStartEndSame : [],
        isEndIntersect : []
    };
   this._pickedArea = null;
   this._initialize();
   
}

Canvas.prototype._initialize = function() {
    //创建最外边框
    this.createRect(new Vec2(0, 0), new Vec2(this._canvas.width, this._canvas.height));
    
    //赋值最外轮廓线
    var rect = new MyRect(new Vec2(0, 0), new Vec2(this._canvas.width, this._canvas.height));
    rect = rect.toMyPolygon();
    
    this._mFloor.setProfile(rect);
    
    //渲染
    this.render(0, 0);
}

Canvas.prototype._renderCurrentObject = function() {
    if (!(this._currentStatus == STATUS.DRAWING || 
        this._currentStatus == STATUS.LINE_START || 
        this._currentStatus == STATUS.LINE_DRAWING)) {
        return;
    }
    
    switch(this._type) {
        case TYPE.RECTANGLE:
        {
            
            var edges = [];
            edges.push(new MyEdge(new Vec2(this._mEdge.mStart.mX, this._mEdge.mStart.mY), new Vec2(this._mEdge.mEnd.mX,   this._mEdge.mStart.mY)));
            edges.push(new MyEdge(new Vec2(this._mEdge.mEnd.mX,   this._mEdge.mStart.mY), new Vec2(this._mEdge.mEnd.mX,   this._mEdge.mEnd.mY)));
            edges.push(new MyEdge(new Vec2(this._mEdge.mEnd.mX,   this._mEdge.mEnd.mY),   new Vec2(this._mEdge.mStart.mX, this._mEdge.mEnd.mY)));
            edges.push(new MyEdge(new Vec2(this._mEdge.mStart.mX, this._mEdge.mEnd.mY),   new Vec2(this._mEdge.mStart.mX, this._mEdge.mStart.mY)));
            
            intersects = [];
            for (var i = 0; i < edges.length; i++) {
                for (var j = 0; j < this._mFloor.mCurves.length; j++) {
                    if(!this._mFloor.mCurves[j].isBoundry) {
                        SegmentController.isIntersectWith(edges[i], this._mFloor.mCurves[j], intersects);
                    }
                }
            }
            
            for (var i = 0; i < intersects.length; i++) {
                this._hintPoints.push(intersects[i]);
            }
            
            this._renderer.drawRect(this._mEdge);
        }
        break;
        case TYPE.CIRCLE:
            this._renderer.drawCircle(this._mEdge);
        break;
        case TYPE.LINE:
        {
            for (var i = 0; i < this._lineEdges.length; i++) {
                for (var j = 0; j < this._lineEdges[i].length; j++) {
                    this._renderer.drawLine(this._lineEdges[i][j]);
                }
                
                //console.log(this._lineEdges);
            }
            
            if (this._currentStatus == STATUS.LINE_DRAWING) {
                if (this._curentLine0) {
                    this._renderer.drawLine(this._curentLine0, true);
                }
                if (this._curentLine1) {
                    this._renderer.drawLine(this._curentLine1, true, 'red');
                }
            }
            
            
        }
            //this.renderLines.drawCircle(this._mEdge);
        break;
    }
}

Canvas.prototype.split = function(polygon) {
    var splitter = new Splitter(polygon, this._mFloor, this._mFloor.generatePolyTree());
    splitter.execute();
    var analysis = new Analysis(this._mFloor);
    analysis.execute();
    /*
    var single = [];
    for (var i = 0; i < this._mFloor.mCurves.length; i++) {
        if (this._mFloor.mCurves[i].mStart.mCurves.length < 2 || this._mFloor.mCurves[i].mEnd.mCurves.length < 2) {
            single.push(this._mFloor.mCurves[i]);
            //this._mWallCurveOperation.onDelete(this._mFloor.mCurves[i]);
        }
    }
    if (single.length > 0) {
        for (var i = 0; i < single.length; i++) {
            single[i].dispose();
        }
        var analysis = new Analysis(this._mFloor);
        analysis.execute();
    }
    */
    [this._outputResult,  this._innerResult] = Converter.outputGeo(this._mFloor);
    
}

Canvas.prototype.createRect = function(pnt0, pnt1) {
    pnt0 = pnt0 || this._mEdge.mStart;
    pnt1 = pnt1 || this._mEdge.mEnd;
    
    var rect = new MyRect(pnt0, pnt1);
    var polyEdges = rect.toMyPolygon().getEdges();
    //edges = subject.getEdges();
    
    for (var i = 0; i < polyEdges.length; i++) {
        //var edge = polyEdges[i];
        for (var j = 0; j < this._mFloor.mCurves.length; j++) {
            var curve = this._mFloor.mCurves[j];
            if (curve.isBoundry || curve instanceof CurveController) {
                continue;
            }
            curve = curve.getTheStartEndEdge();
            
            polyEdges[i] = MyEdge.getDiff(polyEdges[i], curve);
        }
    }
    
    var res = [];
    for (var i = 0; i < polyEdges.length; i++) {
        if (polyEdges[i]) {
            res.push(polyEdges[i]);
        }
    }
    if (res.length > 0) {
        this.split(res);
    }
}

Canvas.prototype.creatCircle = function() {
    var circle = new MyCircle(this._mEdge.mStart.clone(), this._mEdge.getLength());
    this.split(circle);
}

Canvas.prototype.setType = function(type) {
    this._type = type;
    
    if (this._type == TYPE.LINE) {
        this._currentStatus = STATUS.LINE_START;
    }
    if (this._type == null) {
        
        document.body.style.cursor = "default";
        
        
    } else {
        document.body.style.cursor = "crosshair";
    }
    this._pickedArea = null;
    this.render();
}

Canvas.prototype.setStartPoint = function(x, y) {
    if (this._type == null) {
        return false;
    }
    
    var hintPoints = [];
    var minDis = Number.MAX_VALUE;
    var index = -1;
    var minPoint;
    //Do the snapping
    for (var i = 0; i < this._mFloor.mCurves.length; i++) {
        var curve = this._mFloor.mCurves[i];
        var edge;
        if (curve instanceof SegmentController) {
            edge = curve.getTheStartEndEdge();
        } else {
            edge = curve.getCurveFromController();
        }
        
        if (!curve.isBoundry) {
            
            var point = edge.getIntersectionPointByPoint(new Vec2(x, y), true);
            hintPoints.push(point);
        }
    }
    
    for (var i = 0; i < hintPoints.length; i++) {
        var dis = Vec2.distance(new Vec2(x, y), hintPoints[i]);
        if (dis < minDis) {
            minDis = dis;
            index = i;
            minPoint = hintPoints[i];
        }
    }
    //console.log(minDis);
    if (minDis < 3) {
        this._hintPoints.push(minPoint);
        
        x = minPoint.mX;
        y = minPoint.mY;
    }
    
    if (!this._mFloor.mProfile.mOutLines.contains(new Vec2(x, y))) {
        console.log("START POINT OUTSIDE OF ROOM!");
        return;
    }
    if (this._currentStatus == STATUS.LINE_START) {
        var list = [];
        list.push(new Vec2(x, y));
        this._linePoints.push(list);
        this._lineEdges.push([]);
        console.log("press 0");
        console.log(this._linePoints);
        this._linePoint.mX = x;
        this._linePoint.mY = y;
        this._currentStatus = STATUS.LINE_DRAWING;
        this._curentLine0 = null;
        //if (this._linePoints[this._linePoints.length - 1].length === 1) {
        this._lineIntersect.isStartIntersect.push(false);
        this._lineIntersect.isSelfIntersect.push(false);
        this._lineIntersect.isStartEndSame.push(false);
        this._lineIntersect.isEndIntersect.push(false);
        for (var i = 0; i < this._mFloor.mCurves.length; i++) {
            if (this._mFloor.mCurves[i].containsPoint(this._linePoint)) {
                this._lineIntersect.isStartIntersect[this._lineIntersect.isStartIntersect.length - 1] = true;
                break;
            }
        }

    } else if (this._currentStatus == STATUS.LINE_DRAWING) {
        this._linePoints[this._linePoints.length-1].push(new Vec2(x, y));
        this._lineEdges[this._lineEdges.length-1].push(this._curentLine0.clone());
        console.log("press 1");
        console.log(this._linePoints);
        
        if (this._curentLine1) {
            this._linePoints[this._linePoints.length-1][this._linePoints[this._linePoints.length-1].length - 1].mX = this._curentLine0.mEnd.mX;
            this._linePoints[this._linePoints.length-1][this._linePoints[this._linePoints.length-1].length - 1].mY = this._curentLine0.mEnd.mY;
            this._currentStatus = STATUS.LINE_START;
            
            var intersectWithCurve = false;
            for (var i = 0; i < this._mFloor.mCurves.length; i++) {
                if (this._mFloor.mCurves[i].containsPoint(this._curentLine0.mEnd)) {
                    intersectWithCurve = true;
                    break;
                }
            }
            
            if (!intersectWithCurve)
            {
                this._lineIntersect.isSelfIntersect[this._lineIntersect.isSelfIntersect.length - 1] = true;
            }
            
            if (Vec2.isEqual(this._curentLine1.mStart, this._curentLine1.mEnd)) {
                this._lineIntersect.isEndIntersect[this._lineIntersect.isEndIntersect.length - 1] = true;
            }
            
            this.render();
            this._curentLine0 = null;
            this._curentLine1 = null;
        }
        
    }
    
    if (this._currentStatus == STATUS.NOT_STARTED) {
        this._currentStatus = STATUS.SET_START;
        this._mEdge.mStart.mX = x;
        this._mEdge.mStart.mY = y;
    }
}

Canvas.prototype.setEndPoint = function(x, y) {
    
    if (this._type == null) {
        return false;
    }
    
    var hintPoints = [];
    var minDis = Number.MAX_VALUE;
    var index = -1;
    var minPoint;
    //Do the snapping
    for (var i = 0; i < this._mFloor.mCurves.length; i++) {
        var curve = this._mFloor.mCurves[i];
        var edge;
        if (curve instanceof SegmentController) {
            edge = curve.getTheStartEndEdge();
        } else {
            edge = curve.getCurveFromController();
        }
        
        if (!curve.isBoundry) {
            
            var point = edge.getIntersectionPointByPoint(new Vec2(x, y), true);
            hintPoints.push(point);
        }
    }
    
    for (var i = 0; i < hintPoints.length; i++) {
        var dis = Vec2.distance(new Vec2(x, y), hintPoints[i]);
        if (dis < minDis) {
            minDis = dis;
            index = i;
            minPoint = hintPoints[i];
        }
    }
    //console.log(minDis);
    if (minDis < 3) {
        this._hintPoints.push(minPoint);
        
        x = minPoint.mX;
        y = minPoint.mY;
    }
    
    if (this._currentStatus ==  STATUS.NOT_STARTED || this._currentStatus ==  STATUS.LINE_START) {
        return false;
    }
   
    
    if (this._currentStatus == STATUS.LINE_DRAWING) {
        this._linePoint.mX = x;
        this._linePoint.mY = y;
        
        var lastPointArray = this._linePoints[this._linePoints.length - 1];
        var lastPoint = lastPointArray[lastPointArray.length - 1];
        var edge = new MyEdge(lastPoint, this._linePoint);
        
        var intersects = [];
        for (var i = 0; i < this._mFloor.mCurves.length; i++) {
            var curve = this._mFloor.mCurves[i];
            curve.isIntersectWithGeometry(edge, intersects);
        }
        
        for (var i = 0; i < this._lineEdges.length; i++) {
            for (var j = 0; j < this._lineEdges[i].length; j++) {
                SegmentController.intersectSub(edge, this._lineEdges[i][j], intersects);
            }
            
        }
        var minDis = Number.MAX_VALUE;
        var idx = 0;
        if (intersects.length > 0) {
            for (var i = 0; i < intersects.length; i++) {
                var dis = Vec2.distance(intersects[i], lastPoint);
                if (minDis > dis) {
                    minDis = dis;
                    idx = i;
                }
            }
            
            this._curentLine0 = new MyEdge(lastPoint, intersects[idx]);
            this._hintPoints.push(intersects[idx].clone());
            this._curentLine1 = new MyEdge(intersects[idx], this._linePoint);
            //this._currentStatus = STATUS.LINE_START;
            
        } else {
            
            this._curentLine0 = edge;
            this._curentLine1 = null;
        }
        
        return false;
    }

    this._currentStatus = STATUS.DRAWING;
    this._mEdge.mEnd.mX = x;
    this._mEdge.mEnd.mY = y;
    
    if (this._mEdge.getLength() < 0.0001) {
        return false;
    } else {
        return true;
    }
}

Canvas.prototype.resetType = function() {
    if (this._currentStatus  == STATUS.LINE_DRAWING) {
        this._currentStatus = STATUS.LINE_START;
        
        
        var lastPointArray = this._linePoints[this._linePoints.length - 1];
        
        if (lastPointArray.length < 2 || Vec2.isEqual(lastPointArray[0], lastPointArray[lastPointArray.length - 1])) {
            // do nothing
            this._lineIntersect.isStartEndSame[this._lineIntersect.isStartEndSame.length - 1] = true;
        } else {
            var firstPoint = lastPointArray[0];
            var lastPoint = lastPointArray[lastPointArray.length - 1];
            var edge = new MyEdge(lastPointArray[lastPointArray.length - 1], lastPointArray[0]);
            var intersects = [];
            for (var i = 0; i < this._mFloor.mCurves.length; i++) {
                var curve = this._mFloor.mCurves[i];
                curve.isIntersectWithGeometry(edge, intersects);
            }
            
            for (var i = 0; i < this._lineEdges.length; i++) {
                for (var j = 0; j < this._lineEdges[i].length; j++) {
                    SegmentController.intersectSub(edge, this._lineEdges[i][j], intersects);
                }
            }
            
            var minDis = Number.MAX_VALUE;
            var idx = 0;
            if (intersects.length > 0) {
                for (var i = 0; i < intersects.length; i++) {
                    var dis = Vec2.distance(intersects[i], lastPoint);
                    if (minDis > dis) {
                        minDis = dis;
                        idx = i;
                    }
                }
                
                lastPointArray.push(intersects[idx]);
                this._lineEdges[this._lineEdges.length - 1].push(new MyEdge(lastPoint, intersects[idx]));
                //证明有问题，不封闭的
                
            } else {
                this._lineEdges[this._lineEdges.length - 1].push(new MyEdge(lastPoint, firstPoint));
                //证明没有问题，封闭的
                this._lineIntersect.isStartEndSame[this._lineIntersect.isStartEndSame.length - 1] = true;
                
            }
        }
        
        console.log("right 0");
    } else if (this._currentStatus  == STATUS.LINE_START) {
        this._currentStatus = STATUS.NOT_STARTED;
        this.setType(null);// = null;
        var lines = [];
        for (var i = 0; i < this._lineEdges.length; i++) {
            if (this._lineIntersect.isStartEndSame[i]){
                for (var j = 0; j < this._lineEdges[i].length; j++) {
                    lines.push(this._lineEdges[i][j]);
                }
            } else {
                if (this._lineIntersect.isStartIntersect[i] && this._lineIntersect.isEndIntersect[i]) {
                    //首尾都相交
                    //那这些边都要
                    for (var j = 0; j < this._lineEdges[i].length; j++) {
                        lines.push(this._lineEdges[i][j]);
                    }
                }
                if (!this._lineIntersect.isSelfIntersect[i]) {
                    //首尾不同点，且没有自交，直接过滤
                    continue;
                } else if (this._lineIntersect.isStartIntersect[i]) {
                    //首尾不同点，但是自交了，并且第一个点和已存部分有交集
                    //那这些边都要
                    for (var j = 0; j < this._lineEdges[i].length; j++) {
                        lines.push(this._lineEdges[i][j]);
                    }
                } else {
                    //首尾不同点，但是自交了，并且第一个点和已存部分没有交集
                    //去掉首部相交的
                    var idx =  -1;
                    var lastPoint = this._linePoints[i][this._linePoints[i].length - 1];
                    for (var j = 0; j < this._lineEdges[i].length - 1; j++) {
                        if (this._lineEdges[i][j].pointInEdgeOrOnEdge(lastPoint)) {
                            idx = j;
                            break;
                        }
                    }
                    this._lineEdges[i].splice(0, idx);
                    this._lineEdges[i][0].mStart.mX = lastPoint.mX;
                    this._lineEdges[i][0].mStart.mY = lastPoint.mY;
                    for (var j = 0; j < this._lineEdges[i].length; j++) {
                        lines.push(this._lineEdges[i][j]);
                    }
                }
            }
        }
        this.split(lines);
        this.render();
        this._linePoints = [];
        this._lineEdges = [];
        this._lineIntersect.isStartIntersect = [];
        this._lineIntersect.isSelfIntersect = [];
        this._lineIntersect.isStartEndSame = [];
        this._lineIntersect.isEndIntersect = [];
        
        console.log("right 1");
    } else {
        this._currentStatus = STATUS.NOT_STARTED;
        this.setType(null);
        //this._type = null;
    }
}

Canvas.prototype.getDrawType = function() {
    return this._type;
}

Canvas.prototype.getFocusElement = function() {
    if (this._focus) {
        return this._focus.geom;
    } else {
        return null;
    }
}

Canvas.prototype.checkStatus = function() {
    if (this._type == null) {
        return false;
    }
    
    if (this._currentStatus == STATUS.SET_START) {
        return false;
    } else if (this._currentStatus == STATUS.DRAWING){
        this._currentStatus = STATUS.NOT_STARTED;
        return true;
    } else if (this._currentStatus == STATUS.LINE_START){
        //this._currentStatus = STATUS.NOT_STARTED;
        return true;
    } else if (this._currentStatus == STATUS.LINE_DRAWING){
        //this._currentStatus = STATUS.NOT_STARTED;
        return true;
    }
}

Canvas.prototype.renderAreaPicked = function(x, y) {
    for (var i = 0; i < this._innerResult.length; i++) {
        if (this._innerResult[i].contains(new Vec2(x, y))) {
            //return this._outputResult[i];
            this._pickedArea = this._outputResult[i];
            this.render();
            break;
        }
    }
}

Canvas.prototype.recordMouseDown = function(x, y) {
    this._mouseDown.mX = x;
    this._mouseDown.mY = y;
    
}

Canvas.prototype.isMoved = function(x, y) {
    var dis = Math.abs(this._mouseDown.mX - x) + Math.abs(this._mouseDown.mY - y);
    console.log(dis);
    if (dis > 3 ) {
        return true;
    } else {
        return false;
    }
}

Canvas.prototype.recordMouseUp = function(x, y) {
    this._mouseUp.mX = x;
    this._mouseUp.mY = y;
    
    if (Math.abs(this._mouseDown.mX - this._mouseUp.mX) > 4 || Math.abs(this._mouseDown.mY - this._mouseUp.mY) > 4) {
        this._focus = null;
    }
    this._updateElment = null;
}

Canvas.prototype.onSplitCurve = function() {
    this._mWallCurveOperation.onSplitCurve(this._operationCurve);
    this._operationCurve = null;
    //this._outputResult = Converter.outputGeo(this._mFloor);
    [this._outputResult,  this._innerResult] = Converter.outputGeo(this._mFloor);
    this.render();
}

Canvas.prototype.onToLine = function() {
    this._mWallCurveOperation.onToLine(this._operationCurve);
    this._operationCurve = null;
    //this._outputResult = Converter.outputGeo(this._mFloor);
    [this._outputResult,  this._innerResult] = Converter.outputGeo(this._mFloor);
    this.render();
}

Canvas.prototype.onToArc = function() {
    this._mWallCurveOperation.onToArc(this._operationCurve);
    this._operationCurve = null;
    //this._outputResult = Converter.outputGeo(this._mFloor);
    [this._outputResult,  this._innerResult] = Converter.outputGeo(this._mFloor);
    console.log(this._outputResult);
    this.render();
}

Canvas.prototype.onDelete = function() {
    this._mWallCurveOperation.onDelete(this._operationCurve);
    this._operationCurve = null;
    //this._outputResult = Converter.outputGeo(this._mFloor);
    [this._outputResult,  this._innerResult] = Converter.outputGeo(this._mFloor);
    this.render();
}

Canvas.prototype.setOperationCurve = function() {
    this._operationCurve = this._focus.controller;
}


Canvas.prototype._checkOverlap = function() {
    var overlapped = false;
    for (var i = 0; i < this._mFloor.mCurves.length; i++) {
        for (var j = i+1; j < this._mFloor.mCurves.length; j++) {
            var curve0 = this._mFloor.mCurves[i];
            var curve1 = this._mFloor.mCurves[j];
            if (curve0.isIntersectWith(curve1)) {
                overlapped = true;
                break;
            }
        }
    }
    return overlapped;
}

Canvas.prototype.updateElement = function(x, y){
    
    if (!this._updateElment && this._focus) {
        this._updateElment = this._focus;
        this._lastFocos = new Vec2(x, y);
    }
    
    if (this._updateElment) {
        console.log("controller been called: " + x + " " + y);
        this._pickedArea = null;
        if (this._updateElment.controller instanceof MyCorner) {
            var arc = [];
            for (var i = 0; i < this._updateElment.controller.mCurves.length; i++) {
                if (this._updateElment.controller.mCurves[i] instanceof CurveController) {
                    arc.push(this._updateElment.controller.mCurves[i].getCurveFromController().mArcAngle);
                }
            }
            this._updateElment.controller.mPosition.mX = x;
            this._updateElment.controller.mPosition.mY = y;
            var idx = 0;
            for (var i = 0; i < this._updateElment.controller.mCurves.length; i++) {
                if (this._updateElment.controller.mCurves[i] instanceof CurveController) {
                    this._updateElment.controller.mCurves[i].adjustCurve(arc[idx]);
                    idx++;
                }
            }
            
            var analysis = new Analysis(this._mFloor);
            analysis.execute();
            [this._outputResult,  this._innerResult] = Converter.outputGeo(this._mFloor);
        }
        
        if (this._updateElment.controller instanceof CurveController) {
            this._updateElment.controller.mCurvePoint.mX = x;
            this._updateElment.controller.mCurvePoint.mY = y;
            var analysis = new Analysis(this._mFloor);
            analysis.execute();
            [this._outputResult,  this._innerResult] = Converter.outputGeo(this._mFloor);
        }
        
        if (this._updateElment.controller instanceof SegmentController) {
            var seg = this._updateElment.controller;
            //1 找到2个corner
            var coners = seg.toCorners();
            //2 找到所有线段
            var startCurves;
            var endCurves;
            var angle = seg.getAngle();
            
            // 得到差别最大的两个线段
            var minS = 0;
            var minE = 0;
            for (var i = 0; i < coners[0].mCurves.length; i++) {
                if (coners[0].mCurves[i].mId !== seg.mId) {
                    coners[0].mCurves[i].getAngle();
                    var diff = Math.abs(angle - coners[0].mCurves[i].getAngle());
                    while(diff > Math.PI) {
                        diff = diff - Math.PI;
                    }
                    if (diff > minS) {
                        minS = diff;
                        startCurves = coners[0].mCurves[i];
                    }
                    //startCurves.push(coners[0].mCurves[i]);
                }
            }
            for (var i = 0; i < coners[1].mCurves.length; i++) {
                if (coners[1].mCurves[i].mId !== seg.mId) {
                    coners[1].mCurves[i].getAngle();
                    //endCurves.push(coners[1].mCurves[i]);
                    var diff = Math.abs(angle - coners[1].mCurves[i].getAngle());
                    while(diff > Math.PI) {
                        diff = diff - Math.PI;
                    }
                    if (diff > minE) {
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
            
            
            //更新曲线的曲率了
            var arc = [];
            for (var i = 0; i < coners[0].mCurves.length; i++) {
                if (coners[0].mCurves[i] instanceof CurveController) {
                    arc.push(coners[0].mCurves[i].getCurveFromController().mArcAngle);
                }
            }
            
            //更新完这个位置
            coners[0].mPosition.mX = s.mX;
            coners[0].mPosition.mY = s.mY;
            
            var idx = 0;
            for (var i = 0; i < coners[0].mCurves.length; i++) {
                if (coners[0].mCurves[i] instanceof CurveController) {
                    coners[0].mCurves[i].adjustCurve(arc[idx]);
                    idx++;
                }
            }
            
            var arc = [];
            for (var i = 0; i < coners[1].mCurves.length; i++) {
                if (coners[1].mCurves[i] instanceof CurveController) {
                    arc.push(coners[1].mCurves[i].getCurveFromController().mArcAngle);
                }
            }
            
            //更新完这个位置
            coners[1].mPosition.mX = e.mX;
            coners[1].mPosition.mY = e.mY;
            
            var idx = 0;
            for (var i = 0; i < coners[1].mCurves.length; i++) {
                if (coners[1].mCurves[i] instanceof CurveController) {
                    coners[1].mCurves[i].adjustCurve(arc[idx]);
                    idx++;
                }
            }
            
            var analysis = new Analysis(this._mFloor);
            analysis.execute();
            [this._outputResult,  this._innerResult] = Converter.outputGeo(this._mFloor);
            
        }
        
        var overlapped = this._checkOverlap();
        //console.log("XXXXX: " + overlapped);
        //console.log(x + " " + y);
        //console.log(this._lastFocos.mX + " " + this._lastFocos.mY);
        
        if (overlapped)
        {
            if (this._updateElment.controller instanceof MyCorner) {
                var arc = [];
                for (var i = 0; i < this._updateElment.controller.mCurves.length; i++) {
                    if (this._updateElment.controller.mCurves[i] instanceof CurveController) {
                        arc.push(this._updateElment.controller.mCurves[i].getCurveFromController().mArcAngle);
                    }
                }
                this._updateElment.controller.mPosition.mX = this._lastFocos.mX;
                this._updateElment.controller.mPosition.mY = this._lastFocos.mY;
                var idx = 0;
                for (var i = 0; i < this._updateElment.controller.mCurves.length; i++) {
                    if (this._updateElment.controller.mCurves[i] instanceof CurveController) {
                        this._updateElment.controller.mCurves[i].adjustCurve(arc[idx]);
                        idx++;
                    }
                }
            }
            
            
            if (this._updateElment.controller instanceof CurveController) {
                this._updateElment.controller.mCurvePoint.mX = this._lastFocos.mX;
                this._updateElment.controller.mCurvePoint.mY = this._lastFocos.mY;
            }
            
            if (this._updateElment.controller instanceof SegmentController) {
                var seg = this._updateElment.controller;
                //1 找到2个corner
                var coners = seg.toCorners();
                //2 找到所有线段
                var startCurves;
                var endCurves;
                var angle = seg.getAngle();
                
                // 得到差别最大的两个线段
                var minS = 0;
                var minE = 0;
                for (var i = 0; i < coners[0].mCurves.length; i++) {
                    if (coners[0].mCurves[i].mId !== seg.mId) {
                        coners[0].mCurves[i].getAngle();
                        var diff = Math.abs(angle - coners[0].mCurves[i].getAngle());
                        while(diff > Math.PI) {
                            diff = diff - Math.PI;
                        }
                        if (diff > minS) {
                            minS = diff;
                            startCurves = coners[0].mCurves[i];
                        }
                        //startCurves.push(coners[0].mCurves[i]);
                    }
                }
                for (var i = 0; i < coners[1].mCurves.length; i++) {
                    if (coners[1].mCurves[i].mId !== seg.mId) {
                        coners[1].mCurves[i].getAngle();
                        //endCurves.push(coners[1].mCurves[i]);
                        var diff = Math.abs(angle - coners[1].mCurves[i].getAngle());
                        while(diff > Math.PI) {
                            diff = diff - Math.PI;
                        }
                        if (diff > minE) {
                            minE = diff;
                            endCurves = coners[1].mCurves[i];
                        }
                    }
                }
                
                var newEdge;
                if (MyNumber.isEqual(angle, Math.PI / 2)) {
                    newEdge = new MyEdge(new Vec2(this._lastFocos.mX, this._lastFocos.mY), new Vec2(this._lastFocos.mX, this._lastFocos.mY + 1));
                } else {
                    newEdge = new MyEdge(new Vec2(this._lastFocos.mX, this._lastFocos.mY), new Vec2(this._lastFocos.mX + 1, this._lastFocos.mY + Math.tan(angle)));
                }
                
                var s = MyEdge.getIntersection(newEdge, startCurves.getTheStartEndEdge());
                var e = MyEdge.getIntersection(newEdge, endCurves.getTheStartEndEdge());
                
                
                //更新曲线的曲率了
                var arc = [];
                for (var i = 0; i < coners[0].mCurves.length; i++) {
                    if (coners[0].mCurves[i] instanceof CurveController) {
                        arc.push(coners[0].mCurves[i].getCurveFromController().mArcAngle);
                    }
                }
                
                //更新完这个位置
                coners[0].mPosition.mX = s.mX;
                coners[0].mPosition.mY = s.mY;
                
                var idx = 0;
                for (var i = 0; i < coners[0].mCurves.length; i++) {
                    if (coners[0].mCurves[i] instanceof CurveController) {
                        coners[0].mCurves[i].adjustCurve(arc[idx]);
                        idx++;
                    }
                }
                
                arc = [];
                for (var i = 0; i < coners[1].mCurves.length; i++) {
                    if (coners[1].mCurves[i] instanceof CurveController) {
                        arc.push(coners[1].mCurves[i].getCurveFromController().mArcAngle);
                    }
                }
                
                //更新完这个位置
                coners[1].mPosition.mX = e.mX;
                coners[1].mPosition.mY = e.mY;
                
                idx = 0;
                for (var i = 0; i < coners[1].mCurves.length; i++) {
                    if (coners[1].mCurves[i] instanceof CurveController) {
                        coners[1].mCurves[i].adjustCurve(arc[idx]);
                        idx++;
                    }
                }
                
                var analysis = new Analysis(this._mFloor);
                analysis.execute();
                [this._outputResult,  this._innerResult] = Converter.outputGeo(this._mFloor);
            }
            
            
            var analysis = new Analysis(this._mFloor);
            analysis.execute();
            [this._outputResult,  this._innerResult] = Converter.outputGeo(this._mFloor);
            
            //this._updateElment = null;
            //this._focus = null;
            //this._lastFocos = null;
        }
        this.render(x, y);
        if (overlapped) {
            return;
        }
        this._lastFocos.mX = x;
        this._lastFocos.mY = y;
    }
    
}

Canvas.prototype.createElement = function() {
    switch(this._type) {
        case TYPE.RECTANGLE:
            this.createRect();
        break;
        
        case TYPE.CIRCLE:
            this.creatCircle();
        break;
        
        case TYPE.LINE :
            //Do nothing
        break;
    }
}

Canvas.prototype._renderOutput = function() {
    if (this._outputResult == null) {
        return;
    }
    var res = this._outputResult;
    for (var i = 0; i < res.length; i++) {
        for (var j = 0; j < res[i].mOutline.edges.length; j++) {
            var edge = res[i].mOutline.edges[j];
            if (edge instanceof MyEdge) {
                this._renderer.drawLine(edge);
            }else if (edge instanceof MyCurve) {
                this._renderer.drawArc(edge);
            }
        }
        
        for (var j = 0; j < res[i].mHoles.length; j++) {
            for (var k = 0; k < res[i].mHoles[j].edges.length; k++) {
                var edge = res[i].mHoles[j].edges[k];
                if (edge instanceof MyEdge) {
                    this._renderer.drawLine(edge);
                } else if (edge instanceof MyCurve) {
                    this._renderer.drawArc(edge);
                }
            }
        }
        
    }
}

Canvas.prototype._renderFocusObject = function(x, y) {
    if (this._type != null || (x == undefined && y == undefined)) {
        return;
    }
    
    this._focus = null;
    if(this._mFloor.mProfile) {
        var profile = this._mFloor.mProfile.getProfile();
        for (var i = 0; i < profile.length; i++) {
            if (profile[i].pointInEdgeOrOnEdge(new Vec2(x, y), 2.0)) {
                return;
            }
        }
    }
    
    if(this._mFloor.mProfile) {
        var vertices = this._mFloor.mProfile.getVertices();
        for (var i = 0; i < vertices.length; i++) {
            if (vertices[i].isClose(new Vec2(x, y), 2.0)) {
                return;
            }
        }
    }
    var snappingOffset = 5;
    /////////////////////
    // focus on corner //
    /////////////////////
    for (var i = 0; i < this._mFloor.mCorners.length; i++) {
        if (this._mFloor.mCorners[i].mPosition.isClose(new Vec2(x, y), snappingOffset)) {
            this._focus = {
                    geom: this._mFloor.mCorners[i].mPosition.clone(),
                    controller : this._mFloor.mCorners[i]
                };
            break;
        }
    }
    
    if (this._focus != null) {
        this._renderer.drawCorner(this._focus.geom, 10, 'blue');
        document.body.style.cursor = "move";
        return;
    } else {
        document.body.style.cursor = "default";
    }
    
    ////////////////////
    // focus on edge  //
    ////////////////////
    for (var i = 0; i < this._mFloor.mCurves.length; i++) {
        var curve = this._mFloor.mCurves[i];
        var edge;
        if (curve instanceof SegmentController) {
            var edge = curve.getTheStartEndEdge();
            if (edge.pointInEdgeOrOnEdge(new Vec2(x, y), snappingOffset)) {
                this._focus = {
                    geom: edge,
                    controller : curve
                };
                break;
            }
        } else if(curve instanceof CurveController) {
            var edge = curve.getCurveFromController();
            
            if (edge.isInsideCurveAndNotOnCurve(new Vec2(x, y), snappingOffset)) {
                this._focus = {
                    geom: edge,
                    controller : curve
                };
                break;
            }
        }
    }
    if (this._focus == null) {
        return;
    }
    
    if (this._focus.geom instanceof MyEdge) {
        this._renderer.drawLine(this._focus.geom, null, null, true);
        var angle = this._focus.geom.getAngle();
        if (Math.abs(angle) > Math.PI / 4 && Math.abs(angle) < 3 * Math.PI / 4) {
            document.body.style.cursor = "e-resize";
        } else {
            document.body.style.cursor = "n-resize";
        }
    } else if(this._focus.geom instanceof MyCurve) {
        this._renderer.drawArc(this._focus.geom, true);
        document.body.style.cursor = "n-resize";
    }
}

Canvas.prototype._renderMarkerLines = function() {
    var curves = [];
    var segments = [];
    var boundries = [];
    var validIndex = [];
    var validCurveIndex = [];
    for (var i = 0; i < this._mFloor.mCurves.length; i++) {
        if (this._mFloor.mCurves[i].isBoundry) {
            boundries.push(this._mFloor.mCurves[i]);
        } else if (this._mFloor.mCurves[i] instanceof SegmentController) {
            var seg = this._mFloor.mCurves[i];
            segments.push(seg);
            
            if (this._pickedArea) {
                //console.log(this._pickedArea);
                for (var j = 0; j < this._pickedArea.mOutline.edges.length; j++) {
                    var edge = this._pickedArea.mOutline.edges[j];
                    if (edge instanceof MyEdge && edge.isSameAsEdgeStartOrEnd(seg.mStart.mPosition) && edge.isSameAsEdgeStartOrEnd(seg.mEnd.mPosition)) {
                        validIndex.push(segments.length - 1);
                    }
                }
                for (var k = 0; k < this._pickedArea.mHoles.length; k++) {
                    var poly = this._pickedArea.mHoles[k];
                    for (var j = 0; j < poly.edges.length; j++) {
                        var edge = poly.edges[j];
                        if (edge instanceof MyEdge  && edge.isSameAsEdgeStartOrEnd(seg.mStart.mPosition) && edge.isSameAsEdgeStartOrEnd(seg.mEnd.mPosition)) {
                            validIndex.push(segments.length - 1);
                        }
                    }
                }
            }
        } else if (this._mFloor.mCurves[i] instanceof CurveController) {
            curves.push(this._mFloor.mCurves[i]);
            if (this._pickedArea) {
                var cur = this._mFloor.mCurves[i].getCurveFromController();
                for (var j = 0; j < this._pickedArea.mOutline.edges.length; j++) {
                    var edge = this._pickedArea.mOutline.edges[j];
                    if (edge instanceof MyCurve && MyCurve.isSameCurve(cur, edge)) {
                        validCurveIndex.push(curves.length - 1);
                    }
                }
                
                
                for (var k = 0; k < this._pickedArea.mHoles.length; k++) {
                    var poly = this._pickedArea.mHoles[k];
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
    
    if (this._flags.isZoneSizeEnabled) {
        //画内部标注线
        for (var i = 0; i < segments.length; i++) {
            var curve = segments[i];
            var edge = curve.getTheStartEndEdge();
            var start = edge.mStart.clone();
            var end = edge.mEnd.clone();
            var center = edge.getCenter();
            var area = curve.mAreas[curve.mAreas.length - 1];
            //var area = areas[0];
            var angle = edge.getAngle();
            angle = angle + Math.PI / 2;
            //console.log(angle);
            var offset = 10;
            center.mY += offset * Math.sin(angle);
            center.mX += offset * Math.cos(angle);
            
            if (area.containsPoint(center)) {
                
                start.mY -= offset * Math.sin(angle);
                start.mX -= offset * Math.cos(angle);
                
                end.mY -= offset * Math.sin(angle);
                end.mX -= offset * Math.cos(angle);
                
                
            } else {
                start.mY += offset * Math.sin(angle);
                start.mX += offset * Math.cos(angle);
                
                end.mY += offset * Math.sin(angle);
                end.mX += offset * Math.cos(angle);
            }
            if (validIndex.indexOf(i) > -1) {
                this._renderer.drawDimensions({x: start.mX,y: start.mY}, {x: end.mX,y: end.mY});
            }
        }
    }
    
    if (this._flags.isCrownHeightEnabled) {
        //画内部标注线
        var that = this;
        for (var i = 0; i < curves.length; i++) {
            var pt0 = curves[i].getCenter();
            var pt1 = curves[i].getTheStartEndEdge().getCenter();
            
            if (validCurveIndex.indexOf(i) > -1) {
                this._renderer.drawDimensions({x: pt0.mX,y: pt0.mY}, {x: pt1.mX,y: pt1.mY}, null, true, 
                function(dis, canvas, curve, seg2, distance) {
                    var originalCurvePoint = curve.mCurvePoint.clone();
                    
                    var pt0 = curve.getCenter();
                    var pt1 = curve.getTheStartEndEdge().getCenter();
                    
                    var dir = new Vec2(pt0.mX - pt1.mX, pt0.mY - pt1.mY);
                    dir.normalize();
                    //var angle = dir.getAngle();
                    
                    pt1.addBy(dir.mulBy(dis));
                    curve.mCurvePoint.copy(pt1);
                    
                    
                    var analysis = new Analysis(that._mFloor);
                    analysis.execute();
                    [that._outputResult,  that._innerResult] = Converter.outputGeo(that._mFloor);
                    
                    var overlapped = that._checkOverlap();
                
                    if (overlapped)
                    {
                        curve.mCurvePoint.copy(originalCurvePoint);
                        var analysis = new Analysis(that._mFloor);
                        analysis.execute();
                        [that._outputResult,  that._innerResult] = Converter.outputGeo(that._mFloor);
                        
                    } else {
                        that._pickedArea = null;
                    }
                    
                    that.render();
                    
                }, that, curves[i], null, null);
            }
            
        }
    }
    
    
    for (var i = 0; i < segments.length; i++) {
        
        var edge = segments[i].getTheStartEndEdge();
        var angle = edge.getAngle();
        
        if (Angle.isHorizontal(angle)) {
            var maxDis = -Number.MAX_VALUE;
            var sign = 0;
            var center;
            var markLine = new MyEdge(new Vec2(), new Vec2());
            
            if (this._flags.isRelativeDistanceEnabled) {
                for (var j = i+1; j < segments.length; j++) {
                    var edge2 = segments[j].getTheStartEndEdge();
                    var angle2 = edge2.getAngle();
                    if (Angle.isHorizontal(angle2) && !SegmentController.isWithinSameArea(segments[i],segments[j]) && MyEdge.getValidHorizontalSection(edge, edge2, markLine)) {
                        var valid = true;
                        
                        for (var m = 0; m < this._mFloor.mCurves.length; m++) {
                            if (this._mFloor.mCurves[m] instanceof CurveController) {
                                continue;
                            }
                            var intersects = [];
                            if (SegmentController.isIntersectWith(markLine, this._mFloor.mCurves[m], intersects)) {
                                if (intersects.length > 0 && !Vec2.isEqual(intersects[0], markLine.mEnd))
                                {
                                    valid = false;
                                    continue;
                                }
                            }
                        }
                        if(valid) {
                            sign = Math.sign(segments[i].mStart.mPosition.mY - segments[j].mStart.mPosition.mY);
                            var distance = Math.abs(segments[i].mStart.mPosition.mY - segments[j].mStart.mPosition.mY);
                            center = markLine.mStart.clone();
                                
                            if (validIndex.indexOf(i) > -1 || validIndex.indexOf(j) > -1) {
                                var arcValid_i = true;
                                var arcValid_j = true;
                                
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
                                
                                var corners = segments[j].toCorners();
                                for (var n = 0; n < corners.length; n++) {
                                    var corner = corners[n];
                                    for (var p = 0; p < corner.mCurves.length; p++) {
                                        if (corner.mCurves[p] instanceof CurveController) {
                                            arcValid_j = false;
                                            break;
                                        }
                                    }
                                }
                                
                                if (arcValid_i || arcValid_j) {
                                    var that = this;
                                    if (arcValid_i && arcValid_j) {
                                        this._renderer.drawDimensions({x: center.mX,y: center.mY}, {x: center.mX,y: center.mY - sign * distance}, null, true,
                                        function(dis, canvas, seg, seg2, distance) {
                                            var originalY1 = seg.mStart.mPosition.mY;
                                            var originalY2 = seg2.mStart.mPosition.mY;
                                            
                                            seg.mStart.mPosition.mY = seg.mStart.mPosition.mY + 0.5 * Math.sign(distance) * (dis - Math.abs(distance));
                                            seg.mEnd.mPosition.mY = seg.mEnd.mPosition.mY + 0.5 * Math.sign(distance) * (dis - Math.abs(distance));
                                            
                                            seg2.mStart.mPosition.mY = seg2.mStart.mPosition.mY - 0.5 * Math.sign(distance) * (dis - Math.abs(distance));
                                            seg2.mEnd.mPosition.mY = seg2.mEnd.mPosition.mY - 0.5 * Math.sign(distance) * (dis - Math.abs(distance));
                                            
                                            var analysis = new Analysis(that._mFloor);
                                            analysis.execute();
                                            [that._outputResult,  that._innerResult] = Converter.outputGeo(that._mFloor);
                                            
                                            var overlapped = that._checkOverlap();
                                        
                                            if (overlapped)
                                            {
                                                
                                                seg.mStart.mPosition.mY = originalY1;
                                                seg.mEnd.mPosition.mY = originalY1;
                                                
                                                seg2.mStart.mPosition.mY = originalY2;
                                                seg2.mEnd.mPosition.mY = originalY2;
                                                
                                                var analysis = new Analysis(that._mFloor);
                                                analysis.execute();
                                                [that._outputResult,  that._innerResult] = Converter.outputGeo(that._mFloor);
                                                
                                            } else {
                                                that._pickedArea = null;
                                            }
                                            that.render();
                                            
                                        }, that, segments[i], segments[j], sign * distance);
                                    } else {
                                        var seg; 
                                        if (arcValid_i) {
                                            seg = segments[i];
                                        }
                                        if (arcValid_j) {
                                            seg = segments[j];
                                        }
                                        this._renderer.drawDimensions({x: center.mX,y: center.mY}, {x: center.mX,y: center.mY - sign * distance}, null, true,
                                        function(dis, canvas, seg, seg2, distance) {
                                            var originalY = seg.mStart.mPosition.mY;
                                            
                                            seg.mStart.mPosition.mY = seg.mStart.mPosition.mY + Math.sign(distance) * (dis - Math.abs(distance));
                                            seg.mEnd.mPosition.mY = seg.mEnd.mPosition.mY + Math.sign(distance) * (dis - Math.abs(distance));
                                            
                                            var analysis = new Analysis(that._mFloor);
                                            analysis.execute();
                                            [that._outputResult,  that._innerResult] = Converter.outputGeo(that._mFloor);
                                            
                                            var overlapped = that._checkOverlap();
                                        
                                            if (overlapped)
                                            {
                                                
                                                seg.mStart.mPosition.mY = originalY;
                                                seg.mEnd.mPosition.mY = originalY;
                                                
                                                var analysis = new Analysis(that._mFloor);
                                                analysis.execute();
                                                [that._outputResult,  that._innerResult] = Converter.outputGeo(that._mFloor);
                                                
                                            } else {
                                                that._pickedArea = null;
                                            }
                                            that.render();
                                            
                                        }, that, seg, null, sign * distance);
                                    }
                                    
                                }
                            }
                        }
                    }
                }
                
            }
            if (this._flags.isAbosoluteMarginEnabled) {
                for (var j = 0; j < boundries.length; j++) {
                    var edge2 = boundries[j].getTheStartEndEdge();
                    var angle2 = edge2.getAngle();
                    if (Angle.isHorizontal(angle2) && !SegmentController.isWithinSameArea(segments[i],boundries[j]) && MyEdge.getValidHorizontalSection(edge, edge2, markLine)) {
                        markLine.mEnd.mY = boundries[j].mStart.mPosition.mY;
                        var valid = true;
                        for (var m = 0; m < this._mFloor.mCurves.length; m++) {
                            if (this._mFloor.mCurves[m] instanceof CurveController) {
                                continue;
                            }
                            var intersects = [];
                            if (SegmentController.isIntersectWith(markLine, this._mFloor.mCurves[m], intersects)) {
                                if (intersects.length > 0 && !Vec2.isEqual(intersects[0], markLine.mEnd) && SegmentController.isWithinSameArea(segments[i],this._mFloor.mCurves[m]))
                                {
                                    valid = false;
                                    continue;
                                }
                            }
                        }
                        if(valid) {
                            var distance = Math.abs(segments[i].mStart.mPosition.mY - boundries[j].mStart.mPosition.mY);
                            if (maxDis < distance) {
                                sign = Math.sign(segments[i].mStart.mPosition.mY - boundries[j].mStart.mPosition.mY);
                                maxDis = distance;
                                center = markLine.mStart.clone();
                            }
                        }
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
                        var that = this;
                        this._renderer.drawDimensions({x: center.mX,y: center.mY}, {x: center.mX,y: center.mY - sign * maxDis}, null, true,
                        function(dis, canvas, seg, seg2, distance) {
                            var originalY = seg.mStart.mPosition.mY;
                            
                            seg.mStart.mPosition.mY = seg.mStart.mPosition.mY + Math.sign(distance) * (dis - Math.abs(distance));
                            seg.mEnd.mPosition.mY = seg.mEnd.mPosition.mY + Math.sign(distance) * (dis - Math.abs(distance));
                            
                            var analysis = new Analysis(that._mFloor);
                            analysis.execute();
                            [that._outputResult,  that._innerResult] = Converter.outputGeo(that._mFloor);
                            
                            var overlapped = that._checkOverlap();
                        
                            if (overlapped)
                            {
                                
                                seg.mStart.mPosition.mY = originalY;
                                seg.mEnd.mPosition.mY = originalY;
                                
                                var analysis = new Analysis(that._mFloor);
                                analysis.execute();
                                [that._outputResult,  that._innerResult] = Converter.outputGeo(that._mFloor);
                                
                            } else {
                                that._pickedArea = null;
                            }
                            that.render();
                            
                        }, that, segments[i], null, sign * maxDis);
                    }
                }
            }
        }
        
        if (Angle.isVertical(angle)) {
            var maxDis = -Number.MAX_VALUE;
            var sign = 0;
            var center;
            var markLine = new MyEdge(new Vec2(), new Vec2());
            
            if (this._flags.isRelativeDistanceEnabled) {
                for (var j = i+1; j < segments.length; j++) {
                    var edge2 = segments[j].getTheStartEndEdge();
                    var angle2 = edge2.getAngle();
                    if (Angle.isVertical(angle2) && !SegmentController.isWithinSameArea(segments[i],segments[j]) && MyEdge.getValidVerticalSection(edge, edge2, markLine)) {
                        markLine.mEnd.mX = segments[j].mStart.mPosition.mX;
                        var valid = true;
                        
                        for (var m = 0; m < this._mFloor.mCurves.length; m++) {
                            if (this._mFloor.mCurves[m] instanceof CurveController) {
                                continue;
                            }
                            var intersects = [];
                            if (SegmentController.isIntersectWith(markLine, this._mFloor.mCurves[m], intersects)) {
                                if (intersects.length > 0 && !Vec2.isEqual(intersects[0], markLine.mEnd))
                                {
                                    valid = false;
                                    continue;
                                }
                            }
                        }
                        if(valid) {
                            var distance = Math.abs(segments[i].mStart.mPosition.mX - segments[j].mStart.mPosition.mX);
                            sign = Math.sign(segments[i].mStart.mPosition.mX - segments[j].mStart.mPosition.mX);
                            center = markLine.mStart.clone();
                            if (validIndex.indexOf(i) > -1 || validIndex.indexOf(j) > -1) {
                                var arcValid_i = true;
                                var arcValid_j = true;
                                
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
                                
                                var corners = segments[j].toCorners();
                                for (var n = 0; n < corners.length; n++) {
                                    var corner = corners[n];
                                    for (var p = 0; p < corner.mCurves.length; p++) {
                                        if (corner.mCurves[p] instanceof CurveController) {
                                            arcValid_j = false;
                                            break;
                                        }
                                    }
                                }
                                
                                if (arcValid_i || arcValid_j) {
                                    var that = this;
                                    if (arcValid_i && arcValid_j) {
                                        this._renderer.drawDimensions({x: center.mX,y: center.mY}, {x: center.mX - sign * distance,y: center.mY}, null, true,
                                        function(dis, canvas, seg, seg2, distance) {
                                            var originalX1 = seg.mStart.mPosition.mX;
                                            var originalX2 = seg2.mStart.mPosition.mX;
                                            
                                            seg.mStart.mPosition.mX = seg.mStart.mPosition.mX + 0.5 * Math.sign(distance) * (dis - Math.abs(distance));
                                            seg.mEnd.mPosition.mX = seg.mEnd.mPosition.mX + 0.5 * Math.sign(distance) * (dis - Math.abs(distance));
                                            
                                            seg2.mStart.mPosition.mX = seg2.mStart.mPosition.mX - 0.5 * Math.sign(distance) * (dis - Math.abs(distance));
                                            seg2.mEnd.mPosition.mX = seg2.mEnd.mPosition.mX - 0.5 * Math.sign(distance) * (dis - Math.abs(distance));
                                            
                                            var analysis = new Analysis(that._mFloor);
                                            analysis.execute();
                                            [that._outputResult,  that._innerResult] = Converter.outputGeo(that._mFloor);
                                            
                                            var overlapped = that._checkOverlap();
                                        
                                            if (overlapped)
                                            {
                                                
                                                seg.mStart.mPosition.mX = originalX1;
                                                seg.mEnd.mPosition.mX = originalX1;
                                                
                                                seg2.mStart.mPosition.mX = originalX2;
                                                seg2.mEnd.mPosition.mX = originalX2;
                                                
                                                var analysis = new Analysis(that._mFloor);
                                                analysis.execute();
                                                [that._outputResult,  that._innerResult] = Converter.outputGeo(that._mFloor);
                                                
                                            } else {
                                                that._pickedArea = null;
                                            }
                                            that.render();
                                            
                                        }, that, segments[i], segments[j], sign * distance);
                                    } else {
                                        var seg; 
                                        if (arcValid_i) {
                                            seg = segments[i];
                                        }
                                        if (arcValid_j) {
                                            seg = segments[j];
                                        }
                                        this._renderer.drawDimensions({x: center.mX,y: center.mY}, {x: center.mX - sign * distance,y: center.mY}, null, true,
                                        function(dis, canvas, seg, seg2, distance) {
                                            var originalX = seg.mStart.mPosition.mX;
                            
                                            seg.mStart.mPosition.mX = seg.mStart.mPosition.mX + Math.sign(distance) * (dis - Math.abs(distance));
                                            seg.mEnd.mPosition.mX = seg.mEnd.mPosition.mX + Math.sign(distance) * (dis - Math.abs(distance));
                                            
                                            var analysis = new Analysis(that._mFloor);
                                            analysis.execute();
                                            [that._outputResult,  that._innerResult] = Converter.outputGeo(that._mFloor);
                                            
                                            var overlapped = that._checkOverlap();
                                        
                                            if (overlapped)
                                            {
                                                
                                                seg.mStart.mPosition.mX = originalX;
                                                seg.mEnd.mPosition.mX = originalX;
                                                
                                                var analysis = new Analysis(that._mFloor);
                                                analysis.execute();
                                                [that._outputResult,  that._innerResult] = Converter.outputGeo(that._mFloor);
                                                
                                            } else {
                                                that._pickedArea = null;
                                            }
                                            that.render();
                                            
                                        }, that, seg, null, sign * distance);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            if (this._flags.isAbosoluteMarginEnabled) {
                for (var j = 0; j < boundries.length; j++) {
                    var edge2 = boundries[j].getTheStartEndEdge();
                    var angle2 = edge2.getAngle();
                    if (Angle.isVertical(angle2) && !SegmentController.isWithinSameArea(segments[i],boundries[j]) && MyEdge.getValidVerticalSection(edge, edge2, markLine)) {
                        markLine.mEnd.mX = boundries[j].mStart.mPosition.mX;
                        var valid = true;
                        for (var m = 0; m < this._mFloor.mCurves.length; m++) {
                            if (this._mFloor.mCurves[m] instanceof CurveController) {
                                continue;
                            }
                            var intersects = [];
                            if (SegmentController.isIntersectWith(markLine, this._mFloor.mCurves[m], intersects)) {
                                if (intersects.length > 0 && !Vec2.isEqual(intersects[0], markLine.mEnd)  && SegmentController.isWithinSameArea(segments[i],this._mFloor.mCurves[m]))
                                {
                                    valid = false;
                                    continue;
                                }
                            }
                        }
                        if(valid) {
                            var distance = Math.abs(segments[i].mStart.mPosition.mX - boundries[j].mStart.mPosition.mX);
                            if (maxDis < distance) {
                                sign = Math.sign(segments[i].mStart.mPosition.mX - boundries[j].mStart.mPosition.mX);
                                maxDis = distance;
                                center = markLine.mStart.clone();
                                validJ = -1;
                                isAbso = true;
                            }
                        }
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
                        var that = this;
                        this._renderer.drawDimensions({x: center.mX,y: center.mY}, {x: center.mX - sign * maxDis,y: center.mY}, null, true,
                        function(dis, canvas, seg, seg2, distance) {
                            var originalX = seg.mStart.mPosition.mX;
                            
                            seg.mStart.mPosition.mX = seg.mStart.mPosition.mX + Math.sign(distance) * (dis - Math.abs(distance));
                            seg.mEnd.mPosition.mX = seg.mEnd.mPosition.mX + Math.sign(distance) * (dis - Math.abs(distance));
                            
                            var analysis = new Analysis(that._mFloor);
                            analysis.execute();
                            [that._outputResult,  that._innerResult] = Converter.outputGeo(that._mFloor);
                            
                            var overlapped = that._checkOverlap();
                        
                            if (overlapped)
                            {
                                
                                seg.mStart.mPosition.mX = originalX;
                                seg.mEnd.mPosition.mX = originalX;
                                
                                
                                
                                var analysis = new Analysis(that._mFloor);
                                analysis.execute();
                                [that._outputResult,  that._innerResult] = Converter.outputGeo(that._mFloor);
                                
                            }
                            that.render();
                            
                        }, that, segments[i], null, sign * maxDis);
                    }
                }
            }
        }
    }
}

Canvas.prototype._renderMouseLines = function(x, y) {
    if (this._type == null || (x == undefined && y == undefined)) {
        return;
    }
    
    //snapping
    var snapX = [];
    var snapY = [];
    for (var j = 0; j < this._mFloor.mCurves.length; j++) {
        if (this._mFloor.mCurves[j].isBoundry || this._mFloor.mCurves[j] instanceof CurveController) {
            continue;
        }
        var edge2 = this._mFloor.mCurves[j].getTheStartEndEdge();
        var angle2 = edge2.getAngle();
        
        if (Angle.isHorizontal(angle2)) {
            snapY.push(edge2);
        }
        
        if (Angle.isVertical(angle2)) {
            snapX.push(edge2);
        }
        
    }
    
    var edgeX = [];
    var edgeY = [];
    var snappedX = false;
    var snappedY = false;
    var min = Number.MAX_VALUE;
    for (var i = 0; i < snapY.length; i++) {
        var dis = Math.abs(snapY[i].mStart.mY - y);
        if (dis <= min) {
            
            if (dis < min) {
                edgeY = [];
            }
            min = dis;
            edgeY.push(snapY[i]);
            
        }
    }
    if (min < 3) {
        y = edgeY[0].mStart.mY;
        snappedY = true;
    }
    
    min = Number.MAX_VALUE;
    for (var i = 0; i < snapX.length; i++) {
        var dis = Math.abs(snapX[i].mStart.mX - x);
        //console.log(i + " " + dis + " " + min);
        if (dis <= min) {
            
            if (dis < min) {
                edgeX = [];
            }
            edgeX.push(snapX[i]);
            min = dis;

        }
    }
    
    if (min < 3) {
        x = edgeX[0].mStart.mX;
        snappedX = true;
    }
    
    for (var j = 0; j < this._mFloor.mCurves.length; j++) {
        if (!this._mFloor.mCurves[j].isBoundry) {
            continue;
        }
        var edge2 = this._mFloor.mCurves[j].getTheStartEndEdge();
        var angle2 = edge2.getAngle();
        
        if (Angle.isHorizontal(angle2) && MyEdge.isPointWithinHorizontal(x, edge2)) {
            this._renderer.drawDimensions({x: x,y: y}, {x: x,y: edge2.mStart.mY});
        }
        if (Angle.isVertical(angle2) && MyEdge.isPointWithinVertical(y, edge2)) {
            this._renderer.drawDimensions({x: x,y: y}, {x: edge2.mStart.mX,y: y});
        }
    }
    
    if (edgeX.length > 0 && snappedX ) {
        
        var yDis = Number.MAX_VALUE;
        var ySnap = null;
        for (var i = 0; i < edgeX.length;i++) {
            if (!edgeX[i].pointInEdgeOrOnEdge(new Vec2(x, y))) {
                var dis1 = Math.abs(y - edgeX[i].mStart.mY);
                var dis2 = Math.abs(y - edgeX[i].mEnd.mY);
                if (dis1 < yDis) {
                    yDis = dis1;
                    ySnap = edgeX[i].mStart.mY;
                }
                if (dis2 < yDis) {
                    yDis = dis2;
                    ySnap = edgeX[i].mEnd.mY;
                }
            }
        }
        
        if (ySnap) {
            this._renderer.drawLine(new MyEdge(new Vec2(x, y), new Vec2(x, ySnap)), false, 'blue');
        }
    }
    
    if (edgeY.length > 0 && snappedY) {
        
        var xDis = Number.MAX_VALUE;
        var xSnap = null;
        
        for (var i = 0; i < edgeY.length; i++) {
            if (!edgeY[i].pointInEdgeOrOnEdge(new Vec2(x, y))) {
                var dis1 = Math.abs(x - edgeY[i].mStart.mX);
                var dis2 = Math.abs(x - edgeY[i].mEnd.mX);
                
                if (dis1 < xDis) {
                    xDis = dis1;
                    xSnap = edgeY[i].mStart.mX;
                }
                if (dis2 < xDis) {
                    xDis = dis2;
                    xSnap = edgeY[i].mEnd.mX;
                }
            }
        }
        
        if (xSnap) {
            this._renderer.drawLine(new MyEdge(new Vec2(x, y), new Vec2(xSnap, y)), false, 'blue');
        }
    }
    
    
}

Canvas.prototype._renderHintPoints = function() {
    for (var i = 0; i < this._hintPoints.length; i++) {
        this._renderer.drawIntersectCorner(this._hintPoints[i], 6);
    }
    this._hintPoints = [];
}

Canvas.prototype._renderPickedArea = function() {
    if (this._pickedArea) {
        this._renderer.drawArea(this._pickedArea);
        this._renderOutput();
        this._renderer.drawAreaDots(this._pickedArea);
    }
}

Canvas.prototype.setZoneSize = function(enabled) {
    this._flags.isZoneSizeEnabled = enabled;
    this.render();
}

Canvas.prototype.setAbsoluteMargin = function(enabled) {
    this._flags.isAbosoluteMarginEnabled = enabled;
    this.render();
}

Canvas.prototype.setRelativeDistance = function(enabled) {
    this._flags.isRelativeDistanceEnabled = enabled;
    this.render();
}

Canvas.prototype.setCrownHeight = function(enabled) {
    this._flags.isCrownHeightEnabled = enabled;
    this.render();
}

Canvas.prototype.render = function(x, y) {
    //清空canvas
    this._renderer.clear();
    
    //绘制已经分析完的图元
    this._renderOutput();
    
    //长方形，圆，线段等正在绘制的图元
    this._renderCurrentObject();
    
    this._renderMouseLines(x, y);
    
    this._renderMarkerLines();
    
    this._renderPickedArea();
    
    //绘制鼠标移动中经过的图元
    this._renderFocusObject(x, y);
    
    this._renderHintPoints();
}

Canvas.prototype.clear = function() {
    this._mFloor = new MyFloor();
    this._mWallCurveOperation = new WallCurveOperation(this._mFloor);
    this._outputResult = null;
    this._innerResult = null;
    this._currentStatus = STATUS.NOT_STARTED;
    this._type = null;
    this._mEdge = new MyEdge(new Vec2(), new Vec2());
    this._focus = null;
    this._updateElment = null;
    this._operationCurve = null; 
    this._hintPoints = [];
    
    this._linePoints = [];
    this._lineEdges = [];
    this._curentLine0 = null;
    this._curentLine1 = null;
    this._lineIntersect = {
        isStartIntersect : [],
        isSelfIntersect: [],
        isStartEndSame : [],
        isEndIntersect : []
    };
   this._pickedArea = null;
   this._initialize();
}


