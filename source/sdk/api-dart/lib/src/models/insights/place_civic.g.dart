// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_civic.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceCivic _$InsightsPlaceCivicFromJson(Map<String, dynamic> json) => InsightsPlaceCivic(
  chain: (json['chain'] as List<dynamic>).map((e) => InsightsPlaceCrumb.fromJson(e as Map<String, dynamic>)).toList(),
  classes: json['classes'] as List<dynamic>,
  fund: json['fund'],
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  infrastructure: json['infrastructure'],
  leadership: json['leadership'] as List<dynamic>,
  place: InsightsPlaceCrumb.fromJson(json['place'] as Map<String, dynamic>),
  projects: json['projects'] as List<dynamic>,
  years: json['years'] as List<dynamic>,
);

Map<String, dynamic> _$InsightsPlaceCivicToJson(InsightsPlaceCivic instance) => <String, dynamic>{
  'chain': instance.chain,
  'classes': instance.classes,
  'fund': ?instance.fund,
  'gaps': instance.gaps,
  'infrastructure': ?instance.infrastructure,
  'leadership': instance.leadership,
  'place': instance.place,
  'projects': instance.projects,
  'years': instance.years,
};
