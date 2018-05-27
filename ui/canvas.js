var ScaleMouse = function(x, y) {
    return [(x - Globals.Offset.mX) / Globals.Scale, (y - Globals.Offset.mY) / Globals.Scale];
}

function Canvas(name, shape) {
    this._canvas                = document.getElementById(name);
    this._mFloor                = new Floor();
    this._mRenderer             = new Renderer();
    this._mElmentDrawer         = new ElementDrawer(this._mFloor);    //处理UI绘制的图元
    this._mElementProcessor     = new ElementProcessor(this._mFloor); //处理图元的分裂，删除，性质改变
    this._mSnap                 = new Snap(this._mFloor);
    this._mEdge                 = new Edge(new Vec2(), new Vec2());
    this._mHintPoints           = [];
    this._mUpdateElment         = null;     //需要调整位置，移动的图元
    this._mProcessElement       = null;     //需要改变性质的图元（直线变曲线，分裂等）
    this._mType                 = null;
    this._mProfile              = shape;
    this._mRecordsCurrent       = [];
    this._mRecordsForward       = [];
    this.toggleHeightUICallback = null;
    
    this._flags = {
       isRelativeDistanceEnabled : false,
       isAbosoluteMarginEnabled  : true,
       isZoneSizeEnabled         : true,
       isCrownHeightEnabled      : false
    };
    
    this._mRenderer.init(this._canvas);
    this.resize(this._canvas.width, this._canvas.height);
    this._initialize();
}
//Initialize as an array of points, which is type of Vec2
Canvas.prototype._initialize = function(forget) {
    if (!this._mProfile) {
        this._mProfile = [];
        this._mProfile.push(new Vec2(0, 0));
        this._mProfile.push(new Vec2(4000, 0));
        this._mProfile.push(new Vec2(4000, 1600));
        this._mProfile.push(new Vec2(1600, 1600));
        this._mProfile.push(new Vec2(1600, 4000));
        this._mProfile.push(new Vec2(0, 4000));
    }

    var poly = new Polygon(this._mProfile);
    
    this._mElmentDrawer.add(poly.getEdges());
    this._mFloor.setProfile(poly);
    this._mFloor.Analysis(Floor.ANALYSIS_INIT);
    if (!forget) {
        this._record();
    }
    this.render();
}

Canvas.prototype.snapMouse = function(x, y, isSnap){
    [x, y] = ScaleMouse(x, y);
    this._mSnap.snap(x, y, this._mType, isSnap, this._mElmentDrawer.getSnapLines());
}

//绘制当前正在滑动的圆，直线，Rect等
Canvas.prototype._renderCurrentPrimitive = function(foucs) {
    if (!this._mElmentDrawer.isDrawable()) {
        return;
    }
    
    switch(this._mType) {
        case TYPE.RECTANGLE:
        {
            var edges = this._mEdge.toRectEdges();
            var intersects = this._mFloor.getIntersectPoints(edges);
            this._mHintPoints = this._mHintPoints.concat(intersects);
            this._mRenderer.drawRect(this._mEdge);
            
            var leftup = new Vec2(Math.min(this._mEdge.mStart.mX, this._mEdge.mEnd.mX), Math.min(this._mEdge.mStart.mY, this._mEdge.mEnd.mY));
            var rightbuttom = new Vec2(Math.max(this._mEdge.mStart.mX, this._mEdge.mEnd.mX), Math.max(this._mEdge.mStart.mY, this._mEdge.mEnd.mY));
            var edge1 = new Edge(leftup.clone(), new Vec2(rightbuttom.mX, leftup.mY));
            var edge2 = new Edge(new Vec2(rightbuttom.mX, leftup.mY), rightbuttom.clone());
            
            
            var t1 = this._mRenderer.drawSegment(edge1, true, Utility.DrawRectCallback1, this, edge1);
            var t2 = this._mRenderer.drawSegment(edge2, true, Utility.DrawRectCallback2, this, edge2);
            if (foucs) {
                t2.select();
            } else {
                t1.select();
            }
        }
        break;
        case TYPE.CIRCLE:
            this._mRenderer.drawCircle(this._mEdge);
            this._mRenderer.drawSegment(this._mEdge, false, Utility.DrawCircleRadiusCallback, this, true);
        break;
        case TYPE.LINE:
        {
            [edges, eLine] = this._mElmentDrawer.getDrawableLines();
            
            for (var i = 0; i < edges.length; i++) {
                this._mRenderer.drawLine(edges[i]);
            }
            
            if (edges.length > 0 && this._mElmentDrawer.mStatus == STATUS.LINE_DRAWING) {
                var lastEdge = edges[edges.length - 1];
                this._mRenderer.drawSegment(lastEdge, true, Utility.DrawLineCallback, this, lastEdge);
            }
            
            if (eLine) {
                this._mRenderer.drawLine(eLine, Style.OverLine.isDash, Style.OverLine.color);
            }
        }
        break;
    }
}

