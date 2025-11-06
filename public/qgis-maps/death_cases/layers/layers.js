var wms_layers = [];

var lyr_OpenStreetMapWMSbyterrestris_0 = new ol.layer.Tile({
                            source: new ol.source.TileWMS(({
                              url: "https://ows.terrestris.de/osm/service",
                              attributions: ' ',
                              params: {
                                "LAYERS": "OSM-WMS",
                                "TILED": "true",
                                "VERSION": "1.1.1"},
                            })),
                            title: 'OpenStreetMap WMS - by terrestris',
                            popuplayertitle: 'OpenStreetMap WMS - by terrestris',
                            opacity: 1.000000,
                            
                            
                          });
              wms_layers.push([lyr_OpenStreetMapWMSbyterrestris_0, 0]);
var format_Anambra_State_1 = new ol.format.GeoJSON();
var features_Anambra_State_1 = format_Anambra_State_1.readFeatures(json_Anambra_State_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Anambra_State_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Anambra_State_1.addFeatures(features_Anambra_State_1);
var lyr_Anambra_State_1 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Anambra_State_1, 
                style: style_Anambra_State_1,
                popuplayertitle: 'Anambra_State',
                interactive: false,
                title: '<img src="styles/legend/Anambra_State_1.png" /> Anambra_State'
            });
var format_vw_death_cases_2 = new ol.format.GeoJSON();
var features_vw_death_cases_2 = format_vw_death_cases_2.readFeatures(json_vw_death_cases_2, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_vw_death_cases_2 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_vw_death_cases_2.addFeatures(features_vw_death_cases_2);
var lyr_vw_death_cases_2 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_vw_death_cases_2, 
                style: style_vw_death_cases_2,
                popuplayertitle: 'vw_death_cases',
                interactive: true,
                title: '<img src="styles/legend/vw_death_cases_2.png" /> vw_death_cases'
            });

lyr_OpenStreetMapWMSbyterrestris_0.setVisible(true);lyr_Anambra_State_1.setVisible(true);lyr_vw_death_cases_2.setVisible(true);
var layersList = [lyr_OpenStreetMapWMSbyterrestris_0,lyr_Anambra_State_1,lyr_vw_death_cases_2];
lyr_Anambra_State_1.set('fieldAliases', {'fid': 'fid', 'globalid': 'globalid', 'uniq_id': 'uniq_id', 'timestamp': 'timestamp', 'editor': 'editor', 'statename': 'statename', 'statecode': 'statecode', 'capcity': 'capcity', 'source': 'source', 'geozone': 'geozone', });
lyr_vw_death_cases_2.set('fieldAliases', {'fact_record_id': 'fact_record_id', 'dataset_uid': 'dataset_uid', 'dataelement_uid': 'dataelement_uid', 'dataelement_name': 'dataelement_name', 'period': 'period', 'case_count': 'case_count', 'facility_id': 'facility_id', 'facility_name': 'facility_name', 'lga_id': 'lga_id', 'lga_name': 'lga_name', 'lastupdated': 'lastupdated', 'facility_name_dim': 'facility_name_dim', 'parentlganame': 'parentlganame', 'parentwardname': 'parentwardname', });
lyr_Anambra_State_1.set('fieldImages', {'fid': '', 'globalid': '', 'uniq_id': '', 'timestamp': '', 'editor': '', 'statename': '', 'statecode': '', 'capcity': '', 'source': '', 'geozone': '', });
lyr_vw_death_cases_2.set('fieldImages', {'fact_record_id': '', 'dataset_uid': '', 'dataelement_uid': '', 'dataelement_name': '', 'period': '', 'case_count': '', 'facility_id': '', 'facility_name': '', 'lga_id': '', 'lga_name': '', 'lastupdated': '', 'facility_name_dim': '', 'parentlganame': '', 'parentwardname': '', });
lyr_Anambra_State_1.set('fieldLabels', {'fid': 'no label', 'globalid': 'no label', 'uniq_id': 'no label', 'timestamp': 'no label', 'editor': 'no label', 'statename': 'no label', 'statecode': 'no label', 'capcity': 'no label', 'source': 'no label', 'geozone': 'no label', });
lyr_vw_death_cases_2.set('fieldLabels', {'fact_record_id': 'no label', 'dataset_uid': 'no label', 'dataelement_uid': 'no label', 'dataelement_name': 'no label', 'period': 'no label', 'case_count': 'no label', 'facility_id': 'no label', 'facility_name': 'no label', 'lga_id': 'no label', 'lga_name': 'no label', 'lastupdated': 'no label', 'facility_name_dim': 'no label', 'parentlganame': 'no label', 'parentwardname': 'no label', });
lyr_vw_death_cases_2.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});