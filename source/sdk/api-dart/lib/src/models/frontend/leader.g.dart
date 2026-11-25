// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'leader.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FrontendLeader _$FrontendLeaderFromJson(Map<String, dynamic> json) => FrontendLeader(
  fromYear: (json['fromYear'] as num?)?.toInt(),
  office: json['office'] as String,
  officeName: SharedLocalizedText.fromJson(json['officeName'] as Map<String, dynamic>),
  person: json['person'] as String?,
  personName: json['personName'] == null ? null : SharedLocalizedText.fromJson(json['personName'] as Map<String, dynamic>),
);

Map<String, dynamic> _$FrontendLeaderToJson(FrontendLeader instance) => <String, dynamic>{
  'fromYear': ?instance.fromYear,
  'office': instance.office,
  'officeName': instance.officeName,
  'person': ?instance.person,
  'personName': ?instance.personName,
};
