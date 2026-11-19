// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'structure_document.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StructureStructureDocument _$StructureStructureDocumentFromJson(Map<String, dynamic> json) => StructureStructureDocument(
  countryCode: json['countryCode'] as String?,
  countryId: json['countryId'] as String,
  countryName: json['countryName'] as String,
  functions: (json['functions'] as List<dynamic>).map((e) => StructureStructureDocumentFunctions.fromJson(e as Map<String, dynamic>)).toList(),
  institutions: (json['institutions'] as List<dynamic>)
      .map((e) => StructureStructureDocumentInstitutions.fromJson(e as Map<String, dynamic>))
      .toList(),
  procedures: (json['procedures'] as List<dynamic>)
      .map((e) => StructureStructureDocumentProcedures.fromJson(e as Map<String, dynamic>))
      .toList(),
);

Map<String, dynamic> _$StructureStructureDocumentToJson(StructureStructureDocument instance) => <String, dynamic>{
  'countryCode': ?instance.countryCode,
  'countryId': instance.countryId,
  'countryName': instance.countryName,
  'functions': instance.functions,
  'institutions': instance.institutions,
  'procedures': instance.procedures,
};
