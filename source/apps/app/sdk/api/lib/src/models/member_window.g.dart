// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'member_window.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MemberWindow _$MemberWindowFromJson(Map<String, dynamic> json) => MemberWindow(
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
  schemeId: json['schemeId'] as String,
);

Map<String, dynamic> _$MemberWindowToJson(MemberWindow instance) =>
    <String, dynamic>{
      'limit': ?instance.limit,
      'offset': ?instance.offset,
      'schemeId': instance.schemeId,
    };
