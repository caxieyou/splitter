function Snap(floor) {
    this.mFloor       = floor;
    this.mousePos     = new Vec2();
    this.mouseSnapped = new Vec2();
    this.mIsInside    = true;
    this.mFocus = {
        //鼠标移动的点、边
        controller : null,
        geom: null,
        
        //中点或重心
        keypoint : null,
        
        hintpoint : null,
        
        //X Y轴情况
        snapX : false,
        snapXEdge : [],
        snapY : false,
        snapYEdge : []
    };
}

Snap.prototype.clearFocus = function () {
    this.mFocus.controller = null;
    this.mFocus.geom = null;
    this.mFocus.keypoint = null;
    this.mFocus.hintpoint = null;
    this.mFocus.snapX = false;
    this.mFocus.snapXEdge = [];
    this.mFocus.snapY = false;
    this.mFocus.snapYEdge = [];
}

Snap.prototype.snap = function(x, y, type, isSnap, lines) {
    //Record the original mouse position
    this.mousePos.set(x, y);
    this.mouseSnapped.set(x, y);
    this.clearFocus();
    
    if (type != null) {
        //1 和角点比
        for (var i = 0; i < this.mFloor.mCorners.length; i++) {
            if (this.mFloor.mCorners[i].mPosition.isClose(this.mouseSnapped, Globals.DISTANCE_THRESHOLD)) {
                this.mouseSnapped.copy(this.mFloor.mCorners[i].mPosition);
                this.mFocus.keypoint = this.mFloor.mCorners[i].mPosition.clone();
                break;
            }
        }
        
        //2 和重心，中点比
        if (this.mFocus.keypoint == null) {
            for (var i = 0; i < this.mFloor.mKeyPoints.length; i++) {
                if (this.mFloor.mKeyPoints[i].isClose(this.mouseSnapped, Globals.DISTANCE_THRESHOLD)) {
                    this.mouseSnapped.copy(this.mFloor.mKeyPoints[i]);
                    this.mFocus.keypoint = this.mFloor.mKeyPoints[i].clone();
                    break;
                }
            }
        }
        
        //3 如果不靠近角 再和边比
        if (this.mFocus.keypoint == null) {
            for (var i = 0; i < this.mFloor.mCurves.length; i++) {
                var curve = this.mFloor.mCurves[i];
                var edge;
                if (curve instanceof SegmentController) {
                    var edge = curve.getTheStartEndEdge();
                    if (edge.pointInEdgeOrOnEdge(this.mouseSnapped, Globals.SNAPPING_THRESHOLD)) {
                        var point = edge.getIntersectionPointByPoint(this.mouseSnapped, true);
                        this.mouseSnapped.copy(point);
                        this.mFocus.hintpoint = point.clone();
                        break;
                    }
                } else if(curve instanceof CurveController) {
                    var edge = curve.getCurveFromController();
                    if (edge.isInsideCurveAndNotOnCurve(this.mouseSnapped, Globals.SNAPPING_THRESHOLD)) {
                        var point = edge.getIntersectionPointByPoint(this.mouseSnapped, true);
                        this.mouseSnapped.copy(point);
                        this.mFocus.hintpoint = point.clone();
                        break;
                    }
                }
            }
            
        }
        
        //4 如果不靠近角 再和边比
        if (this.mFocus.keypoint == null) {
            for (var i = 0; i < lines.length; i++) {
                var edge = lines[i];
                if (edge.pointInEdge(this.mouseSnapped, Globals.SNAPPING_THRESHOLD)) {
                    var point = edge.getIntersectionPointByPoint(this.mouseSnapped, true);
                    
                    if (point.equals(edge.mStart) || point.equals(edge.mEnd)) {
                        this.mFocus.keypoint = point.clone();
                    } else {
                        this.mFocus.hintpoint = point.clone();
                    }
                    this.mouseSnapped.copy(point);
                    break;
                }
            }
        }
        
        //5 和XY轴比
        var snapX = [];
        var snapY = [];
        for (var j = 0; j < this.mFloor.mCurves.length; j++) {
            if (this.mFloor.mCurves[j].isBoundry) {
                continue;
            }
            
            
            var edge2 = this.mFloor.mCurves[j].getTheStartEndEdge();
            var angle2 = edge2.getAngle();
            
            if (Angle.isHorizontal(angle2)) {
                snapY.push(edge2);
            }
            
            if (Angle.isVertical(angle2)) {
                snapX.push(edge2);
            }
        }
        
        var min = Globals.DISTANCE_THRESHOLD;
        for (var i = 0; i < snapY.length; i++) {
            var dis = Math.abs(snapY[i].mStart.mY - y);
            if (dis <= min) {
                min = dis;
                this.mouseSnapped.mY = snapY[i].mStart.mY;
                this.mFocus.snapY = true;
                snappedY = true;
            }
        }
        
        min = Globals.DISTANCE_THRESHOLD;
        for (var i = 0; i < snapX.length; i++) {
            var dis = Math.abs(snapX[i].mStart.mX - x);
            if (dis <= min) {
                min = dis;
                this.mouseSnapped.mX = snapX[i].mStart.mX;
                this.mFocus.snapX = true;
            }
        }
        
        
        for (var j = 0; j < this.mFloor.mCurves.length; j++) {
            if (!this.mFloor.mCurves[j].isBoundry) {
                continue;
            }
            var edge2 = this.mFloor.mCurves[j].getTheStartEndEdge();
            
            var angle2 = edge2.getAngle();
            
            if (Angle.isHorizontal(angle2) && Edge.isPointWithinHorizontal(x, edge2)) {
                this.mFocus.snapXEdge.push(new Edge(this.mouseSnapped.clone(), new Vec2(this.mouseSnapped.mX, edge2.mStart.mY)));
            }
            if (Angle.isVertical(angle2) && Edge.isPointWithinVertical(y, edge2)) {
                this.mFocus.snapYEdge.push(new Edge(this.mouseSnapped.clone(), new Vec2(edge2.mStart.mX, this.mouseSnapped.mY)));
            }
        }
        
    } else {
        //1 和角点比
        for (var i = 0; i < this.mFloor.mCorners.length; i++) {
            if (this.mFloor.mCorners[i].mPosition.isClose(this.mouseSnapped, Globals.DISTANCE_THRESHOLD) && !this.mFloor.mCorners[i].isBoundryCorner()) {
                this.mouseSnapped.copy(this.mFloor.mCorners[i].mPosition);
                this.mFocus.controller = this.mFloor.mCorners[i];
                this.mFocus.geom = this.mFloor.mCorners[i].mPosition.clone();
                this.mFocus.keypoint = this.mFloor.mCorners[i].mPosition.clone();
                break;
                
            }
        }
        
        //2 和重心，中点比
        if (this.mFocus.keypoint == null) {
            for (var i = 0; i < this.mFloor.mKeyPoints.length; i++) {
                if (this.mFloor.mKeyPoints[i].isClose(this.mouseSnapped, Globals.DISTANCE_THRESHOLD)) {
                    this.mouseSnapped.copy(this.mFloor.mKeyPoints[i]);
                    this.mFocus.keypoint = this.mFloor.mKeyPoints[i].clone();
                    break;
                }
            }
        }
        
        //3 如果不靠近角 再和边比
        if (this.mFocus.controller == null) {
            for (var i = 0; i < this.mFloor.mCurves.length; i++) {
                var curve = this.mFloor.mCurves[i];
                var edge;
                if (curve instanceof SegmentController && !curve.isBoundry) {
                    var edge = curve.getTheStartEndEdge();
                    if (edge.pointInEdgeOrOnEdge(this.mouseSnapped, Globals.SNAPPING_THRESHOLD)) {
                        this.mFocus.controller = curve;
                        this.mFocus.geom = edge;
                        break;
                    }
                } else if(curve instanceof CurveController) {
                    var edge = curve.getCurveFromController();
                    if (edge.isInsideCurveAndNotOnCurve(this.mouseSnapped, Globals.SNAPPING_THRESHOLD)) {
                        this.mFocus.controller = curve;
                        this.mFocus.geom = edge;
                        break;
                    }
                }
            }
            
            if (this.mFocus.controller != null) {
                var point = this.mFocus.geom.getIntersectionPointByPoint(this.mouseSnapped, true);
                this.mouseSnapped.copy(point);
            }
        }
    }
    
    if (!this.mFloor.mProfile.mOutLines.contains(this.mouseSnapped)) {
        this.mIsInside = false;
    } else {
        this.mIsInside = true;
    }
    //console.log(this.mFocus.controller);
    if (this.mFocus.controller != null) {
        if (this.mFocus.controller instanceof SegmentController) {
            var angle = this.mFocus.geom.getAngle();
            if (Math.abs(angle) > Math.PI / 4 && Math.abs(angle) < 3 * Math.PI / 4) {
                document.body.style.cursor = "e-resize";
            } else {
                document.body.style.cursor = "n-resize";
            }
        } else if (this.mFocus.controller instanceof CurveController) {
            document.body.style.cursor = "n-resize";
        } else {
            document.body.style.cursor = "move";
        }
    } else {
        document.body.style.cursor = "default";
    }
}