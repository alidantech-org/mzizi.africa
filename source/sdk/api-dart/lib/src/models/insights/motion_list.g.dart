// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'motion_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsMotionList _$InsightsMotionListFromJson(Map<String, dynamic> json) => InsightsMotionList(
  motions: (json['motions'] as List<dynamic>).map((e) => InsightsMotionListMotions.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$InsightsMotionListToJson(InsightsMotionList instance) => <String, dynamic>{'motions': instance.motions};
