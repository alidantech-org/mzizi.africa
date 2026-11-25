// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_window.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceInstitutionWindow _$GovernanceInstitutionWindowFromJson(Map<String, dynamic> json) => GovernanceInstitutionWindow(
  armTerm: json['armTerm'] as String?,
  countryId: json['countryId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$GovernanceInstitutionWindowToJson(GovernanceInstitutionWindow instance) => <String, dynamic>{
  'armTerm': ?instance.armTerm,
  'countryId': instance.countryId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
