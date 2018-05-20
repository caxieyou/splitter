# 2d splitter
an online tool for room splitting and area editing
develop branch for develop

This is the project for 2D splitter tool for editing room areas.
File structure: 

.</br>
├── .idea</br>
│   ├── .name</br>
│   ├── modules.xml</br>
│   ├── region-ui.iml</br>
│   ├── workspace.xml</br>
│</br>
├── common</br>
│   ├── css</br>
│   ├── images</br>
│   ├── plug</br>
│   </br>
├── controller</br>
│   ├── index.js</br>
│</br>
├── core</br>
│   ├── controller</br>
│   │   ├──Arc.js                       //the arc class, the geom is a curve behind it, includes start corner, end corner, and a control point.</br>
│   │   ├──Area.js                      //Includes all the elements in forming the area</br>
│   │   ├──Auxiliary.js                 //A help tool class, to get the intersection points between elements, segment vs curve, curve vs curve and so on</br>
│   │   ├──Corner.js                    //the corner class, contains of it's position and all the elements connected to it</br>
│   │   ├──ElementProcessor.js          //a class to deal with the split, delete, and transfer from arc to segment, segment to arc and so on</br>
│   │   ├──ID.js                        //assign a unique ID to all the elements</br>
│   │   ├──Segment.js                   //the segement class, an edge, includs the start point, and the end point.</br>
│   │</br>
│   ├── geom</br>
│   │   ├──Angle.js                     //angle class and it's help functions</br>
│   │   ├──AuxiliaryCurve.js            //help tool to get the relationship between curve and other geom</br>
│   │   ├──AuxiliaryPoint.js            //help tool to get the relationship point curve and other geom</br>
│   │   ├──AuxiliarySort.js             //order the elements with one corner and form the closed shape of a path, really important</br>
│   │   ├──Circle.js                    //circle class, center and radius</br>
│   │   ├──Curve.js                     //curve class, has center, radius, and start angle and arc length</br>
│   │   ├──Edge.js                      //edge class, start and end point</br>
│   │   ├──EdgeCollision.js             //help tool to get the relationship between two edges, really important</br>
│   │   ├──Interval.js                  //a range class, inlcuds start and end.</br>
│   │   ├──Map.js                       //map class to sort and save elements</br>
│   │   ├──MyArray.js                   //array class to save elements</br>
│   │   ├──MyMath.js                    //math class to wrap the js math</br>
│   │   ├──MyNumber.js                  //number class to wrap the js number</br>
│   │   ├──Path.js                      //a path class which contains the start position and all the point, edges, curve to form a closed shape</br>
│   │   ├──Polygon.js                   //a polygon class</br>
│   │   ├──Polytree.js                  //a polytree class, which could contains several holes</br>
│   │   ├──Rect.js                      //rectangle class</br>
│   │   ├──Vec2.js                      //point class</br>
│   │   </br>
│   ├── model</br>
│   │   ├──Analysis.js                  //the analysis class which will add the elements into floor as a whole part, it will connect all the elements, add, delete all the reletive ones in its range.</br>
│   │   │                               //such as, when add a curve, it will add the curve to it's corners, and add the area to both of them too, also the floor container will add these pieces.</br>
│   │   ├──Floor.js                     //the container of all the elements, and deal with frontend drawing logic, take the renderer and draw the elements in their correct form</br>
│   │   ├──Splitter.js                  //the splitter will add the geom into analysis and check overlap, duplicated situations</br>
│</br>
├── ui</br>
│   ├── canvas.js                       //the canvas, wrap the h5 canvas and the frontend logic</br>
│   ├── elementDrawer.js                //deal with the UI logic of draw line, rect and circle</br>
│   ├── globals.js                      //global var, and style parameters</br>
│   ├── index.js                </br>
│   ├── renderer.js                     //render tool, to call the native h5 function</br>
│   ├── snap.js                         //do the snap work when mouse move, it will move the closest position which has geom meanings</br>
│   ├── utility.js                      //callback function list to deal with the input of changing the length</br>
│</br>
├── index.html                          //index page of h5 which shows the page</br>
│</br>
├── README.md</br>


Basic Data Organization:
    There are several different layers of data should be clear here:
    1. geom: they are the basic units, includes: vec2(point), rect, circle, curve, edge, 
    and polygon polytree and so on, apparently the rect includs to points and could be transferred
    to 4 edges, each edge needs to points, circle needs a center(point) and a radius, polygon and polytree
    includs a list of edges, curves, points, or even some holes
    2. controller: this level includs the segment, arc, corner and area. segment is corresponding to an geom edge
    but also needs two corners, arc is  corresponding to an curve and so on, corner is just a point, but also
    it includs all the segments or arcs connected to it. so the level is like a mutua-link relationship, you
    could find all the data you need. Such as all the corners in an edge, all the arcs in a corner.  Area includs
    all the data above. All these four parts has a unique ID, easy to tell and trace.
    3. Segment, arc and corner are all kinds of an Elements. 

                         Elemement
                   ┌─────────┼────────┐
                 Segment    Arc    Corner             controllers folder
                   │         │        │
                  Edge     Curve    Point             geom folder


Setup:
    Just download the whole package and open the index.html

Usage:
    Follow the UI and button to drag and point on the canvas to create your area, and adjust their position
    Draw the circle, rect, and use the line to draw any shape you like, the splitter will split them into each
    un-overlapped area.

Code:
    The code is not that hard to understand:
    All the code has perfect name to explain it self. And the above file structure also explains the file or the class's meaning.

    
Q&A:
    just contact me by QQ or wechar or by phone.
    
Li
    






