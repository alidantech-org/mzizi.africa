// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'outline_window.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyOutlineWindow _$GeographyOutlineWindowFromJson(Map<String, dynamic> json) => GeographyOutlineWindow(
  band: (json['band'] as num).toInt(),
  featureId: json['featureId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$GeographyOutlineWindowToJson(GeographyOutlineWindow instance) => <String, dynamic>{
  'band': instance.band,
  'featureId': instance.featureId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
