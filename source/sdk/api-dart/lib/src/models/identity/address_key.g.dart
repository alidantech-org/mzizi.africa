// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'address_key.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

IdentityAddressKey _$IdentityAddressKeyFromJson(Map<String, dynamic> json) => IdentityAddressKey(
  countryId: json['countryId'] as String?,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
  segment: json['segment'] as String,
);

Map<String, dynamic> _$IdentityAddressKeyToJson(IdentityAddressKey instance) => <String, dynamic>{
  'countryId': ?instance.countryId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
  'segment': instance.segment,
};
