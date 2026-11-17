// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_entry_names.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceInstitutionEntryNames _$GovernanceInstitutionEntryNamesFromJson(Map<String, dynamic> json) => GovernanceInstitutionEntryNames(
  isPreferred: json['isPreferred'] as bool,
  languageTag: json['languageTag'] as String?,
  name: json['name'] as String,
);

Map<String, dynamic> _$GovernanceInstitutionEntryNamesToJson(GovernanceInstitutionEntryNames instance) => <String, dynamic>{
  'isPreferred': instance.isPreferred,
  'languageTag': ?instance.languageTag,
  'name': instance.name,
};
