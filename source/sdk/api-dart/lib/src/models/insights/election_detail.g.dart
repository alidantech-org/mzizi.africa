// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'election_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsElectionDetail _$InsightsElectionDetailFromJson(Map<String, dynamic> json) => InsightsElectionDetail(
  contests: (json['contests'] as List<dynamic>).map((e) => InsightsElectionDetailContests.fromJson(e as Map<String, dynamic>)).toList(),
  election: InsightsElectionDetailElection.fromJson(json['election'] as Map<String, dynamic>),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  totals: (json['totals'] as List<dynamic>).map((e) => InsightsElectionDetailTotals.fromJson(e as Map<String, dynamic>)).toList(),
  units: (json['units'] as List<dynamic>).map((e) => InsightsElectionDetailUnits.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$InsightsElectionDetailToJson(InsightsElectionDetail instance) => <String, dynamic>{
  'contests': instance.contests,
  'election': instance.election,
  'gaps': instance.gaps,
  'totals': instance.totals,
  'units': instance.units,
};
