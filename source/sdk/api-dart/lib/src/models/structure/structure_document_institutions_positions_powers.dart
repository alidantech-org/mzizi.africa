import 'package:json_annotation/json_annotation.dart';

part 'structure_document_institutions_positions_powers.g.dart';

/// Structure Document Institutions Positions Powers
@JsonSerializable(includeIfNull: false)
class StructureStructureDocumentInstitutionsPositionsPowers {
  const StructureStructureDocumentInstitutionsPositionsPowers({
    required this.binding,
    this.citationId,
    required this.code,
    required this.id,
    required this.kind,
    this.procedureId,
    this.step,
    this.targetInstitutionId,
    this.targetPositionId,
  });
  final bool binding;
  final String? citationId;
  final String code;
  final String id;
  final String kind;
  final String? procedureId;
  final int? step;
  final String? targetInstitutionId;
  final String? targetPositionId;

  factory StructureStructureDocumentInstitutionsPositionsPowers.fromJson(Map<String, dynamic> json) =>
      _$StructureStructureDocumentInstitutionsPositionsPowersFromJson(json);

  Map<String, dynamic> toJson() => _$StructureStructureDocumentInstitutionsPositionsPowersToJson(this);
}
