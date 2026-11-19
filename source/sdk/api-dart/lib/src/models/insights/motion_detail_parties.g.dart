// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'motion_detail_parties.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsMotionDetailParties _$InsightsMotionDetailPartiesFromJson(Map<String, dynamic> json) => InsightsMotionDetailParties(
  absent: (json['absent'] as num).toDouble(),
  abstain: (json['abstain'] as num).toDouble(),
  no: (json['no'] as num).toDouble(),
  party: json['party'] as String,
  yes: (json['yes'] as num).toDouble(),
);

Map<String, dynamic> _$InsightsMotionDetailPartiesToJson(InsightsMotionDetailParties instance) => <String, dynamic>{
  'absent': instance.absent,
  'abstain': instance.abstain,
  'no': instance.no,
  'party': instance.party,
  'yes': instance.yes,
};
