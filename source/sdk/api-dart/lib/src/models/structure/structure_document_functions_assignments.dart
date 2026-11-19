import 'package:json_annotation/json_annotation.dart';

part 'structure_document_functions_assignments.g.dart';

/// Structure Document Functions Assignments
@JsonSerializable(includeIfNull: false)
class StructureStructureDocumentFunctionsAssignments {
  const StructureStructureDocumentFunctionsAssignments({
    this.citationId,
    required this.id,
    this.institutionId,
    required this.share,
    this.startInstitutionId,
    this.startPositionId,
  });
  final String? citationId;
  final String id;
  final String? institutionId;
  final String share;
  final String? startInstitutionId;
  final String? startPositionId;

  factory StructureStructureDocumentFunctionsAssignments.fromJson(Map<String, dynamic> json) =>
      _$StructureStructureDocumentFunctionsAssignmentsFromJson(json);

  Map<String, dynamic> toJson() => _$StructureStructureDocumentFunctionsAssignmentsToJson(this);
}
