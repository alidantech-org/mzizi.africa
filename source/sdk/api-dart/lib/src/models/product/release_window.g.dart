// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'release_window.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductReleaseWindow _$ProductReleaseWindowFromJson(Map<String, dynamic> json) =>
    ProductReleaseWindow(limit: (json['limit'] as num?)?.toInt(), offset: (json['offset'] as num?)?.toInt());

Map<String, dynamic> _$ProductReleaseWindowToJson(ProductReleaseWindow instance) => <String, dynamic>{
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
