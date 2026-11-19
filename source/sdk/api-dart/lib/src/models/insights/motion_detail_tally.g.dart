// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'motion_detail_tally.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsMotionDetailTally _$InsightsMotionDetailTallyFromJson(Map<String, dynamic> json) => InsightsMotionDetailTally(
  absent: (json['absent'] as num).toDouble(),
  abstain: (json['abstain'] as num).toDouble(),
  no: (json['no'] as num).toDouble(),
  passed: json['passed'] as bool,
  total: (json['total'] as num).toDouble(),
  yes: (json['yes'] as num).toDouble(),
);

Map<String, dynamic> _$InsightsMotionDetailTallyToJson(InsightsMotionDetailTally instance) => <String, dynamic>{
  'absent': instance.absent,
  'abstain': instance.abstain,
  'no': instance.no,
  'passed': instance.passed,
  'total': instance.total,
  'yes': instance.yes,
};
