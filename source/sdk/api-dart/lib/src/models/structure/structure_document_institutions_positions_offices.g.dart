// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'structure_document_institutions_positions_offices.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StructureStructureDocumentInstitutionsPositionsOffices _$StructureStructureDocumentInstitutionsPositionsOfficesFromJson(
  Map<String, dynamic> json,
) => StructureStructureDocumentInstitutionsPositionsOffices(
  abolishedOn: json['abolishedOn'] == null ? null : DateTime.parse(json['abolishedOn'] as String),
  code: json['code'] as String,
  featureId: json['featureId'] as String?,
  id: json['id'] as String,
  ordinal: (json['ordinal'] as num?)?.toInt(),
);

Map<String, dynamic> _$StructureStructureDocumentInstitutionsPositionsOfficesToJson(
  StructureStructureDocumentInstitutionsPositionsOffices instance,
) => <String, dynamic>{
  'abolishedOn': ?instance.abolishedOn?.toIso8601String(),
  'code': instance.code,
  'featureId': ?instance.featureId,
  'id': instance.id,
  'ordinal': ?instance.ordinal,
};
