// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_screen.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FrontendInstitutionScreen _$FrontendInstitutionScreenFromJson(Map<String, dynamic> json) => FrontendInstitutionScreen(
  arm: json['arm'] == null ? null : SharedLocalizedText.fromJson(json['arm'] as Map<String, dynamic>),
  code: json['code'] as String,
  language: json['language'] as String,
  name: SharedLocalizedText.fromJson(json['name'] as Map<String, dynamic>),
  offices: (json['offices'] as List<dynamic>).map((e) => FrontendOfficeRow.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$FrontendInstitutionScreenToJson(FrontendInstitutionScreen instance) => <String, dynamic>{
  'arm': ?instance.arm,
  'code': instance.code,
  'language': instance.language,
  'name': instance.name,
  'offices': instance.offices,
};
