
module.exports = {
  includePaths: [
    'node_modules/ionic-angular/themes',
    'node_modules/ionicons/dist/scss',
    'node_modules/ionic-angular/fonts',
    'node_modules/leaflet-geocoder-mapzen/dist',
    'node_modules/leaflet/dist',
  ],
  includeFiles: [
    /\.(s(c|a)ss)$/i,
    /^leaflet\.css%/i,
    /^leaflet-geocoder-mapzen\.css%/i,
  ],
}
