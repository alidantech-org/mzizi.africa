// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'engagement_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InteractionsEngagementInput _$InteractionsEngagementInputFromJson(Map<String, dynamic> json) => InteractionsEngagementInput(
  deviceId: json['deviceId'] as String?,
  subjectRef: json['subjectRef'] as String,
  subjectTable: json['subjectTable'] as String,
);

Map<String, dynamic> _$InteractionsEngagementInputToJson(InteractionsEngagementInput instance) => <String, dynamic>{
  'deviceId': ?instance.deviceId,
  'subjectRef': instance.subjectRef,
  'subjectTable': instance.subjectTable,
};
