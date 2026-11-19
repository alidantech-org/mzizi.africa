// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'structure_document_institutions_positions_powers.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StructureStructureDocumentInstitutionsPositionsPowers _$StructureStructureDocumentInstitutionsPositionsPowersFromJson(
  Map<String, dynamic> json,
) => StructureStructureDocumentInstitutionsPositionsPowers(
  binding: json['binding'] as bool,
  citationId: json['citationId'] as String?,
  code: json['code'] as String,
  id: json['id'] as String,
  kind: json['kind'] as String,
  procedureId: json['procedureId'] as String?,
  step: (json['step'] as num?)?.toInt(),
  targetInstitutionId: json['targetInstitutionId'] as String?,
  targetPositionId: json['targetPositionId'] as String?,
);

Map<String, dynamic> _$StructureStructureDocumentInstitutionsPositionsPowersToJson(
  StructureStructureDocumentInstitutionsPositionsPowers instance,
) => <String, dynamic>{
  'binding': instance.binding,
  'citationId': ?instance.citationId,
  'code': instance.code,
  'id': instance.id,
  'kind': instance.kind,
  'procedureId': ?instance.procedureId,
  'step': ?instance.step,
  'targetInstitutionId': ?instance.targetInstitutionId,
  'targetPositionId': ?instance.targetPositionId,
};
