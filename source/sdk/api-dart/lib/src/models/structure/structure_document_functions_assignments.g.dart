// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'structure_document_functions_assignments.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StructureStructureDocumentFunctionsAssignments _$StructureStructureDocumentFunctionsAssignmentsFromJson(Map<String, dynamic> json) =>
    StructureStructureDocumentFunctionsAssignments(
      citationId: json['citationId'] as String?,
      id: json['id'] as String,
      institutionId: json['institutionId'] as String?,
      share: json['share'] as String,
      startInstitutionId: json['startInstitutionId'] as String?,
      startPositionId: json['startPositionId'] as String?,
    );

Map<String, dynamic> _$StructureStructureDocumentFunctionsAssignmentsToJson(StructureStructureDocumentFunctionsAssignments instance) =>
    <String, dynamic>{
      'citationId': ?instance.citationId,
      'id': instance.id,
      'institutionId': ?instance.institutionId,
      'share': instance.share,
      'startInstitutionId': ?instance.startInstitutionId,
      'startPositionId': ?instance.startPositionId,
    };
