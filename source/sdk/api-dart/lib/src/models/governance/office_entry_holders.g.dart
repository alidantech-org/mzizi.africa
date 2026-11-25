// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'office_entry_holders.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceOfficeEntryHolders _$GovernanceOfficeEntryHoldersFromJson(Map<String, dynamic> json) => GovernanceOfficeEntryHolders(
  endsOn: json['endsOn'] == null ? null : DateTime.parse(json['endsOn'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  holderId: json['holderId'] as String,
  individualCode: json['individualCode'] as String,
  individualId: json['individualId'] as String,
  methodTerm: json['methodTerm'] as String,
  names: (json['names'] as List<dynamic>).map((e) => GovernanceOfficeEntryHoldersNames.fromJson(e as Map<String, dynamic>)).toList(),
  startsOn: json['startsOn'] == null ? null : DateTime.parse(json['startsOn'] as String),
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$GovernanceOfficeEntryHoldersToJson(GovernanceOfficeEntryHolders instance) => <String, dynamic>{
  'endsOn': ?instance.endsOn?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'holderId': instance.holderId,
  'individualCode': instance.individualCode,
  'individualId': instance.individualId,
  'methodTerm': instance.methodTerm,
  'names': instance.names,
  'startsOn': ?instance.startsOn?.toIso8601String(),
  'toYear': ?instance.toYear,
};
