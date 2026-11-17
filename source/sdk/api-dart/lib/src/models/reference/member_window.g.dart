// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'member_window.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceMemberWindow _$ReferenceMemberWindowFromJson(Map<String, dynamic> json) => ReferenceMemberWindow(
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
  schemeId: json['schemeId'] as String,
);

Map<String, dynamic> _$ReferenceMemberWindowToJson(ReferenceMemberWindow instance) => <String, dynamic>{
  'limit': ?instance.limit,
  'offset': ?instance.offset,
  'schemeId': instance.schemeId,
};
