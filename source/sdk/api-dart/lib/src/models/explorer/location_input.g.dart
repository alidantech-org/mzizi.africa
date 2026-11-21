// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'location_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerLocationInput _$ExplorerLocationInputFromJson(Map<String, dynamic> json) => ExplorerLocationInput(
  countryCode: json['countryCode'] as String,
  find: json['find'] as String?,
  kindCode: json['kindCode'] as String?,
  languageCode: json['languageCode'] as String?,
  limit: (json['limit'] as num?)?.toInt(),
  page: (json['page'] as num?)?.toInt(),
  path: json['path'] as String?,
);

Map<String, dynamic> _$ExplorerLocationInputToJson(ExplorerLocationInput instance) => <String, dynamic>{
  'countryCode': instance.countryCode,
  'find': ?instance.find,
  'kindCode': ?instance.kindCode,
  'languageCode': ?instance.languageCode,
  'limit': ?instance.limit,
  'page': ?instance.page,
  'path': ?instance.path,
};
