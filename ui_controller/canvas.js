var ScaleMouse = function(x, y) {
    return [(x - Globals.Offset.mX) / Globals.Scale, (y - Globals.Offset.mY) / Globals.Scale];
}

function Canvas(name) {
    this._canvas              = document.getElementById(name);
    this._mFloor              = new MyFloor();
    this._mWallCurveOperation = new WallCurveOperation(this._mFloor);
    this._renderer            = new Renderer();
    this.mElmentOperation     = new ElementOperation(this._mFloor);
    
    this._type                = null;
    this._mEdge               = new MyEdge(new Vec2(), new Vec2());
    //this._focus               = null;
    this._updateElment        = null;
    this._operationCurve      = null; 
    this._hintPoints          = [];
    this.mSnap                = new Snap(this._mFloor);
    this.toggleHeightUI       = null;
    
    this._flags = {
       isRelativeDistanceEnabled : false,
       isAbosoluteMarginEnabled : true,
       isZoneSizeEnabled : true,
       isCrownHeightEnabled : false
    };
    this._renderer.init(this._canvas);
    this.resize(this._canvas.width, this._canvas.height);
    
    this._initialize();
}

Canvas.prototype._initialize = function() {
    
    /*
    //创建最外边框
    this.mElmentOperation.creatRect(new Vec2(0, 0), Globals.Size);
    //赋值最外轮廓线
    var rect = new MyRect(new Vec2(0, 0), Globals.Size);
    rect = rect.toMyPolygon();
    this._mFloor.setProfile(rect);
    */
    
    var points = [];
    points.push(new Vec2(0, 0));
    points.push(new Vec2(800, 0));
    points.push(new Vec2(800, 400));
    points.push(new Vec2(400, 400));
    points.push(new Vec2(400, 800));
    points.push(new Vec2(0, 800));
    
    var poly = new MyPolygon(points);
    
    var splitter = new Splitter(poly.getEdges(), this._mFloor, this._mFloor.generatePolyTree());
    splitter.execute();
    this._mFloor.Analysis();
    
    this._mFloor.setProfile(poly);
    
    this._mFloor.Analysis();
    this.render();
}
Canvas.prototype.snapMouse = function(x, y, isSnap){
    [x, y] = ScaleMouse(x, y);
    this.mSnap.snap(x, y, this._type, isSnap);
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
                this._renderer.drawLine(eLine, Style.OverLine.isDash, Style.OverLine.color);
            }
        }
        break;
    }
}

Canvas.prototype.resize = function(width, height) {
    this._canvas.width = width;
    this._canvas.height = height;
    
    var cX = this._canvas.width / 2 ;
    var cY = this._canvas.height / 2;
    
    var width = this._canvas.width - 100;
    var height = this._canvas.height - 100;
    
    var sX = Globals.Size.mX / width;
    var sY = Globals.Size.mY / height;
    
    var s = Math.max(sY, sX);
    
    var nW = Globals.Size.mX / s;
    var nH = Globals.Size.mY / s;
    
    Globals.Scale = 1 / s;
    
    Globals.Offset.mX = cX - nW / 2;
    Globals.Offset.mY = cY - nH / 2;
}

Canvas.prototype.createRect = function(pnt0, pnt1) {
    pnt0 = pnt0 || this._mEdge.mStart;
    pnt1 = pnt1 || this._mEdge.mEnd;
    console.log(this._mEdge);
    this.mElmentOperation.creatRect(pnt0, pnt1);
}

Canvas.prototype.createCircle = function() {
    this.mElmentOperation.createCircle(this._mEdge);
}

Canvas.prototype.isMovable = function() {
    if (this._type != null || this.mSnap.mFocus.controller != null) {
        return false;
    }
    
    return true;
}

Canvas.prototype.setType = function(type) {
    this._type = type;
    
    if (this._type == TYPE.LINE) {
        this.mElmentOperation.setStatus(STATUS.LINE_START);
    } else {
        this.mElmentOperation.setStatus(STATUS.NOT_STARTED);
    }
    if (this._type == null) {
        document.body.style.cursor = "default";
    } else {
        document.body.style.cursor = "crosshair";
    }
    this._mFloor.clearPickedArea();
    this._operationCurve = null;
    this.toggleHeightUI("", 0, false);
    this.render();
}

