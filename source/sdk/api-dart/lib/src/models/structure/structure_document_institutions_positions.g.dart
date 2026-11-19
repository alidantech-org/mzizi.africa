// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'structure_document_institutions_positions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StructureStructureDocumentInstitutionsPositions _$StructureStructureDocumentInstitutionsPositionsFromJson(Map<String, dynamic> json) =>
    StructureStructureDocumentInstitutionsPositions(
      citationId: json['citationId'] as String?,
      code: json['code'] as String,
      fixedSeats: (json['fixedSeats'] as num?)?.toInt(),
      id: json['id'] as String,
      offices: (json['offices'] as List<dynamic>)
          .map((e) => StructureStructureDocumentInstitutionsPositionsOffices.fromJson(e as Map<String, dynamic>))
          .toList(),
      powers: (json['powers'] as List<dynamic>)
          .map((e) => StructureStructureDocumentInstitutionsPositionsPowers.fromJson(e as Map<String, dynamic>))
          .toList(),
      role: json['role'] as String,
      seatBasisCode: json['seatBasisCode'] as String,
      seatBasisLabel: json['seatBasisLabel'] as String,
      selectionCode: json['selectionCode'] as String,
      selectionLabel: json['selectionLabel'] as String,
      termLimit: (json['termLimit'] as num?)?.toInt(),
      termYears: (json['termYears'] as num?)?.toInt(),
      title: json['title'] as String,
      unitLevelId: json['unitLevelId'] as String?,
    );

Map<String, dynamic> _$StructureStructureDocumentInstitutionsPositionsToJson(StructureStructureDocumentInstitutionsPositions instance) =>
    <String, dynamic>{
      'citationId': ?instance.citationId,
      'code': instance.code,
      'fixedSeats': ?instance.fixedSeats,
      'id': instance.id,
      'offices': instance.offices,
      'powers': instance.powers,
      'role': instance.role,
      'seatBasisCode': instance.seatBasisCode,
      'seatBasisLabel': instance.seatBasisLabel,
      'selectionCode': instance.selectionCode,
      'selectionLabel': instance.selectionLabel,
      'termLimit': ?instance.termLimit,
      'termYears': ?instance.termYears,
      'title': instance.title,
      'unitLevelId': ?instance.unitLevelId,
    };
