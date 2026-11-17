// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceInstitutionEntry _$GovernanceInstitutionEntryFromJson(Map<String, dynamic> json) => GovernanceInstitutionEntry(
  code: json['code'] as String,
  id: json['id'] as String,
  kind: json['kind'] as String,
  names: (json['names'] as List<dynamic>).map((e) => GovernanceInstitutionEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$GovernanceInstitutionEntryToJson(GovernanceInstitutionEntry instance) => <String, dynamic>{
  'code': instance.code,
  'id': instance.id,
  'kind': instance.kind,
  'names': instance.names,
};