Canvas.prototype.setStartPoint = function() {
    if (this._type == null) {
        return false;
    }
    
    if (this._type != TYPE.LINE && !this._mFloor.mProfile.mOutLines.contains(this.mSnap.mouseSnapped)) {
        console.log("START POINT OUTSIDE OF ROOM!");
        return;
    }
    
    if (this.mElmentOperation.lineOperationStart(this.mSnap.mouseSnapped)) {
        this._mEdge.mStart.copy(this.mSnap.mouseSnapped);
    }
    this.render();
}

Canvas.prototype.setEndPoint = function() {
    if (this._type == null) {
        return false;
    }
    if (this.mSnap.mFocus.hintpoint) {
        this._hintPoints.push(this.mSnap.mFocus.hintpoint.clone());
    }

    if (this.mElmentOperation.lineOperationEnd(this.mSnap.mouseSnapped, this._hintPoints)) {
        this._mEdge.mEnd.copy(this.mSnap.mouseSnapped);
        
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
    if (this.mElmentOperation.reset()) {
        this.setType(null);
    }
    this.mSnap.clearFocus();
    this._operationCurve = null;
    this.render();
}

Canvas.prototype.getDrawType = function() {
    return this._type;
}

Canvas.prototype.getFocusElement = function() {
    //console.log(this.mSnap.mFocus.geom);
    if (this.mSnap.mFocus.geom) {
        return this.mSnap.mFocus.geom;
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

Canvas.prototype.setAreaHeight = function(sign, val) {
    this._mFloor.setAreaHeight(sign, val);
    this.render();
}

Canvas.prototype.setAreaName = function(name){
    this._mFloor.setAreaName(name);
}

Canvas.prototype.renderAreaPicked = function(x, y) {
    if (Globals.IsMovable) {
        return;
    }
    [x, y] = ScaleMouse(x, y);
    if (!this._mFloor.mProfile.mOutLines.contains(this.mSnap.mouseSnapped)) {
        console.log("START POINT OUTSIDE OF ROOM!");
        return;
    }
    if (this._mFloor.getPickedArea(x, y)) {
        this.render();
        this._operationCurve = null;
        this.toggleHeightUI(this._mFloor.getAreaName(), this._mFloor.getAreaHeight(), true);
    }
}

Canvas.prototype.isMoved = function(x, y) {
    [x, y] = ScaleMouse(x, y);
    var p = new Vec2(x, y);
    if (p.distance(this.mSnap.mouseSnapped) > Globals.DISTANCE_THRESHOLD ) {
        return true;
    } else {
        return false;
    }
}

Canvas.prototype.recordMouseUp = function(x, y) {
    [x, y] = ScaleMouse(x, y);
    var p = new Vec2(x, y);
    if (p.distance(this.mSnap.mouseSnapped) > Globals.DISTANCE_THRESHOLD ) {
        //this._focus = null;
        this.mSnap.clearFocus();
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
    this._operationCurve = this.mSnap.mFocus.controller;
    this._mFloor.clearPickedArea();
    this.render();
}

Canvas.prototype.updateElement = function(x, y){
    [x, y] = ScaleMouse(x, y);
    if (!this._updateElment && this.mSnap.mFocus.controller) {
        this._updateElment = this.mSnap.mFocus.controller;
        //this._lastFocos = new Vec2(x, y);
    }
    
    if (this._updateElment) {
        this.toggleHeightUI("", 0, false);
        var overlapped = this._mFloor.updatePosition(this._updateElment, new Vec2(x, y));
        
        if (this._updateElment instanceof SegmentController) {
            this.mSnap.mFocus.geom = this._updateElment.getTheStartEndEdge();
        } else if(this._updateElment instanceof CurveController) {
            this.mSnap.mFocus.geom =  this._updateElment.getCurveFromController();
        } else {
            this.mSnap.mFocus.geom = this._updateElment.mPosition.clone();
        }
        this.mSnap.mFocus.keypoint = null;
        this.render();
        if (overlapped) {
            if (this._updateElment instanceof MyCorner) {
                var last = this._updateElment.getLast();
                this._renderer.drawLine(new MyEdge(last, new Vec2(x, y)), Style.OverLine.isDash, Style.OverLine.color)
                this._renderer.drawCorner(last, Style.UpdateCorner.radius, Style.UpdateCorner.color);
                this._renderer.drawCorner(new Vec2(x, y), Style.ErrorCorner.radius, Style.ErrorCorner.color);
            }
            return;
        }
        //this._lastFocos.set(x, y);
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
    
    if (this.mSnap.mFocus.geom instanceof MyEdge) {
        this._renderer.drawLine(this.mSnap.mFocus.geom, null, null, true);
        
    } else if(this.mSnap.mFocus.geom instanceof MyCurve) {
        this._renderer.drawArc(this.mSnap.mFocus.geom, true);
        
    } else if(this.mSnap.mFocus.geom instanceof Vec2) {
        this._renderer.drawCorner(this.mSnap.mFocus.geom, Style.FocusCorner.radius, Style.FocusCorner.color);
    }
    
    if (this._operationCurve) {
        if (this._operationCurve instanceof SegmentController) {
            this._renderer.drawLine(this._operationCurve.getTheStartEndEdge(), null, null, true);
            
        } else if(this._operationCurve instanceof CurveController) {
            this._renderer.drawArc(this._operationCurve.getCurveFromController(), true);
            
        }
    }
}

Canvas.prototype._renderMarkerLines = function() {
    this._mFloor.renderMarkerLines(this._flags, this._renderer, this);
}

Canvas.prototype._renderMouseLines = function() {
    if (this._type == null || !this.mSnap.mIsInside) {
        return;
    }
    
    for (var i = 0; i < this.mSnap.mFocus.snapXEdge.length; i++) {
        var edge = this.mSnap.mFocus.snapXEdge[i];
        this._renderer.drawDimensions({x: edge.mStart.mX,y: edge.mStart.mY}, {x: edge.mEnd.mX,y: edge.mEnd.mY}, this.mSnap.mFocus.snapX ? Style.RulerSnap.color : null);
    }

    for (var i = 0; i < this.mSnap.mFocus.snapYEdge.length; i++) {
        var edge = this.mSnap.mFocus.snapYEdge[i];
        this._renderer.drawDimensions({x: edge.mStart.mX,y: edge.mStart.mY}, {x: edge.mEnd.mX,y: edge.mEnd.mY}, this.mSnap.mFocus.snapY ? Style.RulerSnap.color : null);
    }
}

Canvas.prototype._renderHintKeyPoints = function() {
    for (var i = 0; i < this._hintPoints.length; i++) {
        var isClose = false;
        for (var j = 0; j < this._mFloor.mCorners.length; j++) {
            if (this._mFloor.mCorners[j].mPosition.isClose(this._hintPoints[i])) {
                isClose = true;
                break;
            }
        }
        
        //2 和重心，中点比
        if (!isClose) {
            for (var j = 0; j < this._mFloor.mKeyPoints.length; j++) {
                if (this._mFloor.mKeyPoints[j].isClose(this._hintPoints[i])) {
                    isClose = true;
                    break;
                }
            }
        }
        if (isClose) {
            this._renderer.drawCorner(this._hintPoints[i], Style.OverlapCorner.radius, Style.OverlapCorner.color);
        } else {
            this._renderer.drawIntersectCorner(this._hintPoints[i], Style.IntersectCorner.color);
        }
        
    }
    this._hintPoints = [];
    
    if (this.mSnap.mFocus.keypoint) {
        this._renderer.drawCorner(this.mSnap.mFocus.keypoint, Style.FocusCorner.radius, Style.FocusCorner.color);
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
    
    this._mFloor.renderPickedArea(this._renderer);
    
    this._renderMarkerLines();
    
    //绘制鼠标移动中经过的图元
    this._renderFocusObject();
    
    //渲染那些几何中点，边界点，中心位置
    this._renderHintKeyPoints();
    
    //画选中点的边界的长度
    this._renderer.drawCornerDimentions(this._updateElment);
    
}

Canvas.prototype.clear = function() {
    this._renderer.removeAllTextInputs();
    this._mFloor              = new MyFloor();
    this._mWallCurveOperation = new WallCurveOperation(this._mFloor);
    this._renderer            = new Renderer();
    this.mElmentOperation     = new ElementOperation(this._mFloor);
    
    this._type                = null;
    this._mEdge               = new MyEdge(new Vec2(), new Vec2());
    this._updateElment        = null;
    this._operationCurve      = null; 
    this._hintPoints          = [];
    this.mSnap                = new Snap(this._mFloor);
    this._renderer.init(this._canvas);
    this._initialize();
}