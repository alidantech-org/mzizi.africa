// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_civic.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceCivic _$InsightsPlaceCivicFromJson(Map<String, dynamic> json) => InsightsPlaceCivic(
  chain: (json['chain'] as List<dynamic>).map((e) => InsightsPlaceCrumb.fromJson(e as Map<String, dynamic>)).toList(),
  classes: (json['classes'] as List<dynamic>).map((e) => InsightsPlaceCivicClasses.fromJson(e as Map<String, dynamic>)).toList(),
  fund: InsightsPlaceCivicFund.fromJson(json['fund'] as Map<String, dynamic>),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  infrastructure: InsightsPlaceCivicInfrastructure.fromJson(json['infrastructure'] as Map<String, dynamic>),
  leadership: (json['leadership'] as List<dynamic>).map((e) => InsightsPlaceCivicLeadership.fromJson(e as Map<String, dynamic>)).toList(),
  place: InsightsPlaceCrumb.fromJson(json['place'] as Map<String, dynamic>),
  projects: (json['projects'] as List<dynamic>).map((e) => InsightsPlaceCivicProjects.fromJson(e as Map<String, dynamic>)).toList(),
  years: (json['years'] as List<dynamic>).map((e) => InsightsPlaceCivicYears.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$InsightsPlaceCivicToJson(InsightsPlaceCivic instance) => <String, dynamic>{
  'chain': instance.chain,
  'classes': instance.classes,
  'fund': instance.fund,
  'gaps': instance.gaps,
  'infrastructure': instance.infrastructure,
  'leadership': instance.leadership,
  'place': instance.place,
  'projects': instance.projects,
  'years': instance.years,
};
