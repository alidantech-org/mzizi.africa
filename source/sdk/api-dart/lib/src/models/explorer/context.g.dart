// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'context.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerContext _$ExplorerContextFromJson(Map<String, dynamic> json) => ExplorerContext(
  chain: (json['chain'] as List<dynamic>).map((e) => ExplorerPlace.fromJson(e as Map<String, dynamic>)).toList(),
  country: ExplorerCountryChoice.fromJson(json['country'] as Map<String, dynamic>),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  language: json['language'] as String,
  levels: (json['levels'] as List<dynamic>).map((e) => ExplorerLevel.fromJson(e as Map<String, dynamic>)).toList(),
  place: ExplorerPlace.fromJson(json['place'] as Map<String, dynamic>),
);

Map<String, dynamic> _$ExplorerContextToJson(ExplorerContext instance) => <String, dynamic>{
  'chain': instance.chain,
  'country': instance.country,
  'gaps': instance.gaps,
  'language': instance.language,
  'levels': instance.levels,
  'place': instance.place,
};
