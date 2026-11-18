// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'calendar_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceCalendarInput _$ExperienceCalendarInputFromJson(Map<String, dynamic> json) => ExperienceCalendarInput(
  featureId: json['featureId'] as String?,
  from: json['from'] == null ? null : DateTime.parse(json['from'] as String),
  kindCode: json['kindCode'] as String?,
  languageCode: json['languageCode'] as String?,
  to: json['to'] == null ? null : DateTime.parse(json['to'] as String),
);

Map<String, dynamic> _$ExperienceCalendarInputToJson(ExperienceCalendarInput instance) => <String, dynamic>{
  'featureId': ?instance.featureId,
  'from': ?instance.from?.toIso8601String(),
  'kindCode': ?instance.kindCode,
  'languageCode': ?instance.languageCode,
  'to': ?instance.to?.toIso8601String(),
};
