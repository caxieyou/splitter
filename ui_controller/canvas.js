function Canvas(name) {
    this._canvas              = document.getElementById(name);
    this._mFloor              = new MyFloor();
    this._mWallCurveOperation = new WallCurveOperation(this._mFloor);
    this._renderer            = new Renderer();
    this.mElmentOperation     = new ElementOperation(this._mFloor);
    
    //this._currentStatus       = STATUS.NOT_STARTED;
    this._type                = null;
    this._mEdge               = new MyEdge(new Vec2(), new Vec2());
    this._focus               = null;
    this._updateElment        = null;
    this._operationCurve      = null; 
    this._hintPoints          = [];
    this._mouseSnapped        = new Vec2();

    this._flags = {
       isRelativeDistanceEnabled : false,
       isAbosoluteMarginEnabled : true,
       isZoneSizeEnabled : true,
       isCrownHeightEnabled : false
    };
    this._renderer.init(this._canvas);
    this._initialize();
}

Canvas.prototype._initialize = function() {
    //创建最外边框
    this.mElmentOperation.creatRect(new Vec2(0, 0), new Vec2(this._canvas.width, this._canvas.height), this._mFloor.mCurves);
    
    //赋值最外轮廓线
    var rect = new MyRect(new Vec2(0, 0), new Vec2(this._canvas.width, this._canvas.height));
    rect = rect.toMyPolygon();
    this._mFloor.setProfile(rect);
    this._mFloor.Analysis();
    this.render();
}
Canvas.prototype.snapMouse = function(x, y){
    this._mouseSnapped.set(x, y);
    
    if (this._type != null) {
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
        if (minDis < Globals.SNAPPING_THRESHOLD) {
            this._mouseSnapped.copy(minPoint);
        }
    } else {
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
        var min = Globals.DISTANCE_THRESHOLD;
        for (var i = 0; i < snapY.length; i++) {
            var dis = Math.abs(snapY[i].mStart.mY - y);
            if (dis <= min) {
                min = dis;
                this._mouseSnapped.mY = snapY[i].mStart.mY;
                snappedY = true;
            }
        }
        
        min =  Globals.DISTANCE_THRESHOLD;
        for (var i = 0; i < snapX.length; i++) {
            var dis = Math.abs(snapX[i].mStart.mX - x);
            if (dis <= min) {
                min = dis;
                this._mouseSnapped.mX = snapX[i].mStart.mX;
                snappedX = true;
            }
        }//mouse line
    }
    
    for (var i = 0; i < this._mFloor.mCorners.length; i++) {
        if (this._mFloor.mCorners[i].mPosition.isClose(new Vec2(x, y), Globals.DISTANCE_THRESHOLD)) {
            this._mouseSnapped.copy(this._mFloor.mCorners[i].mPosition);
            break;
        }
    }
    
    for (var i = 0; i < this._mFloor.mKeyPoints.length; i++) {
        if (this._mFloor.mKeyPoints[i].isClose(new Vec2(x, y), Globals.DISTANCE_THRESHOLD)) {
            this._mouseSnapped.copy(this._mFloor.mKeyPoints[i]);
        }
    }//key point
}

Canvas.prototype._renderCurrentObject = function() {
    if (!this.mElmentOperation.isDrawable()) {
        return;
    }
    
    switch(this._type) {
        case TYPE.RECTANGLE:
        {
            var edges = this._mEdge.toRectEdges();
            var intersects = this._mFloor.getIntersectPoints(edges);
            this._hintPoints = this._hintPoints.concat(intersects);
            this._renderer.drawRect(this._mEdge);
        }
        break;
        case TYPE.CIRCLE:
            this._renderer.drawCircle(this._mEdge);
        break;
        case TYPE.LINE:
        {
            [edges, eLine] = this.mElmentOperation.getDrawableLines();
            
            for (var i = 0; i < edges.length; i++) {
                this._renderer.drawLine(edges[i]);
            }
            
            if (eLine) {
                this._renderer.drawLine(eLine, true, 'red');
            }
        }
        break;
    }
}

Canvas.prototype.split = function(polygon) {
    var splitter = new Splitter(polygon, this._mFloor, this._mFloor.generatePolyTree());
    splitter.execute();
    
    this._mFloor.Analysis();
}

Canvas.prototype.createRect = function(pnt0, pnt1) {
    pnt0 = pnt0 || this._mEdge.mStart;
    pnt1 = pnt1 || this._mEdge.mEnd;
    console.log(this._mEdge);
    this.mElmentOperation.creatRect(pnt0, pnt1, this._mFloor.mCurves);
}

Canvas.prototype.createCircle = function() {
    this.mElmentOperation.createCircle(this._mEdge);
}

