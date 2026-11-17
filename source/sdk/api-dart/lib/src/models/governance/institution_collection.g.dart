// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceInstitutionCollection _$GovernanceInstitutionCollectionFromJson(Map<String, dynamic> json) => GovernanceInstitutionCollection(
  institutions: (json['institutions'] as List<dynamic>).map((e) => GovernanceInstitutionEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$GovernanceInstitutionCollectionToJson(GovernanceInstitutionCollection instance) => <String, dynamic>{
  'institutions': instance.institutions,
};
