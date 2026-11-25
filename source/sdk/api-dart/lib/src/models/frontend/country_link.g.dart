// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'country_link.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FrontendCountryLink _$FrontendCountryLinkFromJson(Map<String, dynamic> json) => FrontendCountryLink(
  code: json['code'] as String,
  id: json['id'] as String,
  isoAlpha2: json['isoAlpha2'] as String?,
  name: SharedLocalizedText.fromJson(json['name'] as Map<String, dynamic>),
);

Map<String, dynamic> _$FrontendCountryLinkToJson(FrontendCountryLink instance) => <String, dynamic>{
  'code': instance.code,
  'id': instance.id,
  'isoAlpha2': ?instance.isoAlpha2,
  'name': instance.name,
};
