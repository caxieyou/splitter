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
    this._mouseSnapped = new Vec2();
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
    this._initialize();
}

Canvas.prototype._initialize = function() {
    //创建最外边框
    this.createRect(new Vec2(0, 0), new Vec2(this._canvas.width, this._canvas.height));
    
    //赋值最外轮廓线
    var rect = new MyRect(new Vec2(0, 0), new Vec2(this._canvas.width, this._canvas.height));
    rect = rect.toMyPolygon();
    
    this._mFloor.setProfile(rect);
    
    this._mFloor.Analysis();
    //渲染
    this.render();
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
    
    this._mFloor.Analysis();
}

Canvas.prototype.createRect = function(pnt0, pnt1) {
    pnt0 = pnt0 || this._mEdge.mStart;
    pnt1 = pnt1 || this._mEdge.mEnd;
    
    var rect = new MyRect(pnt0, pnt1);
    var polyEdges = rect.toMyPolygon().getEdges();
    for (var i = 0; i < polyEdges.length; i++) {
        for (var j = 0; j < this._mFloor.mCurves.length; j++) {
            var curve = this._mFloor.mCurves[j];
            if (curve.isBoundry || curve instanceof CurveController) {
                continue;
            }
            curve = curve.getTheStartEndEdge();
            
            if (polyEdges[i] instanceof Array) {
                var total = [];
                for (var m = 0; m < polyEdges[i].length; m++) {
                    var result = MyEdge.getDiff(polyEdges[i][m], curve);

                    if (result == null) {

                    }
                    if (result instanceof Array) {
                        total.push(result[0]);
                        total.push(result[1]);
                    } else {
                        total.push(result);
                    }
                }
                polyEdges[i] = total;
            } else {
                polyEdges[i] = MyEdge.getDiff(polyEdges[i], curve);
            }
        }
    }
    
    
    
    var res = [];
    for (var i = 0; i < polyEdges.length; i++) {
        if (polyEdges[i] == null) {
            //res.push(polyEdgesSplit[i]);
        } else if (polyEdges[i] instanceof Array && polyEdges[i].length > 0) {
            for (var j = 0; j < polyEdges[i].length; j++) {
                res.push(polyEdges[i][j]);
            }
        } else {
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
    this._mFloor.clearPickedArea();
    this.render();
}

Canvas.prototype.setStartPoint = function(x, y) {
    if (this._type == null) {
        return false;
    }
    
    x = this._mouseSnapped.mX;
    y = this._mouseSnapped.mY;
    
    
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
            } else {
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
    
    x = this._mouseSnapped.mX;
    y = this._mouseSnapped.mY;
    
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
            if (this._mFloor.mCurves[i].containsPoint(this._linePoint)) {
                intersects.push(this._linePoint.clone());
            }
        }
        
        for (var i = 0; i < this._mFloor.mCurves.length; i++) {
            var curve = this._mFloor.mCurves[i];
            curve.isIntersectWithGeometry(edge, intersects);
            
        }
        //console.log(intersects.length);
        for (var i = 0; i < this._lineEdges.length; i++) {
            for (var j = 0; j < this._lineEdges[i].length; j++) {
                SegmentController.intersectSub(edge, this._lineEdges[i][j], intersects);
            }
            
        }
        
        //console.log(intersects.length);
        
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
        console.log(this._lineIntersect);
        console.log(this._lineEdges);
        for (var i = 0; i < this._lineEdges.length; i++) {
            console.log(this._lineIntersect.isStartEndSame[i]);   // t   f
            //console.log(this._lineIntersect.isStartIntersect[i]); // t   t
            console.log(this._lineIntersect.isEndIntersect[i]);   // f   t
            //console.log(this._lineIntersect.isSelfIntersect[i]);  // f   f
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
        return true;
    } else if (this._currentStatus == STATUS.LINE_DRAWING){
        return true;
    }
}

Canvas.prototype.renderAreaPicked = function(x, y) {
    if (this._mFloor.getPickedArea(x, y)) {
        this.render();
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
            this.creatCircle();
        break;
        
        case TYPE.LINE :
            //Do nothing
        break;
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
    var curves, segments, boundries, validIndex, validCurveIndex;
    [curves, segments, boundries, validIndex, validCurveIndex] = this._mFloor._seperateType();

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
                Utility.DrawCurveHeightCallback, that, curves[i]);
            }
        }
    }
    
    for (var i = 0; i < segments.length; i++) {
        
        var segmentObj = segments[i];
        var edgeObj = segmentObj.getTheStartEndEdge();
        var angleObj = edgeObj.getAngle();
        
        var isHorizontalObj = Angle.isHorizontal(angleObj);
        var isVerticalObj = Angle.isVertical(angleObj);
        
        var _segments = null;
        var idx = -1;
        
        if (this._flags.isRelativeDistanceEnabled) {
            _segments = segments;
            idx = i+1;
        }
        
        if (this._flags.isAbosoluteMarginEnabled) {
            _segments = boundries;
            idx = 0;
        }
        
        if(!_segments) {
            break;
        }
        
        for (var j = idx; j < _segments.length; j++) {
            var segmentSbj = _segments[j];
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
                    if (this._flags.isRelativeDistanceEnabled) {
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
                            var distance;
                            if (direction == 0) {
                                distance = segments[i].mStart.mPosition.mY - _segments[j].mStart.mPosition.mY;
                            } else {
                                distance = segments[i].mStart.mPosition.mX - _segments[j].mStart.mPosition.mX;
                            }
                            sign = Math.sign(distance);
                            distance = Math.abs(distance);
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
                                
                                var corners = _segments[j].toCorners();
                                for (var n = 0; n < corners.length; n++) {
                                    var corner = corners[n];
                                    for (var p = 0; p < corner.mCurves.length; p++) {
                                        if (corner.mCurves[p] instanceof CurveController) {
                                            arcValid_j = false;
                                            break;
                                        }
                                    }
                                }
                                
                                var seg0 = arcValid_i ? segments[i] : null;
                                var seg1 = arcValid_j ? _segments[j] : null;
                                
                                if (seg0 || seg1) {
                                    var that = this;
                                    this._renderer.drawDimensions({x: center.mX,y: center.mY}, {x: center.mX - direction * sign * distance,y: center.mY  - (1 -  direction) * sign * distance}, null, true,
                                       Utility.DrawDimensionCallback, that, seg0, seg1, sign * distance, direction);
                                }
                            }
                        }
                    }
                    if (this._flags.isAbosoluteMarginEnabled) {
                        
                        if (direction == 0) {
                            markLine.mEnd.mY = _segments[j].mStart.mPosition.mY;
                        } else {
                            markLine.mEnd.mX = _segments[j].mStart.mPosition.mX;
                        }
                        
                        
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
                            var distance
                            if (direction == 0) {
                                distance = segments[i].mStart.mPosition.mY - _segments[j].mStart.mPosition.mY;
                            } else {
                                distance = segments[i].mStart.mPosition.mX - _segments[j].mStart.mPosition.mX;
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
                                var that = this;
                                this._renderer.drawDimensions({x: center.mX,y: center.mY}, {x: center.mX - direction * sign * maxDis, y: center.mY - (1- direction) * sign * maxDis}, null, true,
                                Utility.DrawDimensionCallback, that, segments[i], null, sign * maxDis, direction);
                            }
                        }
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
    this._mFloor.renderOutput(this._renderer);
    
    //长方形，圆，线段等正在绘制的图元
    this._renderCurrentObject();
    
    this._renderMouseLines(x, y);
    
    this._renderMarkerLines();
    
    this._mFloor.renderPickedArea(this._renderer);
    
    //绘制鼠标移动中经过的图元
    this._renderFocusObject(x, y);
    
    this._renderHintPoints();
    
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