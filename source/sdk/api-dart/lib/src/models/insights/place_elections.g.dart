// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_elections.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceElections _$InsightsPlaceElectionsFromJson(Map<String, dynamic> json) => InsightsPlaceElections(
  elections: (json['elections'] as List<dynamic>).map((e) => InsightsPlaceElectionsElections.fromJson(e as Map<String, dynamic>)).toList(),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  place: InsightsPlaceCrumb.fromJson(json['place'] as Map<String, dynamic>),
  registrationTrend: (json['registrationTrend'] as List<dynamic>)
      .map((e) => InsightsPlaceElectionsRegistrationTrend.fromJson(e as Map<String, dynamic>))
      .toList(),
  turnoutTrend: (json['turnoutTrend'] as List<dynamic>)
      .map((e) => InsightsPlaceElectionsTurnoutTrend.fromJson(e as Map<String, dynamic>))
      .toList(),
);

Map<String, dynamic> _$InsightsPlaceElectionsToJson(InsightsPlaceElections instance) => <String, dynamic>{
  'elections': instance.elections,
  'gaps': instance.gaps,
  'place': instance.place,
  'registrationTrend': instance.registrationTrend,
  'turnoutTrend': instance.turnoutTrend,
};
