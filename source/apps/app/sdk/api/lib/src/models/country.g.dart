// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'country.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Country _$CountryFromJson(Map<String, dynamic> json) => Country(
  callingCode: json['callingCode'] as String?,
  code: json['code'] as String,
  continentId: json['continentId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currencyId: json['currencyId'] as String?,
  deletedAt: json['deletedAt'] == null
      ? null
      : DateTime.parse(json['deletedAt'] as String),
  designationId: json['designationId'] as String?,
  establishedOn: json['establishedOn'] == null
      ? null
      : DateTime.parse(json['establishedOn'] as String),
  id: json['id'] as String,
  isoAlpha2: json['isoAlpha2'] as String?,
  isoAlpha3: json['isoAlpha3'] as String?,
  isoNumeric: json['isoNumeric'] as String?,
  name: json['name'] as String,
  officialName: json['officialName'] as String?,
  recognitionStatusId: json['recognitionStatusId'] as String?,
  subregionId: json['subregionId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CountryToJson(Country instance) => <String, dynamic>{
  'callingCode': ?instance.callingCode,
  'code': instance.code,
  'continentId': ?instance.continentId,
  'createdAt': instance.createdAt.toIso8601String(),
  'currencyId': ?instance.currencyId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'designationId': ?instance.designationId,
  'establishedOn': ?instance.establishedOn?.toIso8601String(),
  'id': instance.id,
  'isoAlpha2': ?instance.isoAlpha2,
  'isoAlpha3': ?instance.isoAlpha3,
  'isoNumeric': ?instance.isoNumeric,
  'name': instance.name,
  'officialName': ?instance.officialName,
  'recognitionStatusId': ?instance.recognitionStatusId,
  'subregionId': ?instance.subregionId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
