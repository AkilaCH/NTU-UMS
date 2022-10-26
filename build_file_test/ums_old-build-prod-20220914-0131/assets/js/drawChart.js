function DrawTree(location, source, config, fakeTreeId, unit) {

    var totalNodes = 0;
    var maxLabelLength = 0;
    var selectedNode = null;
    var draggingNode = null;
    var panSpeed = 200;
    var panBoundary = 20;
    var i = 0;
    var duration = 1500;
    var root;
    var viewerWidth = window.innerWidth - 120;
    var viewerHeight = window.innerHeight - 200;
    var tree = d3.layout.tree()
        .size([viewerHeight, viewerWidth]);

    var diagonal = d3.svg.diagonal()
        .projection(function (d) { return [d.y, d.x]; });

    function visit(parent, visitFn, childrenFn) {
        if (!parent) return;

        visitFn(parent);

        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                visit(children[i], visitFn, childrenFn);
            }
        }
    }

    visit(source, function (d) {
        totalNodes++;
        maxLabelLength = Math.max(d.name.length, maxLabelLength);

    }, function (d) {
        return d.children && d.children.length > 0 ? d.children : null;
    });

    function sortTree() {
        tree.sort(function (a, b) {
            return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
        });
    }
    sortTree();

    function pan(domNode, direction) {
        var speed = panSpeed;
        if (panTimer) {
            clearTimeout(panTimer);
            translateCoords = d3.transform(svgGroup.attr("transform"));
            if (direction == 'left' || direction == 'right') {
                translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                translateY = translateCoords.translate[1];
            } else if (direction == 'up' || direction == 'down') {
                translateX = translateCoords.translate[0];
                translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
            }
            scaleX = translateCoords.scale[0];
            scaleY = translateCoords.scale[1];
            scale = zoomListener.scale();
            svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
            d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
            zoomListener.scale(zoomListener.scale());
            zoomListener.translate([translateX, translateY]);
            panTimer = setTimeout(function () {
                pan(domNode, speed, direction);
            }, 50);
        }
    }

    function zoom() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

    function initiateDrag(d, domNode) {
        draggingNode = d;
        d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
        d3.select(domNode).attr('class', 'node activeDrag');

        svgGroup.selectAll("g.node").sort(function (a, b) {
            if (a.id != draggingNode.id) return 1;
            else return -1;
        });

        if (nodes.length > 1) {
            links = tree.links(nodes);
            nodePaths = svgGroup.selectAll("path.link")
                .data(links, function (d) {
                    return d.target.id;
                }).remove();
            nodesExit = svgGroup.selectAll("g.node")
                .data(nodes, function (d) {
                    return d.id;
                }).filter(function (d, i) {
                    if (d.id == draggingNode.id) {
                        return false;
                    }
                    return true;
                }).remove();
        }

        parentLink = tree.links(tree.nodes(draggingNode.parent));
        svgGroup.selectAll('path.link').filter(function (d, i) {
            if (d.target.id == draggingNode.id) {
                return true;
            }
            return false;
        }).remove();

        dragStarted = null;
    }

    var baseSvg = d3.select(location).append("svg")
        .attr("width", viewerWidth)
        .attr("height", viewerHeight)
        .attr("class", "overlay")
        .style("cursor", "move")
        .call(zoomListener);

    var fakeSvg = d3.select(fakeTreeId).append("svg")
        .attr("class", "overlay")
        .attr("id", "meterTreeSvg");

    // var previewSvg = d3.select('#preview').append("svg")
    //     .attr("class", "overlay")
    //     .attr("id", "previewTreeId")
    //     .style("pointer-events", "none");

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    function expand(d) {
        if (d._children) {
            d.children = d._children;
            d.children.forEach(expand);
            d._children = null;
        }
    }

    var overCircle = function (d) {
        selectedNode = d;
        updateTempConnector();
    };
    var outCircle = function (d) {
        selectedNode = null;
        updateTempConnector();
    };

    var updateTempConnector = function () {
        var data = [];
        if (draggingNode !== null && selectedNode !== null) {
            data = [{
                source: {
                    x: selectedNode.y0,
                    y: selectedNode.x0
                },
                target: {
                    x: draggingNode.y0,
                    y: draggingNode.x0
                }
            }];
        }
        var link = svgGroup.selectAll(".templink").data(data);

        link.enter().append("path")
            .attr("class", "templink")
            .attr("d", d3.svg.diagonal())
            .attr('pointer-events', 'none');

        link.attr("d", d3.svg.diagonal());

        link.exit().remove();
    };

    function centerNode(source) {
        scale = zoomListener.scale();
        x = -source.y0;
        y = -source.x0;
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }

    function toggleChildren(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        return d;
    }

    function click(d) {
        if (d3.event.defaultPrevented) return;
        d = toggleChildren(d);
        update(d);
        centerNode(d);
    }

    function initialScale(source) {
        var levelWidth = [1];
        var childCount = function (level, n) {
            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function (d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        var maxChildNodes = d3.max(levelWidth);
        if (viewerHeight / (maxChildNodes * 75) < 1) {
            zoomListener.scale(viewerHeight / (maxChildNodes * 75));
        }

        scale = zoomListener.scale();
        y = -source.x0;
        x = viewerWidth / (levelWidth.length * 2);
        y = y * scale + viewerHeight / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }

    function update(source) {
        var levelWidth = [1];
        var childCount = function (level, n) {

            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function (d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        var newHeight = d3.max(levelWidth) * 80;
        tree = tree.size([newHeight, viewerWidth]);

        d3.select('#meterTreeSvg')
            .attr("width", (levelWidth.length * 25 * 15)) // maxLabelLength = 25
            // .attr("width", (levelWidth.length * maxLabelLength * 15))
            .attr("height", newHeight);

        // d3.select('#previewTreeId')
        //     .attr("width", 150 + levelWidth.length * 25)
        //     .attr("height", viewerHeight - 40);

        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        nodes.forEach(function (d) {
            d.y = (d.depth * (25 * 17)); // maxLabelLength = 25
            // d.y = (d.depth * (maxLabelLength * 15));
        });

        node1 = svgGroup.selectAll("g.node")
            .data(nodes, function (d) { return d.id || (d.id = ++i); });

        node2 = fakeTree.selectAll("g.node")
            .data(nodes, function (d) { return d.id || (d.id = ++i); });

        // node3 = previewTree.selectAll("g.node")
        //     .data(nodes, function (d) { return d.id || (d.id = ++i); });
        
        drawNodes(node1, 0);
        drawNodes(node2, 10);
        // drawNodes(node3, 0);

        function drawNodes(node, cx) {
            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                .on('click', click);

            nodeEnter.append('rect')
                .attr('x', -8)
                .attr('y', -17)
                .attr('width', function (d) {
                    if (d.name.length >= 25) {
                        return Math.max(getWidthOfText(lineBreaker(d.name, 25)[0], "16px"), getWidthOfText(d.description, "14px")) + getWidthOfText(setUnit(d.meter), "24px") + 70;
                    } else {
                        return Math.max(getWidthOfText(d.name, "16px"), getWidthOfText(d.description, "14px")) + getWidthOfText(setUnit(d.meter), "24px") + 70;
                    }
                })
                .attr('height', function (d) { return d.name.length >= 25 ? 44 : 30; })
                .style("fill", '#242C33')
                .style("stroke-width", 0)
                .style("fill-opacity", 0);

            nodeEnter.append('circle')
                .attr('cx', function (d) { return d.depth == 0 ? cx + 10 : 10})
                .attr('cy', 0)
                .attr('r', 0)
                .style("fill", function (d) { return d.quality == 1 ? "#00ff00" : "#ff0000" })
                .style("stroke-width", 0)
                .style("fill-opacity", 0);

            nodeEnter.append("text")
                .attr("id", "description")
                .attr("x", 40)
                .attr("y", -5)
                .attr("fill", "#29b6ff")
                .text(function (d) { return d.description; })
                .style("font-size", "14px")
                .style("font-family", "Poppins")
                .style("fill-opacity", 0);

            nodeEnter.append("text")
                .attr("id", "name")
                .attr("x", 40)
                .attr("y",0) // function (d) { return d.description === "" ? -5 : 0 })
                .attr("dy", "10px")
                .attr("fill", "#FFFFFF")
                .style("font-size", "10px")
                .style("font-family", "Poppins")
                .style("fill-opacity", 0)
                .append('tspan')
                .text(function (d) { return lineBreaker(d.name, 25)[0]; })
                .append('tspan')
                .text(function (d) { return lineBreaker(d.name, 25)[1] ? lineBreaker(d.name, 25)[1] : null; })
                .attr('dx', function (d) { return -getWidthOfText(lineBreaker(d.name, 25)[0], "10px"); })
                .attr('dy', '15px')

            nodeEnter.append("text")
                .attr("id", "value")
                .attr("x", function (d) {
                    if(d.name.length >= 25) {
                        return Math.max(getWidthOfText(lineBreaker(d.name, 25)[0], "16px"), getWidthOfText(d.description, "14px")) + 60;
                    } else {
                        return Math.max(getWidthOfText(d.name, "16px"), getWidthOfText(d.description, "14px")) + 60;
                    }
                })
                .attr("y", -5)
                // .attr("y", function (d) { return d.description === "" ? 0 : 5 })
                .attr("dy", "10px")
                .attr("fill", function (d) { return d.quality == 1 ? "#00ff00" : "#ff0000" })
                .text(function (d) { return setUnit(d.meter); })
                .style("font-size", "22px")
                .style("font-family", "PoppinsSemiBold")
                .style("fill-opacity", 0);

            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

            nodeUpdate.select("rect")
                .style("fill-opacity", 1);

            nodeUpdate.select("circle")
                .attr("r", 13)
                .style("fill-opacity", 1);

            nodeUpdate.select("#description")
                .style("fill-opacity", 1);

            nodeUpdate.select("#name")
                .style("fill-opacity", 1);

            nodeUpdate.select("#value")
                .style("fill-opacity", 1);

            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
                .remove();

            nodeExit.select("rect")
                .style("fill-opacity", 0);

            nodeExit.select("circle")
                .attr("r", 0)
                .style("fill-opacity", 0);

            nodeExit.select("#description")
                .style("fill-opacity", 0);

            nodeExit.select("#name")
                .style("fill-opacity", 0);

            nodeExit.select("#value")
                .style("fill-opacity", 0);
        }

        function getWidthOfText(txt, fontSize){
            if(getWidthOfText.c === undefined){
                getWidthOfText.c=document.createElement('canvas');
                getWidthOfText.ctx=getWidthOfText.c.getContext('2d');
            }
            let fontSpec = fontSize + ' ' + 'Poppins';
            if(getWidthOfText.ctx.font !== fontSpec)
                getWidthOfText.ctx.font = fontSpec;
            return getWidthOfText.ctx.measureText(txt).width;
        }
        
        function setUnit(value) {
            if (!isNaN(value) && value !== null) {
                let multiplier = Math.pow(10, config.decimalNumPrecision || 0);
                return transform(Math.round(value * multiplier) / multiplier);
            } else {
                return 'N/A';
            }

            function transform(nStr) {
                if (nStr === '') { return ''; }
                let x, x1, x2, rgx;
                nStr += '';
                x = nStr.split('.');
                x1 = x[0];
                x2 = x[1];
                rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                  x1 = x1.replace(rgx, '$1' + ',' + '$2');
                }
                return x1 + (x2 ? `.${x2}` : '') + ' ' + unit;
            }
        }

        function lineBreaker(str, maxLength) {
            let res = str.split(" ");
            let temp = "";
            let line1 = "";
            let line2 = "";

            res.forEach(e => {
                temp = temp == "" ? temp + e : temp + " " + e;
                if (temp.length < maxLength) {
                    line1 = temp;
                } else {
                    line2 = line2 == "" ? line2 + e : line2 + " " + e;
                }
            });

            return [line1, line2];
        }
        
        var link1 = svgGroup.selectAll("path.link")
            .data(links, function (d) { return d.target.id; });

        var link2 = fakeTree.selectAll("path.link")
            .data(links, function (d) { return d.target.id; });

        // var link3 = previewTree.selectAll("path.link")
        //     .data(links, function (d) { return d.target.id; });

        drawLinks(link1);
        drawLinks(link2);
        // drawLinks(link3);

        function drawLinks(link) {
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", function (d) {
                    var o = {
                        x: source.x0,
                        y: source.y0
                    };
                    return diagonal({
                        source: o,
                        target: o
                    });
                });

            link.transition()
                .duration(duration)
                .attr("d", diagonal);

            link.exit().transition()
                .duration(duration)
                .attr("d", function (d) {
                    var o = {
                        x: source.x,
                        y: source.y
                    };
                    return diagonal({
                        source: o,
                        target: o
                    });
                })
                .remove();
        }

        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    var svgGroup = baseSvg.append("g");
    var fakeTree = fakeSvg.append("g");
    // var previewTree;

    root = source;
    root.x0 = viewerHeight / 2;
    root.y0 = 0;

    // previewZoom();
    update(root);
    initialScale(root);
    // centerNode(root);
    
    function previewZoom() {
        var levelWidth = [1];
        var childCount = function (level, n) {
            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function (d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        var maxChildNodes = d3.max(levelWidth);

        var scale = 0.2;
        if (400 / (maxChildNodes * 80) < 0.2) {
            scale = 400 / (maxChildNodes * 80);
        } else if (levelWidth.length > 2 ) {
            scale = 200 / (levelWidth.length * 400);
        }
        
        previewTree = previewSvg.append("g")
                        .attr("transform", `translate(30,30)scale(${scale})`);
    }


    function valueYaxisis(d) {
        if (displayTextWidth(d.name, '', "12pt poppins") > displayTextWidth(d.description, '', "12pt poppins")) {
            return displayTextWidth(d.name, '', "12pt poppins");
        } else {
            return displayTextWidth(d.description, '', "12pt poppins");
        }
    }

    function displayTextWidth(text1, text2, font) {
        let contextString = "2d";
        var myCanvas1 = displayTextWidth.canvas || (displayTextWidth.canvas = document.createElement("canvas"))
            , myCanvas2 = displayTextWidth.canvas || (displayTextWidth.canvas = document.createElement("canvas"));

        var context1 = myCanvas1.getContext(contextString)
            , context2 = myCanvas2.getContext(contextString);

        context1.font = font,
            context2.font = font;

        var metrics1 = context1.measureText(text1)
            , metrics2 = context2.measureText(text2);

        return metrics1.width + metrics2.width;
    };

    function convertMeterValue(number) {
        if (Number(number) === number && number % 1 === 0) {
            return `${number} ${unit}`;
        } else if (number === null) {
            return 'N/A'
        } else {
            return number.toFixed(config.decimalNumPrecision);
        }
    }
}
