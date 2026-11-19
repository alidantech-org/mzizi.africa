// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'country_context_document.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StructureCountryContextDocument _$StructureCountryContextDocumentFromJson(Map<String, dynamic> json) => StructureCountryContextDocument(
  code: json['code'] as String?,
  countryId: json['countryId'] as String,
  levels: (json['levels'] as List<dynamic>).map((e) => StructureCountryContextDocumentLevels.fromJson(e as Map<String, dynamic>)).toList(),
  name: json['name'] as String,
);

Map<String, dynamic> _$StructureCountryContextDocumentToJson(StructureCountryContextDocument instance) => <String, dynamic>{
  'code': ?instance.code,
  'countryId': instance.countryId,
  'levels': instance.levels,
  'name': instance.name,
};
