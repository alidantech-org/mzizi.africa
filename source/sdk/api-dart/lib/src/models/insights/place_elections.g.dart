// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_elections.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceElections _$InsightsPlaceElectionsFromJson(Map<String, dynamic> json) => InsightsPlaceElections(
  elections: json['elections'] as List<dynamic>,
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  place: InsightsPlaceCrumb.fromJson(json['place'] as Map<String, dynamic>),
  registrationTrend: json['registrationTrend'] as List<dynamic>,
  turnoutTrend: json['turnoutTrend'] as List<dynamic>,
);

Map<String, dynamic> _$InsightsPlaceElectionsToJson(InsightsPlaceElections instance) => <String, dynamic>{
  'elections': instance.elections,
  'gaps': instance.gaps,
  'place': instance.place,
  'registrationTrend': instance.registrationTrend,
  'turnoutTrend': instance.turnoutTrend,
};
