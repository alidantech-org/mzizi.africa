// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'structure_document_functions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StructureStructureDocumentFunctions _$StructureStructureDocumentFunctionsFromJson(Map<String, dynamic> json) =>
    StructureStructureDocumentFunctions(
      assignments: (json['assignments'] as List<dynamic>)
          .map((e) => StructureStructureDocumentFunctionsAssignments.fromJson(e as Map<String, dynamic>))
          .toList(),
      citationId: json['citationId'] as String?,
      code: json['code'] as String,
      id: json['id'] as String,
      parentId: json['parentId'] as String?,
    );

Map<String, dynamic> _$StructureStructureDocumentFunctionsToJson(StructureStructureDocumentFunctions instance) => <String, dynamic>{
  'assignments': instance.assignments,
  'citationId': ?instance.citationId,
  'code': instance.code,
  'id': instance.id,
  'parentId': ?instance.parentId,
};
