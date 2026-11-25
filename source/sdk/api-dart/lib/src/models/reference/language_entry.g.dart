// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'language_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceLanguageEntry _$ReferenceLanguageEntryFromJson(Map<String, dynamic> json) => ReferenceLanguageEntry(
  code: json['code'] as String,
  directionTerm: json['directionTerm'] as String?,
  iso6391: json['iso6391'] as String?,
  iso6393: json['iso6393'] as String?,
  languageId: json['languageId'] as String,
  names: (json['names'] as List<dynamic>).map((e) => ReferenceLanguageEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$ReferenceLanguageEntryToJson(ReferenceLanguageEntry instance) => <String, dynamic>{
  'code': instance.code,
  'directionTerm': ?instance.directionTerm,
  'iso6391': ?instance.iso6391,
  'iso6393': ?instance.iso6393,
  'languageId': instance.languageId,
  'names': instance.names,
};
