import 'package:json_annotation/json_annotation.dart';

part 'structure_document_institutions_powers.g.dart';

/// Structure Document Institutions Powers
@JsonSerializable(includeIfNull: false)
class StructureStructureDocumentInstitutionsPowers {
  const StructureStructureDocumentInstitutionsPowers({
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

  factory StructureStructureDocumentInstitutionsPowers.fromJson(Map<String, dynamic> json) =>
      _$StructureStructureDocumentInstitutionsPowersFromJson(json);

  Map<String, dynamic> toJson() => _$StructureStructureDocumentInstitutionsPowersToJson(this);
}
