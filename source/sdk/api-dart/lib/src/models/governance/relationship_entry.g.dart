// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'relationship_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceRelationshipEntry _$GovernanceRelationshipEntryFromJson(Map<String, dynamic> json) => GovernanceRelationshipEntry(
  fromCode: json['fromCode'] as String,
  fromId: json['fromId'] as String,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  kindTerm: json['kindTerm'] as String,
  names: (json['names'] as List<dynamic>).map((e) => GovernanceRelationshipEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$GovernanceRelationshipEntryToJson(GovernanceRelationshipEntry instance) => <String, dynamic>{
  'fromCode': instance.fromCode,
  'fromId': instance.fromId,
  'fromYear': ?instance.fromYear,
  'kindTerm': instance.kindTerm,
  'names': instance.names,
  'toYear': ?instance.toYear,
};
