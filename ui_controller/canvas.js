var STATUS = {
    NOT_STARTED : -1,
    SET_START   :  0,
    DRAWING     :  1,
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
    this._operationCurve = null;
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
}

Canvas.prototype.setStartPoint = function(x, y) {
    if (this._type == null) {
        return false;
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
    
    this._currentStatus = STATUS.DRAWING;
    this._mEdge.mEnd.mX = x;
    this._mEdge.mEnd.mY = y;
    
    if (this._mEdge.getLength() < 0.0001) {
        return false;
    } else {
        return true;
    }
}


Canvas.prototype.getDrawType = function() {
    return this._type;
}

Canvas.prototype.getFocusElement = function() {
    if (this._focus) {
        return this._focus.edge;
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

Canvas.prototype.resetType = function() {
    this._type = null;
}

Canvas.prototype.renderAreaPicked = function(x, y) {
    
    for (var i = 0; i < this._innerResult.length; i++) {
        if (this._innerResult[i].contains(new Vec2(x, y))) {
            //return this._outputResult[i];
            this._renderer.drawArea(this._outputResult[i]);
            break;
        }
    }
    //return null;
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

Canvas.prototype.createElement = function() {
    switch(this._type) {
        case TYPE.RECTANGLE:
            this.createRect();
        break;
        
        case TYPE.CIRCLE:
            this.creatCircle();
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
            if (profile[i].pointInEdgeOrOnEdge(new Vec2(x, y), 1.0)) {
                return;
            }
        }
    }
    
    for (var i = 0; i < this._mFloor.mCurves.length; i++) {
        var curve = this._mFloor.mCurves[i];
        var edge;
        if (curve instanceof SegmentController) {
            var edge = curve.getTheStartEndEdge();
            if (edge.pointInEdgeOrOnEdge(new Vec2(x, y), 1.0)) {
                this._focus = {
                    edge: edge,
                    controller : curve
                };
                break;
            }
        } else if(curve instanceof CurveController) {
            var edge = curve.getCurveFromController();
            
            if (edge.isInsideCurveAndNotOnCurve(new Vec2(x, y), 1.0)) {
                this._focus = {
                    edge: edge,
                    controller : curve
                };
                break;
            }
        }
    }
    if (this._focus == null) {
        return;
    }
    if (this._focus.edge instanceof MyEdge) {
        this._renderer.drawLine(this._focus.edge, null, null, true);
    } else if(this._focus.edge instanceof MyCurve) {
        this._renderer.drawArc(this._focus.edge, true);
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

