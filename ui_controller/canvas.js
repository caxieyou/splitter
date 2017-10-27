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
    this._initialize();
    this._mouseDown = new Vec2();
    this._mouseUp = new Vec2();
    this._linePoints = [];
}

Canvas.prototype._initialize = function() {
    //创建最外边框
    this.createRect(new Vec2(0, 0), new Vec2(this._canvas.width, this._canvas.height));
    
    //赋值最外轮廓线
    var rect = new MyRect(new Vec2(0, 0), new Vec2(this._canvas.width, this._canvas.height));
    rect = rect.toMyPolygon();
    
    this._mFloor.setProfile(rect);
    
    //渲染
    this.render();
}

Canvas.prototype._renderCurrentObject = function() {
    if (this._currentStatus != STATUS.DRAWING) {
        return;
    }
    
    switch(this._type) {
        case TYPE.RECTANGLE:
            this._renderer.drawRect(this._mEdge);
        break;
        case TYPE.CIRCLE:
            this._renderer.drawCircle(this._mEdge);
        break;
    }
}

Canvas.prototype.split = function(polygon) {
    var splitter = new Splitter(polygon, this._mFloor, this._mFloor.generatePolyTree());
    splitter.execute();
    var analysis = new Analysis(this._mFloor);
    analysis.execute();
    [this._outputResult,  this._innerResult] = Converter.outputGeo(this._mFloor);
    
}

Canvas.prototype.createRect = function(pnt0, pnt1) {
    pnt0 = pnt0 || this._mEdge.mStart;
    pnt1 = pnt1 || this._mEdge.mEnd;
    
    var rect = new MyRect(pnt0, pnt1);
    var poly = rect.toMyPolygon();
    
    this.split(poly);
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
    
}

Canvas.prototype.setStartPoint = function(x, y) {
    if (this._type == null) {
        return false;
    }
    if (!this._mFloor.mProfile.mOutLines.contains(new Vec2(x, y))) {
        console.log("START POINT OUTSIDE OF ROOM!");
        return;
    }
    if (this._currentStatus == STATUS.LINE_START) {
        var list = [];
        list.push(new Vec2(x, y));
        this._linePoints.push(list);
        console.log("press 0");
        console.log(this._linePoints);
        this._currentStatus = STATUS.LINE_DRAWING
    } else if (this._currentStatus == STATUS.LINE_DRAWING) {
        this._linePoints[this._linePoints.length-1].push(new Vec2(x, y));
        console.log("press 1");
        console.log(this._linePoints);
    }
    
    if (this._currentStatus == STATUS.NOT_STARTED) {
        this._currentStatus = STATUS.SET_START;
        this._mEdge.mStart.mX = x;
        this._mEdge.mStart.mY = y;
    }
}

Canvas.prototype.setEndPoint = function(x, y) {
    if (this._type == null || this._currentStatus ==  STATUS.NOT_STARTED) {
        return false;
    }
    if (this._currentStatus ==  STATUS.LINE_START || this._currentStatus == STATUS.LINE_DRAWING) {
        console.log("move: " + this._currentStatus);
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
        console.log("right 0");
    } else if (this._currentStatus  == STATUS.LINE_START) {
        this._currentStatus = STATUS.NOT_STARTED;
        this._type = null;
        this._linePoints = [];
        console.log("right 1");
    } else {
        this._currentStatus = STATUS.NOT_STARTED;
        this._type = null;
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
    }
}

Canvas.prototype.renderAreaPicked = function(x, y) {
    
    for (var i = 0; i < this._innerResult.length; i++) {
        if (this._innerResult[i].contains(new Vec2(x, y))) {
            //return this._outputResult[i];
            this._renderer.drawArea(this._outputResult[i]);
            break;
        }
    }
    this._renderOutput();
    //return null;
}

Canvas.prototype.recordMouseDown = function(x, y) {
    this._mouseDown.mX = x;
    this._mouseDown.mY = y;
    
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
        if (this._updateElment.controller instanceof MyCorner) {
            this._updateElment.controller.mPosition.mX = x;
            this._updateElment.controller.mPosition.mY = y;
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
        
        var overlapped = this._checkOverlap();
        
        if (overlapped)
        {
            if (this._updateElment.controller instanceof MyCorner) {
                this._updateElment.controller.mPosition.mX = this._lastFocos.mX;
                this._updateElment.controller.mPosition.mY = this._lastFocos.mY;
            }
            if (this._updateElment.controller instanceof CurveController) {
                this._updateElment.controller.mCurvePoint.mX = this._lastFocos.mX;
                this._updateElment.controller.mCurvePoint.mY = this._lastFocos.mY;
            }
            
            var analysis = new Analysis(this._mFloor);
            analysis.execute();
            [this._outputResult,  this._innerResult] = Converter.outputGeo(this._mFloor);
            
            this._updateElment = null;
            this._focus = null;
            this._lastFocos = null;
        }
        this.render();
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
    if (this._type != null) {
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
    
    /////////////////////
    // focus on corner //
    /////////////////////
    for (var i = 0; i < this._mFloor.mCorners.length; i++) {
        if (this._mFloor.mCorners[i].mPosition.isClose(new Vec2(x, y), 2.0)) {
            this._focus = {
                    geom: new Vec2(x, y),
                    controller : this._mFloor.mCorners[i]
                };
            break;
        }
    }
    
    /*
    if (this._focus != null) {
        console.log("render focus");
        console.log(this._focus);
        return;
    }
    */
    
    
    ////////////////////
    // focus on edge  //
    ////////////////////
    for (var i = 0; i < this._mFloor.mCurves.length; i++) {
        var curve = this._mFloor.mCurves[i];
        var edge;
        if (curve instanceof SegmentController) {
            var edge = curve.getTheStartEndEdge();
            if (edge.pointInEdgeOrOnEdge(new Vec2(x, y), 1.0)) {
                this._focus = {
                    geom: edge,
                    controller : curve
                };
                break;
            }
        } else if(curve instanceof CurveController) {
            var edge = curve.getCurveFromController();
            
            if (edge.isInsideCurveAndNotOnCurve(new Vec2(x, y), 1.0)) {
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
    } else if(this._focus.geom instanceof MyCurve) {
        this._renderer.drawArc(this._focus.geom, true);
    }
}

Canvas.prototype.render = function(x, y) {
    //清空canvas
    this._renderer.clear();
    
    //绘制已经分析完的图元
    this._renderOutput();
    
    //长方形，圆，线段等正在绘制的图元
    this._renderCurrentObject();
    
    //绘制鼠标移动中经过的图元
    this._renderFocusObject(x, y);
}

