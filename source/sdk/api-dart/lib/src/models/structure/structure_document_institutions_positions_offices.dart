import 'package:json_annotation/json_annotation.dart';

part 'structure_document_institutions_positions_offices.g.dart';

/// Structure Document Institutions Positions Offices
@JsonSerializable(includeIfNull: false)
class StructureStructureDocumentInstitutionsPositionsOffices {
  const StructureStructureDocumentInstitutionsPositionsOffices({
    this.abolishedOn,
    required this.code,
    this.featureId,
    required this.id,
    this.ordinal,
  });
  final DateTime? abolishedOn;
  final String code;
  final String? featureId;
  final String id;
  final int? ordinal;

  factory StructureStructureDocumentInstitutionsPositionsOffices.fromJson(Map<String, dynamic> json) =>
      _$StructureStructureDocumentInstitutionsPositionsOfficesFromJson(json);

  Map<String, dynamic> toJson() => _$StructureStructureDocumentInstitutionsPositionsOfficesToJson(this);
}