Canvas.prototype.setType = function(type) {
    this._type = type;
    
    if (this._type == TYPE.LINE) {
        this.mElmentOperation.setStatus(STATUS.LINE_START);
    }
    if (this._type == null) {
        document.body.style.cursor = "default";
    } else {
        document.body.style.cursor = "crosshair";
    }
    this._mFloor.clearPickedArea();
    this.render();
}

Canvas.prototype.setStartPoint = function() {
    if (this._type == null) {
        return false;
    }
    
    if (!this._mFloor.mProfile.mOutLines.contains(this._mouseSnapped)) {
        console.log("START POINT OUTSIDE OF ROOM!");
        return;
    }
    
    if (this.mElmentOperation.lineOperationStart(this._mouseSnapped.mX, this._mouseSnapped.mY, this._mFloor.mCurves)) {
        this._mEdge.mStart.copy(this._mouseSnapped);
    }
    this.render();
}

Canvas.prototype.setEndPoint = function() {
    if (this._type == null) {
        return false;
    }
    
    if (this._type != null) {
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
                var point = edge.getIntersectionPointByPoint(this._mouseSnapped, true);
                hintPoints.push(point);
            }
        }
        
        for (var i = 0; i < hintPoints.length; i++) {
            var dis = Vec2.distance(this._mouseSnapped, hintPoints[i]);
            if (dis < minDis) {
                minDis = dis;
                index = i;
                minPoint = hintPoints[i];
            }
        }
        if (minDis < Globals.SNAPPING_THRESHOLD) {
            this._hintPoints.push(minPoint);
        }
    }
    
    for (var i = 0; i < this._mFloor.mCorners.length; i++) {
        if (this._mFloor.mCorners[i].mPosition.isClose(this._mouseSnapped, Globals.DISTANCE_THRESHOLD)) {
            this._renderer.drawCorner(this._mFloor.mKeyPoints[i], 8, '#f57208');
            break;
        }
    }
    
    
    if (this.mElmentOperation.lineOperationEnd(this._mouseSnapped.mX, this._mouseSnapped.mY, this._mFloor.mCurves, this._hintPoints)) {
        this._mEdge.mEnd.copy(this._mouseSnapped);
        
        if (this._mEdge.getLength() < 0.0001) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

Canvas.prototype.resetType = function() {
    if (this.mElmentOperation.reset(this._mFloor.mCurves)) {
        
        this.setType(null);
    }
    this._focus = null;
    this.render();
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
    return this.mElmentOperation.checkStatus();
}

Canvas.prototype.renderAreaPicked = function(x, y) {
    if (this._mFloor.getPickedArea(x, y)) {
        this.render();
    }
}

Canvas.prototype.isMoved = function(x, y) {
    var p = new Vec2(x, y);
    if (p.distance(this._mouseSnapped) > Globals.DISTANCE_THRESHOLD ) {
        return true;
    } else {
        return false;
    }
}

Canvas.prototype.recordMouseUp = function(x, y) {
    var p = new Vec2(x, y);
    if (p.distance(this._mouseSnapped) > Globals.DISTANCE_THRESHOLD ) {
        this._focus = null;
    }
    this._updateElment = null;
}

Canvas.prototype.onSplitCurve = function() {
    this._mWallCurveOperation.onSplitCurve(this._operationCurve);
    this._operationCurve = null;
    this.render();
}

Canvas.prototype.onToLine = function() {
    this._mWallCurveOperation.onToLine(this._operationCurve);
    this._operationCurve = null;
    this.render();
}

Canvas.prototype.onToArc = function() {
    this._mWallCurveOperation.onToArc(this._operationCurve);
    this._operationCurve = null;
    this.render();
}

Canvas.prototype.onDelete = function() {
    this._mWallCurveOperation.onDelete(this._operationCurve);
    this._operationCurve = null;
    this.render();
}

Canvas.prototype.setOperationCurve = function() {
    this._operationCurve = this._focus.controller;
}

Canvas.prototype.updateElement = function(x, y){
    if (!this._updateElment && this._focus) {
        this._updateElment = this._focus;
        this._lastFocos = new Vec2(x, y);
    }
    
    if (this._updateElment) {
        console.log("controller been called: " + x + " " + y);
        var overlapped = this._mFloor.updatePosition(this._updateElment.controller, new Vec2(x, y), this._lastFocos);
        
        this.render(x, y);
        
        if (overlapped) {
            if (this._updateElment.controller instanceof MyCorner) {
                this._renderer.drawCorner(this._lastFocos, 8, '#f57208');
                this._renderer.drawCorner(new Vec2(x, y), 10, 'red');
            }
            return;
        }
        //this._mFloor.clearPickedArea();
        this._lastFocos.set(x, y);
    }
}

Canvas.prototype.createElement = function() {
    switch(this._type) {
        case TYPE.RECTANGLE:
            this.createRect();
        break;
        
        case TYPE.CIRCLE:
            this.createCircle();
        break;
        
        case TYPE.LINE :
            //Do nothing
        break;
    }
}

Canvas.prototype._renderFocusObject = function() {
    if (this._type != null) {
        return;
    }
    
    this._focus = null;
    if(this._mFloor.mProfile) {
        var profile = this._mFloor.mProfile.getProfile();
        for (var i = 0; i < profile.length; i++) {
            if (profile[i].pointInEdgeOrOnEdge(this._mouseSnapped, Globals.SNAPPING_THRESHOLD)) {
                return;
            }
        }
    }
    
    if(this._mFloor.mProfile) {
        var vertices = this._mFloor.mProfile.getVertices();
        for (var i = 0; i < vertices.length; i++) {
            if (vertices[i].isClose(this._mouseSnapped, Globals.SNAPPING_THRESHOLD)) {
                return;
            }
        }
    }
    
    /////////////////////
    // focus on corner //
    /////////////////////
    for (var i = 0; i < this._mFloor.mCorners.length; i++) {
        if (this._mFloor.mCorners[i].mPosition.isClose(this._mouseSnapped, Globals.SNAPPING_THRESHOLD)) {
            this._focus = {
                    geom: this._mFloor.mCorners[i].mPosition.clone(),
                    controller : this._mFloor.mCorners[i]
                };
            break;
        }
    }
    
    if (this._focus != null) {
        this._renderer.drawCorner(this._focus.geom, 8, '#f57208');
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
            if (edge.pointInEdgeOrOnEdge(this._mouseSnapped, Globals.SNAPPING_THRESHOLD)) {
                this._focus = {
                    geom: edge,
                    controller : curve
                };
                break;
            }
        } else if(curve instanceof CurveController) {
            var edge = curve.getCurveFromController();
            
            if (edge.isInsideCurveAndNotOnCurve(this._mouseSnapped, Globals.SNAPPING_THRESHOLD)) {
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
    this._mFloor.renderMarkerLines(this._flags, this._renderer, this);
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
    var min = 3;
    for (var i = 0; i < snapY.length; i++) {
        var dis = Math.abs(snapY[i].mStart.mY - y);
        if (dis <= min) {
            min = dis;
            y = snapY[i].mStart.mY;
            snappedY = true;
        }
    }
    
    min = 3;
    for (var i = 0; i < snapX.length; i++) {
        var dis = Math.abs(snapX[i].mStart.mX - x);
        if (dis <= min) {
            min = dis;
            x = snapX[i].mStart.mX;
            snappedX = true;
        }
    }
    this._mouseSnapped.set(x, y);
    for (var j = 0; j < this._mFloor.mCurves.length; j++) {
        if (!this._mFloor.mCurves[j].isBoundry) {
            continue;
        }
        var edge2 = this._mFloor.mCurves[j].getTheStartEndEdge();
        var angle2 = edge2.getAngle();
        
        if (Angle.isHorizontal(angle2) && MyEdge.isPointWithinHorizontal(x, edge2)) {
            this._renderer.drawDimensions({x: x,y: y}, {x: x,y: edge2.mStart.mY}, snappedX ? "blue" : null);
        }
        if (Angle.isVertical(angle2) && MyEdge.isPointWithinVertical(y, edge2)) {
            this._renderer.drawDimensions({x: x,y: y}, {x: edge2.mStart.mX,y: y}, snappedY ? "blue" : null);
        }
    }
}

Canvas.prototype._renderHintPoints = function() {
    for (var i = 0; i < this._hintPoints.length; i++) {
        this._renderer.drawIntersectCorner(this._hintPoints[i], 6);
    }
    this._hintPoints = [];
}

Canvas.prototype._renderKeyPoints = function() {
    for (var i = 0; i < this._mFloor.mKeyPoints.length; i++) {
        if (this._mFloor.mKeyPoints[i].isClose(this._mouseSnapped, Globals.DISTANCE_THRESHOLD)) {
            this._renderer.drawCorner(this._mFloor.mKeyPoints[i], 8, '#f57208');
        }
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

Canvas.prototype.render = function() {
    //清空canvas
    this._renderer.clear();
    
    //绘制已经分析完的图元
    this._mFloor.renderOutput(this._renderer);
    
    //长方形，圆，线段等正在绘制的图元
    this._renderCurrentObject();
    
    this._renderMouseLines();
    
    this._renderMarkerLines();
    
    this._mFloor.renderPickedArea(this._renderer);
    
    //绘制鼠标移动中经过的图元
    this._renderFocusObject();
    
    this._renderHintPoints();
    
    //渲染那些几何中点，边界点，中心位置
    this._renderKeyPoints();
    
    //画选中点的边界的长度
    this._renderer.drawCornerDimentions(this._updateElment);
}

Canvas.prototype.clear = function() {
    this._mFloor = new MyFloor();
    this._mWallCurveOperation = new WallCurveOperation(this._mFloor);
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
   this._initialize();
}