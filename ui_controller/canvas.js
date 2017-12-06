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
    this._lineEdges = [];
    this._linePoint = new Vec2();
    this._curentLine0 = null;
    this._curentLine1 = null;
    this._lineIntersect = {
        isStartIntersect : [],
        isSelfIntersect: [],
        isStartEndSame : []
    };
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
            this._renderer.drawRect(this._mEdge);
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
    if (this._type == null || this._currentStatus ==  STATUS.NOT_STARTED) {
        return false;
    }
    if (this._currentStatus ==  STATUS.LINE_START) {
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
        this._type = null;
        var lines = [];
        for (var i = 0; i < this._lineEdges.length; i++) {
            if (this._lineIntersect.isStartEndSame[i]){
                for (var j = 0; j < this._lineEdges[i].length; j++) {
                    lines.push(this._lineEdges[i][j]);
                }
            } else {
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
            
            //for (var i = 0; i < this._updateElment.controller.mCurves.length; i++) {
            //    if (this._updateElment.controller.mCurves[i] instanceof CurveController) {
            //        this._updateElment.controller.mCurves[i].updateInfo(this._updateElment.controller);
            //        debugger;
            //    }
            //}
            
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
            console.log("222222222");
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
        if (this._mFloor.mCorners[i].mPosition.isClose(new Vec2(x, y), 2)) {
            this._focus = {
                    geom: this._mFloor.mCorners[i].mPosition.clone(),
                    controller : this._mFloor.mCorners[i]
                };
            break;
        }
    }
    
    
    if (this._focus != null) {
        console.log("render focus");
        console.log(this._focus);
        this._renderer.drawCorner(this._focus.geom);
        return;
    }
    
    
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
    
    //this._renderer.drawSegment({x: 200,y: 300}, {x: 300,y: 300});
    //this._renderer.drawDimensions({x: 200,y: 200}, {x: 300,y: 200});
    //this._renderer.drawDimensions({x: 50,y: 300}, {x: 300,y: 300},null, true, function(v) {alert(v)});

    //清空canvas
    this._renderer.clear();
    
    //绘制已经分析完的图元
    this._renderOutput();
    
    //长方形，圆，线段等正在绘制的图元
    this._renderCurrentObject();
    
    //绘制鼠标移动中经过的图元
    this._renderFocusObject(x, y);
}

