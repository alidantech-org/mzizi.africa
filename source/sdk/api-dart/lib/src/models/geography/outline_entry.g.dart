// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'outline_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyOutlineEntry _$GeographyOutlineEntryFromJson(Map<String, dynamic> json) => GeographyOutlineEntry(
  band: (json['band'] as num).toInt(),
  featureId: json['featureId'] as String,
  geometryId: json['geometryId'] as String,
  points: (json['points'] as num).toInt(),
  roleTerm: json['roleTerm'] as String,
);

Map<String, dynamic> _$GeographyOutlineEntryToJson(GeographyOutlineEntry instance) => <String, dynamic>{
  'band': instance.band,
  'featureId': instance.featureId,
  'geometryId': instance.geometryId,
  'points': instance.points,
  'roleTerm': instance.roleTerm,
};
