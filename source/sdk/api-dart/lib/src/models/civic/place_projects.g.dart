// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_projects.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicPlaceProjects _$CivicPlaceProjectsFromJson(Map<String, dynamic> json) => CivicPlaceProjects(
  featureId: json['featureId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$CivicPlaceProjectsToJson(CivicPlaceProjects instance) => <String, dynamic>{
  'featureId': instance.featureId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
