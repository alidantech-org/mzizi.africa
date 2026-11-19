// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'structure_document_procedures.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StructureStructureDocumentProcedures _$StructureStructureDocumentProceduresFromJson(Map<String, dynamic> json) =>
    StructureStructureDocumentProcedures(
      citationId: json['citationId'] as String?,
      code: json['code'] as String,
      description: json['description'] as String,
      id: json['id'] as String,
      kind: json['kind'] as String,
    );

Map<String, dynamic> _$StructureStructureDocumentProceduresToJson(StructureStructureDocumentProcedures instance) => <String, dynamic>{
  'citationId': ?instance.citationId,
  'code': instance.code,
  'description': instance.description,
  'id': instance.id,
  'kind': instance.kind,
};
