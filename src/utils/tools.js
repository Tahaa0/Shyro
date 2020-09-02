function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function createSerie(len){
	var a = [];
	for(var i=0; i<len;i++){
		a.push(i);
	}
	return a;
}

function isAdjacent(map,index,x,y){
    var isAdjacentTo = function(X,Y){
        if(!(map[Y] == undefined)){
            if(!(map[Y][X] == undefined)){
                if(map[Y][X] == index){
                    return true;
                }
            }
        }
    }
    if(isAdjacentTo(x+1,y) || isAdjacentTo(x-1,y) || isAdjacentTo(x,y+1) || isAdjacentTo(x,y-1)){
        return true;
    }
    return false;
}

function isInBounds(map,x,y){
    if(map.length > 0){
        if(map[0].length > 0){
            var H = map.length;
            var W = map[0].length;
            if(x>=W || y>=H || x<0 || y<0){
                return false;
            }else{
                return true;
            }
        }
    }
    
}

function fetchAdjacent(mapContent,index,x,y){
    var isAdjacentTo = function(map,X,Y){
        if(!(map[Y] == undefined)){
            if(!(map[Y][X] == undefined)){
                if(map[Y][X] == index){
                    return true;
                }
            }
        }
        return false;
    }
    var res = [];
    if(isAdjacentTo(mapContent,x+1,y)){
        res.push({x:x+1,y:y});
    }
    if(isAdjacentTo(mapContent,x-1,y)){
        res.push({x:x-1,y:y});
    }
    if(isAdjacentTo(mapContent,x,y+1)){
        res.push({x:x,y:y+1});
    }
    if(isAdjacentTo(mapContent,x,y-1)){
        res.push({x:x,y:y-1});
    }
    return res;
}

function isDup(x,y,arr){
    for(var i in arr){
        if(arr[i].x == x && arr[i].y == y){
            return true;
        }
    }
    return false;
}

function noBombMap(map){
    var H = map.length;
    var W = map[0].length;

    var outputMap = []
    for(var y=0;y<H;y++){
        outputMap[y] = [];
        for(var x=0;x<W;x++){
            if(map[y][x] >= 100 && map[y][x] < 200){
                outputMap[y][x] = -1;
            }else{
                outputMap[y][x] = map[y][x];
            }
        }
    }

    return outputMap;
}

function zonifyMap(map){
    var H = map.length;
    var W = map[0].length;

    var zones = [];
    var zmap = [];
    var excludeMap = [];

    for(var y=0;y<H;y++){
        zmap[y] = [];
        for(var x=0;x<W;x++){
            zmap[y][x] = true;
        }
    }

    for(var y=0;y<H;y++){
        excludeMap[y] = [];
        for(var x=0;x<W;x++){
            excludeMap[y][x] = true;
        }
    }

    var indexCount = {};

    for(var y=0;y<H;y++){
        for(var x=0;x<W;x++){
            if(excludeMap[y][x]){
                //zone extraction begins
                //when a zone is fulled extracted the zone is removed from excludeMap[]
                var queue = [{x:x,y:y}];
                var C = 0; //counter

                var z = {index:map[y][x],data:[]};
                while(C<queue.length){
                    var X = queue[C].x;
                    var Y = queue[C].y;
                    
                    z.data.push({x:X,y:Y}); //1. EXTRACT
                    zmap[Y][X] = map[Y][X]+"_"+x+y;

                    var adj = fetchAdjacent(map,map[Y][X],X,Y); //2. FETCH ADJACENT
                    //3. Add non duplicates to the queue
                    for(var i in adj){
                        if(!isDup(adj[i].x,adj[i].y,queue)){
                            queue.push({x:adj[i].x,y:adj[i].y});
                        }
                    }

                    C++; 
                }
                //
                zones.push(z);
                //add current zone to excludeMap
                for(var i in z.data){
                    excludeMap[z.data[i].y][z.data[i].x] = false;
                }
                //LOOP extract the current and add the adjacent ones to the queue
            }
        }
    }
    return zmap;
}


function zonify(map,empty){
    var H = map.length;
    var W = map[0].length;

    var zoneMap = [];

    for(var y=0;y<H;y++){
        zoneMap[y] = [];
        for(var x=0;x<H;x++){
                zoneMap[y][x] = map[y][x];
        }
    }

    for(var y=0;y<H;y++){
        for(var x=0;x<H;x++){
            if(empty.indexOf(getID(zoneMap[y][x])) != -1){ //check if part of empty
                //check if adjacent to existing one
                var ADJ = false;
                var arr = [[x+1,y],[x-1,y],[x,y+1],[x,y-1]];
                for(var a in arr){
                    var X = arr[a][0];
                    var Y = arr[a][1];
                    if(zoneMap[Y]){
                        if(zoneMap[Y][X]){
                            if(zoneMap[Y][X][0] == 'z'){
                                ADJ = true;
                                zoneMap[y][x] = zoneMap[Y][X];
                                break;
                            }
                        }
                    }
                }
                if(!ADJ){
                    zoneMap[y][x] = 'z'+x+'_'+y;
                }
            }else{
                zoneMap[y][x] = false;
            }
        }
    }

    return zoneMap;
}

function getCountOnMap(map,index){
    var count = 0;
    for(var y = 0;y<map.length;y++){
        if(map[0]){
            for(var x = 0;x<map[0].length;x++){
                if(map[y][x] == index){
                    count++;
                }
            }
        }else{
            return false;
        }
    }
    return count;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getEmptyMapContent(map){
    var content = [];
    for(var y=0;y<map.length;y++){
        content[y] = [];
        for(var x=0;x<map[0].length;x++){
            switch(map[y][x]){
                case 1:
                case 10:
                    content[y][x] = -1;
                    break;
                case 20:                //GOLD
                    content[y][x] = -1;
                    break;
                case 30:
                    content[y][x] = 210;
                    break;
                case 31:
                    content[y][x] = 211;
                    break;
                default:
                    content[y][x] = -9;
                    break;
            }
        }
    }
    return content;
}

function getArrOfIndex(map,index){
    var arr = [];
    for(var y=0;y<map.length;y++){
        for(var x=0;x<map[0].length;x++){
            if(map[y][x] == index){
                arr.push({x:x,y:y});
            }
        }
    }
    return arr;
}

function getID(str){
    return parseInt(str.toString().split('_')[0])
}
function getIndex(str){
    if(str.toString().split('_')[1]){
        return parseInt(str.toString().split('_')[1])
    }else{
        return null;
    }
}

exports.getID = getID;
exports.getIndex = getIndex;
exports.shuffle = shuffle;
exports.createSerie = createSerie;
exports.fetchAdjacent = fetchAdjacent;
exports.isDup = isDup;
exports.noBombMap = noBombMap;
exports.zonifyMap = zonifyMap;
exports.getCountOnMap = getCountOnMap;
exports.getRandomInt = getRandomInt;
exports.getEmptyMapContent = getEmptyMapContent;
exports.getArrOfIndex = getArrOfIndex;
exports.isAdjacent = isAdjacent;
exports.isInBounds = isInBounds;
exports.zonify = zonify;