//改变页面尺寸
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
    Globals.Scale = Math.min(Math.max(Globals.Scale, 0.1), 2);
    Globals.Offset.mX = cX - nW / 2;
    Globals.Offset.mY = cY - nH / 2;
}

Canvas.prototype.createRect = function(p0, p1) {
    p0 = p0 || this._mEdge.mStart;
    p1 = p1 || this._mEdge.mEnd;
    this._mElmentDrawer.creatRect(p0, p1);
    this.render();
}

Canvas.prototype.createCircle = function() {
    this._mElmentDrawer.createCircle(this._mEdge);
    this.render();
}

//页面是否可拖动
Canvas.prototype.isDraggable = function() {
    if (this._mSnap.mFocus.controller == null) {
        return true;
    } else {
        return false;
    }
}

Canvas.prototype.setType = function(type) {
    if (this._mType == type) {
        return;
    }
    //停止正在绘制的过程
    this._mElmentDrawer.stop();
    this._mType = type;
    
    if (this._mType == TYPE.LINE) {
        this._mElmentDrawer.setStatus(STATUS.LINE_START);
    } else {
        this._mElmentDrawer.setStatus(STATUS.NOT_STARTED);
    }
    if (this._mType == null) {
        document.body.style.cursor = "default";
    } else {
        document.body.style.cursor = "crosshair";
    }
    this._mFloor.clearPickedArea();
    this._mProcessElement = null;
    this.toggleHeightUICallback("", 0, false);
    this.render();
}

Canvas.prototype.setStartPoint = function() {
    if (this._mType == null) {
        return false;
    }
    
    if (this._mElmentDrawer.isStart() && !this._mFloor.mProfile.mOutLines.containsInclusive(this._mSnap.mouseSnapped)) {
        console.log("START POINT OUTSIDE OF ROOM!");
        return;
    }
    if (this._mElmentDrawer.lineOperationStart(this._mSnap.mouseSnapped)) {
        this._mEdge.mStart.copy(this._mSnap.mouseSnapped);
    }
}

