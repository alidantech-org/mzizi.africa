import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/structure/structure_document_functions_assignments.dart';

part 'structure_document_functions.g.dart';

/// Structure Document Functions
@JsonSerializable(includeIfNull: false)
class StructureStructureDocumentFunctions {
  const StructureStructureDocumentFunctions({required this.assignments, this.citationId, required this.code, required this.id, this.parentId});
  final List<StructureStructureDocumentFunctionsAssignments> assignments;
  final String? citationId;
  final String code;
  final String id;
  final String? parentId;

  factory StructureStructureDocumentFunctions.fromJson(Map<String, dynamic> json) => _$StructureStructureDocumentFunctionsFromJson(json);

  Map<String, dynamic> toJson() => _$StructureStructureDocumentFunctionsToJson(this);
}
