// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'structure_document_institutions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StructureStructureDocumentInstitutions _$StructureStructureDocumentInstitutionsFromJson(Map<String, dynamic> json) =>
    StructureStructureDocumentInstitutions(
      arm: json['arm'] as String?,
      citationId: json['citationId'] as String?,
      code: json['code'] as String,
      id: json['id'] as String,
      kind: json['kind'] as String,
      names: (json['names'] as List<dynamic>)
          .map((e) => StructureStructureDocumentInstitutionsNames.fromJson(e as Map<String, dynamic>))
          .toList(),
      positions: (json['positions'] as List<dynamic>)
          .map((e) => StructureStructureDocumentInstitutionsPositions.fromJson(e as Map<String, dynamic>))
          .toList(),
      powers: (json['powers'] as List<dynamic>)
          .map((e) => StructureStructureDocumentInstitutionsPowers.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$StructureStructureDocumentInstitutionsToJson(StructureStructureDocumentInstitutions instance) => <String, dynamic>{
  'arm': ?instance.arm,
  'citationId': ?instance.citationId,
  'code': instance.code,
  'id': instance.id,
  'kind': instance.kind,
  'names': instance.names,
  'positions': instance.positions,
  'powers': instance.powers,
};