Canvas.prototype.setEndPoint = function() {
    if (this._mType == null) {
        return false;
    }
    
    if (this._mSnap.mFocus.hintpoint) {
        this._mHintPoints.push(this._mSnap.mFocus.hintpoint.clone());
    }

    if (this._mElmentDrawer.lineOperationEnd(this._mSnap.mouseSnapped, this._mHintPoints)) {
        
        this._mEdge.mEnd.copy(this._mSnap.mouseSnapped);
        
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
    var status = this._mElmentDrawer.mStatus;
    
    if (this._mElmentDrawer.reset()) {
        var type = this._mType;
        this.setType(null);
        
        if ((status == STATUS.LINE_START || status == STATUS.NOT_STARTED) 
            && (this._mElmentDrawer.mStatus == STATUS.NOT_STARTED)
            && type != null) {
                this._record();
                this._mRecordsForward = [];
            }
    }
    this._mSnap.clearFocus();
    this._mFloor.clearPickedArea();
    this._mProcessElement = null;
    this.render();
}

Canvas.prototype.SettingBack = function() {
    
    if (this._mRecordsCurrent.length > 1) {
        var d = this._mRecordsCurrent.pop();
        this._mRecordsForward.push(d);
        this.load(this._mRecordsCurrent[this._mRecordsCurrent.length - 1], true);
    }
    this.toggleHeightUICallback(null, null, false);
    this._updateBackForwardUI();
}


Canvas.prototype.SettingForward = function() {
    
    if (this._mRecordsForward.length > 0) {
        var d = this._mRecordsForward.pop();
        this._mRecordsCurrent.push(d);
        this.load(d, true);
    }
    this.toggleHeightUICallback(null, null, false);
    this._updateBackForwardUI();
    
}

//return 2 values, first is revertable, second is forwardable
Canvas.prototype.checkSettingStatus = function() {
    return [this._mRecordsCurrent.length > 1, this._mRecordsForward.length > 0];
}

Canvas.prototype._record = function() {
    var d = jQuery.parseJSON(JSON.stringify(this.dump()));
    console.log(d);
    this._mRecordsCurrent.push(d);
    
    this._updateBackForwardUI();
}

Canvas.prototype._updateBackForwardUI = function() {
    var event = document.createEvent('Event');
    event.initEvent('operationStaus', true, false);
    event.data = this.checkSettingStatus();
    window.dispatchEvent(event);
    event = null;
}

Canvas.prototype.getType = function() {
    return this._mType;
}

Canvas.prototype.getFocusElement = function() {
    if (this._mSnap.mFocus.geom) {
        return this._mSnap.mFocus.geom;
    } else {
        return null;
    }
}

Canvas.prototype.setAreaHeight = function(sign, val) {
    this._mFloor.setAreaHeight(sign, val);
    this._record();
    this.render();
}

Canvas.prototype.setAreaName = function(name){
    this._mFloor.setAreaName(name);
}

Canvas.prototype.renderAreaPicked = function(x, y) {
    if (Globals.IsDragging) {
        return;
    }
    [x, y] = ScaleMouse(x, y);
    if (!this._mFloor.mProfile.mOutLines.contains(this._mSnap.mouseSnapped)) {
        console.log("START POINT OUTSIDE OF ROOM!");
        return;
    }
    if (this._mFloor.getPickedArea(x, y)) {
        this.render();
        this._mProcessElement = null;
        this.toggleHeightUICallback(this._mFloor.getAreaName(), this._mFloor.getAreaHeight(), true);
    }
}

Canvas.prototype.isMouseMoved = function(x, y) {
    [x, y] = ScaleMouse(x, y);
    var p = new Vec2(x, y);
    if (p.distance(this._mSnap.mouseSnapped) > Globals.DISTANCE_THRESHOLD ) {
        return true;
    } else {
        return false;
    }
}

Canvas.prototype.recordMouseUp = function(x, y) {
    [x, y] = ScaleMouse(x, y);
    var p = new Vec2(x, y);
    if (p.distance(this._mSnap.mouseSnapped) > Globals.DISTANCE_THRESHOLD ) {
        //this._focus = null;
        this._mSnap.clearFocus();
    }
    this._mUpdateElment = null;
}

Canvas.prototype.onSplitCurve = function() {
    this._mElementProcessor.onSplitCurve(this._mProcessElement);
    this._mProcessElement = null;
    this._record();
    this.render();
}

Canvas.prototype.onToLine = function() {
    this._mElementProcessor.onToLine(this._mProcessElement);
    this._mProcessElement = null;
    this._record();
    this.render();
}

Canvas.prototype.onToArc = function() {
    this._mElementProcessor.onToArc(this._mProcessElement);
    this._mProcessElement = null;
    this._record();
    this.render();
}

Canvas.prototype.onDelete = function() {
    this._mElementProcessor.onDelete(this._mProcessElement);
    this._mProcessElement = null;
    this._mSnap.clearFocus();
    this._record();
    this.render();
}

Canvas.prototype.setOperationCurve = function() {
    this._mProcessElement = this._mSnap.mFocus.controller;
    this._mFloor.clearPickedArea();
    this.render();
}

Canvas.prototype.deleteFocus = function() {
    if (this._mProcessElement) {
        this.onDelete();
    } else if (this._mSnap.mFocus.controller instanceof Segment || this._mSnap.mFocus.controller instanceof Arc) {
        this._mProcessElement = this._mSnap.mFocus.controller;
        this._mFloor.clearPickedArea();
        this._mElementProcessor.onDelete(this._mProcessElement);
        this._mProcessElement = null;
        this._mSnap.clearFocus();
        this.render();
    }
}


Canvas.prototype.updateElement = function(x, y){
    [x, y] = ScaleMouse(x, y);
    if (!this._mUpdateElment && this._mSnap.mFocus.controller) {
        this._mUpdateElment = this._mSnap.mFocus.controller;
        this._mProcessElement = null;
    }
    
    if (this._mUpdateElment) {
        this.toggleHeightUICallback("", 0, false);
        var overlapped = this._mFloor.updatePosition(this._mUpdateElment, new Vec2(x, y));
        
        if (this._mUpdateElment instanceof Segment) {
            this._mSnap.mFocus.geom = this._mUpdateElment.getTheStartEndEdge();
        } else if(this._mUpdateElment instanceof Arc) {
            this._mSnap.mFocus.geom =  this._mUpdateElment.getCurve();
        } else {
            this._mSnap.mFocus.geom = this._mUpdateElment.mPosition.clone();
        }
        this._mSnap.mFocus.keypoint = null;
        this.render();
        if (overlapped) {
            if (this._mUpdateElment instanceof Corner) {
                var last = this._mUpdateElment.getLast();
                this._mRenderer.drawLine(new Edge(last, new Vec2(x, y)), Style.OverLine.isDash, Style.OverLine.color)
                this._mRenderer.drawCorner(last, Style.UpdateCorner.radius, Style.UpdateCorner.color);
                this._mRenderer.drawCorner(new Vec2(x, y), Style.ErrorCorner.radius, Style.ErrorCorner.color);
            }
            return;
        }
    }
}

Canvas.prototype.createElement = function() {
    
    if (!this._mElmentDrawer.checkStatus()) {
        return;
    }
    
    switch(this._mType) {
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

Canvas.prototype._renderFocusPrimitive = function() {
    if (this._mType != null) {
        return;
    }
    
    if (this._mSnap.mFocus.geom instanceof Edge) {
        this._mRenderer.drawLine(this._mSnap.mFocus.geom, null, null, true);
        
    } else if(this._mSnap.mFocus.geom instanceof Curve) {
        this._mRenderer.drawArc(this._mSnap.mFocus.geom, true);
        
    } else if(this._mSnap.mFocus.geom instanceof Vec2) {
        this._mRenderer.drawCorner(this._mSnap.mFocus.geom, Style.FocusCorner.radius, Style.FocusCorner.color);
    }
    
    if (this._mProcessElement) {
        if (this._mProcessElement instanceof Segment) {
            this._mRenderer.drawLine(this._mProcessElement.getTheStartEndEdge(), null, null, true);
            
        } else if(this._mProcessElement instanceof Arc) {
            this._mRenderer.drawArc(this._mProcessElement.getCurve(), true);
            
        }
    }
}

Canvas.prototype._renderMarkerLines = function() {
    this._mFloor.renderMarkerLines(this._flags, this._mRenderer, this);
}

Canvas.prototype._renderMouseLines = function() {
    if (this._mType == null || !this._mSnap.mIsInside) {
        return;
    }
    
    for (var i = 0; i < this._mSnap.mFocus.snapXEdge.length; i++) {
        var edge = this._mSnap.mFocus.snapXEdge[i];
        this._mRenderer.drawDimensions({x: edge.mStart.mX,y: edge.mStart.mY}, {x: edge.mEnd.mX,y: edge.mEnd.mY}, this._mSnap.mFocus.snapX ? Style.RulerSnap.color : null);
    }

    for (var i = 0; i < this._mSnap.mFocus.snapYEdge.length; i++) {
        var edge = this._mSnap.mFocus.snapYEdge[i];
        this._mRenderer.drawDimensions({x: edge.mStart.mX,y: edge.mStart.mY}, {x: edge.mEnd.mX,y: edge.mEnd.mY}, this._mSnap.mFocus.snapY ? Style.RulerSnap.color : null);
    }
}

Canvas.prototype._renderHintKeyPoints = function() {
    for (var i = 0; i < this._mHintPoints.length; i++) {
        var isClose = false;
        for (var j = 0; j < this._mFloor.mCorners.length; j++) {
            if (this._mFloor.mCorners[j].mPosition.isClose(this._mHintPoints[i])) {
                isClose = true;
                break;
            }
        }
        
        //2 和重心，中点比
        if (!isClose) {
            for (var j = 0; j < this._mFloor.mKeyPoints.length; j++) {
                if (this._mFloor.mKeyPoints[j].isClose(this._mHintPoints[i])) {
                    isClose = true;
                    break;
                }
            }
        }
        if (isClose) {
            this._mRenderer.drawCorner(this._mHintPoints[i], Style.OverlapCorner.radius, Style.OverlapCorner.color);
        } else {
            this._mRenderer.drawIntersectCorner(this._mHintPoints[i], Style.IntersectCorner.color);
        }
        
    }
    this._mHintPoints = [];
    
    if (this._mSnap.mFocus.keypoint) {
        this._mRenderer.drawCorner(this._mSnap.mFocus.keypoint, Style.FocusCorner.radius, Style.FocusCorner.color);
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

Canvas.prototype.render = function(focus) {
    //清空canvas
    this._mRenderer.clear();
    
    //绘制已经分析完的图元
    this._mFloor.renderOutput(this._mRenderer);
    
    //长方形，圆，线段等正在绘制的图元
    this._renderCurrentPrimitive(focus);
    
    //画鼠标线
    this._renderMouseLines();
    
    //画选中区域
    this._mFloor.renderPickedArea(this._mRenderer);
    
    //画区域标记线
    this._renderMarkerLines();
    
    //绘制鼠标移动中经过的图元
    this._renderFocusPrimitive();
    
    //渲染那些几何中点，边界点，中心位置
    this._renderHintKeyPoints();
    
    //画选中点的边界的长度
    this._mRenderer.drawCornerDimentions(this._mUpdateElment);

    //画对齐边
    this._mFloor.renderAlignment(this._mRenderer, this._mUpdateElment);
}

Canvas.prototype.dump = function() {
    return this._mFloor.dump();
}

Canvas.prototype.load = function(data, forget) {
    var res = this._mFloor.transferJsonToGeom(data);
    console.log(res);
    console.log(data);
    this._mProfile = res.profile;
    this.clear(forget);
    this._mElmentDrawer.add(res.geoms, true);
    this._mFloor.matchHeight(res.points, res.heights);
    this.render();
}

Canvas.prototype.clear = function(forget) {
    this._mRenderer.removeAllTextInputs();
    this._mFloor            = new Floor();
    this._mElementProcessor = new ElementProcessor(this._mFloor);
    this._mElmentDrawer     = new ElementDrawer(this._mFloor);
    this._mRenderer         = new Renderer();
    this._mEdge             = new Edge(new Vec2(), new Vec2());
    this._mSnap             = new Snap(this._mFloor);
    this._mType             = null;
    this._mUpdateElment     = null;
    this._mProcessElement   = null; 
    this._mHintPoints       = [];
    
    this._mRenderer.init(this._canvas);
    this._initialize(forget);
}