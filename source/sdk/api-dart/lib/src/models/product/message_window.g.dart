// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'message_window.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductMessageWindow _$ProductMessageWindowFromJson(Map<String, dynamic> json) => ProductMessageWindow(
  appCode: json['appCode'] as String,
  lang: json['lang'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$ProductMessageWindowToJson(ProductMessageWindow instance) => <String, dynamic>{
  'appCode': instance.appCode,
  'lang': instance.lang,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
