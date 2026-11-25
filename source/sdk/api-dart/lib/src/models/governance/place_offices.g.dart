// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_offices.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernancePlaceOffices _$GovernancePlaceOfficesFromJson(Map<String, dynamic> json) => GovernancePlaceOffices(
  featureId: json['featureId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$GovernancePlaceOfficesToJson(GovernancePlaceOffices instance) => <String, dynamic>{
  'featureId': instance.featureId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
