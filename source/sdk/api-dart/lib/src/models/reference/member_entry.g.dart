// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'member_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceMemberEntry _$ReferenceMemberEntryFromJson(Map<String, dynamic> json) => ReferenceMemberEntry(
  code: json['code'] as String,
  id: json['id'] as String,
  label: json['label'] as String,
  supersedesId: json['supersedesId'] as String?,
);

Map<String, dynamic> _$ReferenceMemberEntryToJson(ReferenceMemberEntry instance) => <String, dynamic>{
  'code': instance.code,
  'id': instance.id,
  'label': instance.label,
  'supersedesId': ?instance.supersedesId,
};
