import 'package:json_annotation/json_annotation.dart';

part 'structure_document_procedures.g.dart';

/// Structure Document Procedures
@JsonSerializable(includeIfNull: false)
class StructureStructureDocumentProcedures {
  const StructureStructureDocumentProcedures({
    this.citationId,
    required this.code,
    required this.description,
    required this.id,
    required this.kind,
  });
  final String? citationId;
  final String code;
  final String description;
  final String id;
  final String kind;

  factory StructureStructureDocumentProcedures.fromJson(Map<String, dynamic> json) => _$StructureStructureDocumentProceduresFromJson(json);

  Map<String, dynamic> toJson() => _$StructureStructureDocumentProceduresToJson(this);
}
