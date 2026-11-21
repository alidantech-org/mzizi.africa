// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'boundaries_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerBoundariesInput _$ExplorerBoundariesInputFromJson(Map<String, dynamic> json) => ExplorerBoundariesInput(
  countryCode: json['countryCode'] as String,
  languageCode: json['languageCode'] as String?,
  limit: (json['limit'] as num?)?.toInt(),
  mode: $enumDecodeNullable(_$ExplorerBoundaryModeEnumMap, json['mode']),
  path: json['path'] as String?,
  simplify: (json['simplify'] as num?)?.toDouble(),
);

Map<String, dynamic> _$ExplorerBoundariesInputToJson(ExplorerBoundariesInput instance) => <String, dynamic>{
  'countryCode': instance.countryCode,
  'languageCode': ?instance.languageCode,
  'limit': ?instance.limit,
  'mode': ?_$ExplorerBoundaryModeEnumMap[instance.mode],
  'path': ?instance.path,
  'simplify': ?instance.simplify,
};

const _$ExplorerBoundaryModeEnumMap = {ExplorerBoundaryMode.children: 'children', ExplorerBoundaryMode.self: 'self'};
