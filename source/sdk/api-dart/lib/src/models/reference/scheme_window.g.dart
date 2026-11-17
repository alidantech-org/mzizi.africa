// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'scheme_window.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceSchemeWindow _$ReferenceSchemeWindowFromJson(Map<String, dynamic> json) =>
    ReferenceSchemeWindow(code: json['code'] as String?, limit: (json['limit'] as num?)?.toInt(), offset: (json['offset'] as num?)?.toInt());

Map<String, dynamic> _$ReferenceSchemeWindowToJson(ReferenceSchemeWindow instance) => <String, dynamic>{
  'code': ?instance.code,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
