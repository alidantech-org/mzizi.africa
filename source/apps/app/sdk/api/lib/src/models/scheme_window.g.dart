// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'scheme_window.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SchemeWindow _$SchemeWindowFromJson(Map<String, dynamic> json) => SchemeWindow(
  code: json['code'] as String?,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$SchemeWindowToJson(SchemeWindow instance) =>
    <String, dynamic>{
      'code': ?instance.code,
      'limit': ?instance.limit,
      'offset': ?instance.offset,
    };
