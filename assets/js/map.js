mapboxgl.accessToken = 'pk.eyJ1Ijoic2x1c2Fyc2tpZGRldHJvaXRtaSIsImEiOiJjaXZsNXlwcXQwYnY5MnlsYml4NTJ2Mno4In0.8wKUnlMPIlxq-eWH0d10-Q';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/slusarskiddetroitmi/ciymfavyb00072sqe0bu9rwht', //stylesheet location
  center: [-83.12213, 42.30476], // starting position
  zoom: 15, // starting zoom
});
var Murals = {
  current: '',
  list: [],
  setMurals: function(murals) {
    this.list = murals;
  },
  changeCurrentMural: function(id){
    this.current = id;
  }
};
$.getJSON('https://gis.detroitmi.gov/arcgis/rest/services/NeighborhoodsApp/Murals/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=5&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=geojson' , function(data) {
  console.log(data);
  data.features.forEach(function(marker) {
      // create a DOM element for the marker
      var el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'url(assets/img/paint-brush.png)';
      el.style.width = '64px';
      el.style.height = '64px';

      el.addEventListener('click', function() {
          window.alert(marker.properties.mural);
      });

      // add marker to map
      new mapboxgl.Marker(el, {offset: [-64 / 2, -64 / 2]})
          .setLngLat(marker.geometry.coordinates)
          .addTo(map);
  });
  Murals.setMurals(data.features);
  Murals.changeCurrentMural(2);
});
var moveRollerBack = function moveRollerBack() {
  document.querySelector('.paint-roller-section').className = 'paint-roller-section';
}
var moveRoller = function moveRoller() {
  document.querySelector('.paint-roller-section').className = 'paint-roller-section active';
  window.setTimeout(moveRollerBack, 1000);
}
var nextMural = function nextMural() {
  if((Murals.current + 1) < Murals.list.length){
    Murals.current += 1;
    map.flyTo({center: Murals.list[Murals.current].geometry.coordinates});
    moveRoller();
  }else{
    alert("end");
  }
};
var prevMural = function prevMural() {
  if((Murals.current - 1) >= 0){
    Murals.current -= 1;
    map.flyTo({center: Murals.list[Murals.current].geometry.coordinates});
    moveRoller();
  }else{
    alert("start");
  }
};
var photoDisplayToggle = function photoDisplayToggle(item){

  if(document.querySelector('.big-img-display').className === 'big-img-display active'){
      document.querySelector('.big-img-display').className = 'big-img-display';
  }else{
    console.log(item.childNodes[1].height);
    document.querySelector('.big-img-display').innerHTML = '<img src="'+ item.childNodes[1].src +'" alt="'+ item.childNodes[1].alt +'">';
    document.querySelector('.big-img-display').className += ' active';
  }
};
document.querySelector('.big-img-display').addEventListener('click', photoDisplayToggle);
document.getElementById('next-btn').addEventListener('click', nextMural);
document.getElementById('prev-btn').addEventListener('click', prevMural);
