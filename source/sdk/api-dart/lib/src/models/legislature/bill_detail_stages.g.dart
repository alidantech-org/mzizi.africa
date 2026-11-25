// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'bill_detail_stages.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegislatureBillDetailStages _$LegislatureBillDetailStagesFromJson(Map<String, dynamic> json) => LegislatureBillDetailStages(
  kindTerm: json['kindTerm'] as String,
  motionId: json['motionId'] as String?,
  occurrenceId: json['occurrenceId'] as String?,
  onDate: json['onDate'] == null ? null : DateTime.parse(json['onDate'] as String),
  outcomeTerm: json['outcomeTerm'] as String?,
  sequence: (json['sequence'] as num).toInt(),
  sittingId: json['sittingId'] as String?,
);

Map<String, dynamic> _$LegislatureBillDetailStagesToJson(LegislatureBillDetailStages instance) => <String, dynamic>{
  'kindTerm': instance.kindTerm,
  'motionId': ?instance.motionId,
  'occurrenceId': ?instance.occurrenceId,
  'onDate': ?instance.onDate?.toIso8601String(),
  'outcomeTerm': ?instance.outcomeTerm,
  'sequence': instance.sequence,
  'sittingId': ?instance.sittingId,
};
