// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'country_scope.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceCountryScope _$ReferenceCountryScopeFromJson(Map<String, dynamic> json) => ReferenceCountryScope(
  countryId: json['countryId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$ReferenceCountryScopeToJson(ReferenceCountryScope instance) => <String, dynamic>{
  'countryId': instance.countryId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
