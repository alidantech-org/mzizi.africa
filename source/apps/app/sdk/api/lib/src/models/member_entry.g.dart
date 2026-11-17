// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'member_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MemberEntry _$MemberEntryFromJson(Map<String, dynamic> json) => MemberEntry(
  code: json['code'] as String,
  id: json['id'] as String,
  label: json['label'] as String,
  supersedesId: json['supersedesId'] as String?,
);

Map<String, dynamic> _$MemberEntryToJson(MemberEntry instance) =>
    <String, dynamic>{
      'code': instance.code,
      'id': instance.id,
      'label': instance.label,
      'supersedesId': ?instance.supersedesId,
    };
