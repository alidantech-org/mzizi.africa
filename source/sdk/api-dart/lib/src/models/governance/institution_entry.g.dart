// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceInstitutionEntry _$GovernanceInstitutionEntryFromJson(Map<String, dynamic> json) => GovernanceInstitutionEntry(
  armTerm: json['armTerm'] as String?,
  classTerm: json['classTerm'] as String?,
  code: json['code'] as String,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  institutionId: json['institutionId'] as String,
  kindTerm: json['kindTerm'] as String,
  names: (json['names'] as List<dynamic>).map((e) => GovernanceInstitutionEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$GovernanceInstitutionEntryToJson(GovernanceInstitutionEntry instance) => <String, dynamic>{
  'armTerm': ?instance.armTerm,
  'classTerm': ?instance.classTerm,
  'code': instance.code,
  'fromYear': ?instance.fromYear,
  'institutionId': instance.institutionId,
  'kindTerm': instance.kindTerm,
  'names': instance.names,
  'toYear': ?instance.toYear,
};
