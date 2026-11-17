// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'page_window.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PageWindow _$PageWindowFromJson(Map<String, dynamic> json) => PageWindow(
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$PageWindowToJson(PageWindow instance) =>
    <String, dynamic>{'limit': ?instance.limit, 'offset': ?instance.offset};
