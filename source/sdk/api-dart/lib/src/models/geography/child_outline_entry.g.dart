// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'child_outline_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyChildOutlineEntry _$GeographyChildOutlineEntryFromJson(Map<String, dynamic> json) => GeographyChildOutlineEntry(
  code: json['code'] as String,
  featureId: json['featureId'] as String,
  outlines: (json['outlines'] as List<dynamic>).map((e) => GeographyChildOutlineEntryOutlines.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$GeographyChildOutlineEntryToJson(GeographyChildOutlineEntry instance) => <String, dynamic>{
  'code': instance.code,
  'featureId': instance.featureId,
  'outlines': instance.outlines,
};
