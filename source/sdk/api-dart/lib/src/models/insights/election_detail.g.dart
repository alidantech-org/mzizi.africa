// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'election_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsElectionDetail _$InsightsElectionDetailFromJson(Map<String, dynamic> json) => InsightsElectionDetail(
  contests: json['contests'] as List<dynamic>,
  election: json['election'],
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  totals: json['totals'] as List<dynamic>,
  units: json['units'] as List<dynamic>,
);

Map<String, dynamic> _$InsightsElectionDetailToJson(InsightsElectionDetail instance) => <String, dynamic>{
  'contests': instance.contests,
  'election': ?instance.election,
  'gaps': instance.gaps,
  'totals': instance.totals,
  'units': instance.units,
};
